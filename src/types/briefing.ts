export type BriefingStatus = 'draft' | 'validation' | 'approved' | 'production';

export interface Reference {
  id: string;
  type: 'image' | 'link' | 'video';
  url: string;
  name: string;
  preview?: string;
}

export interface BriefingData {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: BriefingStatus;
  score: number;

  // Step 1: Project info
  projectName: string;
  clientName: string;
  projectType: string;
  deadline: string;

  // Step 2: Objective
  objective: string;
  expectedResults: string;
  kpis: string;

  // Step 3: Target audience
  audienceAge: string;
  audienceGender: string;
  audienceInterests: string;
  audiencePainPoints: string;

  // Step 4: Creative direction
  tone: string;
  visualStyle: string;
  keyMessage: string;
  restrictions: string;

  // Step 5: References
  references: Reference[];

  // Step 6: Technical specs
  format: string;
  dimensions: string;
  deliverables: string;
  platform: string;

  // Auto-generated
  generatedSummary?: string;
  generatedConcept?: string;
  generatedStyle?: string;
  generatedExecution?: string;
}

export const emptyBriefing: Omit<BriefingData, 'id' | 'createdAt' | 'updatedAt'> = {
  status: 'draft',
  score: 0,
  projectName: '',
  clientName: '',
  projectType: '',
  deadline: '',
  objective: '',
  expectedResults: '',
  kpis: '',
  audienceAge: '',
  audienceGender: '',
  audienceInterests: '',
  audiencePainPoints: '',
  tone: '',
  visualStyle: '',
  keyMessage: '',
  restrictions: '',
  references: [],
  format: '',
  dimensions: '',
  deliverables: '',
  platform: '',
};

export const GENERIC_OBJECTIVES = [
  'engajar', 'divulgar', 'promover', 'vender', 'aumentar',
  'melhorar', 'criar', 'fazer', 'postar', 'publicar',
];

export const PROJECT_TYPES = [
  'Post para redes sociais',
  'Campanha publicitária',
  'Identidade visual',
  'Vídeo/Animação',
  'Landing page',
  'E-mail marketing',
  'Material impresso',
  'Apresentação',
  'Outro',
];

export const PLATFORMS = [
  'Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn',
  'Twitter/X', 'Site/Blog', 'E-mail', 'Impresso', 'Outro',
];

export const TONES = [
  'Formal', 'Informal', 'Divertido', 'Sério', 'Inspirador',
  'Educativo', 'Provocativo', 'Minimalista', 'Luxuoso', 'Jovem',
];
