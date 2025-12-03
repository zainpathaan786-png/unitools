
import React, { useState, useEffect } from 'react';
import { ToolDefinition, ToolID } from '../../types';

interface Props {
  tool: ToolDefinition;
}

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

const InputField = ({ label, val, setVal }: { label: string, val: string, setVal: (s: string) => void }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <input 
            type="number" 
            value={val} 
            onChange={(e) => setVal(e.target.value)} 
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0"
        />
    </div>
);

export const MathScienceCalculatorTool: React.FC<Props> = ({ tool }) => {
  // Generic State (using strings to allow easier decimal/zero typing)
  const [val1, setVal1] = useState<string>('');
  const [val2, setVal2] = useState<string>('');
  const [val3, setVal3] = useState<string>('');
  const [val4, setVal4] = useState<string>('');
  
  const [shape, setShape] = useState<string>('rectangle');
  
  // New States for added tools
  const [listInput, setListInput] = useState(''); // For Statistics
  const [mode, setMode] = useState<string>(''); // For multi-mode tools
  const [fractionOp, setFractionOp] = useState<string>('+');

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    setResult(null);
    setVal1('');
    setVal2('');
    setVal3('');
    setVal4('');
    setListInput('');
    setFractionOp('+');
    
    // Default shape setup
    if (tool.id === ToolID.VOLUME_CALCULATOR || tool.id === ToolID.SURFACE_AREA_CALCULATOR) {
        setShape('cube');
    } else if (tool.id === ToolID.AREA_CALCULATOR) {
        setShape('rectangle');
    }

    // Default modes
    if (tool.id === ToolID.PERCENTAGE_CALCULATOR) setMode('what_is');
    if (tool.id === ToolID.FORCE_CALCULATOR) setMode('force');
    if (tool.id === ToolID.OHMS_LAW_CALCULATOR) setMode('voltage');

  }, [tool.id]);

  const gcd = (a: number, b: number): number => {
      return !b ? a : gcd(b, a % b);
  };

  const isPrime = (num: number) => {
      if (num <= 1) return false;
      if (num <= 3) return true;
      if (num % 2 === 0 || num % 3 === 0) return false;
      for (let i = 5; i * i <= num; i += 6) {
          if (num % i === 0 || num % (i + 2) === 0) return false;
      }
      return true;
  };

  const getPrimeFactors = (n: number) => {
      const factors = [];
      let d = 2;
      let temp = n;
      while (d * d <= temp) {
          while (temp % d === 0) {
              factors.push(d);
              temp /= d;
          }
          d++;
      }
      if (temp > 1) factors.push(temp);
      return factors;
  };

  const factorial = (n: number): number => {
      if (n < 0) return 0;
      if (n === 0 || n === 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) result *= i;
      return result;
  };

  const calculate = () => {
      let res: any = null;
      
      // Parse inputs safely
      const v1 = parseFloat(val1) || 0;
      const v2 = parseFloat(val2) || 0;
      const v3 = parseFloat(val3) || 0;
      const v4 = parseFloat(val4) || 0;

      // --- NEW TOOLS ---

      if (tool.id === ToolID.PERCENTAGE_CALCULATOR) {
          if (mode === 'what_is') {
              // What is X% of Y?
              res = { value: (v1 * v2) / 100, unit: '', note: `${v1}% of ${v2}` };
          } else if (mode === 'is_what') {
              // X is what % of Y?
              if(v2 === 0) res = { value: 'Error', unit: '', note: 'Divide by zero' };
              else res = { value: ((v1 / v2) * 100).toFixed(2), unit: '%', note: `${v1} is ... of ${v2}` };
          } else if (mode === 'increase') {
              // % change from X to Y
              if(v1 === 0) res = { value: 'Error', unit: '', note: 'Start value cannot be zero' };
              else {
                  const diff = v2 - v1;
                  const p = (diff / v1) * 100;
                  res = { value: p.toFixed(2), unit: '%', note: `${p > 0 ? 'Increase' : 'Decrease'} from ${v1} to ${v2}` };
              }
          }
      }

      else if (tool.id === ToolID.STATISTICS_CALCULATOR) {
          const nums = listInput.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
          if (nums.length === 0) {
              res = { value: 'No Data', unit: '', note: '' };
          } else {
              nums.sort((a,b) => a - b);
              const sum = nums.reduce((a,b) => a+b, 0);
              const mean = sum / nums.length;
              const median = nums.length % 2 === 0 ? (nums[nums.length/2 - 1] + nums[nums.length/2])/2 : nums[Math.floor(nums.length/2)];
              const min = nums[0];
              const max = nums[nums.length-1];
              const range = max - min;
              
              // Mode
              const counts: any = {};
              nums.forEach(x => { counts[x] = (counts[x] || 0) + 1; });
              let modeVal = nums[0];
              let maxCount = 0;
              for(const k in counts) {
                  if(counts[k] > maxCount) {
                      maxCount = counts[k];
                      modeVal = Number(k);
                  }
              }
              // Std Dev
              const squareDiffs = nums.map(value => Math.pow(value - mean, 2));
              const avgSquareDiff = squareDiffs.reduce((a,b) => a+b, 0) / nums.length;
              const stdDev = Math.sqrt(avgSquareDiff);

              res = { 
                  value: '', 
                  unit: '', 
                  note: `Count: ${nums.length}`,
                  extras: [
                      { label: 'Mean', val: mean.toFixed(2) },
                      { label: 'Median', val: median },
                      { label: 'Mode', val: modeVal },
                      { label: 'Range', val: range },
                      { label: 'Std Dev', val: stdDev.toFixed(2) },
                      { label: 'Sum', val: sum }
                  ]
              };
          }
      }

      else if (tool.id === ToolID.QUADRATIC_SOLVER) {
          // ax^2 + bx + c = 0
          const a = v1, b = v2, c = v3;
          if (a === 0) {
              res = { value: 'Not Quadratic', unit: '', note: 'a cannot be 0' };
          } else {
              const disc = b*b - 4*a*c;
              const vertexX = -b / (2*a);
              const vertexY = a*vertexX*vertexX + b*vertexX + c;
              
              if (disc > 0) {
                  const x1 = (-b + Math.sqrt(disc)) / (2*a);
                  const x2 = (-b - Math.sqrt(disc)) / (2*a);
                  res = { 
                      value: '', 
                      unit: '', 
                      note: 'Two Real Roots',
                      extras: [
                          { label: 'x1', val: x1.toFixed(4) },
                          { label: 'x2', val: x2.toFixed(4) },
                          { label: 'Discriminant', val: disc },
                          { label: 'Vertex', val: `(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})` }
                      ]
                  };
              } else if (disc === 0) {
                  const x = -b / (2*a);
                  res = { 
                      value: x.toFixed(4), 
                      unit: '', 
                      note: 'One Real Root',
                      extras: [
                          { label: 'Discriminant', val: 0 },
                          { label: 'Vertex', val: `(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})` }
                      ]
                  };
              } else {
                  const realPart = (-b / (2*a)).toFixed(4);
                  const imagPart = (Math.sqrt(-disc) / (2*a)).toFixed(4);
                  res = { 
                      value: '', 
                      unit: '', 
                      note: 'Complex Roots',
                      extras: [
                          { label: 'x1', val: `${realPart} + ${imagPart}i` },
                          { label: 'x2', val: `${realPart} - ${imagPart}i` },
                          { label: 'Discriminant', val: disc }
                      ]
                  };
              }
          }
      }

      else if (tool.id === ToolID.FRACTION_CALCULATOR) {
          // n1/d1 op n2/d2
          const n1 = v1, d1 = v2, n2 = v3, d2 = v4;
          if (d1 === 0 || d2 === 0) {
              res = { value: 'Error', unit: '', note: 'Denominator cannot be 0' };
          } else {
              let num = 0, den = 1;
              if (fractionOp === '+') {
                  num = n1*d2 + n2*d1;
                  den = d1*d2;
              } else if (fractionOp === '-') {
                  num = n1*d2 - n2*d1;
                  den = d1*d2;
              } else if (fractionOp === '*') {
                  num = n1*n2;
                  den = d1*d2;
              } else if (fractionOp === '/') {
                  num = n1*d2;
                  den = d1*n2;
                  if (den === 0) { res = { value: 'Error', unit: '', note: 'Div by zero' }; return; }
              }
              
              // Simplify
              const common = gcd(Math.abs(num), Math.abs(den));
              const simNum = num / common;
              const simDen = den / common;
              
              // Handle signs
              const finalNum = simDen < 0 ? -simNum : simNum;
              const finalDen = Math.abs(simDen);

              res = { 
                  value: `${finalNum}/${finalDen}`, 
                  unit: '', 
                  note: 'Result',
                  extras: [
                      { label: 'Decimal', val: (finalNum/finalDen).toFixed(4) }
                  ]
              };
          }
      }

      else if (tool.id === ToolID.PERMUTATION_COMBINATION_CALCULATOR) {
          const n = v1;
          const r = v2;
          if (n < 0 || r < 0 || r > n) {
              res = { value: 'Error', unit: '', note: 'Invalid n or r' };
          } else {
              const nFact = factorial(n);
              const rFact = factorial(r);
              const nrFact = factorial(n - r);
              
              const nPr = nFact / nrFact;
              const nCr = nFact / (rFact * nrFact);
              
              res = { 
                  value: '', 
                  unit: '', 
                  note: `n=${n}, r=${r}`,
                  extras: [
                      { label: 'Permutation (nPr)', val: nPr.toLocaleString() },
                      { label: 'Combination (nCr)', val: nCr.toLocaleString() }
                  ]
              };
          }
      }

      else if (tool.id === ToolID.PRIME_FACTORIZATION_TOOL) {
          const num = Math.floor(v1);
          if (num < 2) {
              res = { value: 'N/A', unit: '', note: 'Enter integer > 1' };
          } else {
              const factors = getPrimeFactors(num);
              const formatted = factors.join(' × ');
              res = { 
                  value: formatted, 
                  unit: '', 
                  note: `Prime Factors of ${num}`,
                  extras: [{ label: 'Is Prime?', val: factors.length === 1 && factors[0] === num ? 'Yes' : 'No' }]
              };
          }
      }

      else if (tool.id === ToolID.FORCE_CALCULATOR) {
          // F = m * a
          if (mode === 'force') {
              // Calc Force: v1=Mass, v2=Accel
              res = { value: (v1 * v2).toFixed(2), unit: 'N', note: 'Force' };
          } else if (mode === 'mass') {
              // Calc Mass: v1=Force, v2=Accel
              if(v2 === 0) res = { value: 'Error', unit: '', note: 'Zero Accel' };
              else res = { value: (v1 / v2).toFixed(2), unit: 'kg', note: 'Mass' };
          } else if (mode === 'accel') {
              // Calc Accel: v1=Force, v2=Mass
              if(v2 === 0) res = { value: 'Error', unit: '', note: 'Zero Mass' };
              else res = { value: (v1 / v2).toFixed(2), unit: 'm/s²', note: 'Acceleration' };
          }
      }

      else if (tool.id === ToolID.OHMS_LAW_CALCULATOR) {
          // V = I * R
          if (mode === 'voltage') {
              // Calc V: v1=I, v2=R
              res = { value: (v1 * v2).toFixed(2), unit: 'V', note: 'Voltage' };
          } else if (mode === 'current') {
              // Calc I: v1=V, v2=R
              if(v2 === 0) res = { value: 'Error', unit: '', note: 'Zero Resistance' };
              else res = { value: (v1 / v2).toFixed(2), unit: 'A', note: 'Current' };
          } else if (mode === 'resistance') {
              // Calc R: v1=V, v2=I
              if(v2 === 0) res = { value: 'Error', unit: '', note: 'Zero Current' };
              else res = { value: (v1 / v2).toFixed(2), unit: 'Ω', note: 'Resistance' };
          } else if (mode === 'power') {
              // Calc P: v1=V, v2=I
              res = { value: (v1 * v2).toFixed(2), unit: 'W', note: 'Power' };
          }
      }

      // --- EXISTING TOOLS ---

      else if (tool.id === ToolID.PRIME_NUMBER_GENERATOR) {
          const start = Math.floor(Math.min(v1, v2));
          const end = Math.floor(Math.max(v1, v2));
          const primes = [];
          
          if (end - start > 10000) {
              res = { value: "Range too large", unit: "", note: "Max range difference is 10,000" };
          } else {
              for (let i = start; i <= end; i++) {
                  if (isPrime(i)) primes.push(i);
              }
              res = { 
                  value: primes.length, 
                  unit: 'primes found', 
                  note: `Primes between ${start} and ${end}`,
                  extras: [
                      { label: 'List', val: primes.join(', ') || 'None' }
                  ]
              };
          }
      }

      else if (tool.id === ToolID.LCM_GCD_CALCULATOR) {
          const commonDivisor = gcd(v1, v2);
          const lcm = (v1 * v2) / commonDivisor;
          res = { 
              value: '', 
              unit: '', 
              note: `For ${v1} and ${v2}`,
              extras: [
                  { label: 'GCD (HCF)', val: commonDivisor },
                  { label: 'LCM', val: lcm }
              ]
          };
      }

      else if (tool.id === ToolID.PERCENTAGE_TO_CGPA) {
          // Standard CBSE Formula: Percentage / 9.5
          const cgpa = v1 / 9.5;
          res = { value: cgpa.toFixed(2), unit: 'CGPA', note: `Percentage: ${v1}%` };
      }

      else if (tool.id === ToolID.TRIANGLE_CALCULATOR) {
          // Simple: Area from Base & Height
          const area = 0.5 * v1 * v2;
          res = { value: area, unit: 'sq units', note: 'Area = 0.5 * Base * Height' };
      }
      
      else if (tool.id === ToolID.RIGHT_TRIANGLE_CALCULATOR) {
          // Input: Leg A, Leg B
          const hyp = Math.sqrt(v1*v1 + v2*v2);
          const area = 0.5 * v1 * v2;
          const perimeter = v1 + v2 + hyp;
          res = { 
              value: hyp.toFixed(2), 
              unit: 'units', 
              note: 'Hypotenuse',
              extras: [
                  { label: 'Area', val: area.toFixed(2) },
                  { label: 'Perimeter', val: perimeter.toFixed(2) }
              ]
          };
      }

      else if (tool.id === ToolID.PYTHAGOREAN_CALCULATOR) {
          const hyp = Math.sqrt(v1*v1 + v2*v2);
          res = { value: hyp.toFixed(2), unit: 'units', note: 'Hypotenuse (c) = √(a² + b²)' };
      }

      else if (tool.id === ToolID.CIRCLE_CALCULATOR) {
          // Input: Radius
          const r = v1;
          const area = Math.PI * r * r;
          const circ = 2 * Math.PI * r;
          res = {
              value: area.toFixed(2),
              unit: 'sq units',
              note: 'Area',
              extras: [
                  { label: 'Circumference', val: circ.toFixed(2) },
                  { label: 'Diameter', val: (r * 2).toFixed(2) }
              ]
          };
      }

      else if (tool.id === ToolID.DISTANCE_CALCULATOR) {
          // (x1, y1) to (x2, y2)
          // d = sqrt((x2-x1)^2 + (y2-y1)^2)
          const dist = Math.sqrt(Math.pow(v3 - v1, 2) + Math.pow(v4 - v2, 2));
          res = { value: dist.toFixed(4), unit: 'units', note: 'Distance between points' };
      }

      else if (tool.id === ToolID.SLOPE_CALCULATOR) {
          // (x1, y1) to (x2, y2)
          // m = (y2 - y1) / (x2 - x1)
          if (v3 === v1) {
              res = { value: 'Undefined', unit: '', note: 'Vertical Line' };
          } else {
              const m = (v4 - v2) / (v3 - v1);
              res = { value: m.toFixed(4), unit: '', note: 'Slope (m)' };
          }
      }

      else if (tool.id === ToolID.AREA_CALCULATOR) {
          if (shape === 'rectangle') {
              res = { value: v1 * v2, unit: 'sq units', note: 'Area (L x W)' };
          } else if (shape === 'circle') {
              res = { value: (Math.PI * v1 * v1).toFixed(2), unit: 'sq units', note: 'Area (πr²)' };
          } else if (shape === 'triangle') {
              res = { value: 0.5 * v1 * v2, unit: 'sq units', note: 'Area (0.5 * b * h)' };
          } else if (shape === 'square') {
              res = { value: v1 * v1, unit: 'sq units', note: 'Area (s²)' };
          } else if (shape === 'trapezoid') {
              // v1=base1, v2=base2, v3=height
              res = { value: 0.5 * (v1 + v2) * v3, unit: 'sq units', note: 'Area' };
          }
      }

      else if (tool.id === ToolID.VOLUME_CALCULATOR) {
          if (shape === 'cube') {
              res = { value: Math.pow(v1, 3), unit: 'cu units', note: 'Volume (s³)' };
          } else if (shape === 'sphere') {
              res = { value: ((4/3) * Math.PI * Math.pow(v1, 3)).toFixed(2), unit: 'cu units', note: 'Volume (4/3 πr³)' };
          } else if (shape === 'cylinder') {
              // v1=r, v2=h
              res = { value: (Math.PI * v1 * v1 * v2).toFixed(2), unit: 'cu units', note: 'Volume (πr²h)' };
          } else if (shape === 'cone') {
              // v1=r, v2=h
              res = { value: ((1/3) * Math.PI * v1 * v1 * v2).toFixed(2), unit: 'cu units', note: 'Volume (1/3 πr²h)' };
          }
      }

      else if (tool.id === ToolID.SURFACE_AREA_CALCULATOR) {
          if (shape === 'cube') {
              res = { value: 6 * v1 * v1, unit: 'sq units', note: 'Surface Area (6s²)' };
          } else if (shape === 'sphere') {
              res = { value: (4 * Math.PI * v1 * v1).toFixed(2), unit: 'sq units', note: 'Surface Area (4πr²)' };
          } else if (shape === 'cylinder') {
              // v1=r, v2=h. SA = 2πrh + 2πr²
              const sa = (2 * Math.PI * v1 * v2) + (2 * Math.PI * v1 * v1);
              res = { value: sa.toFixed(2), unit: 'sq units', note: 'Surface Area' };
          }
      }

      setResult(res);
  };

  const getSEOContent = () => {
    const baseKeywords = ['math calculators', 'science tools', 'online calculator', 'algebra solver', 'geometry tools', 'physics calculator', 'math homework help', 'scientific calculator online', 'stem tools', 'educational calculators', 'engineering calculators', 'math problem solver', 'calculation tools'];

    if ([ToolID.PERCENTAGE_CALCULATOR, ToolID.PERCENTAGE_TO_CGPA].includes(tool.id)) {
        return (
            <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Percentage & Academic Calculators</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Calculate percentages easily with our <strong>percentage calculator</strong>. Whether you need to find <strong>what is x% of y</strong>, determine percentage increase or decrease, or convert marks, this tool is essential for daily math. Students can specifically use the <strong>percentage to cgpa</strong> feature to convert their academic scores into the standard Cumulative Grade Point Average format used by many institutions like CBSE. Understanding your <strong>percentage change</strong> is crucial for financial tracking, such as analyzing stock market growth or calculating discounts during a sale.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Our tool simplifies these calculations into a few clicks. Instead of manually applying formulas like (Value/Total)*100, you can just input the numbers. For students aiming for higher education abroad, converting <strong>cgpa to percentage</strong> or vice versa is often a requirement for application forms. This <strong>grade converter</strong> ensures you report your scores accurately without any confusion. It serves as a reliable <strong>academic calculator</strong> for students, teachers, and parents alike.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Beyond academics, this utility works perfectly as a <strong>discount calculator</strong> for shoppers. Quickly figure out the final price after a 20% off sale or calculate the tip at a restaurant. By automating the math, we reduce errors and save you time. Whether for school, work, or shopping, having a quick reference for percentage-based math problems is incredibly useful.
                </p>
                <KeywordsBox keywords={[...baseKeywords, 'percentage change', 'cgpa to percentage', 'grade converter', 'academic calculator', 'discount calculator']} />
            </>
        );
    } 
    else if ([ToolID.STATISTICS_CALCULATOR, ToolID.PERMUTATION_COMBINATION_CALCULATOR].includes(tool.id)) {
        return (
            <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Statistics & Probability Tools</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Perform complex statistical analysis in seconds with our <strong>statistics calculator</strong>. Simply enter a data set to instantly calculate key metrics including <strong>mean median mode</strong>, range, and sum. For advanced analysis, it also provides the <strong>standard deviation calculator</strong> output, which is essential for understanding data spread and variability in research, business, or science projects. This tool transforms raw numbers into meaningful insights without the need for spreadsheet software.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    For probability and combinatorics, our <strong>permutation calculator</strong> and <strong>combination formula</strong> tool helps you determine the number of possible arrangements or selections from a set. Whether you are solving math problems involving "nPr" (Permutations) where order matters, or "nCr" (Combinations) where it doesn't, this utility provides exact results. It is a vital resource for students studying discrete mathematics or anyone dealing with <strong>statistical analysis</strong> and probability theory.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    These tools are designed to support students and professionals dealing with large datasets or complex probability scenarios. By automating the tedious arithmetic of sums of squares or factorial divisions, you can focus on interpreting the results. Use these <strong>math calculators</strong> to verify your homework answers or perform quick data checks in professional reports.
                </p>
                <KeywordsBox keywords={[...baseKeywords, 'mean median mode', 'standard deviation calculator', 'permutation calculator', 'combination formula', 'statistical analysis']} />
            </>
        );
    }
    else if ([ToolID.TRIANGLE_CALCULATOR, ToolID.RIGHT_TRIANGLE_CALCULATOR, ToolID.CIRCLE_CALCULATOR, ToolID.AREA_CALCULATOR, ToolID.VOLUME_CALCULATOR, ToolID.SURFACE_AREA_CALCULATOR, ToolID.PYTHAGOREAN_CALCULATOR].includes(tool.id)) {
        return (
            <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Geometry Calculators</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Solve geometry problems instantly with our comprehensive suite of <strong>geometry tools</strong>. Whether you need to calculate the <strong>area of circle</strong>, the perimeter of a triangle, or the volume of a sphere, our calculators handle all the formulas for you. The <strong>volume calculator</strong> covers various 3D shapes including cubes, cylinders, cones, and spheres, making it indispensable for construction, engineering, and physics students who need to determine capacity or displacement.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    We also provide specialized tools like the <strong>pythagorean theorem calculator</strong> to solve right-angled triangles. Simply input two sides to find the hypotenuse or the remaining leg. Our <strong>geometry solver</strong> helps you visualize and calculate properties of 2D and 3D shapes, including the <strong>surface area formula</strong> for complex objects. This is particularly useful for painting projects, material estimation, or packaging design where surface area determines cost.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Stop memorizing complex formulas like πr² or 4/3πr³. Our tools provide instant, accurate results for <strong>area calculator</strong> and volume needs. From basic classroom geometry to practical real-world measurements, these <strong>math calculators</strong> ensure precision. Whether you are an architect, student, or DIY enthusiast, having a reliable geometry assistant simplifies your planning and calculations.
                </p>
                <KeywordsBox keywords={[...baseKeywords, 'area of circle', 'volume calculator', 'surface area formula', 'pythagorean theorem calculator', 'geometry solver']} />
            </>
        );
    }
    else if ([ToolID.QUADRATIC_SOLVER, ToolID.FRACTION_CALCULATOR, ToolID.PRIME_FACTORIZATION_TOOL, ToolID.PRIME_NUMBER_GENERATOR, ToolID.LCM_GCD_CALCULATOR].includes(tool.id)) {
        return (
            <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Algebra & Number Theory</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Tackle algebra and number theory problems with ease. Our <strong>quadratic formula solver</strong> finds the roots of quadratic equations instantly, handling both real and complex solutions. It calculates the discriminant and vertex, providing a complete analysis of the parabola. For arithmetic, our <strong>fraction addition</strong> and calculator tool simplifies operations like adding, subtracting, multiplying, and dividing fractions, automatically reducing them to their simplest form.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Explore the properties of numbers with our number theory tools. The <strong>prime factors</strong> tool breaks down any integer into its prime components, which is fundamental for cryptography and advanced math. We also offer an <strong>lcm calculator</strong> and <strong>gcd finder</strong> to determine the Least Common Multiple and Greatest Common Divisor between two numbers. These tools are essential for simplifying fractions and solving scheduling problems.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Whether you are a student struggling with <strong>algebra solver</strong> homework or a programmer needing to generate prime numbers, this suite has you covered. The <strong>prime number generator</strong> can list primes within a range, aiding in algorithm testing and mathematical research. These <strong>math problem solver</strong> utilities turn complex algebraic steps into instant results, helping you learn and verify your work efficiently.
                </p>
                <KeywordsBox keywords={[...baseKeywords, 'quadratic formula solver', 'fraction addition', 'prime factors', 'lcm calculator', 'gcd finder']} />
            </>
        );
    }
    else if ([ToolID.FORCE_CALCULATOR, ToolID.OHMS_LAW_CALCULATOR].includes(tool.id)) {
        return (
            <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Physics & Electronics Tools</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Master fundamental physics concepts with our dedicated calculators. The <strong>force calculator</strong> applies <strong>newtons second law</strong> (F=ma) to solve for force, mass, or acceleration. This is a crucial tool for physics students and engineers working with dynamics and mechanics. It allows you to simulate scenarios and understand the relationship between mass and motion without manual computation errors.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    For electronics and electrical engineering, our Ohm's Law tool serves as a versatile <strong>voltage calculator</strong>, <strong>current calculator</strong>, and resistance finder. By inputting any two values, you can solve for the third, ensuring your circuits are designed correctly. Understanding <strong>electrical resistance</strong> and power consumption is vital for safety and efficiency in circuit design.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    These <strong>physics formulas</strong> are embedded into easy-to-use interfaces, making complex scientific calculations accessible. Whether you are calculating the thrust of an engine or designing a simple LED circuit, our <strong>science tools</strong> provide the accuracy you need. Use these <strong>stem tools</strong> to bridge the gap between theoretical physics and practical application.
                </p>
                <KeywordsBox keywords={[...baseKeywords, 'newtons second law', 'voltage calculator', 'current calculator', 'physics formulas', 'electrical resistance']} />
            </>
        );
    }
    else if ([ToolID.DISTANCE_CALCULATOR, ToolID.SLOPE_CALCULATOR].includes(tool.id)) {
        return (
            <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Coordinate Geometry Tools</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Analyze the relationship between points on a Cartesian plane with our <strong>coordinate geometry</strong> tools. The <strong>distance formula</strong> calculator determines the exact length between two points (x1, y1) and (x2, y2), which is essential for navigation, mapping, and game development. It simplifies the square root calculations involved, giving you immediate precision.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Understanding the steepness of a line is easy with our <strong>slope of a line</strong> calculator. Also known as a <strong>gradient calculator</strong>, it computes the "rise over run" between two coordinates. This is critical for construction grading, architectural design, and analyzing rates of change in calculus.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    These tools turn abstract coordinates into tangible data. Whether you are checking homework or planning a trajectory, our <strong>math calculators</strong> provide instant solutions for slope and distance. They serve as a reliable digital assistant for anyone working with graphs and spatial relationships.
                </p>
                <KeywordsBox keywords={[...baseKeywords, 'distance formula', 'slope of a line', 'coordinate geometry', 'gradient calculator', 'midpoint']} />
            </>
        );
    }
    else {
        // Fallback for any tools not caught in groups above
        return (
            <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Math & Science Calculators</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Our collection of Math & Science calculators covers a wide range of needs, from basic arithmetic and algebra to complex geometry and physics. Whether you are solving for X using our <strong>algebra solver</strong>, calculating the area of a circle, or determining the force of an object with our <strong>physics calculator</strong>, these tools provide accurate and instant solutions.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Designed for students, teachers, and professionals, they simplify complex formulas into easy-to-use interfaces. This suite acts as a powerful <strong>scientific calculator online</strong> for specialized tasks that go beyond standard buttons. Explore our <strong>geometry tools</strong> and <strong>stem tools</strong> to make your calculations faster and more reliable.
                </p>
                <KeywordsBox keywords={baseKeywords} />
            </>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 md:p-8 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg border-b border-gray-100 dark:border-slate-700 pb-2 mb-4">
                      {tool.title}
                  </h3>

                  {/* Mode Selectors for New Tools */}
                  {tool.id === ToolID.PERCENTAGE_CALCULATOR && (
                      <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2 dark:text-white">Calculation Type</label>
                          <select value={mode} onChange={e => {setMode(e.target.value); setResult(null);}} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="what_is">What is X% of Y?</option>
                              <option value="is_what">X is what % of Y?</option>
                              <option value="increase">Percentage Increase/Decrease</option>
                          </select>
                      </div>
                  )}
                  {tool.id === ToolID.FORCE_CALCULATOR && (
                      <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2 dark:text-white">Calculate</label>
                          <select value={mode} onChange={e => {setMode(e.target.value); setResult(null);}} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="force">Force (F = m × a)</option>
                              <option value="mass">Mass (m = F / a)</option>
                              <option value="accel">Acceleration (a = F / m)</option>
                          </select>
                      </div>
                  )}
                  {tool.id === ToolID.OHMS_LAW_CALCULATOR && (
                      <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2 dark:text-white">Calculate</label>
                          <select value={mode} onChange={e => {setMode(e.target.value); setResult(null);}} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="voltage">Voltage (V = I × R)</option>
                              <option value="current">Current (I = V / R)</option>
                              <option value="resistance">Resistance (R = V / I)</option>
                              <option value="power">Power (P = V × I)</option>
                          </select>
                      </div>
                  )}

                  {/* Shape Selector (Existing) */}
                  {(tool.id === ToolID.AREA_CALCULATOR || tool.id === ToolID.VOLUME_CALCULATOR || tool.id === ToolID.SURFACE_AREA_CALCULATOR) && (
                      <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Shape</label>
                          <select 
                              value={shape} 
                              onChange={(e) => { setShape(e.target.value); setResult(null); }}
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                          >
                              {tool.id === ToolID.AREA_CALCULATOR && (
                                  <>
                                      <option value="rectangle">Rectangle</option>
                                      <option value="square">Square</option>
                                      <option value="circle">Circle</option>
                                      <option value="triangle">Triangle</option>
                                      <option value="trapezoid">Trapezoid</option>
                                  </>
                              )}
                              {(tool.id === ToolID.VOLUME_CALCULATOR || tool.id === ToolID.SURFACE_AREA_CALCULATOR) && (
                                  <>
                                      <option value="cube">Cube</option>
                                      <option value="sphere">Sphere</option>
                                      <option value="cylinder">Cylinder</option>
                                      {tool.id === ToolID.VOLUME_CALCULATOR && <option value="cone">Cone</option>}
                                  </>
                              )}
                          </select>
                      </div>
                  )}

                  {/* Dynamic Inputs */}
                  <div className="space-y-4">
                      
                      {/* --- NEW TOOLS INPUTS --- */}
                      
                      {tool.id === ToolID.PERCENTAGE_CALCULATOR && (
                          <>
                              <InputField label={mode === 'what_is' ? 'Percentage (%)' : mode === 'is_what' ? 'Value (X)' : 'Initial Value'} val={val1} setVal={setVal1} />
                              <InputField label={mode === 'what_is' ? 'Value (Y)' : mode === 'is_what' ? 'Total (Y)' : 'Final Value'} val={val2} setVal={setVal2} />
                          </>
                      )}

                      {tool.id === ToolID.STATISTICS_CALCULATOR && (
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Data Set (comma separated)</label>
                              <textarea 
                                  value={listInput} 
                                  onChange={(e) => setListInput(e.target.value)} 
                                  className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white h-32 focus:ring-2 focus:ring-blue-500 outline-none"
                                  placeholder="10, 20, 15, 30..."
                              />
                          </div>
                      )}

                      {tool.id === ToolID.QUADRATIC_SOLVER && (
                          <>
                              <InputField label="a (Coefficient of x²)" val={val1} setVal={setVal1} />
                              <InputField label="b (Coefficient of x)" val={val2} setVal={setVal2} />
                              <InputField label="c (Constant)" val={val3} setVal={setVal3} />
                          </>
                      )}

                      {tool.id === ToolID.FRACTION_CALCULATOR && (
                          <>
                              <div className="flex items-center gap-2">
                                  <div className="flex-1 space-y-2">
                                      <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-center outline-none focus:ring-2 focus:ring-blue-500" placeholder="Num 1" />
                                      <div className="border-t border-gray-400"></div>
                                      <input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-center outline-none focus:ring-2 focus:ring-blue-500" placeholder="Den 1" />
                                  </div>
                                  <select value={fractionOp} onChange={(e) => setFractionOp(e.target.value)} className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                      <option value="+">+</option>
                                      <option value="-">-</option>
                                      <option value="*">×</option>
                                      <option value="/">÷</option>
                                  </select>
                                  <div className="flex-1 space-y-2">
                                      <input type="number" value={val3} onChange={(e) => setVal3(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-center outline-none focus:ring-2 focus:ring-blue-500" placeholder="Num 2" />
                                      <div className="border-t border-gray-400"></div>
                                      <input type="number" value={val4} onChange={(e) => setVal4(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-center outline-none focus:ring-2 focus:ring-blue-500" placeholder="Den 2" />
                                  </div>
                              </div>
                          </>
                      )}

                      {/* ... (Keep other input fields as they use InputField component which is updated above) ... */}
                      {tool.id === ToolID.PERMUTATION_COMBINATION_CALCULATOR && (
                          <>
                              <InputField label="n (Total items)" val={val1} setVal={setVal1} />
                              <InputField label="r (Selected items)" val={val2} setVal={setVal2} />
                          </>
                      )}

                      {tool.id === ToolID.PRIME_FACTORIZATION_TOOL && (
                          <InputField label="Enter Integer" val={val1} setVal={setVal1} />
                      )}

                      {tool.id === ToolID.FORCE_CALCULATOR && (
                          <>
                              <InputField label={mode === 'force' ? 'Mass (kg)' : 'Force (N)'} val={val1} setVal={setVal1} />
                              <InputField label={mode === 'accel' ? 'Mass (kg)' : 'Acceleration (m/s²)'} val={val2} setVal={setVal2} />
                          </>
                      )}

                      {tool.id === ToolID.OHMS_LAW_CALCULATOR && (
                          <>
                              <InputField label={mode === 'voltage' ? 'Current (A)' : 'Voltage (V)'} val={val1} setVal={setVal1} />
                              <InputField label={mode === 'resistance' ? 'Current (A)' : mode === 'power' ? 'Current (A)' : 'Resistance (Ω)'} val={val2} setVal={setVal2} />
                          </>
                      )}

                      {/* --- EXISTING TOOLS --- */}

                      {/* Prime Number Generator */}
                      {tool.id === ToolID.PRIME_NUMBER_GENERATOR && (
                          <>
                              <InputField label="Start Number" val={val1} setVal={setVal1} />
                              <InputField label="End Number" val={val2} setVal={setVal2} />
                          </>
                      )}

                      {/* LCM & GCD */}
                      {tool.id === ToolID.LCM_GCD_CALCULATOR && (
                          <>
                              <InputField label="Number 1" val={val1} setVal={setVal1} />
                              <InputField label="Number 2" val={val2} setVal={setVal2} />
                          </>
                      )}

                      {/* Percentage to CGPA */}
                      {tool.id === ToolID.PERCENTAGE_TO_CGPA && (
                          <InputField label="Percentage (%)" val={val1} setVal={setVal1} />
                      )}

                      {/* Triangle & Right Triangle & Pythagorean */}
                      {(tool.id === ToolID.TRIANGLE_CALCULATOR || tool.id === ToolID.RIGHT_TRIANGLE_CALCULATOR || tool.id === ToolID.PYTHAGOREAN_CALCULATOR) && (
                          <>
                              <InputField label={tool.id === ToolID.TRIANGLE_CALCULATOR ? "Base" : "Side A (Leg)"} val={val1} setVal={setVal1} />
                              <InputField label={tool.id === ToolID.TRIANGLE_CALCULATOR ? "Height" : "Side B (Leg)"} val={val2} setVal={setVal2} />
                          </>
                      )}

                      {/* Circle */}
                      {tool.id === ToolID.CIRCLE_CALCULATOR && (
                          <InputField label="Radius (r)" val={val1} setVal={setVal1} />
                      )}

                      {/* Distance & Slope (Coordinates) */}
                      {(tool.id === ToolID.DISTANCE_CALCULATOR || tool.id === ToolID.SLOPE_CALCULATOR) && (
                          <>
                              <div className="grid grid-cols-2 gap-4">
                                  <InputField label="X1" val={val1} setVal={setVal1} />
                                  <InputField label="Y1" val={val2} setVal={setVal2} />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <InputField label="X2" val={val3} setVal={setVal3} />
                                  <InputField label="Y2" val={val4} setVal={setVal4} />
                              </div>
                          </>
                      )}

                      {/* Area Shapes */}
                      {tool.id === ToolID.AREA_CALCULATOR && (
                          <>
                              {(shape === 'rectangle') && (
                                  <>
                                      <InputField label="Length" val={val1} setVal={setVal1} />
                                      <InputField label="Width" val={val2} setVal={setVal2} />
                                  </>
                              )}
                              {(shape === 'square') && (
                                  <InputField label="Side Length" val={val1} setVal={setVal1} />
                              )}
                              {(shape === 'circle') && (
                                  <InputField label="Radius" val={val1} setVal={setVal1} />
                              )}
                              {(shape === 'triangle') && (
                                  <>
                                      <InputField label="Base" val={val1} setVal={setVal1} />
                                      <InputField label="Height" val={val2} setVal={setVal2} />
                                  </>
                              )}
                              {(shape === 'trapezoid') && (
                                  <>
                                      <InputField label="Base 1" val={val1} setVal={setVal1} />
                                      <InputField label="Base 2" val={val2} setVal={setVal2} />
                                      <InputField label="Height" val={val3} setVal={setVal3} />
                                  </>
                              )}
                          </>
                      )}

                      {/* Volume & Surface Area Shapes */}
                      {(tool.id === ToolID.VOLUME_CALCULATOR || tool.id === ToolID.SURFACE_AREA_CALCULATOR) && (
                          <>
                              {shape === 'cube' && <InputField label="Side Length" val={val1} setVal={setVal1} />}
                              {shape === 'sphere' && <InputField label="Radius" val={val1} setVal={setVal1} />}
                              {(shape === 'cylinder' || shape === 'cone') && (
                                  <>
                                      <InputField label="Radius" val={val1} setVal={setVal1} />
                                      <InputField label="Height" val={val2} setVal={setVal2} />
                                  </>
                              )}
                          </>
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
                              {result.value} <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">{result.unit}</span>
                          </h2>
                          
                          {result.extras && (
                              <div className="mt-6 pt-6 border-t border-blue-200 dark:border-slate-700 w-full">
                                  <div className="grid grid-cols-1 gap-4">
                                      {result.extras.map((extra: any, idx: number) => (
                                          <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm overflow-hidden text-ellipsis">
                                              <div className="text-xs text-gray-500 uppercase font-bold">{extra.label}</div>
                                              <div className="text-lg font-bold text-gray-800 dark:text-white break-words">{extra.val}</div>
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

      {/* NEW SEO CONTENT SECTION */}
      <div className="mt-16 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
         {getSEOContent()}
      </div>
    </div>
  );
};
