import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { CreatePrescriptionRequest, UpdatePrescriptionRequest } from '../types';
import { AuthRequest } from '../middleware/auth';

export const getPatientPrescriptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const prescriptions = await prisma.prescription.findMany({
      where: { userId: parseInt(id) },
      orderBy: { refillOn: 'asc' },
    });

    res.json(prescriptions);
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUpcomingRefills = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const prescriptions = await prisma.prescription.findMany({
      where: {
        userId: req.userId,
        refillOn: {
          gte: now,
          lte: sevenDaysFromNow,
        },
      },
      orderBy: { refillOn: 'asc' },
    });

    res.json(prescriptions);
  } catch (error) {
    console.error('Get upcoming refills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPrescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { medication, dosage, quantity, refillOn, refillSchedule } =
      req.body as CreatePrescriptionRequest;

    if (!medication || !dosage || !quantity || !refillOn || !refillSchedule) {
      res.status(400).json({
        error: 'All prescription fields are required',
      });
      return;
    }

    const prescription = await prisma.prescription.create({
      data: {
        userId: parseInt(id),
        medication,
        dosage,
        quantity,
        refillOn: new Date(refillOn),
        refillSchedule,
      },
    });

    res.status(201).json(prescription);
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePrescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { medication, dosage, quantity, refillOn, refillSchedule } =
      req.body as UpdatePrescriptionRequest;

    const prescription = await prisma.prescription.update({
      where: { id: parseInt(id) },
      data: {
        ...(medication && { medication }),
        ...(dosage && { dosage }),
        ...(quantity && { quantity }),
        ...(refillOn && { refillOn: new Date(refillOn) }),
        ...(refillSchedule && { refillSchedule }),
      },
    });

    res.json(prescription);
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePrescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.prescription.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
