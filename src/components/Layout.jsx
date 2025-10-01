import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import NotificationContainer from './NotificationContainer'

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <NotificationContainer />
    </div>
  )
}