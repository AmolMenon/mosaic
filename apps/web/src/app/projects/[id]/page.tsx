"use client";
import React from "react";
import { CenterPanel } from "../../../features/projects/CenterPanel";
import { mockProjectLBO } from "@mosaic/testing";

export default function ProjectPage() {
  const project = mockProjectLBO;

  return <CenterPanel project={project} />;
}
