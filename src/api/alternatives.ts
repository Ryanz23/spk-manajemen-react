import axios from './axios';

export const getAlternatives = async () => axios.get('/smart/alternatives');
export const addAlternative = (data: { name: string }) =>
  axios.post('/smart/alternatives', data);
export const deleteAlternative = (id: string) =>
  axios.delete(`/smart/alternatives/${id}`);
export const updateAlternativeScores = (id: string, scores: Record<string, number>) =>
  axios.put(`/smart/alternatives/${id}/scores`, { scores });
