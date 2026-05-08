import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

// Layout Components
import PublicLayout from './components/layout/PublicLayout'
import OwnerLayout from './components/layout/OwnerLayout'
import AdminLayout from './components/layout/AdminLayout'

// Public Pages
import HomePage from './pages/public/HomePage'
import MenuPage from './pages/public/MenuPage'
import MenuDetailsPage from './pages/public/MenuDetailsPage'
import LocationsPage from './pages/public/LocationsPage'
import CareersPage from './pages/public/CareersPage'
import JobDetailsPage from './pages/public/JobDetailsPage'
import ApplyJobPage from './pages/public/ApplyJobPage'
import OwnFranchisePage from './pages/public/OwnFranchisePage'
import ContactPage from './pages/public/ContactPage'
import LoginPage from './pages/public/LoginPage'
import FranchiseApplicationPage from './pages/public/FranchiseApplicationPage';
// RegisterPage REMOVED - no public registration

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard'
import OwnerProfile from './pages/owner/OwnerProfile'
import OwnerJobs from './pages/owner/OwnerJobs'
import OwnerCreateJob from './pages/owner/OwnerCreateJob'
import OwnerApplications from './pages/owner/OwnerApplications'
import OwnerFeedback from './pages/owner/OwnerFeedback'
import OwnerFranchise from './pages/owner/OwnerFranchise'
import OwnerEditJob from './pages/owner/OwnerEditJob';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMenu from './pages/admin/AdminMenu'
import AdminApplications from './pages/admin/AdminApplications'
import AdminFranchises from './pages/admin/AdminFranchises'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSettings from './pages/admin/AdminSettings'
import AdminFeedback from './pages/admin/AdminFeedback'

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminJobs from './pages/admin/AdminJobs'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes - No Layout (only login page) */}
          <Route path="/login" element={<LoginPage />} />
          {/* Register route REMOVED */}

          {/* Public Routes with PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:id" element={<MenuDetailsPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:id" element={<JobDetailsPage />} />
            <Route path="/careers/:id/apply" element={<ApplyJobPage />} />
            <Route path="/franchise-application" element={<FranchiseApplicationPage />} />
            <Route path="/own-franchise" element={<OwnFranchisePage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Protected Owner Routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['ROLE_FRANCHISE_OWNER']} redirectTo="/">
              <OwnerLayout />
            </ProtectedRoute>
          }>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/profile" element={<OwnerProfile />} />
            <Route path="/owner/jobs" element={<OwnerJobs />} />
            <Route path="/owner/jobs/create" element={<OwnerCreateJob />} />
            <Route path="/owner/jobs/:id/applications" element={<OwnerApplications />} />
            <Route path="/owner/jobs/applications" element={<OwnerApplications />} />
            <Route path="/owner/feedback" element={<OwnerFeedback />} />
            <Route path="/owner/franchise" element={<OwnerFranchise />} />
            <Route path="/owner/menu" element={<MenuPage />} />
            <Route path="/owner/jobs/:id/edit" element={<OwnerEditJob />} />

          </Route>

          {/* Protected Admin Routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/menu" element={<AdminMenu />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/franchises" element={<AdminFranchises />} />
            <Route path="/admin/franchises/create" element={<AdminFranchises />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
          </Route>

          {/* Fallback Route - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App