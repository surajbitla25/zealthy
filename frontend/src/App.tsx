import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';

// Patient Portal Pages
import { LoginPage } from './pages/patient/LoginPage';
import { DashboardPage } from './pages/patient/DashboardPage';
import { AppointmentsPage } from './pages/patient/AppointmentsPage';
import { PrescriptionsPage } from './pages/patient/PrescriptionsPage';

// Admin EMR Pages
import { PatientListPage } from './pages/admin/PatientListPage';
import { PatientDetailPage } from './pages/admin/PatientDetailPage';
import { NewPatientPage } from './pages/admin/NewPatientPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Patient Portal Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute>
                <PrescriptionsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin EMR Routes */}
          <Route path="/admin" element={<PatientListPage />} />
          <Route path="/admin/patients/new" element={<NewPatientPage />} />
          <Route path="/admin/patients/:id" element={<PatientDetailPage />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
