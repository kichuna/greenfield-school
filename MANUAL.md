# Greenfield High School — App User Manual

**Live URL:** https://greenfield-school-w2y5.onrender.com  
**Static site:** https://kichuna.github.io/greenfield-high-school/  
**Version:** 1.0 | Built with Next.js 14, PostgreSQL, Prisma, NextAuth

---

## Table of Contents

1. [Overview](#1-overview)
2. [User Roles](#2-user-roles)
3. [Logging In](#3-logging-in)
4. [Public Website](#4-public-website)
5. [Admin Dashboard](#5-admin-dashboard)
6. [Managing News](#6-managing-news)
7. [Managing Events](#7-managing-events)
8. [Managing Gallery](#8-managing-gallery)
9. [Managing Documents](#9-managing-documents)
10. [Managing Admissions](#10-managing-admissions)
11. [Managing Alumni](#11-managing-alumni)
12. [Managing Users](#12-managing-users)
13. [Default Credentials](#13-default-credentials)

---

## 1. Overview

The Greenfield High School web application is a full-stack website that serves two audiences:

- **The public** — prospective students, parents, and visitors who browse news, events, gallery, and admissions information.
- **Staff and administrators** — who manage all content through a secure admin panel.

All content (news, events, gallery photos, documents) is stored in a PostgreSQL database and managed through the admin panel at `/admin`.

---

## 2. User Roles

| Role | Access Level |
|---|---|
| **SUPER_ADMIN** | Full access — manage everything including users |
| **ADMIN** | Manage all content except user accounts |
| **STAFF** | Manage news, events, gallery, documents |
| **ALUMNI** | Alumni profile (no admin panel access) |

---

## 3. Logging In

1. Go to `https://greenfield-school-w2y5.onrender.com/auth/login`
2. Enter your email and password
3. Click **Sign In**
4. You are redirected to `/admin/dashboard`

If you see **"Invalid email or password"**, check:
- You are using the correct email
- Caps Lock is off
- Your account has been activated by a Super Admin

---

## 4. Public Website

The public website is accessible to everyone — no login required.

| Page | URL | Description |
|---|---|---|
| Home | `/` | School overview, latest news, upcoming events |
| About | `/about` | School history, mission, vision, leadership |
| Academics | `/academics` | STEM, Humanities, Arts pathways + resource downloads |
| Admissions | `/admissions` | How to apply, fee structure, FAQs |
| News | `/news` | All published news articles |
| Events | `/events` | Upcoming and past school events |
| Gallery | `/gallery` | Photo albums and school images |
| Alumni | `/alumni` | Notable alumni and alumni registration |
| Contact | `/contact` | Contact form and school location |

---

## 5. Admin Dashboard

Access the admin panel at `/admin/dashboard` after logging in.

The sidebar contains links to all management sections:

- **Dashboard** — overview and quick stats
- **News** — create and manage articles
- **Events** — create and manage events
- **Gallery** — upload and organise photos
- **Documents** — upload fee structures, booklists, etc.
- **Admissions** — view and process applications
- **Alumni** — verify and manage alumni profiles
- **Users** — manage staff accounts *(Super Admin only)*

---

## 6. Managing News

**Path:** `/admin/news`

### Create an article
1. Click **"New Article"**
2. Fill in: Title, Content (rich text), Status (`DRAFT` or `PUBLISHED`)
3. Click **Save**

### Edit an article
1. Click the **Edit** (pencil) icon next to the article
2. Update the fields
3. Click **Save**

### Publish / Unpublish
- When editing, change Status from `DRAFT` to `PUBLISHED` and save
- Published articles appear on the public `/news` page

### Delete an article
- Click the **Delete** (trash) icon and confirm

---

## 7. Managing Events

**Path:** `/admin/events`

### Create an event
1. Click **"New Event"**
2. Fill in: Title, Description, Date, Time, Location, Status
3. Click **Save**

### Publish / Unpublish inline
- Click the **toggle** on the event row to switch between Published and Draft instantly

### Edit or Delete
- Use the **Edit** or **Delete** icons on each event row

**Note:** Only `PUBLISHED` events appear on the public `/events` page.

---

## 8. Managing Gallery

**Path:** `/admin/gallery`

### Upload photos
1. **Drag and drop** image files onto the upload area, or click to browse
2. Multiple files can be selected at once
3. Each file shows a status: `pending → uploading → done`
4. Optionally assign a **title** to each photo before uploading
5. Optionally select an **album** to group photos

### Create an album
1. Click **"New Album"**
2. Enter the album name
3. Click **Create**

### Delete a photo
- Click the **Delete** icon on any photo card and confirm

**Supported formats:** JPG, PNG, GIF, WebP  
**Storage:** Photos are saved in `/public/uploads/gallery/`

---

## 9. Managing Documents

**Path:** `/admin/documents`

Use this section to upload downloadable files such as fee structures, booklists, exam timetables, and handbooks.

### Upload a document
1. Click **"Upload Document"**
2. Select a file (PDF, Word, or Excel — max 10 MB)
3. Enter a title and select a category:
   - **Curriculum** — booklists, syllabi
   - **Exam Info** — timetables, exam guides
   - **Career Guidance** — university and career guides
   - **Admissions** — fee structures, admission requirements
   - **General** — other school documents
4. Click **Upload**

### Publish / Unpublish
- Click the **toggle** on a document to make it visible or hidden on the public site

### Where documents appear
| Category | Public page |
|---|---|
| ADMISSIONS | `/admissions` (Downloads section) |
| All others | `/academics` (Academic Resources section) |

### Delete a document
- Click **Delete** and confirm — removes the file from the server

---

## 10. Managing Admissions

**Path:** `/admin/admissions`

### View applications
- The table lists all submitted admission applications
- Filter by status: `ALL`, `PENDING`, `UNDER_REVIEW`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`

### Process an application
1. Click **View** on any application
2. Review the applicant's personal details, academic info, and uploaded documents
3. Select a new status using the radio buttons:
   - **Pending** — newly received, not yet reviewed
   - **Under Review** — currently being assessed
   - **Shortlisted** — invited for interview/assessment
   - **Accepted** — offer made
   - **Rejected** — not successful
4. Click **Update Status**

### How applications come in
Parents and students submit the application form on the public `/admissions` page. Each submission is automatically saved to the database and appears here.

---

## 11. Managing Alumni

**Path:** `/admin/alumni`

### How alumni register
Alumni fill in the registration form on the public `/alumni` page. Their profile is saved as **unverified** and does not appear on the public alumni grid until approved.

### Verify an alumni
1. Find the alumni in the table (filter by **PENDING**)
2. Click **Verify** — their profile goes live on the public page

### Unverify
- Click **Unverify** to hide a profile from the public without deleting it

### Delete
- Click **Delete** to permanently remove the alumni profile and their account

---

## 12. Managing Users

**Path:** `/admin/users`  
*Super Admin only*

### Create a new staff account
1. Click **"New User"**
2. Fill in: Name, Email, Password, Role
3. Click **Create**

### Roles to assign
- `ADMIN` — for deputy principals or content managers
- `STAFF` — for teachers or office staff who update content

### Deactivating a user
Currently done via the database or by contacting your Super Admin. A user with `isActive: false` cannot log in.

---

## 13. Default Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | `admin@greenfieldhs.ac` | `Admin@1234` |
| Staff | `staff@greenfieldhs.ac` | `Staff@1234` |

**Important:** Change these passwords after your first login by asking your developer to update them directly in the database, or by building the profile/settings page.

---

## Need Help?

Contact your system administrator or the developer who built this system.

- **GitHub (source code):** https://github.com/kichuna/greenfield-school
- **Static site:** https://github.com/kichuna/greenfield-high-school
