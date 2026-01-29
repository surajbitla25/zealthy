import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Appointment, CreateAppointmentData, UpdateAppointmentData } from '../../types';
import { appointmentService } from '../../services/appointmentService';
import { format } from 'date-fns';

interface AppointmentFormProps {
  patientId: number;
  appointment?: Appointment | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  patientId,
  appointment,
  onSuccess,
  onCancel,
}) => {
  const [provider, setProvider] = useState(appointment?.provider || '');
  const [datetime, setDatetime] = useState(
    appointment?.datetime ? format(new Date(appointment.datetime), "yyyy-MM-dd'T'HH:mm") : ''
  );
  const [repeatSchedule, setRepeatSchedule] = useState(appointment?.repeatSchedule || 'none');
  const [endDate, setEndDate] = useState(
    appointment?.endDate ? format(new Date(appointment.endDate), 'yyyy-MM-dd') : ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = {
        provider,
        datetime: new Date(datetime).toISOString(),
        repeatSchedule,
        endDate: endDate ? new Date(endDate).toISOString() : null,
      };

      if (appointment) {
        await appointmentService.updateAppointment(appointment.id, data as UpdateAppointmentData);
      } else {
        await appointmentService.createAppointment(patientId, data as CreateAppointmentData);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Provider Name"
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        placeholder="Dr. Smith"
        required
      />

      <Input
        label="Date & Time"
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        required
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Repeat Schedule
        </label>
        <select
          value={repeatSchedule}
          onChange={(e) => setRepeatSchedule(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="none">None</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {repeatSchedule !== 'none' && (
        <Input
          label="End Date (Optional)"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : appointment ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
