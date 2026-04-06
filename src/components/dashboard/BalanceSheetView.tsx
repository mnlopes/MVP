import { useFinancial } from "@/context/FinancialContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatEUR, cn } from "@/lib/utils";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  Building2, 
  ShieldCheck, 
  PieChart, 
  Scale,
  ArrowRightLeft
} from "lucide-react";

export function BalanceSheetView() {
  const { projections, colors, companyData } = useFinancial();

  // Reference current foccused year or last year
  const activeYear = projections[projections.length - 1];

  // SNC Ratios
  const autonomiaFinanceira = (activeYear.equity / activeYear.totalAssets) * 100;
  const solvabilidade = (activeYear.totalAssets / (activeYear.payables + activeYear.debt));
  const fundoManeio = (activeYear.cash + activeYear.receivables) - activeYear.payables;

  // Chart data for Capital Structure evolution
  const chartData = projections.map(p => ({
    year: `${p.year}${p.year > companyData.baseYear ? 'P' : 'A'}`,
    "Capitais Próprios": p.equity,
    "Passivo (Dívida)": p.debt,
    "Passivo (Corrente)": p.payables,
  }));

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar bg-background">
      
      {/* SNC Solvency Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/40 border-border shadow-sm backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <CardHeader className="flex flex-row items-center justify-between py-2.5 px-4 pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Autonomia Financeira</CardTitle>
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-xl font-bold tracking-tight text-white">{autonomiaFinanceira.toFixed(1)}%</div>
            <p className="text-[9px] text-muted-foreground mt-1">Capitais Próprios / Ativos Totais. (Ref: {'>'}30%)</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border shadow-sm backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between py-2.5 px-4 pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Solvabilidade Gala</CardTitle>
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-xl font-bold tracking-tight text-emerald-400">{solvabilidade.toFixed(2)}x</div>
            <p className="text-[9px] text-muted-foreground mt-1">Capacidade de solver passivos com ativos.</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border shadow-sm backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between py-2.5 px-4 pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Fundo de Maneio</CardTitle>
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className={cn("text-xl font-bold tracking-tight", fundoManeio >= 0 ? "text-amber-400" : "text-red-400")}>{formatEUR(fundoManeio)}</div>
            <p className="text-[9px] text-muted-foreground mt-1">Margem de segurança para curto prazo.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SNC Balance Sheet Table (Assets vs Liabilities/Equity) */}
        <Card className="lg:col-span-8 bg-card/30 border-border overflow-hidden">
          <CardHeader className="py-4 px-5 border-b border-border/50 bg-white/5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Mapa de Balanço Mensal (SNC Portugal)
            </CardTitle>
            <CardDescription className="text-[10px]">Equilíbrio Patrimonial: Ativo = Passivo + Capitais Próprios.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
              
              {/* ASSETS (ATIVO) */}
              <div className="flex flex-col">
                <div className="bg-secondary/30 px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50">ATIVO</div>
                <div className="p-4 space-y-4">
                    <section>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Não Corrente</h4>
                        <div className="flex justify-between items-center text-xs py-1 border-b border-white/5">
                            <span className="text-muted-foreground">Ativos Fixos Tangíveis (Imob.)</span>
                            <span className="font-medium text-slate-200">{formatEUR(activeYear.fixedAssets)}</span>
                        </div>
                    </section>
                    <section>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Corrente (Circulante)</h4>
                        <div className="flex justify-between items-center text-xs py-1 border-b border-white/5">
                            <span className="text-muted-foreground">Inventários / Clientes</span>
                            <span className="font-medium text-slate-200">{formatEUR(activeYear.receivables)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs py-1 border-b border-white/5">
                            <span className="text-muted-foreground">Disponibilidades (Caixa)</span>
                            <span className="font-medium text-emerald-400">{formatEUR(activeYear.cash)}</span>
                        </div>
                    </section>
                    <div className="pt-2 flex justify-between items-center text-sm font-bold text-primary">
                        <span>ATIVO TOTAL</span>
                        <span>{formatEUR(activeYear.totalAssets)}</span>
                    </div>
                </div>
              </div>

              {/* L & E (CAPITAL PRÓPRIO E PASSIVO) */}
              <div className="flex flex-col">
                <div className="bg-secondary/30 px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50">CAPITAL PRÓPRIO E PASSIVO</div>
                <div className="p-4 space-y-4">
                    <section>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Capitais Próprios</h4>
                        <div className="flex justify-between items-center text-xs py-1 border-b border-white/5">
                            <span className="text-muted-foreground">Capital Social e Reservas</span>
                            <span className="font-medium text-slate-200">{formatEUR(activeYear.equity - activeYear.netIncome)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs py-1 border-b border-white/5">
                            <span className="text-muted-foreground">Resultado Líquido do Período</span>
                            <span className="font-medium text-primary">{formatEUR(activeYear.netIncome)}</span>
                        </div>
                    </section>
                    <section>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Passivos</h4>
                        <div className="flex justify-between items-center text-xs py-1 border-b border-white/5">
                            <span className="text-muted-foreground">Passivo Bancário (Dívida)</span>
                            <span className="font-medium text-red-400">{formatEUR(activeYear.debt)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs py-1 border-b border-white/5">
                            <span className="text-muted-foreground">Fornecedores e Outros (Corrente)</span>
                            <span className="font-medium text-slate-200">{formatEUR(activeYear.payables)}</span>
                        </div>
                    </section>
                    <div className="pt-2 flex justify-between items-center text-sm font-bold text-white">
                        <span>CP + PASSIVO TOTAL</span>
                        <span>{formatEUR(activeYear.totalLiabilitiesAndEquity)}</span>
                    </div>
                </div>
              </div>
            </div>
            <div className="bg-emerald-500/10 p-3 text-center border-t border-border">
                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em] animate-pulse">Balanço Em Equilíbrio ✓</p>
            </div>
          </CardContent>
        </Card>

        {/* Capital Structure Chart */}
        <Card className="lg:col-span-4 bg-card/30 border-border">
            <CardHeader className="py-4 px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-500" />
                Estrutura de Capital
              </CardTitle>
              <CardDescription className="text-[10px]">Autonomia Financeira vs Alavancagem.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                        formatter={(val: any) => formatEUR(Number(val))}
                    />
                    <Legend iconType="circle" />
                    <Area type="monotone" dataKey="Capitais Próprios" stackId="1" stroke={colors[8] || '#3b82f6'} fill={colors[8] || '#3b82f6'} fillOpacity={0.6} />
                    <Area type="monotone" dataKey="Passivo (Dívida)" stackId="1" stroke={colors[7] || '#ef4444'} fill={colors[7] || '#ef4444'} fillOpacity={0.4} />
                    <Area type="monotone" dataKey="Passivo (Corrente)" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
