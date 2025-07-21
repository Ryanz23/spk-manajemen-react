import React, { useState } from 'react';
import { addAlternative } from '@api/alternatives';

type Alternative = {
  name: string;
  scores: Record<string, number>;
};

interface Props {
  onSuccess?: () => void;
}

const AlternativeForm: React.FC<Props> = ({ onSuccess }) => {
  const [form, setForm] = useState<Alternative>({
    name: '',
    scores: {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      name: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // kirim dengan format sesuai backend
      await addAlternative({ ...form }); // tetap kirim scores kosong jika backend butuh
      setForm({ name: '', scores: {} });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create alternative', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <div>
        <label className="block font-medium text-gray-700">
          Nama Alternatif
        </label>
        <input
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Simpan Alternatif
      </button>
    </form>
  );
};

export default AlternativeForm;
