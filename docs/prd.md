# Product Requirements Document

## Sports Academy Management Platform

**Document type:** Client PRD (proposal and scope reference)  
**Companion document:** `build-prd.md` (internal execution specification)  
**Stack:** Next.js + TypeScript + Supabase

---

## 1. Executive Summary

Sports Academy Management Platform is a mobile-first, multi-tenant web application for Indian sports academies. It replaces scattered Excel registers, manual fee follow-up, and chaotic WhatsApp groups with one centralized operations system.

**Primary value proposition:** The best fee recovery + attendance + WhatsApp operating system for academies — not a full sports ERP on day one.

**What success looks like:**
- Staff can collect a fee and send a receipt on mobile in under 2 minutes
- Pending and overdue fees are visible and remindable in one click
- Owner sees daily revenue, attendance, and pending fees without calling staff
- Academy data migrates from Excel in one import, not re-typed student by student

**Technology:** Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase (PostgreSQL, Auth, Storage, Edge Functions, Cron).

---

## 2. Product Objective

Build a complete academy operations platform that helps sports academies manage students, batches, coaches, attendance, fees, reminders, reports, and parent communication from one system.

The platform should reduce:
- Manual register work
- Pending fee follow-up effort
- WhatsApp communication chaos
- Dependency on scattered Excel sheets

---

## 3. Target Users

| Role | Description |
|------|-------------|
| **Admin** | Full access to academy operations, users, reports, fees, settings |
| **Staff** | Student entry, attendance, fee collection, receipts, basic reports |
| **Coach** | Assigned batch attendance, student notes, one-on-one sessions |
| **Owner** | Dashboard, revenue, pending fees, attendance summary, daily digest |
| **Parent/Student** | No login required. Communication via WhatsApp, receipts, and shared links |

### Core Product Principles

- Simple enough for non-technical staff
- Mobile-first — operations happen on the ground
- Parents are not forced to install an app
- WhatsApp is the primary communication channel
- Every student, fee, attendance, and session record is traceable
- Each academy's data is securely isolated (multi-tenant)
- Architecture supports future multi-branch and SaaS expansion

---

## 4. Core Operating Loop

This is the money path. If this loop works perfectly, the product sells. All other modules support this loop.

```
Lead → Trial → Student Admission → Batch Assignment → Attendance → Fee Demand → Payment Collection → PDF Receipt → WhatsApp Confirmation → Owner Dashboard
```

| Step | Outcome |
|------|---------|
| Lead | Enquiry captured with source and follow-up status |
| Trial | Trial class booked and attended |
| Student Admission | Student profile created with parent contact |
| Batch Assignment | Student linked to sport and batch |
| Attendance | Present/absent recorded batch-wise by date |
| Fee Demand | Fee created manually or in bulk per batch |
| Payment Collection | Full or partial payment recorded with mode |
| PDF Receipt | Unique receipt generated with balance pending |
| WhatsApp Confirmation | Payment confirmation or reminder sent and logged |
| Owner Dashboard | Revenue, attendance, and pending fees visible |

---

## 5. Scope Classification

This document does not use phases or timelines. Modules are classified by priority to protect scope and guide build order.

| Label | Meaning |
|-------|---------|
| **Core Scope** | Must-have product. Required for launch and client acceptance. |
| **Advanced Scope** | Included in product vision; built after core workflows are stable. |
| **Future Add-ons** | Not included unless separately approved and quoted. |

### Core Scope

| Module | Notes |
|--------|-------|
| Multi-tenant academy workspace | RLS isolation per academy |
| Authentication and roles | Admin, Staff, Coach, Owner |
| Academy setup | Profile, branding, receipt prefix, payment modes |
| Student management | Registration, profile, batch assignment, active/inactive |
| Excel import | Students, batches, pending fee list |
| Lead and trial management | Enquiry to conversion flow |
| Batch management | Capacity, coach, schedule, student assignment |
| Attendance management | Batch-wise, date-wise, marked_by audit |
| Fee and payment management | Demand, collection, partial payment, statuses |
| Receipt management | PDF, unique numbering, WhatsApp share |
| WhatsApp communication | Click-to-send first; API automation where approved |
| Dashboard | Students, attendance, revenue, pending/overdue fees |
| Reports | Student, attendance, financial, lead (export Excel/PDF) |
| Coach management | Profile, assigned batches, basic activity |
| Staff management | Profile, role assignment, basic permissions |
| Search and filters | Student, batch, fee status, date range |
| Data security and RLS | Academy isolation, private storage, audit on sensitive actions |
| PWA (responsive) | Mobile-responsive; add to home screen; no offline sync |

### Advanced Scope

| Module | Notes |
|--------|-------|
| One-on-one personal training | Packages, sessions, expiry alerts |
| ID card management | Generate PDF with QR; bulk generate |
| Owner daily digest | WhatsApp or email summary |
| In-app notifications | Fee alerts, session reminders |
| Public enquiry form | Creates lead; shareable link |
| Google review booster | Post-payment / post-trial review request |
| Audit logs | Full action history with old/new values |
| Documents | Basic uploads only (photo, certificate, medical note) — not a full document vault |
| Mini academy page | Simple public page with enquiry form |
| Scheduled reminders | Auto fee due, birthday, session reminders via cron |

### Future Add-ons

| Module | Notes |
|--------|-------|
| Gallery and events | Photo/video links only — no heavy video hosting |
| Inventory management | Simple stock in/out — no accounting integration |
| Summer camp management | Camp enrollment, attendance, fees |
| Payment gateway | Optional integration — no complex reconciliation |
| QR / scan attendance | QR-ready structure in core; full scan flow is add-on |
| Native Android / iOS apps | Same Supabase backend |
| Parent mobile app | |
| Offline PWA sync | Out of scope unless separately quoted |
| Staff payroll | Salary field only in core; no payroll engine |
| Aadhaar storage | Avoid storing full Aadhaar; optional reference ID only |
| Advanced franchise management | |
| AI performance scoring | |
| Marketplace / public booking | |
| Accounting software integration | |
| Biometric attendance hardware | |
| Dedicated deployment per academy | |

---

## 6. User Roles and Permissions

### Admin
Manage academy settings, users, students, batches, coaches, staff, fees, attendance, reports, WhatsApp templates, documents, inventory, audit logs.

### Staff
Add/update students, mark attendance, collect fees, generate receipts, view pending fees, basic reports.

### Coach
View assigned batches, mark assigned attendance, view assigned students, add performance notes, manage one-on-one session status.

### Owner
View dashboard, revenue reports, pending fees, attendance summary, coach summary, receive daily digest. View-only on operational data unless also assigned Admin role.

---

## 7. Academy Setup

**Scope:** Core

Academy profile fields:
- Academy name, logo, address, contact number, WhatsApp number, email
- Google Maps link, sports offered, receipt prefix, default currency
- Default payment modes, brand color
- GST details (optional), Google review link
- WhatsApp template settings

---

## 8. Student and Parent Management

**Scope:** Core

### Registration fields
Auto-generated student ID, student name, parent name, mobile, WhatsApp, date of birth, gender, address, sport category, batch, joining date, profile photo, emergency contact, active/inactive status, medical notes (optional), reference/source (optional), admission status.

### Parent data model
Parent contact fields are stored on the student record. One student = one primary parent contact at launch. A separate `parents` table is reserved for future multi-guardian support.

### Student profile includes
Personal info, parent/contact, assigned sport and batch, fee history, attendance history, performance notes, package details, documents, receipt history, communication history.

### Actions
Add, edit, deactivate, reactivate, change batch, upload photo, view profile, download details, export list.

---

## 9. Lead and Trial Management

**Scope:** Core

### Lead fields
Lead name, parent name, mobile, WhatsApp, sport interested, age, preferred batch time, lead source, trial class date, follow-up status, assigned staff, notes.

### Lead statuses
New enquiry → Contacted → Trial booked → Trial attended → Follow-up pending → Converted | Lost

### Actions
Convert to student, send WhatsApp follow-up, add follow-up note, view pending follow-ups, track enquiry source.

---

## 10. Batch Management

**Scope:** Core

### Batch fields
Batch name, sport category, session type (morning/evening/custom), start/end time, capacity, assigned coach, active/inactive, days of week, fee amount (optional reference), description.

### Capacity display
Total capacity, current students, available slots.

### Actions
Create, edit, assign coach, assign/remove students, view batch students, batch attendance, batch fee status, deactivate.

---

## 11. Attendance Management

**Scope:** Core

### Student attendance
Batch-wise and date-wise. Present/absent, late (optional), remarks, marked_by, marked_at.

### Views
Today's attendance, batch-wise, student history, monthly report, absent students list.

### Coach/staff attendance
Present/absent, date-wise and monthly reports, remarks. **Advanced Scope** for full staff attendance workflows.

### QR attendance
QR-ready ID card structure in Advanced Scope. Full scan-to-mark flow is a Future Add-on.

---

## 12. Fee and Payment Management

**Scope:** Core

### Fee types
Admission, monthly, quarterly, annual, one-on-one, special coaching, tournament, camp, custom.

### Fee record fields
Student, fee type, amount, due date, discount, late fee (optional), paid amount, pending amount, payment status, payment mode, payment date, collected by, notes.

### Payment statuses
Pending, Partially paid, Paid, Overdue, Cancelled

### Payment modes
Cash, UPI, bank transfer, online payment, cheque, other.

### Actions
Create fee demand (manual per student or bulk per batch), collect payment, partial payment, generate receipt, cancel with admin permission, view history, export collection report.

---

## 13. Receipt Management

**Scope:** Core

### Receipt content
Academy name and logo, receipt number, student name and ID, parent name, fee type, payment amount, payment mode, payment date, collected by, balance pending, notes, authorized signature area.

### Actions
Generate PDF, download, share via WhatsApp, print, view history.

Receipt numbers are unique per academy with academy-specific prefix. See Business Rules (Section 26).

---

## 14. WhatsApp Communication

**Scope:** Core (click-to-send); Advanced Scope (API automation)

### Methods
1. **Click-to-send** — opens WhatsApp with pre-filled message (Core, always available)
2. **API-based automation** — depends on WhatsApp Business API / BSP approval (Advanced)

### Message types
Fee due reminder, overdue reminder, payment confirmation, session reminder, package expiry, birthday wishes, holiday notification, general/batch announcement, trial follow-up, Google review request, owner daily digest.

### Template variables
`academy_name`, `student_name`, `parent_name`, `fee_amount`, `due_date`, `pending_amount`, `batch_name`, `session_date`, `session_time`, `coach_name`, `payment_link`, `receipt_link`, `google_review_link`

### Message logs
Recipient, message type, content, status, sent time, failure reason, triggered by.

See Business Rules (Section 26) for fallback behavior.

---

## 15. Dashboard

**Scope:** Core

### Metrics
Total/active/inactive students, new admissions, coaches, staff, batches, one-on-one students, today's attendance, absent today, monthly revenue, today's collection, pending/overdue fees, upcoming birthdays, upcoming sessions, package expiry alerts, trial follow-ups.

### Filters
Date range, sport, batch, coach, payment status.

---

## 16. Reports

**Scope:** Core (basic set); Advanced Scope (extended personal training and lead analytics)

### Report types
- **Student:** student-wise, batch-wise, sport-wise, active/inactive, new admissions
- **Attendance:** daily, monthly, batch-wise, student history, coach/staff attendance
- **Financial:** collection, pending, overdue, revenue, payment mode, discount, receipt
- **Personal training:** trainer sessions, package expiry, cancelled sessions *(Advanced)*
- **Lead:** enquiries, trial booked/attended, converted, lost, source-wise

### Export
Excel and PDF.

---

## 17. One-on-One Personal Training

**Scope:** Advanced

Package enrollment (student, coach, fee, sessions, dates, status), session scheduling (scheduled/completed/cancelled/rescheduled/no-show), package tracking (completed/remaining sessions, expiry, renewal alerts), coach session calendar.

---

## 18. ID Card Management

**Scope:** Advanced

Student photo, name, ID, sport, batch, parent mobile, emergency contact, QR code, academy branding. Generate, download PDF, bulk generate, regenerate. QR links to internal student ID.

---

## 19. Document Management

**Scope:** Advanced (basic uploads only)

### Supported uploads
Student photo, certificates, medical notes, parent documents, other documents.

**Aadhaar:** Optional reference only. Full Aadhaar number and document storage is discouraged. If required by client, must include explicit consent, private storage, access logs, and deletion policy — quoted separately.

### Security
Private file storage, signed URLs, no public document URLs, role-based access.

---

## 20. Inventory Management

**Scope:** Future Add-on (simple stock in/out if included)

Equipment name, category, quantity, stock in/out, issued to, issue/return date, condition, remarks. No accounting integration.

---

## 21. Gallery and Events

**Scope:** Future Add-on

Event photos, video links (external URLs only — no video hosting), tournament history, achievements. No heavy media hosting.

---

## 22. Public Enquiry Form

**Scope:** Advanced

Fields: student name, parent name, mobile, WhatsApp, sport, age, preferred batch, message. Submission creates a lead. Shareable link for WhatsApp, Instagram, Google Business Profile, website.

---

## 23. Google Review Booster

**Scope:** Advanced

Send review request after fee payment, trial class, camp completion, or monthly renewal. Includes academy Google review link.

---

## 24. Multi-Tenant Structure

**Scope:** Core

Multiple academies on one application. Each academy has its own workspace.

### Common table fields
`id`, `academy_id`, `branch_id` (nullable), `created_by`, `created_at`, `updated_at`, `is_active`

All academy data filtered by `academy_id` via Supabase Row Level Security. Users from one academy cannot access another academy's data.

---

## 25. Security and RLS

**Scope:** Core

- Role-based access control
- Supabase Row Level Security on all academy tables
- Academy-wise data isolation
- Private document storage with signed URLs
- Server-side API key handling (never exposed in frontend)
- Audit logs for sensitive actions (fee cancel, payment cancel, role change)
- Input validation and rate limiting on public forms
- Backup-ready database structure

Sensitive data (parent contacts, student records, medical notes) must be protected. Full Aadhaar storage requires separate compliance scope.

---

## 26. Business Rules

These rules are binding for development and acceptance. Detailed test cases are in `build-prd.md`.

### Fee Rules

- Fee can be created manually per student or in bulk per batch.
- Fee status flow: `Pending` → `Partially Paid` → `Paid`
- `Pending` or `Partially Paid` becomes `Overdue` automatically after due date passes.
- Admin can cancel incorrect fee entries. Cancelled fees cannot receive new payments.
- Partial payment is allowed.
- Payment greater than pending amount is blocked.
- A receipt is generated for every successful payment.
- Cancelled payments require admin permission and an audit log entry.

### Receipt Rules

- Receipt number format: `{ACADEMY_PREFIX}-{FY}-{SEQUENCE}`
- Example: `KCA-2026-0001`
- Receipt number must be unique per academy.
- Cancelled receipt numbers are never reused.
- Receipt must show paid amount and balance pending.
- Receipt PDF includes academy logo and name from academy settings.

### Attendance Rules

- Attendance is marked batch-wise by date.
- Staff and admin can edit same-day attendance without extra permission.
- Editing past attendance requires admin permission.
- Each record stores `marked_by` and `marked_at`.
- A student cannot be marked present and absent for the same batch on the same date.

### Lead Rules

- Converting a lead creates a new student; lead status becomes `Converted`.
- Duplicate mobile number within same academy shows a warning (not hard block unless admin configures).
- Lost leads remain in system for reporting; not deleted.

### WhatsApp Rules

- Click-to-send WhatsApp is always available (Core).
- API-based automation requires WhatsApp Business API / BSP setup (Advanced).
- If API send fails, system logs failure with reason and allows manual resend via click-to-send.
- All messages (manual or API) must be logged with status.
- Template messages must use pre-approved templates when sent via API.

### Excel Import Rules

- Supported imports: students, batches, pending fee list.
- Flow: download template → upload file → preview → validation errors shown → confirm import.
- Duplicate detection on mobile number and student ID within academy.
- Invalid rows are skipped with error report; valid rows import on confirmation.

---

## 27. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Supabase |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Logic | Supabase Edge Functions |
| Scheduled jobs | Supabase Cron |
| Hosting | Vercel |
| Notifications | WhatsApp, email; SMS optional |
| Payments | Manual collection (Core); gateway integration (Future Add-on) |

---

## 28. Data Model Overview

**Scope:** Core structure at launch. Full FK, index, and RLS specifications in `build-prd.md`.

### Core tables
`academies`, `academy_settings`, `academy_users`, `user_roles`, `students`, `student_documents`, `sports`, `batches`, `batch_students`, `coaches`, `staff`, `attendance`, `fee_types`, `student_fees`, `payments`, `receipts`, `leads`, `lead_followups`, `whatsapp_templates`, `whatsapp_logs`, `notifications`, `audit_logs`

### Advanced tables
`personal_training_packages`, `personal_training_sessions`, `id_cards`, `staff_attendance`

### Future tables
`inventory_items`, `inventory_transactions`, `events`, `event_media`, `summer_camps`, `camp_students`

---

## 29. Acceptance Criteria

High-level acceptance criteria for client sign-off. Detailed Given/When/Then test cases are in `build-prd.md`.

1. Admin can create academy, add students, batches, coaches, and staff users.
2. Staff can mark batch attendance on mobile for today's date.
3. Staff can create fee demand and collect full or partial payment.
4. System blocks payment amount exceeding pending balance.
5. Receipt PDF is generated with unique academy receipt number and balance pending.
6. Receipt can be shared via WhatsApp (click-to-send minimum).
7. Fee status updates correctly: Pending → Partially Paid → Paid, and Pending/Partial → Overdue after due date.
8. Admin can cancel fee or payment with audit log.
9. Lead can be converted to student with batch assignment.
10. Excel import works for students, batches, and pending fee list with validation preview.
11. Coach can view and mark attendance only for assigned batches.
12. Owner dashboard shows today's collection, pending fees, and attendance summary.
13. Users cannot access data from another academy (RLS enforced).
14. Document upload uses private storage; no public URLs.
15. Application is usable on mobile, tablet, and desktop browsers.
16. All WhatsApp sends are logged with status.
17. Global search finds students by name, ID, parent name, and mobile.
18. Reports export to Excel and PDF for core financial and attendance reports.
19. Public enquiry form creates a lead (Advanced Scope).
20. Architecture supports future native apps on same Supabase backend.

---

## 30. Out of Scope Unless Separately Approved

- Native Android or iOS app
- Parent or trainer mobile app
- Offline PWA data sync
- Full Aadhaar document vault with compliance stack
- Staff payroll engine
- Accounting software integration
- Complex payment gateway reconciliation
- Biometric attendance hardware
- AI-based performance scoring
- Marketplace or public booking platform
- Dedicated deployment per academy
- Custom website development beyond mini academy page
- Heavy video hosting for gallery
- Advanced franchise management

---

## 31. Commercial and IP Note

The platform is built as a reusable multi-tenant product. Each academy receives its own login, workspace, branding, users, and data.

Source code, reusable architecture, and product IP remain with the development team unless explicitly agreed otherwise in contract.

Third-party charges (hosting, domain, WhatsApp API, SMS, email, payment gateway fees, storage overages) are separate from development cost.

---

## Document Map

| Document | Audience | Purpose |
|----------|----------|---------|
| `prd.md` (this file) | Client, stakeholders | Vision, scope, business rules, acceptance summary |
| `build-prd.md` | Developers, QA | Journeys, permission matrix, data model, test cases |
