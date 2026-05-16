import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      gutter={8}
      toastOptions={{
        duration: 3000,
        className:
          'bg-white text-stone-900 ring-1 ring-black/5 rounded-[16px] ' +
          'px-4 py-3 text-[14px] font-medium',
        success: {
          className:
            'bg-green-600/10 text-green-700 ring-1 ring-green-600/15 rounded-[16px] ' +
            'px-4 py-3 text-[14px] font-medium',
        },
        error: {
          className:
            'bg-red-600/10 text-red-700 ring-1 ring-red-600/15 rounded-[16px] ' +
            'px-4 py-3 text-[14px] font-medium',
        },
      }}
    />
  </StrictMode>,
)
