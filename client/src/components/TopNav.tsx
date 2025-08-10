import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function TopNav() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-lg font-bold">Prestige Invoice</Link>
        <nav className="flex gap-4 items-center">
          {token ? (
            <>
              <Link to="/clients" className="text-sm">Clients</Link>
              <Link to="/invoices" className="text-sm">Invoices</Link>
              <button onClick={handleLogout} className="text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="text-sm">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}