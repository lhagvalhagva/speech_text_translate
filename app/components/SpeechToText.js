"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Mic,
  MicOff,
  Upload,
  Search,
  Info,
  MessageCircle,
  Bot,
  User,
  Loader2,
} from "lucide-react";
import { createRoot } from "react-dom/client";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "./auth/AuthProvider";
import mammoth from "mammoth";
import { useToast } from "./ui/use-toast";
import { cn } from "../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import defaultText from "./default";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-1Q32RL1BNT"; // Your GA4 Measurement ID

const GoogleAnalytics = () => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
};

const highlightText = (text) => {
  if (!text) return null;

  // [] хаалтанд байгаа үгсийг тодруулах
  const squareBracketRegex = /\[(.*?)\]/g;
  let highlightedText = text.replace(
    squareBracketRegex,
    '<span class="inline-block bg-purple-100 text-purple-900 px-1 py-0.5 rounded text-xs font-medium border border-purple-200 mx-0.5 font-bold">[<strong>$1</strong>]</span>'
  );

  // {} хаалтанд байгаа үгсийг өнгөтэй болгох
  const curlyBracketRegex = /\{(.*?)\}/g;
  highlightedText = highlightedText.replace(
    curlyBracketRegex,
    '<span class="inline-block text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-xs font-medium border border-blue-200 mx-0.5">{$1}</span>'
  );

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: highlightedText,
      }}
    />
  );
};

const AIMessage = ({ message, type }) => {
  return (
    <div
      className={`flex gap-3 ${
        type === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      {type === "ai" && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          type === "user"
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
      </div>

      {type === "user" && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </div>
  );
};

const AIResponseCard = ({
  transcript,
  aiResponse,
  isProcessingAI,
  setAiResponse,
}) => {
  return (
    <Card className="mt-6 overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Assistant
            </h2>
          </div>
          {isProcessingAI && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              AI боловсруулж байна...
            </div>
          )}
        </div>

        <div className="min-h-[300px] max-h-[500px] overflow-y-auto p-4 bg-white rounded-lg shadow-inner">
          {transcript && <AIMessage message={transcript} type="user" />}

          {isProcessingAI && (
            <div className="flex gap-2 items-center text-gray-400 mb-4">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
          )}

          {aiResponse && <AIMessage message={aiResponse} type="ai" />}

          {!transcript && !aiResponse && !isProcessingAI && (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
              <Bot className="w-12 h-12 mb-3 text-gray-400" />
              <p className="text-center">
                Та ярьж эхлэхэд AI туслах хариу өгнө
              </p>
            </div>
          )}
        </div>

        {aiResponse && (
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={() => setAiResponse("")}
              variant="outline"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              Арилгах
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SpeechToText = () => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const [reconnectTimer, setReconnectTimer] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const CONFIDENCE_THRESHOLD = 0.7;
  const [interimTranscript, setInterimTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [translationError, setTranslationError] = useState(null);
  const [dailyLimit, setDailyLimit] = useState(5000);
  const [usedWords, setUsedWords] = useState(0);
  const [transcriptLines, setTranscriptLines] = useState([]);
  const PAUSE_THRESHOLD = 2000; // 2 секундийн дараа шинэ мөр эхлэх
  const [lastSpeechTime, setLastSpeechTime] = useState(Date.now());
  const [allTranscripts, setAllTranscripts] = useState([]);
  const [allTranslations, setAllTranslations] = useState([]);
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(false);
  const [translationCode, setTranslationCode] = useState("");
  const CORRECT_CODE = "0213";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChromeBrowser, setIsChromeBrowser] = useState(true);
  const { user } = useAuth();
  const [fileText, setFileText] = useState(defaultText);
  const [fileError, setFileError] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [matchingWords, setMatchingWords] = useState([]);
  const fileInputRef = useRef(null);
  const textContainerRef = useRef(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [savedFiles, setSavedFiles] = useState([]);
  const [loadingError, setLoadingError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds
  const [aiResponse, setAiResponse] = useState("");
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const handleClearText = () => {
    setTranscript("");
    setAllTranscripts([]);
    setInterimTranscript("");

    toast({
      description: "Текст амжилттай устгагдлаа",
    });
  };
  // Browser check useEffect дотор хийх
  useEffect(() => {
    const checkBrowser = () => {
      const isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
      setIsChromeBrowser(isChrome);
    };

    checkBrowser();
  }, []);

  useEffect(() => {
    // Page view бүртгэх
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: "Speech to Text",
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const toggleListening = async () => {
    if (!recognition) {
      setError("Speech Recognition is not initialized");
      return;
    }

    try {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        // Reset error and retry count
        setError(null);
        setRetryCount(0);

        // Check microphone permission first
        const permissionResult = await navigator.permissions.query({
          name: "microphone",
        });
        if (permissionResult.state === "denied") {
          setError("Microphone permission denied.");
          return;
        }

        // Start recognition only if it's not already running
        const startRecognition = async () => {
          try {
            await recognition.start();
            setIsListening(true);
          } catch (err) {
            if (err.message === "recognition has already started") {
              // If already started, stop and restart after a short delay
              recognition.stop();
              setTimeout(async () => {
                try {
                  await recognition.start();
                  setIsListening(true);
                } catch (e) {
                  console.warn("Failed to restart recognition:", e);
                  setError("Failed to restart speech recognition");
                  setIsListening(false);
                }
              }, 250);
            } else {
              throw err;
            }
          }
        };

        await startRecognition();
      }
    } catch (err) {
      console.warn("Toggle listening error:", err);
      setError("Speech recognition failed: " + err.message);
      setIsListening(false);
    }
  };

  // Үгийн тоо тооцох функц
  const countWords = (text) => {
    return text.trim().split(/\s+/).length;
  };

  // Сайжруулсан translateText функц
  const translateText = async (text) => {
    try {
      // Хоосон текст шалгах
      if (!text.trim()) return "";

      // Үгийн тоо шалгах
      const wordCount = countWords(text);
      if (usedWords + wordCount > dailyLimit) {
        setTranslationError("Өдрийн үгийн хязгаар хэтэрсэн байна.");
        return "";
      }

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Амжилттай орчуулсны дараа үгийн тоог нэмэх
      setUsedWords((prev) => prev + wordCount);

      return data.translation || "";
    } catch (error) {
      console.warn("Translation error:", error);
      setTranslationError(`Орчуулгын алдаа: ${error.message}`);
      return "";
    }
  };

  useEffect(() => {
    let recognitionInstance = null;

    const initializeRecognition = () => {
      try {
        if (
          !("SpeechRecognition" in window) &&
          !("webkitSpeechRecognition" in window)
        ) {
          setError("Таны browser speech recognition-г дэмжихгүй байна.");
          return null;
        }

        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const instance = new SpeechRecognition();

        // Configure recognition settings
        instance.continuous = true;
        instance.interimResults = true;
        instance.lang = "en-US";

        // Handle results
        instance.onresult = async (event) => {
          const now = Date.now();
          const timeSinceLastSpeech = now - lastSpeechTime;
          setLastSpeechTime(now);

          let currentInterim = "";
          const latestResult = event.results[event.results.length - 1];

          if (latestResult) {
            const bestResult = Array.from(latestResult).reduce(
              (best, alternative) => {
                return alternative.confidence > best.confidence
                  ? alternative
                  : best;
              },
              { confidence: 0, transcript: "" }
            );

            setConfidence(bestResult.confidence);

            if (latestResult.isFinal) {
              if (bestResult.confidence >= CONFIDENCE_THRESHOLD) {
                const cleanText = bestResult.transcript.trim();

                if (timeSinceLastSpeech > PAUSE_THRESHOLD) {
                  setAllTranscripts((prev) => [...prev, cleanText]);
                  setTranscript(cleanText);

                  // Орчуулга идэвхтэй үед орчуулах
                  if (isTranslationEnabled) {
                    const translation = await translateText(cleanText);
                    if (translation) {
                      setAllTranslations((prev) => [...prev, translation]);
                    }
                  } else {
                    // AI боловсруулалт хийх
                    await processWithAI(cleanText);
                  }
                }
              }
            } else {
              currentInterim = bestResult.transcript.trim();
            }
          }
          setInterimTranscript(currentInterim);
        };

        instance.onerror = (event) => {
          console.warn("Speech Recognition Error:", event.error);

          switch (event.error) {
            case "aborted":
              // Don't show error for normal aborts
              if (isListening) {
                setError("Таних үйл явц тасалдлаа. Дахин эхлүүлж байна...");
                restartRecognition(instance);
              }
              break;
            case "network":
              setError(
                "Сүлжээний алдаа гарлаа. Таны интернэт холболтыг шалгана уу."
              );
              break;
            case "not-allowed":
            case "permission-denied":
              setError("Микрофон ашиглах зөвшөөрөл өгөөгүй байна.");
              setIsListening(false);
              break;
            case "no-speech":
              setError("Ямар нэгэн дуу сонсогдсонгүй");
              break;
            case "audio-capture":
              setError("Микрофон олдсонгүй. Микрофоноо шалгана уу.");
              setIsListening(false);
              break;
            default:
              setError(`Алдаа гарлаа: ${event.error}`);
              setIsListening(false);
          }
        };

        // Handle end event with automatic restart if still listening
        instance.onend = () => {
          if (isListening && !isReconnecting) {
            restartRecognition(instance);
          }
        };

        return instance;
      } catch (err) {
        console.error("Speech Recognition initialization failed:", err);
        setError("Speech Recognition initialization failed: " + err.message);
        return null;
      }
    };

    // Helper function to restart recognition
    const restartRecognition = async (instance) => {
      try {
        if (instance && isListening && !isReconnecting) {
          // Add small delay before restarting
          await new Promise((resolve) => setTimeout(resolve, 300));
          await instance.start();
        }
      } catch (err) {
        console.warn("Failed to restart recognition:", err);
        if (err.message !== "recognition has already started") {
          setError("Дахин эхлүүлэхэд алдаа гарлаа");
          setIsListening(false);
        }
      }
    };

    // Initialize recognition
    const initRecognition = () => {
      recognitionInstance = initializeRecognition();
      setRecognition(recognitionInstance);
    };

    initRecognition();

    // Cleanup
    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
          setIsListening(false);
        } catch (e) {
          console.warn("Error stopping recognition:", e);
        }
      }
    };
  }, [isTranslationEnabled, isListening, isReconnecting, lastSpeechTime]);

  // Clear функцийг шинэчлэх
  const clearAll = () => {
    setAllTranscripts([]);
    setAllTranslations([]);
    setInterimTranscript("");
    setError(null);
    setConfidence(0);
  };

  // Орчуулах функц эмэх
  const handleTranslate = async () => {
    // Үлдсэн орчуулаагй текстүүдийг олох
    const untranslatedTexts = allTranscripts.slice(allTranslations.length);

    for (const text of untranslatedTexts) {
      const translatedText = await translateText(text);
      if (translatedText) {
        setAllTranslations((prev) => [...prev, translatedText]);
      } else {
        // Хэрэв орчуулга амжилтгүй болвол зогсоох
        break;
      }
    }
  };

  // Код шалгах функц дотор alert-ийг custom dialog болгох
  const handleTranslationCode = () => {
    const code = prompt("Орчуулах кодоо оруулна уу:");
    if (code === CORRECT_CODE) {
      setIsTranslationEnabled(true);
      setTranslationCode(code);
      // Alert-ийг custom toast болгох
      const successMessage = document.createElement("div");
      successMessage.className =
        "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg transition-opacity duration-500 flex items-center";
      successMessage.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span class="font-medium">Орчуулга амжилттай идэвхжлээ!</span>
      `;
      document.body.appendChild(successMessage);

      // 3 секундын араа автоматаар алга болох
      setTimeout(() => {
        successMessage.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 500);
      }, 3000);
    } else {
      // Буруу код оруулса үе улаан өнгөтэй alert
      const errorMessage = document.createElement("div");
      errorMessage.className =
        "fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg transition-opacity duration-500 flex items-center";
      errorMessage.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <span class="font-medium">Буруу код! Дахи ородоно уу.</span>
      `;
      document.body.appendChild(errorMessage);

      // 3 секундын дараа автоматаар алга болох
      setTimeout(() => {
        errorMessage.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(errorMessage);
        }, 500);
      }, 3000);

      setIsTranslationEnabled(false);
    }
  };

  // Toast үзүүлх функц
  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.style.zIndex = "9999";
    document.body.appendChild(toast);

    const root = createRoot(toast);
    root.render(<Toast message={message} type={type} />);

    // Fade out animation
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-20px)";
      toast.style.transition = "all 0.3s ease-in-out";

      setTimeout(() => {
        root.unmount();
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  // Орчуулгын горимоос гарах функц
  const handleDisableTranslation = () => {
    setIsTranslationEnabled(false);
    setTranslationCode("");
    // Toast мессеж харуулах
    showToast("Орчуулгын горимоос гарла", "success");
  };

  // Toast компонент
  const Toast = ({ message, type }) => (
    <div
      className={`
        fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg 
        flex items-center space-x-2 
        transform transition-all duration-300
        z-[9999]
        ${
          type === "success"
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-red-100 text-red-800 border border-red-200"
        }
      `}
      style={{
        pointerEvents: "none",
      }}
    >
      {type === "success" ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span className="font-medium">{message}</span>
    </div>
  );

  // Custom Modal компонент
  const TranslationCodeModal = ({ isOpen, onClose }) => {
    const [code, setCode] = useState("");

    const handleSubmit = () => {
      if (code === CORRECT_CODE) {
        setIsTranslationEnabled(true);
        setTranslationCode(code);
        showToast("Орчуулга амжилттай идэвхжлээ!", "success");
        onClose();
      } else {
        showToast("Буруу код! Дахин оролдоно уу.", "error");
        setCode("");
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Орчуулгын код оруулах
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Орчуулгыг идэвхжүүлэхийн тулд зөв код оруулна уу.
            </p>
          </div>

          <div className="mb-6">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Кодоо оруулна уу"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
            >
              Цуцлах
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
            >
              Батлах
            </button>
          </div>
        </div>
      </div>
    );
  };

  // isSearchMode өөрчлөгдөх үе alert харуулах
  useEffect(() => {
    if (isSearchMode) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // 3 секундын дараа алга болгох

      return () => clearTimeout(timer); // cleanup
    }
  }, [isSearchMode]);

  // Retry function with exponential backoff
  const retryOperation = async (operation, retries = 0) => {
    try {
      return await operation();
    } catch (error) {
      if (retries < maxRetries) {
        const delay = retryDelay * Math.pow(2, retries);
        console.log(`Retrying after ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return retryOperation(operation, retries + 1);
      }
      throw error;
    }
  };

  // Modified loadSavedFiles with retry
  const loadSavedFiles = async () => {
    if (!user) return;

    try {
      setLoadingError(null);

      const operation = async () => {
        const q = query(
          collection(db, "files"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const files = [];
        querySnapshot.forEach((doc) => {
          files.push({ id: doc.id, ...doc.data() });
        });
        return files;
      };

      const files = await retryOperation(operation);
      setSavedFiles(files);
    } catch (error) {
      console.error("Error loading files:", error);

      if (error.code === "unavailable") {
        setLoadingError(
          "Сүлжээний алдаа гарлаа. Та интернет холболтоо шалгана уу."
        );
      } else {
        setLoadingError("Файлуудыг ачаалахад алдаа гарлаа. Дахин оролдоно уу.");
      }
    }
  };

  // User өөрчлөгдөх үед файлуудыг ачаалах
  useEffect(() => {
    if (user) {
      loadSavedFiles();
    } else {
      setSavedFiles([]);
    }
  }, [user]);

  // Файл оруулах handler
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessingFile(true);
    setFileError(null);

    try {
      let text = "";

      if (file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.name.endsWith(".txt")) {
        text = await file.text();
      } else {
        throw new Error("Зөвхөн .docx болон .txt файл оруулах боломжтой.");
      }

      // Файлын контентыг форматлах
      const formattedText = text
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      // Файлын мэдээллийг Firestore-д хадгалах
      if (user) {
        try {
          await addDoc(collection(db, "files"), {
            userId: user.uid,
            fileName: file.name,
            content: formattedText,
            createdAt: Timestamp.now(),
          });

          toast({
            description: "Файл амжилттай хадгалагдлаа",
          });

          // Файлын жагсаалтыг шинэчлэх
          loadSavedFiles();
        } catch (dbError) {
          console.error("Database error:", dbError);
          toast({
            variant: "destructive",
            title: "Алдаа",
            description: "Файл хадгалахад алдаа гарлаа. Дахин оролдоно уу.",
          });
        }
      }

      // Файлын контентыг state-д оноох
      setFileText(formattedText);

      // Файлын контентоос асуулт, хариултуудыг задлах
      const qaRegex = /\[(.*?)\][\s\n]*{([\s\S]*?)}/g;
      const answers = {};
      let match;

      while ((match = qaRegex.exec(formattedText)) !== null) {
        const question = match[1].trim();
        const answer = match[2].trim();
        answers[question] = answer;
      }

      // Reset file input
      event.target.value = "";
    } catch (error) {
      console.error("File processing error:", error);
      setFileError(error.message || "Файл уншихад алдаа гарлаа");
      toast({
        variant: "destructive",
        title: "Файл алдаа",
        description:
          error.message || "Файл уншихад алдаа гарлаа. Дахин оролдоно уу.",
      });
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Файл устгах функц
  const handleDeleteFile = async (fileId) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "files", fileId));
      setSavedFiles((prev) => prev.filter((file) => file.id !== fileId));

      toast({
        description: "Файл амжилттай устгагдлаа",
      });
    } catch (error) {
      console.error("Error deleting file:", error);

      toast({
        variant: "destructive",
        description: "Фа��л устгахад алдаа гарлаа",
      });
    }
  };

  // Текст хайх функц
  const searchAndScrollToText = (searchText) => {
    if (!searchText || !fileText) return;

    const cleanSearchText = searchText.trim().toLowerCase();
    const textElements = textContainerRef.current?.getElementsByTagName("span");

    if (!textElements) return;

    let found = false;

    // Хайх текстийг [] ба {} хаалттай эсэхийг шалгах
    const searchInBrackets = (text, bracket) => {
      const regex = bracket === "square" ? /\[(.*?)\]/g : /\{(.*?)\}/g;
      const matches = [...text.matchAll(regex)];

      for (const match of matches) {
        if (match[1].toLowerCase().includes(cleanSearchText)) {
          return true;
        }
      }
      return false;
    };

    // Бүх элементүүдийг шалгах
    for (const element of textElements) {
      const elementText = element.textContent.toLowerCase();

      if (
        elementText.includes(cleanSearchText) ||
        searchInBrackets(elementText, "square") ||
        searchInBrackets(elementText, "curly")
      ) {
        // Олдсон элемент рүү scroll хийх
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Олдон текстийг түр хугацаагаар highlight хийх
        element.classList.add("bg-yellow-200");
        setTimeout(() => {
          element.classList.remove("bg-yellow-200");
        }, 2000);

        found = true;
        break;
      }
    }

    // Олдоогүй бол toast харуулах
    if (!found) {
      toast({
        description: "Таны хэлсэн үг олдсонгүй",
        variant: "destructive",
      });
    }
  };

  // Speech recognition handler дотор нэмэх
  useEffect(() => {
    if (transcript) {
      searchAndScrollToText(transcript);
    }
  }, [transcript]);

  // Add new function to handle AI processing
  const processWithAI = async (text) => {
    if (!text?.trim()) return;

    setIsProcessingAI(true);
    try {
      // First, try to find exact match in the file content
      const qaRegex = /\[(.*?)\][\s\n]*{([\s\S]*?)}/g;
      let matches = [];
      let match;

      while ((match = qaRegex.exec(fileText)) !== null) {
        matches.push({
          question: match[1].trim().toLowerCase(),
          answer: match[2].trim(),
        });
      }

      // Find best matching question
      const userQuestion = text.toLowerCase();
      let bestMatch =
        matches.find((m) => m.question === userQuestion) ||
        matches.find((m) => userQuestion.includes(m.question)) ||
        matches.find((m) => m.question.includes(userQuestion));

      if (bestMatch) {
        setAiResponse(bestMatch.answer);
        return;
      }

      // If no match found in file, call AI API
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `AI request failed: ${response.status}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAiResponse(data.response);
    } catch (error) {
      console.error("AI Processing error:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description:
          error.message ||
          "Хариулт боловсруулахад алдаа гарлаа. Дахин оролдоно уу.",
      });
    } finally {
      setIsProcessingAI(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Browser check message */}
      {!isChromeBrowser && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-yellow-700 font-medium">
                Анхааруулга: Энэ апп зөвхөн Google Chrome browser дээр бүрэн
                ажиллах боломжтой.
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Speech Recognition API нь Chrome browser дээр хамгийн сайн
                дэмжигддэг тул Chrome browser ашиглахыг зөвлөж байна.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Section */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {user ? (
              // Нэвтэрсэн үед харуулах
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Файл оруулах
                  </h2>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".docx,.txt"
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingFile || !user}
                    className={cn(
                      "flex items-center gap-2 text-white", // text-white нэмсэн
                      isProcessingFile
                        ? "bg-gray-400"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                    )}
                  >
                    {isProcessingFile ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Боловсруулж байна...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Файл оруулах</span>
                      </>
                    )}
                  </Button>
                </div>

                {fileError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{fileError}</p>
                  </div>
                )}

                {fileText && !fileError && (
                  <div className="mt-4 bg-white rounded-lg border shadow-sm">
                    <div className="max-h-[200px] overflow-y-auto p-4 custom-scrollbar">
                      <div className="whitespace-pre-wrap break-words text-xs leading-[1.2] text-gray-600">
                        {highlightText(fileText)}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Нэвтрээгүй үед харуулах
              <div className="flex flex-col items-center justify-center py-8 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-600 text-center mb-2">
                  Файл оруулахын тулд нэвтэрнэ үү
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <br></br>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* English Speech Recognition Card */}
        <Card className="overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Speech to Text
              </h2>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="flex flex-col gap-8">
                  {/* Buttons Container */}
                  <div className="flex items-center justify-center gap-4">
                    {/* Микрофон button */}
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        onClick={toggleListening}
                        className={`w-12 h-10 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 ${
                          isListening
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        }`}
                      >
                        {isListening ? (
                          <MicOff className="w-10 h-10 text-white" />
                        ) : (
                          <Mic className="w-10 h-10 text-white" />
                        )}
                      </Button>
                    </div>

                    {/* Хайх горим button */}
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        onClick={handleClearText}
                        className={`w-12 h-10 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 
                          bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50`}
                        title="Текст устгах"
                      >
                        <svg
                          className="w-6 h-6 text-gray-600 hover:text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div
              ref={textContainerRef}
              className="min-h-[300px] p-4 bg-gray-50 rounded-lg overflow-y-auto shadow-inner relative"
            >
              {allTranscripts.map((text, index) => (
                <div
                  key={index}
                  className="mb-3 text-base md:text-lg leading-relaxed text-black font-medium"
                >
                  {highlightText(text)}
                </div>
              ))}
              {/* Interim transcript */}
              {interimTranscript && (
                <div className="text-gray-400 italic">{interimTranscript}</div>
              )}
              {/* Empty state */}
              {allTranscripts.length === 0 && !interimTranscript && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Mic className="w-8 h-8 mb-2 opacity-50" />
                  <p>Start speaking...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Remove the Mongolian Translation Card and directly place AI Response Card */}
        {!isTranslationEnabled && (
          <AIResponseCard
            transcript={transcript}
            aiResponse={aiResponse}
            isProcessingAI={isProcessingAI}
            setAiResponse={setAiResponse}
          />
        )}
      </div>

      <TranslationCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {user && (
        <Card className="overflow-hidden mt-4">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Өмнө оруулсан файлууд
                </h3>

                <Button
                  onClick={loadSavedFiles}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </Button>
              </div>

              {/* Error message */}
              {loadingError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {loadingError}
                </div>
              )}

              {savedFiles.length > 0 ? (
                <div className="grid gap-3">
                  {savedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 bg-white rounded-lg border hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center gap-2 flex-1 cursor-pointer"
                          onClick={() => setFileText(file.content)}
                        >
                          <svg
                            className="w-5 h-5 text-gray-500 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium text-gray-700 truncate block">
                              {file.fileName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {file.createdAt.toDate().toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Delete button with confirmation */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                              title="Устгах"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Файл устгах уу?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Энэ үйлдлийг буцаах боломжгүй. Файл бүр мөсөн
                                устах болно.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Цуцлах</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFile(file.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Устгах
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loadingError && (
                  <div className="text-center py-8 text-gray-500">
                    Одоогоор файл оруулаагүй байна
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpeechToText;
