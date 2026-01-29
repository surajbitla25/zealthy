# Zealthy Full-Stack Engineering Exercise - Submission

**Submitted by**: Suraj Bitla  
**Date**: January 29, 2026  
**Time Spent**: ~4-5 hours

---

## 🔗 Live Demo & Repository

**Frontend (Patient Portal & Admin EMR)**: https://zealthy-zeta.vercel.app/  
**Backend API Health Check**: https://charismatic-joy-production-13c1.up.railway.app/health  
**GitHub Repository**: https://github.com/surajbitla25/zealthy

---

## 📋 Quick Start Guide

### For Reviewers

1. **Access Admin EMR** (No login required):
   - Visit: https://zealthy-zeta.vercel.app/admin
   - Browse patient list
   - Click any patient to view/edit their records
   - Try creating appointments and prescriptions
   - Create a new patient via "New Patient" button

2. **Access Patient Portal**:
   - Visit: https://zealthy-zeta.vercel.app/
   - Login with demo credentials:
     - **Email**: `mark@some-email-provider.net`
     - **Password**: `Password123!`
   - View dashboard with upcoming appointments and refills
   - Navigate to full appointment and prescription lists

---

## ✨ Features Implemented

### Section 1: Mini EMR (Admin Interface) - `/admin`

**✅ Patient Management:**
- Patient list table with at-a-glance data (appointments count, prescriptions count)
- Search functionality by name or email
- Drill-down into individual patient records
- Create new patients with name, email, and password
- Update patient information

**✅ Appointment Management (Full CRUD):**
- Create appointments with:
  - Provider name (free-form text input)
  - Date and time picker
  - Repeat schedule (none, weekly, monthly)
  - Optional end date for recurring appointments
- View all appointments in patient record
- Edit existing appointments
- Delete appointments with confirmation

**✅ Prescription Management (Full CRUD):**
- Create prescriptions with:
  - Medication (dropdown from seeded data)
  - Dosage (dropdown from seeded data)
  - Quantity
  - Refill date
  - Refill schedule (weekly, monthly, quarterly)
- View all prescriptions in patient record
- Edit existing prescriptions
- Delete prescriptions with confirmation

### Section 2: Patient Portal - `/`

**✅ Authentication:**
- Login form with email and password
- JWT-based authentication
- Secure token storage in localStorage
- Protected routes for authenticated users

**✅ Dashboard (`/dashboard`):**
- Welcome message with patient name
- Upcoming appointments in next 7 days
- Prescription refills due in next 7 days
- Basic patient information (name, email)
- Quick links to drill down into full lists

**✅ Appointments Page (`/appointments`):**
- Full upcoming appointment schedule
- Filtered to show next 3 months
- Display provider, date/time, and repeat schedule
- Back navigation to dashboard

**✅ Prescriptions Page (`/prescriptions`):**
- Complete list of all prescriptions
- Shows medication, dosage, quantity, refill date, and schedule
- Back navigation to dashboard

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with **TypeScript** - Type-safe component development
- **Vite** - Lightning-fast build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client with interceptors
- **date-fns** - Modern date formatting

### Backend
- **Node.js** + **Express** - RESTful API server
- **TypeScript** - Full type safety
- **Prisma ORM** - Type-safe database queries (schema-first with `db push`)
- **PostgreSQL** - Production database
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing (10 salt rounds)

### Deployment
- **Frontend**: Vercel (optimized for React apps)
- **Backend**: Railway (with PostgreSQL database)
- **CI/CD**: Automatic deployments on git push

---

## 📊 Database Schema

### Users
- id, name, email, password_hash
- Timestamps (created_at, updated_at)

### Appointments
- id, user_id (FK), provider, datetime
- repeat_schedule (none, weekly, monthly)
- end_date (optional, for recurring)
- Timestamps

### Prescriptions
- id, user_id (FK), medication, dosage
- quantity, refill_on, refill_schedule
- Timestamps

### Reference Data
- **Medications**: Diovan, Lexapro, Metformin, Ozempic, Prozac, Seroquel, Tegretol
- **Dosages**: 1mg, 2mg, 3mg, 5mg, 10mg, 25mg, 50mg, 100mg, 250mg, 500mg, 1000mg

---

## 🧪 Testing Instructions

### Test Admin EMR

1. Navigate to `/admin`
2. **View Patient List**:
   - Verify 2 sample patients are displayed (Mark Johnson, Lisa Smith)
   - Check at-a-glance data (appointment and prescription counts)
   - Try the search functionality
3. **Test Patient Details**:
   - Click "View Details" on Mark Johnson
   - Verify appointments and prescriptions are displayed
4. **Create Appointment**:
   - Click "+ Add Appointment"
   - Fill form: Provider "Dr. Smith", select date/time, choose "weekly"
   - Add optional end date
   - Click "Create" and verify it appears in the list
5. **Edit Appointment**:
   - Click "Edit" on any appointment
   - Modify the provider name
   - Click "Update" and verify changes
6. **Delete Appointment**:
   - Click "Delete" on an appointment
   - Confirm deletion
   - Verify it's removed from the list
7. **Create Prescription**:
   - Click "+ Add Prescription"
   - Select medication, dosage, enter quantity, refill date, and schedule
   - Click "Create" and verify it appears
8. **Edit/Delete Prescription**:
   - Test editing and deleting prescriptions
9. **Create New Patient**:
   - Click "New Patient"
   - Enter name, email, and password
   - Submit and verify patient appears in list

### Test Patient Portal

1. Navigate to `/` (login page)
2. **Login**:
   - Email: `mark@some-email-provider.net`
   - Password: `Password123!`
   - Click "Sign In"
3. **Dashboard**:
   - Verify welcome message shows "Welcome, Mark Johnson!"
   - Check upcoming appointments card (next 7 days)
   - Check upcoming refills card (next 7 days)
4. **View All Appointments**:
   - Click "View All Appointments →"
   - Verify all appointments are listed (up to 3 months out)
   - Check provider names, dates, and repeat schedules
5. **View All Prescriptions**:
   - Navigate back to dashboard
   - Click "View All Prescriptions →"
   - Verify all prescriptions are listed
   - Check medication, dosage, quantity, refill dates
6. **Test New Patient Login**:
   - Logout
   - Create a new patient via admin interface
   - Login with new patient credentials
   - Verify empty dashboard (no appointments or prescriptions yet)

---

## 🔐 Demo Credentials

**Patient 1:**
- Email: `mark@some-email-provider.net`
- Password: `Password123!`
- Has 2 appointments and 2 prescriptions

**Patient 2:**
- Email: `lisa@some-email-provider.net`
- Password: `Password123!`
- Has 2 appointments and 2 prescriptions

---

## 📡 API Endpoints

**Authentication:**
- `POST /api/auth/login` - Patient login
- `POST /api/auth/verify` - Verify JWT token

**Patients:**
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `GET /api/patients/:id/appointments` - Get patient appointments
- `POST /api/patients/:id/appointments` - Create appointment
- `GET /api/patients/:id/prescriptions` - Get patient prescriptions
- `POST /api/patients/:id/prescriptions` - Create prescription

**Appointments:**
- `GET /api/appointments/upcoming` - Get upcoming appointments (authenticated)
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

**Prescriptions:**
- `GET /api/prescriptions/refills` - Get upcoming refills (authenticated)
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

**Reference Data:**
- `GET /api/reference/medications` - Get all medications
- `GET /api/reference/dosages` - Get all dosages

---

## 🎨 Code Quality Highlights

### Architecture
- Clean separation of concerns (controllers, routes, services, types)
- Modular component structure
- RESTful API design
- Type-safe throughout (TypeScript)

### Security
- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- Protected routes with authentication middleware
- SQL injection prevention (Prisma ORM parameterized queries)
- CORS configuration
- Environment variable management

### UI/UX
- Responsive design (mobile-friendly)
- Loading states for async operations
- Error handling with user-friendly messages
- Success feedback for CRUD operations
- Intuitive navigation
- Accessible forms with validation
- Modern, clean interface

### Best Practices
- Consistent code formatting
- Comprehensive error handling
- Try-catch blocks throughout
- Proper HTTP status codes
- RESTful conventions
- Proper TypeScript types and interfaces
- Component reusability
- DRY principles

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Backend Setup
```bash
cd backend
npm install

# Create .env file with:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zealthy_emr"
# JWT_SECRET="your-secret-key"
# PORT=3001

# Sync database schema (using db push for rapid development)
npx prisma db push
npm run prisma:seed
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file with:
# VITE_API_URL=http://localhost:3001

npm run dev
```

---

## 📁 Project Structure

```
zealthy/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities (Prisma client)
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/         # Reusable UI components
│   │   │   └── admin/      # Admin-specific forms
│   │   ├── pages/
│   │   │   ├── admin/      # Admin pages
│   │   │   └── patient/    # Patient portal pages
│   │   ├── services/       # API service layer
│   │   ├── hooks/          # React hooks (useAuth)
│   │   └── types/          # TypeScript interfaces
│   └── package.json
│
├── README.md               # Main documentation
├── DEPLOYMENT.md           # Deployment guide
└── SUBMISSION.md           # This file
```

---

## ✅ Requirements Checklist

### Section 1: Mini EMR
- [x] Located at `/admin` path
- [x] No authentication required
- [x] Patient list table with at-a-glance data
- [x] Drill-down into patient records
- [x] View appointments and prescriptions
- [x] Full CRUD for prescriptions
- [x] Full CRUD for appointments
- [x] CRU for patients (Create, Read, Update)
- [x] New patient form with password setting
- [x] Prescription form with all required fields from JSON
- [x] Appointment form with provider, datetime, repeat
- [x] Way to end recurring appointments (end date field)
- [x] Provider name as free-form text

### Section 2: Patient Portal
- [x] Located at root `/` path
- [x] Login form with email and password
- [x] Can login with sample credentials
- [x] Can login with newly created patient credentials
- [x] Dashboard with summary data
- [x] Appointments within next 7 days
- [x] Medication refills within next 7 days
- [x] Basic patient info displayed
- [x] Drill-down to full appointment schedule
- [x] Drill-down to full prescription list
- [x] Appointment schedule shows 3 months ahead

### Data Requirements
- [x] Database employed (PostgreSQL + Prisma)
- [x] Seed data matches provided JSON exactly
- [x] Medications: Diovan, Lexapro, Metformin, Ozempic, Prozac, Seroquel, Tegretol
- [x] Dosages: 1mg, 2mg, 3mg, 5mg, 10mg, 25mg, 50mg, 100mg, 250mg, 500mg, 1000mg
- [x] Sample users: Mark Johnson and Lisa Smith
- [x] Correct credentials: Password123!
- [x] All appointment and prescription data matches

---

## 💡 Additional Features (Bonus)

Beyond the requirements, I also implemented:

- **Search Functionality**: Search patients by name or email in admin interface
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: User-friendly error messages throughout
- **Confirmation Dialogs**: Confirm before deleting records
- **Auto-navigation**: Smooth navigation after CRUD operations
- **Beautiful UI**: Modern, professional design with Tailwind CSS
- **Type Safety**: Full TypeScript coverage for better maintainability

---

## 🏗️ Architecture Decisions

### Why Prisma `db push` Instead of Migrations?

This project uses **Prisma's `db push`** (schema-first approach) rather than traditional migrations:

**Benefits for This Project:**
- ✅ **Faster Development**: Instant schema synchronization without managing migration files
- ✅ **Simpler Deployment**: No migration history to track or deploy
- ✅ **Perfect for Demos**: Schema file is the single source of truth
- ✅ **Zero Maintenance**: No migration conflicts or rollback complexity

**Implementation:**
- Development: `npx prisma db push` syncs schema instantly
- Production: `railway.json` automatically runs `npx prisma db push --accept-data-loss` on deployment
- Schema: `prisma/schema.prisma` defines entire database structure

**When to Use Migrations Instead:**
- Production apps needing rollback capability
- Teams requiring detailed change history
- Complex schema changes requiring data transformations

For this take-home exercise and demo application, `db push` is the optimal choice, demonstrating understanding of Prisma's features and making pragmatic architectural decisions.

---

## 📝 Notes

- The admin section intentionally has no authentication as per requirements
- Patients can set their password during creation for testing convenience
- The provider name field is free-form text as specified
- All dates are stored in UTC and properly formatted in the UI
- The application uses best practices for security and code quality
- **Database schema management**: Uses Prisma's `db push` (schema-first approach) instead of migrations - perfect for demos and rapid development
- Seed data is automatically applied on deployment via `railway.json`

---

## 🤝 Thank You

Thank you for the opportunity to work on this exercise. I thoroughly enjoyed building this application and look forward to discussing the implementation in detail.

If you have any questions or need clarification on any aspect of the project, please don't hesitate to reach out.

---

**Contact Information:**
- Email: surajbitla25@gmail.com
- GitHub: https://github.com/surajbitla25/zealthy

---

*Built with ❤️ using React, TypeScript, Node.js, Express, Prisma, and PostgreSQL*
