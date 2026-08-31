import React from 'react';
import { Expense, FinancialGoal, Income } from '../types';
import { 
  X, 
  TrendingUp, 
  CreditCard, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  FileText
} from 'lucide-react';

export type DetailItemType = 
  | { type: 'income'; item: Income }
  | { type: 'expense'; item: Expense }
  | { type: 'goal'; item: FinancialGoal };

interface ItemDetailModalProps {
  detail: DetailItemType | null;
  onClose: () => void;
  onEdit: (detail: DetailItemType) => void;
  onDelete: (detail: DetailItemType) => void;
  onToggleStatus?: (detail: DetailItemType) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  detail,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (!detail) return null;

  const { type } = detail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-lg ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  : type === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  : 'bg-purple-500/20 text-purple-300 border-purple-400/30'
              }`}
            >
              {type === 'income' && <TrendingUp className="w-5 h-5" />}
              {type === 'expense' && <CreditCard className="w-5 h-5" />}
              {type === 'goal' && <Target className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {type === 'income' && 'Detalhes da Renda'}
                  {type === 'expense' && 'Detalhes da Despesa'}
                  {type === 'goal' && 'Detalhes da Meta'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-display truncate max-w-xs">
                {type === 'income' && detail.item.description}
                {type === 'expense' && detail.item.description}
                {type === 'goal' && detail.item.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Main Amount Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {type === 'goal' ? 'Valor Alvo' : 'Valor Total'}
              </span>
              <div
                className={`text-3xl font-extrabold font-display mt-1 ${
                  type === 'income'
                    ? 'text-emerald-400'
                    : type === 'expense'
                    ? 'text-rose-400'
                    : 'text-purple-400'
                }`}
              >
                R${' '}
                {type === 'income' && detail.item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                {type === 'expense' && detail.item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                {type === 'goal' && detail.item.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Status / Type Badge */}
            <div className="flex flex-col sm:items-end gap-2">
              {type === 'income' && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    detail.item.status === 'received'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {detail.item.status === 'received' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {detail.item.status === 'received' ? 'Recebido' : 'Pendente / A Receber'}
                </span>
              )}

              {type === 'expense' && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    detail.item.status === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {detail.item.status === 'paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {detail.item.status === 'paid' ? 'Pago' : 'Pendente / A Pagar'}
                </span>
              )}

              {type === 'goal' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40">
                  {((detail.item.currentAmount / detail.item.targetAmount) * 100).toFixed(1)}% Concluído
                </span>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Category */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 font-medium">Categoria</span>
              <p className="font-bold text-white truncate">
                {type === 'income' && detail.item.category}
                {type === 'expense' && detail.item.category}
                {type === 'goal' && detail.item.category}
              </p>
            </div>

            {/* Date / Target Date */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 font-medium">
                {type === 'goal' ? 'Data Alvo' : 'Data Registro'}
              </span>
              <p className="font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                {type === 'income' && detail.item.date}
                {type === 'expense' && detail.item.date}
                {type === 'goal' && detail.item.targetDate}
              </p>
            </div>

            {/* Specific Attributes */}
            {type === 'income' && (
              <>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-medium">Frequência</span>
                  <p className="font-bold text-white">{detail.item.frequency}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-medium">Conta de Entrada</span>
                  <p className="font-bold text-white truncate">{detail.item.account || 'Não especificada'}</p>
                </div>
              </>
            )}

            {type === 'expense' && (
              <>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-medium">Forma de Pagamento</span>
                  <p className="font-bold text-white">{detail.item.paymentMethod}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-medium">Classificação 50/30/20</span>
                  <p className="font-bold text-white">
                    {detail.item.type === 'essential' && 'Essencial (Necessidade - 50%)'}
                    {detail.item.type === 'lifestyle' && 'Estilo de Vida (Desejo - 30%)'}
                    {detail.item.type === 'financial_cost' && 'Custo Financeiro (Dívida / Juros)'}
                  </p>
                </div>
              </>
            )}

            {type === 'goal' && (
              <>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-medium">Valor Já Acumulado</span>
                  <p className="font-bold text-emerald-400">
                    R$ {detail.item.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-medium">Falta para Atingir</span>
                  <p className="font-bold text-amber-300">
                    R${' '}
                    {Math.max(0, detail.item.targetAmount - detail.item.currentAmount).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Notes if any */}
          {((type === 'income' && detail.item.notes) || (type === 'expense' && detail.item.notes)) && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <FileText className="w-3.5 h-3.5" />
                <span>Observações & Notas</span>
              </div>
              <p className="text-slate-200 leading-relaxed italic">
                "{type === 'income' ? detail.item.notes : detail.item.notes}"
              </p>
            </div>
          )}

          {/* Status Toggle Quick Action */}
          {onToggleStatus && (type === 'income' || type === 'expense') && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onToggleStatus(detail)}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  type === 'income'
                    ? detail.item.status === 'received'
                    : detail.item.status === 'paid'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {type === 'income'
                  ? detail.item.status === 'received'
                    ? 'Alterar para Pendente'
                    : 'Marcar como Recebido'
                  : detail.item.status === 'paid'
                  ? 'Alterar para Pendente'
                  : 'Marcar como Pago'}
              </button>
            </div>
          )}

          {/* Footer Actions: Edit & Delete */}
          <div className="flex items-center gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                onDelete(detail);
                onClose();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(detail);
              }}
              className="flex-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              Editar Dados deste Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
