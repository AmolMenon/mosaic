import { Project } from "@mosaic/contracts";

export const mockProjectLBO: Project = {
  id: "prj_01HVKM4T",
  name: "Project Titan (Apex Software LBO)",
  targetCompany: "Apex Software Inc.",
  industry: "B2B SaaS",
  dealType: "buyout",
  status: "active",
  stage: "deep_dive",
  owner: "alex.chen@mosaic.com",
  teamMembers: ["alex.chen@mosaic.com", "sarah.jenkins@mosaic.com"],
  description: "Evaluate the proposed $2.1B LBO of Apex Software, focusing on ARR retention, NRR expansion in enterprise segments, and competitive defensibility against emerging AI-native workflows.",
  priority: "high",
  createdAt: "2026-08-01T10:00:00Z",
  updatedAt: "2026-08-03T14:30:00Z",
  tags: ["SaaS", "Enterprise", "LBO"],
  progress: 35,
};

export const mockProjectQuestions = [
  "How defensible is the enterprise pricing model against new entrants?",
  "Where does the projected 15% YoY growth originate?",
  "What are the biggest commercial risks in Q4?",
  "What evidence is missing from the management presentation regarding churn?",
];
