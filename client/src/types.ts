export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE'

export interface Invoice {
  id: number
  invoice_number: string
  amount: number
  status: InvoiceStatus
  issued_at: string
  due_at: string
  client_id: number
  owner_id: number
}

export interface Client {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
}

export interface DashboardStats {
  total_revenue: number
  pending_amount: number
  overdue_amount: number
  total_invoices: number
}