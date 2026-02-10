import { redirect } from "next/navigation";

// The QR scanning functionality is built into the Attendance page.
// This route redirects instructors there directly.
export default function InstructorScanPage() {
  redirect("/instructor/attendance");
}
