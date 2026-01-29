import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
import { Prescription } from '../../types';
import { prescriptionService } from '../../services/prescriptionService';
import { format, parseISO } from 'date-fns';

export const PrescriptionsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user) return;
      
      try {
        const data = await prescriptionService.getPatientPrescriptions(user.id);
        setPrescriptions(data);
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
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
            <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          {prescriptions.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Medication</TableHeader>
                  <TableHeader>Dosage</TableHeader>
                  <TableHeader>Quantity</TableHeader>
                  <TableHeader>Next Refill</TableHeader>
                  <TableHeader>Refill Schedule</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.map((rx) => (
                  <TableRow key={rx.id}>
                    <TableCell>
                      <div className="font-medium">{rx.medication}</div>
                    </TableCell>
                    <TableCell>{rx.dosage}</TableCell>
                    <TableCell>{rx.quantity}</TableCell>
                    <TableCell>
                      {format(parseISO(rx.refillOn), 'PP')}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {rx.refillSchedule}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No prescriptions on file
            </p>
          )}
        </Card>
      </main>
    </div>
  );
};
