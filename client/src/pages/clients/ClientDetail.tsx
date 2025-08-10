import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getClientById } from '../../api/clients'; 
import { ArrowLeft } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const clientId = parseInt(id || '0', 10);

  const { data: client, isLoading, isError, error } = useQuery<Client>({
    queryKey: ['clients', clientId],
    queryFn: () => getClientById(clientId),
    enabled: !!clientId, // Only run the query if clientId is a valid number
  });

  if (isLoading) return <div>Loading client details...</div>;
  if (isError) return <div className="card text-red-500">Error: {error.message}</div>;

  return (
    <div>
      <Link to="/clients" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Clients
      </Link>
      <div className="card">
        <h1 className="text-3xl font-bold mb-2">{client?.name}</h1>
        <p className="text-lg text-gray-500 mb-6">{client?.email}</p>
        
        <div className="space-y-2">
          {client?.phone && <p><strong>Phone:</strong> {client.phone}</p>}
          {client?.address && <p><strong>Address:</strong> {client.address}</p>}
        </div>

        <div className="mt-8">
            <h2 className="text-xl font-semibold">Invoices</h2>
            <p className="text-gray-500 mt-2">Invoice history will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
