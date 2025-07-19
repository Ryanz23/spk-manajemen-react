import React, { useEffect, useState } from 'react';
import { getScores } from '@api/scores';

type ScoreItem = {
  alternative_id: string;
  alternative_name: string;
  criterion_name: string;
  score: number;
};

const ScoreList: React.FC = () => {
  const [scores, setScores] = useState<ScoreItem[]>([]);

  const loadScores = async () => {
    try {
      const res = await getScores();
      setScores(res.data.data);
    } catch (error) {
      console.error('Gagal mengambil skor', error);
    }
  };

  useEffect(() => {
    loadScores();
  }, []);

  return (
    <div className="space-y-3">
      {scores.map((score, idx) => (
        <div
          key={idx}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-white transition-all duration-200 group"
        >
          <div className="text-gray-800 group-hover:text-purple-600 transition-colors">
            <h3 className="font-medium">{score.alternative_name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {score.criterion_name}: {score.score}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreList;
