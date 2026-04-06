import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFinancial } from "@/context/FinancialContext";
import { Building2, Calculator, EuroIcon, Save } from "lucide-react";

export function CompanySetupModal() {
  const { companyData, setCompanyData } = useFinancial();
  const [open, setOpen] = useState(false);
  
  // Local state for the form so we don't dispatch changes on every keystroke
  const [formData, setFormData] = useState(companyData);

  const handleChange = (field: keyof typeof companyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleSave = () => {
    setCompanyData(formData);
    setOpen(false);
  };

  // Preview automatic equity calculation
  const totalAssets = formData.cash + formData.receivables + formData.fixedAssets;
  const totalLiabilities = formData.debt + formData.payables;
  const autoEquity = totalAssets - totalLiabilities;

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (val) setFormData(companyData); // Reset working copy when opening
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all font-medium flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Setup da Empresa
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl w-[95vw] bg-slate-950 border-white/10 shadow-3xl p-0 overflow-hidden outline-none">
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 px-10 py-8 border-b border-white/5 flex items-center gap-6">
             <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center shadow-xl ring-1 ring-primary/20">
                <Calculator className="w-7 h-7 text-primary" />
             </div>
             <div>
                <DialogTitle className="text-3xl font-light text-white tracking-tight">Setup de Partida</DialogTitle>
                <DialogDescription className="text-slate-400 text-base mt-0.5">
                   Configure o estado real da sua empresa para calibração do motor financeiro.
                </DialogDescription>
             </div>
        </div>

        <div className="p-12 space-y-12 bg-slate-950/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                
                {/* LADO ESQUERDO: PERFORMANCE */}
                <div className="flex flex-col justify-between">
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-5 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]" />
                            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-widest">A. Resultados (P&L)</h3>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Exercício Base (Ano de Fecho)</Label>
                                <Input type="number" className="h-14 bg-white/[0.03] border-white/10 focus:ring-2 focus:ring-primary/20 transition-all text-xl font-light text-white px-5" value={formData.baseYear} onChange={e => handleChange('baseYear', e.target.value)} />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Faturação Bruta Anual (€)</Label>
                                <div className="relative group">
                                    <Input type="number" className="h-14 pl-6 pr-14 bg-white/[0.03] border-white/10 focus:ring-2 focus:ring-primary/20 transition-all text-2xl font-semibold text-primary" value={formData.revenue} onChange={e => handleChange('revenue', e.target.value)} />
                                    <EuroIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 transition-colors group-focus-within:text-primary" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="mt-auto p-6 rounded-2xl bg-primary/5 border border-primary/10 border-dashed backdrop-blur-sm shadow-inner group">
                        <p className="text-[14px] text-slate-400 leading-relaxed italic flex gap-4">
                           <span className="text-primary font-bold opacity-80 group-hover:opacity-100">DICA:</span>
                           "Os valores inseridos aqui serão trancados como o ano de referência real (Ano 0). O sistema utilizará estes números para calcular o crescimento projetado."
                        </p>
                    </div>
                </div>

                {/* LADO DIREITO: BALANÇO */}
                <div className="space-y-12 border-l border-white/5 pl-20">
                    <section className="space-y-8">
                         <div className="flex items-center gap-3">
                            <div className="w-1.5 h-5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-widest">B. Ativos (Ativo)</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Disponibilidades</Label>
                                <Input type="number" className="h-12 bg-white/[0.03] border-white/10 focus:border-emerald-500/50 text-white" value={formData.cash} onChange={e => handleChange('cash', e.target.value)} />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Recebíveis</Label>
                                <Input type="number" className="h-12 bg-white/[0.03] border-white/10 focus:border-emerald-500/50 text-white" value={formData.receivables} onChange={e => handleChange('receivables', e.target.value)} />
                            </div>
                            <div className="space-y-3 col-span-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Ativo Fixo Líquido (Imobilizado)</Label>
                                <Input type="number" className="h-12 bg-white/[0.03] border-white/10 focus:border-emerald-500/50 text-white" value={formData.fixedAssets} onChange={e => handleChange('fixedAssets', e.target.value)} />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8">
                         <div className="flex items-center gap-3">
                            <div className="w-1.5 h-5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
                            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-widest">C. Passivos (Dívida)</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Dívida Bancária</Label>
                                <Input type="number" className="h-12 bg-white/[0.03] border-white/10 focus:border-red-500/50 text-white" value={formData.debt} onChange={e => handleChange('debt', e.target.value)} />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Contas a Pagar</Label>
                                <Input type="number" className="h-12 bg-white/[0.03] border-white/10 focus:border-red-500/50 text-white" value={formData.payables} onChange={e => handleChange('payables', e.target.value)} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>

        {/* BOTTOM VALIDATION BAR */}
        <div className="bg-slate-900 border-t border-white/10 py-8 px-12 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Validação do Balanço Patrimonial</span>
                    <div className="h-px bg-white/5 flex-1 min-w-[50px]" />
                </div>
                <div className="flex items-center gap-10">
                    <div className="flex flex-col items-start pr-10 border-r border-white/5">
                        <span className="text-[10px] text-emerald-500 font-bold uppercase mb-1">Total Ativos</span>
                        <span className="text-xl text-white font-light tracking-tight">€{totalAssets.toLocaleString()}</span>
                    </div>
                    <span className="text-slate-700 text-2xl font-light">−</span>
                    <div className="flex flex-col items-start pr-10 border-r border-white/5">
                        <span className="text-[10px] text-red-500 font-bold uppercase mb-1">Total Passivos</span>
                        <span className="text-xl text-white font-light tracking-tight">€{totalLiabilities.toLocaleString()}</span>
                    </div>
                    <span className="text-slate-700 text-2xl font-light">=</span>
                    <div className="flex flex-col pl-6">
                        <span className="text-[10px] text-primary font-bold uppercase mb-1 tracking-widest">Equity (Ajuste)</span>
                        <span className={cn("text-3xl font-light tracking-tighter", autoEquity >= 0 ? "text-primary" : "text-red-500 underline decoration-wavy")}>
                            €{autoEquity.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
            
            <Button onClick={handleSave} size="lg" className="h-16 px-16 text-lg font-bold gap-4 shadow-2xl shadow-primary/30 hover:scale-[1.03] transition-all hover:bg-primary/90 active:scale-[0.98]">
               <Save className="w-6 h-6" />
               Aplicar aos Cenários
            </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
