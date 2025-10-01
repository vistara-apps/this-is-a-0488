import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { NotificationProvider } from './context/NotificationContext'
import Dashboard from './pages/Dashboard'
import ProjectDetail from './pages/ProjectDetail'
import PublicWidget from './pages/PublicWidget'
import ContractorView from './pages/ContractorView'
import CreateProject from './pages/CreateProject'
import Layout from './components/Layout'

function App() {
  return (
    <DataProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/widget/:projectSlug" element={<PublicWidget />} />
          <Route path="/contractor/:projectId" element={<ContractorView />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects/new" element={<CreateProject />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </DataProvider>
  )
}

export default App