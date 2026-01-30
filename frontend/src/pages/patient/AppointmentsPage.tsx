import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Appointment } from '../../types';
import { appointmentService } from '../../services/appointmentService';
import { format, parseISO, addMonths } from 'date-fns';

export const AppointmentsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      setIsLoading(true); // Reset loading state
      try {
        const data = await appointmentService.getPatientAppointments(user.id);
        // Filter appointments for next 3 months
        const threeMonthsFromNow = addMonths(new Date(), 3);
        const filtered = data.filter(apt => {
          const aptDate = parseISO(apt.datetime);
          return aptDate <= threeMonthsFromNow && aptDate >= new Date();
        });
        setAppointments(filtered);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary font-medium">Loading your appointments...</p>
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
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">My Appointments</h1>
                  <p className="text-sm text-text-secondary">Next 3 months</p>
                </div>
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
        {/* Summary Card */}
        <Card className="mb-6 bg-gradient-to-r from-mint-50 to-white border-2 border-mint-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium mb-1">Total Scheduled</p>
              <p className="text-4xl font-bold text-primary">{appointments.length}</p>
              <p className="text-text-secondary mt-2">appointments in the next 3 months</p>
            </div>
            <div className="hidden md:flex w-20 h-20 bg-primary/10 rounded-2xl items-center justify-center">
              <span className="text-4xl leading-none">📅</span>
            </div>
          </div>
        </Card>

        {/* Appointments List */}
        <Card title="📅 Upcoming Appointments">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div 
                  key={apt.id} 
                  className="bg-gradient-to-r from-mint-50 to-white p-6 rounded-xl border-2 border-mint-100 hover-lift"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary mb-2">{apt.provider}</h3>
                      
                      <div className="flex flex-wrap gap-4 text-text-secondary">
                        {/* Date & Time */}
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">{format(parseISO(apt.datetime), 'EEEE, MMMM d, yyyy')}</span>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{format(parseISO(apt.datetime), 'h:mm a')}</span>
                        </div>
                      </div>

                      {/* Repeat Schedule Badge */}
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Repeats: {apt.repeatSchedule}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
            <div className="w-24 h-24 bg-mint-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl leading-none">📅</span>
            </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No Upcoming Appointments</h3>
              <p className="text-text-secondary mb-6">You don't have any appointments scheduled in the next 3 months</p>
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};
