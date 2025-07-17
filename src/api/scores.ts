import axios from './axios';

export const getScores = async () => axios.get('/smart/scores');
export const addScore = (data: {
  alternative_id: string;
  criterion_id: string;
  score: number;
}) => axios.post('/smart/scores', data);
export const deleteScore = (data: {
  alternative_id: string;
  criterion_id: string;
}) => axios.delete('/smart/scores', { data });
export const updateScore = (data: {
  alternative_id: string;
  criterion_id: string;
  score: number;
}) => axios.put('/smart/scores', data);
