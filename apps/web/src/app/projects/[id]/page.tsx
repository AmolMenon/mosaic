"use client";
import React from "react";
import { CenterPanel } from "../../../features/projects/CenterPanel";
import { useProject } from "../../../hooks/queries";

export default function ProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: project, isLoading } = useProject(id);

  if (isLoading) return null;
  if (!project) return null;

  return <CenterPanel project={project} />;
}
