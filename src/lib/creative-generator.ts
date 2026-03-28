import { BriefingData } from '@/types/briefing';

export function generateCreativeDirection(data: BriefingData): Partial<BriefingData> {
  const summary = `Projeto "${data.projectName}" para ${data.clientName || 'cliente'}. ${data.projectType} focado em ${data.platform || 'múltiplas plataformas'}. Objetivo: ${data.objective?.slice(0, 100) || 'não definido'}. Público: ${data.audienceAge || ''}${data.audienceGender ? ', ' + data.audienceGender : ''}.`;

  const concept = data.keyMessage
    ? `Conceito central baseado em: "${data.keyMessage}". A comunicação deve transmitir ${data.tone?.toLowerCase() || 'profissionalismo'} e conectar com as dores do público: ${data.audiencePainPoints?.slice(0, 80) || 'a serem definidas'}.`
    : 'Conceito central ainda não definido. Preencha a mensagem-chave na direção criativa.';

  const style = data.visualStyle
    ? `Estilo visual: ${data.visualStyle}. Tom de comunicação: ${data.tone || 'neutro'}. Recomendação: manter consistência visual com as ${data.references?.length || 0} referências anexadas.`
    : 'Estilo visual ainda precisa ser definido na etapa de direção criativa.';

  const execution = data.format
    ? `Entrega em formato ${data.format}${data.dimensions ? ` (${data.dimensions})` : ''} para ${data.platform || 'plataforma definida'}. Entregas esperadas: ${data.deliverables || 'a definir'}. Prazo: ${data.deadline || 'a definir'}.`
    : 'Especificações técnicas incompletas para gerar sugestão de execução.';

  return {
    generatedSummary: summary,
    generatedConcept: concept,
    generatedStyle: style,
    generatedExecution: execution,
  };
}
