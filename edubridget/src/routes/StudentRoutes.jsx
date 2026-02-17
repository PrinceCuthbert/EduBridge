import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy Load Pages
const StudentDashboardLayout = lazy(() => import("../pages/dashboard/StudentDashboardLayout"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const MyApplications = lazy(() => import("../pages/dashboard/MyApplications"));
const VisaSummary = lazy(() => import("../pages/dashboard/visa/VisaSummary"));
const VisaConsultationRequest = lazy(() => import("../pages/dashboard/visa/VisaConsultationRequest"));
const VisaCaseDetails = lazy(() => import("../pages/dashboard/visa/VisaCaseDetails"));
const VisaCaseResponse = lazy(() => import("../pages/dashboard/visa/VisaCaseResponse"));
const UploadCaseDocuments = lazy(() => import("../pages/dashboard/visa/UploadCaseDocuments"));
const UniversityPrograms = lazy(() => import("../pages/admin/UniversityPrograms"));

const UniversityProgramDetails = lazy(() => import("../pages/admin/UniversityProgramDetails"));
const ApplicationSubmission = lazy(() => import("../pages/dashboard/applications/ApplicationSubmission"));

export default function StudentRoutes() {
  return (
    <Routes>
      <Route element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="applications/submit" element={<ApplicationSubmission />} />
        <Route path="applications/submit/:programId" element={<ApplicationSubmission />} />
        
        {/* Visa Section */}
        <Route path="visa-status">
          <Route index element={<Navigate to="summary" replace />} />
          <Route path="summary" element={<VisaSummary />} />
          <Route path="summary/details/:id" element={<VisaCaseDetails />} />
          <Route path="summary/details/:id/upload" element={<UploadCaseDocuments />} />
          <Route path="summary/response/:id" element={<VisaCaseResponse />} />
          <Route path="request" element={<VisaConsultationRequest />} />
        </Route>

        {/* Programs Section */}
        <Route path="programs" element={<UniversityPrograms isReadOnly={true} />} />
        <Route path="programs/:id" element={<UniversityProgramDetails backPath="/dashboard/programs" />} />

        <Route path="profile" element={<div className="p-8">My Profile (Coming Soon)</div>} />
      </Route>
    </Routes>
  );
}
