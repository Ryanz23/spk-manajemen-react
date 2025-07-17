import axios from './axios';

export const getCriteria = async () => axios.get('/smart/criteria');
export const addCriterion = (data: { name: string; weight: number }) =>
  axios.post('/smart/criteria', data);
export const deleteCriterion = (id: string) =>
  axios.delete(`/smart/criteria/${id}`);
export const updateCriterion = (
  id: string,
  data: { name: string; weight: number },
) => axios.put(`/smart/criteria/${id}`, data);
