import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Patient, Appointment, Prescription } from '../../types';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { prescriptionService } from '../../services/prescriptionService';
import { format, parseISO } from 'date-fns';
import { AppointmentForm } from '../../components/admin/AppointmentForm';
import { PrescriptionForm } from '../../components/admin/PrescriptionForm';

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    if (!id) return;
    
    try {
      const data = await patientService.getPatientById(parseInt(id));
      setPatient(data);
    } catch (error) {
      console.error('Failed to fetch patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId: number) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
      await appointmentService.deleteAppointment(appointmentId);
      fetchPatient();
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  const handleDeletePrescription = async (prescriptionId: number) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;
    
    try {
      await prescriptionService.deletePrescription(prescriptionId);
      fetchPatient();
    } catch (error) {
      console.error('Failed to delete prescription:', error);
      alert('Failed to delete prescription');
    }
  };

  const handleAppointmentSuccess = () => {
    setShowAppointmentModal(false);
    setEditingAppointment(null);
    fetchPatient();
  };

  const handlePrescriptionSuccess = () => {
    setShowPrescriptionModal(false);
    setEditingPrescription(null);
    fetchPatient();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary font-medium">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Card className="max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl leading-none">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Patient Not Found</h2>
          <p className="text-text-secondary mb-6">The patient you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/admin')}>
            Back to Patient List
          </Button>
        </Card>
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
              <Button variant="ghost" onClick={() => navigate('/admin')} className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Patients
              </Button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-medium">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">{patient.name}</h1>
                  <p className="text-sm text-text-secondary">Patient Record</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Patient Info Card */}
        <Card className="bg-gradient-to-br from-white to-mint-50 border-2 border-mint-100">
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            Patient Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl border-2 border-mint-50">
              <p className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </p>
              <p className="text-lg font-bold text-text-primary">{patient.name}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border-2 border-mint-50">
              <p className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </p>
              <p className="text-lg font-bold text-text-primary">{patient.email}</p>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium mb-1">Scheduled</p>
                <p className="text-4xl font-bold text-primary">{patient.appointments?.length || 0}</p>
                <p className="text-text-secondary mt-1">Appointments</p>
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium mb-1">Active</p>
                <p className="text-4xl font-bold text-accent">{patient.prescriptions?.length || 0}</p>
                <p className="text-text-secondary mt-1">Prescriptions</p>
              </div>
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Appointments Section */}
        <Card title="📅 Appointments">
          <div className="flex justify-end mb-6">
            <Button variant="primary" onClick={() => setShowAppointmentModal(true)}>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Appointment
              </span>
            </Button>
          </div>

          {patient.appointments && patient.appointments.length > 0 ? (
            <div className="space-y-4">
              {patient.appointments.map((apt) => (
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
                      
                      <div className="flex flex-wrap gap-4 text-text-secondary mb-3">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">{format(parseISO(apt.datetime), 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{format(parseISO(apt.datetime), 'h:mm a')}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Repeats: {apt.repeatSchedule}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingAppointment(apt);
                          setShowAppointmentModal(true);
                        }}
                        className="w-full justify-center"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </span>
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className="w-full justify-center"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-mint-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl leading-none">📅</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No Appointments</h3>
              <p className="text-text-secondary mb-4">This patient has no appointments scheduled</p>
              <Button variant="secondary" onClick={() => setShowAppointmentModal(true)}>
                Schedule First Appointment
              </Button>
            </div>
          )}
        </Card>

        {/* Prescriptions Section */}
        <Card title="💊 Prescriptions">
          <div className="flex justify-end mb-6">
            <Button variant="primary" onClick={() => setShowPrescriptionModal(true)}>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Prescription
              </span>
            </Button>
          </div>

          {patient.prescriptions && patient.prescriptions.length > 0 ? (
            <div className="space-y-4">
              {patient.prescriptions.map((rx) => (
                <div 
                  key={rx.id}
                  className="bg-gradient-to-r from-green-50 to-white p-6 rounded-xl border-2 border-green-100 hover-lift"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary mb-3">{rx.medication}</h3>
                      
                      <div className="grid md:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          <div>
                            <p className="text-xs font-medium text-text-secondary">Dosage</p>
                            <p className="font-semibold text-text-primary">{rx.dosage}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-text-secondary">
                          <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <div>
                            <p className="text-xs font-medium text-text-secondary">Quantity</p>
                            <p className="font-semibold text-text-primary">{rx.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-text-secondary">
                          <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-xs font-medium text-text-secondary">Next Refill</p>
                            <p className="font-semibold text-text-primary">{format(parseISO(rx.refillOn), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-text-secondary">
                          <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <div>
                            <p className="text-xs font-medium text-text-secondary">Schedule</p>
                            <p className="font-semibold text-text-primary">{rx.refillSchedule}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingPrescription(rx);
                          setShowPrescriptionModal(true);
                        }}
                        className="w-full justify-center"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </span>
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeletePrescription(rx.id)}
                        className="w-full justify-center"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                          Delete
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl leading-none">💊</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No Prescriptions</h3>
              <p className="text-text-secondary mb-4">This patient has no prescriptions on file</p>
              <Button variant="secondary" onClick={() => setShowPrescriptionModal(true)}>
                Add First Prescription
              </Button>
            </div>
          )}
        </Card>
      </main>

      <Modal
        isOpen={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false);
          setEditingAppointment(null);
        }}
        title={editingAppointment ? 'Edit Appointment' : 'Add Appointment'}
      >
        <AppointmentForm
          patientId={patient.id}
          appointment={editingAppointment}
          onSuccess={handleAppointmentSuccess}
          onCancel={() => {
            setShowAppointmentModal(false);
            setEditingAppointment(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showPrescriptionModal}
        onClose={() => {
          setShowPrescriptionModal(false);
          setEditingPrescription(null);
        }}
        title={editingPrescription ? 'Edit Prescription' : 'Add Prescription'}
      >
        <PrescriptionForm
          patientId={patient.id}
          prescription={editingPrescription}
          onSuccess={handlePrescriptionSuccess}
          onCancel={() => {
            setShowPrescriptionModal(false);
            setEditingPrescription(null);
          }}
        />
      </Modal>
    </div>
  );
};
