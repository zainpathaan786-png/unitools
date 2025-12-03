
import React, { useState, useEffect, useRef } from 'react';
import { ToolDefinition, ToolID } from '../../types';

interface Props {
  tool: ToolDefinition;
}

const TIME_ZONES = [
    "UTC", "GMT", "America/New_York", "America/Los_Angeles", "America/Chicago", 
    "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Tokyo", "Asia/Shanghai", 
    "Asia/Kolkata", "Australia/Sydney", "Pacific/Auckland", "America/Sao_Paulo", "Africa/Johannesburg"
];

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

export const DateTimeTool: React.FC<Props> = ({ tool }) => {
  // Shared states
  const [date1, setDate1] = useState<string>('');
  const [date2, setDate2] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [result, setResult] = useState<any>(null);

  // Time Add/Subtract & Time Calc
  const [timeValue, setTimeValue] = useState<number>(0);
  const [timeUnit, setTimeUnit] = useState<string>('hours');
  const [operation, setOperation] = useState<string>('add');
  const [baseTime, setBaseTime] = useState<string>('12:00');

  // Hours Calculator
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');

  // Date Calculator
  const [dateValue, setDateValue] = useState<number>(1);
  const [dateUnit, setDateUnit] = useState<string>('days');

  // Time Zone
  const [sourceTime, setSourceTime] = useState<string>('');
  const [targetZone, setTargetZone] = useState<string>('America/New_York');

  // Time Card
  const [timeCardData, setTimeCardData] = useState(
      WEEK_DAYS.map(day => ({ day, in: '', out: '', break: 0 }))
  );

  // --- New Tools State ---
  // Stopwatch
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  
  // Countdown
  const [countdownTarget, setCountdownTarget] = useState({h: 0, m: 5, s: 0});
  const [countdownRemaining, setCountdownRemaining] = useState<number | null>(null);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);

  // Business Days
  const [includeWeekends, setIncludeWeekends] = useState(false);

  // Pomodoro
  const [pomoState, setPomoState] = useState<'work' | 'break'>('work');
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(false);

  // Time to Decimal
  const [decimalHours, setDecimalHours] = useState(0);
  const [decimalMinutes, setDecimalMinutes] = useState(0);

  // Calendar
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  // Leap Year
  const [leapYearInput, setLeapYearInput] = useState(new Date().getFullYear());

  useEffect(() => {
    setResult(null);
    const today = new Date().toISOString().split('T')[0];
    setDate1(today);
    setDate2(today);
    setDob('2000-01-01');
    setTimeValue(1);
    setStartTime('09:00');
    setEndTime('17:00');
    setBaseTime('12:00');
    // Set default local time string for datetime-local inputs
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setSourceTime(now.toISOString().slice(0, 16));
    
    // Reset Time Card
    setTimeCardData(WEEK_DAYS.map(day => ({ day, in: '', out: '', break: 0 })));

    // Reset Timers
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
    setIsCountdownRunning(false);
    setCountdownRemaining(null);
    setIsPomoRunning(false);
    setPomoTime(25 * 60);
    setPomoState('work');
  }, [tool.id]);

  // Timer Effects
  useEffect(() => {
      let interval: any;
      if (isStopwatchRunning) {
          interval = setInterval(() => setStopwatchTime(prev => prev + 10), 10);
      }
      return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  useEffect(() => {
      let interval: any;
      if (isCountdownRunning && countdownRemaining !== null && countdownRemaining > 0) {
          interval = setInterval(() => setCountdownRemaining(prev => (prev && prev > 0 ? prev - 1 : 0)), 1000);
      } else if (countdownRemaining === 0 && isCountdownRunning) {
          setIsCountdownRunning(false);
          alert("Time's up!");
      }
      return () => clearInterval(interval);
  }, [isCountdownRunning, countdownRemaining]);

  useEffect(() => {
      let interval: any;
      if (isPomoRunning && pomoTime > 0) {
          interval = setInterval(() => setPomoTime(prev => prev - 1), 1000);
      } else if (pomoTime === 0 && isPomoRunning) {
          setIsPomoRunning(false);
          if (pomoState === 'work') {
              alert("Work session done! Take a break.");
              setPomoState('break');
              setPomoTime(5 * 60);
          } else {
              alert("Break over! Back to work.");
              setPomoState('work');
              setPomoTime(25 * 60);
          }
      }
      return () => clearInterval(interval);
  }, [isPomoRunning, pomoTime, pomoState]);


  const calculate = () => {
     if (tool.id === ToolID.AGE_CALCULATOR) {
         if (!dob) return;
         const birthDate = new Date(dob);
         const today = new Date();
         
         let years = today.getFullYear() - birthDate.getFullYear();
         let months = today.getMonth() - birthDate.getMonth();
         let days = today.getDate() - birthDate.getDate();

         if (days < 0) {
             months--;
             // Get previous month's last day to know how many days to borrow
             days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
         }
         if (months < 0) {
             years--;
             months += 12;
         }

         // Detailed Stats
         const diffTime = Math.abs(today.getTime() - birthDate.getTime());
         const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
         const totalWeeks = Math.floor(totalDays / 7);
         const totalMonths = (years * 12) + months;
         const totalHours = totalDays * 24;
         const totalMinutes = totalHours * 60;

         // Next Birthday
         const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
         if (today > nextBirthday) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
         const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
         const nextBirthdayDay = nextBirthday.toLocaleDateString(undefined, { weekday: 'long' });

         setResult({ 
             years, months, days,
             totalMonths, totalWeeks, totalDays, totalHours, totalMinutes,
             nextBirthday: { days: daysToNextBirthday, weekday: nextBirthdayDay, date: nextBirthday.toLocaleDateString() },
             bornDay: birthDate.toLocaleDateString(undefined, { weekday: 'long' })
         });
     } 
     else if (tool.id === ToolID.DATE_DIFFERENCE || tool.id === ToolID.DAY_COUNTER) {
         let start = new Date(date1);
         let end = new Date(date2);
         
         // Swap if needed so start is always before end for logic
         if (start > end) {
             const temp = start;
             start = end;
             end = temp;
         }

         // Absolute Diff for Totals
         const diffTime = Math.abs(end.getTime() - start.getTime());
         const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
         const totalHours = totalDays * 24;
         const totalWeeks = Math.floor(totalDays / 7);
         const remainingDaysTotal = totalDays % 7;

         // Precise Y/M/D diff
         let years = end.getFullYear() - start.getFullYear();
         let months = end.getMonth() - start.getMonth();
         let days = end.getDate() - start.getDate();

         if (days < 0) {
             months--;
             // Get days in previous month relative to 'end' date to borrow correct amount
             // new Date(year, month, 0) is last day of previous month
             const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
             days += prevMonth.getDate();
         }
         if (months < 0) {
             years--;
             months += 12;
         }

         setResult({ 
             totalDays, 
             years, months, days,
             totalWeeks, remainingDays: remainingDaysTotal, totalHours
         });
     } 
     else if (tool.id === ToolID.TIME_ADD_SUBTRACT || tool.id === ToolID.TIME_CALCULATOR) {
         const d1 = tool.id === ToolID.TIME_CALCULATOR ? new Date(`2000-01-01T${baseTime}`) : new Date(date1);
         
         let multiplier = operation === 'add' ? 1 : -1;
         let msToAdd = 0;
         
         if (timeUnit === 'hours') msToAdd = timeValue * 60 * 60 * 1000;
         else if (timeUnit === 'minutes') msToAdd = timeValue * 60 * 1000;
         else if (timeUnit === 'seconds') msToAdd = timeValue * 1000;

         const newDate = new Date(d1.getTime() + (msToAdd * multiplier));
         
         if (tool.id === ToolID.TIME_CALCULATOR) {
             setResult({ value: newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) });
         } else {
             setResult({ 
                 value: newDate.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }),
                 simple: newDate.toLocaleString()
             });
         }
     }
     else if (tool.id === ToolID.DATE_CALCULATOR) {
         const d1 = new Date(date1);
         let multiplier = operation === 'add' ? 1 : -1;
         
         if (dateUnit === 'days') d1.setDate(d1.getDate() + (dateValue * multiplier));
         else if (dateUnit === 'weeks') d1.setDate(d1.getDate() + (dateValue * 7 * multiplier));
         else if (dateUnit === 'months') d1.setMonth(d1.getMonth() + (dateValue * multiplier));
         else if (dateUnit === 'years') d1.setFullYear(d1.getFullYear() + (dateValue * multiplier));
         
         // Calculate Week Number
         const startOfYear = new Date(d1.getFullYear(), 0, 1);
         const pastDays = Math.floor((d1.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
         const weekNum = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);

         setResult({ 
             value: d1.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
             dayOfYear: pastDays + 1,
             weekNum
         });
     }
     else if (tool.id === ToolID.HOURS_CALCULATOR || tool.id === ToolID.TIME_DURATION_CALCULATOR) {
         let s: Date, e: Date;
         if (tool.id === ToolID.TIME_DURATION_CALCULATOR) {
             s = new Date(date1); // Datetime inputs
             e = new Date(date2);
         } else {
             s = new Date(`2000-01-01T${startTime}`);
             e = new Date(`2000-01-01T${endTime}`);
             if (e < s) e.setDate(e.getDate() + 1); // Crosses midnight
         }
         
         const diffMs = Math.abs(e.getTime() - s.getTime());
         const hours = Math.floor(diffMs / 3600000);
         const minutes = Math.floor((diffMs % 3600000) / 60000);
         
         const totalDecimal = (diffMs / 3600000).toFixed(2);
         const totalMinutes = Math.floor(diffMs / 60000);
         const totalSeconds = Math.floor(diffMs / 1000);

         setResult({ hours, minutes, totalMinutes, totalSeconds, totalDecimal });
     }
     else if (tool.id === ToolID.DAY_OF_WEEK_CALCULATOR) {
         const d = new Date(date1);
         const startOfYear = new Date(d.getFullYear(), 0, 1);
         const pastDays = Math.floor((d.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
         const weekNum = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
         
         setResult({ 
             value: d.toLocaleDateString(undefined, { weekday: 'long' }),
             dayOfYear: pastDays + 1,
             weekNum
         });
     }
     else if (tool.id === ToolID.TIME_ZONE_CALCULATOR) {
         if (!sourceTime) return;
         const date = new Date(sourceTime);
         
         try {
             const options: Intl.DateTimeFormatOptions = {
                 timeZone: targetZone,
                 year: 'numeric', month: 'long', day: 'numeric',
                 hour: 'numeric', minute: 'numeric', second: 'numeric',
                 hour12: true,
                 weekday: 'long'
             };
             
             const targetStr = new Intl.DateTimeFormat('en-US', options).format(date);
             
             // Get Offset roughly
             const targetDate = new Date(new Date().toLocaleString("en-US", { timeZone: targetZone }));
             const localDate = new Date();
             const offsetHours = (targetDate.getTime() - localDate.getTime()) / 3600000;
             const offsetStr = offsetHours > 0 ? `+${offsetHours.toFixed(1)}` : offsetHours.toFixed(1);

             setResult({ value: targetStr, note: `Target: ${targetZone}`, offset: offsetStr });
         } catch (e) {
             setResult({ value: "Error", note: "Invalid Time Zone" });
         }
     }
     else if (tool.id === ToolID.TIME_CARD_CALCULATOR) {
         let totalMins = 0;
         let daysWorked = 0;
         
         timeCardData.forEach(d => {
             if (d.in && d.out) {
                 daysWorked++;
                 const s = new Date(`2000-01-01T${d.in}`);
                 const e = new Date(`2000-01-01T${d.out}`);
                 if (e < s) e.setDate(e.getDate() + 1);
                 
                 let diff = (e.getTime() - s.getTime()) / 60000; // mins
                 diff -= (d.break || 0);
                 if (diff > 0) totalMins += diff;
             }
         });
         
         const h = Math.floor(totalMins / 60);
         const m = totalMins % 60;
         const avgMins = daysWorked > 0 ? totalMins / daysWorked : 0;
         const avgH = Math.floor(avgMins / 60);
         const avgM = Math.round(avgMins % 60);

         setResult({ 
             hours: h, 
             minutes: m, 
             totalDecimal: (totalMins / 60).toFixed(2),
             daysWorked,
             avgHours: avgH,
             avgMinutes: avgM
         });
     }

     // --- NEW TOOLS ---
     else if (tool.id === ToolID.BUSINESS_DAYS_CALCULATOR) {
         let start = new Date(date1);
         let end = new Date(date2);
         if (start > end) { const temp = start; start = end; end = temp; }
         
         let count = 0;
         const cur = new Date(start);
         while (cur <= end) {
             const day = cur.getDay();
             if (includeWeekends || (day !== 0 && day !== 6)) {
                 count++;
             }
             cur.setDate(cur.getDate() + 1);
         }
         setResult({ value: count, unit: 'days' });
     }
     else if (tool.id === ToolID.TIME_TO_DECIMAL_CONVERTER) {
         const total = decimalHours + (decimalMinutes / 60);
         setResult({ value: total.toFixed(2), unit: 'hours', note: `${decimalHours}h ${decimalMinutes}m` });
     }
     else if (tool.id === ToolID.WEEK_NUMBER_CALCULATOR) {
         const d = new Date(date1);
         const startOfYear = new Date(d.getFullYear(), 0, 1);
         const pastDays = Math.floor((d.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
         const weekNum = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
         setResult({ value: weekNum, unit: '', note: `Week Number for ${d.toLocaleDateString()}` });
     }
     else if (tool.id === ToolID.LEAP_YEAR_CHECKER) {
         const year = leapYearInput;
         const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
         setResult({ value: isLeap ? "Yes" : "No", unit: '', note: `${year} is ${isLeap ? '' : 'not'} a leap year.` });
     }
  };

  // Helper Methods
  const updateTimeCard = (index: number, field: 'in' | 'out' | 'break', val: any) => {
      const newData = [...timeCardData];
      newData[index] = { ...newData[index], [field]: val };
      setTimeCardData(newData);
  };

  const formatTime = (ms: number) => {
      const mins = Math.floor(ms / 60000);
      const secs = Math.floor((ms % 60000) / 1000);
      const centis = Math.floor((ms % 1000) / 10);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  };

  const formatSeconds = (s: number) => {
      const mins = Math.floor(s / 60);
      const secs = s % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calendar Gen Logic
  const renderCalendar = () => {
      const startDay = new Date(calYear, calMonth, 1).getDay(); // 0 = Sun
      const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
      
      const weeks = [];
      let days = [];
      // Pad empty start
      for(let i=0; i<startDay; i++) days.push(null);
      // Fill days
      for(let i=1; i<=daysInMonth; i++) days.push(i);
      
      // Split into weeks
      while(days.length > 0) {
          weeks.push(days.splice(0, 7));
      }
      return weeks;
  };

  const getSEOContent = () => {
    const DEFAULT_KEYWORDS = ['python3 datetime', 'strftime in python', 'datetime python', 'date and time in javascript', 'date time javascript', 'datetime date', 'datetime module in python', 'datetime strptime', 'datetime timedelta', 'date and time in python', 'datetime time python', 'unix time to date', 'current timestamp', 'current unix timestamp', 'date to epoch', 'date to unix timestamp', 'datetime to unix timestamp', 'epoch time to date', 'timestamp date', 'time stamp to date time online', 'timestamp to datetime online', 'date and', 'date tools', 'time tools', 'online clock', 'developer tools', 'timestamp converter', 'epoch converter', 'date parser', 'time manipulation', 'date format', 'time utility'];

    switch(tool.id) {
        // --- Group 1: Age & Date Calc ---
        case ToolID.AGE_CALCULATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Accurate Age Calculator</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Determine your <strong>exact age</strong> down to the minute with our precision tool. Our <strong>age calculator</strong> is designed to provide you with a detailed breakdown of your life span, far beyond just the year. Simply enter your date of birth, and we will calculate your <strong>chronological age</strong> in years, months, weeks, days, hours, and even minutes. It is perfect for finding out exactly how old you are for applications, medical forms, or just out of curiosity to see how many seconds you have been alive.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Beyond just simple years, this tool acts as a fun <strong>birthday countdown</strong> by showing you exactly how many days are left until your next big celebration. It also provides interesting statistics, such as your <strong>age in days</strong>, which is a popular metric for milestones like your 10,000th day. This <strong>age finder</strong> is completely free and works instantly in your browser without any data storage, ensuring your birth date remains private.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Use it to calculate age differences between family members, determine if you are eligible for certain age-restricted activities, or calculate the age of historical events. Whether you need to <strong>calculate age</strong> for a legal document or just want to know your <strong>date of birth calculator</strong> results for fun, this tool delivers precise results every time. We account for leap years and specific month lengths to ensure the highest accuracy.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        In addition to personal use, this tool is valuable for HR professionals and administrators who need to verify age-related eligibility quickly. By providing a clear breakdown, it eliminates ambiguity. Whether you are calculating the age of a person, a building, or an event, our <strong>age calculator</strong> is the reliable digital assistant you need. Start tracking your journey through time today with our comprehensive <strong>age finder</strong> utility.
                    </p>
                    <KeywordsBox keywords={[...DEFAULT_KEYWORDS, 'chronological age', 'exact age calculator', 'birthday countdown', 'age in days', 'calculate age', 'age finder', 'date of birth calculator']} />
                </>
            );

        case ToolID.DATE_CALCULATOR:
        case ToolID.LEAP_YEAR_CHECKER:
        case ToolID.WEEK_NUMBER_CALCULATOR:
        case ToolID.DAY_OF_WEEK_CALCULATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Date Calculation Utilities</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Perform complex date arithmetic with ease using our suite of <strong>date tools</strong>. Our <strong>date calculator</strong> allows you to add or subtract days, weeks, months, or years from any starting date. This is essential for determining contract expiration dates, project deadlines, or finding out what the date will be 90 days from now. Whether you are planning a wedding, a vacation, or a product launch, knowing the exact future date is crucial for effective scheduling.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Need to know if a specific year has 366 days? Our <strong>leap year checker</strong> answers 'is it a leap year' instantly, helping you handle date logic correctly in your own planning or programming. We also offer a <strong>week number calculator</strong> to find the current <strong>ISO week number</strong> for business planning. Many corporate schedules and supply chains rely on week numbers rather than dates, making this tool indispensable for logistics and project management.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Additionally, our <strong>day of week finder</strong> tells you which day you were born on or what day of the week a future holiday falls on. These tools serve as a comprehensive <strong>calendar calculator</strong> for all your planning needs. Whether you need to check for a <strong>leap year</strong>, find the <strong>current week number</strong>, or perform general <strong>date math</strong>, our utilities are fast, accurate, and free. Stop counting on your fingers and let our algorithms handle the calendar logic for you.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        From calculating gestational ages to determining invoice due dates, the applications are endless. You can <strong>add days to date</strong> to verify delivery windows or subtract time to find past occurrences. Our suite is designed to be your go-to reference for any time-related query, providing a <strong>future date calculator</strong> that is always accessible and easy to use.
                    </p>
                    <KeywordsBox keywords={[...DEFAULT_KEYWORDS, 'date math', 'leap year checker', 'iso week number', 'add days to date', 'calendar calculator', 'day of week finder', 'what week is it', 'future date calculator']} />
                </>
            );

        // --- Group 2: Duration & Difference ---
        case ToolID.DATE_DIFFERENCE:
        case ToolID.DAY_COUNTER:
        case ToolID.BUSINESS_DAYS_CALCULATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Date Difference & Duration</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Calculate the exact <strong>days between dates</strong> with our precision timing tools. Whether you are tracking a project timeline, calculating your tenure at a job, or counting down to an event, knowing the exact <strong>time duration</strong> is crucial. Our <strong>day counter</strong> gives you the total number of days, weeks, and months between any two dates, handling the complex calendar math of varying month lengths and leap years automatically.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        For business professionals, our <strong>business days calculator</strong> is indispensable. It allows you to calculate the number of <strong>working days</strong> between two dates, automatically excluding weekends. This is perfect for estimating delivery times, <strong>shipping days</strong>, or project sprints where you need to <strong>exclude weekends</strong> from your timeline. Accurate estimation of business days ensures you meet deadlines and manage client expectations effectively.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Use these tools as a <strong>date range calculator</strong> or <strong>time span calculator</strong>. They provide the clarity you need for scheduling and planning, ensuring you never miscalculate a deadline again. Whether you are planning a vacation and need to know the duration or calculating interest for a financial period, our tools provide the exact figures. You can also use it to determine the <strong>time duration</strong> of historical events or the gap between two significant life moments.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Understanding the span between dates helps in legal contexts, visa applications, and subscription management. Our <strong>calculate duration</strong> feature is robust and user-friendly. Instead of manually scanning a calendar, simply input your start and end dates to get an instant, accurate count of the days, weeks, and months involved. This <strong>day counter</strong> is the ultimate tool for anyone who needs to manage time intervals with precision.
                    </p>
                    <KeywordsBox keywords={[...DEFAULT_KEYWORDS, 'days between dates', 'business days calculator', 'working days', 'date range calculator', 'time span calculator', 'day counter', 'exclude weekends', 'calculate duration']} />
                </>
            );

        // --- Group 3: Time Math ---
        case ToolID.TIME_ADD_SUBTRACT:
        case ToolID.TIME_CALCULATOR:
        case ToolID.HOURS_CALCULATOR:
        case ToolID.TIME_DURATION_CALCULATOR:
        case ToolID.TIME_TO_DECIMAL_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Time Calculator & Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Simplify your scheduling and payroll tasks with our comprehensive <strong>time calculator</strong> tools. Easily <strong>add time to date</strong> or subtract hours and minutes to find a precise future or past moment. Our <strong>hours calculator</strong> helps you determine the <strong>elapsed time</strong> between a start and end time, which is perfect for logging work hours, calculating flight durations, or tracking time spent on specific tasks.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        For payroll and invoicing, our <strong>time to decimal</strong> converter is a game-changer. It transforms "8 hours 30 minutes" into "8.5 hours" instantly. This <strong>decimal time conversion</strong> is essential for accurate billing and financial calculations where standard time formats cannot be used directly. We also handle complex <strong>time math</strong> operations involving dates and timestamps, ensuring you always get the correct result regardless of AM/PM shifts or day changes.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Whether you need a <strong>duration calculator</strong> for video editing, a <strong>work hours tracker</strong> for your timesheets, or just need to perform simple <strong>time subtraction</strong>, our suite covers all aspects of <strong>time manipulation</strong>. Avoid the mental gymnastics of base-60 math and let our tools handle the conversions for you. Improve your productivity and accuracy with these essential time utilities.
                    </p>
                    <KeywordsBox keywords={[...DEFAULT_KEYWORDS, 'add time to date', 'hours calculator', 'time to decimal', 'elapsed time', 'time duration', 'decimal time conversion', 'work hours tracker', 'payroll calculator', 'time math']} />
                </>
            );

        // --- Group 4: Time Management/Timers ---
        case ToolID.STOPWATCH:
        case ToolID.COUNTDOWN_TIMER:
        case ToolID.POMODORO_TIMER:
        case ToolID.TIME_CARD_CALCULATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Timers & Productivity Tools</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Boost your daily productivity with our suite of <strong>online timer</strong> tools tailored for focus and efficiency. Our <strong>pomodoro timer</strong> helps you implement the famous technique of working in focused 25-minute intervals separated by short breaks. It is the perfect <strong>focus timer</strong> for students, writers, and remote workers looking to minimize distractions and maximize output. Need to track an event or a deadline? Use our customizable <strong>countdown timer</strong> or our precise <strong>online stopwatch</strong> with lap functionality for sports and cooking.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        For employees and freelancers, our <strong>time card calculator</strong> makes tracking <strong>weekly work hours</strong> effortless. Simply input your clock-in and clock-out times for each day, and the tool will automatically calculate your total daily and weekly hours, including break deductions. It acts as a digital <strong>weekly timesheet</strong> to streamline your payroll process and ensure you are paid for every minute you work.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Whether you need a <strong>lap timer</strong> for interval training, a reliable <strong>alarm clock online</strong> for reminders, or a comprehensive <strong>payroll hours calculator</strong>, these browser-based tools are always ready to use. They require no installation and work seamlessly across all devices, helping you manage your time effectively wherever you are.
                    </p>
                    <KeywordsBox keywords={[...DEFAULT_KEYWORDS, 'online stopwatch', 'pomodoro timer', 'countdown timer', 'time card calculator', 'weekly timesheet', 'focus timer', 'lap timer', 'work hours calculator', 'productivity timer']} />
                </>
            );

        // --- Group 5: Time Zone ---
        case ToolID.TIME_ZONE_CALCULATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">World Time Zone Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        In an increasingly connected world, scheduling international meetings can be a headache. Our <strong>time zone converter</strong> allows you to instantly compare time differences between cities and time zones like UTC, GMT, EST, PST, and many more. It acts as a reliable <strong>world clock</strong> for global coordination, helping you find the perfect time slot for calls across continents without the risk of waking someone up in the middle of the night.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        You can easily convert <strong>utc to local time</strong> or check what time it will be in Tokyo when it's 9 AM in New York. This tool handles daylight saving time adjustments automatically, ensuring your <strong>international meeting planner</strong> data is always accurate. No more manual calculations or guessing games—just clear, converted times presented side-by-side.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Whether you are a frequent traveler, a remote worker with a distributed team, or simply coordinating with friends abroad, this <strong>time difference calculator</strong> simplifies <strong>global time</strong> management. It supports all major time zones and provides instant offsets, making it the essential tool for anyone operating on a global schedule.
                    </p>
                    <KeywordsBox keywords={[...DEFAULT_KEYWORDS, 'time zone converter', 'world clock', 'utc to local time', 'international meeting planner', 'time difference calculator', 'global time', 'est to pst', 'gmt converter']} />
                </>
            );

        // --- Group 6: Visual ---
        case ToolID.CALENDAR_GENERATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Online Calendar Generator</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Create and view a custom calendar for any month and year instantly. Our <strong>calendar generator</strong> allows you to navigate through time to check dates, plan events, or visualize your schedule. It serves as a simple, printable <strong>monthly calendar</strong> reference that you can use to organize your life. Whether you are looking back at a past date or planning for the future, this tool generates a clear and concise layout.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Need to see the layout for next year? Or verify a date from the past? This <strong>online calendar</strong> provides a clean grid view for any specific month you choose. It is perfect for creating a quick <strong>printable calendar</strong> view without complex software or subscriptions. You can use it to verify the day of the week for any date in history or the future.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Use this <strong>calendar maker</strong> to stay organized. Whether you need a full <strong>year calendar</strong> reference or just a specific month's layout, this tool generates it instantly in your browser. It's a handy utility for anyone who prefers a simple, visual representation of dates over a digital list.
                    </p>
                    <KeywordsBox keywords={[...DEFAULT_KEYWORDS, 'calendar generator', 'printable calendar', 'monthly calendar', 'online calendar', 'calendar maker', 'year calendar', 'blank calendar', 'calendar view']} />
                </>
            );

        default:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Comprehensive Date & Time Tools</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        We provide a suite of tools for developers and users alike. Whether you are working with **python3 datetime**, formatting **strftime in python**, or manipulating **date and time in javascript**, our calculators act as a quick reference. Convert **unix time to date**, translate **date to epoch**, or perform **timestamp to datetime online** conversions.
                    </p>
                    <KeywordsBox keywords={DEFAULT_KEYWORDS} />
                </>
            );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-8 animate-fadeIn">
         
         {/* --- STOPWATCH --- */}
         {tool.id === ToolID.STOPWATCH && (
             <div className="text-center space-y-8">
                 <div className="text-7xl md:text-9xl font-mono font-bold text-gray-800 dark:text-white tabular-nums tracking-wider">
                     {formatTime(stopwatchTime)}
                 </div>
                 <div className="flex justify-center gap-4">
                     {!isStopwatchRunning ? (
                         <button onClick={() => setIsStopwatchRunning(true)} className="bg-green-600 text-white px-8 py-3 rounded-full text-xl font-bold shadow-lg hover:bg-green-700 transition w-32">Start</button>
                     ) : (
                         <button onClick={() => setIsStopwatchRunning(false)} className="bg-red-600 text-white px-8 py-3 rounded-full text-xl font-bold shadow-lg hover:bg-red-700 transition w-32">Stop</button>
                     )}
                     <button onClick={() => { setIsStopwatchRunning(false); setStopwatchTime(0); setLaps([]); }} className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-full text-xl font-bold hover:bg-gray-300 dark:hover:bg-slate-600 transition">Reset</button>
                     <button onClick={() => setLaps([...laps, stopwatchTime])} disabled={!isStopwatchRunning} className="bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-400 px-8 py-3 rounded-full text-xl font-bold hover:bg-blue-200 transition disabled:opacity-50">Lap</button>
                 </div>
                 {laps.length > 0 && (
                     <div className="max-h-60 overflow-y-auto border-t border-gray-200 dark:border-slate-700 pt-4">
                         <table className="w-full text-left">
                             <thead>
                                 <tr><th className="p-2 text-gray-500">Lap</th><th className="p-2 text-gray-500 text-right">Time</th></tr>
                             </thead>
                             <tbody>
                                 {laps.map((lap, idx) => (
                                     <tr key={idx} className="border-b border-gray-100 dark:border-slate-700">
                                         <td className="p-2 font-mono text-gray-700 dark:text-gray-300">#{idx+1}</td>
                                         <td className="p-2 font-mono text-right text-gray-900 dark:text-white">{formatTime(lap)}</td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 )}
             </div>
         )}

         {/* --- COUNTDOWN TIMER --- */}
         {tool.id === ToolID.COUNTDOWN_TIMER && (
             <div className="text-center space-y-8">
                 {countdownRemaining === null ? (
                     <div className="flex justify-center gap-4 items-center">
                         <div className="flex flex-col"><input type="number" value={countdownTarget.h} onChange={(e) => setCountdownTarget({...countdownTarget, h: parseInt(e.target.value) || 0})} className="w-20 p-2 text-center text-2xl border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /><span className="text-xs text-gray-500 mt-1">Hours</span></div>
                         <div className="text-2xl font-bold">:</div>
                         <div className="flex flex-col"><input type="number" value={countdownTarget.m} onChange={(e) => setCountdownTarget({...countdownTarget, m: parseInt(e.target.value) || 0})} className="w-20 p-2 text-center text-2xl border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /><span className="text-xs text-gray-500 mt-1">Mins</span></div>
                         <div className="text-2xl font-bold">:</div>
                         <div className="flex flex-col"><input type="number" value={countdownTarget.s} onChange={(e) => setCountdownTarget({...countdownTarget, s: parseInt(e.target.value) || 0})} className="w-20 p-2 text-center text-2xl border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /><span className="text-xs text-gray-500 mt-1">Secs</span></div>
                     </div>
                 ) : (
                     <div className="text-7xl md:text-9xl font-mono font-bold text-gray-800 dark:text-white tabular-nums tracking-wider">
                         {Math.floor(countdownRemaining / 3600).toString().padStart(2, '0')}:
                         {Math.floor((countdownRemaining % 3600) / 60).toString().padStart(2, '0')}:
                         {(countdownRemaining % 60).toString().padStart(2, '0')}
                     </div>
                 )}
                 
                 <div className="flex justify-center gap-4">
                     {countdownRemaining === null ? (
                         <button onClick={() => {
                             const totalSecs = (countdownTarget.h * 3600) + (countdownTarget.m * 60) + countdownTarget.s;
                             if(totalSecs > 0) { setCountdownRemaining(totalSecs); setIsCountdownRunning(true); }
                         }} className="bg-blue-600 text-white px-8 py-3 rounded-full text-xl font-bold shadow-lg hover:bg-blue-700 transition">Start Timer</button>
                     ) : (
                         <>
                             <button onClick={() => setIsCountdownRunning(!isCountdownRunning)} className={`px-8 py-3 rounded-full text-xl font-bold shadow-lg transition text-white ${isCountdownRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'}`}>
                                 {isCountdownRunning ? 'Pause' : 'Resume'}
                             </button>
                             <button onClick={() => { setIsCountdownRunning(false); setCountdownRemaining(null); }} className="bg-red-600 text-white px-8 py-3 rounded-full text-xl font-bold hover:bg-red-700 transition">Stop</button>
                         </>
                     )}
                 </div>
             </div>
         )}

         {/* --- POMODORO TIMER --- */}
         {tool.id === ToolID.POMODORO_TIMER && (
             <div className="text-center space-y-8">
                 <div className={`text-xl font-bold uppercase tracking-widest mb-4 ${pomoState === 'work' ? 'text-red-500' : 'text-green-500'}`}>
                     {pomoState === 'work' ? 'Focus Time' : 'Break Time'}
                 </div>
                 <div className="text-8xl md:text-9xl font-mono font-bold text-gray-800 dark:text-white tabular-nums">
                     {formatSeconds(pomoTime)}
                 </div>
                 <div className="flex justify-center gap-4">
                     <button onClick={() => setIsPomoRunning(!isPomoRunning)} className="bg-blue-600 text-white px-8 py-3 rounded-full text-xl font-bold shadow-lg hover:bg-blue-700 transition w-32">
                         {isPomoRunning ? 'Pause' : 'Start'}
                     </button>
                     <button onClick={() => { setIsPomoRunning(false); setPomoTime(pomoState === 'work' ? 25*60 : 5*60); }} className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-full text-xl font-bold hover:bg-gray-300 transition">
                         Reset
                     </button>
                 </div>
                 <div className="flex justify-center gap-4 mt-8">
                     <button onClick={() => { setPomoState('work'); setPomoTime(25*60); setIsPomoRunning(false); }} className={`px-4 py-2 rounded-lg text-sm font-bold ${pomoState === 'work' ? 'bg-red-100 text-red-600' : 'text-gray-500'}`}>Pomodoro (25m)</button>
                     <button onClick={() => { setPomoState('break'); setPomoTime(5*60); setIsPomoRunning(false); }} className={`px-4 py-2 rounded-lg text-sm font-bold ${pomoState === 'break' ? 'bg-green-100 text-green-600' : 'text-gray-500'}`}>Short Break (5m)</button>
                 </div>
             </div>
         )}

         {/* --- BUSINESS DAYS --- */}
         {tool.id === ToolID.BUSINESS_DAYS_CALCULATOR && (
             <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Start Date</label><input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                     <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">End Date</label><input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                 </div>
                 <div className="flex items-center gap-2">
                     <input type="checkbox" checked={includeWeekends} onChange={(e) => setIncludeWeekends(e.target.checked)} id="incW" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                     <label htmlFor="incW" className="text-gray-700 dark:text-gray-300">Include Weekends?</label>
                 </div>
                 <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Calculate</button>
                 {result && (
                     <div className="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-xl p-6 text-center">
                         <div className="text-4xl font-extrabold text-gray-800 dark:text-white">{result.value}</div>
                         <div className="text-sm text-gray-500 uppercase font-bold mt-1">Days</div>
                     </div>
                 )}
             </div>
         )}

         {/* --- TIME TO DECIMAL --- */}
         {tool.id === ToolID.TIME_TO_DECIMAL_CONVERTER && (
             <div className="space-y-6">
                 <div className="flex gap-4 items-end justify-center">
                     <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Hours</label><input type="number" value={decimalHours} onChange={(e) => setDecimalHours(parseFloat(e.target.value)||0)} className="w-24 p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white text-center focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                     <div className="pb-3 text-2xl font-bold">:</div>
                     <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Minutes</label><input type="number" value={decimalMinutes} onChange={(e) => setDecimalMinutes(parseFloat(e.target.value)||0)} className="w-24 p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white text-center focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                 </div>
                 <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Convert</button>
                 {result && (
                     <div className="bg-gray-100 dark:bg-slate-900 p-6 rounded-xl text-center">
                         <div className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400">{result.value}</div>
                         <div className="text-sm text-gray-500 mt-2">{result.note}</div>
                     </div>
                 )}
             </div>
         )}

         {/* --- CALENDAR GENERATOR --- */}
         {tool.id === ToolID.CALENDAR_GENERATOR && (
             <div className="space-y-6">
                 <div className="flex justify-center gap-4">
                     <select value={calMonth} onChange={(e) => setCalMonth(parseInt(e.target.value))} className="p-2 border border-gray-300 bg-white text-gray-900 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                         {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => <option key={i} value={i}>{m}</option>)}
                     </select>
                     <input type="number" value={calYear} onChange={(e) => setCalYear(parseInt(e.target.value))} className="w-24 p-2 border border-gray-300 bg-white text-gray-900 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                 </div>
                 <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                     <div className="grid grid-cols-7 bg-gray-100 dark:bg-slate-700 text-center font-bold py-2 border-b dark:border-slate-600">
                         {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d}>{d}</div>)}
                     </div>
                     {renderCalendar().map((week, idx) => (
                         <div key={idx} className="grid grid-cols-7 text-center border-b last:border-b-0 dark:border-slate-700">
                             {week.map((d, i) => (
                                 <div key={i} className={`py-4 ${d ? 'text-gray-800 dark:text-white' : 'bg-gray-50 dark:bg-slate-800'}`}>{d}</div>
                             ))}
                         </div>
                     ))}
                 </div>
             </div>
         )}

         {/* --- WEEK NUMBER --- */}
         {tool.id === ToolID.WEEK_NUMBER_CALCULATOR && (
             <div className="space-y-6">
                 <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Select Date</label><input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                 <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Find Week Number</button>
                 {result && (
                     <div className="bg-gray-100 dark:bg-slate-900 p-6 rounded-xl text-center">
                         <div className="text-sm text-gray-500 mb-2">ISO Week Number</div>
                         <div className="text-5xl font-bold text-gray-800 dark:text-white">{result.value}</div>
                     </div>
                 )}
             </div>
         )}

         {/* --- LEAP YEAR --- */}
         {tool.id === ToolID.LEAP_YEAR_CHECKER && (
             <div className="space-y-6 text-center">
                 <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Enter Year</label><input type="number" value={leapYearInput} onChange={(e) => setLeapYearInput(parseInt(e.target.value))} className="w-32 p-3 text-center border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white text-xl focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                 <button onClick={calculate} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">Check</button>
                 {result && (
                     <div className={`mt-6 p-6 rounded-xl ${result.value === 'Yes' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                         <div className="text-4xl font-bold mb-2">{result.value}</div>
                         <div className="text-sm">{result.note}</div>
                     </div>
                 )}
             </div>
         )}

         {/* --- AGE CALCULATOR --- */}
         {tool.id === ToolID.AGE_CALCULATOR && (
             <div className="space-y-8 text-center">
                 <div>
                    <label className="block text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Select Date of Birth</label>
                    <input 
                      type="date" 
                      value={dob} 
                      onChange={(e) => setDob(e.target.value)}
                      className="p-4 border border-gray-300 dark:border-slate-600 rounded-xl text-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
                 <button onClick={calculate} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition">Calculate Age</button>
                 
                 {result && (
                     <div className="space-y-6 text-left">
                         <div className="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-xl p-8 text-center">
                             <div className="text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide text-sm font-bold">Current Age</div>
                             <div className="flex justify-center gap-4 md:gap-8">
                                 <div><div className="text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400">{result.years}</div><div className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mt-1">Years</div></div>
                                 <div className="text-4xl md:text-5xl text-gray-300 font-light">/</div>
                                 <div><div className="text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400">{result.months}</div><div className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mt-1">Months</div></div>
                                 <div className="text-4xl md:text-5xl text-gray-300 font-light">/</div>
                                 <div><div className="text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400">{result.days}</div><div className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mt-1">Days</div></div>
                             </div>
                             <div className="mt-4 text-sm text-gray-500">Born on a <strong>{result.bornDay}</strong></div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800 rounded-xl p-6">
                                 <div className="flex items-center gap-2 mb-3"><h4 className="font-bold text-pink-700 dark:text-pink-300">Next Birthday</h4></div>
                                 <div className="text-3xl font-bold text-gray-800 dark:text-white">{result.nextBirthday.days} <span className="text-base font-normal text-gray-500">Days Left</span></div>
                                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">On {result.nextBirthday.weekday}, {result.nextBirthday.date}</p>
                             </div>
                             <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
                                 <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3">Life Summary</h4>
                                 <ul className="space-y-2 text-sm">
                                     <li className="flex justify-between"><span>Total Months:</span> <span className="font-mono font-bold">{result.totalMonths.toLocaleString()}</span></li>
                                     <li className="flex justify-between"><span>Total Weeks:</span> <span className="font-mono font-bold">{result.totalWeeks.toLocaleString()}</span></li>
                                     <li className="flex justify-between"><span>Total Days:</span> <span className="font-mono font-bold">{result.totalDays.toLocaleString()}</span></li>
                                     <li className="flex justify-between"><span>Total Hours:</span> <span className="font-mono font-bold">{result.totalHours.toLocaleString()}</span></li>
                                 </ul>
                             </div>
                         </div>
                     </div>
                 )}
             </div>
         )}

         {/* --- DATE DIFFERENCE / DAY COUNTER --- */}
         {(tool.id === ToolID.DATE_DIFFERENCE || tool.id === ToolID.DAY_COUNTER) && (
             <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Date</label><input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                     <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Date</label><input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                 </div>
                 <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition">Calculate Duration</button>
                 {result && (
                     <div className="space-y-6">
                         <div className="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-xl p-6 text-center">
                             <div className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">Total Duration</div>
                             <div className="text-5xl font-extrabold text-gray-800 dark:text-white mb-2">{result.totalDays} <span className="text-2xl font-normal text-gray-500">Days</span></div>
                             {tool.id === ToolID.DATE_DIFFERENCE && <div className="text-gray-600 dark:text-gray-300 font-medium text-lg">{result.years > 0 && `${result.years} years, `}{result.months > 0 && `${result.months} months, `}{result.days} days</div>}
                         </div>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-200 dark:border-slate-600 text-center"><div className="text-xl font-bold text-gray-800 dark:text-white">{result.totalWeeks}</div><div className="text-xs text-gray-500 uppercase">Weeks</div></div>
                             <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-200 dark:border-slate-600 text-center"><div className="text-xl font-bold text-gray-800 dark:text-white">{result.remainingDays}</div><div className="text-xs text-gray-500 uppercase">Rem. Days</div></div>
                             <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-200 dark:border-slate-600 text-center col-span-2"><div className="text-xl font-bold text-gray-800 dark:text-white">{result.totalHours.toLocaleString()}</div><div className="text-xs text-gray-500 uppercase">Total Hours</div></div>
                         </div>
                     </div>
                 )}
             </div>
         )}

         {/* --- TIME ADD / SUBTRACT / CALCULATOR --- */}
         {tool.id === ToolID.TIME_ADD_SUBTRACT && (
             <div className="space-y-6">
                 <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Date & Time</label><input type="datetime-local" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                 <div className="flex gap-4">
                     <select value={operation} onChange={(e) => setOperation(e.target.value)} className="p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"><option value="add">Add (+)</option><option value="subtract">Subtract (-)</option></select>
                     <input type="number" value={timeValue} onChange={(e) => setTimeValue(parseFloat(e.target.value))} className="flex-1 p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                     <select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)} className="p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"><option value="hours">Hours</option><option value="minutes">Minutes</option><option value="days">Days</option></select>
                 </div>
                 <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition">Calculate New Date</button>
                 {result && (
                     <div className="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-xl p-6 text-center">
                         <div className="text-lg text-gray-600 dark:text-gray-300 mb-1">Result Date</div>
                         <div className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">{result.value}</div>
                     </div>
                 )}
             </div>
         )}

         {/* --- DATE CALCULATOR --- */}
         {tool.id === ToolID.DATE_CALCULATOR && (
             <div className="space-y-6">
                 <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Date</label><input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                 <div className="flex gap-4">
                     <select value={operation} onChange={(e) => setOperation(e.target.value)} className="p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"><option value="add">Add (+)</option><option value="subtract">Subtract (-)</option></select>
                     <input type="number" value={dateValue} onChange={(e) => setDateValue(parseFloat(e.target.value))} className="flex-1 p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                     <select value={dateUnit} onChange={(e) => setDateUnit(e.target.value)} className="p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"><option value="days">Days</option><option value="weeks">Weeks</option><option value="months">Months</option><option value="years">Years</option></select>
                 </div>
                 <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition">Calculate Date</button>
                 {result && (
                     <div className="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-xl p-6 text-center">
                         <div className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-4">{result.value}</div>
                         <div className="grid grid-cols-2 gap-4 border-t border-blue-200 dark:border-slate-600 pt-4">
                             <div><div className="text-gray-500 text-xs uppercase">Day of Year</div><div className="font-bold text-gray-800 dark:text-white">{result.dayOfYear}</div></div>
                             <div><div className="text-gray-500 text-xs uppercase">Week Number</div><div className="font-bold text-gray-800 dark:text-white">{result.weekNum}</div></div>
                         </div>
                     </div>
                 )}
             </div>
         )}

         {/* --- TIME CALCULATOR --- */}
         {tool.id === ToolID.TIME_CALCULATOR && (
             <div className="space-y-6">
                 <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Time</label><input type="time" value={baseTime} onChange={(e) => setBaseTime(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                 <div className="flex gap-4">
                     <select value={operation} onChange={(e) => setOperation(e.target.value)} className="p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"><option value="add">Add (+)</option><option value="subtract">Subtract (-)</option></select>
                     <input type="number" value={timeValue} onChange={(e) => setTimeValue(parseFloat(e.target.value))} className="flex-1 p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                     <select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)} className="p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"><option value="hours">Hours</option><option value="minutes">Minutes</option></select>
                 </div>
                 <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition">Calculate Time</button>
                 {result && (
                     <div className="bg-gray-900 text-green-400 font-mono rounded-xl p-8 text-center shadow-inner border-4 border-gray-700">
                         <div className="text-5xl font-bold">{result.value}</div>
                     </div>
                 )}
             </div>
         )}

         {/* --- HOURS / DURATION --- */}
         {(tool.id === ToolID.HOURS_CALCULATOR || tool.id === ToolID.TIME_DURATION_CALCULATOR) && (
             <div className="space-y-6">
                 {tool.id === ToolID.HOURS_CALCULATOR ? (
                     <div className="flex gap-4">
                         <div className="flex-1"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Time</label><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                         <div className="flex-1"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Time</label><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                     </div>
                 ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start</label><input type="datetime-local" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                         <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End</label><input type="datetime-local" value={date2} onChange={(e) => setDate2(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                     </div>
                 )}
                 <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition">Calculate Duration</button>
                 {result && (
                     <div className="space-y-4">
                         <div className="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-xl p-6 text-center">
                             <div className="text-sm text-gray-500 uppercase font-bold mb-2">Total Time</div>
                             <div className="text-4xl font-extrabold text-gray-800 dark:text-white">{result.hours}h {result.minutes}m</div>
                         </div>
                         <div className="grid grid-cols-3 gap-4">
                             <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded text-center"><div className="font-bold text-lg text-gray-800 dark:text-white">{result.totalDecimal}</div><div className="text-xs text-gray-500">Decimal Hours</div></div>
                             <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded text-center"><div className="font-bold text-lg text-gray-800 dark:text-white">{result.totalMinutes}</div><div className="text-xs text-gray-500">Total Minutes</div></div>
                             <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded text-center"><div className="font-bold text-lg text-gray-800 dark:text-white">{result.totalSeconds}</div><div className="text-xs text-gray-500">Total Seconds</div></div>
                         </div>
                     </div>
                 )}
             </div>
         )}

         {/* --- TIME CARD CALCULATOR --- */}
         {tool.id === ToolID.TIME_CARD_CALCULATOR && (
             <div className="space-y-6">
                 <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                             <tr>
                                 <th scope="col" className="px-4 py-3">Day</th>
                                 <th scope="col" className="px-4 py-3">In</th>
                                 <th scope="col" className="px-4 py-3">Out</th>
                                 <th scope="col" className="px-4 py-3">Break (min)</th>
                             </tr>
                         </thead>
                         <tbody>
                             {timeCardData.map((row, index) => (
                                 <tr key={row.day} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700">
                                     <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.day}</td>
                                     <td className="px-4 py-3"><input type="time" value={row.in} onChange={(e) => updateTimeCard(index, 'in', e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white" /></td>
                                     <td className="px-4 py-3"><input type="time" value={row.out} onChange={(e) => updateTimeCard(index, 'out', e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white" /></td>
                                     <td className="px-4 py-3"><input type="number" value={row.break} onChange={(e) => updateTimeCard(index, 'break', parseInt(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white" /></td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
                 <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Calculate Total Hours</button>
                 {result && (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="bg-blue-50 dark:bg-slate-900 p-6 rounded-xl text-center border border-blue-100 dark:border-slate-700">
                             <div className="text-3xl font-bold text-gray-800 dark:text-white">{result.hours}h {result.minutes}m</div>
                             <div className="text-xs uppercase font-bold text-gray-500 mt-1">Total Time</div>
                         </div>
                         <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-xl text-center border border-gray-200 dark:border-slate-600">
                             <div className="text-3xl font-bold text-gray-800 dark:text-white">{result.totalDecimal}</div>
                             <div className="text-xs uppercase font-bold text-gray-500 mt-1">Decimal Hours</div>
                         </div>
                         <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-xl text-center border border-gray-200 dark:border-slate-600">
                             <div className="text-3xl font-bold text-gray-800 dark:text-white">{result.avgHours}h {result.avgMinutes}m</div>
                             <div className="text-xs uppercase font-bold text-gray-500 mt-1">Avg / Day</div>
                         </div>
                     </div>
                 )}
             </div>
         )}

         {/* --- TIME ZONE CALCULATOR --- */}
         {tool.id === ToolID.TIME_ZONE_CALCULATOR && (
             <div className="space-y-6">
                 <div>
                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Source Time (Local)</label>
                     <input 
                        type="datetime-local" 
                        value={sourceTime} 
                        onChange={(e) => setSourceTime(e.target.value)} 
                        className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                     />
                 </div>
                 <div>
                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Time Zone</label>
                     <select 
                        value={targetZone} 
                        onChange={(e) => setTargetZone(e.target.value)}
                        className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                     >
                         {TIME_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                     </select>
                 </div>
                 <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Convert Time</button>
                 {result && (
                     <div className="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-xl p-6 text-center">
                         <div className="text-xl font-bold text-gray-800 dark:text-white mb-2">{result.value}</div>
                         <div className="text-sm text-gray-600 dark:text-gray-400">{result.note}</div>
                         <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-bold">Offset: {result.offset}h</div>
                     </div>
                 )}
             </div>
         )}

         {/* --- DAY OF WEEK --- */}
         {tool.id === ToolID.DAY_OF_WEEK_CALCULATOR && (
             <div className="space-y-6 text-center">
                 <div><label className="block text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Select Date</label><input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="p-4 border border-gray-300 dark:border-slate-600 rounded-xl text-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                 <button onClick={calculate} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition">Find Day</button>
                 
                 {result && (
                     <div className="mt-8 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-8">
                         <div className="text-6xl mb-4">📅</div>
                         <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">{result.value}</div>
                         <div className="text-gray-500 dark:text-gray-400">Day {result.dayOfYear} of the year</div>
                     </div>
                 )}
             </div>
         )}

      </div>
      <div className="mt-16 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">{getSEOContent()}</div>
    </div>
  );
};
