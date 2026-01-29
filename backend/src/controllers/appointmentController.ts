import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { CreateAppointmentRequest, UpdateAppointmentRequest } from '../types';
import { AuthRequest } from '../middleware/auth';

export const getPatientAppointments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const appointments = await prisma.appointment.findMany({
      where: { userId: parseInt(id as string) },
      orderBy: { datetime: 'asc' },
    });

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUpcomingAppointments = async (
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

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: req.userId,
        datetime: {
          gte: now,
          lte: sevenDaysFromNow,
        },
      },
      orderBy: { datetime: 'asc' },
    });

    res.json(appointments);
  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { provider, datetime, repeatSchedule, endDate } =
      req.body as CreateAppointmentRequest;

    if (!provider || !datetime || !repeatSchedule) {
      res.status(400).json({
        error: 'Provider, datetime, and repeat schedule are required',
      });
      return;
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: parseInt(id as string),
        provider,
        datetime: new Date(datetime),
        repeatSchedule,
        ...(endDate && { endDate: new Date(endDate) }),
      },
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { provider, datetime, repeatSchedule, endDate } =
      req.body as UpdateAppointmentRequest;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id as string) },
      data: {
        ...(provider && { provider }),
        ...(datetime && { datetime: new Date(datetime) }),
        ...(repeatSchedule && { repeatSchedule }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      },
    });

    res.json(appointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id: parseInt(id as string) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
