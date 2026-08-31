import React, { useState } from 'react';
import { UserProfile } from '../types';
import { StorageService } from '../services/storage';
import { X, Lock, Mail, User, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { GoogleAccountSelectorModal } from './GoogleAccountSelectorModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onAuthSuccess?: (user: UserProfile) => void;
  onLoginSuccess?: (user: UserProfile) => void;
  onRegisterSuccess?: (user: UserProfile) => void;
  onSwitchToGoogle?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLoginSuccess,
  onRegisterSuccess,
  onSwitchToGoogle,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isGoogleSelectorOpen, setIsGoogleSelectorOpen] = useState(false);

  if (!isOpen) return null;

  const handleSuccess = (user: UserProfile) => {
    if (onAuthSuccess) onAuthSuccess(user);
    if (onLoginSuccess) onLoginSuccess(user);
    if (mode === 'register' && onRegisterSuccess) onRegisterSuccess(user);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setErrorMsg('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (!password) {
      setErrorMsg('Informe sua senha de acesso.');
      return;
    }

    if (mode === 'login') {
      const authResult = StorageService.authenticateUser(normalizedEmail, password);
      if (!authResult.success || !authResult.user) {
        setErrorMsg(authResult.error || 'Falha na autenticação. Verifique e-mail e senha.');
        return;
      }

      setSuccessMsg(`Bem-vindo(a), ${authResult.user.name}!`);
      setTimeout(() => {
        handleSuccess(authResult.user!);
      }, 400);
    } else {
      // Mode: Register
      if (password.length < 6) {
        setErrorMsg('A senha precisa ter no mínimo 6 caracteres.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg('As senhas não coincidem. Verifique e tente novamente.');
        return;
      }

      const regResult = StorageService.registerUser(
        name.trim() || normalizedEmail.split('@')[0],
        normalizedEmail,
        password
      );

      if (!regResult.success || !regResult.user) {
        setErrorMsg(regResult.error || 'Erro ao criar conta.');
        return;
      }

      setSuccessMsg('Conta criada com sucesso! Todos os lançamentos iniciam zerados.');
      setTimeout(() => {
        handleSuccess(regResult.user!);
      }, 500);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
          {/* Header with tabs */}
          <div className="bg-slate-950/60 border-b border-slate-800 p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold font-display">
                  GF
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-display">Gestor Financeiro</h2>
                  <p className="text-xs text-slate-400">Verificação e Acesso Seguro</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Já tenho conta (Entrar)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Criar Nova Conta
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Google Sign In Button */}
            <div>
              <button
                type="button"
                onClick={() => setIsGoogleSelectorOpen(true)}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-slate-600 text-white text-xs font-semibold transition-all shadow-xs group cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <span>Entrar com o Google (Verificar Conta)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform ml-auto" />
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  ou via e-mail e senha
                </span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>
            </div>

            {/* Error / Success Notifications */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Leonardo Mineo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Confirmar Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                {mode === 'login' ? 'Verificar e Entrar na Conta' : 'Criar Minha Conta Financeira'}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-500">
                {mode === 'login' ? (
                  <>
                    Não tem uma conta ainda?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-emerald-400 font-semibold hover:underline cursor-pointer"
                    >
                      Cadastre-se grátis
                    </button>
                  </>
                ) : (
                  <>
                    Já possui cadastro?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-emerald-400 font-semibold hover:underline cursor-pointer"
                    >
                      Entrar agora
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <GoogleAccountSelectorModal
        isOpen={isGoogleSelectorOpen}
        onClose={() => setIsGoogleSelectorOpen(false)}
        currentUser={currentUser}
        onSelectUser={(selectedUser) => {
          handleSuccess(selectedUser);
          setIsGoogleSelectorOpen(false);
        }}
      />
    </>
  );
};
