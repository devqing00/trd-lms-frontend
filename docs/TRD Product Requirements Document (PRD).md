# **Product Requirements Document (PRD)**

## **Learning Management System (LMS)**

### **Version 1.0**

---

## **1\. Overview**

### **1.1 Product Summary**

This Learning Management System enables an organization to manage physical (in-person) training programs while providing digital resources, prerequisite testing, enrollment management, and certification workflows.

### **1.2 Key Objectives**

- Provide a central platform where admins can manage courses, modules, instructors, and participants.

- Ensure students meet prerequisite requirements through testing before enrolling.

- Support pre-course and post-course testing to validate competence.

- Host learning resources (PDFs, videos, presentations, files) for each course or module.

- Track progress, attendance (optional), test results, and certification eligibility.

### **1.3 Target Users**

- **Admin** – manages entire system, courses, tests, instructors, and students.

- **Instructor** – manages assigned course content, tracks students, grades tests if needed, and handles physical training.

- **Student/Learner** – views courses, takes prerequisite tests, enrolls, attends physical training, completes end-of-course tests, and earns certificates.

---

## **2\. Key Features**

### **2.1 Course Management**

**Admin can:**

- Create courses with:
  - Course title

  - Description

  - Duration (e.g., 3 days training)

  - Physical training location

  - Category (optional)

  - Assigned instructor(s)

  - Associated modules (optional)

- Upload course resources (PDF, docs, videos, slides).

- Set prerequisites (e.g., “Must pass the Pre-Course Test”).

- Set course test (end-of-course assessment).

- Publish/unpublish courses.

**Instructor can:**

- View only assigned courses.

- Add supporting resources (if allowed by admin).

- View enrolled students.

**Student can:**

- Browse all available courses.

- View course details (description, schedule, resources).

- Enroll (after meeting all requirements).

---

### **2.2 Module Management (If courses have modules)**

A course may consist of multiple modules.

For each module:

- Module title

- Content/resources

- End-of-module test

- Pass score settings

**Note:** Module 0 is the foundational course with no prerequisite test required.

---

### **2.3 Prerequisite Test System**

This is a core part of the system.

#### **Rules**

- Before enrolling in any course (except **Module 0**), the student must take a **Prerequisite Test**.

- The test must be passed with a minimum score defined by admin.

- If the student **fails**, the system advises them to take **Module 0** first.

- After passing, the student can enroll in any courses that accept that prerequisite result.

#### **Test features**

- Timed/Untimed tests.

- Multiple-choice questions (Phase 1).

- Randomization of questions (optional).

- Auto-grading.

- Score calculation.

- Store history of attempts.

---

### **2.4 Enrollment Flow**

#### **Enrollment Rules**

1. Student selects a course.

2. System checks if the course **requires a prerequisite test**.

3. If yes:
   - Student is prompted to take the prerequisite test.

   - If passed → **Enrollment enabled**.

   - If failed → Student is advised to complete **Module 0**.

4. Student completes enrollment.

#### **Enrollment Workflow**

- Student clicks "Enroll".

- If prerequisite passed → show enrollment success.

- Enrollment generates:
  - Enrollment record

  - Instructor notification (optional)

  - Pre-course materials unlocked

---

### **2.5 End-of-Course Test**

Each course/module has a final assessment.

#### **Rules**

- Student completes physical training.

- Post-course test becomes available.

- Must pass test to qualify for certification.

- Admin can override pass/fail manually (optional).

#### **Features**

- MCQ or written questions (Phase 2).

- Pass score set at course level.

- Auto-grading for MCQ.

- Manual grading for written questions.

---

### **2.6 Certification**

Only eligible if:

- Student is enrolled → **completed physical training**.

- Passed the **end-of-course test**.

System generates:

- Certificate with:
  - Student name

  - Course title

  - Instructor name

  - Issue date

  - Certificate ID (unique code)

  - QR code verification link

Certificate is downloadable as PDF.

---

## **3\. User Roles & Permissions**

### **3.1 Admin**

- Create/edit/delete courses & modules.

- Upload resources.

- Create/manage tests & questions.

- Assign instructors.

- Manage students & enrollments.

- Override test results and certifications.

- View reports & analytics.

### **3.2 Instructor**

- View assigned courses/modules.

- Upload supporting materials (if allowed).

- Track enrolled students.

- Mark attendance (optional).

- Assist with tests (manual grading).

- View performance stats.

### **3.3 Student**

- Browse courses.

- Take prerequisite tests.

- Enroll in eligible courses.

- Access course materials.

- Complete end-of-course tests.

- Download certificates.

---

## **4\. Functional Requirements**

### **4.1 Course Requirements**

- Admin can create/update/delete courses.

- Courses must support the upload of:
  - PDFs

  - PowerPoints

  - Videos

  - Images

- A course can have a single instructor or multiple.

- Courses must have optional modules.

### **4.2 Test Requirements**

- Admin creates test bank:
  - Questions (MCQ)

  - Answers & correct options

  - Difficulty levels (optional)

- Test engine:
  - Randomize questions

  - Auto-score

  - Store attempts

  - Prerequisite pass-score enforcement

### **4.3 Enrollment Requirements**

- System must enforce prerequisite status.

- Enrollment is prevented when:
  - Test not taken

  - Test failed

- Enrollment permitted when:
  - Test passed

- All enrollments must generate a record.

### **4.4 Certification Requirements**

- Must check:
  - Final test passed

  - Instructor attendance confirmation (optional)

- Generate PDF certificate.

- Store certificate number for verification.

---

## **5\. Non-Functional Requirements**

### **5.1 Performance**

- The system should support up to 10,000 students (scalable).

- Test grading must occur within 1 second after submission.

### **5.2 Security**

- JWT authentication / OAuth2.

- Role-based access control.

- All test answers encrypted at rest.

### **5.3 Usability**

- Mobile-friendly student portal.

- Dashboards for:
  - Admin

  - Instructor

  - Student

### **5.4 Reporting & Analytics**

Admin should see:

- Number of enrollments per course.

- Pass/fail rates.

- Active vs inactive students.

- Instructor performance metrics.
