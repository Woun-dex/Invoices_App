import api from './axios';
import type { DashboardStats } from '../types'; // Assuming a DashboardStats type

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/dashboard/');
  return data;
};
