import React, { useState } from 'react';
import { Expense, FinancialGoal, FinancialReport, Income, UserProfile } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Printer, 
  RefreshCw, 
  PieChart, 
  DollarSign, 
  CheckSquare, 
  Square,
  Flame,
  Award,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinancialReportViewProps {
  incomes: Income[];
  expenses: Expense[];
  goals: FinancialGoal[];
  currentUser: UserProfile;
  lastReport: FinancialReport | null;
  onReportGenerated: (report: FinancialReport) => void;
}

export const FinancialReportView: React.FC<FinancialReportViewProps> = ({
  incomes,
  expenses,
  goals,
  currentUser,
  lastReport,
  onReportGenerated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customFocus, setCustomFocus] = useState('Análise Geral de Saúde Financeira e Alocação 50/30/20');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Base metrics for summary
  const totalIncome = incomes
    .filter((i) => i.status === 'received')
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  const generateReport = async (focusOverride?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/financial-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: currentUser,
          incomes,
          expenses,
          goals,
          customFocus: focusOverride || customFocus,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar relatório');
      }

      const report: FinancialReport = await response.json();
      onReportGenerated(report);

      if (report.healthScore >= 75) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 },
        });
      }
    } catch (e) {
      console.error('Error generating AI report:', e);
      alert('Erro ao conectar com o serviço de IA. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Focus Generator with Frosted Glass */}
      <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Inteligência Artificial de Diagnóstico
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display drop-shadow-sm">
              Relatório de Saúde Financeira & Uso do Dinheiro
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Auditoria inteligente confrontando sua renda recebida de <strong className="text-emerald-400">R$ {totalIncome.toFixed(2)}</strong> com seus gastos de <strong className="text-rose-400">R$ {totalExpenses.toFixed(2)}</strong> e taxa de poupança de <strong className="text-cyan-300">{savingsRate.toFixed(1)}%</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <select
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-blue-400 cursor-pointer"
            >
              <option value="Análise Geral de Saúde Financeira e Alocação 50/30/20">Foco: Análise Completa 50/30/20</option>
              <option value="Otimizar Gastos, Eliminar Desperdícios e Reduzir Supérfluos">Foco: Cortar Gastos & Desperdícios</option>
              <option value="Montagem e Consolidação da Reserva de Emergência">Foco: Segurança & Reserva de Emergência</option>
              <option value="Aumento de Capacidade de Poupança e Geração de Renda">Foco: Renda Extra & Economia</option>
            </select>

            <button
              onClick={() => generateReport()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-blue-500/25 border border-white/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processando com IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  {lastReport ? 'Atualizar Diagnóstico IA' : 'Gerar Diagnóstico com IA'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* If No Report Generated Yet */}
      {!lastReport && !isLoading && (
        <div className="p-12 text-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">
            Seu relatório de saúde financeira está pronto para ser gerado
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            A IA analisará todos os seus lançamentos de renda e despesas por categoria para responder com precisão se você está fazendo um bom uso do seu dinheiro.
          </p>
          <button
            onClick={() => generateReport()}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 border border-emerald-300/40 inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Gerar Diagnóstico Agora
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-12 text-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4 animate-pulse">
          <RefreshCw className="w-10 h-10 text-blue-300 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-white font-display">
            A IA está auditando seu fluxo de caixa, proporções 50/30/20 e oportunidades de economia...
          </h3>
          <p className="text-xs text-slate-300">Isso leva apenas alguns segundos.</p>
        </div>
      )}

      {/* Report Content */}
      {lastReport && !isLoading && (
        <div className="space-y-6 print:space-y-4">
          {/* Print / Export Bar */}
          <div className="flex items-center justify-between text-xs text-slate-300 bg-white/10 backdrop-blur-xl p-3.5 rounded-2xl border border-white/20 shadow-lg print:hidden">
            <span>
              Relatório gerado em:{' '}
              <strong className="text-white">
                {new Date(lastReport.generatedAt).toLocaleString('pt-BR')}
              </strong>
            </span>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              Imprimir / Salvar PDF
            </button>
          </div>

          {/* Primary Score & Verdict Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Radial Card */}
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-slate-800 stroke-current opacity-60"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={`stroke-current transition-all duration-1000 ${
                      lastReport.healthScore >= 80
                        ? 'text-emerald-400'
                        : lastReport.healthScore >= 65
                        ? 'text-teal-400'
                        : lastReport.healthScore >= 45
                        ? 'text-amber-400'
                        : 'text-rose-500'
                    }`}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - lastReport.healthScore / 100)}`}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white font-display">
                    {lastReport.healthScore}
                  </span>
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">de 100</span>
                </div>
              </div>

              <div className="mt-3">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                    lastReport.healthLevel === 'Excelente'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : lastReport.healthLevel === 'Saudável'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : lastReport.healthLevel === 'Atenção'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  Nível: {lastReport.healthLevel}
                </div>
              </div>
            </div>

            {/* Verdict Box */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                      lastReport.isGoodMoneyUse
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {lastReport.isGoodMoneyUse ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Diagnóstico Principal de Uso do Dinheiro
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-display">
                  {lastReport.verdictTitle}
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {lastReport.verdictDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div>
                  Taxa de Poupança:{' '}
                  <strong className="text-emerald-400 font-bold">{lastReport.savingsRate}%</strong>
                </div>
                <div>
                  Uso do Dinheiro:{' '}
                  <strong
                    className={`font-bold ${
                      lastReport.isGoodMoneyUse ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {lastReport.isGoodMoneyUse ? 'Positivo / Saudável' : 'Atenção Necessária'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* 50/30/20 Rule Analysis with Frosted Glass */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-300" />
                  Auditoria da Regra 50 / 30 / 20
                </h3>
                <p className="text-xs text-slate-300">Comparação da sua divisão real versus a proporção ideal recomendada</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Needs (50%) */}
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Necessidades (Essencial)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Ideal: 50%
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-blue-300 font-display">
                  {lastReport.rule50_30_20.needsPercent}%
                </div>
                <div className="w-full bg-slate-900/60 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className={`h-full rounded-full ${
                      lastReport.rule50_30_20.needsPercent <= 55 ? 'bg-blue-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, lastReport.rule50_30_20.needsPercent)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-300">Moradia, supermercado, saúde e transporte</p>
              </div>

              {/* Wants (30%) */}
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Desejos (Estilo de Vida)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Ideal: 30%
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-amber-300 font-display">
                  {lastReport.rule50_30_20.wantsPercent}%
                </div>
                <div className="w-full bg-slate-900/60 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className={`h-full rounded-full ${
                      lastReport.rule50_30_20.wantsPercent <= 35 ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, lastReport.rule50_30_20.wantsPercent)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-300">Lazer, restaurantes, compras e assinaturas</p>
              </div>

              {/* Savings & Reserve (20%) */}
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Poupança & Reserva</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Ideal: 20%
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-300 font-display">
                  {lastReport.rule50_30_20.savingsPercent}%
                </div>
                <div className="w-full bg-slate-900/60 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full"
                    style={{ width: `${Math.min(100, lastReport.rule50_30_20.savingsPercent)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-300">Reserva de emergência e sobra financeira</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-xs text-slate-200">
              <span className="font-bold text-blue-300">Avaliação do Modelo:</span>{' '}
              {lastReport.rule50_30_20.evaluation}
            </div>
          </div>

          {/* Strengths & Leakages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Strengths */}
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-3.5">
              <h3 className="text-base font-bold text-emerald-400 font-display flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Pontos Fortes Identificados
              </h3>
              <ul className="space-y-2.5">
                {lastReport.keyStrengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Leakages & Waste */}
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-3.5">
              <h3 className="text-base font-bold text-amber-300 font-display flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Vazamentos & Pontos de Otimização
              </h3>
              <ul className="space-y-2.5">
                {lastReport.leakagesAndWaste.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-300" />
                  Plano de Ação Personalizado (Passo a Passo)
                </h3>
                <p className="text-xs text-slate-300">Marque as etapas conforme for executando para melhorar sua nota</p>
              </div>
              <span className="text-xs text-emerald-300 font-bold bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
                {completedSteps.length} de {lastReport.actionPlan.length} concluídos
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {lastReport.actionPlan.map((action) => {
                const isDone = completedSteps.includes(action.stepNumber);
                return (
                  <div
                    key={action.stepNumber}
                    onClick={() => toggleStep(action.stepNumber)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-400/40 opacity-80'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <button className="text-emerald-400 mt-0.5 shrink-0 focus:outline-hidden cursor-pointer">
                      {isDone ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-400" />}
                    </button>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-bold ${
                            isDone ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          Passo {action.stepNumber}: {action.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/15">
                          {action.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            action.impact === 'Alto'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                          }`}
                        >
                          Impacto {action.impact}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{action.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advice & Wealth Projections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Practical Advice */}
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-3">
              <h3 className="text-base font-bold text-teal-300 font-display flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Diretriz Estratégica Principal
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {lastReport.summaryAdvice || 'Mantenha seus custos fixos controlados e automatize a separação de parte da sua renda logo no dia do recebimento.'}
              </p>
            </div>

            {/* Wealth Projections */}
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Projeção de Poupança Acumulada
                </h3>
                <p className="text-xs text-slate-300">Estimativa com acúmulo contínuo da sua sobra mensal</p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-300 block tracking-wider">Em 1 Ano</span>
                  <span className="text-sm sm:text-base font-extrabold text-white font-display">
                    R$ {lastReport.wealthProjections.in1Year.toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-300 block tracking-wider">Em 5 Anos</span>
                  <span className="text-sm sm:text-base font-extrabold text-teal-300 font-display">
                    R$ {lastReport.wealthProjections.in5Years.toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-300 block tracking-wider">Em 10 Anos</span>
                  <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-display">
                    R$ {lastReport.wealthProjections.in10Years.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
