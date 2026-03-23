import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Camera, ImagePlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getLangForAI } from '../utils/i18n';

export default function CameraUpload() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera stream utility
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Start Camera Stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera permissions denied:", err);
        setHasPermission(false);
      }
    };

    if (!result && !analyzing && !imagePreview) {
      startCamera();
    }

    // Cleanup function to stop video tracks on unmount
    return () => {
      stopCamera();
    };
  }, [result, analyzing, imagePreview]);

  // Handle exiting scan
  const handleExit = () => {
    stopCamera();
    navigate('/');
  };

  const processImageBuffer = async (base64Data, rawDataUrl) => {
    stopCamera();
    
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    const rawLang = localStorage.getItem('SMART_AG_LANG') || 'English';
    const userLang = getLangForAI(rawLang);

    if (!apiKey) {
      alert("Please configure your Gemini API Key in the Settings page (Profile) first.");
      navigate('/profile');
      return;
    }

    setAnalyzing(true);
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const prompt = `Analyze this image. FIRST, determine if the image contains any agricultural subject.

CLASSIFICATION RULES (VERY IMPORTANT):
- "Livestock" = ANY live animal including but not limited to: cow, buffalo, bull, ox, goat, sheep, chicken, hen, rooster, duck, turkey, pig, horse, donkey, camel, rabbit, fish, shrimp, bee, silkworm, dog (farm), cat (farm), pigeon, quail, emu, yak, mule, or any other farm/domestic animal.
- "Crop" = ANY plant, vegetable, fruit, grain, flower, tree, or agricultural produce including but not limited to: wheat, rice, maize, corn, millet, sorghum, barley, oats, sugarcane, cotton, jute, tea, coffee, rubber, coconut, arecanut, cashew, pepper, cardamom, turmeric, ginger, chilli, onion, garlic, potato, tomato, brinjal, carrot, peas, beans, cucumber, pumpkin, spinach, cabbage, cauliflower, okra, radish, beetroot, banana, mango, apple, orange, grape, papaya, guava, pomegranate, lemon, watermelon, mushroom, lettuce, soybean, groundnut, sunflower, mustard, sesame, linseed, or any other plant/crop/vegetable/fruit/flower/herb/spice.

If the image does NOT contain any livestock or crop/plant, return ONLY this JSON: { "isValid": false }
      
If it DOES contain crops or livestock, return ONLY this valid JSON: 
{
  "isValid": true,
  "type": "Crop or Livestock (use EXACTLY one of these two words based on the classification rules above)",
  "identity": "Specific crop variety or livestock breed",
  "diagnosis": "Suspected disease/pest/deficiency (or say 'Healthy')",
  "severity": "Critical, Moderate, or Healthy",
  "healthPercentage": <number from 0 to 100>,
  "affectedArea": "For Livestock: body part affected (e.g. skin, udder, hoof, eye). For Crops: affected plant part (e.g. leaf, stem, root, fruit)",
  "possibleConditions": ["Most likely condition", "Second possibility", "Third possibility"],
  "immediateCare": "First-aid or immediate steps a farmer should take right now before professional help arrives",
  "urgency": "Immediate, Within 24h, or Routine",
  "actionPlan": "Detailed step-by-step treatment or management protocols"
}
      
IMPORTANT RULES:
- The "type" field MUST be exactly "Crop" or "Livestock" — no other values.
- For 'possibleConditions', always provide exactly 3 differential diagnoses ranked by likelihood. If the subject is healthy, return ["Healthy", "No issues detected", "Continue monitoring"].
- For 'affectedArea', be specific about which part of the plant or animal is affected.
- For 'immediateCare', provide practical first-aid steps a farmer can do immediately.
- For 'urgency', assess how urgently professional help (vet or agronomist) is needed.
      
CRITICAL INSTRUCTION: Translate the values of 'identity', 'diagnosis', 'severity', 'affectedArea', 'possibleConditions', 'immediateCare', 'urgency', and 'actionPlan' into ${userLang}. Keep JSON keys strictly in English.`;
      
      const imagePart = { inlineData: { data: base64Data, mimeType: "image/jpeg" } };

      let responseText = "";
      const modelNames = ["gemini-2.5-flash", "gemini-1.5-flash"];
      let success = false;
      let lastError = null;

      for (const modelName of modelNames) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const fetchResult = await model.generateContent([prompt, imagePart]);
          responseText = fetchResult.response.text();
          success = true;
          break;
        } catch (modelErr) {
          console.warn(`Model ${modelName} failed:`, modelErr);
          lastError = modelErr;
        }
      }

      if (!success) {
        if (lastError?.message?.includes('404') || lastError?.status === 404 || lastError?.message?.toLowerCase().includes('key') || lastError?.message?.toLowerCase().includes('fetch')) {
          localStorage.setItem('GEMINI_KEY_ERROR', 'true');
        }
        throw lastError; 
      }
      
      const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanedText);

      // Validation Gate
      if (parsed.isValid === false) {
        alert("Invalid Image: Please upload photos of crops, plants, or livestock only to prevent API waste.");
        setImagePreview(null);
        setAnalyzing(false);
        return;
      }
      
      const newScan = {
        id: Date.now(),
        image: rawDataUrl,
        date: new Date().toLocaleDateString(),
        ...parsed
      };

      const history = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
      history.unshift(newScan);
      localStorage.setItem('smartAgHistory', JSON.stringify(history));

      setResult(newScan);
      setAnalyzing(false);
    } catch (innerError) {
      console.error("Gemini Parse/Fallback Error:", innerError);
      alert("Failed to analyze image. Please try a different photo or check your connection.");
      setImagePreview(null);
      setAnalyzing(false);
    }
  };

  const handleLiveCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setImagePreview(imageDataUrl);
    const base64Data = imageDataUrl.split(',')[1];
    
    await processImageBuffer(base64Data, imageDataUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const imageDataUrl = reader.result;
      setImagePreview(imageDataUrl);
      const base64Data = imageDataUrl.split(',')[1];
      await processImageBuffer(base64Data, imageDataUrl);
    };
  };

  return (
    <div className="absolute inset-0 bg-charcoalDark flex flex-col z-50">
      <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2a6a0c6cdd?q=80&w=390&h=844&auto=format&fit=crop')] bg-cover bg-center">
      </div>
      
      <div className="relative z-10 flex flex-col h-full p-6 pb-32 overflow-y-auto custom-scroll">
        <div className="flex justify-between items-center mb-auto pt-4 pb-6">
          <button onClick={handleExit} className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-colors">
            <X className="w-6 h-6" />
          </button>
          
          {analyzing && (
            <span className="text-goldenYellow font-display text-sm uppercase tracking-[0.3em] bg-charcoalDark/80 backdrop-blur-xl px-6 py-3 rounded-xl border border-goldenYellow/50 shadow-lg animate-pulse">
              Analyzing...
            </span>
          )}
          <div className="w-12"></div>
        </div>

        {!result && (
          <div className="relative w-full h-[50vh] min-h-[400px] mb-auto rounded-2xl overflow-hidden bg-charcoalDark/50 border border-white/20 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm">
            {/* Viewfinder Corners */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-goldenYellow z-20"></div>
            <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-goldenYellow z-20"></div>
            <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-goldenYellow z-20"></div>
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-goldenYellow z-20"></div>
            
            {analyzing && <div className="scanning-line z-30 bg-goldenYellow"></div>}

            {imagePreview ? (
              <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover z-10 blur-sm opacity-50" />
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`absolute inset-0 w-full h-full object-cover z-10`}
              />
            )}
            
            <canvas ref={canvasRef} className="hidden" />

            {!hasPermission && !analyzing && !imagePreview && (
              <div className="z-20 text-center px-6">
                <AlertCircle className="w-12 h-12 text-coralRed mx-auto mb-4" />
                <p className="font-display text-white text-xl uppercase tracking-widest mb-2">Camera Access Denied</p>
                <p className="font-body text-white/70 text-sm">Please allow camera permissions or use the upload button below.</p>
              </div>
            )}

            {!analyzing && !imagePreview && (
              <div className="absolute bottom-10 left-0 right-0 flex justify-center z-30">
                <button 
                  onClick={handleLiveCapture}
                  disabled={!hasPermission}
                  className={`w-24 h-24 bg-white/10 backdrop-blur-xl border-4 border-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center transition-all group ${!hasPermission ? 'opacity-50' : 'active:scale-95 hover:border-goldenYellow'}`}
                >
                  <div className="w-16 h-16 bg-white rounded-full group-active:scale-90 transition-transform group-hover:bg-goldenYellow"></div>
                </button>
              </div>
            )}
          </div>
        )}

        {!result && !analyzing && (
           <div className="mt-8 flex justify-center">
             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
             <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-5 rounded-xl text-white font-display text-sm uppercase tracking-widest hover:bg-white/20 active:scale-95 transition-all shadow-lg">
                <ImagePlus className="w-5 h-5" /> Upload from Gallery
             </button>
           </div>
        )}

        {result && (
          <div className="bg-[#f8f9fa] dark:bg-charcoalDark w-full rounded-2xl shadow-2xl flex flex-col shrink-0 border border-charcoalDark/10 dark:border-white/10 animate-in slide-in-from-bottom-5 mt-8 mb-6">
            <div className="p-6">
              {imagePreview && (
                 <div className="w-full h-48 rounded-xl overflow-hidden mb-6 border border-charcoalDark/10 dark:border-white/10 shadow-sm relative">
                   <img src={imagePreview} alt="Scanned subject" className="w-full h-full object-cover" />
                 </div>
              )}
              
              <div className="flex items-center gap-4 mb-6 bg-white dark:bg-white/5 p-4 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-display text-2xl border shrink-0 ${result.healthPercentage >= 80 ? 'bg-teal/10 text-teal border-teal/20' : result.healthPercentage >= 50 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-coralRed/10 text-coralRed border-coralRed/20'}`}>
                  {result.healthPercentage || 0}%
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest truncate">Identified {result.type}</p>
                  <p className="font-display text-charcoalDark dark:text-white text-2xl uppercase leading-tight truncate mt-1">{result.identity}</p>
                </div>
              </div>
              
              {/* Diagnosis + Severity + Urgency */}
              <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm mb-4 border-l-4" style={{ borderLeftColor: result.severity === 'Healthy' ? '#2ec4b6' : '#e63946' }}>
                 <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-2">Diagnosis</p>
                 <p className="font-body font-bold text-charcoalDark dark:text-white text-base sm:text-lg">{result.diagnosis}</p>
                 <div className="flex flex-wrap gap-2 mt-4">
                   <div className={`font-display text-[10px] px-3 py-1.5 rounded-lg inline-block uppercase tracking-widest border ${result.severity === 'Critical' ? 'bg-coralRed/10 text-coralRed border-coralRed/20' : result.severity === 'Healthy' ? 'bg-teal/10 text-teal border-teal/20' : 'bg-charcoalDark/5 dark:bg-white/10 text-charcoalDark dark:text-white border-charcoalDark/10 dark:border-white/20'}`}>
                     Severity: {result.severity}
                   </div>
                   {result.urgency && (
                     <div className={`font-display text-[10px] px-3 py-1.5 rounded-lg inline-block uppercase tracking-widest border ${result.urgency === 'Immediate' ? 'bg-coralRed/10 text-coralRed border-coralRed/20' : result.urgency === 'Within 24h' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-teal/10 text-teal border-teal/20'}`}>
                       🕐 {result.urgency}
                     </div>
                   )}
                 </div>
              </div>

              {/* Affected Area */}
              {result.affectedArea && (
                <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm mb-4">
                  <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-2">Affected Area</p>
                  <p className="font-body font-medium text-charcoalDark dark:text-white text-sm sm:text-base">{result.affectedArea}</p>
                </div>
              )}

              {/* Possible Conditions */}
              {result.possibleConditions && result.possibleConditions.length > 0 && (
                <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm mb-4">
                  <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-4">Possible Conditions</p>
                  <div className="space-y-3">
                    {result.possibleConditions.map((cond, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className={`w-6 h-6 mt-0.5 rounded-lg flex items-center justify-center font-display text-[10px] text-white shrink-0 ${i === 0 ? 'bg-coralRed' : i === 1 ? 'bg-amber-500' : 'bg-charcoalDark/40 dark:bg-white/40'}`}>{i + 1}</span>
                        <p className="font-body font-medium text-sm sm:text-base text-charcoalDark dark:text-white/90 leading-relaxed">{cond}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Immediate Care */}
              {result.immediateCare && (
                <div className="bg-amber-500/5 dark:bg-amber-500/10 p-5 rounded-xl border border-amber-500/20 shadow-sm mb-4 border-l-4 border-l-amber-500">
                  <p className="font-display text-amber-600 dark:text-amber-500 text-[10px] uppercase tracking-widest mb-2">⚡ Immediate Care</p>
                  <p className="font-body font-medium text-sm sm:text-base text-charcoalDark/90 dark:text-white/90 leading-relaxed">{result.immediateCare}</p>
                </div>
              )}
              
              {/* Action Plan */}
              <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm mb-6 border-t-4 border-t-goldenYellow">
                <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-4">Precaution & Action Plan</p>
                <div className="font-body font-medium text-sm sm:text-base text-charcoalDark/90 dark:text-white/90 leading-relaxed whitespace-pre-wrap">
                  {result.actionPlan}
                </div>
              </div>
              
              <button onClick={handleExit} className="bg-goldenYellow text-charcoalDark w-full py-4 rounded-xl font-display text-sm uppercase tracking-widest shadow-lg active:scale-[0.98] hover:brightness-105 transition-all flex justify-center items-center gap-3">
                <CheckCircle2 className="w-5 h-5" /> Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
