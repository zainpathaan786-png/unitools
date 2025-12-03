
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

// Unit Definitions with conversion factors relative to a base unit
const UNITS: Record<string, { [key: string]: { name: string, factor: number, offset?: number } }> = {
    [ToolID.LENGTH_CONVERTER]: {
        'm': { name: 'Meters', factor: 1 },
        'km': { name: 'Kilometers', factor: 1000 },
        'cm': { name: 'Centimeters', factor: 0.01 },
        'mm': { name: 'Millimeters', factor: 0.001 },
        'mi': { name: 'Miles', factor: 1609.34 },
        'yd': { name: 'Yards', factor: 0.9144 },
        'ft': { name: 'Feet', factor: 0.3048 },
        'in': { name: 'Inches', factor: 0.0254 },
        'nm': { name: 'Nanometers', factor: 1e-9 },
        'um': { name: 'Microns (µm)', factor: 1e-6 },
        'mil': { name: 'Mils', factor: 0.0000254 },
    },
    [ToolID.WEIGHT_CONVERTER]: {
        'kg': { name: 'Kilograms', factor: 1 },
        'g': { name: 'Grams', factor: 0.001 },
        'mg': { name: 'Milligrams', factor: 1e-6 },
        'lb': { name: 'Pounds', factor: 0.453592 },
        'oz': { name: 'Ounces', factor: 0.0283495 },
        't': { name: 'Metric Tons', factor: 1000 },
        'st': { name: 'Stone', factor: 6.35029 },
        'gr': { name: 'Grains', factor: 0.0000647989 },
    },
    [ToolID.TEMPERATURE_CONVERTER]: {
        'C': { name: 'Celsius', factor: 1, offset: 0 },
        'F': { name: 'Fahrenheit', factor: 1, offset: 0 }, // Handled specially
        'K': { name: 'Kelvin', factor: 1, offset: 0 }, // Handled specially
    },
    [ToolID.AREA_CONVERTER]: {
        'sqm': { name: 'Square Meters', factor: 1 },
        'sqkm': { name: 'Square Kilometers', factor: 1e6 },
        'sqft': { name: 'Square Feet', factor: 0.092903 },
        'sqyd': { name: 'Square Yards', factor: 0.836127 },
        'sqmi': { name: 'Square Miles', factor: 2.59e6 },
        'acre': { name: 'Acres', factor: 4046.86 },
        'ha': { name: 'Hectares', factor: 10000 },
        'a': { name: 'Ares', factor: 100 },
        'cent': { name: 'Cents', factor: 40.4686 },
    },
    [ToolID.VOLUME_CONVERTER]: {
        'l': { name: 'Liters', factor: 1 },
        'ml': { name: 'Milliliters', factor: 0.001 },
        'gal': { name: 'Gallons (US)', factor: 3.78541 },
        'qt': { name: 'Quarts (US)', factor: 0.946353 },
        'pt': { name: 'Pints (US)', factor: 0.473176 },
        'cup': { name: 'Cups (US)', factor: 0.236588 },
        'floz': { name: 'Fluid Ounces (US)', factor: 0.0295735 },
        'm3': { name: 'Cubic Meters', factor: 1000 },
    },
    [ToolID.SPEED_CONVERTER]: {
        'mps': { name: 'Meters per second', factor: 1 },
        'kmh': { name: 'Kilometers per hour', factor: 0.277778 },
        'mph': { name: 'Miles per hour', factor: 0.44704 },
        'kn': { name: 'Knots', factor: 0.514444 },
        'ftps': { name: 'Feet per second', factor: 0.3048 },
    },
    [ToolID.DATA_CONVERTER]: {
        'B': { name: 'Bytes', factor: 1 },
        'KB': { name: 'Kilobytes', factor: 1024 },
        'MB': { name: 'Megabytes', factor: 1048576 },
        'GB': { name: 'Gigabytes', factor: 1073741824 },
        'TB': { name: 'Terabytes', factor: 1099511627776 },
        'PB': { name: 'Petabytes', factor: 1125899906842624 },
        'Mb': { name: 'Megabits', factor: 131072 },
    },
    [ToolID.TIME_CONVERTER]: {
        's': { name: 'Seconds', factor: 1 },
        'min': { name: 'Minutes', factor: 60 },
        'h': { name: 'Hours', factor: 3600 },
        'd': { name: 'Days', factor: 86400 },
        'wk': { name: 'Weeks', factor: 604800 },
        'mo': { name: 'Months (Avg)', factor: 2.628e6 },
        'y': { name: 'Years', factor: 3.154e7 },
    },
    [ToolID.PRESSURE_CONVERTER]: {
        'Pa': { name: 'Pascal', factor: 1 },
        'kPa': { name: 'Kilopascal', factor: 1000 },
        'bar': { name: 'Bar', factor: 100000 },
        'psi': { name: 'PSI', factor: 6894.76 },
        'atm': { name: 'Atmosphere', factor: 101325 },
        'torr': { name: 'Torr', factor: 133.322 },
    },
    [ToolID.FUEL_CONVERTER]: {
        'mpg_us': { name: 'MPG (US)', factor: 1 }, // Special handling logic required
        'mpg_uk': { name: 'MPG (UK)', factor: 1 },
        'kml': { name: 'km/L', factor: 1 },
        'l100km': { name: 'L/100km', factor: 1 },
    },
    [ToolID.FREQUENCY_CONVERTER]: {
        'hz': { name: 'Hertz', factor: 1 },
        'khz': { name: 'Kilohertz', factor: 1000 },
        'mhz': { name: 'Megahertz', factor: 1e6 },
        'ghz': { name: 'Gigahertz', factor: 1e9 },
        'thz': { name: 'Terahertz', factor: 1e12 },
        'rpm': { name: 'RPM (Revolutions per minute)', factor: 1/60 },
        'rad_s': { name: 'Radians per second', factor: 1 / (2 * Math.PI) },
        'deg_s': { name: 'Degrees per second', factor: 1 / 360 },
    },
    [ToolID.ANGLE_CONVERTER]: {
        'deg': { name: 'Degrees', factor: 1 },
        'rad': { name: 'Radians', factor: 180 / Math.PI },
        'grad': { name: 'Gradians', factor: 0.9 },
        'arcmin': { name: 'Arcminutes', factor: 1/60 },
        'arcsec': { name: 'Arcseconds', factor: 1/3600 },
    },
    // New Unit Converters
    [ToolID.POWER_CONVERTER]: {
        'W': { name: 'Watts (W)', factor: 1 },
        'kW': { name: 'Kilowatts (kW)', factor: 1000 },
        'hp': { name: 'Horsepower (hp)', factor: 745.7 },
        'Js': { name: 'Joules per second', factor: 1 },
        'MW': { name: 'Megawatts', factor: 1e6 },
        'A': { name: 'Amperes (at 1V)', factor: 1 }, // Simplification for keyword support
    },
    [ToolID.ENERGY_CONVERTER]: {
        'J': { name: 'Joules (J)', factor: 1 },
        'kJ': { name: 'Kilojoules (kJ)', factor: 1000 },
        'cal': { name: 'Calories (cal)', factor: 4.184 },
        'kcal': { name: 'Kilocalories (kcal)', factor: 4184 },
        'kWh': { name: 'Kilowatt-hours', factor: 3.6e6 },
        'BTU': { name: 'BTU', factor: 1055.06 },
    },
    [ToolID.BITRATE_CONVERTER]: {
        'bps': { name: 'Bits per second', factor: 1 },
        'Kbps': { name: 'Kilobits/sec', factor: 1000 },
        'Mbps': { name: 'Megabits/sec', factor: 1e6 },
        'Gbps': { name: 'Gigabits/sec', factor: 1e9 },
        'Bps': { name: 'Bytes per second', factor: 8 },
        'KBps': { name: 'Kilobytes/sec', factor: 8000 },
        'MBps': { name: 'Megabytes/sec', factor: 8e6 },
    },
    [ToolID.TORQUE_CONVERTER]: {
        'Nm': { name: 'Newton-meters (N·m)', factor: 1 },
        'lbft': { name: 'Pound-feet (lb-ft)', factor: 1.35582 },
        'lbin': { name: 'Pound-inches (lb-in)', factor: 0.112985 },
        'kgm': { name: 'Kilogram-meters', factor: 9.80665 },
    },
    [ToolID.FORCE_CONVERTER]: {
        'N': { name: 'Newtons (N)', factor: 1 },
        'kN': { name: 'Kilonewtons', factor: 1000 },
        'lbf': { name: 'Pound-force (lbf)', factor: 4.44822 },
        'kgf': { name: 'Kilogram-force (kgf)', factor: 9.80665 },
        'dyn': { name: 'Dynes', factor: 1e-5 },
    },
    [ToolID.DENSITY_CONVERTER]: {
        'kgm3': { name: 'kg/m³', factor: 1 },
        'gcm3': { name: 'g/cm³', factor: 1000 },
        'lbft3': { name: 'lb/ft³', factor: 16.0185 },
        'lbin3': { name: 'lb/in³', factor: 27679.9 },
    },
    [ToolID.ILLUMINANCE_CONVERTER]: {
        'lx': { name: 'Lux (lx)', factor: 1 },
        'fc': { name: 'Foot-candles (fc)', factor: 10.7639 },
        'ph': { name: 'Phot (ph)', factor: 10000 },
    },
    [ToolID.NUMBER_BASE_CONVERTER]: {
        '10': { name: 'Decimal (10)', factor: 1 },
        '2': { name: 'Binary (2)', factor: 1 },
        '8': { name: 'Octal (8)', factor: 1 },
        '16': { name: 'Hexadecimal (16)', factor: 1 },
    }
};

export const UnitConverterTool: React.FC<Props> = ({ tool }) => {
  const [amount, setAmount] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
      const units = UNITS[tool.id];
      if (units) {
          const keys = Object.keys(units);
          setFromUnit(keys[0]);
          setToUnit(keys[1] || keys[0]);
          setAmount('1');
      }
      setResult(null);
      setCopySuccess(false);
  }, [tool.id]);

  const handleConvert = () => {
      if (amount === '') {
          setResult(null);
          return;
      }

      // Special Handling for Number Base
      if (tool.id === ToolID.NUMBER_BASE_CONVERTER) {
          try {
              const fromBase = parseInt(fromUnit);
              const toBase = parseInt(toUnit);
              const cleanAmount = amount.trim().toUpperCase();
              
              // Validate digits for the specific base
              const validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, fromBase);
              const regex = new RegExp(`^[${validChars}]+$`);
              
              if (!regex.test(cleanAmount)) {
                  setResult("Invalid Input for Base " + fromBase);
                  return;
              }

              const decimalValue = parseInt(cleanAmount, fromBase);
              
              if (isNaN(decimalValue)) {
                  setResult("Invalid Input");
              } else {
                  setResult(decimalValue.toString(toBase).toUpperCase());
              }
          } catch (e) {
              setResult("Error");
          }
          return;
      }
      
      const val = parseFloat(amount);
      if (isNaN(val)) {
          setResult(null);
          return;
      }

      let res = 0;

      // Special Handling for Temperature
      if (tool.id === ToolID.TEMPERATURE_CONVERTER) {
          if (fromUnit === toUnit) {
              res = val;
          } else if (fromUnit === 'C') {
              res = toUnit === 'F' ? (val * 9/5) + 32 : val + 273.15;
          } else if (fromUnit === 'F') {
              res = toUnit === 'C' ? (val - 32) * 5/9 : ((val - 32) * 5/9) + 273.15;
          } else if (fromUnit === 'K') {
              res = toUnit === 'C' ? val - 273.15 : (val - 273.15) * 9/5 + 32;
          }
      }
      // Special Handling for Fuel Efficiency (Inverse relationships)
      else if (tool.id === ToolID.FUEL_CONVERTER) {
          // Convert everything to MPG (US) first as base
          let mpgUS = val;
          
          if (fromUnit === 'mpg_uk') mpgUS = val * 0.832674;
          else if (fromUnit === 'kml') mpgUS = val * 2.35215;
          else if (fromUnit === 'l100km') mpgUS = 235.215 / val;

          // Convert from MPG (US) to target
          if (toUnit === 'mpg_us') res = mpgUS;
          else if (toUnit === 'mpg_uk') res = mpgUS * 1.20095;
          else if (toUnit === 'kml') res = mpgUS * 0.425144;
          else if (toUnit === 'l100km') res = 235.215 / mpgUS;
      }
      // Standard Linear Conversion
      else {
          const units = UNITS[tool.id];
          if (units && units[fromUnit] && units[toUnit]) {
              const baseValue = val * units[fromUnit].factor;
              res = baseValue / units[toUnit].factor;
          }
      }

      // Formatting
      if (Math.abs(res) < 0.000001 || Math.abs(res) > 1e9) {
          setResult(res.toExponential(4));
      } else {
          // Adjust decimals based on tool
          const decimals = (tool.id === ToolID.DATA_CONVERTER || tool.id === ToolID.FREQUENCY_CONVERTER || tool.id === ToolID.ANGLE_CONVERTER) ? 6 : 4; 
          // Remove trailing zeros if integer
          setResult(parseFloat(res.toFixed(decimals)).toString());
      }
  };

  const handleCopy = () => {
      if (result) {
          navigator.clipboard.writeText(result);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
      }
  };

  const units = UNITS[tool.id] || {};

  const getSEOContent = () => {
    switch (tool.id) {
        case ToolID.LENGTH_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Comprehensive Length Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Length measurement is fundamental in science, engineering, and daily life. Whether you need a <strong>decimal to inches calculator</strong> for precise engineering schematics or an <strong>inches to decimal feet</strong> conversion for construction projects, this tool handles it all effortlessly. We support a wide array of units, from standard <strong>height conversion inches to cm</strong> to microscopic scales like <strong>micron to mil</strong>.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Our converter bridges the gap between the Metric and Imperial systems. Perform <strong>millimeter conversion</strong> instantly or check our <strong>mm to inch table</strong> logic for quick references. Designers can use the <strong>mm to px converter</strong> approximation for digital layouts. From measuring a room to calculating astronomical distances, get accurate results every time.
                    </p>
                    <KeywordsBox keywords={['decimal to inches calculator', 'inches to decimal feet', 'height conversion inches to cm', 'mm to px converter', 'mm to px', 'mm to inch table', 'millimeter conversion', 'micron to mil', 'length conversion', 'meter to foot', 'km to miles', 'cm to inches', 'distance calculator', 'metric to imperial length', 'ruler converter', 'yard to meter', 'nano meter conversion', 'unit of length', 'measure converter', 'standard length units']} />
                </>
            );
        case ToolID.TEMPERATURE_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Temperature Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Accurately convert temperatures between Celsius, Fahrenheit, and Kelvin scales. Whether you are following a recipe that requires <strong>1 farenheit to celcius</strong> conversion or analyzing scientific data, this tool provides precise results. Understanding temperature scales is crucial for weather monitoring, cooking, and laboratory experiments.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Unlike other units, temperature scales have different zero points, making mental math difficult. Our converter uses the exact formulas to switch between scales instantly. Check the freezing point, boiling point, or absolute zero in any unit without complex calculations.
                    </p>
                    <KeywordsBox keywords={['1 farenheit to celcius', 'temperature conversion', 'celsius to fahrenheit', 'kelvin converter', 'fahrenheit to celsius formula', 'temp converter', 'heat measurement', 'degree conversion', 'absolute zero', 'weather temperature', 'science lab temp', 'c to f', 'k to c']} />
                </>
            );
        case ToolID.PRESSURE_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Pressure Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Convert pressure readings between Pascal, PSI, Atmosphere, Bar, and Torr. This tool is essential for engineering, automotive maintenance, and meteorology. For instance, handling a <strong>bar to kpa conversion</strong> is critical when checking tire pressure or calibrating industrial machinery.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Different regions and industries prefer different standards. While science uses Pascals, the automotive world often uses PSI or Bar. Our tool helps you normalize these values instantly, ensuring safety and accuracy in your pressure-sensitive applications.
                    </p>
                    <KeywordsBox keywords={['bar to kpa conversion', 'pressure conversion', 'psi to bar', 'pascal converter', 'atmosphere units', 'tyre pressure', 'engineering units', 'kpa to psi', 'torr conversion', 'hydraulic pressure', 'atmospheric pressure', 'standard pressure', 'barometric pressure']} />
                </>
            );
        case ToolID.AREA_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Area Unit Conversion</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Perform complete <strong>area unit conversion</strong> for land, housing, and scientific applications. Whether you are a real estate agent needing a <strong>hectare to sq yard</strong> conversion or a farmer looking for a <strong>hectare to decimal converter</strong>, our tool covers all major units including acres, square feet, and square meters.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        We also support regional units for specific needs, such as the <strong>ares to cent converter</strong>. Calculating the correct area is vital for construction estimation, property valuation, and land mapping. Switch between metric and imperial area units effortlessly.
                    </p>
                    <KeywordsBox keywords={['area unit conversion', 'hectare to sq yard', 'hectare to decimal converter', 'ares to cent converter', 'area calculator', 'square meters to square feet', 'land measurement', 'acres to hectares', 'sq km to sq miles', 'surface area converter', 'property size', 'plot converter', 'room size calculator', 'metric area', 'imperial area', 'field measurement']} />
                </>
            );
        case ToolID.VOLUME_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Volume Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        From industrial tanks to kitchen recipes, volume conversion is essential. Convert industrial units like <strong>1 cubic meter to liter</strong> or handle cooking measurements with our <strong>cup to liter conversion</strong> and <strong>cups conversion</strong> tools. Precise liquid measurement ensures success in chemistry and culinary arts alike.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        We also facilitate specific conversions like <strong>half ounce to ml</strong> for medication or mixing. Need density-based estimations? Check our related <strong>kg to ml conversion</strong> resources or <strong>iu to ml</strong> guides. Whether you are dealing with US gallons, Imperial gallons, or milliliters, we provide the accurate figures.
                    </p>
                    <KeywordsBox keywords={['1 cubic meter to liter', 'cup to liter conversion', 'cups conversion', 'half ounce to ml', 'kg to ml conversion', 'iu to ml', 'volume conversion', 'liters to gallons', 'cubic meters', 'fluid ounces', 'milliliters to liters', 'kitchen volume', 'liquid measurement', 'capacity converter', 'dry volume', 'imperial gallons', 'us gallons', 'pint conversion']} />
                </>
            );
        case ToolID.WEIGHT_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Weight & Mass Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Easily convert between metric and imperial weight units. Need high precision? Convert <strong>grams to grains</strong> for chemistry or ammunition reloading. Our tool can also help with estimation for <strong>cup to grams calculator</strong> needs in the kitchen or specialized <strong>iu to mg calculator</strong> conversions for supplements.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Explore physics concepts like <strong>joule to kg</strong> (energy equivalence) in our related sections. From heavy metric tons to delicate milligrams, our weight converter ensures you get the right mass for shipping, health monitoring, or scientific formulation.
                    </p>
                    <KeywordsBox keywords={['grams to grains', 'cup to grams calculator', 'iu to mg calculator', 'joule to kg', 'weight conversion', 'kg to lbs', 'pounds to kilograms', 'mass converter', 'metric weight', 'imperial weight', 'stone to pounds', 'ounces to grams', 'body weight converter', 'heavy mass conversion', 'kitchen weight converter', 'scale converter']} />
                </>
            );
        case ToolID.DATA_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Data Storage Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        In the digital age, understanding file sizes and storage capacity is crucial. Convert digital storage units from Bytes all the way up to Petabytes. Understand the difference between network speeds by converting <strong>megabytes to megabits</strong> or checking <strong>megabyte to megabit</strong> ratios to see how fast your file will actually download.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Whether you are managing cloud storage quotas, buying a new hard drive, or optimizing website assets, knowing the exact conversion between base-2 (1024) and base-10 (1000) standards helps you avoid confusion. This tool handles standard binary prefixes accurately.
                    </p>
                    <KeywordsBox keywords={['megabytes to megabits', 'megabyte to megabit', 'data size converter', 'bytes to bits', 'gigabytes to terabytes', 'storage converter', 'file size calculator', 'digital storage', 'tb to gb', 'kb to mb', 'hard drive capacity', 'memory size', 'bandwidth units', 'binary prefix']} />
                </>
            );
        case ToolID.POWER_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Power Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Convert power units such as Watts, Kilowatts, and Horsepower instantly. This tool acts as an effective <strong>ampere to watt calculator</strong> (assuming standard voltage reference) and handles mechanical vs. electrical power conversions. Useful for electricians, automotive enthusiasts, and engineers.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Understand the output of engines, motors, and electronic devices. Whether you are converting air conditioner ratings from BTUs to Watts or car engine power from HP to kW, this utility provides the standard conversion factors used in industry.
                    </p>
                    <KeywordsBox keywords={['ampere to watt calculator', 'power conversion', 'watts to kilowatts', 'horsepower converter', 'electrical power', 'joules per second', 'energy rate', 'mechanical power', 'kw to hp', 'electric motor power', 'engine power', 'physics power units', 'mw conversion']} />
                </>
            );
        case ToolID.SPEED_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Speed & Velocity Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Convert speed units for travel, science, and maritime applications. Switch effortlessly between Kilometers per hour (km/h), Miles per hour (mph), Knots, and Meters per second. Whether you are driving, flying, or sailing, knowing your speed in the correct unit is essential for navigation and safety.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        This tool is also perfect for physics students needing to convert common everyday speeds into SI units for calculations. Compare the speed of sound, a car on the highway, and a sprinter on the track with a single click.
                    </p>
                    <KeywordsBox keywords={['speed converter', 'mph to kmh', 'knots to mph', 'meters per second', 'velocity calculator', 'speed of sound', 'mach number', 'distance time speed', 'conversion rate', 'travel speed calculator', 'nautical miles speed', 'physics velocity', 'highway speed conversion']} />
                </>
            );
        case ToolID.TIME_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Time Unit Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Time is the most valuable resource, and measuring it correctly matters. Convert between seconds, minutes, hours, days, weeks, months, and years. This tool is useful for project planning, calculating age in different units, or scientific time intervals.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        We use standard astronomical averages for months and years to provide the most accurate conversions possible. Whether you are converting milliseconds for code execution or decades for historical timelines, our time converter is precise and easy to use.
                    </p>
                    <KeywordsBox keywords={['time conversion', 'seconds to minutes', 'hours to days', 'duration calculator', 'milliseconds converter', 'weeks to months', 'time units', 'chronology', 'time span', 'year converter', 'decimal time', 'stopwatch units']} />
                </>
            );
        case ToolID.FUEL_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Fuel Efficiency Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Compare vehicle fuel economy across different global standards. Convert between US MPG (Miles Per Gallon), UK MPG, Kilometers per Liter (km/L), and Liters per 100km. This is essential when importing cars, planning international road trips, or comparing vehicle specs from different manufacturers.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Note that US and UK gallons are different sizes, which often leads to confusion. Our tool handles these differences automatically, as well as the inverse relationship between "distance per fuel unit" and "fuel per distance unit" systems.
                    </p>
                    <KeywordsBox keywords={['fuel efficiency', 'mpg to kml', 'l/100km converter', 'gas mileage', 'fuel consumption', 'kilometers per liter', 'miles per gallon', 'car efficiency', 'fuel economy', 'petrol consumption', 'diesel mileage', 'vehicle efficiency']} />
                </>
            );
        case ToolID.FREQUENCY_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Frequency Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Convert frequency units from Hertz (Hz) to Kilohertz (kHz), Megahertz (MHz), and Gigahertz (GHz). This tool is vital for audio engineers, radio enthusiasts, and computer hardware specialists dealing with processor speeds and wireless signals.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        We also support conversion to RPM (Revolutions Per Minute) and angular velocity units like radians per second. Whether you are tuning an instrument or analyzing a motor's speed, this converter provides the exact figures you need.
                    </p>
                    <KeywordsBox keywords={['frequency conversion', 'hertz to kilohertz', 'mhz to ghz', 'radio frequency', 'sound wave', 'rpm converter', 'cycle per second', 'electronics frequency', 'audio spectrum', 'processor speed', 'wavelength to frequency', 'rad/s']} />
                </>
            );
        case ToolID.ANGLE_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Angle Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Switch between Degrees, Radians, Gradians, and more. Angle conversion is a staple in trigonometry, geometry, navigation, and surveying. Convert standard degrees into mathematical radians for calculus or precise arcminutes for astronomy.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Understand the relationship between different systems of angular measurement. Our tool simplifies complex conversions, ensuring your calculations for slopes, circles, and rotations are always correct.
                    </p>
                    <KeywordsBox keywords={['angle conversion', 'degrees to radians', 'gradians', 'geometry units', 'circle degrees', 'rad to deg', 'angular measurement', 'trigonometry', 'arcminutes', 'arcseconds', 'rotation units', 'mathematical angles']} />
                </>
            );
        case ToolID.ENERGY_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Energy & Work Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Convert between Joules, Calories, Kilowatt-hours (kWh), and BTUs. Energy units vary widely depending on the field—from nutrition (Calories) to electricity (kWh) and heating (BTU). This tool unifies them all into a single interface.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Perfect for dieticians calculating food energy, engineers working on HVAC systems, or students solving physics problems. Understand how different forms of energy relate to each other numerically.
                    </p>
                    <KeywordsBox keywords={['energy conversion', 'joules to calories', 'kwh converter', 'btu calculator', 'work units', 'thermal energy', 'electrical energy', 'kilojoules', 'food calories', 'power vs energy', 'heat units', 'physics energy']} />
                </>
            );
        case ToolID.BITRATE_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Bitrate & Bandwidth Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Understand your internet speed and data transfer rates. Convert between bits per second (bps), Kilobits (Kbps), Megabits (Mbps), and Gigabits (Gbps). Crucially, this tool also handles the conversion to Bytes (MB/s), helping you distinguish between download speed and file transfer rates.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Ideal for network administrators, streamers configuring broadcast quality, or anyone confused by ISP marketing numbers versus actual download speeds.
                    </p>
                    <KeywordsBox keywords={['bitrate conversion', 'mbps to mb/s', 'internet speed', 'data transfer rate', 'kbps converter', 'gigabit speed', 'network bandwidth', 'streaming quality', 'download speed', 'upload speed', 'connection speed', 'bps calculator']} />
                </>
            );
        case ToolID.TORQUE_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Torque Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Convert torque values between Newton-meters (Nm), Pound-feet (lb-ft), and Pound-inches. Torque is the measure of rotational force, critical in automotive repair, engine tuning, and mechanical engineering.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Ensure you tighten bolts to the correct specification or understand engine output across different regional standards. This tool provides precise conversions for all common torque units.
                    </p>
                    <KeywordsBox keywords={['torque conversion', 'newton meters', 'foot pounds', 'engine torque', 'rotational force', 'lb-ft to nm', 'mechanical torque', 'tightening torque', 'moment of force', 'kg-m conversion', 'automotive torque', 'torque wrench units']} />
                </>
            );
        case ToolID.FORCE_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Force Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Convert force units such as Newtons, Kilonewtons, Pound-force (lbf), and Kilogram-force (kgf). Force measurement is essential in physics, structural engineering, and aerodynamics.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Understand the relationship between gravitational force and weight units. Whether you are calculating thrust, tension, or load capacity, our force converter gives you the accurate data you need.
                    </p>
                    <KeywordsBox keywords={['force conversion', 'newtons to pounds', 'kgf calculator', 'dynes', 'pound-force', 'physics force', 'thrust calculator', 'weight vs force', 'kn converter', 'gravitational force', 'load units', 'tension calculator']} />
                </>
            );
        case ToolID.DENSITY_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Density Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Convert density measurements between metric (kg/m³, g/cm³) and imperial (lb/ft³, lb/in³) systems. Density is a key property of materials, used in chemistry, construction, and materials science to determine mass per unit volume.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Useful for determining the weight of a specific volume of material, from concrete to water. This tool helps bridge the gap between lab-scale measurements and industrial bulk quantities.
                    </p>
                    <KeywordsBox keywords={['density conversion', 'kg/m3', 'g/cm3', 'material density', 'specific gravity', 'mass per volume', 'water density', 'imperial density', 'bulk density', 'liquid density', 'solid density', 'physics density', 'substance weight']} />
                </>
            );
        case ToolID.ILLUMINANCE_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Illuminance Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Convert light intensity units like Lux, Foot-candles, and Phots. Illuminance measures how much luminous flux is incident on a surface. This is vital for photographers, lighting designers, and architects ensuring proper lighting levels in workspaces.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Ensure compliance with safety standards or achieve the perfect exposure for your photos. Switch between metric Lux and imperial Foot-candles instantly.
                    </p>
                    <KeywordsBox keywords={['illuminance conversion', 'lux to foot-candles', 'light intensity', 'photography light', 'lumens per area', 'brightness units', 'lighting design', 'photometrics', 'luminous flux', 'light meter units', 'office lighting', 'exposure value']} />
                </>
            );
        case ToolID.NUMBER_BASE_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Number Base Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Convert numbers between Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16). This tool is indispensable for programmers, computer scientists, and network engineers dealing with low-level data representation.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Translate color codes, memory addresses, or ASCII values easily. Understand how digital systems represent values and switch between human-readable decimals and machine-code formats seamlessly.
                    </p>
                    <KeywordsBox keywords={['binary to decimal', 'hex converter', 'octal conversion', 'base conversion', 'radix converter', 'programmer calculator', 'binary translator', 'hex to decimal', 'number system', 'digital logic', 'computer math', 'base 2 to base 10']} />
                </>
            );
        default:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About this Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        This free online unit converter allows you to quicky switch between Metric and Imperial measurement systems. 
                        Select your input unit, enter the value, and get instant results for various corresponding units.
                    </p>
                </>
            );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* Input Side */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">From</label>
                    <input 
                        type={tool.id === ToolID.NUMBER_BASE_CONVERTER ? "text" : "number"}
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-4 text-2xl font-bold border border-gray-300 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder={tool.id === ToolID.NUMBER_BASE_CONVERTER ? "Enter Value" : "0"}
                    />
                    <select 
                        value={fromUnit} 
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200"
                    >
                        {Object.entries(units).map(([key, u]) => (
                            <option key={key} value={key}>{u.name}</option>
                        ))}
                    </select>
                </div>

                {/* Switch Icon */}
                <div className="flex justify-center md:rotate-0 rotate-90">
                    <button 
                        onClick={() => {
                            setFromUnit(toUnit);
                            setToUnit(fromUnit);
                        }}
                        className="p-3 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-600 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </button>
                </div>

                {/* Output Side */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">To</label>
                    <div className="relative w-full p-4 min-h-[66px] flex items-center text-2xl font-bold border border-blue-200 dark:border-blue-900 rounded-xl bg-blue-50 dark:bg-slate-900 text-blue-700 dark:text-blue-400 overflow-hidden break-all">
                        {result !== null ? result : '...'}
                        {result && (
                            <button 
                                onClick={handleCopy}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300 transition"
                                title="Copy Result"
                            >
                                {copySuccess ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                )}
                            </button>
                        )}
                    </div>
                    <select 
                        value={toUnit} 
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200"
                    >
                        {Object.entries(units).map(([key, u]) => (
                            <option key={key} value={key}>{u.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Convert Button */}
            <div className="mt-8">
                <button 
                    onClick={handleConvert}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-blue-700 transition"
                >
                    Convert
                </button>
            </div>

            {/* Formula Display (Simple) */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {result !== null && tool.id !== ToolID.NUMBER_BASE_CONVERTER && (
                        <span>
                            1 {units[fromUnit]?.name} ≈ {(Number(result) / Number(amount || 1)).toPrecision(4)} {units[toUnit]?.name}
                        </span>
                    )}
                </p>
            </div>
        </div>

        {/* NEW SEO CONTENT SECTION */}
        <div className="mt-16 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            {getSEOContent()}
        </div>
    </div>
  );
};
