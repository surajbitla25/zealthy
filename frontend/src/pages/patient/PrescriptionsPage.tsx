import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Prescription } from '../../types';
import { prescriptionService } from '../../services/prescriptionService';
import { format, parseISO, isAfter } from 'date-fns';

export const PrescriptionsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user) return;
      
      setIsLoading(true); // Reset loading state
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
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary font-medium">Loading your prescriptions...</p>
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
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">My Prescriptions</h1>
                  <p className="text-sm text-text-secondary">All active medications</p>
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
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-white border-2 border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium mb-1">Active Prescriptions</p>
              <p className="text-4xl font-bold text-primary">{prescriptions.length}</p>
              <p className="text-text-secondary mt-2">medications currently prescribed</p>
            </div>
            <div className="hidden md:flex w-20 h-20 bg-primary/10 rounded-2xl items-center justify-center">
              <span className="text-4xl leading-none">💊</span>
            </div>
          </div>
        </Card>

        {/* Prescriptions List */}
        <Card title="💊 Your Medications">
          {prescriptions.length > 0 ? (
            <div className="space-y-4">
              {prescriptions.map((rx) => {
                const refillDate = parseISO(rx.refillOn);
                const isUpcoming = isAfter(refillDate, new Date());
                
                return (
                  <div 
                    key={rx.id} 
                    className="bg-gradient-to-r from-green-50 to-white p-6 rounded-xl border-2 border-green-100 hover-lift"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-text-primary mb-3">{rx.medication}</h3>
                        
                        {/* Details Grid */}
                        <div className="grid md:grid-cols-3 gap-4">
                          {/* Dosage */}
                          <div className="flex items-center gap-2 text-text-secondary">
                            <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            <div>
                              <p className="text-xs font-medium text-text-secondary">Dosage</p>
                              <p className="font-semibold text-text-primary">{rx.dosage}</p>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center gap-2 text-text-secondary">
                            <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <div>
                              <p className="text-xs font-medium text-text-secondary">Quantity</p>
                              <p className="font-semibold text-text-primary">{rx.quantity} units</p>
                            </div>
                          </div>

                          {/* Refill Date */}
                          <div className="flex items-center gap-2 text-text-secondary">
                            <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="text-xs font-medium text-text-secondary">Next Refill</p>
                              <p className="font-semibold text-text-primary">{format(refillDate, 'MMM d, yyyy')}</p>
                            </div>
                          </div>
                        </div>

                        {/* Schedule Badge */}
                        <div className="mt-4 flex items-center gap-3">
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {rx.refillSchedule} refills
                          </span>
                          {isUpcoming && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl leading-none">💊</span>
            </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No Active Prescriptions</h3>
              <p className="text-text-secondary mb-6">You don't have any prescriptions on file</p>
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
