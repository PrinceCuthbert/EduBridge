import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Lazy Load Pages
const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));
const AdminOverview = lazy(
  () => import("../pages/admin-dashboard/overview/AdminOverview"),
);
const ApplicationReview = lazy(
  () => import("../pages/admin-dashboard/applications/ApplicationReview"),
);
const AdminApplicationReview = lazy(
  () => import("../pages/admin-dashboard/applications/AdminApplicationReview"),
);
const AppTracker = lazy(
  () => import("../pages/admin-dashboard/applications/AppTracker"),
); // Priority 4
const AdminSettings = lazy(
  () => import("../pages/admin-dashboard/AdminSettings"),
);
const ContentManagement = lazy(
  () => import("../pages/admin-dashboard/cms/ContentManagement"),
);
const CMSScholarships = lazy(
  () => import("../pages/admin-dashboard/cms/CMSScholarships"),
);
const CMSLibrary = lazy(
  () => import("../pages/admin-dashboard/cms/CMSLibrary"),
);
const CMSPosts = lazy(() => import("../pages/admin-dashboard/cms/CMSPosts"));
const CMSMedia = lazy(() => import("../pages/admin-dashboard/cms/CMSMedia"));
const CMSPublishers = lazy(
  () => import("../pages/admin-dashboard/cms/CMSPublishers"),
); // Priority 7
const CMSPollQuestions = lazy(
  () => import("../pages/admin-dashboard/cms/CMSPollQuestions"),
); // Priority 8
const BranchManagement = lazy(
  () => import("../pages/admin-dashboard/branches/BranchManagement"),
);
const UserManagement = lazy(
  () => import("../pages/admin-dashboard/users/UserManagement"),
);
const RoleManagement = lazy(
  () => import("../pages/admin-dashboard/users/RoleManagement"),
); // Priority 9
const FinancialReports = lazy(
  () => import("../pages/admin-dashboard/finance/FinancialReports"),
);
const VisaCases = lazy(() => import("../pages/admin-dashboard/visa/VisaCases"));
const AdminVisaCaseDetails = lazy(
  () => import("../pages/admin-dashboard/visa/AdminVisaCaseDetails"),
);
const UniversityPrograms = lazy(
  () => import("../pages/shared/UniversityPrograms"),
);
const AdminProgramDetail = lazy(
  () => import("../pages/shared/AdminProgramDetail"),
);
const ProgramDetail = lazy(() => import("../pages/study-abroad/ProgramDetail"));

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="users" element={<UserManagement />} />
        {/* Applications */}
        <Route path="applications" element={<ApplicationReview />} />
        <Route
          path="applications/:id/review"
          element={<AdminApplicationReview />}
        />
        <Route path="tracker" element={<AppTracker />} />{" "}
        {/* Priority 4: EDUC_BRIDGE_APP_TRACKER */}
        {/* Visa */}
        <Route path="visa" element={<VisaCases />} />
        <Route path="visa/:id" element={<AdminVisaCaseDetails />} />
        {/* Programs */}
        <Route path="programs" element={<UniversityPrograms />} />
        <Route path="programs/:id" element={<AdminProgramDetail />} />
        <Route
          path="programs/view/:id"
          element={<ProgramDetail previewMode backPath="/admin/programs" />}
        />
        {/* CMS */}
        <Route path="cms" element={<ContentManagement />}>
          <Route index element={<Navigate to="scholarships" replace />} />
          <Route path="scholarships" element={<CMSScholarships />} />
          <Route path="library" element={<CMSLibrary />} />
          <Route path="posts" element={<CMSPosts />} />
          <Route path="media" element={<CMSMedia />} />
          <Route path="publishers" element={<CMSPublishers />} />{" "}
          {/* Priority 7 */}
          <Route path="poll-questions" element={<CMSPollQuestions />} />{" "}
          {/* Priority 8 */}
        </Route>
        {/* Roles */}
        {/* This will be handled at the backend side */}
        <Route path="roles" element={<RoleManagement />} />
        {/* Priority 9 */}
        {/* Other sections */}
        <Route path="scholarships" element={<Navigate to="/admin/cms/scholarships" replace />} />
        <Route path="branches" element={<BranchManagement />} />
        <Route path="finance" element={<FinancialReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
