import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Appointment, Prescription } from '../../types';
import { appointmentService } from '../../services/appointmentService';
import { prescriptionService } from '../../services/prescriptionService';
import { format, parseISO } from 'date-fns';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [upcomingRefills, setUpcomingRefills] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointments, refills] = await Promise.all([
          appointmentService.getUpcomingAppointments(),
          prescriptionService.getUpcomingRefills(),
        ]);
        setUpcomingAppointments(appointments);
        setUpcomingRefills(refills);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray-600">{user?.email}</p>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card title="Upcoming Appointments (Next 7 Days)">
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold">{apt.provider}</p>
                    <p className="text-sm text-gray-600">
                      {format(parseISO(apt.datetime), 'PPp')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Repeats: {apt.repeatSchedule}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming appointments</p>
            )}
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => navigate('/appointments')}
            >
              View All Appointments →
            </Button>
          </Card>

          <Card title="Upcoming Refills (Next 7 Days)">
            {upcomingRefills.length > 0 ? (
              <div className="space-y-4">
                {upcomingRefills.map((rx) => (
                  <div key={rx.id} className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold">{rx.medication}</p>
                    <p className="text-sm text-gray-600">
                      {rx.dosage} - Qty: {rx.quantity}
                    </p>
                    <p className="text-xs text-gray-500">
                      Refill on: {format(parseISO(rx.refillOn), 'PP')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming refills</p>
            )}
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => navigate('/prescriptions')}
            >
              View All Prescriptions →
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};
