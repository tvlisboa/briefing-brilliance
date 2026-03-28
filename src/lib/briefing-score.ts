import { BriefingData, GENERIC_OBJECTIVES } from '@/types/briefing';

interface ScoreBreakdown {
  objective: number;
  audience: number;
  references: number;
  creative: number;
  technical: number;
  total: number;
}

export function calculateScore(data: Partial<BriefingData>): ScoreBreakdown {
  let objective = 0;
  let audience = 0;
  let references = 0;
  let creative = 0;
  let technical = 0;

  // Objective (20pts)
  if (data.objective && data.objective.length >= 30) {
    const isGeneric = GENERIC_OBJECTIVES.some(g =>
      data.objective!.toLowerCase().trim() === g
    );
    if (!isGeneric) objective += 10;
    if (data.objective.length >= 60) objective += 5;
  }
  if (data.expectedResults && data.expectedResults.length >= 15) objective += 5;
  if (data.kpis && data.kpis.length >= 10) objective += 5;
  objective = Math.min(objective, 20);

  // Audience (15pts)
  if (data.audienceAge) audience += 4;
  if (data.audienceGender) audience += 3;
  if (data.audienceInterests && data.audienceInterests.length >= 15) audience += 4;
  if (data.audiencePainPoints && data.audiencePainPoints.length >= 15) audience += 4;
  audience = Math.min(audience, 15);

  // References (25pts)
  const refCount = data.references?.length || 0;
  if (refCount >= 1) references += 10;
  if (refCount >= 2) references += 8;
  if (refCount >= 3) references += 7;
  references = Math.min(references, 25);

  // Creative direction (20pts)
  if (data.tone) creative += 5;
  if (data.visualStyle && data.visualStyle.length >= 10) creative += 5;
  if (data.keyMessage && data.keyMessage.length >= 15) creative += 5;
  if (data.restrictions) creative += 5;
  creative = Math.min(creative, 20);

  // Technical specs (20pts)
  if (data.format) technical += 5;
  if (data.dimensions) technical += 5;
  if (data.deliverables && data.deliverables.length >= 10) technical += 5;
  if (data.platform) technical += 5;
  technical = Math.min(technical, 20);

  return {
    objective,
    audience,
    references,
    creative,
    technical,
    total: objective + audience + references + creative + technical,
  };
}

export function getScoreColor(score: number): string {
  if (score < 40) return 'hsl(var(--score-low))';
  if (score < 70) return 'hsl(var(--score-medium))';
  return 'hsl(var(--score-high))';
}

export function getScoreLabel(score: number): string {
  if (score < 40) return 'Insuficiente';
  if (score < 70) return 'Em progresso';
  return 'Aprovado';
}
