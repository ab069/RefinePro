import { create } from 'zustand'
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  token: string | null
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('refinepro_token'),
  user: JSON.parse(localStorage.getItem('refinepro_user') || 'null'),
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('refinepro_token', data.access_token)
    localStorage.setItem('refinepro_user', JSON.stringify(data.user))
    set({ token: data.access_token, user: data.user })
  },
  register: async (email, password, name) => {
    const { data } = await api.post('/auth/register', { email, password, name })
    localStorage.setItem('refinepro_token', data.access_token)
    localStorage.setItem('refinepro_user', JSON.stringify(data.user))
    set({ token: data.access_token, user: data.user })
  },
  logout: () => {
    localStorage.removeItem('refinepro_token')
    localStorage.removeItem('refinepro_user')
    set({ token: null, user: null })
  },
}))

export default api
