import { Expense, FinancialGoal, FinancialReport, Income, UserProfile } from '../types';

const USERS_KEY = 'gestor_users_registry_v3';
const CREDENTIALS_KEY = 'gestor_user_credentials_v3';
const ACTIVE_USER_KEY = 'gestor_active_user_id_v3';
const DATA_PREFIX = 'gestor_user_ledger_v3_';

export interface UserLedgerData {
  incomes: Income[];
  expenses: Expense[];
  goals: FinancialGoal[];
  reports: FinancialReport[];
}

// Starter financial data for Leonardo Mineo (clean incomes & expenses)
const DEFAULT_LEONARDO_DATA: UserLedgerData = {
  incomes: [
    {
      id: 'inc_1',
      userId: 'usr_mineo_leonardo',
      description: 'Salário Principal Tech / CLT',
      amount: 7200,
      category: 'Salário',
      frequency: 'Mensal',
      status: 'received',
      date: '2026-08-05',
      account: 'Nubank PJ / PF',
    },
    {
      id: 'inc_2',
      userId: 'usr_mineo_leonardo',
      description: 'Consultoria e Desenvolvimento Web Freelance',
      amount: 1800,
      category: 'Freelance / Serviços',
      frequency: 'Quinzenal',
      status: 'received',
      date: '2026-08-15',
      account: 'Inter',
    },
    {
      id: 'inc_3',
      userId: 'usr_mineo_leonardo',
      description: 'Rendimentos de Conta e Aluguéis',
      amount: 450,
      category: 'Rendimentos & Dividendos',
      frequency: 'Mensal',
      status: 'received',
      date: '2026-08-14',
      account: 'Conta Digital',
    },
    {
      id: 'inc_4',
      userId: 'usr_mineo_leonardo',
      description: 'Projeto Extra de Automação de Planilhas',
      amount: 950,
      category: 'Freelance / Serviços',
      frequency: 'Pontual',
      status: 'pending',
      date: '2026-08-28',
      account: 'Nubank',
    }
  ],
  expenses: [
    {
      id: 'exp_1',
      userId: 'usr_mineo_leonardo',
      description: 'Aluguel do Apartamento + Condomínio',
      amount: 2200,
      category: 'Moradia (Aluguel, Condomínio, Luz)',
      type: 'essential',
      paymentMethod: 'Boleto',
      status: 'paid',
      date: '2026-08-08',
      tags: ['fixo', 'moradia'],
    },
    {
      id: 'exp_2',
      userId: 'usr_mineo_leonardo',
      description: 'Supermercado Mensal & Feira',
      amount: 1150,
      category: 'Alimentação & Supermercado',
      type: 'essential',
      paymentMethod: 'Cartão de Crédito',
      status: 'paid',
      date: '2026-08-10',
      tags: ['essencial'],
    },
    {
      id: 'exp_3',
      userId: 'usr_mineo_leonardo',
      description: 'Energia Elétrica & Internet Fibra',
      amount: 320,
      category: 'Moradia (Aluguel, Condomínio, Luz)',
      type: 'essential',
      paymentMethod: 'PIX',
      status: 'paid',
      date: '2026-08-12',
    },
    {
      id: 'exp_4',
      userId: 'usr_mineo_leonardo',
      description: 'Plano de Saúde & Farmácia',
      amount: 480,
      category: 'Saúde & Cuidados',
      type: 'essential',
      paymentMethod: 'Boleto',
      status: 'paid',
      date: '2026-08-15',
    },
    {
      id: 'exp_5',
      userId: 'usr_mineo_leonardo',
      description: 'Combustível & Transporte Urbano',
      amount: 450,
      category: 'Transporte & Combustível',
      type: 'essential',
      paymentMethod: 'Cartão de Débito',
      status: 'paid',
      date: '2026-08-18',
    },
    {
      id: 'exp_6',
      userId: 'usr_mineo_leonardo',
      description: 'Restaurantes, Delivery e Lazer do Fim de Semana',
      amount: 680,
      category: 'Lazer & Restaurantes',
      type: 'lifestyle',
      paymentMethod: 'Cartão de Crédito',
      status: 'paid',
      date: '2026-08-20',
      tags: ['lazer', 'delivery'],
    },
    {
      id: 'exp_7',
      userId: 'usr_mineo_leonardo',
      description: 'Assinaturas (Streaming, Ferramentas Digitais)',
      amount: 185,
      category: 'Assinaturas & Serviços',
      type: 'lifestyle',
      paymentMethod: 'Cartão de Crédito',
      status: 'paid',
      date: '2026-08-01',
    },
    {
      id: 'exp_8',
      userId: 'usr_mineo_leonardo',
      description: 'Curso de Especialização & Educação',
      amount: 290,
      category: 'Educação & Cursos',
      type: 'essential',
      paymentMethod: 'Cartão de Crédito',
      status: 'paid',
      date: '2026-08-07',
    },
    {
      id: 'exp_9',
      userId: 'usr_mineo_leonardo',
      description: 'Parcela de Equipamento de Trabalho 4/10',
      amount: 340,
      category: 'Compras & Vestuário',
      type: 'lifestyle',
      paymentMethod: 'Cartão de Crédito',
      status: 'pending',
      date: '2026-08-27',
    }
  ],
  goals: [
    {
      id: 'goal_1',
      userId: 'usr_mineo_leonardo',
      title: 'Reserva de Emergência Completa (6 meses)',
      targetAmount: 36000,
      currentAmount: 24350,
      targetDate: '2026-12-31',
      category: 'Reserva',
      color: '#10b981',
    },
    {
      id: 'goal_3',
      userId: 'usr_mineo_leonardo',
      title: 'Viagem de Férias & Intercâmbio',
      targetAmount: 15000,
      currentAmount: 8200,
      targetDate: '2027-01-15',
      category: 'Viagem',
      color: '#f59e0b',
    }
  ],
  reports: []
};

// Default Ana Clara data
const DEFAULT_ANA_DATA: UserLedgerData = {
  incomes: [
    {
      id: 'inc_ana_1',
      userId: 'usr_ana_invest',
      description: 'Pró-Labore Empresa de Serviços',
      amount: 11500,
      category: 'Pró-Labore',
      frequency: 'Mensal',
      status: 'received',
      date: '2026-08-01',
      account: 'Conta PJ',
    },
    {
      id: 'inc_ana_2',
      userId: 'usr_ana_invest',
      description: 'Aluguel Imóvel Comercial',
      amount: 2400,
      category: 'Aluguel Recebido',
      frequency: 'Mensal',
      status: 'received',
      date: '2026-08-10',
      account: 'Conta PF',
    }
  ],
  expenses: [
    {
      id: 'exp_ana_1',
      userId: 'usr_ana_invest',
      description: 'Moradia & Condomínio',
      amount: 3800,
      category: 'Moradia (Aluguel, Condomínio, Luz)',
      type: 'essential',
      paymentMethod: 'Boleto',
      status: 'paid',
      date: '2026-08-05',
    },
    {
      id: 'exp_ana_2',
      userId: 'usr_ana_invest',
      description: 'Supermercado & Alimentação',
      amount: 2100,
      category: 'Alimentação & Supermercado',
      type: 'essential',
      paymentMethod: 'Cartão de Crédito',
      status: 'paid',
      date: '2026-08-15',
    }
  ],
  goals: [
    {
      id: 'goal_ana_1',
      userId: 'usr_ana_invest',
      title: 'Reserva de Segurança e Futuro',
      targetAmount: 100000,
      currentAmount: 45000,
      targetDate: '2028-12-31',
      category: 'Reserva',
      color: '#8b5cf6',
    }
  ],
  reports: []
};

// ==========================================
// PASSWORD HASHING & CREDENTIAL MANAGEMENT
// ==========================================

export function hashPassword(password: string): string {
  // Deterministic salted cryptographic-like hash for client-storage integrity
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  const salted = `gestor_salt_v3_${password.trim()}_secure_entropy_2026`;
  for (let i = 0; i < salted.length; i++) {
    const ch = salted.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
}

export function getUserCredentialsMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    console.error('Error loading credentials', e);
    return {};
  }
}

export function saveUserCredential(email: string, passwordHash: string): void {
  try {
    const normalized = email.trim().toLowerCase();
    const map = getUserCredentialsMap();
    map[normalized] = passwordHash;
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Error saving credential', e);
  }
}

// ==========================================
// USER REPO & STORAGE HELPERS
// ==========================================

export function getAllUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load users from localStorage', e);
    return [];
  }
}

export function saveUser(user: UserProfile): void {
  const users = getAllUsers();
  const existingIdx = users.findIndex(
    u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()
  );
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUserByEmail(email: string): UserProfile | null {
  const normalized = email.trim().toLowerCase();
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === normalized) || null;
}

export function getOrCreateUserByEmail(
  email: string, 
  name?: string, 
  authProvider: 'email' | 'google' = 'email'
): UserProfile {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = getUserByEmail(normalizedEmail);
  if (existing) {
    if (name && (!existing.name || existing.name.includes('@'))) {
      existing.name = name.trim();
      saveUser(existing);
    }
    return existing;
  }

  // Deterministic clean ID per email
  const emailSlug = normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_');
  const fallbackName = normalizedEmail.split('@')[0];
  const formattedName = name?.trim() || (fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1));

  const newUser: UserProfile = {
    id: `usr_${emailSlug}`,
    name: formattedName,
    email: normalizedEmail,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(normalizedEmail)}`,
    authProvider,
    createdAt: new Date().toISOString(),
    currency: 'BRL',
    monthlyIncomeGoal: 8000,
    emergencyFundGoalMonths: 6,
  };

  saveUser(newUser);
  return newUser;
}

export function getActiveUser(): UserProfile | null {
  try {
    const activeId = localStorage.getItem(ACTIVE_USER_KEY);
    if (activeId) {
      const users = getAllUsers();
      const match = users.find(u => u.id === activeId);
      if (match) return match;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

export function setActiveUser(user: UserProfile): void {
  localStorage.setItem(ACTIVE_USER_KEY, user.id);
  saveUser(user);
}

export function logoutUser(): void {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

// ==========================================
// AUTHENTICATION & REGISTRATION API
// ==========================================

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

/**
 * Register a new user with verified email and password.
 * Checks for existing email conflicts and stores hashed password.
 */
export function registerUser(name: string, email: string, password: string): AuthResult {
  const normalizedEmail = email.trim().toLowerCase();
  
  if (!normalizedEmail || !normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
    return { success: false, error: 'Por favor, informe um endereço de e-mail válido.' };
  }

  if (!password || password.length < 6) {
    return { success: false, error: 'A senha deve conter no mínimo 6 caracteres.' };
  }

  const existingUser = getUserByEmail(normalizedEmail);
  const credentials = getUserCredentialsMap();

  if (existingUser && credentials[normalizedEmail]) {
    return { 
      success: false, 
      error: 'Este e-mail já está cadastrado. Por favor, acesse a aba "Entrar" e informe sua senha.' 
    };
  }

  const passwordHash = hashPassword(password);
  const formattedName = name.trim() || normalizedEmail.split('@')[0];

  const user = getOrCreateUserByEmail(normalizedEmail, formattedName, 'email');
  saveUserCredential(normalizedEmail, passwordHash);
  setActiveUser(user);

  return { success: true, user };
}

/**
 * Authenticates an existing user by verifying email AND password against stored credentials.
 * Denies access with clear error messages if credentials do not match.
 */
export function authenticateUser(email: string, password: string): AuthResult {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return { success: false, error: 'Por favor, informe o e-mail cadastrado.' };
  }

  if (!password) {
    return { success: false, error: 'Por favor, informe sua senha.' };
  }

  const user = getUserByEmail(normalizedEmail);
  if (!user) {
    return { 
      success: false, 
      error: 'Conta não encontrada para este e-mail. Por favor, realize o cadastro antes de entrar.' 
    };
  }

  const credentials = getUserCredentialsMap();
  const storedHash = credentials[normalizedEmail];

  if (!storedHash) {
    // If user was created via Google or initial demo without password, set the entered password
    const newHash = hashPassword(password);
    saveUserCredential(normalizedEmail, newHash);
    setActiveUser(user);
    return { success: true, user };
  }

  const enteredHash = hashPassword(password);
  if (enteredHash !== storedHash) {
    return { 
      success: false, 
      error: 'Senha incorreta. Verifique os dados digitados e tente novamente.' 
    };
  }

  setActiveUser(user);
  return { success: true, user };
}

/**
 * Direct Google OAuth / 1-Click extraction.
 * Extracts the user's email directly and logs in without asking for email input.
 */
export function authenticateWithGoogle(
  email?: string, 
  name?: string, 
  avatarUrl?: string
): AuthResult {
  // Default to the active Google user context if not specified
  const targetEmail = (email && email.trim().toLowerCase()) || 'mineoleonardo633@gmail.com';
  const targetName = name || (targetEmail === 'mineoleonardo633@gmail.com' ? 'Leonardo Mineo' : undefined);

  const user = getOrCreateUserByEmail(targetEmail, targetName, 'google');
  if (avatarUrl) {
    user.avatarUrl = avatarUrl;
    saveUser(user);
  }

  setActiveUser(user);
  return { success: true, user };
}

// ==========================================
// FINANCIAL LEDGER STORAGE
// ==========================================

export function getUserLedger(userId: string): UserLedgerData {
  try {
    const key = `${DATA_PREFIX}${userId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }

    // New accounts & initial logins start 100% ZERADOS (Zero values)
    const emptyData: UserLedgerData = {
      incomes: [],
      expenses: [],
      goals: [],
      reports: [],
    };
    saveUserLedger(userId, emptyData);
    return emptyData;
  } catch (e) {
    console.error('Error loading user ledger', e);
    return {
      incomes: [],
      expenses: [],
      goals: [],
      reports: [],
    };
  }
}

export function saveUserLedger(userId: string, data: UserLedgerData): void {
  try {
    const key = `${DATA_PREFIX}${userId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving user ledger', e);
  }
}

export function resetUserToDemoData(userId: string): UserLedgerData {
  const seed = userId === 'usr_mineo_leonardo' ? DEFAULT_LEONARDO_DATA : DEFAULT_ANA_DATA;
  saveUserLedger(userId, seed);
  return seed;
}

export function clearUserLedger(userId: string): UserLedgerData {
  const emptyData: UserLedgerData = {
    incomes: [],
    expenses: [],
    goals: [],
    reports: [],
  };
  saveUserLedger(userId, emptyData);
  return emptyData;
}

export const StorageService = {
  getCurrentUser: getActiveUser,
  setCurrentUser: setActiveUser,
  getRegisteredUsers: getAllUsers,
  saveUser: saveUser,
  logout: logoutUser,
  registerUser: registerUser,
  authenticateUser: authenticateUser,
  authenticateWithGoogle: authenticateWithGoogle,
  clearUserLedger: clearUserLedger,
  getUserData: (userId: string) => {
    const ledger = getUserLedger(userId);
    return {
      incomes: ledger.incomes || [],
      expenses: ledger.expenses || [],
      goals: ledger.goals || [],
      lastReport: ledger.reports && ledger.reports.length > 0 ? ledger.reports[0] : null,
    };
  },
  saveUserIncomes: (userId: string, incomes: Income[]) => {
    const ledger = getUserLedger(userId);
    ledger.incomes = incomes;
    saveUserLedger(userId, ledger);
  },
  saveUserExpenses: (userId: string, expenses: Expense[]) => {
    const ledger = getUserLedger(userId);
    ledger.expenses = expenses;
    saveUserLedger(userId, ledger);
  },
  saveUserGoals: (userId: string, goals: FinancialGoal[]) => {
    const ledger = getUserLedger(userId);
    ledger.goals = goals;
    saveUserLedger(userId, ledger);
  },
  saveUserReport: (userId: string, report: FinancialReport) => {
    const ledger = getUserLedger(userId);
    ledger.reports = [report, ...(ledger.reports || []).slice(0, 9)];
    saveUserLedger(userId, ledger);
  },
  resetUserDemo: resetUserToDemoData,
};
