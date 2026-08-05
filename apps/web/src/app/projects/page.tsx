import { redirect } from "next/navigation";

export default function ProjectsPage() {
  // For the prototype, redirect to the default project data room
  redirect("/projects/prj_01HVKM4T/data-room");
}
