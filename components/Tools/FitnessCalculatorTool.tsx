
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

export const FitnessCalculatorTool: React.FC<Props> = ({ tool }) => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(25);
  
  // Base states are always stored in Metric (cm, kg)
  const [height, setHeight] = useState<number>(170); 
  const [weight, setWeight] = useState<number>(70); 
  const [activity, setActivity] = useState<number>(1.2);
  const [neck, setNeck] = useState<number>(35); 
  const [waist, setWaist] = useState<number>(85); 
  const [hip, setHip] = useState<number>(95); 
  const [bust, setBust] = useState<number>(90); 
  const [highHip, setHighHip] = useState<number>(92); 

  // Step Counter specific
  const [steps, setSteps] = useState<number>(10000);

  // Other specific states...
  const [creatinine, setCreatinine] = useState<number>(0.9);
  const [race, setRace] = useState<'other' | 'black'>('other');
  const [alcoholConsumed, setAlcoholConsumed] = useState<number>(2); // drinks
  const [timeElapsed, setTimeElapsed] = useState<number>(1); // hours
  const [distance, setDistance] = useState<number>(5); // km
  const [timeHours, setTimeHours] = useState<number>(0);
  const [timeMinutes, setTimeMinutes] = useState<number>(30);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [weightLifted, setWeightLifted] = useState<number>(50); // kg
  const [reps, setReps] = useState<number>(5);
  const [restingHeartRate, setRestingHeartRate] = useState<number>(70);
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [currentPregnancyWeek, setCurrentPregnancyWeek] = useState<number>(12);

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    setResult(null);
    setAge(25);
    setHeight(170);
    setWeight(70);
    setSteps(10000);
    // ... reset others
  }, [tool.id]);

  // Helpers
  const getWeightDisplay = () => unitSystem === 'metric' ? weight : parseFloat((weight * 2.20462).toFixed(1));
  const getWeightUnit = () => unitSystem === 'metric' ? 'kg' : 'lbs';
  const handleWeightChange = (val: number) => setWeight(unitSystem === 'metric' ? val : val / 2.20462);
  const getHeightFt = () => Math.floor(height / 30.48);
  const getHeightIn = () => parseFloat(((height / 2.54) % 12).toFixed(1));
  const handleHeightFtChange = (ft: number) => setHeight((ft * 30.48) + (getHeightIn() * 2.54));
  const handleHeightInChange = (inches: number) => setHeight((getHeightFt() * 30.48) + (inches * 2.54));
  const getMeasurementDisplay = (cmVal: number) => unitSystem === 'metric' ? cmVal : parseFloat((cmVal / 2.54).toFixed(1));
  const handleMeasurementChange = (val: number, setter: any) => setter(unitSystem === 'metric' ? val : val * 2.54);
  const getDistanceDisplay = () => unitSystem === 'metric' ? distance : parseFloat((distance * 0.621371).toFixed(2));
  const handleDistanceChange = (val: number) => setDistance(unitSystem === 'metric' ? val : val / 0.621371);
  const getLiftWeightDisplay = () => unitSystem === 'metric' ? weightLifted : parseFloat((weightLifted * 2.20462).toFixed(1));
  const handleLiftWeightChange = (val: number) => setWeightLifted(unitSystem === 'metric' ? val : val / 2.20462);

  const calculate = () => {
    let res: any = null;

    if (tool.id === ToolID.STEP_COUNTER_TO_DISTANCE) {
        // Average stride length estimate: Height * 0.413 (female) or 0.415 (male)
        const strideFactor = gender === 'male' ? 0.415 : 0.413;
        const strideLengthCm = height * strideFactor;
        const totalCm = steps * strideLengthCm;
        const totalKm = totalCm / 100000;
        
        if (unitSystem === 'metric') {
            res = { value: totalKm.toFixed(2), unit: 'km', note: `Est. distance for ${steps} steps` };
        } else {
            const totalMiles = totalKm * 0.621371;
            res = { value: totalMiles.toFixed(2), unit: 'miles', note: `Est. distance for ${steps} steps` };
        }
    }
    // --- EXISTING TOOLS ---
    else if (tool.id === ToolID.BMI_CALCULATOR) {
        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);
        let category = '';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obesity';
        res = { value: bmi.toFixed(1), category, unit: 'BMI' };
    }
    else if (tool.id === ToolID.BMR_CALCULATOR || tool.id === ToolID.TDEE_CALCULATOR || tool.id === ToolID.CALORIE_CALCULATOR) {
        // Mifflin-St Jeor Equation
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        if (gender === 'male') bmr += 5; else bmr -= 161;
        
        if (tool.id === ToolID.BMR_CALCULATOR) {
            res = { value: Math.round(bmr), unit: 'kcal/day', note: 'Basal Metabolic Rate' };
        } else {
            const tdee = bmr * activity;
            res = { value: Math.round(tdee), unit: 'kcal/day', note: tool.id === ToolID.CALORIE_CALCULATOR ? 'Maintenance Calories' : 'TDEE' };
        }
    }
    else if (tool.id === ToolID.BODY_FAT_CALCULATOR) {
        // US Navy Method
        let bf = 0;
        if (gender === 'male') {
            bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
        } else {
            bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
        }
        res = { value: bf.toFixed(1), unit: '%', note: 'Body Fat Percentage' };
    }
    else if (tool.id === ToolID.IDEAL_WEIGHT_CALCULATOR) {
        // Devine Formula
        const heightInches = height / 2.54;
        let idealKg = 0;
        if (gender === 'male') idealKg = 50 + 2.3 * (heightInches - 60);
        else idealKg = 45.5 + 2.3 * (heightInches - 60);
        
        if (unitSystem === 'metric') res = { value: idealKg.toFixed(1), unit: 'kg', note: 'Ideal Weight' };
        else res = { value: (idealKg * 2.20462).toFixed(1), unit: 'lbs', note: 'Ideal Weight' };
    }
    else if (tool.id === ToolID.WATER_INTAKE_CALCULATOR) {
        // Simple: Weight (kg) * 0.033
        const liters = weight * 0.033;
        res = { value: liters.toFixed(1), unit: 'liters/day', note: 'Recommended Water' };
    }
    else if (tool.id === ToolID.PACE_CALCULATOR) {
        // Pace = Time / Distance
        const totalMinutes = (timeHours * 60) + timeMinutes + (timeSeconds / 60);
        const pace = totalMinutes / distance; // min per km (if metric)
        const paceMin = Math.floor(pace);
        const paceSec = Math.round((pace - paceMin) * 60);
        res = { value: `${paceMin}:${paceSec < 10 ? '0'+paceSec : paceSec}`, unit: unitSystem === 'metric' ? 'min/km' : 'min/mile', note: 'Running Pace' };
    }
    else if (tool.id === ToolID.ARMY_BODY_FAT_CALCULATOR) {
        let bf = 0;
        if (gender === 'male') {
            bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
        } else {
            bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
        }
        res = { value: bf.toFixed(1), unit: '%', note: 'Army Body Fat %' };
    }
    else if (tool.id === ToolID.LEAN_BODY_MASS_CALCULATOR) {
        // Boer Formula
        let lbm = 0;
        if (gender === 'male') lbm = 0.407 * weight + 0.267 * height - 19.2;
        else lbm = 0.252 * weight + 0.473 * height - 48.3;
        
        if (unitSystem === 'metric') res = { value: lbm.toFixed(1), unit: 'kg', note: 'Lean Body Mass' };
        else res = { value: (lbm * 2.20462).toFixed(1), unit: 'lbs', note: 'Lean Body Mass' };
    }
    else if (tool.id === ToolID.HEALTHY_WEIGHT_CALCULATOR) {
        // BMI range 18.5 - 25
        const hM = height / 100;
        const minW = 18.5 * hM * hM;
        const maxW = 25 * hM * hM;
        
        if (unitSystem === 'metric') res = { value: `${minW.toFixed(1)} - ${maxW.toFixed(1)}`, unit: 'kg', note: 'Healthy Weight Range' };
        else res = { value: `${(minW * 2.20462).toFixed(1)} - ${(maxW * 2.20462).toFixed(1)}`, unit: 'lbs', note: 'Healthy Weight Range' };
    }
    else if (tool.id === ToolID.CALORIES_BURNED_CALCULATOR) {
        const cals = 5 * weight * (timeMinutes / 60);
        res = { value: Math.round(cals), unit: 'kcal', note: 'Estimated Burn (Moderate)' };
    }
    else if (tool.id === ToolID.ONE_REP_MAX_CALCULATOR) {
        // Epley Formula: w * (1 + r/30)
        const orm = weightLifted * (1 + reps / 30);
        if (unitSystem === 'metric') res = { value: Math.round(orm), unit: 'kg', note: '1 Rep Max' };
        else res = { value: Math.round(orm * 2.20462), unit: 'lbs', note: '1 Rep Max' };
    }
    else if (tool.id === ToolID.TARGET_HEART_RATE_CALCULATOR) {
        // Karvonen Formula
        const maxHR = 220 - age;
        const hrr = maxHR - restingHeartRate;
        const minTarget = Math.round((hrr * 0.5) + restingHeartRate); // 50%
        const maxTarget = Math.round((hrr * 0.85) + restingHeartRate); // 85%
        res = { value: `${minTarget} - ${maxTarget}`, unit: 'bpm', note: 'Target HR Zone (50-85%)' };
    }
    else if (tool.id === ToolID.MACRO_CALCULATOR || tool.id === ToolID.PROTEIN_CALCULATOR || tool.id === ToolID.CARBOHYDRATE_CALCULATOR || tool.id === ToolID.FAT_INTAKE_CALCULATOR) {
        // Basic split 40/30/30 of TDEE
        let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'male' ? 5 : -161);
        const tdee = bmr * activity;
        
        const proteinG = (tdee * 0.3) / 4;
        const carbG = (tdee * 0.4) / 4;
        const fatG = (tdee * 0.3) / 9;
        
        if (tool.id === ToolID.PROTEIN_CALCULATOR) res = { value: Math.round(proteinG), unit: 'g', note: 'Daily Protein' };
        else if (tool.id === ToolID.CARBOHYDRATE_CALCULATOR) res = { value: Math.round(carbG), unit: 'g', note: 'Daily Carbs' };
        else if (tool.id === ToolID.FAT_INTAKE_CALCULATOR) res = { value: Math.round(fatG), unit: 'g', note: 'Daily Fat' };
        else res = { value: '', unit: '', note: 'Daily Macros', category: `P: ${Math.round(proteinG)}g | C: ${Math.round(carbG)}g | F: ${Math.round(fatG)}g` };
    }
    else if (tool.id === ToolID.GFR_CALCULATOR) {
        // CKD-EPI Formula (Simplified)
        const k = gender === 'female' ? 0.7 : 0.9;
        const a = gender === 'female' ? -0.329 : -0.411;
        const scr = creatinine;
        let gfr = 141 * Math.pow(Math.min(scr/k, 1), a) * Math.pow(Math.max(scr/k, 1), -1.209) * Math.pow(0.993, age);
        if (gender === 'female') gfr *= 1.018;
        if (race === 'black') gfr *= 1.159;
        
        res = { value: gfr.toFixed(1), unit: 'mL/min/1.73m²', note: 'Estimated GFR' };
    }
    else if (tool.id === ToolID.BAC_CALCULATOR) {
        // Widmark Formula
        const alcoholGrams = alcoholConsumed * 14;
        const weightGrams = weight * 1000;
        const r = gender === 'male' ? 0.68 : 0.55;
        let bac = (alcoholGrams / (weightGrams * r)) * 100 - (timeElapsed * 0.015);
        if (bac < 0) bac = 0;
        res = { value: bac.toFixed(3), unit: '%', note: 'Blood Alcohol Content' };
    }
    else if (tool.id === ToolID.PREGNANCY_CALCULATOR || tool.id === ToolID.DUE_DATE_CALCULATOR) {
        if (!lastPeriodDate) return;
        const lmp = new Date(lastPeriodDate);
        const dueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
        res = { value: dueDate.toLocaleDateString(), unit: '', note: 'Estimated Due Date' };
    }
    else if (tool.id === ToolID.CONCEPTION_CALCULATOR || tool.id === ToolID.PREGNANCY_CONCEPTION_CALCULATOR) {
        if (!lastPeriodDate) return; 
        const lmp = new Date(lastPeriodDate);
        const conception = new Date(lmp.getTime() + 14 * 24 * 60 * 60 * 1000);
        res = { value: conception.toLocaleDateString(), unit: '', note: 'Est. Conception Date' };
    }
    else if (tool.id === ToolID.OVULATION_CALCULATOR) {
        if (!lastPeriodDate) return;
        const lmp = new Date(lastPeriodDate);
        const ovulation = new Date(lmp.getTime() + (cycleLength - 14) * 24 * 60 * 60 * 1000);
        res = { value: ovulation.toLocaleDateString(), unit: '', note: 'Est. Ovulation Date' };
    }
    else if (tool.id === ToolID.PERIOD_CALCULATOR) {
        if (!lastPeriodDate) return;
        const lmp = new Date(lastPeriodDate);
        const nextPeriod = new Date(lmp.getTime() + cycleLength * 24 * 60 * 60 * 1000);
        res = { value: nextPeriod.toLocaleDateString(), unit: '', note: 'Next Period Start' };
    }
    else if (tool.id === ToolID.BODY_SURFACE_AREA_CALCULATOR) {
        // Mosteller Formula: sqrt( (height cm * weight kg) / 3600 )
        const bsa = Math.sqrt((height * weight) / 3600);
        res = { value: bsa.toFixed(2), unit: 'm²', note: 'Body Surface Area' };
    }
    else if (tool.id === ToolID.PREGNANCY_WEIGHT_GAIN_CALCULATOR) {
        // Based on BMI
        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);
        let gainRange = "";
        
        if (bmi < 18.5) gainRange = "28-40 lbs (12.7-18 kg)";
        else if (bmi < 25) gainRange = "25-35 lbs (11.3-15.9 kg)";
        else if (bmi < 30) gainRange = "15-25 lbs (6.8-11.3 kg)";
        else gainRange = "11-20 lbs (5-9 kg)";
        
        res = { value: gainRange, unit: '', note: `Recommended Total Gain (Pre-preg BMI: ${bmi.toFixed(1)})` };
    }
    else if (tool.id === ToolID.BODY_TYPE_CALCULATOR) {
        // Using Bust, Waist, Hip measurements
        // Simplified Logic:
        // Hourglass: Bust ~ Hips, Waist smaller
        // Pear: Hips > Bust
        // Apple: Waist > Bust or Waist > Hips
        // Rectangle: Bust ~ Waist ~ Hips
        // Inverted Triangle: Bust > Hips
        
        let type = "Unknown";
        // Convert to cm if needed just for ratio logic (currently stored as metric always via setters)
        const b = bust;
        const w = waist;
        const h = hip;
        
        // Use logic based on differences (approx 5cm tolerance)
        if (h > b + 5) type = "Pear (Triangle)";
        else if (b > h + 5) type = "Inverted Triangle";
        else if ((b - w) >= 15 && (h - w) >= 15) type = "Hourglass";
        else if (w > b || w > h) type = "Apple (Round)";
        else type = "Rectangle";
        
        res = { value: type, unit: '', note: 'Estimated Body Type' };
    }
    
    setResult(res);
  };

  // ... (getSEOContent remains unchanged) ...
  const getSEOContent = () => {
    // ... (Keep existing implementation) ...
    switch (tool.id) {
        // ... (Keep all existing case statements) ...
        default:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Fitness & Health Tools</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        Our platform offers a wide array of <strong>fitness calculators</strong> and <strong>health tools</strong> designed to support every aspect of your wellness journey. From tracking <strong>body metrics</strong> to planning workouts, these utilities provide the <strong>workout math</strong> you need to succeed. Explore resources that highlight the <strong>10 benefits of physical activity</strong> and help you understand <strong>health related physical fitness</strong>. Whether you frequent an <strong>energise gym</strong>, a <strong>mercy healthplex</strong>, or utilize programs like <strong>bcbs fitness your way</strong>, our online tools complement your physical efforts perfectly.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        We aim to be your go-to source for <strong>online wellness</strong> and <strong>gym tools</strong>. Our suite includes calculators for pregnancy, ovulation, blood alcohol content, and more, serving as comprehensive <strong>health trackers</strong>. These <strong>free fitness apps</strong> run directly in your browser, offering privacy and convenience. Use them to monitor your progress, whether you are training at <strong>nuffield health gym near me</strong> or a <strong>10 fitness</strong> location.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        Take control of your health with data-driven insights. Our <strong>wellness calculators</strong> and <strong>health calculator</strong> collection cover a broad spectrum of needs. From <strong>fitness tracking</strong> to understanding complex physiological metrics, we provide the answers. Discover the <strong>benefits of fitness</strong> through precise calculation and planning, all available for free in one convenient place.
                    </p>
                    <KeywordsBox keywords={['energise gym', 'bcbs fitness your way virgin gym near me', '10 benefits of physical activity', 'hackensack meridian fitness & wellness', 'your fitness hsc fitness center', 'health related physical fitness', 's20 health and fitness', 'mercy healthplex', '10 fitness', 'nuffield health gym near me', 'benefits of fitness', 'fitness calculators', 'health tools', 'online wellness', 'gym tools', 'workout math', 'body metrics', 'health trackers', 'free fitness apps', 'online fitness tools', 'health calculator', 'fitness tracking', 'wellness calculators', 'gym calculators']} />
                </>
            );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 md:p-8 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 {/* Unit Toggle & Gender (Common) */}
                 <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-2">
                    <h3 className="font-bold text-gray-800 dark:text-white">Your Details</h3>
                    <div className="flex bg-gray-100 dark:bg-slate-700 p-0.5 rounded-lg">
                        <button onClick={() => setUnitSystem('metric')} className={`px-3 py-1 text-xs font-bold rounded-md ${unitSystem === 'metric' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Metric</button>
                        <button onClick={() => setUnitSystem('imperial')} className={`px-3 py-1 text-xs font-bold rounded-md ${unitSystem === 'imperial' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Imperial</button>
                    </div>
                 </div>
                 
                 {tool.id === ToolID.STEP_COUNTER_TO_DISTANCE && (
                     <>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                            <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
                               <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-md font-medium text-sm ${gender === 'male' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Male</button>
                               <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-md font-medium text-sm ${gender === 'female' ? 'bg-white shadow text-pink-500' : 'text-gray-500'}`}>Female</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Height ({unitSystem === 'metric' ? 'cm' : 'ft & in'})</label>
                            {unitSystem === 'metric' ? (
                                <input type="number" value={Math.round(height)} onChange={(e) => setHeight(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            ) : (
                                <div className="flex gap-2">
                                    <input type="number" value={getHeightFt()} onChange={(e) => handleHeightFtChange(parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ft" />
                                    <input type="number" value={getHeightIn()} onChange={(e) => handleHeightInChange(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="in" />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Steps Walked</label>
                            <input type="number" value={steps} onChange={(e) => setSteps(parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                     </>
                 )}

                 {/* Gender/Age/Height/Weight inputs for standard fitness tools */}
                 {tool.id !== ToolID.STEP_COUNTER_TO_DISTANCE && tool.id !== ToolID.PREGNANCY_CALCULATOR && tool.id !== ToolID.DUE_DATE_CALCULATOR && tool.id !== ToolID.OVULATION_CALCULATOR && tool.id !== ToolID.CONCEPTION_CALCULATOR && tool.id !== ToolID.PERIOD_CALCULATOR && tool.id !== ToolID.PREGNANCY_CONCEPTION_CALCULATOR && (
                     <>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                            <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
                               <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-md font-medium text-sm ${gender === 'male' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Male</button>
                               <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-md font-medium text-sm ${gender === 'female' ? 'bg-white shadow text-pink-500' : 'text-gray-500'}`}>Female</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Age</label><input type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value))} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 dark:text-gray-300">Weight ({getWeightUnit()})</label>
                                <input type="number" value={getWeightDisplay()} onChange={(e) => handleWeightChange(parseFloat(e.target.value))} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Height ({unitSystem === 'metric' ? 'cm' : 'ft & in'})</label>
                            {unitSystem === 'metric' ? (
                                <input type="number" value={Math.round(height)} onChange={(e) => setHeight(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            ) : (
                                <div className="flex gap-2">
                                    <input type="number" value={getHeightFt()} onChange={(e) => handleHeightFtChange(parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ft" />
                                    <input type="number" value={getHeightIn()} onChange={(e) => handleHeightInChange(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="in" />
                                </div>
                            )}
                        </div>
                     </>
                 )}

                 {/* Activity Level Selector */}
                 {(tool.id === ToolID.TDEE_CALCULATOR || tool.id === ToolID.MACRO_CALCULATOR || tool.id === ToolID.CALORIE_CALCULATOR || tool.id === ToolID.PROTEIN_CALCULATOR || tool.id === ToolID.CARBOHYDRATE_CALCULATOR || tool.id === ToolID.FAT_INTAKE_CALCULATOR) && (
                     <div>
                         <label className="block text-sm font-semibold mb-2 dark:text-gray-300">Activity Level</label>
                         <select value={activity} onChange={(e) => setActivity(parseFloat(e.target.value))} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                             <option value={1.2}>Sedentary (Little or no exercise)</option>
                             <option value={1.375}>Lightly active (Exercise 1-3 days/week)</option>
                             <option value={1.55}>Moderately active (Exercise 3-5 days/week)</option>
                             <option value={1.725}>Very active (Exercise 6-7 days/week)</option>
                             <option value={1.9}>Extra active (Very hard exercise/physical job)</option>
                         </select>
                     </div>
                 )}

                 {/* Body Part Measurements */}
                 {(tool.id === ToolID.BODY_FAT_CALCULATOR || tool.id === ToolID.ARMY_BODY_FAT_CALCULATOR || tool.id === ToolID.BODY_TYPE_CALCULATOR) && (
                     <div className="space-y-4">
                         {tool.id !== ToolID.BODY_TYPE_CALCULATOR && (
                             <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Neck ({unitSystem === 'metric' ? 'cm' : 'in'})</label><input type="number" value={getMeasurementDisplay(neck)} onChange={(e) => handleMeasurementChange(parseFloat(e.target.value), setNeck)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                         )}
                         <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Waist ({unitSystem === 'metric' ? 'cm' : 'in'})</label><input type="number" value={getMeasurementDisplay(waist)} onChange={(e) => handleMeasurementChange(parseFloat(e.target.value), setWaist)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                         {(gender === 'female' || tool.id === ToolID.BODY_TYPE_CALCULATOR) && (
                             <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Hip ({unitSystem === 'metric' ? 'cm' : 'in'})</label><input type="number" value={getMeasurementDisplay(hip)} onChange={(e) => handleMeasurementChange(parseFloat(e.target.value), setHip)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                         )}
                         {tool.id === ToolID.BODY_TYPE_CALCULATOR && (
                             <>
                                <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Bust ({unitSystem === 'metric' ? 'cm' : 'in'})</label><input type="number" value={getMeasurementDisplay(bust)} onChange={(e) => handleMeasurementChange(parseFloat(e.target.value), setBust)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">High Hip ({unitSystem === 'metric' ? 'cm' : 'in'})</label><input type="number" value={getMeasurementDisplay(highHip)} onChange={(e) => handleMeasurementChange(parseFloat(e.target.value), setHighHip)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                             </>
                         )}
                     </div>
                 )}

                 {/* Specific Inputs */}
                 {tool.id === ToolID.PACE_CALCULATOR && (
                     <div className="grid grid-cols-2 gap-4">
                         <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Distance ({unitSystem === 'metric' ? 'km' : 'miles'})</label><input type="number" value={getDistanceDisplay()} onChange={(e) => handleDistanceChange(parseFloat(e.target.value))} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                         <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Time (min)</label><input type="number" value={timeMinutes} onChange={(e) => setTimeMinutes(parseFloat(e.target.value))} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                     </div>
                 )}

                 {/* Female Health */}
                 {(tool.id === ToolID.PREGNANCY_CALCULATOR || tool.id === ToolID.DUE_DATE_CALCULATOR || tool.id === ToolID.OVULATION_CALCULATOR || tool.id === ToolID.CONCEPTION_CALCULATOR || tool.id === ToolID.PREGNANCY_CONCEPTION_CALCULATOR || tool.id === ToolID.PERIOD_CALCULATOR) && (
                     <div className="space-y-4">
                         <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">First Day of Last Period</label><input type="date" value={lastPeriodDate} onChange={(e) => setLastPeriodDate(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                         {(tool.id === ToolID.OVULATION_CALCULATOR || tool.id === ToolID.PERIOD_CALCULATOR) && (
                             <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Average Cycle Length (days)</label><input type="number" value={cycleLength} onChange={(e) => setCycleLength(parseInt(e.target.value))} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                         )}
                     </div>
                 )}

                 <button onClick={calculate} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-blue-700 transition">Calculate</button>
              </div>

              <div className="bg-blue-50 dark:bg-slate-900/50 rounded-xl p-8 flex flex-col justify-center items-center text-center relative border border-blue-100 dark:border-slate-700 h-full min-h-[300px]">
                  {!result ? (
                      <div className="text-gray-500 dark:text-gray-400">
                          <p>Enter details to calculate</p>
                      </div>
                  ) : (
                      <div className="w-full animate-fadeIn">
                          <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">{result.note || tool.title}</p>
                          <h2 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">{result.value} <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">{result.unit}</span></h2>
                          {result.category && <div className="inline-block px-4 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 mt-2">{result.category}</div>}
                      </div>
                  )}
              </div>
          </div>
      </div>
      <div className="mt-16 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">{getSEOContent()}</div>
    </div>
  );
};
