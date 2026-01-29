import express from 'express';
import {
  getPatientPrescriptions,
  getUpcomingRefills,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from '../controllers/prescriptionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/refills', authenticateToken, getUpcomingRefills);
router.get('/:id', updatePrescription);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);

export default router;
