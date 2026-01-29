import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Prescription, CreatePrescriptionData, UpdatePrescriptionData, Medication, Dosage } from '../../types';
import { prescriptionService } from '../../services/prescriptionService';
import { referenceService } from '../../services/referenceService';
import { format } from 'date-fns';

interface PrescriptionFormProps {
  patientId: number;
  prescription?: Prescription | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  patientId,
  prescription,
  onSuccess,
  onCancel,
}) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [dosages, setDosages] = useState<Dosage[]>([]);
  const [medication, setMedication] = useState(prescription?.medication || '');
  const [dosage, setDosage] = useState(prescription?.dosage || '');
  const [quantity, setQuantity] = useState(prescription?.quantity?.toString() || '');
  const [refillOn, setRefillOn] = useState(
    prescription?.refillOn ? format(new Date(prescription.refillOn), 'yyyy-MM-dd') : ''
  );
  const [refillSchedule, setRefillSchedule] = useState(prescription?.refillSchedule || 'monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [meds, doses] = await Promise.all([
          referenceService.getMedications(),
          referenceService.getDosages(),
        ]);
        setMedications(meds);
        setDosages(doses);
      } catch (error) {
        console.error('Failed to fetch reference data:', error);
      }
    };

    fetchReferenceData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = {
        medication,
        dosage,
        quantity: parseInt(quantity),
        refillOn: new Date(refillOn).toISOString(),
        refillSchedule,
      };

      if (prescription) {
        await prescriptionService.updatePrescription(prescription.id, data as UpdatePrescriptionData);
      } else {
        await prescriptionService.createPrescription(patientId, data as CreatePrescriptionData);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save prescription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Medication
        </label>
        <select
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select medication...</option>
          {medications.map((med) => (
            <option key={med.id} value={med.name}>
              {med.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dosage
        </label>
        <select
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select dosage...</option>
          {dosages.map((dose) => (
            <option key={dose.id} value={dose.value}>
              {dose.value}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Quantity"
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="1"
        required
      />

      <Input
        label="Refill Date"
        type="date"
        value={refillOn}
        onChange={(e) => setRefillOn(e.target.value)}
        required
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Refill Schedule
        </label>
        <select
          value={refillSchedule}
          onChange={(e) => setRefillSchedule(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
      </div>

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
          {isLoading ? 'Saving...' : prescription ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
