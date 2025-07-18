import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { App } from '@/App'
import { Dashboard } from '@/pages/Dashboard'
import { Renamer } from '@renderer/pages/programs/renamer/Renamer'

import { SettingsPage } from '@/pages/Settings'

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      }
    ],
  },
  {
    path: '/programs/renamer',
    element: <App />,
    children: [
      {
        index: true,
        element: <Renamer />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>
)
