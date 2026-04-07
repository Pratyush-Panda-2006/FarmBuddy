import PptxGenJS from 'pptxgenjs';

let pptx = new PptxGenJS();

pptx.layout = 'LAYOUT_16x9';

// Slide 1: Primary Title //
let slide1 = pptx.addSlide();
slide1.background = { fill: '171E19' };
slide1.addText('🌾 FarmBuddy', { x: '10%', y: '30%', w: '80%', fontSize: 48, bold: true, align: 'center', color: 'FFE17C' });
slide1.addText('AI-Powered Smart Agriculture Diagnostic Platform\nScan. Diagnose. Protect.', { x: '10%', y: '50%', w: '80%', fontSize: 24, align: 'center', color: '2EC4B6' });

// Slide 2: The Problem //
let slide2 = pptx.addSlide();
slide2.background = { fill: 'FFFFFF' };
slide2.addText('The Problem in Indian Agriculture', { x: '5%', y: '5%', w: '90%', fontSize: 32, bold: true, color: '171E19', border: [0,0,{pt:'2', color:'2EC4B6'},0] });
slide2.addText([
    { text: 'Huge Crop Losses:\n', options: { bold:true, fontSize: 20, color: 'E63946' } },
    { text: '₹50,000+ crore annual crop losses due to delayed diagnosis.\n\n', options: { fontSize: 18 } },
    { text: 'Lack of Experts:\n', options: { bold:true, fontSize: 20, color: 'E63946' } },
    { text: '70% of farmers lack access to agronomists/vets.\n\n', options: { fontSize: 18 } },
    { text: 'Language Barriers:\n', options: { bold:true, fontSize: 20, color: 'E63946' } },
    { text: 'Existing solutions are usually English-only.\n\n', options: { fontSize: 18 } },
    { text: 'High Costs:\n', options: { bold:true, fontSize: 20, color: 'E63946' } },
    { text: 'Small-scale farmers cannot afford professional diagnostic services.', options: { fontSize: 18 } }
], { x: '5%', y: '25%', w: '90%', h: '60%' });


// Slide 3: The Solution //
let slide3 = pptx.addSlide();
slide3.background = { fill: 'FFFFFF' };
slide3.addText('FarmBuddy: The Solution', { x: '5%', y: '5%', w: '90%', fontSize: 32, bold: true, color: '171E19', border: [0,0,{pt:'2', color:'2EC4B6'},0] });
slide3.addText([
    { text: 'Instant AI Diagnosis:\n', options: { bold: true, fontSize: 24, color: '2EC4B6' } },
    { text: 'Farmers photograph a sick crop/animal → AI returns diagnosis in < 3s.\n\n', options: { fontSize: 20 } },
    { text: 'Actionable Plans:\n', options: { bold: true, fontSize: 24, color: '2EC4B6' } },
    { text: 'Step-by-step treatment protocols instead of just "what is wrong".\n\n', options: { fontSize: 20 } },
    { text: 'Accessibility First:\n', options: { bold: true, fontSize: 24, color: '2EC4B6' } },
    { text: 'Translates natively into 22 Indian Languages. Free to use, built as an offline-first PWA.', options: { fontSize: 20 } }
], { x: '5%', y: '25%', w: '90%', h: '60%' });


// Slide 4: Unique Selling Proposition //
let slide4 = pptx.addSlide();
slide4.background = { fill: 'FFFFFF' };
slide4.addText('Unique Selling Proposition (USP)', { x: '5%', y: '5%', w: '90%', fontSize: 32, bold: true, color: '171E19', border: [0,0,{pt:'2', color:'2EC4B6'},0] });
slide4.addText([
    { text: '🏆 The ONLY solution offering:\n\n', options: { bold: true, fontSize: 22, color:'171E19' } },
    { text: '1. Dual-Domain AI: Works for CROPS & LIVESTOCK.\n\n', options: { fontSize: 20 } },
    { text: '2. Context-Aware: Uses real farmer logs & weather to generate Smart Alerts.\n\n', options: { fontSize: 20 } },
    { text: '3. 22-Language Integration: UI, AI outputs, and Voice Input.\n\n', options: { fontSize: 20 } },
    { text: '4. Zero Server Cost: Runs client-side directly using Gemini via API keys.\n\n', options: { fontSize: 20 } },
    { text: '5. Offline PWA: Works without connectivity, natively installable.', options: { fontSize: 20 } }
], { x: '5%', y: '25%', w: '90%', h: '60%' });


// Slide 5: Core Features //
let slide5 = pptx.addSlide();
slide5.background = { fill: 'FFFFFF' };
slide5.addText('Core Features', { x: '5%', y: '5%', w: '90%', fontSize: 32, bold: true, color: '171E19', border: [0,0,{pt:'2', color:'2EC4B6'},0] });
slide5.addText([
    { text: '📸 AI Camera Scanner (Gemini Flash Model)\n\n', options: { bold:true, fontSize: 20 } },
    { text: '📊 Smart Analytics Dashboard (Yield, Growth, Milking)\n\n', options: { bold:true, fontSize: 20 } },
    { text: '🌦️ Hyperlocal Weather Intelligence & Smart Alerts\n\n', options: { bold:true, fontSize: 20 } },
    { text: '💬 Voice-enabled AI Chat Assistant\n\n', options: { bold:true, fontSize: 20 } },
    { text: '🗺️ Interactive Farm & Field Mapping (Leaflet)\n', options: { bold:true, fontSize: 20 } },
], { x: '5%', y: '25%', w: '90%', h: '60%' });

// Slide 6: Tech Stack //
let slide6 = pptx.addSlide();
slide6.background = { fill: 'F8F9FA' };
slide6.addText('Technology Stack & Architecture', { x: '5%', y: '5%', w: '90%', fontSize: 32, bold: true, color: '171E19', border: [0,0,{pt:'2', color:'2EC4B6'},0] });
slide6.addText([
    { text: 'Client PWA:\n', options: { bold:true, fontSize: 20, color:'4285F4' } },
    { text: 'React 19, Vite, TailwindCSS, React-Router.\n\n', options: { fontSize: 20 } },
    { text: 'AI Engine:\n', options: { bold:true, fontSize: 20, color:'4285F4' } },
    { text: 'Google Gemini 2.5 Flash / 1.5 Flash (Vision & Text).\n\n', options: { fontSize: 20 } },
    { text: 'Data & Maps:\n', options: { bold:true, fontSize: 20, color:'4285F4' } },
    { text: 'IndianAPI (Weather), OSM Leaflet (Maps), LocalStorage (State).\n\n', options: { fontSize: 20 } },
    { text: 'Deployment:\n', options: { bold:true, fontSize: 20, color:'4285F4' } },
    { text: 'Firebase Hosting (Offline caching via Service Workers).', options: { fontSize: 20 } },
], { x: '5%', y: '25%', w: '90%', h: '60%' });


// Slide 7: Future Development //
let slide7 = pptx.addSlide();
slide7.background = { fill: 'FFFFFF' };
slide7.addText('Roadmap & Future Enhancements', { x: '5%', y: '5%', w: '90%', fontSize: 32, bold: true, color: '171E19', border: [0,0,{pt:'2', color:'2EC4B6'},0] });
slide7.addText([
    { text: 'Firebase Backend Sync', options: { fontSize: 22, bullet: true, bold:true } },
    { text: ' (Firestore and Cloud Auth)\n\n', options: { fontSize: 20 } },
    { text: 'WhatsApp Bot Integration', options: { fontSize: 22, bullet: true, bold:true } },
    { text: ' (Expanding access further)\n\n', options: { fontSize: 20 } },
    { text: 'On-Device Offline AI', options: { fontSize: 22, bullet: true, bold:true } },
    { text: ' (TFLite models for zero-connection inference)\n\n', options: { fontSize: 20 } },
    { text: 'Regional Mandi Prices', options: { fontSize: 22, bullet: true, bold:true } },
    { text: ' (Real-time commodity data)\n\n', options: { fontSize: 20 } },
    { text: 'Predictive Yield Models', options: { fontSize: 22, bullet: true, bold:true } },
    { text: ' (Machine Learning + GIS Data)\n', options: { fontSize: 20 } },
], { x: '5%', y: '25%', w: '90%', h: '60%' });


// Save Presentation //
pptx.writeFile({ fileName: 'FarmBuddy_Pitch_Deck.pptx' }).then(fileName => {
    console.log('Successfully saved ' + fileName);
}).catch(err => {
    console.error('Error generating PPTX:', err);
});
