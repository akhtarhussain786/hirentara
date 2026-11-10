# 🌍 Overseas Services Website & Admin Lead Portal

Ek complete, mobile-friendly website aur lead management system jo **Overseas Services Website Plan** (PDF) ke pure scope ke anusaar banaya gaya hai.

---

## 🚀 Features (Doc ke Anusaar)

### 1. Public Pages & Sections
- **Header & Menu**: Responsive navigation (Home, Services, Opportunities, Contact, Apply Now).
- **Notice Strip**: Top par rotating/clickable latest notices (Jaise: *"Dubai job applications open - Details dekhein"*), click karte hi seedhe relevant opportunity details aur form khulta hai.
- **Hero Banner**: Videsh jane se judi services ka short introduction aur **Explore Opportunities** CTA. Sath hi **Visitor ka 3-step simple safar** indicator.
- **Services Cards**: 
  1. Overseas Jobs (Dubai, Poland, Gulf, Europe)
  2. Visa Assistance (Work, Tourist & Student visa guidance)
  3. Documents Assistance (MEA Apostille, Embassy attestation, Translation)
- **Opportunities Grid**:
  - Desh (Country), Job/Service name, Estimated Salary package, Facilities, Eligibility aur Deadline.
  - Category filters (All, Overseas Jobs, Visa Assistance, Documents Assistance) aur Live Search.
- **Details Modal / Page**:
  - Reusable complete details view (Salary, Facilities, Eligibility, Charges & Required Documents list, Open/Closed status).
- **Common Application Form**:
  - Auto-selects targeted opportunity/service/country agar Notice ya Opportunity card se aaye hon.
  - Full Name, Mobile (Mandatory), WhatsApp (Optional), District & State (Location), Qualification, Work experience/skill.
  - **Passport Status**: Simple **Yes / No** radio selection (shuru me copy upload nahi mangna hai).
  - Optional Resume upload (PDF, DOC, DOCX, Images).
  - Optional Message / Queries.
  - **Submit ke baad**: Screen par **Unique Application ID** (e.g. `OS-2026-XXXX`) aur confirmation message.
- **Contact & Footer**:
  - Office address, working hours, direct **Call** aur **WhatsApp** quick trigger buttons.
  - Mobile bottom floating bar for instant contact.

---

### 2. Admin Panel (Lead & Content Management)
- **Protected Login**: Secure authentication (`admin` / `admin123`).
- **Dashboard & Stats**: Total Applications, New, Contacted, Documents Pending, Processing, Completed, Closed counts.
- **Application Management**:
  - Search by Name, Mobile number, Application ID.
  - Filter by Status aur Service type.
  - Full Applicant details view & uploaded resume download.
  - Direct Call & WhatsApp buttons applicant ko turant contact karne ke liye.
  - **Internal Team Notes**: Follow-up history aur notes add karne ki suvidha.
  - **Application Status Workflow**:
    `New` ➔ `Contacted` ➔ `Documents Pending` ➔ `Processing` ➔ `Completed` / `Closed`.
  - **Excel Export**: Filtered applications ko ek click me Excel (`.xlsx`) sheet me download karein.
- **Opportunities Management**:
  - Nayi jobs/services add karna, edit karna, delete karna.
  - Status "Open" ya "Closed" toggle karna.
- **Notice Management**:
  - Top strip par naye notice add karna, active/inactive karna aur kisi opportunity se link karna.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Tailwind CSS, Lucide React icons, Vite
- **Backend**: Node.js, Express.js, Multer (File uploads), XLSX (Excel export)
- **Database**: Local JSON Data Store with persistence (`server/data/database.json`)

---

## 💻 Kaise Chalayein (How to Run)

### 1. Production Mode (Single Command)
Pehle frontend build kar lein (already built):
```bash
npm run build
```
Fir server start karein:
```bash
npm start
```
Browser me kholein: **http://localhost:5000**

---

### 2. Development Mode
Agar aap live code editing karna chahte hain:
```bash
npm run dev
```
- Client runs on: **http://localhost:5173**
- Backend API runs on: **http://localhost:5000** (Proxy automatically configured)

---

## 🔑 Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

