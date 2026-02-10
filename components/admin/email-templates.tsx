"use client";

import { useState } from "react";
import { Eye, Copy, Pencil, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  trigger: string;
  category: "enrollment" | "certificate" | "waitlist" | "reminder" | "system";
  lastEdited: string;
  html: string;
}

/* ─── Mock Templates ─── */

const TEMPLATES: EmailTemplate[] = [
  {
    id: "1",
    name: "Enrollment Approved",
    subject: "Your enrollment for {{course_name}} has been approved",
    description: "Sent when admin approves a student's enrollment request.",
    trigger: "enrollment.approved",
    category: "enrollment",
    lastEdited: "2026-02-01",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <div style="display: inline-block; background: #3B82F6; color: white; border-radius: 50%; width: 48px; height: 48px; line-height: 48px; font-weight: bold;">TRD</div>
  </div>
  <h1 style="font-size: 24px; color: #09090B; margin-bottom: 8px;">Enrollment Approved!</h1>
  <p style="color: #52525B; line-height: 1.6;">Hi {{student_name}},</p>
  <p style="color: #52525B; line-height: 1.6;">Your enrollment for <strong>{{course_name}}</strong> has been approved. You can now access the course materials and prepare for the training session.</p>
  <div style="background: #F4F4F5; border-radius: 12px; padding: 16px; margin: 24px 0;">
    <p style="margin: 0; color: #09090B; font-weight: bold;">Session Details</p>
    <p style="margin: 4px 0 0; color: #52525B;">📅 {{session_date}}</p>
    <p style="margin: 4px 0 0; color: #52525B;">📍 {{venue}}</p>
  </div>
  <a href="{{dashboard_url}}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">Go to Dashboard</a>
  <p style="color: #A1A1AA; font-size: 12px; margin-top: 32px;">TRD Learning Management System • University of Ibadan</p>
</div>`,
  },
  {
    id: "2",
    name: "Certificate Ready",
    subject: "Your certificate for {{course_name}} is ready",
    description: "Sent when a verifiable certificate is generated for the student.",
    trigger: "certificate.ready",
    category: "certificate",
    lastEdited: "2026-01-28",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
  <h1 style="font-size: 24px; color: #09090B;">Certificate Ready! 🎉</h1>
  <p style="color: #52525B; line-height: 1.6;">Congratulations, {{student_name}}!</p>
  <p style="color: #52525B; line-height: 1.6;">Your certificate for <strong>{{course_name}}</strong> has been generated and is ready for download.</p>
  <div style="background: #ECFDF5; border: 1px solid #10B981; border-radius: 12px; padding: 16px; margin: 24px 0;">
    <p style="margin: 0; color: #064E3B; font-weight: bold;">Certificate #{{cert_number}}</p>
    <p style="margin: 4px 0 0; color: #065F46;">Verification URL: {{verification_url}}</p>
  </div>
  <a href="{{download_url}}" style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">Download Certificate</a>
</div>`,
  },
  {
    id: "3",
    name: "Waitlist Promotion",
    subject: "A seat opened up for {{course_name}}!",
    description: "Sent when a student is promoted from the waitlist.",
    trigger: "waitlist.promoted",
    category: "waitlist",
    lastEdited: "2026-01-25",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
  <h1 style="font-size: 24px; color: #09090B;">A Seat Opened Up! 🎯</h1>
  <p style="color: #52525B; line-height: 1.6;">Great news, {{student_name}}!</p>
  <p style="color: #52525B; line-height: 1.6;">A seat has become available for <strong>{{course_name}}</strong>. You've been promoted from the waitlist.</p>
  <p style="color: #EF4444; font-weight: bold;">⚠️ Please confirm within 48 hours or your spot will be released.</p>
  <a href="{{confirm_url}}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">Confirm Enrollment</a>
</div>`,
  },
  {
    id: "4",
    name: "Session Reminder",
    subject: "Reminder: {{course_name}} session tomorrow",
    description: "Sent 24 hours before a training session starts.",
    trigger: "session.reminder",
    category: "reminder",
    lastEdited: "2026-01-20",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
  <h1 style="font-size: 24px; color: #09090B;">Session Reminder 📅</h1>
  <p style="color: #52525B; line-height: 1.6;">Hi {{student_name}},</p>
  <p style="color: #52525B; line-height: 1.6;">This is a reminder that your <strong>{{course_name}}</strong> session is tomorrow.</p>
  <div style="background: #FFF7ED; border: 1px solid #F59E0B; border-radius: 12px; padding: 16px; margin: 24px 0;">
    <p style="margin: 0; color: #78350F; font-weight: bold;">Don't forget your QR code!</p>
    <p style="margin: 4px 0 0; color: #92400E;">You'll need it for attendance scanning.</p>
  </div>
</div>`,
  },
  {
    id: "5",
    name: "Welcome Email",
    subject: "Welcome to TRD LMS, {{student_name}}!",
    description: "Sent when a new user registers on the platform.",
    trigger: "user.registered",
    category: "system",
    lastEdited: "2026-01-15",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
  <h1 style="font-size: 24px; color: #09090B;">Welcome to TRD LMS! 👋</h1>
  <p style="color: #52525B; line-height: 1.6;">Hi {{student_name}},</p>
  <p style="color: #52525B; line-height: 1.6;">Welcome to the Training, Research & Development Learning Management System at the University of Ibadan.</p>
  <p style="color: #52525B; line-height: 1.6;">Here's what you can do:</p>
  <ul style="color: #52525B; line-height: 2;">
    <li>Browse and enroll in courses</li>
    <li>Take prerequisite tests</li>
    <li>Track your progress</li>
    <li>Earn verifiable certificates</li>
  </ul>
  <a href="{{dashboard_url}}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">Explore Courses</a>
</div>`,
  },
];

const CATEGORY_BADGES: Record<
  EmailTemplate["category"],
  { variant: "info" | "success" | "error" | "warning" | "purple"; label: string }
> = {
  enrollment: { variant: "info", label: "Enrollment" },
  certificate: { variant: "success", label: "Certificate" },
  waitlist: { variant: "error", label: "Waitlist" },
  reminder: { variant: "warning", label: "Reminder" },
  system: { variant: "purple", label: "System" },
};

/* ─── Component ─── */

function EmailTemplateManager() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState<"preview" | "source">("preview");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-text-primary text-xl font-bold">Email Templates</h2>
        <p className="text-text-secondary mt-1 text-sm">
          Manage notification email templates sent to students and staff.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Template list */}
        <div className="space-y-2 lg:col-span-2">
          {TEMPLATES.map((template) => {
            const cat = CATEGORY_BADGES[template.category];
            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={cn(
                  "flex w-full flex-col gap-1 rounded-xl border-2 p-4 text-left transition-all",
                  selectedTemplate?.id === template.id
                    ? "border-accent-blue bg-accent-blue/5 shadow-hard-sm"
                    : "border-border-default bg-bg-secondary hover:border-border-strong"
                )}
              >
                <div className="flex items-center gap-2">
                  <Mail className="text-text-tertiary h-4 w-4 shrink-0" />
                  <p className="text-text-primary truncate text-sm font-medium">{template.name}</p>
                  <Badge variant={cat.variant} className="ml-auto text-[9px]">
                    {cat.label}
                  </Badge>
                </div>
                <p className="text-text-tertiary truncate text-xs">{template.subject}</p>
                <p className="text-text-tertiary text-[10px]">
                  Trigger: <code className="bg-bg-tertiary rounded px-1">{template.trigger}</code>
                </p>
              </button>
            );
          })}
        </div>

        {/* Template preview */}
        <div className="lg:col-span-3">
          {selectedTemplate ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedTemplate.name}</CardTitle>
                    <CardDescription>{selectedTemplate.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={previewMode === "preview" ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setPreviewMode("preview")}
                    >
                      <Eye className="h-3 w-3" />
                      Preview
                    </Button>
                    <Button
                      variant={previewMode === "source" ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setPreviewMode("source")}
                    >
                      <Copy className="h-3 w-3" />
                      Source
                    </Button>
                  </div>
                </div>

                <div className="text-text-tertiary mt-2 flex items-center gap-4 text-xs">
                  <span>
                    Subject:{" "}
                    <strong className="text-text-primary">{selectedTemplate.subject}</strong>
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                {previewMode === "preview" ? (
                  <div className="border-border-default overflow-hidden rounded-xl border-2 bg-white">
                    <div
                      className="p-4"
                      dangerouslySetInnerHTML={{ __html: selectedTemplate.html }}
                    />
                  </div>
                ) : (
                  <pre className="bg-bg-tertiary text-text-secondary max-h-96 overflow-auto rounded-xl p-4 text-xs">
                    {selectedTemplate.html}
                  </pre>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-3 w-3" />
                    Edit Template
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Send className="h-3 w-3" />
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-card border-border-default flex flex-col items-center justify-center border-2 border-dashed py-16 text-center">
              <Mail className="text-text-tertiary mb-3 h-10 w-10" />
              <p className="text-text-secondary text-sm">Select a template to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { EmailTemplateManager };
