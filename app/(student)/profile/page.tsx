"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, Building2, Calendar, BookOpen, Award, Edit3, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import {
  getCurrentStudent,
  fetchStudentEnrollments,
  fetchStudentCertificates,
} from "@/lib/mock-data";
import type { Enrollment, Certificate } from "@/lib/types";

export default function ProfilePage() {
  const student = getCurrentStudent();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: student.name,
    email: student.email,
    phone: student.phone ?? "",
    organization: student.organization ?? "",
  });

  useEffect(() => {
    async function load() {
      const [enr, cert] = await Promise.all([
        fetchStudentEnrollments(),
        fetchStudentCertificates(),
      ]);
      setEnrollments(enr);
      setCertificates(cert);
      setLoading(false);
    }
    void load();
  }, []);

  function handleSave() {
    // In production this would call an API
    toast.success("Profile updated successfully");
    setEditing(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div role="status" aria-label="Loading profile">
          <div className="border-accent-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <span className="sr-only">Loading profile…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
            My Profile
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your account and view your learning history.
          </p>
        </div>
        {!editing && (
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <Edit3 size={16} /> Edit
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          {editing ? (
            <div className="space-y-4">
              <InputWithLabel
                label="Full Name"
                id="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <InputWithLabel
                label="Email"
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputWithLabel
                  label="Phone"
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
                <InputWithLabel
                  label="Organization"
                  id="organization"
                  value={form.organization}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      organization: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save size={16} /> Save Changes
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  <X size={16} /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Avatar with upload */}
              <AvatarUpload
                initials={student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
                currentUrl={student.avatarUrl}
                onUpload={(file) => {
                  // In production: upload to API, update user profile
                  toast.success(`Photo "${file.name}" selected. Upload API not connected yet.`);
                }}
                onRemove={() => {
                  toast.success("Photo removed.");
                }}
                size="lg"
              />

              {/* Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="font-display text-text-primary text-xl font-bold">
                    {student.name}
                  </h2>
                  <p className="text-text-tertiary text-sm capitalize">{student.role}</p>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="text-text-secondary flex min-w-0 items-center gap-2">
                    <Mail size={16} className="text-text-tertiary shrink-0" aria-hidden="true" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className="text-text-secondary flex min-w-0 items-center gap-2">
                      <Phone size={16} className="text-text-tertiary shrink-0" aria-hidden="true" />
                      <span className="truncate">{student.phone}</span>
                    </div>
                  )}
                  {student.organization && (
                    <div className="text-text-secondary flex min-w-0 items-center gap-2">
                      <Building2
                        size={16}
                        className="text-text-tertiary shrink-0"
                        aria-hidden="true"
                      />
                      <span className="truncate">{student.organization}</span>
                    </div>
                  )}
                  <div className="text-text-secondary flex items-center gap-2">
                    <Calendar size={16} className="text-text-tertiary" />
                    Joined {new Date(student.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 sm:flex-col">
                <div className="bg-bg-tertiary rounded-2xl p-3 text-center">
                  <p className="text-text-primary text-lg font-bold">{enrollments.length}</p>
                  <p className="text-text-tertiary text-xs">Enrolled</p>
                </div>
                <div className="bg-bg-tertiary rounded-2xl p-3 text-center">
                  <p className="text-text-primary text-lg font-bold">{certificates.length}</p>
                  <p className="text-text-tertiary text-xs">Certs</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs: History */}
      <Tabs defaultValue="enrollments">
        <TabsList>
          <TabsTrigger value="enrollments">
            <BookOpen size={16} className="mr-1" />
            Enrollments
          </TabsTrigger>
          <TabsTrigger value="certificates">
            <Award size={16} className="mr-1" />
            Certificates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrollments" className="mt-4">
          {enrollments.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-text-secondary">No enrollment history yet.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="flex items-center justify-between p-4">
                  <div className="min-w-0">
                    <p className="text-text-primary truncate font-medium">
                      {enrollment.courseName}
                    </p>
                    <p className="text-text-tertiary text-xs">
                      {enrollment.enrolledAt
                        ? `Enrolled ${new Date(enrollment.enrolledAt).toLocaleDateString()}`
                        : "—"}
                      {enrollment.completedAt &&
                        ` • Completed ${new Date(enrollment.completedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      enrollment.status === "completed"
                        ? "border-accent-green text-accent-green"
                        : enrollment.status === "enrolled"
                          ? "border-accent-blue text-accent-blue"
                          : enrollment.status === "cancelled"
                            ? "border-accent-red text-accent-red"
                            : "border-accent-amber text-accent-amber"
                    }
                  >
                    {enrollment.status}
                  </Badge>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="certificates" className="mt-4">
          {certificates.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-text-secondary">No certificates earned yet.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => (
                <Card key={cert.id} className="flex items-center justify-between p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Award size={20} className="text-accent-amber shrink-0" />
                    <div className="min-w-0">
                      <p className="text-text-primary truncate font-medium">{cert.courseName}</p>
                      <p className="text-text-tertiary text-xs">
                        #{cert.certificateNumber} •{" "}
                        {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "Pending"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      cert.status === "ready"
                        ? "border-accent-green text-accent-green"
                        : cert.status === "generating"
                          ? "border-accent-amber text-accent-amber"
                          : "border-accent-red text-accent-red"
                    }
                  >
                    {cert.status}
                  </Badge>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
