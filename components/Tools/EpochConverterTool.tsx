
import React, { useState, useEffect } from 'react';
import { ToolDefinition } from '../../types';

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

export const EpochConverterTool: React.FC<Props> = ({ tool }) => {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [inputTimestamp, setInputTimestamp] = useState<string>('');
  const [timestampResult, setTimestampResult] = useState<string | null>(null);
  
  const [inputDate, setInputDate] = useState<string>('');
  const [dateResult, setDateResult] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTimestamp = () => {
    if (!inputTimestamp) return;
    let ts = parseInt(inputTimestamp);
    // Auto-detect milliseconds if length > 11
    if (inputTimestamp.length > 11) {
       ts = Math.floor(ts / 1000); 
    }
    const date = new Date(ts * 1000);
    setTimestampResult(date.toUTCString() + " | " + date.toLocaleString());
  };

  const convertDate = () => {
    if (!inputDate) return;
    const date = new Date(inputDate);
    setDateResult(Math.floor(date.getTime() / 1000));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-xl p-8 text-center animate-fadeIn">
        <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">Current Unix Epoch Time</h3>
        <div className="text-5xl font-mono font-bold text-gray-800 dark:text-white">{currentEpoch}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Timestamp to Date */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Timestamp to Date</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Unix Timestamp</label>
              <input 
                type="number" 
                value={inputTimestamp} 
                onChange={(e) => setInputTimestamp(e.target.value)} 
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="e.g. 1672531200"
              />
            </div>
            <button onClick={convertTimestamp} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">Convert</button>
            {timestampResult && (
              <div className="p-4 bg-gray-100 dark:bg-slate-900 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 break-words">
                {timestampResult}
              </div>
            )}
          </div>
        </div>

        {/* Date to Timestamp */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Date to Timestamp</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date & Time</label>
              <input 
                type="datetime-local" 
                value={inputDate} 
                onChange={(e) => setInputDate(e.target.value)} 
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <button onClick={convertDate} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">Convert</button>
            {dateResult && (
              <div className="p-4 bg-gray-100 dark:bg-slate-900 rounded-lg text-center">
                <div className="text-2xl font-mono font-bold text-gray-800 dark:text-white">{dateResult}</div>
                <div className="text-xs text-gray-500 mt-1">Seconds</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Comprehensive Guide to Unix Time</h2>
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">What is the Epoch?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    The Unix epoch, often referred to simply as the "epoch", is a system for describing a point in time. It is defined as the number of seconds that have elapsed since <strong>January 1, 1970 (00:00:00 UTC)</strong>, minus leap seconds. This specific moment in time is known as the "Unix Epoch". It serves as a universal reference point for computer systems to track time. Our <strong>epoch converter</strong> and <strong>unix timestamp converter</strong> tool allows developers, database administrators, and system architects to instantly translate between this machine-readable integer format and human-readable dates. It supports both standard Unix timestamps (seconds) and JavaScript timestamps (milliseconds), making it a versatile <strong>unix time to date</strong> utility.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Timezones can be confusing in software development. By storing time as a single integer (the <strong>current unix timestamp</strong>), systems can easily convert to any local timezone when displaying the <strong>human readable time</strong> to users. This avoids the complexities of daylight saving time and varying time zones during data storage and processing.
                </p>
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">The Year 2038 Problem</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Legacy systems that store the epoch as a signed 32-bit integer will run out of capacity on January 19, 2038, at 03:14:07 UTC. This event is known as the <strong>Y2038</strong> problem, conceptually similar to the Y2K bug. At that second, the integer will overflow, causing the date to wrap around to December 1901, which could cause critical errors in infrastructure and software.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Most modern systems have upgraded to 64-bit integers to avoid this issue, effectively pushing the limit billions of years into the future. Understanding these formats is crucial for database management, logging, and software development. Whether you need a <strong>timestamp generator</strong> for testing or need to perform a <strong>date to timestamp</strong> conversion for a database query, this <strong>online epoch tool</strong> is essential.
                </p>
            </div>
        </div>
        <KeywordsBox keywords={['unix timestamp converter', 'epoch time', 'unix time to date', 'date to timestamp', 'epoch converter', 'unix epoch', 'human readable time', 'timestamp generator', 'y2038', 'utc time', 'date to seconds', 'milliseconds to date', 'epoch to date', 'unix time clock', 'online epoch tool', 'convert epoch to datetime', 'unix timestamp to readable', 'current epoch time', 'epoch timestamp converter', 'unix time converter', 'seconds since epoch', 'linux timestamp converter', 'javascript date to timestamp', 'epoch calculator', 'timestamp to human readable', 'unix format date', 'epoch time now', 'convert seconds to date']} />
      </div>
    </div>
  );
};
