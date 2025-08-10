import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInvoices, deleteInvoice } from '../../api/invoices'; // Create these API functions
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

interface Invoice {
  id: number;
  invoice_number: string;
  amount: number;
  status: string;
  due_at: string;
}

export default function InvoicesPage() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  });

  const del = useMutation({
    mutationFn: (id: number) => deleteInvoice(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const renderContent = () => {
    if (isLoading) return <div>Loading invoices...</div>;
    if (isError) return <div className="card text-red-500">Error: {error.message}</div>;
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold">No invoices found</h3>
          <p className="text-gray-500 mt-2">Get started by creating your first invoice.</p>
          <Link to="/invoices/new" className="btn btn-primary mt-4 inline-flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {data.map((invoice: Invoice) => (
          <div key={invoice.id} className="card flex justify-between items-center">
            <div>
              <Link to={`/invoices/${invoice.id}`} className="font-semibold text-blue-600 hover:underline">
                {invoice.invoice_number}
              </Link>
              <div className="text-sm text-gray-500">Due: {new Date(invoice.due_at).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-4">
                <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                    invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>{invoice.status}</span>
                <span className="text-lg font-semibold">${invoice.amount.toFixed(2)}</span>
                <button className="btn-danger btn-sm" onClick={() => del.mutate(invoice.id)} disabled={del.isPending}>
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
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Link to="/invoices/new" className="btn btn-primary">New Invoice</Link>
      </div>
      {renderContent()}
    </div>
  );
}
