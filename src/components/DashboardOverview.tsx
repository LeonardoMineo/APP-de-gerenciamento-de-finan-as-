import React from 'react';
import { Expense, FinancialGoal, FinancialReport, Income, UserProfile } from '../types';
import { 
  TrendingUp, 
  CreditCard, 
  DollarSign, 
  Sparkles, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Target, 
  Calendar,
  Table,
  CheckCircle2,
  Percent
} from 'lucide-react';

interface DashboardOverviewProps {
  currentUser: UserProfile;
  incomes: Income[];
  expenses: Expense[];
  goals: FinancialGoal[];
  lastReport: FinancialReport | null;
  onNavigateTab: (tab: 'income' | 'expenses' | 'report' | 'sheets') => void;
  onOpenDetail?: (type: 'income' | 'expense', item: Income | Expense) => void;
  onOpenGoalDetail?: (goal: FinancialGoal) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentUser,
  incomes,
  expenses,
  goals,
  lastReport,
  onNavigateTab,
  onOpenDetail,
  onOpenGoalDetail,
}) => {
  // Calculations
  const receivedIncome = incomes
    .filter((i) => i.status === 'received')
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const pendingIncome = incomes
    .filter((i) => i.status === 'pending')
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const totalIncome = receivedIncome + pendingIncome;

  const paidExpenses = expenses
    .filter((e) => e.status === 'paid')
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const pendingExpenses = expenses
    .filter((e) => e.status === 'pending')
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalExpenses = paidExpenses + pendingExpenses;

  const netBalance = receivedIncome - paidExpenses;
  const isSurplus = netBalance >= 0;
  const savingsRate = receivedIncome > 0 ? (Math.max(0, netBalance) / receivedIncome) * 100 : 0;

  // Recent transactions combined
  const recentActivities = [
    ...incomes.slice(0, 4).map((i) => ({
      id: i.id,
      type: 'income' as const,
      description: i.description,
      amount: i.amount,
      date: i.date,
      category: i.category,
      status: i.status,
    })),
    ...expenses.slice(0, 4).map((e) => ({
      id: e.id,
      type: 'expense' as const,
      description: e.description,
      amount: e.amount,
      date: e.date,
      category: e.category,
      status: e.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner with Frosted Glass & Quick Actions */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-400/30">
              Painel Financeiro
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs text-slate-300 font-medium">Conta: {currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight drop-shadow-sm">
            Olá, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Seu saldo líquido no momento é de{' '}
            <strong className={isSurplus ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>{' '}
            com taxa de poupança estimada em <strong className="text-blue-300 font-bold">{savingsRate.toFixed(1)}%</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => onNavigateTab('income')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 border border-emerald-300/40 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            + Adicionar Renda
          </button>
          <button
            onClick={() => onNavigateTab('expenses')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/90 hover:bg-rose-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-rose-500/25 border border-rose-300/40 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            + Registrar Despesa
          </button>
        </div>
      </div>

      {/* Main KPI Cards with Frosted Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Saldo Líquido */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl space-y-3 hover:bg-white/[0.14] transition-all">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span className="uppercase tracking-wider">Saldo Líquido</span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-md ${
                isSurplus ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-2xl sm:text-3xl font-extrabold font-display ${
              isSurplus ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isSurplus ? '+' : ''} R${' '}
            {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
            <span>{isSurplus ? 'Superávit no fluxo' : 'Atenção aos custos'}</span>
            <span className="font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {savingsRate.toFixed(0)}% poupado
            </span>
          </div>
        </div>

        {/* Renda Total */}
        <div
          onClick={() => onNavigateTab('income')}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl space-y-3 cursor-pointer hover:bg-white/[0.14] hover:border-emerald-400/40 transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span className="uppercase tracking-wider group-hover:text-emerald-300 transition-colors">Renda Mensal</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">
            R$ {receivedIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
            <span>+ R$ {pendingIncome.toFixed(2)} pendente</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Despesas Totais */}
        <div
          onClick={() => onNavigateTab('expenses')}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl space-y-3 cursor-pointer hover:bg-white/[0.14] hover:border-rose-400/40 transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span className="uppercase tracking-wider group-hover:text-rose-300 transition-colors">Gastos Totais</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-display">
            R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
            <span>R$ {pendingExpenses.toFixed(2)} a liquidar</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Taxa de Poupança & Capacidade de Economia */}
        <div
          onClick={() => onNavigateTab('report')}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl space-y-3 cursor-pointer hover:bg-white/[0.14] hover:border-cyan-400/40 transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span className="uppercase tracking-wider group-hover:text-cyan-300 transition-colors">Taxa de Poupança</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display">
            {savingsRate.toFixed(1)}%
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
            <span>Meta ideal: &ge; 20%</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* AI Health Quick Status Banner & Score Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Score Financeiro Glass Card */}
        <div className="bg-emerald-500/15 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-emerald-300 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Score de Saúde Financeira
            </h3>
            <p className="text-xs text-slate-200 mb-4 leading-relaxed">
              {lastReport 
                ? `Nota calculada por IA: ${lastReport.healthScore}/100. Status: ${lastReport.healthLevel}.` 
                : 'Sua relação receita vs. despesas está equilibrada. Gere um diagnóstico completo com IA para recomendações precisas.'}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span>Nível de Solidez</span>
              <span>{lastReport ? `${lastReport.healthScore}%` : '85%'}</span>
            </div>
            <div className="w-full bg-slate-900/60 rounded-full h-2 overflow-hidden border border-white/10">
              <div 
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${lastReport ? lastReport.healthScore : 85}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Health Full Card */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/40 to-indigo-600/40 border border-blue-400/40 text-blue-300 flex items-center justify-center font-extrabold text-xl shrink-0 font-display shadow-lg">
              {lastReport ? lastReport.healthScore : <Sparkles className="w-6 h-6 text-blue-300" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  {lastReport ? lastReport.verdictTitle : 'Diagnóstico Inteligente do Uso do Dinheiro'}
                </h3>
                {lastReport && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {lastReport.healthLevel}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 mt-1 max-w-xl leading-relaxed">
                {lastReport
                  ? lastReport.verdictDescription.slice(0, 140) + '...'
                  : 'A Inteligência Artificial analisa se suas rendas cobrem os gastos, verifica a regra 50/30/20 e indica onde cortar gastos supérfluos.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('report')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/30 border border-blue-400/40 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {lastReport ? 'Ver Relatório Completo' : 'Gerar Diagnóstico IA'}
          </button>
        </div>
      </div>

      {/* Two Column Grid: Recent Activity & Goals/Sheets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Lançamentos Recentes
            </h3>
            <button
              onClick={() => onNavigateTab('income')}
              className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-semibold cursor-pointer"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-2.5 pt-1">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-slate-300 py-6 text-center">Nenhuma movimentação registrada nesta conta.</p>
            ) : (
              recentActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => {
                    if (onOpenDetail) {
                      if (act.type === 'income') {
                        const original = incomes.find(i => i.id === act.id);
                        if (original) onOpenDetail('income', original);
                      } else {
                        const original = expenses.find(e => e.id === act.id);
                        if (original) onOpenDetail('expense', original);
                      }
                    }
                  }}
                  className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        act.type === 'income'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {act.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate">{act.description}</p>
                      <span className="text-[10px] text-slate-300">
                        {act.category} • {act.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-extrabold font-display ${
                        act.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {act.type === 'income' ? '+' : '-'} R${' '}
                      {Number(act.amount).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Goals & Sheet Sync Shortcuts */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                Metas & Objetivos Financeiros
              </h3>
            </div>

            <div className="space-y-3 pt-1">
              {goals.length === 0 ? (
                <p className="text-xs text-slate-300 py-4 text-center">Nenhuma meta cadastrada no momento.</p>
              ) : (
                goals.slice(0, 3).map((g) => {
                  const progress = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
                  return (
                    <div key={g.id} className="space-y-2 p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{g.title}</span>
                        <span className="font-bold text-white">
                          {progress.toFixed(0)}% (R$ {g.currentAmount.toLocaleString('pt-BR')})
                        </span>
                      </div>
                      <div className="w-full bg-slate-900/60 rounded-full h-2 overflow-hidden border border-white/10">
                        <div
                          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => onNavigateTab('sheets')}
              className="w-full py-3 px-4 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Table className="w-4 h-4 text-emerald-400" />
              Sincronizar & Exportar para Planilha Google Sheets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
