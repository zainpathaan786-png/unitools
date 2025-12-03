
import React, { useState, useEffect } from 'react';
import { ToolDefinition, ToolID } from '../../types';

interface Props {
  tool: ToolDefinition;
}

const CURRENCIES = [
  { code: 'USD', name: 'United States Dollar', symbol: '$', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£', rate: 0.79 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.5 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 151.2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.23 },
];

const KeywordsBox = ({ keywords }: { keywords: string[] }) => (
    <div className="mt-8 p-6 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl">
        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Related Keywords</h4>
        <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
                <span key={i} className="text-xs font-medium bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-600">
                    {kw}
                </span>
            ))}
        </div>
    </div>
);

// Base keywords that must be included in all tools
const BASE_KEYWORDS = ['financial calculators', 'investment tools', 'debt management', 'retirement planning', 'roi calculator', 'cagr calculator', 'net worth tracker', 'financial independence', 'business math', 'profit margin', 'currency converter', 'inflation calculator', 'money management tools', 'free finance tools'];

export const FinancialCalculatorTool: React.FC<Props> = ({ tool }) => {
  // Primary Inputs
  const [investment, setInvestment] = useState<number>(10000); // Also serves as Principal, Cost, Income, etc.
  const [rate, setRate] = useState<number>(10);
  const [years, setYears] = useState<number>(5);
  
  // Secondary Inputs
  const [withdrawal, setWithdrawal] = useState<number>(500); 
  const [stepUp, setStepUp] = useState<number>(10); 
  const [finalValue, setFinalValue] = useState<number>(20000); 
  const [cashFlows, setCashFlows] = useState<string>('-1000, 200, 300, 400, 500'); 
  const [salvageValue, setSalvageValue] = useState<number>(1000); 

  // Currency Specific
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('INR');
  
  // GST Specific
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    setResult(null);
    setInvestment(10000);
    setRate(10);
    setYears(5);
    setWithdrawal(500);
    setStepUp(10);
    setFinalValue(20000);
    setCashFlows('-10000, 3000, 4000, 5000, 6000');
    setSalvageValue(1000);

    // Set smart defaults based on tool type
    if (tool.id === ToolID.GST_CALCULATOR) { setRate(18); setGstType('exclusive'); }
    if (tool.id === ToolID.VAT_CALCULATOR) { setRate(20); }
    if (tool.id === ToolID.BILL_SPLITTER || tool.id === ToolID.TIP_CALCULATOR) { setInvestment(100); setRate(15); setYears(2); }
    if (tool.id === ToolID.DEBT_TO_INCOME_RATIO_CALCULATOR) { setInvestment(5000); setWithdrawal(1500); }
    if (tool.id === ToolID.MORTGAGE_CALCULATOR) { setInvestment(250000); setRate(4.5); setYears(30); }
    if (tool.id === ToolID.DISCOUNT_CALCULATOR) { setInvestment(100); setRate(20); }
    if (tool.id === ToolID.CREDIT_CARD_PAYOFF_CALCULATOR) { setInvestment(2000); setRate(18); setWithdrawal(100); }
    if (tool.id === ToolID.STOCK_PROFIT_CALCULATOR) { setInvestment(100); setFinalValue(150); setYears(10); setRate(5); }
    if (tool.id === ToolID.BREAK_EVEN_CALCULATOR) { setInvestment(5000); setWithdrawal(20); setFinalValue(50); }
    if (tool.id === ToolID.AUTO_LOAN_CALCULATOR) { setInvestment(30000); setWithdrawal(5000); setRate(5); setYears(5); setStepUp(7); }
    if (tool.id === ToolID.RETIREMENT_CORPUS_CALCULATOR) { setInvestment(5000); setRate(6); setYears(30); }
    if (tool.id === ToolID.RENT_VS_BUY_CALCULATOR) { setInvestment(300000); setWithdrawal(1500); setYears(5); setRate(4.5); setStepUp(3); }
    if (tool.id === ToolID.HOURLY_TO_SALARY_CALCULATOR) { setInvestment(25); setRate(40); }
    if (tool.id === ToolID.EMERGENCY_FUND_CALCULATOR) { setInvestment(3000); setYears(6); }
    if (tool.id === ToolID.CAP_RATE_CALCULATOR) { setInvestment(500000); setWithdrawal(35000); }
    if (tool.id === ToolID.RULE_OF_72_CALCULATOR) { setRate(7); }
    if (tool.id === ToolID.DIVIDEND_YIELD_CALCULATOR) { setInvestment(150); setWithdrawal(5); }
    if (tool.id === ToolID.NPV_CALCULATOR) { setInvestment(10000); setRate(10); setCashFlows('2000, 3000, 4000, 5000'); }
    if (tool.id === ToolID.NET_WORTH_CALCULATOR) { setInvestment(150000); setWithdrawal(50000); }
    if (tool.id === ToolID.FIRE_CALCULATOR) { setInvestment(100000); setWithdrawal(40000); setStepUp(20000); setRate(7); }
    if (tool.id === ToolID.INTEREST_RATE_CALCULATOR) { setInvestment(10000); setFinalValue(15000); setYears(5); }
    if (tool.id === ToolID.BOND_CALCULATOR) { setInvestment(1000); setRate(5); setFinalValue(950); setYears(5); }
    if (tool.id === ToolID.IRR_CALCULATOR) { setInvestment(10000); setCashFlows('3000, 3500, 4000, 4500'); }
    if (tool.id === ToolID.PAYBACK_PERIOD_CALCULATOR) { setInvestment(50000); setWithdrawal(10000); }
    if (tool.id === ToolID.GDP_CALCULATOR) { setInvestment(15000); setRate(4000); setYears(3500); setWithdrawal(2500); setStepUp(3000); }
  }, [tool.id]);

  // IRR Approximation Helper
  const calculateIRR = (flows: number[]) => {
      let guess = 0.1;
      const maxIter = 100;
      const tol = 0.00001;
      for (let i = 0; i < maxIter; i++) {
          let npv = 0;
          let d_npv = 0;
          for (let t = 0; t < flows.length; t++) {
              const val = flows[t];
              const denom = Math.pow(1 + guess, t);
              npv += val / denom;
              d_npv -= (t * val) / (denom * (1 + guess));
          }
          if (Math.abs(d_npv) < 0.0000001) return guess * 100;
          const newGuess = guess - (npv / d_npv);
          if (Math.abs(newGuess - guess) < tol) return newGuess * 100;
          guess = newGuess;
      }
      return guess * 100;
  };

  const calculate = () => {
      let res: any = null;
      const i = rate / 100;
      
      if (tool.id === ToolID.HOURLY_TO_SALARY_CALCULATOR) {
          const annual = investment * rate * 52;
          res = { value: Math.round(annual).toLocaleString(), unit: '/ year', note: 'Annual Salary', extras: [{ label: 'Monthly', val: Math.round(annual/12).toLocaleString() }] };
      }
      else if (tool.id === ToolID.EMERGENCY_FUND_CALCULATOR) {
          res = { value: (investment * years).toLocaleString(), unit: '', note: `Fund for ${years} Months` };
      }
      else if (tool.id === ToolID.CAP_RATE_CALCULATOR) {
          res = { value: ((withdrawal / investment) * 100).toFixed(2), unit: '%', note: 'Cap Rate' };
      }
      else if (tool.id === ToolID.RULE_OF_72_CALCULATOR) {
          res = { value: (72 / rate).toFixed(1), unit: 'years', note: 'Time to Double' };
      }
      else if (tool.id === ToolID.DIVIDEND_YIELD_CALCULATOR) {
          res = { value: ((withdrawal / investment) * 100).toFixed(2), unit: '%', note: 'Dividend Yield' };
      }
      else if (tool.id === ToolID.NPV_CALCULATOR) {
          const flows = cashFlows.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
          let presentValueSum = 0;
          flows.forEach((cf, index) => { presentValueSum += cf / Math.pow(1 + i, index + 1); });
          const npv = presentValueSum - investment;
          res = { value: npv.toFixed(2), unit: '', note: 'Net Present Value' };
      }
      else if (tool.id === ToolID.NET_WORTH_CALCULATOR) {
          res = { value: (investment - withdrawal).toLocaleString(), unit: '', note: 'Net Worth', extras: [{label: 'Assets', val: investment}, {label: 'Liabilities', val: withdrawal}] };
      }
      else if (tool.id === ToolID.FIRE_CALCULATOR) {
          const fireNum = withdrawal * 25;
          let curr = investment, yrs = 0;
          while (curr < fireNum && yrs < 100) { curr = (curr + stepUp) * (1 + i); yrs++; }
          res = { value: yrs >= 100 ? '100+' : yrs, unit: 'years', note: 'Time to FIRE', extras: [{label: 'Goal', val: fireNum.toLocaleString()}] };
      }
      else if (tool.id === ToolID.MORTGAGE_CALCULATOR || tool.id === ToolID.LOAN_CALCULATOR || tool.id === ToolID.EMI_CALCULATOR || tool.id === ToolID.AUTO_LOAN_CALCULATOR) {
          let principal = investment;
          if(tool.id === ToolID.AUTO_LOAN_CALCULATOR) {
              principal = investment + (investment * stepUp / 100) - withdrawal;
          }
          const monthlyRate = i / 12;
          const months = years * 12;
          const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
          const totalPay = emi * months;
          res = { value: Math.round(emi), unit: '/ month', note: 'Monthly Payment', extras: [{label: 'Total Payment', val: Math.round(totalPay)}, {label: 'Total Interest', val: Math.round(totalPay - principal)}] };
      }
      else if (tool.id === ToolID.DISCOUNT_CALCULATOR) {
          const saved = (investment * rate) / 100;
          res = { value: (investment - saved).toFixed(2), unit: '', note: 'Final Price', extras: [{label: 'Saved', val: saved.toFixed(2)}] };
      }
      else if (tool.id === ToolID.CREDIT_CARD_PAYOFF_CALCULATOR) {
          const mr = i / 12;
          if (withdrawal <= investment * mr) res = { value: "Never", unit: "", note: "Payment too low" };
          else {
              const m = -Math.log(1 - (mr * investment) / withdrawal) / Math.log(1 + mr);
              res = { value: Math.ceil(m), unit: 'months', note: 'Time to Payoff' };
          }
      }
      else if (tool.id === ToolID.STOCK_PROFIT_CALCULATOR) {
          const profit = (finalValue * years) - (investment * years) - rate;
          res = { value: profit.toFixed(2), unit: '', note: 'Total Profit' };
      }
      else if (tool.id === ToolID.BREAK_EVEN_CALCULATOR) {
          const margin = finalValue - withdrawal;
          res = { value: margin > 0 ? Math.ceil(investment / margin) : 'N/A', unit: 'units', note: 'Break-Even Units' };
      }
      else if (tool.id === ToolID.RETIREMENT_CORPUS_CALCULATOR) {
          const fExp = investment * Math.pow(1 + (rate/100), years);
          res = { value: Math.round(fExp * 12 * 25), unit: '', note: 'Required Corpus' };
      }
      else if (tool.id === ToolID.RENT_VS_BUY_CALCULATOR) {
          // Simplified Logic
          const buyCost = investment * 1.05; // +5% closing
          const rentCost = withdrawal * 12 * years * 1.1; // +10% inflation estimate
          res = { value: Math.abs(Math.round(buyCost - rentCost)), unit: '', note: buyCost > rentCost ? 'Renting is cheaper' : 'Buying is cheaper' };
      }
      else if (tool.id === ToolID.BILL_SPLITTER || tool.id === ToolID.TIP_CALCULATOR) {
          const tip = (investment * rate) / 100;
          const total = investment + tip;
          if (tool.id === ToolID.TIP_CALCULATOR) res = { value: tip.toFixed(2), unit: '', note: 'Tip Amount', extras: [{label: 'Total Bill', val: total.toFixed(2)}] };
          else res = { value: (total / (years || 1)).toFixed(2), unit: '', note: 'Per Person', extras: [{label: 'Total Bill', val: total.toFixed(2)}] };
      }
      else if (tool.id === ToolID.VAT_CALCULATOR || tool.id === ToolID.GST_CALCULATOR) {
          const isInc = gstType === 'inclusive';
          const tax = isInc ? investment - (investment / (1 + i)) : investment * i;
          const total = isInc ? investment : investment + tax;
          const net = isInc ? investment - tax : investment;
          res = { value: tax.toFixed(2), unit: '', note: 'Tax Amount', extras: [{label: 'Net Amount', val: net.toFixed(2)}, {label: 'Gross Amount', val: total.toFixed(2)}] };
      }
      else if (tool.id === ToolID.GDP_CALCULATOR) {
          // C + I + G + (X - M)
          // investment(C) + rate(I) + years(G) + (withdrawal(X) - stepUp(M))
          res = { value: (investment + rate + years + (withdrawal - stepUp)).toLocaleString(), unit: '', note: 'GDP (C+I+G+(X-M))' };
      }
      else if (tool.id === ToolID.DEBT_TO_INCOME_RATIO_CALCULATOR) {
          res = { value: ((withdrawal / investment) * 100).toFixed(2), unit: '%', note: 'DTI Ratio' };
      }
      else if (tool.id === ToolID.SIP_CALCULATOR || tool.id === ToolID.RD_CALCULATOR || tool.id === ToolID.STEP_UP_SIP_CALCULATOR) {
          // SIP / RD Logic
          let total = 0, inv = 0;
          let monthlyInv = investment;
          const mr = i / 12;
          for(let m=0; m<years*12; m++) {
              if (tool.id === ToolID.STEP_UP_SIP_CALCULATOR && m > 0 && m % 12 === 0) monthlyInv *= (1 + stepUp/100);
              total = (total + monthlyInv) * (1 + mr);
              inv += monthlyInv;
          }
          res = { value: Math.round(total), unit: '', note: 'Maturity Value', extras: [{label: 'Invested', val: Math.round(inv)}] };
      }
      else if (tool.id === ToolID.LUMPSUM_CALCULATOR || tool.id === ToolID.FD_CALCULATOR || tool.id === ToolID.CD_CALCULATOR || tool.id === ToolID.COMPOUND_INTEREST_CALCULATOR || tool.id === ToolID.PPF_CALCULATOR || tool.id === ToolID.INFLATION_CALCULATOR || tool.id === ToolID.FUTURE_VALUE_CALCULATOR || tool.id === ToolID.INVESTMENT_CALCULATOR || tool.id === ToolID.SAVINGS_CALCULATOR) {
          const val = investment * Math.pow(1 + (tool.id === ToolID.PPF_CALCULATOR ? 0.071 : i), years);
          res = { value: Math.round(val), unit: '', note: tool.id === ToolID.INFLATION_CALCULATOR ? 'Future Cost' : 'Maturity Value' };
      }
      else if (tool.id === ToolID.SIMPLE_INTEREST_CALCULATOR) {
          const si = (investment * rate * years) / 100;
          res = { value: Math.round(investment + si), unit: '', note: 'Total Amount', extras: [{label: 'Interest', val: Math.round(si)}] };
      }
      else if (tool.id === ToolID.ROI_CALCULATOR) {
          res = { value: (((finalValue - investment) / investment) * 100).toFixed(2), unit: '%', note: 'ROI' };
      }
      else if (tool.id === ToolID.CAGR_CALCULATOR) {
          res = { value: ((Math.pow(finalValue / investment, 1 / years) - 1) * 100).toFixed(2), unit: '%', note: 'CAGR' };
      }
      else if (tool.id === ToolID.CURRENCY_CONVERTER) {
          const f = CURRENCIES.find(c => c.code === fromCurrency)?.rate || 1;
          const t = CURRENCIES.find(c => c.code === toCurrency)?.rate || 1;
          res = { value: ((investment / f) * t).toFixed(2), unit: toCurrency, note: 'Converted Amount' };
      }
      else if (tool.id === ToolID.DEPRECIATION_CALCULATOR) {
          res = { value: Math.round((investment - salvageValue) / years), unit: '/ year', note: 'Straight Line Dep.' };
      }
      else if (tool.id === ToolID.COMMISSION_CALCULATOR) {
          res = { value: (investment * rate / 100).toFixed(2), unit: '', note: 'Commission' };
      }
      else if (tool.id === ToolID.MARGIN_CALCULATOR) {
          const sp = investment / (1 - i);
          res = { value: sp.toFixed(2), unit: '', note: 'Selling Price', extras: [{label: 'Profit', val: (sp - investment).toFixed(2)}] };
      }
      else if (tool.id === ToolID.SWP_CALCULATOR) {
          const mr = i / 12;
          let bal = investment;
          for(let m=0; m<years*12; m++) bal = bal * (1 + mr) - withdrawal;
          res = { value: Math.max(0, Math.round(bal)), unit: '', note: 'Final Balance' };
      }
      else if (tool.id === ToolID.PRESENT_VALUE_CALCULATOR) {
          res = { value: Math.round(finalValue / Math.pow(1 + i, years)), unit: '', note: 'Present Value' };
      }
      else if (tool.id === ToolID.INCOME_TAX_CALCULATOR) {
          let tax = 0;
          if (investment > 300000) tax += (Math.min(investment, 600000) - 300000) * 0.05;
          if (investment > 600000) tax += (Math.min(investment, 900000) - 600000) * 0.10;
          if (investment > 900000) tax += (Math.min(investment, 1200000) - 900000) * 0.15;
          if (investment > 1200000) tax += (Math.min(investment, 1500000) - 1200000) * 0.20;
          if (investment > 1500000) tax += (investment - 1500000) * 0.30;
          res = { value: Math.round(tax), unit: '', note: 'Est. Tax (New Regime)' };
      }
      else if (tool.id === ToolID.AVERAGE_RETURN_CALCULATOR) {
          res = { value: (((finalValue - investment) / investment / years) * 100).toFixed(2), unit: '%', note: 'Avg Annual Return' };
      }
      else if (tool.id === ToolID.INTEREST_RATE_CALCULATOR) {
          if (investment > 0 && years > 0) {
              const r = (Math.pow(finalValue / investment, 1 / years) - 1) * 100;
              res = { value: r.toFixed(2), unit: '%', note: 'Required Rate' };
          }
      }
      else if (tool.id === ToolID.BOND_CALCULATOR) {
          const annualCoup = investment * (rate / 100);
          const cy = (annualCoup / finalValue) * 100;
          res = { value: cy.toFixed(2), unit: '%', note: 'Current Yield' };
      }
      else if (tool.id === ToolID.IRR_CALCULATOR) {
          const flows = cashFlows.split(',').map(s => parseFloat(s.trim()));
          const fullFlows = [-investment, ...flows];
          const irr = calculateIRR(fullFlows);
          res = { value: irr.toFixed(2), unit: '%', note: 'Internal Rate of Return' };
      }
      else if (tool.id === ToolID.PAYBACK_PERIOD_CALCULATOR) {
          res = { value: (investment / withdrawal).toFixed(1), unit: 'years', note: 'Payback Period' };
      }
      else if (tool.id === ToolID.INTEREST_CALCULATOR) {
          const s = (investment * rate * years) / 100;
          res = { value: s.toFixed(2), unit: '', note: 'Simple Interest Amount' };
      }

      setResult(res);
  };

  // Helper to determine which inputs to show
  const showInput = (type: 'principal' | 'rate' | 'years' | 'withdrawal' | 'stepup' | 'final' | 'salvage' | 'cashflows') => {
      const t = tool.id;
      if (type === 'principal') {
          // Rule of 72 uses rate only (72/rate), principal is irrelevant for the calculation result
          if (t === ToolID.RULE_OF_72_CALCULATOR) return false;
          return true; 
      }
      
      if (type === 'rate') return ![ToolID.INCOME_TAX_CALCULATOR, ToolID.PAYBACK_PERIOD_CALCULATOR, ToolID.ROI_CALCULATOR, ToolID.CAGR_CALCULATOR, ToolID.DEPRECIATION_CALCULATOR, ToolID.DEBT_TO_INCOME_RATIO_CALCULATOR, ToolID.HOURLY_TO_SALARY_CALCULATOR, ToolID.EMERGENCY_FUND_CALCULATOR, ToolID.CAP_RATE_CALCULATOR, ToolID.DIVIDEND_YIELD_CALCULATOR, ToolID.NET_WORTH_CALCULATOR, ToolID.INTEREST_RATE_CALCULATOR, ToolID.IRR_CALCULATOR, ToolID.RENT_VS_BUY_CALCULATOR].includes(t);
      
      if (type === 'years') return ![ToolID.MARGIN_CALCULATOR, ToolID.COMMISSION_CALCULATOR, ToolID.VAT_CALCULATOR, ToolID.DISCOUNT_CALCULATOR, ToolID.GST_CALCULATOR, ToolID.CURRENCY_CONVERTER, ToolID.DEBT_TO_INCOME_RATIO_CALCULATOR, ToolID.INCOME_TAX_CALCULATOR, ToolID.HOURLY_TO_SALARY_CALCULATOR, ToolID.CAP_RATE_CALCULATOR, ToolID.DIVIDEND_YIELD_CALCULATOR, ToolID.NET_WORTH_CALCULATOR, ToolID.BREAK_EVEN_CALCULATOR, ToolID.IRR_CALCULATOR, ToolID.PAYBACK_PERIOD_CALCULATOR, ToolID.TIP_CALCULATOR, ToolID.FIRE_CALCULATOR, ToolID.ROI_CALCULATOR, ToolID.BOND_CALCULATOR].includes(t);
      
      if (type === 'withdrawal') return [ToolID.SWP_CALCULATOR, ToolID.DEBT_TO_INCOME_RATIO_CALCULATOR, ToolID.CREDIT_CARD_PAYOFF_CALCULATOR, ToolID.AUTO_LOAN_CALCULATOR, ToolID.RENT_VS_BUY_CALCULATOR, ToolID.CAP_RATE_CALCULATOR, ToolID.DIVIDEND_YIELD_CALCULATOR, ToolID.NET_WORTH_CALCULATOR, ToolID.FIRE_CALCULATOR, ToolID.PAYBACK_PERIOD_CALCULATOR, ToolID.GDP_CALCULATOR, ToolID.BREAK_EVEN_CALCULATOR].includes(t);
      
      if (type === 'stepup') return [ToolID.STEP_UP_SIP_CALCULATOR, ToolID.AUTO_LOAN_CALCULATOR, ToolID.FIRE_CALCULATOR, ToolID.GDP_CALCULATOR].includes(t);
      
      if (type === 'final') return [ToolID.ROI_CALCULATOR, ToolID.CAGR_CALCULATOR, ToolID.AVERAGE_RETURN_CALCULATOR, ToolID.PRESENT_VALUE_CALCULATOR, ToolID.STOCK_PROFIT_CALCULATOR, ToolID.BREAK_EVEN_CALCULATOR, ToolID.INTEREST_RATE_CALCULATOR, ToolID.BOND_CALCULATOR].includes(t);
      
      if (type === 'salvage') return t === ToolID.DEPRECIATION_CALCULATOR;
      
      if (type === 'cashflows') return [ToolID.NPV_CALCULATOR, ToolID.IRR_CALCULATOR].includes(t);
      
      return false;
  };

  const getSEOContent = () => {
    if ([ToolID.LOAN_CALCULATOR, ToolID.MORTGAGE_CALCULATOR, ToolID.AUTO_LOAN_CALCULATOR, ToolID.EMI_CALCULATOR].includes(tool.id)) {
        return (
            <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Loan & Mortgage Calculators</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Planning to borrow money? Our <strong>loan calculator</strong> and <strong>mortgage calculator</strong> helps you understand the financial commitment. Calculate <strong>monthly installments</strong> (EMI) and total interest. The <strong>auto loan calculator</strong> helps you budget for vehicles.
                </p>
                <KeywordsBox keywords={[...BASE_KEYWORDS, 'loan calculator', 'mortgage calculator', 'auto loan calculator', 'monthly installments', 'amortization schedule', 'loan repayment', 'borrowing cost', 'interest rate calculator', 'personal loan calculator', 'debt payoff planner']} />
            </>
        );
    }
    // ... other SEO content can remain default or be expanded as needed ...
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 md:p-8 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg border-b border-gray-100 dark:border-slate-700 pb-2 mb-4">
                      Parameters
                  </h3>
                  
                  <div className="space-y-4">
                      {/* Investment / Principal / Base Amount */}
                      {showInput('principal') && (
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  {tool.id === ToolID.LOAN_CALCULATOR || tool.id === ToolID.MORTGAGE_CALCULATOR ? 'Loan Amount' : 
                                   tool.id === ToolID.SIP_CALCULATOR ? 'Monthly Investment' : 
                                   tool.id === ToolID.HOURLY_TO_SALARY_CALCULATOR ? 'Hourly Rate' :
                                   tool.id === ToolID.EMERGENCY_FUND_CALCULATOR ? 'Monthly Expenses' :
                                   tool.id === ToolID.CAP_RATE_CALCULATOR ? 'Property Value' :
                                   tool.id === ToolID.NET_WORTH_CALCULATOR ? 'Total Assets' :
                                   tool.id === ToolID.BOND_CALCULATOR ? 'Face Value' :
                                   tool.id === ToolID.GDP_CALCULATOR ? 'Consumption (C)' :
                                   tool.id === ToolID.BILL_SPLITTER || tool.id === ToolID.TIP_CALCULATOR ? 'Bill Amount' :
                                   tool.id === ToolID.VAT_CALCULATOR || tool.id === ToolID.GST_CALCULATOR ? 'Net/Gross Amount' :
                                   tool.id === ToolID.STOCK_PROFIT_CALCULATOR ? 'Buy Price' :
                                   'Amount / Principal'}
                              </label>
                              <input type="number" value={investment} onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                      )}

                      {/* Rate */}
                      {showInput('rate') && (
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  {tool.id === ToolID.HOURLY_TO_SALARY_CALCULATOR ? 'Hours per Week' : 
                                   tool.id === ToolID.BOND_CALCULATOR ? 'Coupon Rate (%)' :
                                   tool.id === ToolID.GDP_CALCULATOR ? 'Investment (I)' :
                                   tool.id === ToolID.BILL_SPLITTER || tool.id === ToolID.TIP_CALCULATOR ? 'Tip Percentage (%)' :
                                   tool.id === ToolID.VAT_CALCULATOR ? 'VAT Rate (%)' :
                                   tool.id === ToolID.GST_CALCULATOR ? 'GST Rate (%)' :
                                   tool.id === ToolID.STOCK_PROFIT_CALCULATOR ? 'Total Commissions' :
                                   'Rate (%)'}
                              </label>
                              <input type="number" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                      )}

                      {/* Years / Time */}
                      {showInput('years') && (
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  {tool.id === ToolID.BILL_SPLITTER ? 'Number of People' :
                                   tool.id === ToolID.STOCK_PROFIT_CALCULATOR ? 'Number of Shares' :
                                   tool.id === ToolID.EMERGENCY_FUND_CALCULATOR ? 'Months to Cover' :
                                   tool.id === ToolID.GDP_CALCULATOR ? 'Gov. Spending (G)' :
                                   'Time Period (Years)'}
                              </label>
                              <input type="number" value={years} onChange={(e) => setYears(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                      )}

                      {/* Withdrawal / Income / Liabilities / Cash Flow */}
                      {showInput('withdrawal') && (
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  {tool.id === ToolID.NET_WORTH_CALCULATOR ? 'Total Liabilities' : 
                                   tool.id === ToolID.CAP_RATE_CALCULATOR ? 'Net Operating Income (Annual)' :
                                   tool.id === ToolID.DIVIDEND_YIELD_CALCULATOR ? 'Annual Dividend' :
                                   tool.id === ToolID.PAYBACK_PERIOD_CALCULATOR ? 'Annual Cash Flow' :
                                   tool.id === ToolID.BREAK_EVEN_CALCULATOR ? 'Variable Cost per Unit' :
                                   tool.id === ToolID.GDP_CALCULATOR ? 'Exports (X)' :
                                   tool.id === ToolID.RENT_VS_BUY_CALCULATOR ? 'Monthly Rent' :
                                   'Withdrawal / Income / Cost'}
                              </label>
                              <input type="number" value={withdrawal} onChange={(e) => setWithdrawal(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                      )}

                      {/* Step Up / Tax / Imports */}
                      {showInput('stepup') && (
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  {tool.id === ToolID.STEP_UP_SIP_CALCULATOR ? 'Annual Step Up (%)' :
                                   tool.id === ToolID.AUTO_LOAN_CALCULATOR ? 'Sales Tax (%)' :
                                   tool.id === ToolID.GDP_CALCULATOR ? 'Imports (M)' :
                                   tool.id === ToolID.FIRE_CALCULATOR ? 'Annual Savings' :
                                   'Step Up Value'}
                              </label>
                              <input type="number" value={stepUp} onChange={(e) => setStepUp(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                      )}

                      {/* Final Value / Target / Price */}
                      {showInput('final') && (
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  {tool.id === ToolID.STOCK_PROFIT_CALCULATOR || tool.id === ToolID.BREAK_EVEN_CALCULATOR ? 'Selling Price' :
                                   tool.id === ToolID.BOND_CALCULATOR ? 'Current Market Price' :
                                   'Final / Target Value'}
                              </label>
                              <input type="number" value={finalValue} onChange={(e) => setFinalValue(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                      )}

                      {/* Cash Flows */}
                      {showInput('cashflows') && (
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cash Flows (comma separated, Year 1 onwards)</label>
                              <textarea value={cashFlows} onChange={(e) => setCashFlows(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24" />
                          </div>
                      )}

                      {/* Salvage */}
                      {showInput('salvage') && (
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Salvage Value</label>
                              <input type="number" value={salvageValue} onChange={(e) => setSalvageValue(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                      )}

                      {/* Special: GST/VAT Type */}
                      {(tool.id === ToolID.GST_CALCULATOR || tool.id === ToolID.VAT_CALCULATOR) && (
                          <div className="flex gap-4 pt-2">
                              <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                                  <input type="radio" checked={gstType === 'exclusive'} onChange={() => setGstType('exclusive')} /> Exclusive
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                                  <input type="radio" checked={gstType === 'inclusive'} onChange={() => setGstType('inclusive')} /> Inclusive
                              </label>
                          </div>
                      )}
                      
                      {/* Special: Currency */}
                      {tool.id === ToolID.CURRENCY_CONVERTER && (
                          <div className="grid grid-cols-2 gap-4">
                              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:text-white">{CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}</select>
                              <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:text-white">{CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}</select>
                          </div>
                      )}
                  </div>

                  <button 
                      onClick={calculate}
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-blue-700 transition mt-4"
                  >
                      Calculate
                  </button>
              </div>

              {/* Result Area */}
              <div className="bg-blue-50 dark:bg-slate-900/50 rounded-xl p-8 flex flex-col justify-center items-center text-center relative border border-blue-100 dark:border-slate-700 h-full min-h-[300px]">
                  {!result ? (
                      <div className="text-gray-500 dark:text-gray-400">
                          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          </div>
                          <p>Enter values to calculate</p>
                      </div>
                  ) : (
                      <div className="w-full animate-fadeIn">
                          <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">{result.note}</p>
                          <h2 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
                              {typeof result.value === 'number' ? Number(result.value).toLocaleString() : result.value} <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">{result.unit}</span>
                          </h2>
                          
                          {result.extras && (
                              <div className="mt-6 pt-6 border-t border-blue-200 dark:border-slate-700 w-full">
                                  <div className="grid grid-cols-2 gap-4">
                                      {result.extras.map((extra: any, idx: number) => (
                                          <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                                              <div className="text-xs text-gray-500 uppercase font-bold">{extra.label}</div>
                                              <div className="text-lg font-bold text-gray-800 dark:text-white">
                                                  {typeof extra.val === 'number' ? Number(extra.val).toLocaleString() : extra.val}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      </div>

      <div className="mt-16 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
         {getSEOContent()}
      </div>
    </div>
  );
};
