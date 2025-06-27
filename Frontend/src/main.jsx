import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CodeProvider } from './contexts/CodeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CodeProvider>
      <AuthProvider>
      <App />
      </AuthProvider>
    </CodeProvider>
  </StrictMode>,
)
