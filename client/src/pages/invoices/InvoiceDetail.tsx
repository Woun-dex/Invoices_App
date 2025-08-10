import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getInvoice, downloadInvoice } from '../../api/invoices'

export default function InvoiceDetail() {
  const { id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoice(Number(id)),
  })

  const handleDownload = async () => {
    if (!data) return
    const blob = await downloadInvoice(Number(id))
    const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.invoice_number}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="card">
      <h2 className="text-xl font-semibold">{data?.invoice_number}</h2>
      <div className="mt-2">Amount: ${data?.amount?.toFixed(2)}</div>
      <div>Status: {data?.status}</div>
      <div>Issued: {data?.issued_at}</div>
      <div>Due: {data?.due_at}</div>

      <div className="mt-4 space-x-2">
        <button className="btn" onClick={handleDownload}>Download PDF</button>
      </div>
    </div>
  )
}