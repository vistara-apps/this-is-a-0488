import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { WidgetPage } from './pages/WidgetPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/projects" element={<DashboardPage />} />
      <Route path="/projects/new" element={<NewProjectPage />} />
      <Route path="/projects/:id" element={<ProjectDetailPage />} />
      <Route path="/widget/:slug" element={<WidgetPage />} />
      <Route path="/widgets" element={<DashboardPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;