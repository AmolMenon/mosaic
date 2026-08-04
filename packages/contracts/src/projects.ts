export type ProjectStatus = 'active' | 'passed' | 'completed' | 'on_hold';
export type ProjectStage = 'initial_review' | 'deep_dive' | 'ic_memo' | 'diligence';

export interface Project {
  id: string;
  name: string;
  targetCompany: string;
  industry: string;
  dealType: 'buyout' | 'growth' | 'venture' | 'credit';
  status: ProjectStatus;
  stage: ProjectStage;
  owner: string;
  teamMembers: string[];
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
  tags: string[];
  progress: number;
}
