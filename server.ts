import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Server-side Gemini initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Financial Health Report Generator
app.post("/api/financial-report", async (req: Request, res: Response) => {
  try {
    const { userProfile, incomes = [], expenses = [], investments = [], goals = [], customFocus } = req.body;

    // Financial calculations
    const totalIncome = incomes
      .filter((i: any) => i.status === "received")
      .reduce((sum: number, i: any) => sum + Number(i.amount || 0), 0);

    const pendingIncome = incomes
      .filter((i: any) => i.status === "pending")
      .reduce((sum: number, i: any) => sum + Number(i.amount || 0), 0);

    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
    const essentialExpenses = expenses
      .filter((e: any) => e.type === "essential")
      .reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
    const lifestyleExpenses = expenses
      .filter((e: any) => e.type === "lifestyle")
      .reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);

    const totalInvestedValue = investments.reduce((sum: number, inv: any) => sum + Number(inv.currentValue || 0), 0);
    const monthlyInvestmentsYield = investments.reduce((sum: number, inv: any) => sum + Number(inv.monthlyYieldEstimated || 0), 0);

    const netMonthlySavings = Math.max(0, totalIncome - totalExpenses);
    const savingsRate = totalIncome > 0 ? (netMonthlySavings / totalIncome) * 100 : 0;

    const needsPercent = totalIncome > 0 ? (essentialExpenses / totalIncome) * 100 : 0;
    const wantsPercent = totalIncome > 0 ? (lifestyleExpenses / totalIncome) * 100 : 0;
    const savingsInvestPercent = totalIncome > 0 ? (netMonthlySavings / totalIncome) * 100 : 0;

    const promptContext = `
Você é o Consultor Financeiro Chefe e Especialista em Finanças Pessoais e Investimentos do "Gestor Financeiro Inteligente".
Sua missão é analisar minuciosamente as finanças do usuário e emitir um relatório completo, honesto, didático e estratégico que responda com clareza:
"O USUÁRIO ESTÁ FAZENDO UM BOM USO DO SEU DINHEIRO OU NÃO?"

DADOS FINANCEIROS ATUAIS DO USUÁRIO (${userProfile?.name || "Usuário"}):
- Renda Mensal Total Recebida: R$ ${totalIncome.toFixed(2)} (Mais R$ ${pendingIncome.toFixed(2)} a receber)
- Gastos Totais do Mês: R$ ${totalExpenses.toFixed(2)}
- Gastos Essenciais (Necessidades - Moradia, Mercado, Saúde, etc): R$ ${essentialExpenses.toFixed(2)} (${needsPercent.toFixed(1)}% da renda)
- Gastos Estilo de Vida (Desejos - Lazer, Delivery, Assinaturas, etc): R$ ${lifestyleExpenses.toFixed(2)} (${wantsPercent.toFixed(1)}% da renda)
- Sobra Mensal Líquida (Poupança/Aporte Potencial): R$ ${netMonthlySavings.toFixed(2)} (${savingsRate.toFixed(1)}% da renda)
- Patrimônio Total em Investimentos: R$ ${totalInvestedValue.toFixed(2)}
- Rendimento Mensal Estimado dos Investimentos: R$ ${monthlyInvestmentsYield.toFixed(2)}
- Meta Mensal de Renda: R$ ${userProfile?.monthlyIncomeGoal ? userProfile.monthlyIncomeGoal.toFixed(2) : "Não definida"}
- Foco Solicitado pelo Usuário: ${customFocus || "Análise Geral de Saúde Financeira e Alocação"}

DETALHAMENTO DE RECEITAS:
${incomes.map((i: any) => `- ${i.description} (${i.category}): R$ ${Number(i.amount).toFixed(2)} [${i.status}]`).join("\n") || "Nenhuma renda cadastrada"}

DETALHAMENTO DE DESPESAS:
${expenses.map((e: any) => `- ${e.description} (${e.category} - ${e.type}): R$ ${Number(e.amount).toFixed(2)} [${e.status}] via ${e.paymentMethod}`).join("\n") || "Nenhuma despesa cadastrada"}

CARTEIRA DE INVESTIMENTOS:
${investments.map((inv: any) => `- ${inv.name} (${inv.category} / ${inv.broker}): R$ ${Number(inv.currentValue).toFixed(2)} (Rentab. anual: ${inv.yieldRateAnnualPercent || 0}%)`).join("\n") || "Nenhum investimento cadastrado"}

METAS FINANCEIRAS CADASTRADAS:
${goals.map((g: any) => `- ${g.title}: R$ ${g.currentAmount} de R$ ${g.targetAmount} (Meta até ${g.targetDate})`).join("\n") || "Nenhuma meta cadastrada"}

DIRETRIZES DE AVALIAÇÃO:
1. Responda claramente se ele está fazendo um bom uso do dinheiro (isGoodMoneyUse: true se taxa de poupança > 15% e gastos controlados, ou false se houver déficit ou descontrole).
2. Avalie a Regra 50/30/20 (Ideal: 50% Essenciais, 30% Desejos, 20% Poupança/Investimento).
3. Aponte pontuações realistas de 0 a 100 (healthScore) e classifique o nível.
4. Forneça pontos fortes e liste com precisão potenciais "vazamentos de dinheiro" ou desperdícios encontrados na lista de despesas.
5. Desenvolva um Plano de Ação prático em 3 a 5 passos claros com impacto e categoria.
6. Faça uma projeção de patrimônio para 1 ano, 5 anos e 10 anos considerando aporte mensal constante + rentabilidade média de 10% a 12% ao ano.

Retorne EXCLUSIVAMENTE um objeto JSON válido no formato do esquema solicitado.`;

    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: promptContext,
          config: {
            systemInstruction:
              "Você é um planejador financeiro CFP® com profundo conhecimento de finanças pessoais brasileiras, tributação, investimentos (CDI, Selic, FIIs, Ações) e metodologia 50/30/20. Seja empático, claro e direto ao ponto.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                healthScore: { type: Type.NUMBER, description: "Nota de 0 a 100 da saúde financeira" },
                healthLevel: {
                  type: Type.STRING,
                  enum: ["Excelente", "Saudável", "Atenção", "Crítico"],
                  description: "Classificação do nível de saúde financeira",
                },
                verdictTitle: { type: Type.STRING, description: "Título impactante do veredito (ex: 'Excelente Controle e Forte Potencial de Acumulação')" },
                verdictDescription: {
                  type: Type.STRING,
                  description: "Parágrafo detalhado explicando se o usuário está fazendo um bom uso do seu dinheiro e por quê",
                },
                isGoodMoneyUse: { type: Type.BOOLEAN, description: "Booleano se está fazendo bom uso do dinheiro" },
                savingsRate: { type: Type.NUMBER, description: "Taxa percentual de poupança atual" },
                rule50_30_20: {
                  type: Type.OBJECT,
                  properties: {
                    needsPercent: { type: Type.NUMBER },
                    wantsPercent: { type: Type.NUMBER },
                    savingsPercent: { type: Type.NUMBER },
                    idealNeeds: { type: Type.NUMBER },
                    idealWants: { type: Type.NUMBER },
                    idealSavings: { type: Type.NUMBER },
                    evaluation: { type: Type.STRING },
                  },
                  required: ["needsPercent", "wantsPercent", "savingsPercent", "idealNeeds", "idealWants", "idealSavings", "evaluation"],
                },
                keyStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Lista de 3 a 5 pontos fortes nas finanças do usuário",
                },
                leakagesAndWaste: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Lista de 2 a 4 pontos de atenção, vazamentos de dinheiro ou gastos a otimizar",
                },
                actionPlan: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.NUMBER },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      impact: { type: Type.STRING, enum: ["Alto", "Médio", "Baixo"] },
                      category: {
                        type: Type.STRING,
                        enum: ["Corte de Custos", "Aumento de Renda", "Investimentos", "Dívidas", "Reserva"],
                      },
                    },
                    required: ["stepNumber", "title", "description", "impact", "category"],
                  },
                },
                investmentDiagnostic: {
                  type: Type.STRING,
                  description: "Diagnóstico da carteira de investimentos (diversificação, liquidez, rentabilidade)",
                },
                wealthProjections: {
                  type: Type.OBJECT,
                  properties: {
                    in1Year: { type: Type.NUMBER },
                    in5Years: { type: Type.NUMBER },
                    in10Years: { type: Type.NUMBER },
                    optimistic10Years: { type: Type.NUMBER },
                  },
                  required: ["in1Year", "in5Years", "in10Years", "optimistic10Years"],
                },
                summaryAdvice: {
                  type: Type.STRING,
                  description: "Conselho final inspirador e prático para o próximo mês",
                },
              },
              required: [
                "healthScore",
                "healthLevel",
                "verdictTitle",
                "verdictDescription",
                "isGoodMoneyUse",
                "savingsRate",
                "rule50_30_20",
                "keyStrengths",
                "leakagesAndWaste",
                "actionPlan",
                "investmentDiagnostic",
                "wealthProjections",
                "summaryAdvice",
              ],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({
            id: "rep_" + Date.now(),
            userId: userProfile?.id || "usr_default",
            generatedAt: new Date().toISOString(),
            ...parsed,
          });
        }
      } catch (geminiError) {
        console.error("Gemini API generation error, falling back to rule-based engine:", geminiError);
      }
    }

    // High-precision algorithmic financial health evaluator fallback
    const isGoodUse = totalIncome > 0 && totalExpenses <= totalIncome * 0.85;
    let score = 50;
    if (totalIncome > 0) {
      if (savingsRate >= 30) score = 92;
      else if (savingsRate >= 20) score = 84;
      else if (savingsRate >= 10) score = 72;
      else if (savingsRate >= 0) score = 58;
      else score = 32;

      if (totalInvestedValue > totalIncome * 3) score = Math.min(100, score + 6);
    }

    const healthLevel = score >= 80 ? "Excelente" : score >= 65 ? "Saudável" : score >= 45 ? "Atenção" : "Crítico";

    // Growth simulation (compound interest at 10% annual rate)
    const monthlyRate = Math.pow(1 + 0.10, 1 / 12) - 1;
    const monthlyAporte = Math.max(0, netMonthlySavings);
    
    function futureValue(months: number) {
      let fv = totalInvestedValue * Math.pow(1 + monthlyRate, months);
      for (let m = 1; m <= months; m++) {
        fv += monthlyAporte * Math.pow(1 + monthlyRate, months - m);
      }
      return Math.round(fv);
    }

    const fallbackReport = {
      id: "rep_" + Date.now(),
      userId: userProfile?.id || "usr_default",
      generatedAt: new Date().toISOString(),
      healthScore: score,
      healthLevel: healthLevel,
      verdictTitle: isGoodUse
        ? "Gestão Financeira Positiva com Bom Uso dos Recursos"
        : "Alerta de Equilíbrio: Gastos Próximos ou Acima da Renda",
      verdictDescription: isGoodUse
        ? `Você está fazendo um bom uso do seu dinheiro. Sua renda mensal de R$ ${totalIncome.toFixed(2)} cobre com folga os gastos de R$ ${totalExpenses.toFixed(2)}, gerando uma taxa de poupança saudável de ${savingsRate.toFixed(1)}% (R$ ${netMonthlySavings.toFixed(2)}/mês para investir).`
        : `Atenção necessária: seus gastos de R$ ${totalExpenses.toFixed(2)} consom quase toda ou ultrapassam a sua renda de R$ ${totalIncome.toFixed(2)}. É fundamental conter saídas supérfluas e ampliar a margem de segurança.`,
      isGoodMoneyUse: isGoodUse,
      savingsRate: Number(savingsRate.toFixed(1)),
      rule50_30_20: {
        needsPercent: Number(needsPercent.toFixed(1)),
        wantsPercent: Number(wantsPercent.toFixed(1)),
        savingsPercent: Number(savingsInvestPercent.toFixed(1)),
        idealNeeds: 50,
        idealWants: 30,
        idealSavings: 20,
        evaluation:
          needsPercent <= 55 && wantsPercent <= 30
            ? "Excelente equilíbrio na proporção de necessidades e desejos."
            : "Desvio identificado na regra 50/30/20. Recomenda-se revisar custos de estilo de vida e moradia.",
      },
      keyStrengths: [
        `Renda recorrente ativa com entradas planejadas de R$ ${totalIncome.toFixed(2)}`,
        totalInvestedValue > 0
          ? `Patrimônio investido de R$ ${totalInvestedValue.toFixed(2)} gerando R$ ${monthlyInvestmentsYield.toFixed(2)}/mês de renda passiva`
          : "Potencial para iniciar a montagem da reserva de emergência",
        savingsRate > 15 ? `Taxa de poupança de ${savingsRate.toFixed(1)}% acima da média nacional` : "Possibilidade de reestruturação de orçamento",
      ],
      leakagesAndWaste: [
        lifestyleExpenses > totalIncome * 0.35
          ? `Gastos com estilo de vida (${wantsPercent.toFixed(1)}%) acima do limite recomendado de 30%`
          : "Avaliar assinaturas recorrentes e pequenos gastos diários com delivery e conveniência",
        "Atenção aos vencimentos em cartão de crédito para evitar rolagem de juros rotativos",
      ],
      actionPlan: [
        {
          stepNumber: 1,
          title: "Automatizar o Aporte no Primeiro Dia",
          description: `Assim que a renda cair, transfira imediatamente R$ ${(netMonthlySavings * 0.8 || 300).toFixed(2)} para os investimentos antes de gastar.`,
          impact: "Alto",
          category: "Investimentos",
        },
        {
          stepNumber: 2,
          title: "Consolidar Reserva de Emergência",
          description: "Manter o equivalente a pelo menos 6 meses de gastos essenciais em ativos com liquidez diária (Tesouro Selic / CDB 100%+).",
          impact: "Alto",
          category: "Reserva",
        },
        {
          stepNumber: 3,
          title: "Auditoria de Gastos com Estilo de Vida",
          description: "Estipular um teto semanal para delivery, bares e compras impulsivas para liberar mais capital de valorização.",
          impact: "Médio",
          category: "Corte de Custos",
        },
      ],
      investmentDiagnostic:
        totalInvestedValue > 0
          ? `Sua carteira de R$ ${totalInvestedValue.toFixed(2)} está gerando rendimentos estimados de R$ ${monthlyInvestmentsYield.toFixed(2)} ao mês. Mantenha o foco em diversificação e reinvestimento dos dividendos.`
          : "Você ainda não possui investimentos consolidados. O primeiro passo ideal é iniciar aportes em Renda Fixa pós-fixada com liquidez diária.",
      wealthProjections: {
        in1Year: futureValue(12),
        in5Years: futureValue(60),
        in10Years: futureValue(120),
        optimistic10Years: Math.round(futureValue(120) * 1.25),
      },
      summaryAdvice:
        "O segredo da liberdade financeira não é quanto você ganha, mas a constância do quanto você retém e investe. Mantenha os aportes mensais disciplinados!",
    };

    return res.json(fallbackReport);
  } catch (error: any) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Falha ao processar relatório financeiro", details: error?.message });
  }
});

// Vite middleware for development / static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Gestor Financeiro] Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
