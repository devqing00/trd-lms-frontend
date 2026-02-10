import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  GraduationCap,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Users,
  CheckCircle2,
  Clock,
  Award,
  Monitor,
  FlaskConical,
  HeartPulse,
  Briefcase,
  BarChart3,
  Settings,
  Play,
  Star,
  Zap,
  Globe,
  Phone,
  BrainCircuit,
  Shield,
  Megaphone,
  CalendarDays,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LandingNav } from "@/components/landing-nav";
import { cn } from "@/lib/utils";
import {
  APPLICATION_FORM_FEE,
  ENROLLMENT_POLICY,
  CONTACT_PHONES,
  AVAILABLE_FACILITIES,
  SPECIAL_CLASS_MIN_STUDENTS,
  SPECIAL_CLASS_MAX_STUDENTS,
} from "@/lib/types";

/** Format Naira */
function formatNaira(amount: number): string {
  return `\u20A6${amount.toLocaleString()}`;
}

/* ─── Category Data ─── */
const categories = [
  {
    icon: Monitor,
    label: "ICT & Digital Skills",
    color: "bg-blue-500/15 text-blue-500",
    count: "15+ Courses",
    desc: "From digital literacy to cybersecurity — master essential tech competencies.",
  },
  {
    icon: BarChart3,
    label: "Data & Analytics",
    color: "bg-cyan-500/15 text-cyan-500",
    count: "8+ Courses",
    desc: "Data analysis, data science, SPSS, Power BI, and spatial analysis.",
  },
  {
    icon: BrainCircuit,
    label: "AI & Emerging Tech",
    color: "bg-violet-500/15 text-violet-500",
    count: "2 Courses",
  },
  {
    icon: Shield,
    label: "Cybersecurity",
    color: "bg-rose-500/15 text-rose-500",
    count: "1 Course",
  },
  {
    icon: FlaskConical,
    label: "Research Methods",
    color: "bg-purple-500/15 text-purple-500",
    count: "4 Courses",
  },
  {
    icon: Megaphone,
    label: "Digital Marketing",
    color: "bg-orange-500/15 text-orange-500",
    count: "1 Course",
  },
  {
    icon: Briefcase,
    label: "Professional Dev",
    color: "bg-amber-500/15 text-amber-500",
    count: "6+ Courses",
    desc: "Graphics, publishing, presentations, and professional communication.",
  },
  {
    icon: HeartPulse,
    label: "Health & Safety",
    color: "bg-emerald-500/15 text-emerald-500",
    count: "4 Courses",
  },
];

/* ─── Step Data ─── */
const steps = [
  {
    step: "01",
    icon: BookOpen,
    title: "Take Prerequisite Test",
    description: "Prove your digital competency before securing a physical training seat.",
    accent: "border-accent-blue/30 bg-accent-blue/5",
    iconColor: "text-accent-blue bg-accent-blue/10",
  },
  {
    step: "02",
    icon: CheckCircle2,
    title: "Pass & Enroll",
    description:
      "Meet the passing score to unlock enrollment. Join the waitlist if the session is full.",
    accent: "border-accent-green/30 bg-accent-green/5",
    iconColor: "text-accent-green bg-accent-green/10",
  },
  {
    step: "03",
    icon: QrCode,
    title: "Attend with QR Code",
    description:
      "Your unique, cryptographically signed QR code is your entry pass — works offline.",
    accent: "border-accent-purple/30 bg-accent-purple/5",
    iconColor: "text-accent-purple bg-accent-purple/10",
  },
  {
    step: "04",
    icon: Award,
    title: "Get Certified",
    description: "Complete the program, pass the final exam, and receive a verifiable certificate.",
    accent: "border-accent-amber/30 bg-accent-amber/5",
    iconColor: "text-accent-amber bg-accent-amber/10",
  },
];

/* ─── Feature Data ─── */
const features = [
  {
    icon: ShieldCheck,
    title: "Prerequisite Gating",
    description:
      "No student takes a physical seat without proving digital competence first. Our gating system ensures only prepared learners secure enrollment.",
    accent: "border-accent-blue/30 bg-accent-blue/5",
    iconColor: "text-accent-blue bg-accent-blue/10",
  },
  {
    icon: Users,
    title: "Smart Waitlists",
    description: "Automated capacity management with fair, FIFO waitlist promotion.",
    accent: "border-accent-purple/30 bg-accent-purple/5",
    iconColor: "text-accent-purple bg-accent-purple/10",
  },
  {
    icon: QrCode,
    title: "Offline QR Attendance",
    description: "Instructors scan signed QR codes even without internet. Syncs when online.",
    accent: "border-accent-green/30 bg-accent-green/5",
    iconColor: "text-accent-green bg-accent-green/10",
  },
  {
    icon: Clock,
    title: "Smart Remediation",
    description: "Failed a test? Get targeted recommendations from Module 0, not generic feedback.",
    accent: "border-accent-amber/30 bg-accent-amber/5",
    iconColor: "text-accent-amber bg-accent-amber/10",
  },
  {
    icon: Award,
    title: "Verifiable Certificates",
    description: "Every certificate has a public verification URL for employers and auditors.",
    accent: "border-accent-green/30 bg-accent-green/5",
    iconColor: "text-accent-green bg-accent-green/10",
  },
  {
    icon: BookOpen,
    title: "Content Management",
    description:
      "Upload PDFs, videos, and slides. Structure courses into modular learning paths with assessments at every stage of the journey.",
    accent: "border-accent-blue/30 bg-accent-blue/5",
    iconColor: "text-accent-blue bg-accent-blue/10",
  },
];

/* ─── Testimonial Data ─── */
const testimonials = [
  {
    name: "Dr. Adebayo Ogunleye",
    role: "Director of ITeMS, University of Ibadan",
    quote:
      "TRD LMS revolutionized how we manage ICT training across the entire university. The prerequisite gating alone saved us hundreds of hours in seat allocation and reduced no-shows by 60%.",
    avatar: "AO",
  },
  {
    name: "Funmilayo Adeyemi",
    role: "Research Coordinator",
    quote:
      "The hybrid approach is perfect — students come prepared for hands-on sessions because they've already proven their competency online.",
    avatar: "FA",
  },
  {
    name: "Chukwuemeka Nwosu",
    role: "Health & Safety Trainer",
    quote:
      "QR attendance scanning works even in our lab rooms with poor connectivity. The verification system gives our certificates real credibility.",
    avatar: "CN",
  },
];

export default function Home() {
  return (
    <div className="bg-bg-primary min-h-screen">
      <LandingNav />

      <main>
        {/* ═══════════════════════════════════════════
            HERO — Bento Grid Layout
            ═══════════════════════════════════════════ */}
        <section className="px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16 lg:px-8 lg:pt-16 lg:pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3">
              {/* ── Main Hero Cell (big left, spans 2 cols × 3 rows) ── */}
              <div className="rounded-card border-border-default bg-bg-secondary shadow-hard-card flex flex-col justify-center border-2 p-8 md:col-span-2 lg:col-span-2 lg:row-span-3 lg:p-12">
                <h1 className="font-display text-text-primary text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Grow Your Skills. <span className="text-accent-blue">Advance Your Career.</span>
                </h1>

                <p className="text-text-secondary mt-6 max-w-xl text-lg leading-relaxed">
                  The hybrid learning platform that bridges digital competency with physical
                  training. Pass prerequisites online, secure your seat, attend in person, and earn
                  verifiable certificates.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row lg:flex-col xl:flex-row">
                  <Link href="/courses">
                    <Button variant="primary" size="xl">
                      <BookOpen className="h-5 w-5" />
                      Browse Courses
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button variant="secondary" size="xl">
                      <Play className="h-4 w-4" />
                      How It Works
                    </Button>
                  </a>
                </div>

                {/* Social proof */}
                <div className="mt-10 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500"].map(
                      (bg, i) => (
                        <div
                          key={i}
                          className={`border-bg-secondary flex h-10 w-10 items-center justify-center rounded-full border-2 ${bg} text-xs font-bold text-white`}
                        >
                          {["AO", "FA", "CN", "EI"][i]}
                        </div>
                      )
                    )}
                    <div className="border-bg-secondary bg-bg-tertiary text-text-tertiary flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold">
                      +9k
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-text-tertiary text-xs">Rated 4.9 by learners</p>
                  </div>
                </div>
              </div>

              {/* ── Stat: Active Learners ── */}
              <div className="rounded-card border-border-default bg-bg-secondary shadow-hard-card flex flex-col justify-between border-2 p-6">
                <div className="bg-accent-blue/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Users className="text-accent-blue h-6 w-6" />
                </div>
                <div className="mt-6">
                  <p className="font-display text-text-primary text-3xl font-bold tracking-tight">
                    10K+
                  </p>
                  <p className="text-text-tertiary mt-1 text-sm">Active Learners</p>
                </div>
              </div>

              {/* ── Stat: Courses (accent) ── */}
              <div className="rounded-card border-accent-blue/30 bg-accent-blue/5 shadow-hard flex flex-col justify-between border-2 p-6">
                <div className="bg-accent-blue/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <BookOpen className="text-accent-blue h-6 w-6" />
                </div>
                <div className="mt-6">
                  <p className="font-display text-text-primary text-3xl font-bold tracking-tight">
                    40+
                  </p>
                  <p className="text-accent-blue mt-1 text-sm">Courses Available</p>
                </div>
              </div>

              {/* ── QR Feature Card (wide, spans 2 cols) ── */}
              <div className="rounded-card border-accent-green/30 bg-accent-green/5 shadow-hard-success flex items-center gap-5 border-2 p-6 md:col-span-2 lg:col-span-2">
                <div className="border-accent-green/30 bg-bg-secondary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2">
                  <QrCode className="text-accent-green h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-text-primary text-lg font-bold">
                    Offline QR Attendance
                  </p>
                  <p className="text-text-secondary mt-1 text-sm">
                    Cryptographically signed QR codes work without internet. Syncs automatically
                    when back online.
                  </p>
                </div>
                <Badge variant="success" className="ml-auto hidden shrink-0 sm:flex">
                  Offline-Ready
                </Badge>
              </div>

              {/* ── Stat: Verification Rate (green accent) ── */}
              <div className="rounded-card border-accent-green/30 bg-accent-green/5 shadow-hard-success flex flex-col justify-between border-2 p-6">
                <div className="bg-accent-green/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <ShieldCheck className="text-accent-green h-6 w-6" />
                </div>
                <div className="mt-6">
                  <p className="font-display text-text-primary text-3xl font-bold tracking-tight">
                    99.9%
                  </p>
                  <p className="text-accent-green mt-1 text-sm">Verification Rate</p>
                </div>
              </div>

              {/* ── Stat: Departments ── */}
              <div className="rounded-card border-border-default bg-bg-secondary shadow-hard-card flex flex-col justify-between border-2 p-6">
                <div className="bg-accent-purple/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Globe className="text-accent-purple h-6 w-6" />
                </div>
                <div className="mt-6">
                  <p className="font-display text-text-primary text-3xl font-bold tracking-tight">
                    50+
                  </p>
                  <p className="text-text-tertiary mt-1 text-sm">Departments</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CATEGORIES — Bento Grid with featured cards
            ═══════════════════════════════════════════ */}
        <section
          id="categories"
          className="border-border-default border-t-2 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center text-center">
              <Badge variant="info" className="mb-4">
                <BookOpen className="mr-1 h-3 w-3" />
                Training Categories
              </Badge>
              <h2 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Explore Our Course Categories
              </h2>
              <p className="text-text-secondary mt-3 max-w-2xl">
                From ICT skills to research methods, find the right training program for your
                professional growth.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {categories.map((cat, i) => {
                const isFeatured = i === 0;
                const isWide = i === 6;
                return (
                  <Link
                    key={cat.label}
                    href="/courses"
                    className={cn(
                      "group rounded-card border-border-default bg-bg-secondary shadow-hard-card hover:border-accent-blue hover:shadow-hard flex gap-4 border-2 p-6 transition-all duration-200 hover:-translate-y-1",
                      isFeatured && "flex-col items-start lg:col-span-2 lg:row-span-2 lg:p-8",
                      !isFeatured && "items-center",
                      isWide && "lg:col-span-2"
                    )}
                  >
                    <div
                      className={cn(
                        "flex shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110",
                        cat.color,
                        isFeatured ? "h-16 w-16" : "h-12 w-12"
                      )}
                    >
                      <cat.icon className={isFeatured ? "h-8 w-8" : "h-6 w-6"} />
                    </div>
                    <div>
                      <h3
                        className={cn(
                          "text-text-primary font-semibold",
                          isFeatured ? "font-display text-xl" : "text-sm"
                        )}
                      >
                        {cat.label}
                      </h3>
                      <p
                        className={cn(
                          isFeatured
                            ? "text-text-secondary mt-1 text-sm"
                            : "text-text-tertiary mt-0.5 text-xs"
                        )}
                      >
                        {cat.count}
                      </p>
                      {cat.desc && (
                        <p className="text-text-secondary mt-3 text-sm leading-relaxed">
                          {cat.desc}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Link href="/courses">
                <Button variant="secondary" size="lg">
                  View All Courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            ABOUT TRD — Split layout with checklist
            ═══════════════════════════════════════════ */}
        <section
          id="about"
          className="border-border-default bg-bg-secondary border-t-2 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left — Auto-Flipping Card */}
              <div className="group relative [perspective:1200px]">
                <div className="animate-flip-card relative aspect-4/3 [transform-style:preserve-3d]">
                  {/* FRONT — Building image */}
                  <div className="rounded-card border-border-default shadow-hard-card-lg absolute inset-0 overflow-hidden border-2 [backface-visibility:hidden]">
                    <Image
                      src="/images/trd-overview.png"
                      alt="TRD Training Center — University of Ibadan"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  {/* BACK — Branding + Info */}
                  <div className="rounded-card border-accent-blue/30 bg-bg-secondary shadow-hard-card-lg absolute inset-0 flex [transform:rotateY(180deg)] flex-col items-center justify-center overflow-hidden border-2 p-8 [backface-visibility:hidden]">
                    <div className="bg-accent-blue/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                      <GraduationCap className="text-accent-blue h-10 w-10" />
                    </div>
                    <p className="font-display text-text-primary text-3xl font-bold">TRD</p>
                    <p className="text-text-secondary mt-1 text-sm font-medium">
                      Training, Research &amp; Development
                    </p>
                    <p className="text-text-tertiary mt-1 text-xs">
                      ITeMS &bull; University of Ibadan
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      <span className="bg-accent-blue/10 text-accent-blue rounded-full px-3 py-1 text-xs font-medium">
                        ICT Training
                      </span>
                      <span className="bg-accent-green/10 text-accent-green rounded-full px-3 py-1 text-xs font-medium">
                        Research
                      </span>
                      <span className="bg-accent-purple/10 text-accent-purple rounded-full px-3 py-1 text-xs font-medium">
                        Development
                      </span>
                    </div>
                  </div>
                </div>
                {/* Floating accent */}
                <div className="border-border-default bg-accent-blue shadow-hard absolute -right-4 -bottom-4 flex h-10 w-10 items-center justify-center rounded-2xl border-2 md:h-20 md:w-20">
                  <Award className="h-6 w-6 text-white md:h-8 md:w-8" />
                </div>
              </div>

              {/* Right — Text + Checklist */}
              <div>
                <h2 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  Bridging Digital Competency with Physical Training
                </h2>
                <p className="text-text-secondary mt-4 leading-relaxed">
                  TRD LMS is the official hybrid learning platform for the Training, Research &amp;
                  Development unit at ITeMS, University of Ibadan. We combine online prerequisite
                  testing with in-person training to ensure every participant is prepared, every
                  seat is earned, and every certificate is verifiable.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "Prerequisite gating before enrollment",
                    "Secure offline QR code attendance",
                    "Verifiable digital certificates",
                    "Smart waitlist management",
                    "Module-based learning paths",
                    "Real-time analytics dashboard",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="bg-accent-green/15 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                        <CheckCircle2 className="text-accent-green h-3.5 w-3.5" />
                      </div>
                      <span className="text-text-primary text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link href="/register">
                    <Button variant="primary" size="lg">
                      Get Started Today
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            HOW IT WORKS — Staggered 4-step cards
            ═══════════════════════════════════════════ */}
        <section
          id="how-it-works"
          className="border-border-default border-t-2 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center text-center">
              <Badge variant="warning" className="mb-4">
                <Zap className="mr-1 h-3 w-3" />
                Simple Process
              </Badge>
              <h2 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                From Test to Certificate in 4 Steps
              </h2>
              <p className="text-text-secondary mt-3 max-w-2xl">
                Our streamlined process ensures every learner is prepared, enrolled fairly, and
                certified with confidence.
              </p>
            </div>

            {/* Staggered cards — odd items offset down on desktop */}
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((item, i) => (
                <div
                  key={item.step}
                  className={cn(
                    "rounded-card relative overflow-hidden border-2 p-6",
                    item.accent,
                    "shadow-hard-card hover:shadow-hard transition-all duration-200 hover:-translate-y-1",
                    i % 2 === 1 && "lg:mt-12"
                  )}
                >
                  {/* Large step number watermark */}
                  <span className="font-display text-border-default/40 absolute -top-4 -right-2 text-[5rem] leading-none font-bold">
                    {item.step}
                  </span>

                  <div className="relative">
                    <div
                      className={cn(
                        "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl",
                        item.iconColor
                      )}
                    >
                      <item.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-text-primary text-lg font-bold">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FEATURES — Bento with varied spans
            ═══════════════════════════════════════════ */}
        <section
          id="features"
          className="border-border-default bg-bg-secondary border-t-2 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center text-center">
              <Badge variant="purple" className="mb-4">
                <Settings className="mr-1 h-3 w-3" />
                Platform Features
              </Badge>
              <h2 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Built for Physical Training Programs
              </h2>
              <p className="text-text-secondary mt-3 max-w-2xl">
                Purpose-built tools for hybrid programs that combine online assessments with
                in-person training.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className={cn(
                    "rounded-card shadow-hard-card hover:shadow-hard border-2 p-6 transition-all duration-200 hover:-translate-y-1",
                    feature.accent,
                    /* First feature: wide highlight */
                    i === 0 && "sm:col-span-2 lg:p-8",
                    /* Last feature: full width highlight */
                    i === features.length - 1 && "sm:col-span-2 lg:col-span-3 lg:p-8"
                  )}
                >
                  <div
                    className={cn(
                      "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl",
                      feature.iconColor
                    )}
                  >
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-text-primary text-lg font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            TESTIMONIALS — Asymmetric featured layout
            ═══════════════════════════════════════════ */}
        <section className="border-border-default border-t-2 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center text-center">
              <Badge variant="info" className="mb-4">
                <Star className="mr-1 h-3 w-3" />
                What People Say
              </Badge>
              <h2 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Trusted by Professionals Across Campus
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-5">
              {/* Featured testimonial (large, left) */}
              <div className="rounded-card border-accent-blue/30 bg-accent-blue/5 shadow-hard flex flex-col justify-between border-2 p-8 lg:col-span-3 lg:p-10">
                <div>
                  <div className="mb-4 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="font-display text-text-primary text-xl leading-relaxed font-medium lg:text-2xl">
                    &ldquo;{testimonials[0]?.quote}&rdquo;
                  </blockquote>
                </div>
                <div className="border-accent-blue/20 mt-8 flex items-center gap-3 border-t pt-6">
                  <div className="bg-accent-blue flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white">
                    {testimonials[0]?.avatar}
                  </div>
                  <div>
                    <p className="text-text-primary font-semibold">{testimonials[0]?.name}</p>
                    <p className="text-text-tertiary text-sm">{testimonials[0]?.role}</p>
                  </div>
                </div>
              </div>

              {/* Two stacked testimonials (right) */}
              <div className="flex flex-col gap-4 lg:col-span-2">
                {testimonials.slice(1).map((t) => (
                  <div
                    key={t.name}
                    className="rounded-card border-border-default bg-bg-secondary shadow-hard-card flex flex-1 flex-col justify-between border-2 p-6"
                  >
                    <div>
                      <div className="mb-3 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>
                    <div className="border-border-default mt-4 flex items-center gap-3 border-t pt-4">
                      <div className="bg-accent-blue flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-text-primary text-sm font-semibold">{t.name}</p>
                        <p className="text-text-tertiary text-xs">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            ENROLLMENT INFO & FACILITIES
            ═══════════════════════════════════════════ */}
        <section className="border-border-default border-t-2 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center text-center">
              <Badge variant="info" className="mb-4">
                <CalendarDays className="mr-1 h-3 w-3" />
                Enrollment Information
              </Badge>
              <h2 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                How to Get Started
              </h2>
              <p className="text-text-secondary mt-3 max-w-2xl">{ENROLLMENT_POLICY}</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Application Fee */}
              <div className="rounded-card border-accent-amber/30 bg-accent-amber/5 shadow-hard-card border-2 p-6">
                <div className="bg-accent-amber/10 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Banknote className="text-accent-amber h-6 w-6" />
                </div>
                <h3 className="font-display text-text-primary text-lg font-bold">
                  Application Form
                </h3>
                <p className="text-accent-amber mt-1 text-2xl font-bold">
                  {formatNaira(APPLICATION_FORM_FEE)}
                </p>
                <p className="text-text-secondary mt-2 text-sm">
                  One-time application form fee for all courses.
                </p>
              </div>

              {/* Special Class */}
              <div className="rounded-card border-accent-purple/30 bg-accent-purple/5 shadow-hard-card border-2 p-6">
                <div className="bg-accent-purple/10 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Users className="text-accent-purple h-6 w-6" />
                </div>
                <h3 className="font-display text-text-primary text-lg font-bold">
                  Special Class Package
                </h3>
                <p className="text-text-secondary mt-2 text-sm">
                  Minimum of {SPECIAL_CLASS_MIN_STUDENTS} and maximum of{" "}
                  {SPECIAL_CLASS_MAX_STUDENTS} students per special class. Premium pricing with
                  dedicated instruction.
                </p>
              </div>

              {/* Enrollment Schedule */}
              <div className="rounded-card border-accent-green/30 bg-accent-green/5 shadow-hard-card border-2 p-6">
                <div className="bg-accent-green/10 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <CalendarDays className="text-accent-green h-6 w-6" />
                </div>
                <h3 className="font-display text-text-primary text-lg font-bold">
                  Monthly Enrollment
                </h3>
                <p className="text-text-secondary mt-2 text-sm">
                  Classes begin at the beginning of each new month. Enroll anytime and join the next
                  cohort.
                </p>
              </div>
            </div>

            {/* Facilities */}
            <div className="mt-12">
              <h3 className="font-display text-text-primary text-center text-xl font-bold">
                Available Facilities
              </h3>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                {AVAILABLE_FACILITIES.map((facility) => (
                  <div
                    key={facility}
                    className="rounded-card border-border-default bg-bg-secondary shadow-hard-card flex items-center gap-3 border-2 px-5 py-3"
                  >
                    <CheckCircle2 className="text-accent-green h-5 w-5 shrink-0" />
                    <span className="text-text-primary text-sm font-medium">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CTA Section — Theme-aware, no hardcoded bg
            ═══════════════════════════════════════════ */}
        <section className="border-border-default bg-bg-secondary border-t-2 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-card border-accent-blue/30 bg-accent-blue/5 shadow-hard border-2 p-8 text-center sm:p-12 lg:p-16">
              <div className="bg-accent-blue/10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
                <GraduationCap className="text-accent-blue h-8 w-8" />
              </div>
              <h2 className="font-display text-text-primary mt-6 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Ready to Transform Your Training?
              </h2>
              <p className="text-text-secondary mt-4 text-lg">
                Join thousands of professionals who are already growing their skills with TRD LMS.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/register">
                  <Button variant="primary" size="xl">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-border-default bg-bg-secondary border-t-2 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="bg-accent-blue flex h-8 w-8 items-center justify-center rounded-full">
                  <GraduationCap className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <span className="font-display text-text-primary text-lg font-bold">TRD LMS</span>
              </div>
              <p className="text-text-tertiary mt-3 text-sm">
                The hybrid learning platform for Training, Research &amp; Development.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-text-primary mb-3 text-sm font-semibold">Platform</h4>
              <div className="flex flex-col gap-2">
                <Link
                  href="/courses"
                  className="text-text-tertiary hover:text-text-primary text-sm transition-colors"
                >
                  Courses
                </Link>
                <a
                  href="#categories"
                  className="text-text-tertiary hover:text-text-primary text-sm transition-colors"
                >
                  Categories
                </a>
                <a
                  href="#features"
                  className="text-text-tertiary hover:text-text-primary text-sm transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-text-tertiary hover:text-text-primary text-sm transition-colors"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-text-primary mb-3 text-sm font-semibold">Resources</h4>
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="text-text-tertiary hover:text-text-primary text-sm transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-text-tertiary hover:text-text-primary text-sm transition-colors"
                >
                  Create Account
                </Link>
                <Link
                  href="/verify"
                  className="text-text-tertiary hover:text-text-primary text-sm transition-colors"
                >
                  Verify Certificate
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-text-primary mb-3 text-sm font-semibold">Contact</h4>
              <div className="flex flex-col gap-2">
                <p className="text-text-tertiary text-sm">ITeMS, University of Ibadan</p>
                <p className="text-text-tertiary text-sm">Ibadan, Oyo State, Nigeria</p>
                {CONTACT_PHONES.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/-/g, "")}`}
                    className="text-text-tertiary hover:text-accent-blue flex items-center gap-1.5 text-sm transition-colors"
                  >
                    <Phone className="h-3 w-3" />
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-border-default mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
            <p className="text-text-tertiary text-sm">
              &copy; {new Date().getFullYear()} TRD Learning Management System. All rights reserved.
            </p>
            <div className="text-text-tertiary flex items-center gap-4 text-sm">
              <button type="button" className="hover:text-text-primary transition-colors">
                Privacy Policy
              </button>
              <button type="button" className="hover:text-text-primary transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
