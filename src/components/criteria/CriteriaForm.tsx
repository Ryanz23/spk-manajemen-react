import React, { useEffect, useState } from 'react';
import { addCriterion, updateCriterion } from '@api/criteria';

interface Props {
  onSuccess: () => void;
  editData?: {
    id: string;
    name: string;
    weight: number;
  } | null;
}

export default function CriteriaForm({ onSuccess, editData }: Props) {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setWeight(editData.weight);
    } else {
      setName('');
      setWeight(0);
    }
  }, [editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editData) {
        await updateCriterion(editData.id, { name, weight });
      } else {
        await addCriterion({ name, weight });
      }
      onSuccess();
      setName('');
      setWeight(0);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan data');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <div>
        <label className='block font-medium text-gray-700'>Nama Kriteria</label>
        <input
          type="text"
          className="mt-1 w-full border border-gray-300 p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Bobot</label>
        <input
          type="number"
          className="mt-1 w-full border border-gray-300 p-2 rounded"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {editData ? 'Update' : 'Tambah'}
      </button>
    </form>
  );
}
