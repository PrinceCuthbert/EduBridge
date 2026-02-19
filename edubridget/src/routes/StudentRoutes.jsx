import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { Rocket } from 'lucide-react';

// Inline placeholder rendered inside the dashboard <Outlet> — no navigation away
function ComingSoon({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
        <Rocket className="w-8 h-8 text-blue-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{title} — Coming Soon</h2>
      <p className="text-slate-500 text-sm max-w-sm leading-relaxed">{description}</p>
    </div>
  );
}

// Lazy Load Pages
const StudentDashboardLayout  = lazy(() => import("../pages/student-dashboard/StudentDashboardLayout"));
const Dashboard               = lazy(() => import("../pages/student-dashboard/overview/Dashboard"));
const MyApplications          = lazy(() => import("../pages/student-dashboard/applications/MyApplications"));
const ApplicationSubmitForm   = lazy(() => import("../pages/student-dashboard/applications/ApplicationSubmitForm"));
const ApplicationPreview      = lazy(() => import("../pages/student-dashboard/applications/ApplicationPreview"));
const VisaSummary             = lazy(() => import("../pages/student-dashboard/visa/VisaSummary"));
const VisaConsultationRequest = lazy(() => import("../pages/student-dashboard/visa/VisaConsultationRequest"));
const VisaCaseDetails         = lazy(() => import("../pages/student-dashboard/visa/VisaCaseDetails"));
const VisaCaseResponse        = lazy(() => import("../pages/student-dashboard/visa/VisaCaseResponse"));
const UploadCaseDocuments     = lazy(() => import("../pages/student-dashboard/visa/UploadCaseDocuments"));
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
        <Route path="applications/:id" element={<ApplicationPreview />} />
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

        {/* Coming Soon placeholders — render inside the dashboard outlet */}
        <Route path="library" element={<ComingSoon title="Library" description="Access your digital library, resources, and study materials — coming soon." />} />
        <Route path="study-resources" element={<ComingSoon title="Study Resources" description="Curated study guides, past papers, and learning tools — coming soon." />} />
      </Route>
    </Routes>
  );
}
