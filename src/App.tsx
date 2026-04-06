import React from 'react';
import { FinancialProvider } from '@/context/FinancialContext';
import { ControlPanel } from '@/components/dashboard/ControlPanel';
import { Dashboard } from '@/pages/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, LayoutDashboard, Wallet, Building2 } from 'lucide-react';

function App() {
  return (
    <FinancialProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden font-sans text-slate-100">
        
        {/* Sidebar Controls */}
        <ControlPanel />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-card/30 backdrop-blur-sm flex items-center px-8 z-10">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">MVP</h1>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              Mercado de Portugal (EUR €)
            </div>
          </header>

          <main className="flex-1 overflow-hidden flex flex-col relative w-full">
            <Tabs defaultValue="overview" className="flex-1 flex flex-col w-full h-full">
              <div className="px-8 pt-6 pb-2">
                <TabsList className="bg-secondary/50 border border-border p-1">
                  <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <LayoutDashboard className="w-4 h-4" /> Visão Geral
                  </TabsTrigger>
                  <TabsTrigger value="dre" className="gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                    <Activity className="w-4 h-4" /> D.R.E.
                  </TabsTrigger>
                  <TabsTrigger value="balanco" className="gap-2 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                    <Building2 className="w-4 h-4" /> Balanço Líquido
                  </TabsTrigger>
                  <TabsTrigger value="cashflow" className="gap-2 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
                    <Wallet className="w-4 h-4" /> Fluxo de Caixa
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden relative">
                <TabsContent value="overview" className="h-full m-0 border-none data-[state=active]:flex flex-col">
                  <Dashboard />
                </TabsContent>
                
                <TabsContent value="dre" className="h-full m-0 p-8">
                  <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">Aba DRE em Construção (Ver Overview)</p>
                  </div>
                </TabsContent>

                <TabsContent value="balanco" className="h-full m-0 p-8">
                  <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">Aba Balanço em Construção (Ver Overview)</p>
                  </div>
                </TabsContent>

                <TabsContent value="cashflow" className="h-full m-0 p-8">
                  <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">Aba Fluxo de Caixa em Construção (Ver Overview)</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </main>
        </div>

      </div>
    </FinancialProvider>
  );
}

export default App;
