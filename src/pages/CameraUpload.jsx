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
    <div className="absolute inset-0 bg-black flex flex-col z-50">
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2a6a0c6cdd?q=80&w=390&h=844&auto=format&fit=crop')] bg-cover bg-center">
      </div>
      
      <div className="relative z-10 flex flex-col h-full p-6 pb-32 overflow-y-auto custom-scroll">
        <div className="flex justify-between items-center mb-auto pt-4 pb-6">
          <button onClick={handleExit} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/10">
            <X className="w-6 h-6" />
          </button>
          
          {analyzing && (
            <span className="text-teal font-extrabold text-sm uppercase tracking-[0.3em] bg-black/60 backdrop-blur-xl px-6 py-3 rounded-xl border-2 border-teal/50 shadow-2xl shadow-teal/20 animate-pulse">
              Analyzing...
            </span>
          )}
          <div className="w-10"></div>
        </div>

        {!result && (
          <div className="relative w-full h-[50vh] min-h-[400px] mb-auto rounded-[30px] overflow-hidden bg-white/5 border border-sage/30 flex flex-col items-center justify-center shadow-2xl">
            {/* Viewfinder Corners */}
            <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-white/80 rounded-tl-xl z-20"></div>
            <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-white/80 rounded-tr-xl z-20"></div>
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-white/80 rounded-bl-xl z-20"></div>
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-white/80 rounded-br-xl z-20"></div>
            
            {analyzing && <div className="scanning-line z-30"></div>}

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
              <div className="z-20 text-center px-4">
                <AlertCircle className="w-10 h-10 text-coralRed mx-auto mb-2" />
                <p className="text-white font-bold text-sm">Camera Access Denied</p>
                <p className="text-sage text-[10px] mt-1">Please allow camera permissions or use the upload button below.</p>
              </div>
            )}

            {!analyzing && !imagePreview && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30">
                <button 
                  onClick={handleLiveCapture}
                  disabled={!hasPermission}
                  className={`w-20 h-20 bg-white/20 backdrop-blur-xl border-[6px] border-white rounded-full shadow-2xl flex items-center justify-center transition-all group ${!hasPermission ? 'opacity-50' : 'active:scale-95'}`}
                >
                  <div className="w-14 h-14 bg-white rounded-full group-active:scale-90 transition-transform"></div>
                </button>
              </div>
            )}
          </div>
        )}

        {!result && !analyzing && (
           <div className="mt-6 flex justify-center">
             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
             <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-2xl text-white font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform shadow-lg">
                <ImagePlus className="w-5 h-5" /> Upload from Gallery
             </button>
           </div>
        )}

        {result && (
          <div className="bg-white rounded-[20px] p-6 mb-4 shadow-2xl animate-in slide-in-from-bottom">
            {imagePreview && (
               <div className="w-full h-48 rounded-xl overflow-hidden mb-5 border border-sage/20">
                 <img src={imagePreview} alt="Scanned subject" className="w-full h-full object-cover" />
               </div>
            )}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-teal/10 rounded-xl flex items-center justify-center text-teal font-black text-xl border border-teal/20 shrink-0">
                {result.healthPercentage}%
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] text-sage font-bold uppercase tracking-widest truncate">Identified {result.type}</p>
                <p className="text-charcoal font-black text-lg leading-tight truncate">{result.identity}</p>
              </div>
            </div>
            
            {/* Diagnosis + Severity + Urgency */}
            <div className="border-t border-sage/10 pt-4 pb-2">
               <p className="text-[9px] text-sage font-bold uppercase tracking-widest mb-1">Diagnosis</p>
               <p className="font-extrabold text-charcoal">{result.diagnosis}</p>
               <div className="flex flex-wrap gap-2 mt-3">
                 <div className={`text-xs px-3 py-1.5 rounded-lg inline-block font-bold uppercase tracking-wider ${result.severity === 'Critical' ? 'bg-coralRed/10 text-coralRed' : result.severity === 'Healthy' ? 'bg-teal/10 text-teal' : 'bg-sage/20 text-charcoal'}`}>
                   Severity: {result.severity}
                 </div>
                 {result.urgency && (
                   <div className={`text-xs px-3 py-1.5 rounded-lg inline-block font-bold uppercase tracking-wider ${result.urgency === 'Immediate' ? 'bg-coralRed/10 text-coralRed border border-coralRed/20' : result.urgency === 'Within 24h' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-teal/10 text-teal border border-teal/20'}`}>
                     🕐 {result.urgency}
                   </div>
                 )}
               </div>
            </div>

            {/* Affected Area */}
            {result.affectedArea && (
              <div className="border-t border-sage/10 pt-4 pb-2">
                <p className="text-[9px] text-sage font-bold uppercase tracking-widest mb-1">Affected Area</p>
                <p className="font-bold text-charcoal text-sm">{result.affectedArea}</p>
              </div>
            )}

            {/* Possible Conditions */}
            {result.possibleConditions && result.possibleConditions.length > 0 && (
              <div className="border-t border-sage/10 pt-4 pb-2">
                <p className="text-[9px] text-sage font-bold uppercase tracking-widest mb-2">Possible Conditions</p>
                <div className="space-y-1.5">
                  {result.possibleConditions.map((cond, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0 ${i === 0 ? 'bg-coralRed' : i === 1 ? 'bg-amber-500' : 'bg-sage'}`}>{i + 1}</span>
                      <p className="text-sm font-semibold text-charcoal">{cond}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Immediate Care */}
            {result.immediateCare && (
              <div className="border-t border-sage/10 pt-4 pb-2">
                <p className="text-[9px] text-sage font-bold uppercase tracking-widest mb-1">⚡ Immediate Care</p>
                <p className="text-sm font-semibold text-charcoal leading-relaxed">{result.immediateCare}</p>
              </div>
            )}
            
            {/* Action Plan */}
            <div className="border-t border-sage/10 pt-4 mb-5">
              <p className="text-[9px] text-sage font-bold uppercase tracking-widest mb-2">Precaution & Action Plan</p>
              <p className="text-sm font-semibold text-charcoal leading-relaxed whitespace-pre-wrap">{result.actionPlan}</p>
            </div>
            
            <button onClick={handleExit} className="bg-charcoal text-white px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all w-full flex justify-center items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal" /> Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
