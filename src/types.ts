export type AuthProvider = 'email' | 'google';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  authProvider: AuthProvider;
  createdAt: string;
  currency: string;
  monthlyIncomeGoal?: number;
  emergencyFundGoalMonths?: number;
}

export type IncomeCategory = 
  | 'Salário'
  | 'Pró-Labore'
  | 'Freelance / Serviços'
  | 'Rendimentos & Dividendos'
  | 'Aluguel Recebido'
  | 'Vendas & Comissões'
  | 'Benefícios & Reembolsos'
  | 'Outros';

export type IncomeFrequency = 'Mensal' | 'Quinzenal' | 'Semanal' | 'Pontual';
export type IncomeStatus = 'received' | 'pending';

export interface Income {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: IncomeCategory;
  frequency: IncomeFrequency;
  status: IncomeStatus;
  date: string; // YYYY-MM-DD
  notes?: string;
  account?: string;
}

export type ExpenseCategory =
  | 'Moradia (Aluguel, Condomínio, Luz)'
  | 'Alimentação & Supermercado'
  | 'Transporte & Combustível'
  | 'Saúde & Cuidados'
  | 'Educação & Cursos'
  | 'Lazer & Restaurantes'
  | 'Assinaturas & Serviços'
  | 'Compras & Vestuário'
  | 'Dívidas & Empréstimos'
  | 'Outros';

export type ExpenseType = 'essential' | 'lifestyle' | 'financial_cost';
export type ExpenseStatus = 'paid' | 'pending';
export type PaymentMethod = 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto' | 'Dinheiro' | 'Transferência';

export interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  type: ExpenseType; // 50/30/20 categorisation
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  date: string; // YYYY-MM-DD
  tags?: string[];
  notes?: string;
}

export type InvestmentCategory =
  | 'Renda Fixa (CDB, Tesouro, LCI/LCA)'
  | 'Ações Brasileiras (B3)'
  | 'Ações Globais / ETFs'
  | 'Fundos Imobiliários (FIIs)'
  | 'Criptomoedas'
  | 'Reserva de Emergência'
  | 'Previdência Privada'
  | 'Outros Ativos';

export interface Investment {
  id: string;
  userId: string;
  name: string;
  ticker?: string;
  category: InvestmentCategory;
  amountInvested: number;
  currentValue: number;
  monthlyYieldEstimated: number; // estimated monthly return in R$ or %
  yieldRateAnnualPercent: number; // e.g. 12.5% a.a.
  targetAllocationPercent: number; // target allocation in portfolio %
  broker: string; // e.g. 'XP', 'Nubank', 'BTG', 'Inter', 'Binance'
  purchaseDate: string;
  notes?: string;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'Reserva' | 'Investimento' | 'Bem Material' | 'Viagem' | 'Independência';
  color: string;
}

export interface ActionPlanStep {
  stepNumber: number;
  title: string;
  description: string;
  impact: 'Alto' | 'Médio' | 'Baixo';
  category: 'Corte de Custos' | 'Aumento de Renda' | 'Investimentos' | 'Dívidas' | 'Reserva';
}

export interface FinancialReport {
  id: string;
  userId: string;
  generatedAt: string;
  healthScore: number; // 0 to 100
  healthLevel: 'Excelente' | 'Saudável' | 'Atenção' | 'Crítico';
  verdictTitle: string;
  verdictDescription: string;
  isGoodMoneyUse: boolean;
  savingsRate: number; // %
  rule50_30_20: {
    needsPercent: number;
    wantsPercent: number;
    savingsPercent: number;
    idealNeeds: number;
    idealWants: number;
    idealSavings: number;
    evaluation: string;
  };
  keyStrengths: string[];
  leakagesAndWaste: string[];
  actionPlan: ActionPlanStep[];
  investmentDiagnostic?: string;
  wealthProjections: {
    in1Year: number;
    in5Years: number;
    in10Years: number;
    optimistic10Years: number;
  };
  summaryAdvice: string;
}
