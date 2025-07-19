import React, { useEffect, useState } from 'react';
import { getCriteria, deleteCriterion } from '@api/criteria';

type Criterion = {
  id: string;
  name: string;
  weight: number;
};

interface Props {
  onEdit: (data: Criterion) => void;
}

const CriteriaList: React.FC<Props> = ({ onEdit }) => {
  const [criteria, setCriteria] = useState<Criterion[]>([]);

  const loadCriteria = async () => {
    try {
      const res = await getCriteria();
      setCriteria(res.data.data);
    } catch (error) {
      console.error('Failed to fetch criteria', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus data ini?')) {
      await deleteCriterion(id);
      loadCriteria();
    }
  };

  useEffect(() => {
    loadCriteria();
  }, []);

  return (
    <div className="space-y-3">
      {criteria.map((c) => (
        <div
          key={c.id}
          onClick={() => onEdit(c)}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-white transition-all duration-200 group cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {c.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">Bobot: {c.weight}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // biar gak trigger edit saat klik delete
                handleDelete(c.id);
              }}
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

export default CriteriaList;
