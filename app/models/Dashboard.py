from pydantic import BaseModel

class DashboardStats(BaseModel):
    total_revenue: float
    pending_amount: float
    overdue_amount: float
    total_invoices: int