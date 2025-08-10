import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/dashboard'; // Assuming you create this API function
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Define the shape of the dashboard data
interface DashboardStats {
    total_revenue: number;
    pending_amount: number;
    overdue_amount: number;
    total_invoices: number;
}

export default function DashboardPage() {
    const { data, isLoading, isError } = useQuery<DashboardStats>({
        queryKey: ['dashboardStats'],
        queryFn: getDashboardStats,
    });

    if (isLoading) return <div>Loading dashboard...</div>;
    if (isError) return <div className="card text-red-500">Error loading dashboard statistics.</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card">
                    <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Total Revenue (Paid)</p>
                            <p className="text-2xl font-bold">${data?.total_revenue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center">
                        <Clock className="h-8 w-8 text-yellow-500" />
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Pending Amount</p>
                            <p className="text-2xl font-bold">${data?.pending_amount.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Overdue Amount</p>
                            <p className="text-2xl font-bold">${data?.overdue_amount.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
