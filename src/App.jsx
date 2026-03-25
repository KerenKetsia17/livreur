import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DriverDashboard } from './pages/DriverDashboard'
import DriverTracking from './pages/DriverTracking'
import DriverNotifications from './pages/DriverNotifications'
import { Landing } from './pages/Landing'
import { Footer } from './components/Footer'
import { getCurrentUser } from './utils/storage'
import './App.css'
import './css/components/TopBar.css'
import './css/components/BottomNav.css'
import './css/components/Button.css'
import './css/components/Footer.css'
import './css/pages/Landing.css'

function RequireAuth({ children }) {
  const user = getCurrentUser()
  if (!user) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/driver"
          element={
            <RequireAuth>
              <Navigate to="/driver/missions" replace />
            </RequireAuth>
          }
        />
        <Route
          path="/driver/missions"
          element={
            <RequireAuth>
              <DriverDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/driver/missions/:orderId"
          element={
            <RequireAuth>
              <DriverDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/driver/notifications"
          element={
            <RequireAuth>
              <DriverNotifications />
            </RequireAuth>
          }
        />
        <Route
          path="/driver/tracking"
          element={
            <RequireAuth>
              <DriverTracking />
            </RequireAuth>
          }
        />
        <Route
          path="/driver/history"
          element={
            <RequireAuth>
              <DriverDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/driver/profile"
          element={
            <RequireAuth>
              <DriverDashboard />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
