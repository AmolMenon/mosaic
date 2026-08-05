"use client";
import React from "react";
import { CenterPanel } from "../../../features/projects/CenterPanel";
import { useProject } from "../../../hooks/queries";

export default function ProjectWorkspacePage({ params }: { params: { id: string } }) {
  const { data: project, isLoading } = useProject(params.id);

  if (isLoading) return null;
  if (!project) return null;

  return <CenterPanel project={project} />;
}
