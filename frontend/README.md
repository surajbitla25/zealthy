# Zealthy EMR - Frontend

React + TypeScript + Vite frontend for the EMR and Patient Portal application.

## Features

### Patient Portal
- Secure login with JWT authentication
- Dashboard with upcoming appointments and refills (next 7 days)
- Full appointment schedule (3 months view)
- Complete prescriptions list

### Admin EMR
- Patient list with search
- Patient detail view
- CRUD operations for appointments
- CRUD operations for prescriptions
- Create new patients

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router v6
- Axios
- Tailwind CSS
- date-fns

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with:
```
VITE_API_URL=http://localhost:3001
```

3. Run the development server:
```bash
npm run dev
```

The app runs on http://localhost:3000

## Demo Credentials

- Email: mark@some-email-provider.net
- Password: Password123!

OR

- Email: lisa@some-email-provider.net
- Password: Password123!

## Routes

### Patient Portal
- `/` - Login page
- `/dashboard` - Patient dashboard
- `/appointments` - Full appointment schedule
- `/prescriptions` - All prescriptions

### Admin EMR
- `/admin` - Patient list
- `/admin/patients/new` - Create new patient
- `/admin/patients/:id` - Patient details with CRUD for appointments/prescriptions

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.
