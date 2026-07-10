import { Metadata } from "next";
import PublicCoursesClient from "./courses-client";

export const metadata: Metadata = {
  title: "Browse Courses",
  description: "Explore all courses at Waypoint Academy.",
};

export default function CoursesPage() {
  return <PublicCoursesClient />;
}
