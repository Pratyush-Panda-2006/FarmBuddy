import { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Droplets, Thermometer, Eye, Loader2, MapPin, Sparkles, AlertTriangle, CloudSnow, Cloud, CloudSun, CloudDrizzle, Cloudy } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getTranslation, getLangForAI } from '../utils/i18n';

const WMO_ICONS = {
  0: { icon: Sun, label: 'Clear Sky', color: 'text-amber-400' },
  1: { icon: CloudSun, label: 'Mainly Clear', color: 'text-amber-300' },
  2: { icon: Cloud, label: 'Partly Cloudy', color: 'text-sage' },
  3: { icon: Cloudy, label: 'Overcast', color: 'text-sage' },
  45: { icon: Cloud, label: 'Foggy', color: 'text-sage' },
  48: { icon: Cloud, label: 'Rime Fog', color: 'text-sage' },
  51: { icon: CloudDrizzle, label: 'Light Drizzle', color: 'text-blue-400' },
  53: { icon: CloudDrizzle, label: 'Drizzle', color: 'text-blue-400' },
  55: { icon: CloudDrizzle, label: 'Dense Drizzle', color: 'text-blue-500' },
  61: { icon: CloudRain, label: 'Slight Rain', color: 'text-blue-400' },
  63: { icon: CloudRain, label: 'Moderate Rain', color: 'text-blue-500' },
  65: { icon: CloudRain, label: 'Heavy Rain', color: 'text-blue-600' },
  71: { icon: CloudSnow, label: 'Slight Snow', color: 'text-sky-300' },
  73: { icon: CloudSnow, label: 'Moderate Snow', color: 'text-sky-400' },
  75: { icon: CloudSnow, label: 'Heavy Snow', color: 'text-sky-500' },
  80: { icon: CloudRain, label: 'Rain Showers', color: 'text-blue-400' },
  81: { icon: CloudRain, label: 'Rain Showers', color: 'text-blue-500' },
  82: { icon: CloudRain, label: 'Violent Rain', color: 'text-blue-600' },
  95: { icon: CloudRain, label: 'Thunderstorm', color: 'text-purple-500' },
};

function getWeatherInfo(code) {
  return WMO_ICONS[code] || WMO_ICONS[0];
}

export default function Weather() {
  const t = getTranslation;
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [smartAlert, setSmartAlert] = useState('');
  const [loadingAlert, setLoadingAlert] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      const { latitude, longitude } = pos.coords;

      // Reverse geocoding for location name
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const geoData = await geoRes.json();
        setLocationName(geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || 'Your Location');
      } catch { setLocationName('Your Location'); }

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10,precipitation,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto&forecast_days=7`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather API failed');
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error('Weather error:', err);
      setError(err.message?.includes('denied') ? 'Location permission denied. Please allow location access to see weather.' : 'Failed to fetch weather data. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const generateSmartAlert = async () => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) { alert('Please set your Gemini API key in Settings first.'); return; }
    setLoadingAlert(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const userLang = getLangForAI(localStorage.getItem('SMART_AG_LANG') || 'English');
      const scans = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
      const recentScans = scans.slice(0, 5).map(s => `${s.identity} - ${s.diagnosis} (${s.severity})`).join('; ');
      const dailyForecast = weather?.daily ? weather.daily.time.map((d, i) =>
        `${d}: Max ${weather.daily.temperature_2m_max[i]}°C, Min ${weather.daily.temperature_2m_min[i]}°C, Rain: ${weather.daily.precipitation_sum[i]}mm (${weather.daily.precipitation_probability_max[i]}%)`
      ).join('\n') : 'No forecast data';

      const prompt = `You are an expert agricultural meteorologist advisor. Based on this data:

CURRENT WEATHER: Temperature ${weather?.current?.temperature_2m}°C, Humidity ${weather?.current?.relative_humidity_2m}%, Wind ${weather?.current?.wind_speed_10}km/h, Precipitation ${weather?.current?.precipitation}mm

7-DAY FORECAST:
${dailyForecast}

FARMER'S RECENT SCANS: ${recentScans || 'No scans yet'}
LOCATION: ${locationName}

Provide 3-4 SHORT, practical smart alerts combining weather conditions with the farmer's crop/livestock situation.
Format each alert as: [EMOJI] [Alert Title]: [Brief actionable advice]
Be specific to their crops/animals. If no scans, give general seasonal advice.
Respond in ${userLang}. Keep it concise.`;

      const modelNames = ['gemini-2.5-flash', 'gemini-1.5-flash'];
      let responseText = '';
      for (const modelName of modelNames) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const res = await model.generateContent(prompt);
          responseText = res.response.text();
          break;
        } catch (e) { console.warn(`${modelName} failed`, e); }
      }
      setSmartAlert(responseText);
    } catch (err) {
      console.error('Smart alert error:', err);
      alert('Failed to generate alerts.');
    } finally {
      setLoadingAlert(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="w-10 h-10 text-teal animate-spin mb-4" />
      <p className="text-sage font-bold text-sm">{t("Fetching weather data...")}</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
      <AlertTriangle className="w-12 h-12 text-coralRed mb-4" />
      <p className="text-charcoal dark:text-white font-bold text-sm mb-4">{error}</p>
      <button onClick={fetchWeather} className="bg-teal text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform">
        Retry
      </button>
    </div>
  );

  const currentInfo = getWeatherInfo(weather?.current?.weather_code);
  const CurrentIcon = currentInfo.icon;

  return (
    <>
      <header className="mb-6 mt-2">
        <h2 className="text-charcoal dark:text-white font-black text-2xl tracking-tighter">{t("Weather")}</h2>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-sage" />
          <p className="text-sage font-semibold text-xs">{locationName}</p>
        </div>
      </header>

      {/* Current Weather Hero */}
      <div className="bg-gradient-to-br from-charcoal to-[#2A332E] rounded-2xl sm:rounded-[24px] p-5 sm:p-8 text-white mb-4 sm:mb-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal/10 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-xl -mb-10 -ml-10 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">{t("Current Weather")}</p>
              <h2 className="text-[40px] sm:text-[56px] font-black tracking-tighter leading-none mb-1">
                {Math.round(weather?.current?.temperature_2m)}°
              </h2>
              <p className="text-teal font-bold text-sm">{currentInfo.label}</p>
              <p className="text-white/40 text-xs mt-1">Feels like {Math.round(weather?.current?.apparent_temperature)}°C</p>
            </div>
            <CurrentIcon className={`w-16 h-16 ${currentInfo.color} opacity-80`} />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Humidity</p>
              <p className="text-white font-black text-sm">{weather?.current?.relative_humidity_2m}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <Wind className="w-4 h-4 text-sage mx-auto mb-1" />
              <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Wind</p>
              <p className="text-white font-black text-sm">{Math.round(weather?.current?.wind_speed_10)} km/h</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <CloudRain className="w-4 h-4 text-blue-300 mx-auto mb-1" />
              <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Rain</p>
              <p className="text-white font-black text-sm">{weather?.current?.precipitation} mm</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <h3 className="text-charcoal dark:text-white font-extrabold text-xs uppercase tracking-wider mb-4">{t("7-Day Forecast")}</h3>
      <div className="overflow-x-auto custom-scroll -mx-5 px-5 pb-2 mb-6">
        <div className="flex gap-3">
          {weather?.daily?.time?.map((day, i) => {
            const info = getWeatherInfo(weather.daily.weather_code[i]);
            const DayIcon = info.icon;
            const dayName = i === 0 ? 'Today' : new Date(day).toLocaleDateString('en', { weekday: 'short' });
            return (
              <div key={day} className={`shrink-0 w-[100px] ${i === 0 ? 'bg-teal/10 border-teal/30' : 'bg-white dark:bg-charcoal/80 border-sage/10 dark:border-white/10'} rounded-2xl p-4 text-center border shadow-sm`}>
                <p className="text-[10px] text-sage font-bold uppercase tracking-widest mb-2">{dayName}</p>
                <DayIcon className={`w-8 h-8 mx-auto mb-2 ${info.color}`} />
                <p className="text-charcoal dark:text-white font-black text-sm">{Math.round(weather.daily.temperature_2m_max[i])}°</p>
                <p className="text-sage text-[10px] font-bold">{Math.round(weather.daily.temperature_2m_min[i])}°</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  <p className="text-[9px] text-blue-400 font-bold">{weather.daily.precipitation_probability_max[i]}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Smart Alerts */}
      <div className="bg-gradient-to-br from-charcoal to-[#2A332E] rounded-[20px] p-5 text-white shadow-xl mb-28">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-teal" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{t("AI Smart Alerts")}</p>
        </div>
        <p className="text-white/40 text-[10px] mb-4">Combines weather forecast with your crop & livestock scan data to give proactive alerts.</p>
        <button onClick={generateSmartAlert} disabled={loadingAlert} className="w-full bg-teal/20 border border-teal/30 text-teal font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          {loadingAlert ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4" /> Generate Smart Alerts</>}
        </button>
        {smartAlert && (
          <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-2">Farm Weather Alerts</p>
            <div className="text-white/80 text-xs font-semibold leading-relaxed whitespace-pre-wrap">{smartAlert}</div>
          </div>
        )}
      </div>
    </>
  );
}
