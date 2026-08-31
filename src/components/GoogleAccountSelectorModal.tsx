import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getAllUsers, setActiveUser, getOrCreateUserByEmail } from '../services/storage';
import { X, Check, UserPlus, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

interface GoogleAccountSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserSelected: (user: UserProfile) => void;
}

export const GoogleAccountSelectorModal: React.FC<GoogleAccountSelectorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserSelected,
}) => {
  const [users, setUsers] = useState<UserProfile[]>(() => getAllUsers());
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectAccount = (user: UserProfile) => {
    setActiveUser(user);
    onUserSelected(user);
    onClose();
  };

  const handleAddNewGoogleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      setErrorMsg('Por favor, informe um endereço de e-mail do Google válido (@gmail.com).');
      return;
    }

    const normalizedEmail = newEmail.trim().toLowerCase();
    const newUser = getOrCreateUserByEmail(
      normalizedEmail,
      newName.trim() || undefined,
      'google'
    );

    setUsers(getAllUsers());
    setActiveUser(newUser);
    onUserSelected(newUser);
    setIsAddingNew(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <div>
              <h3 className="text-base font-semibold text-white font-display">Verificação de Conta Google</h3>
              <p className="text-xs text-slate-400">Escolha ou conecte a conta que deseja acessar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isAddingNew ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Contas verificadas salvas neste navegador:
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {users.map((user) => {
                  const isCurrent = user.id === currentUser?.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleSelectAccount(user)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${
                        isCurrent
                          ? 'border-emerald-500/60 bg-emerald-950/30 ring-1 ring-emerald-500/30'
                          : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/90 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border border-slate-700 object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                              {user.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                                Ativo
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isCurrent ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700 flex items-center justify-center transition-colors">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-800/30 hover:bg-slate-800/80 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                >
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  Conectar outra conta Google (Multi-usuário)
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddNewGoogleAccount} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200">Adicionar nova conta Google</span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Voltar à lista
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">E-mail Google</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@gmail.com"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Cada conta tem seu próprio banco de dados isolado com receitas, gastos e investimentos separados.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Verificar e Entrar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
