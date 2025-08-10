
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML

from app.models.invoice import Invoice

env = Environment(loader=FileSystemLoader("app/template/"))
template = env.get_template("invoice_template.html")


def generate_invoice_pdf_bytes(invoice: Invoice) -> bytes:

    html_string = template.render(invoice=invoice)

    pdf_bytes = HTML(string=html_string).write_pdf()

    print(f"PDF for invoice {invoice.invoice_number} generated in memory.")

    return pdf_bytes
