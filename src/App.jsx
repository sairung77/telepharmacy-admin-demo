import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CompanyList from './pages/companies/CompanyList'
import CompanyDetail from './pages/companies/CompanyDetail'
import BranchDetail from './pages/companies/BranchDetail'
import ProviderList from './pages/providers/ProviderList'
import MedicationSetList from './pages/catalog/MedicationSetList'
import MedicationManagementLayout from './pages/catalog/MedicationManagementLayout'
import MedicationManagementList from './pages/catalog/MedicationManagementList'
import MedicationManagementForm from './pages/catalog/MedicationManagementForm'

function RequireAuth({ children }) {
  const isLoggedIn = localStorage.getItem('admin_auth') === 'true'
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="companies" element={<CompanyList />} />
        <Route path="companies/:companyId" element={<CompanyDetail />} />
        <Route path="companies/:companyId/branches/:branchId" element={<BranchDetail />} />
        <Route path="providers" element={<ProviderList />} />
        <Route path="medication-sets" element={<MedicationSetList />} />
        <Route path="medication-management" element={<MedicationManagementLayout />}>
          <Route index element={<MedicationManagementList />} />
          <Route path="new" element={<MedicationManagementForm />} />
          <Route path=":id" element={<MedicationManagementForm />} />
        </Route>
      </Route>
    </Routes>
  )
}
