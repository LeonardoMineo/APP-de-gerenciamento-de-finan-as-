import React, { useState } from 'react';
import { Expense, FinancialGoal, FinancialReport, Income, UserProfile } from '../types';
import { 
  Table, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  FileSpreadsheet, 
  TrendingUp, 
  CreditCard 
} from 'lucide-react';

interface SheetsSyncViewProps {
  currentUser: UserProfile;
  incomes: Income[];
  expenses: Expense[];
  goals: FinancialGoal[];
  lastReport: FinancialReport | null;
}

export const SheetsSyncView: React.FC<SheetsSyncViewProps> = ({
  currentUser,
  incomes,
  expenses,
  goals,
  lastReport,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [sheetsUrl, setSheetsUrl] = useState(
    'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'
  );
  const [isSaved, setIsSaved] = useState(false);

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const exportCSV = (type: 'incomes' | 'expenses') => {
    let headers = '';
    let rows: string[] = [];

    if (type === 'incomes') {
      headers = 'ID,Descrição,Valor (R$),Categoria,Frequência,Status,Data,Conta,Observações';
      rows = incomes.map(
        (i) =>
          `"${i.id}","${i.description}","${i.amount}","${i.category}","${i.frequency}","${i.status}","${i.date}","${i.account || ''}","${i.notes || ''}"`
      );
    } else {
      headers = 'ID,Descrição,Valor (R$),Categoria,Tipo 50/30/20,Forma Pagamento,Status,Data,Observações';
      rows = expenses.map(
        (e) =>
          `"${e.id}","${e.description}","${e.amount}","${e.category}","${e.type}","${e.paymentMethod}","${e.status}","${e.date}","${e.notes || ''}"`
      );
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gestor_financeiro_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateSheetsFormulaString = () => {
    const recIncome = incomes.filter((i) => i.status === 'received').reduce((s, i) => s + Number(i.amount), 0);
    const totExp = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const balance = recIncome - totExp;

    return (
      `=SPLIT("RESUMO FINANCEIRO DE ${currentUser.name.toUpperCase()}","|")\n` +
      `=SPLIT("Renda Total Recebida|R$ ${recIncome.toFixed(2)}","|")\n` +
      `=SPLIT("Gastos Totais Realizados|R$ ${totExp.toFixed(2)}","|")\n` +
      `=SPLIT("Saldo Líquido / Poupança|R$ ${balance.toFixed(2)}","|")\n`
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Frosted Glass */}
      <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Sincronização Google Sheets & Exportação
            </div>
            <h1 className="text-2xl font-bold text-white font-display drop-shadow-sm">
              Integração com Google Planilhas (Sheets)
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Exporte seus lançamentos de Rendas e Despesas em formato CSV ou conecte sua planilha do Google Drive para controle integrado.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://sheets.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 border border-emerald-300/40 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir Google Sheets
            </a>
          </div>
        </div>
      </div>

      {/* Sheet Link Config with Frosted Glass */}
      <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Table className="w-5 h-5 text-emerald-400" />
          Link da sua Planilha de Controle
        </h3>
        <p className="text-xs text-slate-300">
          Cole o link da sua planilha pessoal do Google Drive para acesso rápido e sincronização direta.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            placeholder="https://docs.google.com/spreadsheets/d/..."
            value={sheetsUrl}
            onChange={(e) => {
              setSheetsUrl(e.target.value);
              setIsSaved(false);
            }}
            className="flex-1 px-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-400 font-mono focus:bg-white/10 transition-all"
          />
          <button
            onClick={() => {
              setIsSaved(true);
              setTimeout(() => setIsSaved(false), 3000);
            }}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            {isSaved ? 'Link Salvo!' : 'Salvar Link'}
          </button>
        </div>
      </div>

      {/* CSV Quick Exports with Frosted Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rendas */}
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4 flex flex-col justify-between hover:bg-white/[0.14] transition-all">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white font-display">Tabela de Rendas & Receitas</h4>
            <p className="text-xs text-slate-300">{incomes.length} registros com fonte pagadora, valores e datas.</p>
          </div>

          <button
            onClick={() => exportCSV('incomes')}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Baixar CSV de Rendas
          </button>
        </div>

        {/* Despesas */}
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4 flex flex-col justify-between hover:bg-white/[0.14] transition-all">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white font-display">Tabela de Gastos & Despesas</h4>
            <p className="text-xs text-slate-300">{expenses.length} registros com categorias e classificação 50/30/20.</p>
          </div>

          <button
            onClick={() => exportCSV('expenses')}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Baixar CSV de Despesas
          </button>
        </div>
      </div>

      {/* Copy Formula / Data with Frosted Glass */}
      <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Copiar Resumo em Formato Planilha (Copiar & Colar)
            </h3>
            <p className="text-xs text-slate-300">
              Clique para copiar e depois aperte Ctrl+V diretamente em qualquer célula da sua planilha Google.
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(generateSheetsFormulaString(), 'formula')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            {copiedSection === 'formula' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar Linhas
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/10 text-xs text-emerald-300 font-mono overflow-x-auto">
          {generateSheetsFormulaString()}
        </pre>
      </div>
    </div>
  );
};
