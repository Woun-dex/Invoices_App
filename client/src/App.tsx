import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import DashboardPage from './pages/Dashboard';
import ClientsPage from './pages/clients/ClientsList';
import ClientDetail from './pages/clients/ClientDetail';
import ClientForm from './pages/clients/ClientForm'; // 1. Import the new form
import InvoicesPage from './pages/invoices/InvoicesList';
import InvoiceDetail from './pages/invoices/InvoiceDetail';
import InvoiceForm from './pages/invoices/InvoiceForm';
import ProtectedLayout from './pages/ProtectedLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<DashboardPage />} />
        
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/new" element={<ClientForm />} /> {/* 2. Add route for creating */}
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="/clients/:id/edit" element={<ClientForm />} /> {/* 3. Add route for editing */}
        
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/invoices/new" element={<InvoiceForm />} />
        <Route path="/invoices/:id" element={<InvoiceDetail />} />
        <Route path="/invoices/:id/edit" element={<InvoiceForm />} />
      </Route>
    </Routes>
  );
}
