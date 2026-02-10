# **LMS Design System: Tactile Modern**

**Version:** 1.0  
**Last Updated:** February 9, 2026

This document defines the complete visual language for the Hybrid LMS. All developers must reference this when building UI components.

---

## **1. Design Philosophy**

**Aesthetic:** Physical, tactile, high-contrast UI that feels like pressing real buttons.

**Core Principles:**

- **Dimensional:** Use hard shadows to create layered depth
- **Tactile:** Interactive elements should feel "pressable"
- **Bold:** High contrast, chunky shapes, confident typography
- **Playful-Professional:** Modern and fun, but not childish

---

## **2. Typography**

### **Font Stack**

```typescript
// In your Next.js layout or tailwind.config
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";

const endgraph = localFont({
  src: [
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Bold-BF66b31b98302f9.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Medium-BF66b31b9825275.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Regular-BF66b31b9867893.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-endgraph",
});
```

### **Usage Rules**

| Element             | Font       | Weight        | Size (Desktop)  | Size (Mobile)    |
| ------------------- | ---------- | ------------- | --------------- | ---------------- |
| **H1 - Page Title** | Endgraph   | Bold (700)    | 3.5rem (56px)   | 2.5rem (40px)    |
| **H2 - Section**    | Endgraph   | Bold (700)    | 2.25rem (36px)  | 1.875rem (30px)  |
| **H3 - Subsection** | Endgraph   | Medium (500)  | 1.5rem (24px)   | 1.25rem (20px)   |
| **H4 - Card Title** | Endgraph   | Medium (500)  | 1.125rem (18px) | 1rem (16px)      |
| **Body Large**      | Geist Sans | Regular (400) | 1.125rem (18px) | 1rem (16px)      |
| **Body**            | Geist Sans | Regular (400) | 1rem (16px)     | 0.875rem (14px)  |
| **Body Small**      | Geist Sans | Regular (400) | 0.875rem (14px) | 0.8125rem (13px) |
| **Button Text**     | Geist Sans | Bold (700)    | 1rem (16px)     | 0.9375rem (15px) |
| **Label**           | Geist Sans | Medium (500)  | 0.875rem (14px) | 0.8125rem (13px) |
| **Caption**         | Geist Sans | Regular (400) | 0.75rem (12px)  | 0.6875rem (11px) |

### **Letter Spacing**

```css
/* Headings (Endgraph) */
.heading {
  letter-spacing: -0.02em; /* Tight */
}

/* Body (Geist) */
.body {
  letter-spacing: 0; /* Normal */
}

/* All Caps Labels */
.label-caps {
  letter-spacing: 0.05em; /* Wide */
  text-transform: uppercase;
}
```

---

## **3. Color System**

### **Palette**

```typescript
// tailwind.config.ts colors
const colors = {
  // Backgrounds
  "bg-primary": "#09090B", // Deep black (zinc-950)
  "bg-secondary": "#18181B", // Card surface (zinc-900)
  "bg-tertiary": "#27272A", // Hover states (zinc-800)

  // Borders
  "border-default": "#3F3F46", // Subtle borders (zinc-700)
  "border-strong": "#52525B", // Emphasized borders (zinc-600)

  // Text
  "text-primary": "#FAFAFA", // High contrast white (zinc-50)
  "text-secondary": "#A1A1AA", // Muted text (zinc-400)
  "text-tertiary": "#71717A", // Disabled/placeholder (zinc-500)

  // Accent Colors
  "accent-blue": "#3B82F6", // Primary actions (blue-500)
  "accent-blue-dark": "#1E3A8A", // Blue shadow/hover (blue-900)
  "accent-green": "#10B981", // Success states (emerald-500)
  "accent-green-dark": "#064E3B", // Green shadow
  "accent-red": "#EF4444", // Errors/warnings (red-500)
  "accent-red-dark": "#7F1D1D", // Red shadow
  "accent-amber": "#F59E0B", // Warnings (amber-500)
  "accent-amber-dark": "#78350F", // Amber shadow
  "accent-purple": "#8B5CF6", // Special features (violet-500)
  "accent-purple-dark": "#4C1D95", // Purple shadow
};
```

### **Semantic Usage**

| Use Case        | Color           | Example                           |
| --------------- | --------------- | --------------------------------- |
| Primary Action  | `accent-blue`   | Enroll button, Submit test        |
| Destructive     | `accent-red`    | Delete account, Cancel enrollment |
| Success         | `accent-green`  | Test passed, Certificate ready    |
| Warning         | `accent-amber`  | Waitlist full, Limited seats      |
| Info/Neutral    | `bg-tertiary`   | Secondary buttons                 |
| Premium/Special | `accent-purple` | Instructor tools, Admin features  |

---

## **4. Shadows (The "Tactile" Signature)**

### **Hard Shadow System**

**DO NOT** use Tailwind's default shadows (`shadow-md`, `shadow-lg`). They are too soft.

**USE** hard offset shadows with 0 blur:

```typescript
// tailwind.config.ts
theme: {
  extend: {
    boxShadow: {
      // The Core "Sticker" Shadows (Primary/Blue)
      'hard-sm': '0 2px 0 0 #1E3A8A',
      'hard': '0 4px 0 0 #1E3A8A',
      'hard-lg': '0 6px 0 0 #1E3A8A',

      // Neutral (for white/gray elements)
      'hard-neutral': '0 4px 0 0 #52525B',
      'hard-neutral-lg': '0 6px 0 0 #52525B',

      // Success/Green
      'hard-success': '0 4px 0 0 #064E3B',

      // Error/Red
      'hard-error': '0 4px 0 0 #7F1D1D',

      // Warning/Amber
      'hard-warning': '0 4px 0 0 #78350F',

      // Inset (for pressed state)
      'hard-inset': 'inset 0 2px 0 0 rgba(0,0,0,0.2)',
    }
  }
}
```

### **Shadow Usage Patterns**

```tsx
// Resting State
className = "shadow-hard";

// Hover (shadow grows)
className = "shadow-hard hover:shadow-hard-lg";

// Active/Pressed (shadow disappears)
className = "shadow-hard active:shadow-none";
```

---

## **5. Border Radius Scale**

| Token            | Value         | Usage                            |
| ---------------- | ------------- | -------------------------------- |
| `rounded-sm`     | 0.25rem (4px) | Small badges, tags               |
| `rounded-md`     | 0.5rem (8px)  | Inputs (inner elements)          |
| `rounded-lg`     | 1rem (16px)   | Small cards                      |
| `rounded-xl`     | 1.5rem (24px) | Input fields                     |
| `rounded-2xl`    | 2rem (32px)   | Medium cards                     |
| `rounded-[2rem]` | 2rem (32px)   | Large cards, panels              |
| `rounded-full`   | 9999px        | **BUTTONS** (mandatory), avatars |

**Rule:** Interactive buttons MUST be `rounded-full` (pill shape).

---

## **6. Spacing System**

Use Tailwind's default spacing scale, but follow these conventions:

| Spacing  | Value         | Common Use             |
| -------- | ------------- | ---------------------- |
| `gap-2`  | 0.5rem (8px)  | Icon + text in buttons |
| `gap-4`  | 1rem (16px)   | Card internal padding  |
| `gap-6`  | 1.5rem (24px) | Section spacing        |
| `gap-8`  | 2rem (32px)   | Major section dividers |
| `gap-12` | 3rem (48px)   | Page sections          |

**Padding for Cards:** `p-6` (24px) for standard cards, `p-8` (32px) for hero sections.

---

## **7. Component Patterns**

### **7.1 Buttons**

#### **Primary Button (Call-to-Action)**

```tsx
<button
  className={cn(
    // Shape & Layout
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4",

    // Typography
    "text-base font-bold tracking-tight",

    // Colors
    "bg-accent-blue border-2 border-transparent text-white",

    // The Tactile Effect
    "shadow-hard transition-all duration-200",
    "hover:shadow-hard-lg hover:-translate-y-[2px]",
    "active:translate-y-[2px] active:shadow-none",

    // States
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
  )}
>
  Enroll Now
</button>
```

#### **Secondary Button (Neutral)**

```tsx
<button
  className={cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4",
    "text-base font-bold",
    "border-2 border-zinc-200 bg-white text-zinc-900",
    "shadow-hard-neutral transition-all duration-200",
    "hover:shadow-hard-neutral-lg hover:-translate-y-[2px]",
    "active:translate-y-[2px] active:shadow-none"
  )}
>
  View Details
</button>
```

#### **Destructive Button (Danger)**

```tsx
<button
  className={cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3",
    "text-sm font-bold",
    "bg-accent-red border-2 border-transparent text-white",
    "shadow-hard-error transition-all duration-200",
    "hover:-translate-y-[2px] hover:shadow-[0_6px_0_0_#7F1D1D]",
    "active:translate-y-[2px] active:shadow-none"
  )}
>
  Delete Account
</button>
```

#### **Ghost Button (Minimal)**

```tsx
<button
  className={cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3",
    "text-sm font-medium",
    "text-text-secondary border-border-default border-2",
    "transition-all duration-200",
    "hover:bg-bg-tertiary hover:text-text-primary hover:border-border-strong",
    "active:bg-bg-secondary"
  )}
>
  Cancel
</button>
```

---

### **7.2 Cards**

#### **Content Card (Standard)**

```tsx
<div
  className={cn(
    // Shape
    "rounded-[2rem] p-6",

    // Colors
    "bg-bg-secondary border-border-default border-2",

    // Depth (cards don't move, but have static shadow)
    "shadow-[0_4px_0_0_#27272A]",

    // On hover, subtle lift (optional)
    "transition-transform duration-200 hover:-translate-y-1"
  )}
>
  <h3 className="font-endgraph mb-2 text-lg font-medium">Course Title</h3>
  <p className="text-text-secondary text-sm">Description goes here</p>
</div>
```

#### **Interactive Card (Clickable)**

```tsx
<button
  className={cn(
    "w-full rounded-[2rem] p-6 text-left",
    "bg-bg-secondary border-border-default border-2",
    "shadow-[0_4px_0_0_#27272A]",

    // Clickable behavior (like a button)
    "transition-all duration-200",
    "hover:border-border-strong hover:-translate-y-[2px] hover:shadow-[0_6px_0_0_#27272A]",
    "active:translate-y-[1px] active:shadow-[0_2px_0_0_#27272A]"
  )}
>
  {/* Card content */}
</button>
```

---

### **7.3 Input Fields**

```tsx
<input
  type="text"
  className={cn(
    // Shape
    "w-full rounded-2xl px-6 py-4",

    // Border (solid, 2px)
    "border-border-default border-2",

    // Colors
    "bg-bg-tertiary text-text-primary placeholder:text-text-tertiary",

    // Focus state (bright border, no shadow)
    "focus:border-accent-blue focus:ring-accent-blue/20 focus:ring-2 focus:outline-none",

    // Transition
    "transition-all duration-200"
  )}
  placeholder="Enter your email"
/>
```

**With Label:**

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-text-secondary uppercase tracking-wider">
    Email Address
  </label>
  <input {...} />
</div>
```

---

### **7.4 Badges / Status Pills**

```tsx
// Success Badge
<span className={cn(
  "inline-flex items-center gap-1 rounded-full px-4 py-1.5",
  "bg-accent-green/10 border-2 border-accent-green/20",
  "text-accent-green text-xs font-bold uppercase tracking-wide"
)}>
  <CheckIcon className="w-3 h-3" />
  Enrolled
</span>

// Warning Badge
<span className={cn(
  "inline-flex items-center gap-1 rounded-full px-4 py-1.5",
  "bg-accent-amber/10 border-2 border-accent-amber/20",
  "text-accent-amber text-xs font-bold uppercase tracking-wide"
)}>
  Waitlist #5
</span>

// Error Badge
<span className={cn(
  "inline-flex items-center gap-1 rounded-full px-4 py-1.5",
  "bg-accent-red/10 border-2 border-accent-red/20",
  "text-accent-red text-xs font-bold uppercase tracking-wide"
)}>
  Test Failed
</span>
```

---

### **7.5 Progress Indicators**

#### **Loading Spinner (Pure CSS)**

```tsx
<div className="border-border-default border-t-accent-blue inline-block h-8 w-8 animate-spin rounded-full border-4" />
```

#### **Progress Bar**

```tsx
<div className="bg-bg-tertiary border-border-default h-3 w-full overflow-hidden rounded-full border-2">
  <div
    className="bg-accent-blue h-full rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

---

### **7.6 Modals / Dialogs**

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

  {/* Modal */}
  <div
    className={cn(
      "relative z-10 w-full max-w-md",
      "rounded-[2rem] p-8",
      "bg-bg-secondary border-border-strong border-2",
      "shadow-[0_8px_0_0_#18181B]"
    )}
  >
    <h2 className="font-endgraph mb-4 text-2xl font-bold">Confirm Enrollment</h2>
    <p className="text-text-secondary mb-6">Are you sure you want to enroll in this course?</p>

    <div className="flex gap-3">
      <Button variant="primary">Confirm</Button>
      <Button variant="ghost">Cancel</Button>
    </div>
  </div>
</div>
```

---

### **7.7 Empty States**

```tsx
<div className="flex flex-col items-center justify-center px-4 py-12 text-center">
  {/* Illustration or Icon */}
  <div className="bg-bg-tertiary mb-4 flex h-24 w-24 items-center justify-center rounded-full">
    <InboxIcon className="text-text-tertiary h-12 w-12" />
  </div>

  <h3 className="font-endgraph mb-2 text-xl font-medium">No Courses Yet</h3>
  <p className="text-text-secondary mb-6 max-w-sm">
    Browse our catalog to find courses that match your interests.
  </p>

  <Button variant="primary">Browse Catalog</Button>
</div>
```

---

## **8. Animation Guidelines**

### **Allowed Transitions (CSS Only)**

```css
/* Standard Interaction */
transition-all duration-200 ease-in-out

/* Smooth Layout Shifts */
transition-transform duration-200

/* Color Changes */
transition-colors duration-150

/* Custom Easing (for "bouncy" feel) */
ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
```

### **Forbidden**

- ❌ Framer Motion
- ❌ GSAP
- ❌ React Spring
- ❌ Auto-animate libraries

**Why:** Performance. Pure CSS is faster and doesn't add bundle size.

---

## **9. Responsive Breakpoints**

```typescript
// tailwind.config.ts
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

**Mobile-First Approach:**

```tsx
// Default styles = Mobile
// Add modifiers for larger screens
<div className="px-4 md:px-6 lg:px-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">
```

---

## **10. Accessibility Requirements**

### **Keyboard Navigation**

- All interactive elements MUST be keyboard accessible
- Focus states MUST be visible (ring-2 ring-accent-blue)
- Tab order MUST be logical

### **Color Contrast**

- Text on `bg-primary` MUST use `text-primary` (#FAFAFA)
- Never use `text-tertiary` for critical information
- Test with WCAG AAA standards (4.5:1 ratio minimum)

### **Screen Readers**

```tsx
// Buttons with icons only
<button aria-label="Close modal">
  <XIcon className="w-5 h-5" />
</button>

// Loading states
<div role="status" aria-live="polite">
  Loading courses...
</div>
```

---

## **11. Implementation Checklist**

When building a new component:

- [ ] Uses Endgraph for headings, Geist for body
- [ ] Buttons are `rounded-full` with hard shadows
- [ ] Cards are `rounded-[2rem]` or `rounded-2xl`
- [ ] All shadows use custom `shadow-hard-*` tokens
- [ ] Interactive elements have hover/active states
- [ ] Uses `transition-all duration-200` for interactions
- [ ] Colors come from the defined palette
- [ ] Mobile-responsive (test at 375px width)
- [ ] Keyboard accessible with visible focus states
- [ ] No JS animation libraries used

---

**End of Design System**
