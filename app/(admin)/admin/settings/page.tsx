"use client";

import { useState } from "react";
import { Bell, Shield, GraduationCap, Globe, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function SettingsPage() {
  // General
  const [orgName, setOrgName] = useState("TRD Training Institute");
  const [supportEmail, setSupportEmail] = useState("support@trd-lms.com");
  const [timezone, setTimezone] = useState("UTC+1");

  // Assessment
  const [defaultPassScore, setDefaultPassScore] = useState(70);
  const [defaultMaxAttempts, setDefaultMaxAttempts] = useState(3);
  const [defaultTimeLimit, setDefaultTimeLimit] = useState(30);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [tabSwitchDetection, setTabSwitchDetection] = useState(true);
  const [copyPastePrevention, setCopyPastePrevention] = useState(true);

  // Notifications
  const [enrollmentNotifs, setEnrollmentNotifs] = useState(true);
  const [waitlistNotifs, setWaitlistNotifs] = useState(true);
  const [certNotifs, setCertNotifs] = useState(true);
  const [reminderNotifs, setReminderNotifs] = useState(true);

  // Security
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [enforcePasswordPolicy, setEnforcePasswordPolicy] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  function handleSave() {
    toast.success("Settings saved successfully");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="text-text-secondary mt-1 pr-5 md:pr-0">
            System configuration and preferences
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save All
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="text-accent-blue h-5 w-5" />
              General
            </CardTitle>
            <CardDescription>Organization and platform settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input
                id="support-email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["UTC-5", "UTC", "UTC+1", "UTC+3", "UTC+5:30", "UTC+8"].map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Defaults */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="text-accent-green h-5 w-5" />
              Assessment Defaults
            </CardTitle>
            <CardDescription>Default test and grading configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="pass-score">Pass Score (%)</Label>
                <Input
                  id="pass-score"
                  type="number"
                  min={1}
                  max={100}
                  value={defaultPassScore}
                  onChange={(e) => setDefaultPassScore(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-attempts">Max Attempts</Label>
                <Input
                  id="max-attempts"
                  type="number"
                  min={1}
                  max={10}
                  value={defaultMaxAttempts}
                  onChange={(e) => setDefaultMaxAttempts(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-limit">Time (min)</Label>
                <Input
                  id="time-limit"
                  type="number"
                  min={5}
                  max={180}
                  value={defaultTimeLimit}
                  onChange={(e) => setDefaultTimeLimit(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <SettingRow
              label="Shuffle Questions"
              description="Randomize question order for each attempt"
              checked={shuffleQuestions}
              onChange={setShuffleQuestions}
            />
            <SettingRow
              label="Tab-Switch Detection"
              description="Warn students who leave the test tab"
              checked={tabSwitchDetection}
              onChange={setTabSwitchDetection}
            />
            <SettingRow
              label="Copy/Paste Prevention"
              description="Block clipboard during assessments"
              checked={copyPastePrevention}
              onChange={setCopyPastePrevention}
            />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="text-accent-amber h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Default notification triggers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingRow
              label="Enrollment Confirmations"
              description="Notify on successful enrollment"
              checked={enrollmentNotifs}
              onChange={setEnrollmentNotifs}
            />
            <SettingRow
              label="Waitlist Updates"
              description="Notify when seats become available"
              checked={waitlistNotifs}
              onChange={setWaitlistNotifs}
            />
            <SettingRow
              label="Certificate Issued"
              description="Notify when certificate is ready"
              checked={certNotifs}
              onChange={setCertNotifs}
            />
            <SettingRow
              label="Class Reminders"
              description="Send reminders before scheduled sessions"
              checked={reminderNotifs}
              onChange={setReminderNotifs}
            />
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="text-accent-red h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Authentication and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                min={5}
                max={480}
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(parseInt(e.target.value) || 0)}
              />
              <p className="text-text-tertiary text-xs">Auto-logout after inactivity</p>
            </div>
            <SettingRow
              label="Password Policy"
              description="Enforce minimum 8 chars, upper, lower, number"
              checked={enforcePasswordPolicy}
              onChange={setEnforcePasswordPolicy}
            />
            <SettingRow
              label="Two-Factor Authentication"
              description="Require 2FA for admin accounts"
              checked={twoFactorAuth}
              onChange={setTwoFactorAuth}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="border-border-default bg-bg-tertiary flex items-center justify-between rounded-2xl border-2 p-3">
      <div>
        <p className="text-text-primary text-sm font-medium" id={id}>
          {label}
        </p>
        <p className="text-text-tertiary text-xs">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-labelledby={id} />
    </div>
  );
}
