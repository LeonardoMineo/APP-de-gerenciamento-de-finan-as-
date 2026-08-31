import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  PieChart, 
  Sparkles, 
  Table, 
  Users, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface NavItem {
  id: 'dashboard' | 'income' | 'expenses' | 'report' | 'sheets';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
}

interface NavbarProps {
  activeTab: 'dashboard' | 'income' | 'expenses' | 'report' | 'sheets';
  onTabChange: (tab: 'dashboard' | 'income' | 'expenses' | 'report' | 'sheets') => void;
  currentUser: UserProfile;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onOpenGoogleAccountSelector: () => void;
  onResetData?: () => void;
  onLogout: () => void;
  onZeroAllData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  onOpenAuthModal,
  onOpenGoogleAccountSelector,
  onResetData,
  onLogout,
  onZeroAllData,
}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: Wallet },
    { id: 'income', label: 'Renda & Receitas', icon: TrendingUp, highlight: true },
    { id: 'expenses', label: 'Despesas & Gastos', icon: CreditCard },
    { id: 'report', label: 'Relatório IA & Diagnóstico', icon: Sparkles, badge: 'IA' },
    { id: 'sheets', label: 'Planilha Sheets', icon: Table },
  ];

  return (
    <header className="sticky top-2 z-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl px-4 sm:px-6 py-2.5 shadow-2xl shadow-black/40 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-3 text-left group focus:outline-hidden cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 via-indigo-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform p-0.5">
              <div className="w-full h-full bg-slate-950/70 backdrop-blur-md rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-tight font-display text-base sm:text-lg drop-shadow-sm">
                  Gestor Financeiro <span className="text-blue-400">Pro</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  GLASS
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">Renda • Gastos • Diagnóstico IA • Planilhas</p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-teal-300 to-indigo-300 text-slate-950 shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all text-left group cursor-pointer shadow-md"
            >
              <div className="w-7 h-7 rounded-full border-2 border-emerald-400/60 p-0.5 shrink-0 overflow-hidden bg-slate-900">
                <img
                  src={
                    currentUser.avatarUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`
                  }
                  alt={currentUser.name}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:block text-left max-w-[130px] truncate">
                <div className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-300 truncate">{currentUser.email}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-colors" />
            </button>

            {/* Account Dropdown */}
            {isAccountMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsAccountMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-68 rounded-2xl bg-slate-900/85 backdrop-blur-2xl border border-white/20 shadow-2xl p-2.5 z-40 animate-in fade-in zoom-in-95 duration-150 text-slate-200">
                  <div className="px-3 py-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white truncate">{currentUser.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                        {currentUser.authProvider === 'google' ? 'Google' : 'E-mail'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">{currentUser.email}</p>
                  </div>

                  <div className="py-1.5 space-y-1">
                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        onOpenGoogleAccountSelector();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>Trocar / Verificar Conta Google</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        onOpenAuthModal('register');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Cadastrar Nova Conta</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        onOpenAuthModal('login');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                      <span>Entrar com E-mail / Senha</span>
                    </button>

                    {onZeroAllData && (
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          if (window.confirm('Tem certeza que deseja zerar todos os valores e lançamentos desta conta? (R$ 0,00)')) {
                            onZeroAllData();
                          }
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-400" />
                        <span>Zerar Todos os Valores (R$ 0,00)</span>
                      </button>
                    )}

                    {onResetData && (
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          if (window.confirm('Deseja carregar dados de demonstração nesta conta?')) {
                            onResetData();
                          }
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span>Carregar Dados Exemplo</span>
                      </button>
                    )}

                    <div className="border-t border-white/10 pt-1.5">
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Desconectar Totalmente</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-200 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 border border-white/20 bg-slate-900/90 backdrop-blur-2xl rounded-2xl px-4 py-3 space-y-1.5 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-teal-300 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
