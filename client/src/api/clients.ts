import api from './axios'; // Import the configured axios instance
import type { Client } from '../types'; // Import the Client type

export const getClients = async (): Promise<Client[]> => {
  const { data } = await api.get('/clients/');
  return data;
};

export const getClientById = async (id: number): Promise<Client> => {
  const { data } = await api.get(`/clients/${id}`);
  return data;
};

export const createClient = async (payload: Partial<Client>): Promise<Client> => {
  const { data } = await api.post('/clients/', payload);
  return data;
};

export const updateClient = async (id: number, payload: Partial<Client>): Promise<Client> => {
  const { data } = await api.put(`/clients/${id}`, payload);
  return data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await api.delete(`/clients/${id}`);
};
