import React, { useState } from "react";
import "./App.css";

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detectedImage, setDetectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // To show loading state during detection

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setUploadedImage(URL.createObjectURL(selectedFile));
      setDetectedImage(null); // Reset detected image on new file upload
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleDetectImage = () => {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true); // Show loading state
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        setDetectedImage(URL.createObjectURL(blob));
        setLoading(false); // Hide loading state after detection
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false); // Hide loading state on error
      });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Circuit Component Detection</h1>
        <p className="app-description">
        Upload your circuit diagram to unleash the power of detection and identify components instantly!
        </p>
      </header>
      <main className="app-content">
        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <button
            onClick={handleDetectImage}
            className="detect-button"
            disabled={loading}
          >
            {loading ? "Detecting..." : "Detect Image"}
          </button>
        </div>
        <div className="image-preview-section">
          {uploadedImage && (
            <div className="image-container">
              <h3>Uploaded Image</h3>
              <img src={uploadedImage} alt="Uploaded" className="image-preview" />
            </div>
          )}
          {detectedImage && (
            <div className="image-container">
              <h3>Detected Image</h3>
              <img src={detectedImage} alt="Detected" className="image-preview" />
            </div>
          )}
        </div>
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 University Of Jaffna</p>
      </footer>
    </div>
  );
}

export default App;
