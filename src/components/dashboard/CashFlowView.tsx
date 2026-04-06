import { useFinancial } from "@/context/FinancialContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatEUR } from "@/lib/utils";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart, Line, Bar
} from 'recharts';
import { 
  Coins, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Wallet,
  History
} from "lucide-react";

export function CashFlowView() {
  const { projections, colors, companyData } = useFinancial();

  // Chart data formatted
  const chartData = projections.map(p => ({
    year: `${p.year}${p.year > companyData.baseYear ? 'P' : 'A'}`,
    "Fluxo de Caixa Livre (FCF)": p.fcf,
    "Saldo de Caixa": p.cash,
    "Investimento (CAPEX)": -p.capex,
  }));

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar bg-background">
      
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/40 border-border shadow-sm backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between py-2.5 px-4 pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Operacional (OCF)</CardTitle>
            <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-400" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-xl font-bold tracking-tight text-emerald-400">{formatEUR(projections[projections.length - 1].netIncome + projections[projections.length - 1].depreciation - projections[projections.length - 1].changeInNWC)}</div>
            <p className="text-[9px] text-muted-foreground mt-1">Gerado pelas operações core.</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border shadow-sm backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between py-2.5 px-4 pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Investimento (CAPEX)</CardTitle>
            <ArrowDownCircle className="w-3.5 h-3.5 text-red-400" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-xl font-bold tracking-tight text-red-400">-{formatEUR(projections[projections.length - 1].capex)}</div>
            <p className="text-[9px] text-muted-foreground mt-1">Compromisso com ativos fixos.</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between py-2.5 px-4 pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Free Cash Flow (FCF)</CardTitle>
            <Coins className="w-3.5 h-3.5 text-primary" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-xl font-bold tracking-tight text-white">{formatEUR(projections[projections.length - 1].fcf)}</div>
            <p className="text-[9px] text-muted-foreground mt-1">Dinheiro disponível para crescimento.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Chart Area */}
        <Card className="lg:col-span-3 bg-card/30 border-border p-4">
          <CardHeader className="p-0 mb-6">
             <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                Dinâmica de Liquidez
             </CardTitle>
             <CardDescription className="text-[10px]">Evolução do Saldo de Caixa Acumulado vs Fluxos Anuais.</CardDescription>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={10} 
                  tick={{ fill: '#64748b' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={10} 
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ padding: '2px 0' }}
                  formatter={(value: any) => formatEUR(Number(value))}
                />
                <Legend content={<CustomLegend />} />
                <Bar dataKey="Fluxo de Caixa Livre (FCF)" fill={colors[3]} radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="Investimento (CAPEX)" fill="#ef4444" radius={[0, 0, 4, 4]} barSize={15} opacity={0.4} />
                <Line type="monotone" dataKey="Saldo de Caixa" stroke={colors[0]} strokeWidth={3} dot={{ fill: colors[0], r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Breakdown Table */}
        <Card className="lg:col-span-2 bg-card/30 border-border flex flex-col">
          <CardHeader className="py-4 px-5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                Demonstração de Cash Flow
            </CardTitle>
            <CardDescription className="text-[10px]">Cálculo do Fluxo de Caixa (Método Indireto).</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse min-w-[320px]">
              <thead className="bg-secondary/40 border-y border-border">
                <tr>
                  <th className="py-2 px-4 font-bold text-muted-foreground uppercase tracking-widest text-[8px]">Linhas</th>
                  {projections.slice(-3).map(p => (
                    <th key={p.year} className="py-2 px-4 text-right font-bold text-slate-300">{p.year}{p.year > companyData.baseYear ? 'P' : 'A'}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-4 text-slate-400">Resultado Líquido</td>
                  {projections.slice(-3).map(p => (
                    <td key={p.year} className="py-2 px-4 text-right font-medium">{formatEUR(p.netIncome)}</td>
                  ))}
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-4 text-slate-400">Depreciações (+)</td>
                  {projections.slice(-3).map(p => (
                    <td key={p.year} className="py-2 px-4 text-right text-emerald-400 opacity-80">+{formatEUR(p.depreciation)}</td>
                  ))}
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-4 text-slate-400">Var. NWC (-)</td>
                  {projections.slice(-3).map(p => (
                    <td key={p.year} className="py-2 px-4 text-right text-red-400 opacity-80">-{formatEUR(p.changeInNWC)}</td>
                  ))}
                </tr>
                <tr className="bg-emerald-500/5 font-bold">
                  <td className="py-2 px-4 text-foreground">Fluxo Operacional</td>
                  {projections.slice(-3).map(p => (
                    <td key={p.year} className="py-2 px-4 text-right text-emerald-400">{formatEUR(p.netIncome + p.depreciation - p.changeInNWC)}</td>
                  ))}
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-4 text-slate-400">Investimento (CAPEX)</td>
                  {projections.slice(-3).map(p => (
                    <td key={p.year} className="py-2 px-4 text-right text-red-500">-{formatEUR(p.capex)}</td>
                  ))}
                </tr>
                <tr className="bg-primary/5 font-bold border-t border-border/80">
                  <td className="py-2 px-4 text-primary">Free Cash Flow</td>
                  {projections.slice(-3).map(p => (
                    <td key={p.year} className="py-2 px-4 text-right text-primary">{formatEUR(p.fcf)}</td>
                  ))}
                </tr>
                <tr className="bg-foreground/5 font-bold">
                  <td className="py-2 px-4 text-foreground">Saldo Final Caixa</td>
                  {projections.slice(-3).map(p => (
                    <td key={p.year} className="py-2 px-4 text-right text-foreground">{formatEUR(p.cash)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
            <div className="p-4 text-[10px] text-muted-foreground italic opacity-60">
                * NWC (Capital de Giro) varia conforme os dias de venda e pagamento definidos no Cockpit.
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

function CustomLegend({ payload }: any) {
  if (!payload) return null;
  return (
    <div className="flex justify-center gap-6 text-[10px] mt-4 font-medium uppercase tracking-tight opacity-70">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-400">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
