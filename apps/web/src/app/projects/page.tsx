import { redirect } from "next/navigation";

export default function ProjectsPage() {
  // For the prototype, redirect to the default project data room
  redirect("/projects/p-123/data-room");
}
