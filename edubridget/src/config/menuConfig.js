import {
  Home,
  Info,
  GraduationCap,
  Globe,
  BookOpen,
  Image,
  Phone,
  MapPin,
  Users,
  Award,
  Building2,
  Plane,
  FileCheck,
} from "lucide-react";

/**
 * Centralized Menu Configuration
 *
 * This config is used by both desktop and mobile navigation
 * to eliminate duplication and ensure consistency.
 */

export const menuConfig = [
  {
    id: "home",
    labelKey: "nav.home",
    path: "/",
    icon: Home,
    type: "link",
  },
  {
    id: "about",
    labelKey: "nav.about",
    icon: Info,
    type: "dropdown",
    items: [
      { labelKey: "about.about_us", path: "/aboutuspage", icon: Info },
      { labelKey: "about.branches", path: "/branches", icon: MapPin },
      { labelKey: "about.partners", path: "/partners", icon: Users },
    ],
  },
  {
    id: "academics",
    labelKey: "nav.academics",
    icon: GraduationCap,
    type: "dropdown",
    items: [
      {
        labelKey: "academics.high_school",
        path: "/coming-soon?filter=High School Curriculum",
        icon: BookOpen,
      },
      {
        labelKey: "academics.masters",
        path: "/coming-soon?filter=Master's Programs",
        icon: Award,
      },
      {
        labelKey: "academics.online",
        path: "/coming-soon?filter=Online Learning",
        icon: Globe,
      },
    ],
  },
  {
    id: "global",
    labelKey: "nav.global",
    icon: Globe,
    type: "dropdown",
    items: [
      { labelKey: "global.study_abroad", path: "/study-abroad", icon: Plane },
      { labelKey: "global.visa", path: "/visa-consultation", icon: FileCheck },
    ],
  },
  {
    id: "resources",
    labelKey: "nav.resources",
    icon: BookOpen,
    type: "dropdown",
    items: [
      { labelKey: "resources.library", path: "/library", icon: BookOpen },
      {
        labelKey: "resources.scholarships",
        path: "/scholarships",
        icon: Award,
      },
    ],
  },
  {
    id: "media",
    labelKey: "nav.media",
    icon: Image,
    type: "dropdown",
    items: [
      { labelKey: "media.blogs", path: "/blogs", icon: BookOpen },
      { labelKey: "media.gallery", path: "/gallery", icon: Image },
    ],
  },
  {
    id: "contact",
    labelKey: "nav.contact",
    path: "/contactpage",
    icon: Phone,
    type: "link",
  },
];
