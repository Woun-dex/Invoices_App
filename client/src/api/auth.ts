import api from './axios'

// The backend expects JSON for registration: { username, email, password }
export const register = async (payload: { username: string; email: string; password: string }) => {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export const login = async (payload: { username: string; password: string }) => {
  const body = new URLSearchParams()
  body.append('username', payload.username)
  body.append('password', payload.password)

  const { data } = await api.post('/auth/login', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  return data
}

export const getUserProfile = async (token: string) => {
    const { data } = await api.get('/auth/users/me', {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    })
    return data
    }