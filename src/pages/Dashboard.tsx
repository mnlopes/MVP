import { useState, useMemo, useEffect } from 'react';
import { useFinancial } from "@/context/FinancialContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEUR } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { AlertOctagon as IconAlertOctagon, AlertTriangle as IconAlertTriangle, CheckCircle as IconCheckCircle, TrendingUp as IconTrendingUp, Zap as IconZap, ShieldAlert as IconShieldAlert } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

function InteractiveLegend(props: any) {
  const { payload, colorMapping, setCustomColor } = props;
  if (!payload) return null;
  
  return (
    <ul className="flex items-center justify-center gap-4 text-[10px] mt-1 relative z-50">
      {payload.map((entry: any, index: number) => {
        const globalIndex = colorMapping[entry.dataKey] ?? index;
        return (
          <li key={`item-${index}`} className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
            <label className="relative flex items-center justify-center cursor-pointer w-2.5 h-2.5 rounded-full overflow-hidden shrink-0 group ring-1 ring-white/10" title="Escolher Cor">
              <div style={{ backgroundColor: entry.color }} className="absolute inset-0 group-hover:scale-125 transition-transform" />
              <input 
                type="color" 
                value={entry.color}
                onChange={(e) => setCustomColor(globalIndex, e.target.value)}
                className="opacity-0 absolute -inset-4 w-10 h-10 cursor-pointer"
              />
            </label>
            <span className="text-slate-400 font-medium capitalize">{entry.value}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function Dashboard() {
  const { projections, colors, valuation, riskStatus, setCustomColor, activeScenario, companyData } = useFinancial();
  const [targetYear, setTargetYear] = useState<number>(2028);

  useEffect(() => {
    if (projections.length > 0) {
        const years = projections.map(p => p.year);
        if (!years.includes(targetYear)) {
            setTargetYear(years[years.length - 1]);
        }
    }
  }, [projections, targetYear]);

  const activeYearData = useMemo(() => 
    projections.find(p => p.year === targetYear) || projections[projections.length - 1],
  [projections, targetYear]);

  const baseYearData = projections[0];
  const cagrSpan = activeYearData.year - baseYearData.year;
  const cagr = cagrSpan > 0 
    ? (Math.pow(activeYearData.revenue / baseYearData.revenue, 1 / cagrSpan) - 1) * 100 
    : 0;

  const getRiskUI = () => {
    switch (riskStatus) {
        case 'Rutura': return { icon: IconAlertOctagon, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', text: 'Risco de Insolvência' };
        case 'Alerta': return { icon: IconAlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', text: 'Atenção ao Caixa' };
        case 'Seguro': return { icon: IconCheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'Balanço Saudável' };
    }
  };
  const riskUI = getRiskUI();
  const RiskIcon = riskUI.icon;

  return (
    <div className={cn(
        "flex-1 overflow-y-auto p-4 md:p-5 space-y-4 relative transition-colors duration-500 custom-scrollbar",
        riskStatus === 'Rutura' ? "bg-red-950/5 shadow-[inset_0_0_150px_rgba(239,68,68,0.05)]" : "bg-background"
    )}>
      
      {/* HEADER SECTION (Compact) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-1">
          <div>
            <h1 className="text-xl md:text-2xl font-light tracking-tight text-foreground flex items-center gap-2">
               Overview <span className="font-medium text-primary">Estratégico</span>
            </h1>
            <p className="text-[10px] text-muted-foreground opacity-70">Visão Integrada de Performance e Valor de Mercado.</p>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1 flex items-center gap-1.5 text-primary">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-semibold uppercase tracking-wider">Cenário {activeScenario.toUpperCase()}</span>
             </div>
             <div className={cn("flex items-center gap-2 px-3 py-1 border rounded-full backdrop-blur-sm shadow-sm", riskUI.bg)}>
                <RiskIcon className="w-3 h-3" />
                <span className={cn("text-[9px] font-bold uppercase tracking-tight", riskUI.color)}>{riskUI.text}</span>
             </div>
          </div>
      </div>

      {/* TOP ROW: VALUATION & RISK (Hyper-Compact) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <IconTrendingUp size={60} className="text-primary" />
              </div>
              <CardHeader className="py-2.5 px-4">
                <CardTitle className="text-xs font-semibold flex items-center gap-2 text-foreground">
                    <IconZap className="text-yellow-400 fill-yellow-400 w-3 h-3" />
                    Valuation Intrínseco (DCF)
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6 pb-3 pt-0 px-4">
                 <div className="shrink-0">
                    <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest mb-0.5 opacity-40">Equity Value</p>
                    <div className="text-2xl font-bold text-foreground tracking-tight leading-none">{formatEUR(valuation.equityValue)}</div>
                 </div>
                 <div className="flex gap-5 border-l border-white/5 pl-5 pr-2">
                    <div>
                        <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-tight mb-0.5 opacity-30">Enterprise Value</p>
                        <p className="text-base font-semibold text-slate-200">{formatEUR(valuation.enterpriseValue)}</p>
                    </div>
                    <div>
                        <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-tight mb-0.5 opacity-30">Terminal Value</p>
                        <p className="text-base font-semibold text-slate-200">{formatEUR(valuation.terminalValue)}</p>
                    </div>
                 </div>
              </CardContent>
          </Card>

          <Card className={cn("border-l-4 shadow-lg transition-all flex flex-col justify-center", 
             riskStatus === 'Seguro' ? 'border-l-emerald-500 bg-emerald-500/5' : 
             riskStatus === 'Alerta' ? 'border-l-yellow-500 bg-yellow-500/5' : 'border-l-red-500 bg-red-500/5')}>
              <CardHeader className="py-2 px-4">
                 <CardTitle className="text-[8px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <IconShieldAlert className="w-3 h-3" /> Monitor de Risco
                 </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 pt-0 px-4">
                 <div className="text-lg font-bold text-foreground tracking-tight leading-tight mb-1">
                    {riskStatus === 'Seguro' ? 'Operação Saudável' : riskStatus === 'Alerta' ? 'Cuidado com Liquidez' : 'Rutura de Caixa'}
                 </div>
                 <div className="pt-1.5 border-t border-white/5">
                    <div className="flex items-baseline justify-between">
                       <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest opacity-40">Mínimo Projetado</p>
                       <p className="text-lg font-bold text-foreground tracking-tight">{formatEUR(activeYearData.cash)}</p>
                    </div>
                 </div>
              </CardContent>
          </Card>
      </div>

       {/* YEAR SELECTOR (Compact) */}
       <div className="flex justify-between items-center pt-2 pb-0.5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest opacity-60">Indicadores Atuais ({activeYearData.year}{activeYearData.year > companyData.baseYear ? 'P' : 'A'})</h2>
        <div className="flex items-center gap-2">
            <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-black opacity-40">Focar Ano:</span>
            <Select value={targetYear.toString()} onValueChange={(val) => setTargetYear(parseInt(val))}>
                <SelectTrigger className="w-20 bg-card/40 border-input h-6 text-[9px] font-bold">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {projections.map(p => (
                        <SelectItem key={p.year} value={p.year.toString()} className="text-[9px]">
                            {p.year} {p.year > companyData.baseYear ? 'P' : 'A'}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

       {/* KPI CARDS (Compact but readable) */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard title="Receita" value={formatEUR(activeYearData.revenue)} subtext={`${cagr.toFixed(1)}% CAGR`} hexColor={colors[0]} />
        <KPICard title="EBITDA" value={formatEUR(activeYearData.ebitda)} subtext={`${((activeYearData.ebitda / activeYearData.revenue) * 100).toFixed(1)}% Marg`} hexColor={colors[1]} />
        <KPICard title="Lucro" value={formatEUR(activeYearData.netIncome)} subtext={`${((activeYearData.netIncome / activeYearData.revenue) * 100).toFixed(1)}% Marg`} hexColor={colors[2]} />
        <KPICard title="Caixa" value={formatEUR(activeYearData.cash)} subtext={`${(activeYearData.ebitda > 0 ? activeYearData.debt / activeYearData.ebitda : 0).toFixed(1)}x Alav`} hexColor={colors[3]} />
      </div>

      {/* CHARTS GRID (Compact Heights) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
        
        <Card className="bg-card/40 border-border shadow-md backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-slate-900/40 border-b border-white/5 py-1.5 px-3">
            <CardTitle className="text-[9px] font-bold text-slate-100 uppercase tracking-widest opacity-60">Resultados Operacionais</CardTitle>
          </CardHeader>
          <CardContent className="h-56 pt-3 px-1.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projections} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                <XAxis dataKey="year" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `€${(v/1000).toFixed(0)}k`} />
                <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} contentStyle={{ backgroundColor: 'rgba(20, 22, 35, 0.95)', border: 'none', borderRadius: '6px', fontSize: '13px', color: '#fff' }} formatter={(val: any) => typeof val === 'number' ? formatEUR(val) : val} />
                <Legend content={<InteractiveLegend colorMapping={{ revenue: 0, ebitda: 1, netIncome: 2 }} setCustomColor={setCustomColor} />} />
                <Bar dataKey="revenue" name="Receita" fill={colors[0]} fillOpacity={0.8} radius={[2, 2, 0, 0]} />
                <Bar dataKey="ebitda" name="EBITDA" fill={colors[1]} fillOpacity={0.9} radius={[2, 2, 0, 0]} />
                <Bar dataKey="netIncome" name="Lucro" fill={colors[2]} fillOpacity={1} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border shadow-md backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-slate-900/40 border-b border-white/5 py-1.5 px-3">
            <CardTitle className="text-[9px] font-bold text-slate-100 uppercase tracking-widest opacity-60">Evolução Patrimonial</CardTitle>
          </CardHeader>
          <CardContent className="h-56 pt-3 px-1.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projections} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                <XAxis dataKey="year" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `€${(v/1000).toFixed(0)}k`} />
                <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} contentStyle={{ backgroundColor: 'rgba(20, 22, 35, 0.95)', border: 'none', borderRadius: '6px', fontSize: '13px', color: '#fff' }} formatter={(val: any) => typeof val === 'number' ? formatEUR(val) : val} />
                <Legend content={<InteractiveLegend colorMapping={{ cash: 3, receivables: 4, fixedAssets: 5, payables: 6, debt: 7, equity: 8 }} setCustomColor={setCustomColor} />} />
                <Bar dataKey="cash" stackId="A" name="Caixa" fill={colors[3]} />
                <Bar dataKey="receivables" stackId="A" name="Recebíveis" fill={colors[4]} />
                <Bar dataKey="fixedAssets" stackId="A" name="Ativos" fill={colors[5]} radius={[2, 2, 0, 0]} />
                <Bar dataKey="payables" stackId="B" name="Fornec" fill={colors[6]} />
                <Bar dataKey="debt" stackId="B" name="Dívida" fill={colors[7]} />
                <Bar dataKey="equity" stackId="B" name="Equity" fill={colors[8]} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border shadow-md backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-slate-900/40 border-b border-white/5 py-1.5 px-3">
            <CardTitle className="text-[9px] font-bold text-slate-100 uppercase tracking-widest opacity-60">Margens Operacionais (%)</CardTitle>
          </CardHeader>
          <CardContent className="h-56 pt-3 px-1.5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projections} margin={{ top: 5, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                <XAxis dataKey="year" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v.toFixed(0)}%`} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(20, 22, 35, 0.95)', border: 'none', borderRadius: '6px', fontSize: '13px', color: '#fff' }} formatter={(val: any) => typeof val === 'number' ? `${val.toFixed(1)}%` : val} />
                <Legend content={<InteractiveLegend colorMapping={{ grossMarginPercent: 0, ebitdaMarginPercent: 1, netMarginPercent: 2 }} setCustomColor={setCustomColor} />} />
                <Line type="monotone" dataKey="grossMarginPercent" name="M. Bruta" stroke={colors[0]} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ebitdaMarginPercent" name="M. EBITDA" stroke={colors[1]} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="netMarginPercent" name="M. Líquida" stroke={colors[2]} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border shadow-md backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-slate-900/40 border-b border-white/5 py-1.5 px-3">
            <CardTitle className="text-[9px] font-bold text-slate-100 uppercase tracking-widest opacity-60">Geração de Caixa vs Inv.</CardTitle>
          </CardHeader>
          <CardContent className="h-56 pt-3 px-1.5">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projections} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                <XAxis dataKey="year" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `€${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(20, 22, 35, 0.95)', border: 'none', borderRadius: '6px', fontSize: '13px', color: '#fff' }} formatter={(val: any) => typeof val === 'number' ? formatEUR(val) : val} />
                <Legend content={<InteractiveLegend colorMapping={{ fcf: 1, capex: 9 }} setCustomColor={setCustomColor} />} />
                <Bar dataKey="fcf" name="Fluxo Caixa" fill={colors[1]} radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="capex" name="Invest (Capex)" stroke={colors[9]} strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ title, value, subtext, hexColor }: { title: string, value: string, subtext: string, hexColor?: string }) {
  return (
    <Card className="bg-card/60 border-border shadow-md backdrop-blur-sm hover:bg-card/80 transition-all">
      <CardContent className="p-3 md:p-4">
        <div className="flex justify-between items-center mb-1">
           <p className="text-[12px] uppercase text-muted-foreground tracking-widest font-black opacity-40">{title}</p>
           {hexColor && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hexColor, boxShadow: `0 0 8px ${hexColor}` }} />}
        </div>
        <div className="text-xl font-bold tracking-tight text-foreground leading-none">{value}</div>
        <p className="text-[12px] text-muted-foreground mt-1.5 font-bold uppercase tracking-tight bg-secondary/20 px-1.5 py-0.5 rounded-sm inline-block">{subtext}</p>
      </CardContent>
    </Card>
  );
}
