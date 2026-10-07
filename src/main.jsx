import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider'

const shouldUseApi = import.meta.env.VITE_USE_API === 'true'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider enabled={shouldUseApi}>
      <App />
    </AuthProvider>
  </StrictMode>,
)
