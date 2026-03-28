import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BriefingData, GENERIC_OBJECTIVES } from '@/types/briefing';
import { calculateScore } from '@/lib/briefing-score';
import { saveBriefing, getBriefing, createNewBriefing } from '@/lib/briefing-storage';
import { generateCreativeDirection } from '@/lib/creative-generator';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/briefing/StepIndicator';
import { ScoreDisplay } from '@/components/briefing/ScoreDisplay';
import { StepProjectInfo } from '@/components/briefing/StepProjectInfo';
import { StepObjective } from '@/components/briefing/StepObjective';
import { StepAudience } from '@/components/briefing/StepAudience';
import { StepCreativeDirection } from '@/components/briefing/StepCreativeDirection';
import { StepReferences } from '@/components/briefing/StepReferences';
import { StepTechnicalSpecs } from '@/components/briefing/StepTechnicalSpecs';
import { ArrowLeft, ArrowRight, Save, Send, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STEPS = ['Projeto', 'Objetivo', 'Público', 'Criativo', 'Referências', 'Técnico'];

export default function BriefingFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState<BriefingData>(() => {
    if (id) {
      const existing = getBriefing(id);
      if (existing) return existing;
    }
    return createNewBriefing();
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCreative, setShowCreative] = useState(false);

  const scoreBreakdown = useMemo(() => calculateScore(data), [data]);

  const handleChange = useCallback((updates: Partial<BriefingData>) => {
    setData(prev => ({ ...prev, ...updates }));
    // Clear errors for changed fields
    const clearedErrors = { ...errors };
    Object.keys(updates).forEach(k => delete clearedErrors[k]);
    setErrors(clearedErrors);
  }, [errors]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!data.projectName.trim()) newErrors.projectName = 'Nome do projeto é obrigatório';
        if (!data.clientName.trim()) newErrors.clientName = 'Nome do cliente é obrigatório';
        if (!data.projectType) newErrors.projectType = 'Selecione o tipo de projeto';
        if (!data.deadline) newErrors.deadline = 'Defina o prazo de entrega';
        break;
      case 1:
        if (!data.objective.trim() || data.objective.length < 30)
          newErrors.objective = 'O objetivo deve ter pelo menos 30 caracteres';
        if (GENERIC_OBJECTIVES.some(g => data.objective.toLowerCase().trim() === g))
          newErrors.objective = 'Objetivo muito genérico. Seja mais específico.';
        if (!data.expectedResults.trim() || data.expectedResults.length < 15)
          newErrors.expectedResults = 'Descreva os resultados esperados (mín. 15 caracteres)';
        break;
      case 2:
        if (!data.audienceAge) newErrors.audienceAge = 'Selecione a faixa etária';
        if (!data.audienceGender) newErrors.audienceGender = 'Selecione o gênero';
        if (!data.audienceInterests.trim() || data.audienceInterests.length < 15)
          newErrors.audienceInterests = 'Descreva os interesses (mín. 15 caracteres)';
        break;
      case 3:
        if (!data.tone) newErrors.tone = 'Selecione o tom de comunicação';
        if (!data.visualStyle.trim() || data.visualStyle.length < 10)
          newErrors.visualStyle = 'Descreva o estilo visual (mín. 10 caracteres)';
        if (!data.keyMessage.trim() || data.keyMessage.length < 15)
          newErrors.keyMessage = 'Defina a mensagem-chave (mín. 15 caracteres)';
        break;
      case 4:
        if (data.references.length === 0)
          newErrors.references = 'Adicione pelo menos 1 referência (imagem, link ou vídeo)';
        break;
      case 5:
        if (!data.format) newErrors.format = 'Selecione o formato';
        if (!data.dimensions.trim()) newErrors.dimensions = 'Informe as dimensões';
        if (!data.platform) newErrors.platform = 'Selecione a plataforma';
        if (!data.deliverables.trim() || data.deliverables.length < 10)
          newErrors.deliverables = 'Descreva as entregas esperadas (mín. 10 caracteres)';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const completedSteps = useMemo(() => {
    return STEPS.map((_, i) => {
      const tempErrors: Record<string, string> = {};
      // Quick check without setting state
      switch (i) {
        case 0: return !!(data.projectName && data.clientName && data.projectType && data.deadline);
        case 1: return !!(data.objective.length >= 30 && data.expectedResults.length >= 15 && !GENERIC_OBJECTIVES.some(g => data.objective.toLowerCase().trim() === g));
        case 2: return !!(data.audienceAge && data.audienceGender && data.audienceInterests.length >= 15);
        case 3: return !!(data.tone && data.visualStyle.length >= 10 && data.keyMessage.length >= 15);
        case 4: return data.references.length >= 1;
        case 5: return !!(data.format && data.dimensions && data.platform && data.deliverables.length >= 10);
        default: return false;
      }
    });
  }, [data]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = () => {
    const updated = { ...data, score: scoreBreakdown.total, status: 'draft' as const };
    saveBriefing(updated);
    toast({ title: 'Rascunho salvo', description: 'Seu briefing foi salvo como rascunho.' });
  };

  const handleGenerateCreative = () => {
    const creative = generateCreativeDirection(data);
    setData(prev => ({ ...prev, ...creative }));
    setShowCreative(true);
  };

  const handleSubmit = () => {
    // Validate all steps
    for (let i = 0; i < STEPS.length; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        toast({ title: 'Briefing incompleto', description: `Corrija os erros na etapa "${STEPS[i]}"`, variant: 'destructive' });
        return;
      }
    }

    if (scoreBreakdown.total < 70) {
      const updated = { ...data, score: scoreBreakdown.total, status: 'validation' as const };
      saveBriefing(updated);
      toast({
        title: 'Enviado para revisão',
        description: `Score ${scoreBreakdown.total}/100. Mínimo 70 para aprovação direta.`,
      });
      navigate('/');
      return;
    }

    const creative = generateCreativeDirection(data);
    const updated = { ...data, ...creative, score: scoreBreakdown.total, status: 'approved' as const };
    saveBriefing(updated);
    toast({ title: 'Briefing aprovado! ✅', description: 'Direção criativa gerada automaticamente.' });
    navigate('/');
  };

  const renderStep = () => {
    const props = { data, onChange: handleChange, errors };
    switch (currentStep) {
      case 0: return <StepProjectInfo {...props} />;
      case 1: return <StepObjective {...props} />;
      case 2: return <StepAudience {...props} />;
      case 3: return <StepCreativeDirection {...props} />;
      case 4: return <StepReferences {...props} />;
      case 5: return <StepTechnicalSpecs {...props} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveDraft}>
            <Save className="w-4 h-4 mr-1" /> Salvar
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 pb-32 space-y-4">
        {/* Steps */}
        <StepIndicator steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} />

        {/* Score */}
        <ScoreDisplay score={scoreBreakdown.total} breakdown={scoreBreakdown} />

        {/* Form step */}
        <div className="glass-card p-4">
          {renderStep()}
        </div>

        {/* Creative direction preview */}
        {showCreative && data.generatedSummary && (
          <div className="glass-card p-4 space-y-3 fade-in border-l-4" style={{ borderLeftColor: 'hsl(var(--success))' }}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Direção Criativa Gerada</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs font-medium">Resumo</p>
                <p>{data.generatedSummary}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">Conceito</p>
                <p>{data.generatedConcept}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">Estilo</p>
                <p>{data.generatedStyle}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">Execução</p>
                <p>{data.generatedExecution}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
            </Button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} className="flex-1">
              Próximo <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <div className="flex-1 flex gap-2">
              <Button variant="outline" onClick={handleGenerateCreative} className="flex-1">
                <Sparkles className="w-4 h-4 mr-1" /> Preview
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                variant={scoreBreakdown.total >= 70 ? 'default' : 'outline'}
              >
                {scoreBreakdown.total >= 70 ? (
                  <><CheckCircle2 className="w-4 h-4 mr-1" /> Enviar</>
                ) : (
                  <><AlertTriangle className="w-4 h-4 mr-1" /> Revisão</>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
