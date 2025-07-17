import axios from './axios';

export const getAlternatives = async () => axios.get('/smart/alternatives');
export const addAlternative = (data: { name: string }) =>
  axios.post('/smart/alternatives', data);
export const deleteAlternative = (id: string) =>
  axios.delete(`/smart/alternatives/${id}`);
export const updateAlternative = (id: string, data: { name: string }) =>
  axios.put(`/smart/alternatives/${id}`, data);
