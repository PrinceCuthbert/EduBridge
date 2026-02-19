import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy Load Pages
const AdminLayout              = lazy(() => import("../pages/admin/AdminLayout"));
const AdminOverview            = lazy(() => import("../pages/admin/AdminOverview"));
const ApplicationReview        = lazy(() => import("../pages/admin/ApplicationReview"));
const AdminApplicationReview   = lazy(() => import("../pages/admin/AdminApplicationReview"));
const AdminSettings            = lazy(() => import("../pages/admin/AdminSettings"));
const ContentManagement        = lazy(() => import("../pages/admin/ContentManagement"));
const CMSScholarships          = lazy(() => import("../pages/admin/cms/CMSScholarships"));
const CMSLibrary               = lazy(() => import("../pages/admin/cms/CMSLibrary"));
const CMSPosts                 = lazy(() => import("../pages/admin/cms/CMSPosts"));
const CMSMedia                 = lazy(() => import("../pages/admin/cms/CMSMedia"));
const BranchManagement         = lazy(() => import("../pages/admin/BranchManagement"));
const UserManagement           = lazy(() => import("../pages/admin/UserManagement"));
const FinancialReports         = lazy(() => import("../pages/admin/FinancialReports"));
const Analytics                = lazy(() => import("../pages/admin/Analytics"));
const VisaCases                = lazy(() => import("../pages/admin/VisaCases"));
const Communications           = lazy(() => import("../pages/admin/Communications"));
const UniversityPrograms       = lazy(() => import("../pages/shared/UniversityPrograms"));
const AdminProgramDetail       = lazy(() => import("../pages/admin/AdminProgramDetail"));
const UniversityProgramDetails = lazy(() => import("../pages/shared/UniversityProgramDetails"));

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"    element={<AdminOverview />} />
        <Route path="users"        element={<UserManagement />} />

        {/* Applications */}
        <Route path="applications" element={<ApplicationReview />} />
        <Route path="applications/:id/review" element={<AdminApplicationReview />} />

        <Route path="visa" element={<VisaCases />} />

        {/* Programs */}
        <Route path="programs"              element={<UniversityPrograms />} />
        <Route path="programs/:id"          element={<AdminProgramDetail />} />
        <Route path="programs/view/:id"     element={<UniversityProgramDetails />} />

        {/* CMS */}
        <Route path="cms" element={<ContentManagement />}>
          <Route index element={<Navigate to="scholarships" replace />} />
          <Route path="scholarships" element={<CMSScholarships />} />
          <Route path="library"      element={<CMSLibrary />} />
          <Route path="posts"        element={<CMSPosts />} />
          <Route path="media"        element={<CMSMedia />} />
        </Route>

        <Route path="branches"       element={<BranchManagement />} />
        <Route path="finance"        element={<FinancialReports />} />
        <Route path="analytics"      element={<Analytics />} />
        <Route path="communications" element={<Communications />} />
        <Route path="settings"       element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
