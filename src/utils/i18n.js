export const getTranslation = (enString) => {
  const userLang = localStorage.getItem('SMART_AG_LANG') || 'English';
  
  const dict = {
    "Hindi": {
      "Welcome to FarmBuddy": "फार्म्बडी में आपका स्वागत है", 
      "Overall Health": "समग्र स्वास्थ्य", 
      "Total Scans": "कुल स्कैन", 
      "Issues Picked": "समस्याएं", 
      "Recent AI Insight": "हालिया जानकारी", 
      "Recent": "हाल ही में", 
      "Crops": "फसलें", 
      "Livestock": "पशुधन", 
      "Recent Scans": "हालिया स्कैन", 
      "Good": "अच्छा", 
      "Settings": "सेटिंग्स",
      "Configure your app preferences": "अपनी ऐप प्राथमिकताएं कॉन्फ़िगर करें",
      "Save Key": "सेव कुंजी",
      "Saved!": "सेव हो गया!"
    },
    "Tamil": {
      "Welcome to FarmBuddy": "ஃபார்ம்படிக்கு வரவேற்கிறோம்", 
      "Overall Health": "மொத்த ஆரோக்கியம்", 
      "Total Scans": "மொத்த ஸ்கேன்", 
      "Issues Picked": "சிக்கல்கள்", 
      "Recent AI Insight": "சமீபத்திய தகவல்", 
      "Recent": "சமீபத்திய", 
      "Crops": "பயிர்கள்", 
      "Livestock": "கால்நடைகள்", 
      "Recent Scans": "ஸ்கேன்கள்", 
      "Good": "நல்லது",
      "Settings": "அமைப்புகள்",
      "Configure your app preferences": "பயன்பாட்டு அமைப்புகளை உள்ளமைக்கவும்",
      "Save Key": "சேமி",
      "Saved!": "சேமிக்கப்பட்டது!"
    },
    "Telugu": {
      "Welcome to FarmBuddy": "ఫార్మ్‌బడ్డీకి స్వాగతం", 
      "Overall Health": "ఆరోగ్యము", 
      "Total Scans": "మొత్తం స్కాన్లు", 
      "Issues Picked": "సమస్యలు", 
      "Recent AI Insight": "సమాచారం", 
      "Recent": "ఇటీవల", 
      "Crops": "పంటలు", 
      "Livestock": "పశువులు", 
      "Recent Scans": "ఇటీవలి స్కాన్లు", 
      "Good": "మంచిది",
      "Settings": "సెట్టింగులు",
      "Configure your app preferences": "ప్రాధాన్యతలను అనుకూలీకరించండి",
      "Save Key": "సేవ్ చేయండి",
      "Saved!": "సేవ్ చేయబడింది!"
    },
    "Odia": {
      "Welcome to FarmBuddy": "ଫାର୍ମବଡ଼ି କୁ ସ୍ୱାଗତ", 
      "Overall Health": "ମୋଟ ସ୍ୱାସ୍ଥ୍ୟ", 
      "Total Scans": "ମୋଟ ସ୍କାନ", 
      "Issues Picked": "ସମସ୍ୟା", 
      "Recent AI Insight": "ସାମ୍ପ୍ରତିକ ତଥ୍ୟ", 
      "Recent": "ସାମ୍ପ୍ରତିକ", 
      "Crops": "ଫସଲ", 
      "Livestock": "ପଶୁଧନ", 
      "Recent Scans": "ସାମ୍ପ୍ରତିକ ସ୍କାନ", 
      "Good": "ଭଲ",
      "Settings": "ସେଟିଂସ",
      "Configure your app preferences": "ଆପଣଙ୍କର ଆପ୍ ବିକଳ୍ପ ସେଟ୍ କରନ୍ତୁ",
      "Save Key": "ସେଭ୍ କରନ୍ତୁ",
      "Saved!": "ସେଭ୍ ହେଲା!"
    }
  };
  
  return dict[userLang]?.[enString] || enString;
};
