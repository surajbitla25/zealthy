# Zealthy EMR Backend API

Node.js + Express + TypeScript + Prisma backend for the EMR and Patient Portal application.

## Prerequisites

- Node.js 18+
- PostgreSQL database

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with:
```
DATABASE_URL="postgresql://user:password@localhost:5432/zealthy_emr"
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=development
```

3. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

4. Seed the database:
```bash
npm run prisma:seed
```

## Development

Run the development server:
```bash
npm run dev
```

Server runs on http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/verify` - Verify JWT token

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/:id/appointments` - Get patient appointments
- `POST /api/patients/:id/appointments` - Create appointment
- `GET /api/patients/:id/prescriptions` - Get patient prescriptions
- `POST /api/patients/:id/prescriptions` - Create prescription

### Appointments
- `GET /api/appointments/upcoming` - Get upcoming appointments (auth required)
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Prescriptions
- `GET /api/prescriptions/refills` - Get upcoming refills (auth required)
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

### Reference Data
- `GET /api/reference/medications` - Get all medications
- `GET /api/reference/dosages` - Get all dosages

## Build for Production

```bash
npm run build
npm start
```
