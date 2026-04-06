import { useFinancial } from '@/context/FinancialContext';
import type { ChartTheme, Drivers } from '@/context/FinancialContext';
import { Slider } from '@/components/ui/slider';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { DownloadCloud } from 'lucide-react';
import { CompanySetupModal } from './CompanySetupModal';

export function ControlPanel() {
  const { 
    activeScenario, setActiveScenario,
    scenarios, updateDriver,
    wacc, setWacc, terminalGrowth, setTerminalGrowth,
    chartTheme, setChartTheme 
  } = useFinancial();

  const drivers = scenarios[activeScenario];

  const handleDriverChange = (key: keyof Drivers, value: number[]) => {
    updateDriver(key, value[0]);
  };

  return (
    <div className="w-80 h-full bg-card/50 backdrop-blur-md border-r border-border p-6 flex flex-col gap-6 overflow-y-auto hide-scrollbar">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Cockpit Modelador</h2>
        <p className="text-xs text-muted-foreground mt-1">Gira cenários macro e parâmetros de capital.</p>
      </div>

      {/* Primary Action: Reset/Setup Company Data */}
      <div className="pb-2">
        <CompanySetupModal />
      </div>

      <div className="w-full h-px bg-border/50" />

      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-300 block">Cenário de Mercado</label>
        <div className="flex bg-secondary/80 rounded-lg p-1 w-full border border-border">
            <button 
                onClick={() => setActiveScenario('bear')} 
                className={cn("flex-1 text-xs py-1.5 rounded-md transition-colors", activeScenario === 'bear' ? 'bg-destructive/20 text-red-400 font-medium' : 'text-slate-400 hover:text-white')}
            >
                Pessimista
            </button>
            <button 
                onClick={() => setActiveScenario('base')} 
                className={cn("flex-1 text-xs py-1.5 rounded-md transition-colors", activeScenario === 'base' ? 'bg-primary/20 text-primary font-medium' : 'text-slate-400 hover:text-white')}
            >
                Base
            </button>
            <button 
                onClick={() => setActiveScenario('bull')} 
                className={cn("flex-1 text-xs py-1.5 rounded-md transition-colors", activeScenario === 'bull' ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-slate-400 hover:text-white')}
            >
                Otimista
            </button>
        </div>
      </div>

      <div className="space-y-6 mt-2">
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 block mb-1">Paleta do Gráfico</label>
          <Select value={chartTheme} onValueChange={(v) => setChartTheme(v as ChartTheme)}>
            <SelectTrigger className="w-full bg-secondary/50 border-input">
              <SelectValue placeholder="Tema base" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Awwwards Clássico</SelectItem>
              <SelectItem value="vibrant">Neon Vibrante</SelectItem>
              <SelectItem value="pastel">Cores Pastel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full h-px bg-border my-2" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">WACC (%)</label>
            <span className="text-sm font-bold text-slate-200">{wacc}%</span>
          </div>
          <Slider 
            value={[wacc]} 
            onValueChange={(v) => setWacc(v[0])} 
            max={25} min={2} step={0.5}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Perpetuidade (%)</label>
            <span className="text-sm font-bold text-slate-200">{terminalGrowth}%</span>
          </div>
          <Slider 
            value={[terminalGrowth]} 
            onValueChange={(v) => setTerminalGrowth(v[0])} 
            max={10} min={-2} step={0.5}
            className="cursor-pointer"
          />
        </div>

        <div className="w-full h-px bg-border my-2" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Crescimento / Ano (%)</label>
            <span className="text-sm font-bold text-primary">{drivers.revenueGrowth}%</span>
          </div>
          <Slider 
            value={[drivers.revenueGrowth]} 
            onValueChange={(v) => handleDriverChange('revenueGrowth', v)} 
            max={100} min={-50} step={1}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Margem Bruta (%)</label>
            <span className="text-sm font-bold text-yellow-500">{drivers.grossMargin}%</span>
          </div>
          <Slider 
            value={[drivers.grossMargin]} 
            onValueChange={(v) => handleDriverChange('grossMargin', v)} 
            max={95} min={5} step={1}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Margem EBITDA (%)</label>
            <span className="text-sm font-bold text-emerald-400">{drivers.ebitdaMargin}%</span>
          </div>
          <Slider 
            value={[drivers.ebitdaMargin]} 
            onValueChange={(v) => handleDriverChange('ebitdaMargin', v)} 
            max={drivers.grossMargin} min={0} step={1}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Nova Dívida / Ano (k€)</label>
            <span className="text-sm font-bold text-slate-200">{drivers.newDebt}k</span>
          </div>
          <Slider 
            value={[drivers.newDebt]} 
            onValueChange={(v) => handleDriverChange('newDebt', v)} 
            max={500} min={-200} step={10}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Taxa de Juros (%)</label>
            <span className="text-sm font-bold text-destructive">{drivers.interestRate}%</span>
          </div>
          <Slider 
            value={[drivers.interestRate]} 
            onValueChange={(v) => handleDriverChange('interestRate', v)} 
            max={20} min={0} step={0.5}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Taxa de Imposto (IRC)</label>
            <span className="text-sm font-bold text-destructive">{drivers.taxRate}%</span>
          </div>
          <Slider 
            value={[drivers.taxRate]} 
            onValueChange={(v) => handleDriverChange('taxRate', v)} 
            max={40} min={0} step={0.5}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">P.M. Recebimentos</label>
            <span className="text-sm font-bold text-slate-200">{drivers.daysSales} d</span>
          </div>
          <Slider 
            value={[drivers.daysSales]} 
            onValueChange={(v) => handleDriverChange('daysSales', v)} 
            max={120} min={0} step={1}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">P.M. Pagamentos</label>
            <span className="text-sm font-bold text-slate-200">{drivers.daysPayable} d</span>
          </div>
          <Slider 
            value={[drivers.daysPayable]} 
            onValueChange={(v) => handleDriverChange('daysPayable', v)} 
            max={120} min={0} step={1}
            className="cursor-pointer"
          />
        </div>
      </div>
      
      <Card className="mt-4 bg-secondary/50 border-none shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm relative">
            Exportar DCF / PDF
            <span className="absolute -top-3 -right-2 bg-primary/20 text-primary text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Brevemente</span>
          </CardTitle>
          <CardDescription className="text-xs">Gere um teaser book corporativo instantâneo.</CardDescription>
        </CardHeader>
        <div className="p-4 pt-0">
            <button disabled className="w-full py-2 bg-border text-muted-foreground rounded-md text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed opacity-60">
                <DownloadCloud className="w-4 h-4" /> Exportar
            </button>
        </div>
      </Card>

      {/* spacer for scroll */}
      <div className="pb-8" />
    </div>
  );
}
