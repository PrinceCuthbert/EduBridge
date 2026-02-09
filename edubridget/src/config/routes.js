import { lazy } from "react";

// Lazy Load Pages
const LandingPage = lazy(() => import("../pages/home/LandingPage"));
const AboutUsPage = lazy(() => import("../pages/aboutUs/AboutUsPage"));
const ContactPage = lazy(() => import("../pages/contact/contactPage"));
const Signin = lazy(() => import("../pages/auth/SignInPage"));
const Signup = lazy(() => import("../pages/auth/SignUpPage"));
const BlogDetailsPage = lazy(() => import("../pages/blog/BlogDetailsPage"));
const DigitalLibraryPage = lazy(
  () => import("../pages/library/DigitalLibraryPage"),
);
const BranchesPage = lazy(() => import("../pages/branches/BranchesPage"));
const StudyAbroadPage = lazy(
  () => import("../pages/study-abroad/StudyAbroadPage"),
);
const ProgramDetail = lazy(() => import("../pages/study-abroad/ProgramDetail"));
const AdminProgramDetail = lazy(
  () => import("../pages/admin/AdminProgramDetail"),
);
const VisaConsultationPage = lazy(
  () => import("../pages/visa/VisaConsultationPage"),
);
const ScholarshipsPage = lazy(
  () => import("../pages/scholarships/ScholarshipsPage"),
);
const GalleryPage = lazy(() => import("../pages/gallery/GalleryPage"));
const PartnersPage = lazy(() => import("../pages/partners/PartnersPage"));
const BlogPage = lazy(() => import("../pages/blog/BlogPage"));
const CoursesPage = lazy(() => import("../pages/coursesPage/coursesPage"));
const MembershipPage = lazy(() => import("../pages/membership/MembershipPage"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const ComingSoonPage = lazy(() => import("../pages/ComingSoonPage"));

// Admin Pages
const AdminLayout = lazy(() => import("../pages/admin/AdminLayout"));
const AdminOverview = lazy(() => import("../pages/admin/AdminOverview"));
const ScholarshipManager = lazy(
  () => import("../pages/admin/ScholarshipManager"),
);
const ApplicationReview = lazy(
  () => import("../pages/admin/ApplicationReview"),
);
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));
const BranchManagement = lazy(() => import("../pages/admin/BranchManagement"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const FinancialReports = lazy(() => import("../pages/admin/FinancialReports"));
const Analytics = lazy(() => import("../pages/admin/Analytics"));
const VisaCases = lazy(() => import("../pages/admin/VisaCases"));

// Dashboard Layout
const StudentDashboardLayout = lazy(
  () => import("../pages/dashboard/StudentDashboardLayout"),
);

/**
 * Route configuration object
 *
 * Structure:
 * - path: URL path
 * - element: Component to render (lazy-loaded)
 * - protected: Boolean - requires authentication
 * - allowedRoles: Array - ['student', 'admin'] - restricts access by role
 * - layout: String - 'public' | 'admin' | 'student' - determines layout wrapper
 * - children: Array - nested routes
 */
export const routeConfig = {
  public: [
    { path: "/", element: LandingPage, protected: false },
    { path: "/aboutUsPage", element: AboutUsPage },
    { path: "/contactPage", element: ContactPage },
    { path: "/library", element: DigitalLibraryPage },
    { path: "/branches", element: BranchesPage },
    { path: "/study-abroad", element: StudyAbroadPage },
    { path: "/study-abroad/:id", element: ProgramDetail },
    { path: "/visa-consultation", element: VisaConsultationPage },
    { path: "/scholarships", element: ScholarshipsPage },
    { path: "/gallery", element: GalleryPage },
    { path: "/partners", element: PartnersPage },
    { path: "/blogs", element: BlogPage },
    { path: "/blogs/:id", element: BlogDetailsPage },
    { path: "/coursesPage", element: CoursesPage },
    { path: "/membershipPage", element: MembershipPage },
    { path: "/coming-soon", element: ComingSoonPage },
    { path: "/signin", element: Signin, protected: false }, // PublicRoute wrapper
    { path: "/signup", element: Signup, protected: false }, // PublicRoute wrapper
  ],

  student: {
    layout: StudentDashboardLayout,
    basePath: "/dashboard",
    allowedRoles: ["student"],
    routes: [
      { path: "", element: Dashboard, index: true },
      {
        path: "profile",
        element: () => <div className="p-8">My Profile (Coming Soon)</div>,
      },
    ],
  },

  admin: {
    layout: AdminLayout,
    basePath: "/admin",
    allowedRoles: ["admin"],
    routes: [
      { path: "", redirect: "/admin/dashboard" },
      { path: "dashboard", element: AdminOverview },
      { path: "users", element: UserManagement },
      { path: "applications", element: ApplicationReview },
      { path: "visa", element: VisaCases },
      { path: "programs", element: ScholarshipManager },
      { path: "programs/:id", element: AdminProgramDetail },
      { path: "branches", element: BranchManagement },
      { path: "finance", element: FinancialReports },
      { path: "analytics", element: Analytics },
      { path: "settings", element: AdminSettings },
    ],
  },
};

// Export lazy-loaded components for backward compatibility
export {
  LandingPage,
  AboutUsPage,
  ContactPage,
  Signin,
  Signup,
  BlogDetailsPage,
  DigitalLibraryPage,
  BranchesPage,
  StudyAbroadPage,
  ProgramDetail,
  AdminProgramDetail,
  VisaConsultationPage,
  ScholarshipsPage,
  GalleryPage,
  PartnersPage,
  BlogPage,
  CoursesPage,
  MembershipPage,
  Dashboard,
  ComingSoonPage,
  AdminLayout,
  AdminOverview,
  ScholarshipManager,
  ApplicationReview,
  AdminSettings,
  BranchManagement,
  UserManagement,
  FinancialReports,
  Analytics,
  VisaCases,
  StudentDashboardLayout,
};
