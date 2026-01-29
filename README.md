# Zealthy EMR & Patient Portal

A full-stack Electronic Medical Records (EMR) and Patient Portal application built with modern web technologies.

## Project Overview

This application consists of two main sections:

1. **Mini EMR (Admin Interface)** - A healthcare provider interface for managing patients, appointments, and prescriptions
2. **Patient Portal** - A secure patient-facing interface for viewing health information

## Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** with **PostgreSQL**
- **JWT** authentication with **bcrypt** password hashing
- RESTful API architecture

### Frontend
- **React 18** + **TypeScript**
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **date-fns** for date handling

## Features

### Mini EMR (`/admin`)
- View all patients in a searchable table
- Create new patients with email and password
- View detailed patient records
- Manage appointments (Create, Read, Update, Delete)
  - Support for recurring appointments (weekly/monthly)
  - End dates for recurring appointments
- Manage prescriptions (Create, Read, Update, Delete)
  - Select from predefined medications and dosages
  - Track refill schedules

### Patient Portal (`/`)
- Secure login with JWT authentication
- Dashboard showing:
  - Appointments in the next 7 days
  - Prescription refills in the next 7 days
  - Basic patient information
- Full appointment schedule (3 months view)
- Complete prescriptions list with refill dates

## Project Structure

```
zealthy-emr/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities (Prisma client)
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seeding
│   └── package.json
│
└── frontend/                # React application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Page components
    │   ├── services/       # API service layer
    │   ├── hooks/          # React hooks (auth)
    │   ├── types/          # TypeScript types
    │   └── lib/            # Axios configuration
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/zealthy_emr"
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=development
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

5. Seed the database:
```bash
npm run prisma:seed
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at http://localhost:3001

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

## Demo Credentials

Use these credentials to log in to the Patient Portal:

**User 1:**
- Email: `mark@some-email-provider.net`
- Password: `Password123!`

**User 2:**
- Email: `lisa@some-email-provider.net`
- Password: `Password123!`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Patient login
- `POST /api/auth/verify` - Verify JWT token

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `GET /api/patients/:id/appointments` - Get patient appointments
- `POST /api/patients/:id/appointments` - Create appointment
- `GET /api/patients/:id/prescriptions` - Get patient prescriptions
- `POST /api/patients/:id/prescriptions` - Create prescription

### Appointments
- `GET /api/appointments/upcoming` - Get upcoming appointments (authenticated)
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Prescriptions
- `GET /api/prescriptions/refills` - Get upcoming refills (authenticated)
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

### Reference Data
- `GET /api/reference/medications` - Get all medications
- `GET /api/reference/dosages` - Get all dosages

## Deployment

### Backend Deployment (Railway/Render)

1. Create a PostgreSQL database on Railway or Render
2. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT`
   - `NODE_ENV=production`
3. Deploy the backend directory
4. Run migrations: `npx prisma migrate deploy`
5. Seed the database: `npm run prisma:seed`

### Frontend Deployment (Vercel)

1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variable:
   - `VITE_API_URL=<your-backend-url>`
5. Deploy

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT-based authentication
- Protected API routes
- CORS configuration
- Input validation
- SQL injection prevention (Prisma ORM)

## Code Quality

- TypeScript for type safety
- ESLint for code linting
- Consistent code formatting
- Error handling throughout
- Modular architecture
- Separation of concerns

## Future Enhancements

- Email verification for new patients
- Password reset functionality
- Two-factor authentication
- Appointment reminders
- Prescription refill requests
- Provider-patient messaging
- Document uploads
- Audit logging
- Role-based access control

## License

MIT

## Contact

For questions or support, please contact the development team.
