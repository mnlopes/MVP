import { useState } from 'react';
import { FinancialProvider } from '@/context/FinancialContext';
import { ControlPanel } from '@/components/dashboard/ControlPanel';
import { Dashboard } from '@/pages/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, LayoutDashboard, Wallet, Building2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CashFlowView } from '@/components/dashboard/CashFlowView';
import { BalanceSheetView } from '@/components/dashboard/BalanceSheetView';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <FinancialProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden font-sans text-slate-100">
        
        {/* Sidebar Controls overlay for mobile */}
        <div className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity lg:hidden",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )} onClick={() => setSidebarOpen(false)} />

        {/* Sidebar Controls */}
        <ControlPanel isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-card/30 backdrop-blur-sm flex items-center px-4 md:px-8 z-10 shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-primary hover:bg-primary/10 transition-colors mr-1"
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div className="bg-primary/20 p-1.5 md:p-2 rounded-lg">
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">MVP</h1>
            </div>
            <div className="ml-auto text-xs md:text-sm text-muted-foreground truncate max-w-[150px] md:max-w-none">
              Mercado de Portugal (EUR €)
            </div>
          </header>

          <main className="flex-1 overflow-hidden flex flex-col relative w-full">
            <Tabs defaultValue="overview" className="flex-1 flex flex-col w-full h-full">
              <div className="px-4 md:px-8 pt-4 md:pt-6 pb-2">
                <TabsList className="bg-secondary/50 border border-border p-1 w-full md:w-auto overflow-x-auto justify-start no-scrollbar">
                  <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary shrink-0">
                    <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">Visão Geral</span><span className="sm:hidden">Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger value="dre" className="gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 shrink-0">
                    <Activity className="w-4 h-4" /> D.R.E.
                  </TabsTrigger>
                  <TabsTrigger value="balanco" className="gap-2 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 shrink-0">
                    <Building2 className="w-4 h-4" /> Balanço
                  </TabsTrigger>
                  <TabsTrigger value="cashflow" className="gap-2 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 shrink-0">
                    <Wallet className="w-4 h-4" /> Caixa
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden relative">
                <TabsContent value="overview" className="h-full m-0 border-none data-[state=active]:flex flex-col">
                  <Dashboard />
                </TabsContent>
                
                <TabsContent value="dre" className="h-full m-0 p-4 md:p-8">
                  <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground text-sm">Aba DRE em Construção (Ver Overview)</p>
                  </div>
                </TabsContent>
                {/* ... other tab contents shortened for brevity ... */}
                <TabsContent value="balanco" className="h-full m-0 data-[state=active]:flex flex-col">
                  <BalanceSheetView />
                </TabsContent>
                <TabsContent value="cashflow" className="h-full m-0 data-[state=active]:flex flex-col overflow-hidden">
                  <CashFlowView />
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
