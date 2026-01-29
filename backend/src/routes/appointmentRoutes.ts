import express from 'express';
import {
  getPatientAppointments,
  getUpcomingAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/upcoming', authenticateToken, getUpcomingAppointments);
router.get('/:id', updateAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
