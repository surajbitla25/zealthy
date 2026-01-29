import express from 'express';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from '../controllers/patientController';
import {
  getPatientAppointments,
  createAppointment,
} from '../controllers/appointmentController';
import {
  getPatientPrescriptions,
  createPrescription,
} from '../controllers/prescriptionController';

const router = express.Router();

router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

// Patient appointments
router.get('/:id/appointments', getPatientAppointments);
router.post('/:id/appointments', createAppointment);

// Patient prescriptions
router.get('/:id/prescriptions', getPatientPrescriptions);
router.post('/:id/prescriptions', createPrescription);

export default router;
