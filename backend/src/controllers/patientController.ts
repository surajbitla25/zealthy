import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { CreateUserRequest, UpdateUserRequest } from '../types';

export const getAllPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const patients = await prisma.user.findMany({
      include: {
        appointments: {
          orderBy: { datetime: 'asc' },
          take: 5,
        },
        prescriptions: {
          orderBy: { refillOn: 'asc' },
          take: 5,
        },
      },
      orderBy: { name: 'asc' },
    });

    const patientsResponse = patients.map((patient: any) => ({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      upcomingAppointmentsCount: patient.appointments.length,
      prescriptionsCount: patient.prescriptions.length,
    }));

    res.json(patientsResponse);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const patient = await prisma.user.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        appointments: {
          orderBy: { datetime: 'asc' },
        },
        prescriptions: {
          orderBy: { refillOn: 'asc' },
        },
      },
    });

    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    res.json({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      appointments: patient.appointments,
      prescriptions: patient.prescriptions,
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as CreateUserRequest;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const patient = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    res.status(201).json({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email } = req.body as UpdateUserRequest;

    const patient = await prisma.user.update({
      where: { id: parseInt(id as string) },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    res.json({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id as string) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
