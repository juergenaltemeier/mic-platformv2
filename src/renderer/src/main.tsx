import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { Page } from '@/App'
import { Home } from '@/pages/Home'
import { Renamer } from './pages/Renamer'

const router = createHashRouter([
  {
    path: '/',
    element: <Page />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: '/Renamer',
    element: <Page />,
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
