import React, { useState, useEffect } from "react";
import {
  analyzeImage,
  isConfiguredImageAnalyzer,
} from "./azure-image-analysis";
import {
  generateImage,
  isConfiguredImageGenerator,
} from "./azure-image-generation";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("Here appears the result");
  const [analyze, setAnalyze] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    async function checkConfiguration() {
      const imageAnalyzer = await isConfiguredImageAnalyzer();
      const imageGenerator = await isConfiguredImageGenerator();
      setIsConfigured(imageAnalyzer && imageGenerator);
    }
    checkConfiguration();
  }, []);

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmitAnalyze = async (event) => {
    event.preventDefault();
    const visionResults = await analyzeImage(prompt);
    setGenerate(false);
    setResult(JSON.stringify(visionResults, null, 2));
    setAnalyze(true);
  };

  const handleSubmitGenerate = async (event) => {
    event.preventDefault();
    setAnalyze(false);
    const generatedImage = await generateImage(prompt);
    setResult(generatedImage);
    setGenerate(true);
  };

  const renderAnalysisResult = () => {
    return (
      <div className="centered">
        <h2>Computer Vision Analysis</h2>
        <img className="image-preview" src={prompt} alt="prompt" />
        <div>
          <h3>Results</h3>
          <pre className="code-segment-dark">{result}</pre>
        </div>
      </div>
    );
  };

  const renderGenerationResult = () => {
    return (
      <div className="centered">
        <h2>Image Generation</h2>
        <img className="image-preview" src={result} alt={prompt} />
      </div>
    );
  };

  if (!isConfigured) {
    return (
      <div className="container-centered">
        <h1>Computer Vision</h1>
        <div className="horizontal-center full-width">
          <p className="warning-message">
            Woops! Service is not working. Please try again later or contact.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-centered">
      <h1>Computer Vision</h1>
      <div className="horizontal-center full-width">
        <form className="full-width">
          <label className="horizontal-center">
            Insert URL or type a prompt
          </label>
          <input
            className="full-width"
            name="input"
            placeholder="Enter URL to analyze or textual prompt to generate an image"
            type="text"
            onChange={handleInputChange}
            value={prompt}
          />
          <div className="horizontal-center">
            <button onClick={handleSubmitAnalyze}>Analyze</button>
            <button onClick={handleSubmitGenerate}>Generate</button>
          </div>
        </form>
      </div>
      {analyze && renderAnalysisResult()}
      {generate && renderGenerationResult()}
    </div>
  );
}

export default App;
