# **PROJECT CONTEXT: Hybrid Learning Management System (LMS)**

**System Prompt for AI Assistants (Copilot, Cursor, ChatGPT, Claude)**

_Please read this document before generating ANY code. It contains strict architectural, visual, and business logic rules for this project._

---

## **📚 REQUIRED READING**

Before coding, you MUST review:

1. **This file** - Core rules and business logic
2. `Design_System.md` - Complete visual specifications (typography, colors, components)
3. `Comprehensive_LMS_PRD.md` - Full feature requirements
4. `Frontend_Architecture_Roadmap.md` - Tech stack rationale

---

## **1\. Project Overview**

This is a **Hybrid LMS** designed to manage physical training programs with strict digital gatekeeping.

- **Core USP:** Students CANNOT enroll in a course unless they pass a prerequisite test.
- **Users:** Admin (Web), Student (Mobile/Web), Instructor (Mobile/Offline-First).
- **Key Workflow:** Test \-\> Pass \-\> Enroll (Waitlist Logic) \-\> QR Code \-\> Offline Scan \-\> Certificate.

## **2\. Tech Stack (Strict)**

- **Framework:** Next.js 14+ (App Router).
- **Language:** TypeScript (Strict).
- **Styling:** Tailwind CSS \+ Shadcn/UI (Heavily Customized).
  - **Why Shadcn:** We own the code (copy-paste components), allowing full customization of our tactile aesthetic. Not using Daisy UI due to theme constraints.
- **State:** TanStack Query v5 (Server), Zustand (Client).
- **NO ANIMATION LIBRARIES:** Do NOT use Framer Motion or GSAP. Use pure CSS transitions for all interactions.
- **Deployment:** All interfaces are web-based. No native mobile apps. Instructor offline mode uses PWA.

## **3\. Visual Design System: "Tactile Modern" (MANDATORY)**

**⚠️ FULL SPEC:** See `Design_System.md` for complete component patterns, shadows, and tokens.

**Core Aesthetic:** Physical, pill-shaped, dimensional UI with hard shadows. Think "tactile stickers" or "3D buttons".

### **Quick Reference (See Design_System.md for details)**

**Typography:**

- **Headers:** TBJ Endgraph Mini (Bold/Medium) - Local font in `/public/fonts/tbj-endgraph-font-family/`
- **Body:** Geist Sans (next/font) - Use Next.js 14+ built-in
- **Button Text:** Geist Sans Bold, 16px, tight tracking

**Shapes (Non-Negotiable):**

- **Buttons:** `rounded-full` (pill shape) - MANDATORY for all action buttons
- **Cards:** `rounded-[2rem]` (32px) or `rounded-2xl` (24px)
- **Inputs:** `rounded-2xl` with `border-2`

**The "Tactile" Effect (Hard Shadows):**

- ❌ **NEVER** use `shadow-md`, `shadow-lg`, or blur-based shadows
- ✅ **ALWFile Structure & Organization**

````
app/
├── (auth)/                   # Route group for auth pages
│   ├── login/
│   └── register/
├── (student)/                # Student portal
│   ├── dashboard/
│   ├── courses/
│   └── certificates/
├── (instructor)/             # Instructor portal (Offline PWA)
│   ├── scan/
│   └── cohorts/
├── (admin)/                  # Admin dashboard
│   └── manage/
├── api/                      # API routes
│   └── trpc/                 # tRPC endpoints (if used)
├── layout.tsx
└── page.tsx

components/
├── ui/                       # Shadcn components (customized)
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
├── course/                   # Feature-specific components
│   ├── course-card.tsx
│   └── enrollment-button.tsx
└── shared/                   #  (MUST IMPLEMENT)**

### **A. Enrollment Flow**

```typescript
// Conditional logic for enrollment button
const EnrollButton = ({ course, userStatus }: Props) => {
  const canEnroll = userStatus.prerequisiteTestStatus === 'passed';
  const isFull = course.enrolled >= course.capacity;
  const isWaitlistFull = course.waitlisted >= course.waitlistCap;

  if (!canEnroll) {
    return (
      <Button disabled>
        <LockIcon /> Complete Prerequisite Test First
      </Button>
    );
  }

  if (isFull && !isWaitlistFull) {
    return (
      <Button onClick={joinWaitlist}>
        Join Waitlist (#{course.waitlisted + 1})
      </Button>
    );
  }

  if (isFull && isWaitlistFull) {
    return (
      <Button disabled>
        Waitlist Full
      </Button>
    );
  }

  return (
    <Button onClick={enroll}>
      Enroll Now ({course.capacity - course.enrolled} seats left)
    </Button>
  );
};
````

### **B. Test Failure → Module 0 Remediation**

```typescript
// After test submission
if (testResult.score < testResult.passingScore) {
  // Analyze failed questions by topic tags
  const failedTopics = testResult.incorrectQuestions
    .map(q => q.topicTag)
    .filter(unique);

  // Show smart remediation
  return (
    <div className="...">
      <h3>Test Failed ({testResult.score}/{testResult.passingScore})</h3>
      <p>Review these topics in Module 0:</p>
      <ul>
        {failedTopics.map(topic => (
          <li key={topic}>
            <a href={`/module-0?topic=${topic}`}>
              {topic}
            </a>
          </li>
        ))}
      </ul>
      <Button>Retake Test (Attempt {testResult.attemptNumber + 1}/3)</Button>
    </div>
  );
}
```

### **C. QR Code Security (Instructor Scanning)**

```typescript
// Generate QR Code (server-side)
import crypto from "crypto";

function generateEntryQR(enrollmentId: string, courseDate: Date) {
  const payload = {
    enrollmentId,
    courseDate: courseDate.toISOString(),
    expiresAt: addHours(courseDate, 24).toISOString(), // Valid 24h before/after
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  // Sign with HMAC
  const secret = process.env.QR_SECRET!;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");

  return JSON.stringify({ ...payload, signature });
}

// Validate QR Code (instructor app)
function validateQR(qrData: string): boolean {
  try {
    const data = JSON.parse(qrData);
    const { signature, ...payload } = data;

    // Verify signature
    const expectedSig = crypto
      .createHmac("sha256", process.env.QR_SECRET!)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (signature !== expectedSig) return false;

    // Check expiration
    if (new Date() > new Date(data.expiresAt)) return false;

    return true;
  } catch {
    return false;
  }
}
```

### **D. Test Integrity (Anti-Cheating)**

```typescript
'use client';

export function TestEngine({ questions }: Props) {
  const [tabSwitches, setTabSwitches] = useState(0);

  useEffect(() => {
    // Randomize question order
    setQuestions(shuffle(questions));

    // Detect tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);

        // Log to server
        api.logTestEvent({
          type: 'TAB_SWITCH',
          timestamp: new Date(),
        });

        // Show warning
        toast.warning('Tab switching detected and logged');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Prevent copy-paste
  const handleCopy = (e: ClipboardEvent) => e.preventDefault();

  return (
    <div onCopy={handleCopy} onPaste={handleCopy}>
      {/* Test UI */}
      {tabSwitches > 0 && (
        <div className="bg-accent-red/10 border-2 border-accent-red p-4 rounded-2xl mb-4">
          ⚠️ Warning: {tabSwitches} tab switch(es) detected and logged
        </div>
      )}
    </div>
  );
}
```

### **E. Async Certificate Generation**

````typescript
// DON'T: Synchronous blocking
const handleComplete = async () => {
  const cert = await generatePDF(studentData); // ❌ Blocks for 5+ seconds
  downloadCert(cert);
};

// DO: Async with polling
const handleComplete = async () => {
  // Queue the job
  const { jobId } = await api.queueCertificate(studentData);

  // Poll for completion
  const pollCert = setInterval(async () => {
    const status = await api.getCertificateStatus(jobId);

    if (status === 'completed') {
      clearInterval(pollCert);
      toast.success('Certificate ready!');
      // Show download button
    } else if (status === 'failed') {
      clePerformance & Optimization**

### **Image Optimization**
```tsx
// Always use next/image
import Image from 'next/image';

<Image
  src="/course-thumbnail.jpg"
  alt="Course title"
  width={400}
  height={300}
  className="rounded-2xl"
  priority={false} // Only true for above-fold images
/>
````

### **Bundle Size**

- Avoid default imports from large libraries
- Use tree-shakeable imports: `import { format } from 'date-fns/format'`
- Lazy load heavy components: `const Chart = dynamic(() => import('./chart'))`

### **PWA Offline Strategy**

```typescript
// Service Worker caching strategy (Serwist config)
{
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.example\.com\/courses/,
      handler: 'NetworkFirst', // Try network, fall back to cache
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\.example\.com\/attendance/,
      handler: 'CacheFirst', // For instructor offline mode
      options: {
        cacheName: 'attendance-cache',
        plugins: [backgroundSyncPlugin],
      },
    },
  ],
}
```

---

## **7\. Testing Guidelines**

```typescript
// Component tests (Vitest + Testing Library)
import { render, screen } from '@testing-library/react';
import { EnrollButton } from './enroll-button';

describe('EnrollButton', () => {
  it('disables when prerequisite not passed', () => {
    render(<EnrollButton hasPassedPrereq={false} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows waitlist when course full', () => {
    render(<EnrollButton enrolled={30} capacity={30} />);
    expect(screen.getByText(/join waitlist/i)).toBeInTheDocument();
  });
});
```

---

## **8\. Common Pitfalls to Avoid**

❌ **DON'T:**

- Use default Tailwind shadows (`shadow-md`)
- Mix Server and Client Component logic without `'use client'`
- Fetch data in Client Components (use Server Components or TanStack Query)
- Use `rounded-lg` for buttons (must be `rounded-full`)
- Block UI with synchronous PDF generation
- Allow enrollment without prerequisite check
- Use `any` type in TypeScript

✅ **DO:**

- Use hard shadows from the design system
- Keep Server Components for data fetching
- Mark interactive components as Client Components
- Use `rounded-full` for all buttons
- Queue async jobs for heavy operations
- Validate prerequisites on both frontend and backend
- Define proper TypeScript interfaces

---

## **9\. Deployment Checklist**

Before pushing to production:

- [ ] All hard-coded API URLs replaced with env variables
- [ ] QR_SECRET configured in environment
- [ ] CSP headers configured in `next.config.ts`
- [ ] PWA manifest and icons generated
- [ ] Service Worker tested with `npm run build && npm start`
- [ ] Lighthouse score > 90 (Performance, Accessibility)
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] No console.log statements in production code
- [ ] Database migrations tested
- [ ] Background job queue configured (BullMQ/Agenda)

---

## **10\. Quick Reference Component Examples**

See `Design_System.md` for full component library.

**Primary Button:**

```tsx
<button className="bg-accent-blue inline-flex items-center justify-center gap-2 rounded-full border-2 border-transparent px-8 py-4 font-bold text-white shadow-[0_4px_0_0_#1E3A8A] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_6px_0_0_#1E3A8A] active:translate-y-[2px] active:shadow-none">
  Enroll Now
</button>
```

**Card:**

```tsx
<div className="bg-bg-secondary border-border-default rounded-[2rem] border-2 p-6 shadow-[0_4px_0_0_#27272A]">
  {/* Content */}
</div>
```

**Input:**

```tsx
<input className="border-border-default bg-bg-tertiary text-text-primary placeholder:text-text-tertiary focus:border-accent-blue focus:ring-accent-blue/20 w-full rounded-2xl border-2 px-6 py-4 transition-all duration-200 focus:ring-2 focus:outline-none" />
```

---

\*\*End of Instructions - Happy Coding! 🚀

    // Queue notification (don't block)
    await queueJob('send-enrollment-email', nextPerson.studentId);

});
}

```
└── api/                      # API client logic
    └── queries/              # TanStack Query hooks
        ├── use-courses.ts
        └── use-enrollment.ts
```

### **B. TypeScript Standards (STRICT MODE)**

```typescript
// tsconfig.json must have:
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}

// Always define interfaces for props
interface CourseCardProps {
  courseId: string;
  title: string;
  capacity: number;
  enrolled: number;
  hasPassedPrereq: boolean;
}

// Use type-safe API responses
type APIResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

### **C. CSS Interaction Patterns (Pure CSS)**

**NO JavaScript animation libraries.** Use Tailwind transitions only:

```tsx
// Interactive Button Pattern
className={cn(
  // Base
  "transition-all duration-200 ease-in-out",
  "shadow-[0_4px_0_0_#1E3A8A]",

  // Hover: Lift up, shadow grows
  "hover:-translate-y-[2px] hover:shadow-[0_6px_0_0_#1E3A8A]",

  // Active: Press down, shadow disappears
  "active:translate-y-[2px] active:shadow-none"
)}

// Interactive Card (clickable)
className={cn(
  "transition-all duration-200",
  "shadow-[0_4px_0_0_#27272A]",
  "hover:-translate-y-1 hover:shadow-[0_6px_0_0_#27272A]",
  "active:translate-y-0 active:shadow-[0_2px_0_0_#27272A]"
)}
```

### **D. Data Fetching (TanStack Query v5)**

**Query Key Convention:**

```typescript
// Use array keys with entity/id structure
const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: string) => [...courseKeys.lists(), { filters }] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

// Usage
useQuery({
  queryKey: courseKeys.detail(courseId),
  queryFn: () => fetchCourse(courseId),
});
```

**Optimistic Updates (for Instructor Offline):**

```typescript
const scanAttendance = useMutation({
  mutationFn: (qrData: string) => api.markAttendance(qrData),

  // Optimistic update
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: ["attendance"] });
    const previous = queryClient.getQueryData(["attendance"]);

    queryClient.setQueryData(["attendance"], (old) => {
      // Update with optimistic data
      return [...old, newData];
    });

    return { previous };
  },

  // Rollback on error
  onError: (err, newData, context) => {
    queryClient.setQueryData(["attendance"], context.previous);
  },
});
```

### **E. State Management (Zustand)**

**Only for UI state, NOT server data:**

```typescript
// lib/stores/ui-store.ts
import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentTestQuestion: number;
  setTestQuestion: (q: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  currentTestQuestion: 0,
  setTestQuestion: (q) => set({ currentTestQuestion: q }),
}));
```

### **F. Component Patterns**

**Use Server Components by default:**

```tsx
// app/courses/page.tsx (Server Component)
export default async function CoursesPage() {
  const courses = await db.course.findMany(); // Direct DB access

  return (
    <div>
      <CourseList courses={courses} /> {/* Client Component for interactivity */}
    </div>
  );
}
```

**Mark Client Components explicitly:**

```tsx
// components/course/enrollment-button.tsx
'use client';

import { useMutation } from '@tanstack/react-query';

export function EnrollmentButton({ courseId }: Props) {
  const enroll = useMutation(...);
  // Interactive logic here
}
```

````

## **4\. Coding Standards**

### **A. CSS Interaction Patterns**

Since we are not using JS animation libraries, you must use these Tailwind classes for interactive elements (Buttons, Cards):

* **Base State:** transition-all duration-200 ease-in-out
* **Hover State:** hover:-translate-y-1 hover:shadow-\[0\_6px\_0\_0\_\#000\] (Lift up, shadow grows)
* **Active State:** active:translate-y-0 active:shadow-none (Press down, shadow disappears)

### **B. Data Fetching (TanStack Query)**

* **Keys:** Strict array keys: \['courses', courseId\].
* **Offline:** Implement onMutate optimistic updates for instructor actions.

## **5\. Critical Business Logic**

1. **Waitlist Logic:** If current\_enrollment \>= capacity, the button must say "Join Waitlist".
   * Backend must use atomic database operations to prevent race conditions.
2. **Prerequisite Gate:** The "Enroll" button is **DISABLED** if prerequisite_test_status !== 'passed'.
3. **Module 0:** If a student fails a test, the UI must explicitly recommend "Module 0" with a link.
4. **QR Code Security:** Entry QR codes must include timestamp, HMAC signature, and nonce. Validate before marking attendance.
5. **Test Integrity:** Implement tab-switching detection (document visibility API) and show warnings to users.
6. **Async Certificate Generation:** Show "Generating Certificate..." state. Poll status endpoint, do NOT block UI.

## **6. Design Anti-Patterns (NEVER DO THIS)**

These patterns are explicitly banned from the codebase:

### A. No Badges Before Headers
❌ **NEVER** place a `<Badge>` component directly above a section heading as a "label". This is a generic AI pattern and looks unnatural.
✅ Use a plain `<p className="text-sm font-semibold uppercase tracking-widest text-accent-blue">` if you need a section label above a heading.

### B. No Dividers in Cards
❌ **NEVER** use `<Separator />` or `border-t` dividers inside Card components.
❌ No `border-t` on `<CardFooter>` either.
✅ Use spacing (`space-y-*`, `gap-*`, padding) to create visual separation inside cards.
✅ `DropdownMenuSeparator` inside dropdown menus is fine.

### C. Back Navigation Buttons Must Be Plain Links
❌ **NEVER** use `<Button variant="ghost">` or `<Button variant="secondary">` for "Back to X" navigation.
✅ Use a plain styled `<Link>`:
```tsx
<Link href="/target" className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
  <ArrowLeft size={16} />
  Back to Whatever
</Link>
````

### D. Card Overflow Protection

✅ Badge containers with multiple badges must always include `flex-wrap`.  
✅ Long text in cards must use `truncate` or `line-clamp-N`.  
✅ Icon containers must use `shrink-0` to prevent icon compression.

### E. Accessibility Requirements

✅ All icon-only buttons MUST have `aria-label`.  
✅ All loading spinners MUST be wrapped with `role="status"` and `aria-label`.  
✅ All modals MUST have `role="dialog"`, `aria-modal="true"`, `aria-label`, Escape key handler, and click-outside-to-close.  
✅ All form inputs MUST have associated `<Label htmlFor>` or `aria-label`.

## **7. TRD Context (University of Ibadan)**

This LMS is built for **TRD (Training Research & Development)**, a unit of **ITeMS (Information Technology and Media Services)** at the **University of Ibadan**, Nigeria.

- **Mock Data:** Must reflect Nigerian names, University of Ibadan departments/faculties, Nigerian phone numbers (+234), .ui.edu.ng email domains.
- **Course Titles:** Must be realistic training programmes (ICT skills, research methods, laboratory safety, data analysis, etc.) — NOT generic industrial/factory safety courses.
- **Venues:** University of Ibadan campus buildings (ITeMS Building, CBN Building, Faculty of Technology, etc.).
- **Organizations:** University of Ibadan, ITeMS, College of Medicine, faculties, Oyo State, UI Teaching Hospital.
- **Certificate Numbers:** Use `TRD-YYYY-NNNNN` prefix.
- **Verification URLs:** Use `trd.ui.edu.ng/verify/...`.

## **8\. Example UI Component (Reference)**

// Example of the "Tactile" Button Style  
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes\<HTMLButtonElement\> {  
 variant?: "primary" | "secondary";  
}

export const TactileButton \= ({ className, variant \= "primary", ...props }: ButtonProps) \=\> {  
 return (  
 \<button  
 className={cn(  
 // Layout & Shape  
 "inline-flex items-center justify-center rounded-full px-8 py-4 font-bold tracking-tight",  
 // Transitions (The "Press" feel)  
 "transition-all duration-200 ease-\[cubic-bezier(0.25,0.46,0.45,0.94)\]",  
 // Base Transform & Shadow (Depth)  
 "border-2 border-transparent hover:-translate-y-\[2px\]",

        // Variants
        variant \=== "primary" && \[
            "bg-\[\#3B82F6\] text-white",
            // The Hard Shadow (The "Sticker" look)
            "shadow-\[0\_4px\_0\_0\_\#1E3A8A\] hover:shadow-\[0\_6px\_0\_0\_\#1E3A8A\]",
            // The "Click" \- collapse shadow and move down
            "active:translate-y-\[2px\] active:shadow-\[0\_0px\_0\_0\_\#1E3A8A\]"
        \],

        variant \=== "secondary" && \[
            "bg-white text-black border-zinc-200",
            "shadow-\[0\_4px\_0\_0\_\#a1a1aa\] hover:shadow-\[0\_6px\_0\_0\_\#a1a1aa\]",
            "active:translate-y-\[2px\] active:shadow-none"
        \],
        className
      )}
      {...props}
    /\>

);  
};

**End of Instructions.**
