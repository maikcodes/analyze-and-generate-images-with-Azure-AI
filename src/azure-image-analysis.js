const VISION_ENDPOINT = process.env.REACT_APP_VISION_ENDPOINT;
const VISION_KEY = process.env.REACT_APP_VISION_KEY;

export async function isConfiguredImageAnalyzer() {
  return VISION_ENDPOINT && VISION_KEY;
}

export async function analyzeImage(imageUrl) {
  
  const response = await fetch(
    `https://${VISION_ENDPOINT}/computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2023-02-01-preview`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": VISION_KEY,
      },
      body: JSON.stringify({
        url: imageUrl,
      }),
    }
  );
  const data = await response.json();
  return data;
}
