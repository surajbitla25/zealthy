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
      setIsLoading(true); // Reset loading state
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
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-medium">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Patient Portal</h1>
                <p className="text-sm text-text-secondary">Your personalized healthcare dashboard</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <Card className="mb-8 bg-gradient-to-br from-white to-mint-50 border-2 border-mint-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                Welcome back, {user?.name}! 👋
              </h2>
              <p className="text-text-secondary flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {user?.email}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <span className="text-4xl leading-none">🏥</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium mb-1">Next 7 Days</p>
                <p className="text-3xl font-bold text-primary">{upcomingAppointments.length}</p>
                <p className="text-text-secondary text-sm mt-1">Appointments</p>
              </div>
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium mb-1">Next 7 Days</p>
                <p className="text-3xl font-bold text-primary">{upcomingRefills.length}</p>
                <p className="text-text-secondary text-sm mt-1">Refills Due</p>
              </div>
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium mb-1">Next 7 Days</p>
                <p className="text-3xl font-bold text-purple-600">{upcomingAppointments.length + upcomingRefills.length}</p>
                <p className="text-text-secondary text-sm mt-1">Total Events</p>
              </div>
              <div className="w-14 h-14 bg-purple-600/10 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Appointments Card */}
          <Card title="📅 Upcoming Appointments">
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="bg-mint-50 rounded-xl p-4 border-l-4 border-primary hover-lift">
                    <p className="font-bold text-text-primary text-lg">{apt.provider}</p>
                    <p className="text-text-secondary mt-1 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {format(parseISO(apt.datetime), 'PPp')}
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      Repeats: {apt.repeatSchedule}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl leading-none">📅</span>
                </div>
                <p className="text-text-secondary">No upcoming appointments in the next 7 days</p>
              </div>
            )}
            <Button
              variant="secondary"
              className="mt-6 w-full"
              onClick={() => navigate('/appointments')}
            >
              View All Appointments →
            </Button>
          </Card>

          {/* Prescriptions Card */}
          <Card title="💊 Upcoming Refills">
            {upcomingRefills.length > 0 ? (
              <div className="space-y-4">
                {upcomingRefills.map((rx) => (
                  <div key={rx.id} className="bg-green-50 rounded-xl p-4 border-l-4 border-accent hover-lift">
                    <p className="font-bold text-text-primary text-lg">{rx.medication}</p>
                    <p className="text-text-secondary mt-1">
                      {rx.dosage} • Quantity: {rx.quantity}
                    </p>
                    <p className="text-text-secondary text-sm mt-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Refill on: {format(parseISO(rx.refillOn), 'PP')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl leading-none">💊</span>
                </div>
                <p className="text-text-secondary">No refills due in the next 7 days</p>
              </div>
            )}
            <Button
              variant="secondary"
              className="mt-6 w-full"
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
