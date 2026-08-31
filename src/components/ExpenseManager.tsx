import React, { useState } from 'react';
import { Expense, ExpenseCategory, ExpenseStatus, ExpenseType, PaymentMethod, UserProfile } from '../types';
import { 
  Plus, 
  CreditCard, 
  Search, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle,
  Tag,
  Receipt,
  X
} from 'lucide-react';

interface ExpenseManagerProps {
  expenses: Expense[];
  currentUser: UserProfile;
  onAddExpense: (expense: Omit<Expense, 'id' | 'userId'>) => void;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onViewDetail?: (expense: Expense) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Moradia (Aluguel, Condomínio, Luz)',
  'Alimentação & Supermercado',
  'Transporte & Combustível',
  'Saúde & Cuidados',
  'Educação & Cursos',
  'Lazer & Restaurantes',
  'Assinaturas & Serviços',
  'Compras & Vestuário',
  'Dívidas & Empréstimos',
  'Outros',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'Cartão de Crédito',
  'PIX',
  'Cartão de Débito',
  'Boleto',
  'Dinheiro',
  'Transferência',
];

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  expenses,
  currentUser,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onViewDetail,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Alimentação & Supermercado');
  const [type, setType] = useState<ExpenseType>('essential');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cartão de Crédito');
  const [status, setStatus] = useState<ExpenseStatus>('paid');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Calculations
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const paidExpenses = expenses.filter((e) => e.status === 'paid').reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const pendingExpenses = expenses.filter((e) => e.status === 'pending').reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const essentialTotal = expenses.filter((e) => e.type === 'essential').reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const lifestyleTotal = expenses.filter((e) => e.type === 'lifestyle').reduce((sum, e) => sum + Number(e.amount || 0), 0);

  // Filtered
  const filteredExpenses = expenses.filter((e) => {
    const matchCat = selectedCategory === 'all' || e.category === selectedCategory;
    const matchPay = selectedPayment === 'all' || e.paymentMethod === selectedPayment;
    const matchStatus = selectedStatus === 'all' || e.status === selectedStatus;
    const matchSearch =
      !searchQuery ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchPay && matchStatus && matchSearch;
  });

  const openAddModal = () => {
    setEditingExpense(null);
    setDescription('');
    setAmount('');
    setCategory('Alimentação & Supermercado');
    setType('essential');
    setPaymentMethod('Cartão de Crédito');
    setStatus('paid');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Expense) => {
    setEditingExpense(exp);
    setDescription(exp.description);
    setAmount(String(exp.amount));
    setCategory(exp.category);
    setType(exp.type);
    setPaymentMethod(exp.paymentMethod);
    setStatus(exp.status);
    setDate(exp.date);
    setNotes(exp.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) return;

    if (editingExpense) {
      onUpdateExpense({
        ...editingExpense,
        description: description.trim(),
        amount: Number(amount),
        category,
        type,
        paymentMethod,
        status,
        date,
        notes: notes.trim(),
      });
    } else {
      onAddExpense({
        description: description.trim(),
        amount: Number(amount),
        category,
        type,
        paymentMethod,
        status,
        date,
        notes: notes.trim(),
      });
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (exp: Expense) => {
    onUpdateExpense({
      ...exp,
      status: exp.status === 'paid' ? 'pending' : 'paid',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display flex items-center gap-2.5 drop-shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950/60 rounded-[10px] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-rose-300" />
              </div>
            </div>
            Despesas & Gastos
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Controle de despesas essenciais, estilo de vida e formas de pagamento
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-rose-500/25 border border-rose-300/40 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Nova Despesa
        </button>
      </div>

      {/* Metrics Grid with Frosted Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-2 hover:bg-white/[0.14] transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-medium uppercase tracking-wider">Gastos Totais</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-display">
            R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-300 pt-1 border-t border-white/10">{expenses.length} lançamento(s)</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-2 hover:bg-white/[0.14] transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-medium uppercase tracking-wider">Essenciais (50%)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-300 font-display">
            R$ {essentialTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-300 pt-1 border-t border-white/10">
            {totalExpenses > 0 ? ((essentialTotal / totalExpenses) * 100).toFixed(1) : 0}% do total de saídas
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-2 hover:bg-white/[0.14] transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-medium uppercase tracking-wider">Estilo de Vida (30%)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-display">
            R$ {lifestyleTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-300 pt-1 border-t border-white/10">
            {totalExpenses > 0 ? ((lifestyleTotal / totalExpenses) * 100).toFixed(1) : 0}% do total de saídas
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-2 hover:bg-white/[0.14] transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-medium uppercase tracking-wider">A Pagar / Pendentes</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-display">
            R$ {pendingExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-300 pt-1 border-t border-white/10">
            {expenses.filter((e) => e.status === 'pending').length} fatura(s) em aberto
          </p>
        </div>
      </div>

      {/* Filters Bar with Frosted Glass */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar despesa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-rose-400/80 focus:bg-white/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-rose-400 cursor-pointer"
          >
            <option value="all">Todas as Categorias</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="px-3.5 py-2 bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-rose-400 cursor-pointer"
          >
            <option value="all">Forma de Pagamento</option>
            {PAYMENT_METHODS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-rose-400 cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            <option value="paid">Pago</option>
            <option value="pending">Pendente</option>
          </select>
        </div>
      </div>

      {/* Expenses Table with Frosted Glass */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-display">Lançamentos de Despesas ({filteredExpenses.length})</h3>
          <span className="text-xs text-slate-300">Clique no status para marcar como pago</span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="py-12 text-center text-slate-300 space-y-3">
            <CreditCard className="w-10 h-10 mx-auto text-slate-500 opacity-50" />
            <p className="text-sm">Nenhuma despesa encontrada para esta busca.</p>
            <button
              onClick={openAddModal}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar nova despesa
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/10 overflow-x-auto">
            {filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.08] transition-colors group"
              >
                <div 
                  onClick={() => onViewDetail ? onViewDetail(exp) : openEditModal(exp)}
                  className="flex items-start sm:items-center gap-3.5 min-w-0 cursor-pointer flex-1"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      exp.type === 'essential'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                        {exp.description}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/15">
                        {exp.category}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          exp.type === 'essential'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {exp.type === 'essential' ? 'Essencial (50%)' : 'Estilo de Vida (30%)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {exp.date}
                      </span>
                      <span>{exp.paymentMethod}</span>
                      {exp.notes && <span className="text-slate-400 italic truncate max-w-xs">{exp.notes}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-13 sm:pl-0">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-rose-400 font-display">
                      - R${' '}
                      {Number(exp.amount).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <button
                    onClick={() => toggleStatus(exp)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      exp.status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-xs'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 shadow-xs'
                    }`}
                  >
                    {exp.status === 'paid' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Pago
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-rose-400" />
                        Pendente
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {onViewDetail && (
                      <button
                        onClick={() => onViewDetail(exp)}
                        className="px-2 py-1 text-[11px] font-semibold text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 rounded-lg transition-colors cursor-pointer"
                        title="Ver detalhes do item"
                      >
                        Abrir
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(exp)}
                      className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Editar despesa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                      title="Excluir despesa"
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

      {/* Expense Modal with Frosted Glass */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-400" />
                {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
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
                <label className="block text-xs font-medium text-slate-200 mb-1">Descrição do Gasto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aluguel, Supermercado, Jantar, Netflix"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-rose-400 focus:bg-white/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-rose-400 focus:bg-white/10 font-bold transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value as ExpenseCategory;
                      setCategory(newCat);
                      // Auto classify 50/30/20
                      if (
                        newCat.includes('Moradia') ||
                        newCat.includes('Alimentação') ||
                        newCat.includes('Transporte') ||
                        newCat.includes('Saúde') ||
                        newCat.includes('Educação')
                      ) {
                        setType('essential');
                      } else {
                        setType('lifestyle');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 rounded-xl text-sm text-white focus:outline-hidden focus:border-rose-400 cursor-pointer"
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
                  <label className="block text-xs font-medium text-slate-200 mb-1">Tipo 50/30/20</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ExpenseType)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 rounded-xl text-sm text-white focus:outline-hidden focus:border-rose-400 cursor-pointer"
                  >
                    <option value="essential">Essencial (50%)</option>
                    <option value="lifestyle">Estilo de Vida (30%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 rounded-xl text-sm text-white focus:outline-hidden focus:border-rose-400 cursor-pointer"
                  >
                    {PAYMENT_METHODS.map((pay) => (
                      <option key={pay} value={pay}>
                        {pay}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-sm text-white focus:outline-hidden focus:border-rose-400 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">Status de Pagamento</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStatus('paid')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      status === 'paid'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-xs'
                        : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Já Pago
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('pending')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      status === 'pending'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-xs'
                        : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    A Pagar / Fatura Aberta
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">Observações (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Parcela 2 de 5 no cartão Nubank"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-rose-400 focus:bg-white/10 transition-all"
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
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-rose-500/25 border border-rose-300/40 cursor-pointer"
                >
                  {editingExpense ? 'Salvar Alterações' : 'Cadastrar Despesa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
