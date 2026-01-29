import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              ← Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          {appointments.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Provider</TableHeader>
                  <TableHeader>Date & Time</TableHeader>
                  <TableHeader>Repeat Schedule</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>
                      <div className="font-medium">{apt.provider}</div>
                    </TableCell>
                    <TableCell>
                      {format(parseISO(apt.datetime), 'PPp')}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {apt.repeatSchedule}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No upcoming appointments scheduled
            </p>
          )}
        </Card>
      </main>
    </div>
  );
};
