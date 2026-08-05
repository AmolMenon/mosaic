"use client";
import React from "react";
import { CenterPanel } from "../../../features/projects/CenterPanel";
import { useProject } from "../../../hooks/queries";

import { useParams } from "next/navigation";

export default function ProjectWorkspacePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: project, isLoading } = useProject(id);

  if (isLoading) return null;
  if (!project) return null;

  return <CenterPanel project={project} />;
}
