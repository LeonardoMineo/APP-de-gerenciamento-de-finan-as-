import React, { useState } from 'react';
import { Expense, Income, IncomeCategory, IncomeFrequency, IncomeStatus, UserProfile } from '../types';
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit2, 
  Search, 
  ArrowUpRight, 
  AlertTriangle, 
  Sparkles,
  Layers,
  Building2,
  X
} from 'lucide-react';

interface IncomeManagerProps {
  incomes: Income[];
  expenses: Expense[];
  currentUser: UserProfile;
  onAddIncome: (income: Omit<Income, 'id' | 'userId'>) => void;
  onUpdateIncome: (income: Income) => void;
  onDeleteIncome: (id: string) => void;
  onNavigateToReport: () => void;
  onViewDetail?: (income: Income) => void;
}

const CATEGORIES: IncomeCategory[] = [
  'Salário',
  'Pró-Labore',
  'Freelance / Serviços',
  'Rendimentos & Dividendos',
  'Aluguel Recebido',
  'Vendas & Comissões',
  'Benefícios & Reembolsos',
  'Outros',
];

const FREQUENCIES: IncomeFrequency[] = ['Mensal', 'Quinzenal', 'Semanal', 'Pontual'];

export const IncomeManager: React.FC<IncomeManagerProps> = ({
  incomes,
  expenses,
  currentUser,
  onAddIncome,
  onUpdateIncome,
  onDeleteIncome,
  onNavigateToReport,
  onViewDetail,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<IncomeCategory>('Salário');
  const [frequency, setFrequency] = useState<IncomeFrequency>('Mensal');
  const [status, setStatus] = useState<IncomeStatus>('received');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState('Nubank / Conta Corrente');
  const [notes, setNotes] = useState('');

  // Calculations
  const receivedIncomes = incomes.filter((i) => i.status === 'received');
  const pendingIncomes = incomes.filter((i) => i.status === 'pending');

  const totalReceived = receivedIncomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const totalPending = pendingIncomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const totalIncome = totalReceived + totalPending;

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netSavings = totalReceived - totalExpenses;
  const coveragePercent = totalExpenses > 0 ? (totalReceived / totalExpenses) * 100 : 100;
  const savingsRate = totalReceived > 0 ? Math.max(0, (netSavings / totalReceived) * 100) : 0;

  // Filtered list
  const filteredIncomes = incomes.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchSearch =
      !searchQuery ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.account && item.account.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchStatus && matchSearch;
  });

  const openAddModal = () => {
    setEditingIncome(null);
    setDescription('');
    setAmount('');
    setCategory('Salário');
    setFrequency('Mensal');
    setStatus('received');
    setDate(new Date().toISOString().split('T')[0]);
    setAccount('Nubank / Conta Corrente');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (income: Income) => {
    setEditingIncome(income);
    setDescription(income.description);
    setAmount(String(income.amount));
    setCategory(income.category);
    setFrequency(income.frequency);
    setStatus(income.status);
    setDate(income.date);
    setAccount(income.account || 'Nubank / Conta Corrente');
    setNotes(income.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) return;

    if (editingIncome) {
      onUpdateIncome({
        ...editingIncome,
        description: description.trim(),
        amount: Number(amount),
        category,
        frequency,
        status,
        date,
        account: account.trim(),
        notes: notes.trim(),
      });
    } else {
      onAddIncome({
        description: description.trim(),
        amount: Number(amount),
        category,
        frequency,
        status,
        date,
        account: account.trim(),
        notes: notes.trim(),
      });
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (income: Income) => {
    onUpdateIncome({
      ...income,
      status: income.status === 'received' ? 'pending' : 'received',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display flex items-center gap-2.5 drop-shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950/60 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-300" />
              </div>
            </div>
            Área de Renda & Entradas
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Gestão de salários, freelances, dividendos e comparativo direto com gastos
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 border border-emerald-300/40 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Nova Entrada de Renda
        </button>
      </div>

      {/* Top Metrics Grid with Frosted Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-2 hover:bg-white/[0.14] transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-medium uppercase tracking-wider">Renda Recebida</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-display">
            R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-300 pt-1 border-t border-white/10">
            {receivedIncomes.length} entrada(s) confirmada(s)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-2 hover:bg-white/[0.14] transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-medium uppercase tracking-wider">A Receber / Pendente</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-display">
            R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-300 pt-1 border-t border-white/10">
            {pendingIncomes.length} previsão(ões) de entrada
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-2 hover:bg-white/[0.14] transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-medium uppercase tracking-wider">Renda Total Prevista</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-display">
            R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-300 pt-1 border-t border-white/10">Total bruto projetado no mês</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-2 hover:bg-white/[0.14] transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-medium uppercase tracking-wider">Meta de Renda</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-300 font-display">
            R${' '}
            {(currentUser.monthlyIncomeGoal || 8000).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="mt-2 w-full bg-slate-900/60 rounded-full h-2 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  (totalReceived / (currentUser.monthlyIncomeGoal || 8000)) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Renda vs Gastos Comparison Card with Frosted Glass */}
      <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-emerald-400/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Comparativo de Fluxo: Renda vs Gastos
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-display">
              {netSavings >= 0 ? (
                <span>
                  Sua renda cobre <span className="text-emerald-400">{coveragePercent.toFixed(0)}%</span> dos seus
                  gastos totais
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alerta: Gastos superam a renda recebida em R$ {Math.abs(netSavings).toFixed(2)}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              Renda Recebida: <strong className="text-emerald-400">R$ {totalReceived.toFixed(2)}</strong> | Despesas
              Totais: <strong className="text-rose-400">R$ {totalExpenses.toFixed(2)}</strong> | Saldo Líquido:{' '}
              <strong className={netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                R$ {netSavings.toFixed(2)}
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/15 text-center shadow-lg">
              <span className="text-[10px] uppercase font-bold text-slate-300 block tracking-wider">Taxa de Poupança</span>
              <span
                className={`text-xl font-extrabold font-display ${
                  savingsRate >= 20 ? 'text-emerald-400' : savingsRate > 0 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {savingsRate.toFixed(1)}%
              </span>
            </div>

            <button
              onClick={onNavigateToReport}
              className="flex items-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/25 border border-white/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Gerar Relatório de Uso com IA
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar with Frosted Glass */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar renda ou conta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-400/80 focus:bg-white/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-blue-400 cursor-pointer"
          >
            <option value="all">Todas Categorias</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-blue-400 cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            <option value="received">Recebido</option>
            <option value="pending">A Receber</option>
          </select>
        </div>
      </div>

      {/* Incomes Table / List with Frosted Glass */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Entradas de Renda ({filteredIncomes.length})
          </h3>
          <span className="text-xs text-slate-300">Clique no status para alternar recebimento</span>
        </div>

        {filteredIncomes.length === 0 ? (
          <div className="py-12 text-center text-slate-300 space-y-3">
            <TrendingUp className="w-10 h-10 mx-auto text-slate-500 opacity-50" />
            <p className="text-sm">Nenhuma entrada de renda encontrada com os filtros selecionados.</p>
            <button
              onClick={openAddModal}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar nova renda agora
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/10 overflow-x-auto">
            {filteredIncomes.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.08] transition-colors group"
              >
                <div 
                  onClick={() => onViewDetail ? onViewDetail(item) : openEditModal(item)}
                  className="flex items-start sm:items-center gap-3.5 min-w-0 cursor-pointer flex-1"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      item.status === 'received'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                        {item.description}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/15">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-300">{item.frequency}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.date}
                      </span>
                      {item.account && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {item.account}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-13 sm:pl-0">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-emerald-400 font-display">
                      + R${' '}
                      {Number(item.amount).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => toggleStatus(item)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      item.status === 'received'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-xs'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 shadow-xs'
                    }`}
                    title="Clique para alternar status"
                  >
                    {item.status === 'received' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Recebido
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        A Receber
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {onViewDetail && (
                      <button
                        onClick={() => onViewDetail(item)}
                        className="px-2 py-1 text-[11px] font-semibold text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 rounded-lg transition-colors cursor-pointer"
                        title="Ver detalhes do item"
                      >
                        Abrir
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Editar entrada"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteIncome(item.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                      title="Excluir entrada"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Income Modal with Frosted Glass */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                {editingIncome ? 'Editar Entrada de Renda' : 'Nova Entrada de Renda'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">Descrição / Fonte da Renda</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Salário Empresa X, Freelance Design, Dividendos FIIs"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-400 focus:bg-white/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Valor Bruto (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-400 focus:bg-white/10 font-bold transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IncomeCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 rounded-xl text-sm text-white focus:outline-hidden focus:border-blue-400 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Frequência</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as IncomeFrequency)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 rounded-xl text-sm text-white focus:outline-hidden focus:border-blue-400 cursor-pointer"
                  >
                    {FREQUENCIES.map((freq) => (
                      <option key={freq} value={freq}>
                        {freq}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as IncomeStatus)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 rounded-xl text-sm text-white focus:outline-hidden focus:border-blue-400 cursor-pointer"
                  >
                    <option value="received">Recebido</option>
                    <option value="pending">A Receber</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-sm text-white focus:outline-hidden focus:border-blue-400 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">Conta / Instituição de Destino</label>
                <input
                  type="text"
                  placeholder="Ex: Nubank, Inter, XP Investimentos, Itaú"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-400 focus:bg-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">Observações (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Já com desconto de IR retido na fonte"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-400 focus:bg-white/10 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-white/20 bg-white/5 text-slate-300 hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 border border-emerald-300/40 cursor-pointer"
                >
                  {editingIncome ? 'Salvar Alterações' : 'Cadastrar Entrada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
