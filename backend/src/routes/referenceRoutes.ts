import express from 'express';
import { getMedications, getDosages } from '../controllers/referenceController';

const router = express.Router();

router.get('/medications', getMedications);
router.get('/dosages', getDosages);

export default router;
