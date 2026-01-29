import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getMedications = async (req: Request, res: Response): Promise<void> => {
  try {
    const medications = await prisma.medication.findMany({
      orderBy: { name: 'asc' },
    });

    res.json(medications);
  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDosages = async (req: Request, res: Response): Promise<void> => {
  try {
    const dosages = await prisma.dosage.findMany({
      orderBy: { value: 'asc' },
    });

    res.json(dosages);
  } catch (error) {
    console.error('Get dosages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
