import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import UploadPage from './pages/UploadPage'
import InteractionResultsPage from './pages/InteractionResultsPage'
import PrescriptionsPage from './pages/PrescriptionsPage'
import CheckInteractionPage from './pages/CheckInteractionPage'
import SettingsPage from './pages/SettingsPage'
import AlertsPage from './pages/AlertsPage'
import HelpPage from './pages/HelpPage'
import PatientsPage from './pages/PatientsPage'
import VerifyMedicinePage from './pages/VerifyMedicinePage'
import DoctorDashboard from './pages/DoctorDashboard'
import PharmacistDashboard from './pages/PharmacistDashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            } />
            <Route path="/upload" element={
                <ProtectedRoute>
                    <UploadPage />
                </ProtectedRoute>
            } />
            <Route path="/results" element={
                <ProtectedRoute>
                    <InteractionResultsPage />
                </ProtectedRoute>
            } />
            <Route path="/prescriptions" element={
                <ProtectedRoute>
                    <PrescriptionsPage />
                </ProtectedRoute>
            } />
            <Route path="/check-interaction" element={
                <ProtectedRoute>
                    <CheckInteractionPage />
                </ProtectedRoute>
            } />
            <Route path="/settings" element={
                <ProtectedRoute>
                    <SettingsPage />
                </ProtectedRoute>
            } />
            <Route path="/alerts" element={
                <ProtectedRoute>
                    <AlertsPage />
                </ProtectedRoute>
            } />
            <Route path="/help" element={
                <ProtectedRoute>
                    <HelpPage />
                </ProtectedRoute>
            } />
            <Route path="/patients" element={
                <ProtectedRoute>
                    <PatientsPage />
                </ProtectedRoute>
            } />
            <Route path="/verify" element={
                <ProtectedRoute>
                    <VerifyMedicinePage />
                </ProtectedRoute>
            } />

            {/* Portals */}
            <Route path="/doctor" element={
                <ProtectedRoute>
                    <DoctorDashboard />
                </ProtectedRoute>
            } />
            <Route path="/pharmacist" element={
                <ProtectedRoute>
                    <PharmacistDashboard />
                </ProtectedRoute>
            } />
        </Routes>
    )
}

export default App
