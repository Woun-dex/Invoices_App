import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients, deleteClient } from '../../api/clients';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
}

export default function ClientsPage() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const del = useMutation({
    mutationFn: (id: number) => deleteClient(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const renderContent = () => {
    if (isLoading) return <div>Loading clients...</div>;
    if (isError) return <div className="card text-red-500">Error: {error.message}</div>;
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold">No clients found</h3>
          <p className="text-gray-500 mt-2">Get started by creating your first client.</p>
          <Link to="/clients/new" className="btn btn-primary mt-4 inline-flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Client
          </Link>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {data.map((c: Client) => (
          <div key={c.id} className="card flex justify-between items-center">
            <div>
              <Link to={`/clients/${c.id}`} className="font-semibold text-blue-600 hover:underline">{c.name}</Link>
              <div className="text-sm text-gray-500">{c.email}</div>
            </div>
            <div className="flex gap-2">
              <Link to={`/clients/${c.id}/edit`} className="btn-sm">Edit</Link>
              <button className="btn-danger btn-sm" onClick={() => del.mutate(c.id)} disabled={del.isPending}>
                {del.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Link to="/clients/new" className="btn btn-primary">New Client</Link>
      </div>
      {renderContent()}
    </div>
  );
}
