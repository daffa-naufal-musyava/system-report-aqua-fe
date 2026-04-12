import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './routes/index.jsx'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { RouterProvider } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
)
