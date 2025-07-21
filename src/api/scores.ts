import axios from './axios';

// Ambil semua skor
export const getScores = async () => {
  return axios.get('/smart/scores');
};

// Tambah skor baru
export const addScore = async (data: {
  alternative_id: string;
  criterion_id: string;
  score: number;
}): Promise<void> => {
  await axios.post('/smart/scores', data);
};

// Update skor yang sudah ada
export const updateScore = async (data: {
  alternative_id: string;
  criterion_id: string;
  score: number;
}) => {
  return axios.put('/smart/scores', data);
};

// Hapus skor
export const deleteScore = async (data: {
  alternative_id: string;
  criterion_id: string;
}) => {
  return axios.delete('/smart/scores', { data });
};
