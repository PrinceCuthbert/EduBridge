import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy Load Pages
const StudentDashboardLayout  = lazy(() => import("../pages/dashboard/StudentDashboardLayout"));
const Dashboard               = lazy(() => import("../pages/dashboard/Dashboard"));
const MyApplications          = lazy(() => import("../pages/dashboard/MyApplications"));
const ApplicationSubmitForm   = lazy(() => import("../pages/dashboard/ApplicationSubmitForm"));
const ApplicationDetail       = lazy(() => import("../pages/dashboard/ApplicationDetail"));
const VisaSummary             = lazy(() => import("../pages/dashboard/visa/VisaSummary"));
const VisaConsultationRequest = lazy(() => import("../pages/dashboard/visa/VisaConsultationRequest"));
const VisaCaseDetails         = lazy(() => import("../pages/dashboard/visa/VisaCaseDetails"));
const VisaCaseResponse        = lazy(() => import("../pages/dashboard/visa/VisaCaseResponse"));
const UploadCaseDocuments     = lazy(() => import("../pages/dashboard/visa/UploadCaseDocuments"));
const UniversityPrograms      = lazy(() => import("../pages/shared/UniversityPrograms"));
const ProfileSettings         = lazy(() => import("../pages/shared/ProfileSettings"));
const UniversityProgramDetails = lazy(() => import("../pages/shared/UniversityProgramDetails"));

export default function StudentRoutes() {
  return (
    <Routes>
      <Route element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />

        {/* Applications */}
        <Route path="applications" element={<MyApplications />} />
        <Route path="applications/:id" element={<ApplicationDetail />} />
        <Route path="applications/submit/:id" element={<ApplicationSubmitForm />} />
        <Route path="applications/edit/:id" element={<ApplicationSubmitForm />} />

        {/* Visa */}
        <Route path="visa-status">
          <Route index element={<Navigate to="summary" replace />} />
          <Route path="summary" element={<VisaSummary />} />
          <Route path="summary/details/:id" element={<VisaCaseDetails />} />
          <Route path="summary/details/:id/upload" element={<UploadCaseDocuments />} />
          <Route path="summary/response/:id" element={<VisaCaseResponse />} />
          <Route path="request" element={<VisaConsultationRequest />} />
        </Route>

        {/* Programs */}
        <Route path="programs" element={<UniversityPrograms isReadOnly={true} />} />
        <Route path="programs/:id" element={<UniversityProgramDetails backPath="/dashboard/programs" />} />

        {/* Profile */}
        <Route path="profile" element={<ProfileSettings />} />
      </Route>
    </Routes>
  );
}
