import React, { createContext, useContext, useState, useMemo } from 'react';

export type FinancialValues = {
  year: number;
  revenue: number;
  grossProfit: number;
  ebitda: number;
  ebit: number;
  interest: number;
  ebt: number;
  taxes: number;
  netIncome: number;
  
  // Percentages for Margin Chart
  grossMarginPercent: number;
  ebitdaMarginPercent: number;
  netMarginPercent: number;

  receivables: number;
  payables: number;
  changeInNWC: number;
  capex: number;
  depreciation: number;
  fcf: number; // Free cash flow to Equity/Cash
  fcfToFirm: number; // Unlevered Free Cash flow for DCF
  
  // Balance Sheet
  cash: number;
  fixedAssets: number;
  debt: number;
  equity: number;
  totalAssets: number;
  totalLiabilitiesAndEquity: number;
};

// Represents what is configurable per scenario
export type Drivers = {
  revenueGrowth: number;    // %
  grossMargin: number;      // %
  ebitdaMargin: number;     // %
  taxRate: number;          // %
  interestRate: number;     // %
  newDebt: number;          // amount per year (thousands, so we'll multiply by 1000)
  daysSales: number;        // days
  daysPayable: number;      // days
};

export type ScenarioName = 'bear' | 'base' | 'bull';

// Valuation Outputs
export type ValuationOutput = {
  pvOfFCFF: number;
  terminalValue: number;
  pvOfTerminalValue: number;
  enterpriseValue: number;
  equityValue: number;
};

// Risk Status
export type RiskStatus = 'Seguro' | 'Alerta' | 'Rutura';

export type ChartTheme = 'classic' | 'vibrant' | 'pastel';

export const CHART_PALETTES: Record<ChartTheme, string[]> = {
  // Awwwards Clássico: Premium Corporate (Deep Blues, Cyans, Purples)
  classic: [
    '#3b82f6', // 0: Revenue (Strong Blue)
    '#0ea5e9', // 1: EBITDA (Cyan/Sky)
    '#a855f7', // 2: Lucro (Purple)
    
    '#10b981', // 3: Cash (Emerald)
    '#6ee7b7', // 4: Receivables (Light Emerald)
    '#334155', // 5: Fixed Assets (Dark Slate)
    
    '#f59e0b', // 6: Payables (Amber)
    '#ef4444', // 7: Debt (Red)
    '#3b82f6', // 8: Equity (Blue)
    
    '#f43f5e', // 9: CAPEX (Rose)
  ],
  // Neon Vibrante: Tech / Startup (Purples, Pinks, Cyans)
  vibrant: [
    '#c084fc', // 0: Revenue (Purple)
    '#f472b6', // 1: EBITDA (Pink)
    '#22d3ee', // 2: Lucro (Cyan)
    
    '#34d399', // 3: Cash 
    '#2dd4bf', // 4: Receivables
    '#475569', // 5: Fixed Assets
    
    '#fbbf24', // 6: Payables
    '#f87171', // 7: Debt
    '#818cf8', // 8: Equity
    
    '#facc15', // 9: CAPEX
  ],
  // Cores Pastel: Soft / Elegant
  pastel:  [
    '#f3f4f6', // 0: Revenue
    '#d1d5db', // 1: EBITDA
    '#93c5fd', // 2: Lucro
    
    '#6ee7b7', // 3: Cash
    '#a7f3d0', // 4: Receivables
    '#9ca3af', // 5: Fixed Assets
    
    '#fde047', // 6: Payables
    '#fca5a5', // 7: Debt
    '#bfdbfe', // 8: Equity
    
    '#c4b5fd', // 9: CAPEX
  ],
};

type BaseCompanyData = {
  baseYear: number;
  revenue: number;
  cash: number;
  fixedAssets: number;
  debt: number;
  payables: number;
  receivables: number;
};

const defaultCompanyData: BaseCompanyData = {
  baseYear: 2024,
  revenue: 605000,
  cash: 85200,
  fixedAssets: 190000,
  debt: 95000,
  payables: 65000,
  receivables: 45000,
};

// Build Default Scenarios
const defaultScenarios: Record<ScenarioName, Drivers> = {
  bear: { revenueGrowth: 5, grossMargin: 55, ebitdaMargin: 15, taxRate: 21, interestRate: 6, newDebt: 0, daysSales: 60, daysPayable: 45 },
  base: { revenueGrowth: 15, grossMargin: 65, ebitdaMargin: 25, taxRate: 21, interestRate: 5, newDebt: 0, daysSales: 45, daysPayable: 60 },
  bull: { revenueGrowth: 25, grossMargin: 75, ebitdaMargin: 35, taxRate: 21, interestRate: 4, newDebt: 0, daysSales: 30, daysPayable: 90 },
};

type FinancialContextProps = {
  activeScenario: ScenarioName;
  setActiveScenario: React.Dispatch<React.SetStateAction<ScenarioName>>;
  scenarios: Record<ScenarioName, Drivers>;
  updateDriver: (key: keyof Drivers, value: number) => void;
  // Valuation control
  wacc: number;
  setWacc: React.Dispatch<React.SetStateAction<number>>;
  terminalGrowth: number;
  setTerminalGrowth: React.Dispatch<React.SetStateAction<number>>;
  
  chartTheme: ChartTheme;
  setChartTheme: (theme: ChartTheme) => void;
  colors: string[];
  
  // Base Company Data
  companyData: BaseCompanyData;
  setCompanyData: React.Dispatch<React.SetStateAction<BaseCompanyData>>;
  
  // Outputs
  projections: FinancialValues[];
  valuation: ValuationOutput;
  riskStatus: RiskStatus;
  
  // Customization
  setCustomColor: (index: number, color: string) => void;
};

const FinancialContext = createContext<FinancialContextProps | undefined>(undefined);

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [activeScenario, setActiveScenario] = useState<ScenarioName>('base');
  const [scenarios, setScenarios] = useState<Record<ScenarioName, Drivers>>(defaultScenarios);
  
  const [wacc, setWacc] = useState<number>(10); // 10% defaults
  const [terminalGrowth, setTerminalGrowth] = useState<number>(2); // 2% default
  
  const [companyData, setCompanyData] = useState<BaseCompanyData>(defaultCompanyData);

  const [chartTheme, setChartTheme] = useState<ChartTheme>('classic');
  const [customColors, setCustomColors] = useState<Record<number, string>>({}); // Overrides

  const updateDriver = (key: keyof Drivers, value: number) => {
    setScenarios(prev => ({
      ...prev,
      [activeScenario]: { ...prev[activeScenario], [key]: value }
    }));
  };

  // Switch Theme handler clears custom overrides
  const handleSetChartTheme = (theme: ChartTheme) => {
      setChartTheme(theme);
      setCustomColors({}); // Reset custom overrides
  };

  const setCustomColor = (index: number, color: string) => {
      setCustomColors(prev => ({ ...prev, [index]: color }));
  };

  const activeDrivers = scenarios[activeScenario];

  const { projections, valuation, riskStatus } = useMemo(() => {
    // Generate base year + 5 projected years = 6 years total
    const years = Array.from({ length: 6 }, (_, i) => companyData.baseYear + i);
    const data: FinancialValues[] = [];

    // Historical base variables linked to User Input
    let prevRev = companyData.revenue;
    let prevDebt = companyData.debt;

    let minProjectedCash = Infinity;

    for (let i = 0; i < years.length; i++) {
        const year = years[i];
        
        // Year 0 is exactly the base year provided by the user (actuals)
        const isHistory = i === 0; 
        
        const growth = isHistory ? 0 : activeDrivers.revenueGrowth / 100;
        const margin = isHistory ? (activeDrivers.ebitdaMargin / 100) * 0.9 : activeDrivers.ebitdaMargin / 100; // Base year ebitda pseudo
        const grossM = isHistory ? (activeDrivers.grossMargin / 100) * 0.9 : activeDrivers.grossMargin / 100; // Base year margin pseudo
        const intRate = activeDrivers.interestRate / 100;
        const debtIssuance = isHistory ? 0 : activeDrivers.newDebt * 1000;

        // Income Statement
        const revenue = isHistory ? companyData.revenue : prevRev * (1 + growth);
        const grossProfit = revenue * grossM;
        const ebitda = revenue * margin;
        const depreciation = revenue * 0.05; // Simplified fixed 5% of rev
        const ebit = ebitda - depreciation;
        const interest = prevDebt * intRate;
        const ebt = ebit - interest;
        const taxes = Math.max(0, ebt * (activeDrivers.taxRate / 100));
        const netIncome = ebt - taxes;

        // Margins for Chart
        const grossMarginPercent = (grossProfit / revenue) * 100;
        const ebitdaMarginPercent = (ebitda / revenue) * 100;
        const netMarginPercent = (netIncome / revenue) * 100;

        // Working Capital (NWC) computation
        const receivables = isHistory ? companyData.receivables : revenue * (activeDrivers.daysSales / 365);
        const payables = isHistory ? companyData.payables : (revenue - grossProfit) * (activeDrivers.daysPayable / 365); 
        
        const prevReceivables = i > 0 ? data[i-1].receivables : companyData.receivables;
        const prevPayables = i > 0 ? data[i-1].payables : companyData.payables;
        
        const changeInReceivables = receivables - prevReceivables;
        const changeInPayables = payables - prevPayables;
        const changeInNWC = changeInReceivables - changeInPayables;

        // Capex & Cash Flows
        const capex = isHistory ? depreciation : depreciation + (revenue * 0.02); // Maintenance + growth

        // Unlevered FCF (FCFF): EBIT * (1-t) + Depr - changeNWC - Capex
        const ebitAfterTaxes = ebit * (1 - (activeDrivers.taxRate / 100));
        const fcff = ebitAfterTaxes + depreciation - changeInNWC - capex;

        const cashFlowFromOperating = netIncome + depreciation - changeInNWC;
        const cashFlowFromInvesting = -capex;
        const cashFlowFromFinancing = debtIssuance;
        
        // Balance Sheet
        prevDebt = isHistory ? companyData.debt : prevDebt + debtIssuance;
        const debt = prevDebt;
        
        const fixedAssets = isHistory ? companyData.fixedAssets : (i > 0 ? data[i-1].fixedAssets : companyData.fixedAssets) + capex - depreciation;
        const cash = isHistory ? companyData.cash : (i > 0 ? data[i-1].cash : companyData.cash) + cashFlowFromOperating + cashFlowFromInvesting + cashFlowFromFinancing;
        
        if (!isHistory && cash < minProjectedCash) {
            minProjectedCash = cash;
        }

        const totalAssets = cash + receivables + fixedAssets;
        const totalLiabilities = payables + debt;
        
        // Plug equity to balance Assets - Liabilities automatically for perfectly balanced sheet
        const equity = totalAssets - totalLiabilities;

        data.push({
            year,
            revenue,
            grossProfit,
            ebitda,
            depreciation,
            ebit,
            interest,
            ebt,
            taxes,
            netIncome,
            grossMarginPercent,
            ebitdaMarginPercent,
            netMarginPercent,
            cash,
            fcf: cashFlowFromOperating + cashFlowFromInvesting, // FCF is Operating + Investing
            fcfToFirm: fcff, // used in valuation
            capex,
            receivables,
            payables,
            changeInNWC,
            fixedAssets,
            debt,
            equity,
            totalAssets,
            totalLiabilitiesAndEquity: totalLiabilities + equity
        });

        // Update prev values for next loop iteration
        prevRev = revenue;
        prevDebt = debt;
    }

    // DCF Calculation
    let pvOfFCFF = 0;
    const waccRate = wacc / 100;
    const tgRate = terminalGrowth / 100;

    let terminalFCF = 0;
    let lastDiscountFactor = 1;

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.year > companyData.baseYear) {
            const t = item.year - companyData.baseYear; // Year 1 to 5
            const df = Math.pow(1 + waccRate, t);
            pvOfFCFF += item.fcfToFirm / df;
            
            if (t === 5) {
              terminalFCF = item.fcfToFirm;
              lastDiscountFactor = df;
            }
        }
    }

    // Terminal Value logic (Gordon Growth)
    const tv = (terminalFCF * (1 + tgRate)) / (waccRate - tgRate);
    const pvOfTV = tv / lastDiscountFactor;

    const enterpriseValue = pvOfFCFF + pvOfTV;
    const netDebtBase = data.find(d => d.year === companyData.baseYear)!; 
    // Equity Value = EV - Net Debt. Net Debt = Debt - Cash
    const equityValue = enterpriseValue - (netDebtBase.debt - netDebtBase.cash);

    let calculatedRiskStatus: RiskStatus = 'Seguro';
    if (minProjectedCash < 0) {
        calculatedRiskStatus = 'Rutura';
    } else if (minProjectedCash < 20000) { // e.g. arbitrary small buffer
        calculatedRiskStatus = 'Alerta';
    }

    return {
        projections: data,
        valuation: {
            pvOfFCFF,
            terminalValue: tv,
            pvOfTerminalValue: pvOfTV,
            enterpriseValue,
            equityValue
        },
        riskStatus: calculatedRiskStatus
    };
  }, [activeDrivers, wacc, terminalGrowth, companyData]);

  // Resolve final colors
  const baseColors = CHART_PALETTES[chartTheme];
  const resolvedColors = baseColors.map((col, idx) => customColors[idx] || col);

  return (
    <FinancialContext.Provider value={{ 
        activeScenario, setActiveScenario, scenarios, updateDriver, 
        wacc, setWacc, terminalGrowth, setTerminalGrowth, 
        projections, valuation, riskStatus,
        chartTheme, setChartTheme: handleSetChartTheme, setCustomColor, colors: resolvedColors,
        companyData, setCompanyData
    }}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) throw new Error('useFinancial must be used within FinancialProvider');
  return context;
}
