import api from './axios'
import type { Invoice } from '../types'

export const getInvoices = async (): Promise<Invoice[]> => {
  const { data } = await api.get('/invoices/')
  return data
}

export const getInvoice = async (id: number): Promise<Invoice> => {
  const { data } = await api.get(`/invoices/${id}`)
  return data
}

export const createInvoice = async (payload: Partial<Invoice>) => {
  const { data } = await api.post('/invoices/', payload)
  return data
}

export const getInvoiceById = async (invoiceId: number): Promise<Invoice> => {
  const { data } = await api.get(`/invoices/${invoiceId}`);
  return data;
};

export const updateInvoice = async (id: number, payload: Partial<Invoice>) => {
  const { data } = await api.put(`/invoices/${id}`, payload)
  return data
}

export const deleteInvoice = async (id: number) => {
  const { data } = await api.delete(`/invoices/${id}`)
  return data
}

export const downloadInvoice = async (id: number) => {
  const res = await api.get(`/invoices/${id}/download`, { responseType: 'blob' })
  return res.data
}