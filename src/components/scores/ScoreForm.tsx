import React, { useEffect, useState, useMemo } from 'react';
import { addScore } from '@api/scores';

interface Criterion {
  id: string;
  name: string;
  weight: number;
}

interface Alternative {
  id: string;
  name: string;
}

interface Props {
  onSuccess?: () => void;
  // Props untuk data yang tersedia untuk dipilih
  availableCriteria?: Criterion[];
  availableAlternatives?: Alternative[];
  // Props untuk fetch functions jika diperlukan
  onFetchCriteria?: () => Promise<Criterion[]>;
  onFetchAlternatives?: () => Promise<Alternative[]>;
  onFetchExistingScores?: (
    criteriaIds: string[],
    alternativeIds: string[],
  ) => Promise<Record<string, Record<string, number>>>;
}

const ScoreForm: React.FC<Props> = ({
  onSuccess,
  availableCriteria = [],
  availableAlternatives = [],
  onFetchCriteria,
  onFetchAlternatives,
  onFetchExistingScores,
}) => {
  // States untuk data yang tersedia
  const [allCriteria, setAllCriteria] =
    useState<Criterion[]>(availableCriteria);
  const [allAlternatives, setAllAlternatives] = useState<Alternative[]>(
    availableAlternatives,
  );

  // States untuk pilihan user
  const [selectedCriteriaIds, setSelectedCriteriaIds] = useState<string[]>([]);
  const [selectedAlternativeIds, setSelectedAlternativeIds] = useState<
    string[]
  >([]);

  // States untuk scores
  const [scores, setScores] = useState<Record<string, Record<string, number>>>(
    {},
  );
  const [existingScores, setExistingScores] = useState<
    Record<string, Record<string, number>>
  >({});

  // Loading states
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setFetchingData(true);
      try {
        if (onFetchCriteria && allCriteria.length === 0) {
          const criteria = await onFetchCriteria();
          setAllCriteria(criteria);
        }

        if (onFetchAlternatives && allAlternatives.length === 0) {
          const alternatives = await onFetchAlternatives();
          setAllAlternatives(alternatives);
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchInitialData();
  }, [
    onFetchCriteria,
    onFetchAlternatives,
    allCriteria.length,
    allAlternatives.length,
  ]);

  // Get selected data
  const selectedCriteria = useMemo(
    () => allCriteria.filter((c) => selectedCriteriaIds.includes(c.id)),
    [allCriteria, selectedCriteriaIds],
  );

  const selectedAlternatives = useMemo(
    () => allAlternatives.filter((a) => selectedAlternativeIds.includes(a.id)),
    [allAlternatives, selectedAlternativeIds],
  );

  // Fetch existing scores when selection changes
  useEffect(() => {
    const fetchScores = async () => {
      if (
        selectedCriteriaIds.length > 0 &&
        selectedAlternativeIds.length > 0 &&
        onFetchExistingScores
      ) {
        try {
          const existingData = await onFetchExistingScores(
            selectedCriteriaIds,
            selectedAlternativeIds,
          );
          setExistingScores(existingData);
        } catch (error) {
          console.error('Failed to fetch existing scores:', error);
        }
      }
    };

    fetchScores();
  }, [selectedCriteriaIds, selectedAlternativeIds, onFetchExistingScores]);

  // Initialize scores when selections change
  useEffect(() => {
    if (selectedAlternatives.length > 0 && selectedCriteria.length > 0) {
      const initialScores: Record<string, Record<string, number>> = {};

      selectedAlternatives.forEach((alt) => {
        initialScores[alt.id] = {};
        selectedCriteria.forEach((crit) => {
          initialScores[alt.id][crit.id] =
            existingScores[alt.id]?.[crit.id] || 0;
        });
      });

      setScores(initialScores);
    }
  }, [selectedCriteria, selectedAlternatives, existingScores]);

  const handleCriteriaSelection = (criteriaId: string, checked: boolean) => {
    setSelectedCriteriaIds((prev) =>
      checked ? [...prev, criteriaId] : prev.filter((id) => id !== criteriaId),
    );
  };

  const handleAlternativeSelection = (
    alternativeId: string,
    checked: boolean,
  ) => {
    setSelectedAlternativeIds((prev) =>
      checked
        ? [...prev, alternativeId]
        : prev.filter((id) => id !== alternativeId),
    );
  };

  const handleScoreChange = (
    alternativeId: string,
    criteriaId: string,
    value: number,
  ) => {
    setScores((prev) => ({
      ...prev,
      [alternativeId]: {
        ...prev[alternativeId],
        [criteriaId]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedAlternatives.length === 0 || selectedCriteria.length === 0) {
      alert('Harap pilih kriteria dan alternatif terlebih dahulu');
      return;
    }

    setLoading(true);

    try {
      const promises: Promise<void>[] = [];

      for (const alternativeId of selectedAlternativeIds) {
        for (const criterionId of selectedCriteriaIds) {
          const score = scores[alternativeId]?.[criterionId];
          if (typeof score === 'number') {
            promises.push(
              addScore({
                alternative_id: alternativeId,
                criterion_id: criterionId,
                score,
              }),
            );
          }
        }
      }

      await Promise.all(promises);

      onSuccess?.();
      alert('Skor berhasil disimpan');
    } catch (error) {
      console.error('Failed to add scores', error);
      alert('Gagal menyimpan skor');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="p-4 bg-blue-100 border border-blue-400 rounded">
        <p className="text-blue-700">Memuat data kriteria dan alternatif...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selection Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Criteria Selection */}
        <div className="border border-gray-300 rounded p-4">
          <h3 className="font-semibold mb-3 text-gray-700">Pilih Kriteria:</h3>
          {allCriteria.length === 0 ? (
            <p className="text-gray-500">Tidak ada kriteria tersedia</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allCriteria.map((criterion) => (
                <label
                  key={criterion.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedCriteriaIds.includes(criterion.id)}
                    onChange={(e) =>
                      handleCriteriaSelection(criterion.id, e.target.checked)
                    }
                    className="rounded"
                  />
                  <span className="text-sm">
                    {criterion.name} (Bobot: {criterion.weight})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Alternatives Selection */}
        <div className="border border-gray-300 rounded p-4">
          <h3 className="font-semibold mb-3 text-gray-700">
            Pilih Alternatif:
          </h3>
          {allAlternatives.length === 0 ? (
            <p className="text-gray-500">Tidak ada alternatif tersedia</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allAlternatives.map((alternative) => (
                <label
                  key={alternative.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedAlternativeIds.includes(alternative.id)}
                    onChange={(e) =>
                      handleAlternativeSelection(
                        alternative.id,
                        e.target.checked,
                      )
                    }
                    className="rounded"
                  />
                  <span className="text-sm">{alternative.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Score Input Section */}
      {selectedCriteria.length > 0 && selectedAlternatives.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4 text-gray-700">Input Skor:</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Alternatif
                    </th>
                    {selectedCriteria.map((criterion) => (
                      <th
                        key={criterion.id}
                        className="border border-gray-300 px-4 py-2 text-center"
                      >
                        {criterion.name}
                        <br />
                        <span className="text-sm text-gray-600">
                          (Bobot: {criterion.weight})
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedAlternatives.map((alternative) => (
                    <tr key={alternative.id}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {alternative.name}
                      </td>
                      {selectedCriteria.map((criterion) => (
                        <td
                          key={criterion.id}
                          className="border border-gray-300 px-2 py-2"
                        >
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-full border border-gray-300 p-2 rounded text-center"
                            value={scores[alternative.id]?.[criterion.id] || 0}
                            onChange={(e) =>
                              handleScoreChange(
                                alternative.id,
                                criterion.id,
                                Number(e.target.value),
                              )
                            }
                            required
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Menyimpan...' : 'Simpan Semua Skor'}
            </button>
          </div>
        </form>
      ) : (
        <div className="border-t pt-6">
          <div className="p-4 bg-gray-100 border border-gray-300 rounded text-center">
            <p className="text-gray-600">
              Pilih minimal satu kriteria dan satu alternatif untuk mulai input
              skor
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreForm;
