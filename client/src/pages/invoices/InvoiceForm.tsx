import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInvoiceById, createInvoice, updateInvoice } from '../../api/invoices';
import { getClients } from '../../api/clients';
import type { Client} from '../../types'; // Assuming you have a Client type defined'; 
import { ArrowLeft } from 'lucide-react';

export default function InvoiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEditing = Boolean(id);

  // Form state
  const [clientId, setClientId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [issuedAt, setIssuedAt] = useState<string>('');
  const [dueAt, setDueAt] = useState<string>('');

  // Fetch existing invoice data if we are editing
  const { data: invoiceData, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ['invoices', id],
    queryFn: () => getInvoiceById(parseInt(id!)),
    enabled: isEditing,
  });

  // Fetch clients for the dropdown
  const { data: clients, isLoading: isLoadingClients } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  // Populate form when editing data is loaded
  useEffect(() => {
    if (isEditing && invoiceData) {
      setClientId(String(invoiceData.client_id));
      setAmount(String(invoiceData.amount));
      setIssuedAt(invoiceData.issued_at.split('T')[0]); // Format date for input
      setDueAt(invoiceData.due_at.split('T')[0]);
    }
  }, [invoiceData, isEditing]);

  const mutation = useMutation({
    mutationFn: (newInvoice: any) => 
        isEditing 
        ? updateInvoice(parseInt(id!), newInvoice) 
        : createInvoice(newInvoice),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      navigate('/invoices');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ client_id: parseInt(clientId), amount: parseFloat(amount), issued_at: issuedAt, due_at: dueAt });
  };
  
  const isLoading = isLoadingInvoice || isLoadingClients;

  return (
    <div>
        <Link to="/invoices" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
        </Link>
        <div className="card max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Invoice' : 'Create New Invoice'}</h1>
            {isLoading ? (
                <div>Loading form...</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                        <select id="client" value={clientId} onChange={(e) => setClientId(e.target.value)} className="input" required>
                            <option value="" disabled>Select a client</option>
                            {clients?.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                        <input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="input" required />
                    </div>
                    <div>
                        <label htmlFor="issuedAt" className="block text-sm font-medium text-gray-700 mb-1">Issued Date</label>
                        <input id="issuedAt" type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)} className="input" required />
                    </div>
                    <div>
                        <label htmlFor="dueAt" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input id="dueAt" type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} className="input" required />
                    </div>
                    {mutation.isError && <div className="text-red-500 text-sm">{mutation.error.message}</div>}
                    <button type="submit" className="btn btn-primary w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Invoice')}
                    </button>
                </form>
            )}
        </div>
    </div>
  );
}
