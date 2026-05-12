import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CompanyList from './pages/companies/CompanyList'
import CompanyDetail from './pages/companies/CompanyDetail'
import BranchDetail from './pages/companies/BranchDetail'
import ProviderList from './pages/providers/ProviderList'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/companies/:companyId" element={<CompanyDetail />} />
        <Route path="/companies/:companyId/branches/:branchId" element={<BranchDetail />} />
        <Route path="/providers" element={<ProviderList />} />
      </Routes>
    </Layout>
  )
}
