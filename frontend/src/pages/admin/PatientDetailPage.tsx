import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Patient not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              ← Back to Patients
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card title="Patient Information">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{patient.email}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Appointments</h3>
            <Button onClick={() => setShowAppointmentModal(true)}>
              + Add Appointment
            </Button>
          </div>

          {patient.appointments && patient.appointments.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Provider</TableHeader>
                  <TableHeader>Date & Time</TableHeader>
                  <TableHeader>Repeat</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient.appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>{apt.provider}</TableCell>
                    <TableCell>{format(parseISO(apt.datetime), 'PPp')}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {apt.repeatSchedule}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingAppointment(apt);
                            setShowAppointmentModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteAppointment(apt.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">No appointments scheduled</p>
          )}
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Prescriptions</h3>
            <Button onClick={() => setShowPrescriptionModal(true)}>
              + Add Prescription
            </Button>
          </div>

          {patient.prescriptions && patient.prescriptions.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Medication</TableHeader>
                  <TableHeader>Dosage</TableHeader>
                  <TableHeader>Quantity</TableHeader>
                  <TableHeader>Next Refill</TableHeader>
                  <TableHeader>Schedule</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient.prescriptions.map((rx) => (
                  <TableRow key={rx.id}>
                    <TableCell>{rx.medication}</TableCell>
                    <TableCell>{rx.dosage}</TableCell>
                    <TableCell>{rx.quantity}</TableCell>
                    <TableCell>{format(parseISO(rx.refillOn), 'PP')}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {rx.refillSchedule}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingPrescription(rx);
                            setShowPrescriptionModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeletePrescription(rx.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">No prescriptions on file</p>
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
