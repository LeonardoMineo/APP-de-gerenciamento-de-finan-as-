import React, { useState, useEffect } from 'react';
import { 
  Expense, 
  FinancialGoal, 
  FinancialReport, 
  Income, 
  UserProfile 
} from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { GoogleAccountSelectorModal } from './components/GoogleAccountSelectorModal';
import { AuthScreen } from './components/AuthScreen';
import { ItemDetailModal, DetailItemType } from './components/ItemDetailModal';
import { DashboardOverview } from './components/DashboardOverview';
import { IncomeManager } from './components/IncomeManager';
import { ExpenseManager } from './components/ExpenseManager';
import { FinancialReportView } from './components/FinancialReportView';
import { SheetsSyncView } from './components/SheetsSyncView';
import { CheckCircle2, Users, LogOut, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => StorageService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'income' | 'expenses' | 'report' | 'sheets'>('dashboard');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<DetailItemType | null>(null);

  // User financial state
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [lastReport, setLastReport] = useState<FinancialReport | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load user data whenever currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setIncomes([]);
      setExpenses([]);
      setGoals([]);
      setLastReport(null);
      return;
    }

    const data = StorageService.getUserData(currentUser.id);
    setIncomes(data.incomes);
    setExpenses(data.expenses);
    setGoals(data.goals);
    setLastReport(data.lastReport);
  }, [currentUser?.id]);

  // Auth Handlers
  const handleSelectUser = (user: UserProfile) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    showToast(`Conectado como ${user.name} (${user.email})`);
  };

  const handleRegisterSuccess = (user: UserProfile) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    showToast(`Conta criada com sucesso para ${user.name}! Todos os valores iniciam zerados.`);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    showToast(`Bem-vindo(a), ${user.name}!`);
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    setIncomes([]);
    setExpenses([]);
    setGoals([]);
    setLastReport(null);
    setDetailItem(null);
    showToast('Você foi desconectado totalmente da conta.');
  };

  const handleZeroAllData = () => {
    if (!currentUser) return;
    StorageService.clearUserLedger(currentUser.id);
    setIncomes([]);
    setExpenses([]);
    setGoals([]);
    setLastReport(null);
    setDetailItem(null);
    showToast('Todos os valores e lançamentos desta conta foram zerados (R$ 0,00)!');
  };

  const handleResetDemoData = () => {
    if (!currentUser) return;
    StorageService.resetUserDemo(currentUser.id);
    const data = StorageService.getUserData(currentUser.id);
    setIncomes(data.incomes);
    setExpenses(data.expenses);
    setGoals(data.goals);
    setLastReport(data.lastReport);
    showToast('Dados de demonstração carregados com sucesso!');
  };

  // Incomes Handlers
  const handleAddIncome = (incomeData: Omit<Income, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newIncome: Income = {
      ...incomeData,
      id: 'inc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: currentUser.id,
    };
    const updated = [newIncome, ...incomes];
    setIncomes(updated);
    StorageService.saveUserIncomes(currentUser.id, updated);
    showToast('Entrada de renda adicionada com sucesso!');
  };

  const handleUpdateIncome = (updatedIncome: Income) => {
    if (!currentUser) return;
    const updated = incomes.map((i) => (i.id === updatedIncome.id ? updatedIncome : i));
    setIncomes(updated);
    StorageService.saveUserIncomes(currentUser.id, updated);
    showToast('Renda atualizada!');
  };

  const handleDeleteIncome = (id: string) => {
    if (!currentUser) return;
    const updated = incomes.filter((i) => i.id !== id);
    setIncomes(updated);
    StorageService.saveUserIncomes(currentUser.id, updated);
    showToast('Entrada de renda removida.');
  };

  // Expenses Handlers
  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newExpense: Expense = {
      ...expenseData,
      id: 'exp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: currentUser.id,
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    StorageService.saveUserExpenses(currentUser.id, updated);
    showToast('Despesa registrada com sucesso!');
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    if (!currentUser) return;
    const updated = expenses.map((e) => (e.id === updatedExpense.id ? updatedExpense : e));
    setExpenses(updated);
    StorageService.saveUserExpenses(currentUser.id, updated);
    showToast('Despesa atualizada!');
  };

  const handleDeleteExpense = (id: string) => {
    if (!currentUser) return;
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    StorageService.saveUserExpenses(currentUser.id, updated);
    showToast('Despesa excluída.');
  };

  // Report Handler
  const handleReportGenerated = (report: FinancialReport) => {
    if (!currentUser) return;
    setLastReport(report);
    StorageService.saveUserReport(currentUser.id, report);
    showToast('Diagnóstico financeiro gerado com sucesso!');
  };

  // Detail Modal Actions
  const handleToggleItemStatus = (detail: DetailItemType) => {
    if (!currentUser) return;
    if (detail.type === 'income') {
      const nextStatus = detail.item.status === 'received' ? 'pending' : 'received';
      const updatedIncome: Income = { ...detail.item, status: nextStatus };
      handleUpdateIncome(updatedIncome);
      setDetailItem({ type: 'income', item: updatedIncome });
    } else if (detail.type === 'expense') {
      const nextStatus = detail.item.status === 'paid' ? 'pending' : 'paid';
      const updatedExpense: Expense = { ...detail.item, status: nextStatus };
      handleUpdateExpense(updatedExpense);
      setDetailItem({ type: 'expense', item: updatedExpense });
    }
  };

  const handleDeleteFromDetail = (detail: DetailItemType) => {
    if (detail.type === 'income') handleDeleteIncome(detail.item.id);
    else if (detail.type === 'expense') handleDeleteExpense(detail.item.id);
  };

  const handleEditFromDetail = (detail: DetailItemType) => {
    if (detail.type === 'income') setActiveTab('income');
    else if (detail.type === 'expense') setActiveTab('expenses');
  };

  // If no user is logged in, render the Auth/Verification portal
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-blue-200 relative overflow-x-hidden">
      {/* Frosted Glass Ambient Lighting Effects */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[520px] h-[520px] bg-blue-600 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600 rounded-full blur-[160px]" />
        <div className="absolute top-[35%] left-[30%] w-[380px] h-[380px] bg-emerald-500 rounded-full blur-[120px]" />
        <div className="absolute top-[70%] left-[15%] w-[420px] h-[420px] bg-cyan-600 rounded-full blur-[150px]" />
      </div>

      {/* Toast message with frosted glass */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-white/10 backdrop-blur-2xl border border-emerald-400/40 text-emerald-300 rounded-2xl shadow-2xl shadow-black/60 animate-in slide-in-from-bottom-3 duration-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Account Verification & Switch Info Bar */}
      <div className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 px-4 py-1.5 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
          <span>
            Sessão isolada ativa: <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline text-slate-300">
            Cada conta possui seus lançamentos e saldo 100% isolados.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGoogleModalOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            Trocar Conta
          </button>
          <button
            onClick={handleZeroAllData}
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            title="Zerar todos os lançamentos"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Zerar Tudo (R$ 0,00)
          </button>
          <button
            onClick={handleLogout}
            className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Desconectar
          </button>
        </div>
      </div>

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAuthModal={(mode) => {
          setAuthMode(mode);
          setIsAuthModalOpen(true);
        }}
        onOpenGoogleAccountSelector={() => setIsGoogleModalOpen(true)}
        onResetData={handleResetDemoData}
        onLogout={handleLogout}
        onZeroAllData={handleZeroAllData}
      />

      {/* Main Container with Frosted Glass Areas */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            currentUser={currentUser}
            incomes={incomes}
            expenses={expenses}
            goals={goals}
            lastReport={lastReport}
            onNavigateTab={setActiveTab}
            onOpenDetail={(type, item) => {
              if (type === 'income') setDetailItem({ type: 'income', item: item as Income });
              else setDetailItem({ type: 'expense', item: item as Expense });
            }}
            onOpenGoalDetail={(goal) => setDetailItem({ type: 'goal', item: goal })}
          />
        )}

        {activeTab === 'income' && (
          <IncomeManager
            incomes={incomes}
            expenses={expenses}
            currentUser={currentUser}
            onAddIncome={handleAddIncome}
            onUpdateIncome={handleUpdateIncome}
            onDeleteIncome={handleDeleteIncome}
            onNavigateToReport={() => setActiveTab('report')}
            onViewDetail={(item) => setDetailItem({ type: 'income', item })}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpenseManager
            expenses={expenses}
            currentUser={currentUser}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            onViewDetail={(item) => setDetailItem({ type: 'expense', item })}
          />
        )}

        {activeTab === 'report' && (
          <FinancialReportView
            incomes={incomes}
            expenses={expenses}
            goals={goals}
            currentUser={currentUser}
            lastReport={lastReport}
            onReportGenerated={handleReportGenerated}
          />
        )}

        {activeTab === 'sheets' && (
          <SheetsSyncView
            currentUser={currentUser}
            incomes={incomes}
            expenses={expenses}
            goals={goals}
            lastReport={lastReport}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-xl py-6 px-4 text-center text-xs text-slate-400 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200 font-display">Gestor Financeiro Inteligente</span>
            <span>•</span>
            <span>Tema Frosted Glass • Verificação Multi-Conta & Inteligência Artificial</span>
          </div>
          <div>
            <span>Conectado como <strong className="text-emerald-400">{currentUser.email}</strong></span>
          </div>
        </div>
      </footer>

      {/* Item Detail Area Modal */}
      <ItemDetailModal
        detail={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
        onToggleStatus={handleToggleItemStatus}
      />

      {/* Auth Modal (Email/Password Login & Register verification) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToGoogle={() => {
          setIsAuthModalOpen(false);
          setIsGoogleModalOpen(true);
        }}
      />

      {/* Google Account Selector & Multi-User Modal */}
      <GoogleAccountSelectorModal
        isOpen={isGoogleModalOpen}
        currentUser={currentUser}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
}
