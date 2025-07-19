import React, { useEffect, useState } from 'react';
import { getAlternatives, deleteAlternative } from '@api/alternatives';

type Alternative = {
  id: string;
  name: string;
};

const AlternativeList: React.FC = () => {
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);

  const loadAlternatives = async () => {
    try {
      const res = await getAlternatives();
      console.log('API response:', res.data);
      // Pastikan selalu array
      setAlternatives(res.data.data);
    } catch (error) {
      console.error('Gagal mengambil data alternatif', error);
      setAlternatives([]); // fallback ke array kosong jika error
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus alternatif ini?')) {
      await deleteAlternative(id);
      loadAlternatives();
    }
  };

  useEffect(() => {
    loadAlternatives();
  }, []);

  return (
    <div className="space-y-3">
      {(alternatives ?? []).map((alt) => (
        <div
          key={alt.id}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-white transition-all duration-200 group"
        >
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                {alt.name}
              </h3>
            </div>
            <button
              onClick={() => handleDelete(alt.id)}
              className="ml-4 px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 hover:text-red-700 transition-colors duration-200 opacity-0 group-hover:opacity-100"
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlternativeList;
