import { useRef, useState } from "react";
import "./App.css";
import api from "./services/api";
import logo from "./assets/logo.png";
import {
  FaShieldAlt,
  FaLock,
  FaFilePdf,
} from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";

const App = () => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [backendMessage, setBackendMessage] = useState("");
  const [recommendationResult, setRecommendationResult] = useState(null);

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setBackendMessage("Please upload only PDF files.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setStatusMessage("Uploading and validating document. Please wait...");
    setBackendMessage("");
    setRecommendationResult(null);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Backend Response:", response.data);
      setBackendMessage(
        response.data?.message || "Insurance document uploaded successfully."
      );
      setRecommendationResult(response.data?.recommendationResult || null);
      setStatusMessage("Validation complete.");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Upload failed. Please ensure the backend server is running.";
      setBackendMessage(errorMessage);
      setStatusMessage("Upload failed.");
    } finally {
      setIsUploading(false);
      event.target.value = null;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logoSection">
          <img src={logo} alt="Insurance Logo" className="logo" />
          <div>
            <h2>Insurance Claim Validator</h2>
            <p>AI Powered Document Verification</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        <div className="left">
          <div className="heroTitle"></div>

          <p className="description">
            Upload your insurance plan document and get AI-powered validation
            instantly. Our intelligent validation engine analyzes your insurance
            document quickly and efficiently.
          </p>

          <div className="featureList">
            <div className="feature">
              <div className="featureIcon">
                <FaShieldAlt />
              </div>
              <div>
                <h3>Accurate Validation</h3>
                <p>AI verifies your insurance documents with high accuracy.</p>
              </div>
            </div>

            <div className="feature">
              <div className="featureIcon">
                <FaBoltLightning />
              </div>
              <div>
                <h3>Fast & Reliable</h3>
                <p>Get accurate validation results in just a few seconds.</p>
              </div>
            </div>

            <div className="feature">
              <div className="featureIcon">
                <FaLock />
              </div>
              <div>
                <h3>Secure & Private</h3>
                <p>Your uploaded documents remain confidential and safe.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="pdfIcon"><FaFilePdf /></div>

          <h2>Upload Insurance Document</h2>

          <p className="subtitle">Only PDF files are allowed</p>

          <button
            className="uploadBtn"
            onClick={openFilePicker}
            disabled={isUploading}
          >
            {isUploading ? "Processing document..." : "Upload PDF"}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {statusMessage && (
            <p className="statusText">{statusMessage}</p>
          )}

          {backendMessage && (
            <p className="responseMessage">{backendMessage}</p>
          )}

          {recommendationResult && (
            <div className="recommendationBox">
              <h4>Recommendation: <span className={`recommendation-${recommendationResult.recommendation?.toLowerCase()}`}>
                {recommendationResult.recommendation}
              </span></h4>
            </div>
          )}

          <div className="cardNote">
            <span className="noteIcon">🔐</span>
            <p>Your file will be securely processed.</p>
          </div>
        </div>
      </div>

      <footer>
        <div>© 2026 Insurance Claim Validator</div>
        <div>Secured. Reliable. Trusted.</div>
      </footer>
    </div>
  );
};

export default App;
