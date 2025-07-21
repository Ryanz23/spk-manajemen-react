import React, { useEffect, useState } from 'react';
import CriteriaList from '@components/criteria/CriteriaList';
import CriteriaForm from '@components/criteria/CriteriaForm';
import ScoreForm from '@components/scores/ScoreForm';
import ScoreList from '@components/scores/ScoreList';
import AlternativeForm from '@components/alternatives/AlternativeForm';
import AlternativeList from '@components/alternatives/AlternativeList';
import { getCriteria } from '@api/criteria';
import { getAlternatives } from '@api/alternatives';
import { getScores } from '@api/scores';

const HomePage: React.FC = () => {
  interface Criterion {
    id: string;
    name: string;
    weight: number;
  }

  interface Alternative {
    id: string;
    name: string;
  }

  const [editData, setEditData] = useState<{
    id: string;
    name: string;
    weight: number;
  } | null>(null);

  const [refresh, setRefresh] = useState(false);

  const handleSuccess = () => {
    setRefresh(!refresh); // Trigger refresh list
    setEditData(null); // Reset form
    fetchCriteria();
    fetchAlternatives();
  };

  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);

  const fetchCriteria = async () => {
    try {
      const res = await getCriteria();
      const data = res.data?.data ?? [];
      setCriteria(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.error('Gagal memuat data kriteria:', error);
      return [];
    }
  };

  const fetchAlternatives = async () => {
    try {
      const res = await getAlternatives();
      const data = res.data?.data ?? [];
      setAlternatives(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.error('Gagal memuat data alternatif:', error);
      return [];
    }
  };

  const fetchExistingScores = async (
    criteriaIds: string[],
    alternativeIds: string[],
  ) => {
    try {
      const res = await getScores(); // ambil semua skor
      const scores = res.data?.data ?? [];

      // Ubah menjadi format: { alternativeId: { criterionId: score } }
      const result: Record<string, Record<string, number>> = {};

      for (const score of scores) {
        const altId = score.alternative_id;
        const critId = score.criterion_id;

        if (!alternativeIds.includes(altId) || !criteriaIds.includes(critId)) {
          continue;
        }

        if (!result[altId]) result[altId] = {};
        result[altId][critId] = score.score;
      }

      return result;
    } catch (err) {
      console.error('Gagal mengambil skor yang sudah ada', err);
      return {};
    }
  };

  useEffect(() => {
    fetchCriteria();
    fetchAlternatives();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SPK Management Dashboard
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Kriteria Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Kriteria
              </h2>
            </div>
            <div className="p-6">
              <CriteriaForm onSuccess={handleSuccess} editData={editData} />
              <CriteriaList onEdit={setEditData} />
            </div>
          </div>

          {/* Alternatif Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Alternatif
              </h2>
            </div>
            <div className="p-6">
              <AlternativeForm />
              <AlternativeList />
            </div>
          </div>

          {/* Skor Penilaian Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 md:col-span-2 xl:col-span-1">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Skor Penilaian
              </h2>
            </div>
            <div className="p-6">
              <ScoreForm
                availableCriteria={criteria}
                availableAlternatives={alternatives}
                onFetchCriteria={fetchCriteria}
                onFetchAlternatives={fetchAlternatives}
                onFetchExistingScores={fetchExistingScores}
              />
              <ScoreList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
