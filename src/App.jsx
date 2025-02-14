import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'

// pages
import Home from './pages/Home'
import MainLayout from './layouts/MainLayout'

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<MainLayout/>}>
          <Route index element={<Home/>} />
      </Route>
    )
  )


  return (
    <RouterProvider router={router} />
  )
}

export default App