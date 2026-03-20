const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/genai");

// Initialize Gemini with API Key locally via process.env
const ai = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY // Ensure to set this in Firebase secrets
});

exports.analyzeCrop = onCall(async (request) => {
  try {
    const { imageUrl, language = "English" } = request.data;
    
    if (!imageUrl) {
      throw new HttpsError("invalid-argument", "The function must be called with an imageUrl.");
    }
    
    // In a real scenario, download the image from imageUrl and convert to base64, 
    // or pass the URI directly if using Google Cloud Storage URI gs://...
    
    const prompt = `Analyze this plant or livestock image. Return ONLY a JSON object with the following keys:
    'identity': What is the crop/livestock?
    'diagnosis': What is the suspected disease or distress?
    'severity': "Critical", "Moderate", or "Healthy"
    'confidenceScore': from 0 to 100
    'actionPlan': Step-by-step treatment protocols.
    Translate the entire JSON content into ${language}.`;

    // Note: The new @google/genai SDK requires the model and specific prompt structures.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      // You would append the image part here: [{ fileData: ... }, { text: prompt }]
    });

    const textRes = response.text;
    
    // Attempt to parse JSON
    let jsonResult;
    try {
      // Strip markdown code blocks if the model wrapped the JSON in ```json
      const cleanedText = textRes.replace(/```json/g, "").replace(/```/g, "");
      jsonResult = JSON.parse(cleanedText);
    } catch(e) {
      throw new HttpsError("internal", "Failed to parse Gemini output to JSON.");
    }

    return jsonResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new HttpsError("internal", error.message);
  }
});
