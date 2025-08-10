import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientById, createClient, updateClient } from '../../api/clients';
import { ArrowLeft } from 'lucide-react';
import type { Client } from '../../types'; // Assuming you have a central types file

export default function ClientForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEditing = Boolean(id);
  const clientId = id ? parseInt(id, 10) : undefined;

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Fetch existing client data if we are in "edit" mode
  const { data: clientData, isLoading: isLoadingClient } = useQuery<Client>({
    queryKey: ['clients', clientId],
    queryFn: () => getClientById(clientId!),
    enabled: isEditing && !isNaN(clientId!), // Only run if id is a valid number
  });

  // When the client data loads for editing, populate the form fields
  useEffect(() => {
    if (isEditing && clientData) {
      setName(clientData.name);
      setEmail(clientData.email);
      setPhone(clientData.phone || '');
      setAddress(clientData.address || '');
    }
  }, [clientData, isEditing]);

  const mutation = useMutation({
    mutationFn: (clientPayload: Partial<Client>) => 
      isEditing 
        ? updateClient(clientId!, clientPayload) 
        : createClient(clientPayload as Omit<Client, 'id'>),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] }); // Refresh the clients list
      navigate('/clients');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, email, phone, address };
    mutation.mutate(payload);
  };

  return (
    <div>
      <Link to="/clients" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Clients
      </Link>
      <div className="card max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Client' : 'Create New Client'}</h1>
        {isLoadingClient ? (
          <div>Loading client data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
              <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
              <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="input" rows={3}></textarea>
            </div>
            {mutation.isError && <div className="text-red-500 text-sm">{mutation.error.message}</div>}
            <button type="submit" className="btn btn-primary w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Client')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
