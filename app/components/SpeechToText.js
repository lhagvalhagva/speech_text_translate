"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { createRoot } from "react-dom/client";

const SpeechToText = () => {
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
  const [currentLine, setCurrentLine] = useState("");
  const PAUSE_THRESHOLD = 2000; // 2 секундийн дараа шинэ мөр эхлэх
  const [lastSpeechTime, setLastSpeechTime] = useState(Date.now());
  const [allTranscripts, setAllTranscripts] = useState([]);
  const [allTranslations, setAllTranslations] = useState([]);
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(false);
  const [translationCode, setTranslationCode] = useState("");
  const CORRECT_CODE = "0213";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChromeBrowser, setIsChromeBrowser] = useState(true);

  // Browser check useEffect дотор хийх
  useEffect(() => {
    const checkBrowser = () => {
      const isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
      setIsChromeBrowser(isChrome);
    };

    checkBrowser();
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

    const handleReconnect = async (instance) => {
      try {
        setIsReconnecting(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (instance) {
          instance.stop();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await instance.start();
        }
      } catch (e) {
        console.warn("Reconnection attempt failed:", e);
        setError("Дахин холбогдох оролдлого амжилтгүй боллоо.");
        setIsListening(false);
      } finally {
        setIsReconnecting(false);
      }
    };

    const initializeRecognition = () => {
      try {
        const instance = new (window.SpeechRecognition ||
          window.webkitSpeechRecognition)();

        instance.continuous = true;
        instance.interimResults = true;
        instance.lang = "en-US";

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

                  // Орчуулга идэвхтэй үед шууд орчуулах
                  console.log("Translation enabled:", isTranslationEnabled); // Debug log
                  if (isTranslationEnabled) {
                    console.log("Attempting to translate:", cleanText); // Debug log
                    const translatedText = await translateText(cleanText);
                    console.log("Translation result:", translatedText); // Debug log
                    if (translatedText) {
                      setAllTranslations((prev) => [...prev, translatedText]);
                    }
                  }
                }
              }
            } else {
              currentInterim = bestResult.transcript.trim();
            }
          }
          setInterimTranscript(currentInterim);
        };

        instance.onerror = async (event) => {
          console.warn("Speech Recognition Status:", event.error);

          if (event.error === "no-speech") {
            setError("No speech detected. Please speak more clearly.");
            return;
          }

          if (event.error === "network" && retryCount < MAX_RETRIES) {
            const nextRetryCount = retryCount + 1;
            setRetryCount(nextRetryCount);
            setError(
              `Сүлжээний алдаа гарлаа. ${nextRetryCount}-р оролдлого... (${nextRetryCount}/${MAX_RETRIES})`
            );

            if (reconnectTimer) {
              clearTimeout(reconnectTimer);
            }

            const timer = setTimeout(() => handleReconnect(instance), 1000);
            setReconnectTimer(timer);
          } else {
            switch (event.error) {
              case "network":
                setError(
                  `Сүлжээний алдаа гарлаа. Таны интернэт холболтыг шалгана уу. (${MAX_RETRIES}/${MAX_RETRIES} оролдлого дууссан)`
                );
                break;
              case "not-allowed":
              case "permission-denied":
                setError("Микрофон ашиглах зөвшөөрөл өгөөгүй байна.");
                break;
              case "no-speech":
                setError("Ямар нэгэн ду сонсогдсонгүй");
                break;
              case "audio-capture":
                setError("Микрофон лдсонгүй. Микрофоноо шалгана уу.");
                break;
              default:
                setError(`Алдаа гарлаа: ${event.error}`);
            }
            setIsListening(false);
          }
        };

        instance.onend = () => {
          if (isListening && !isReconnecting) {
            try {
              // Add delay and check state before restarting
              setTimeout(() => {
                if (isListening && !isReconnecting) {
                  instance.start();
                }
              }, 250);
            } catch (e) {
              console.warn("Failed to restart recognition:", e);
              setIsListening(false);
            }
          }
        };

        return instance;
      } catch (err) {
        console.warn("Speech Recognition initialization failed:", err);
        setError("Speech Recognition initialization failed: " + err.message);
        return null;
      }
    };

    const initRecognition = () => {
      recognitionInstance = initializeRecognition();
      setRecognition(recognitionInstance);
    };

    initRecognition();

    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
          setIsListening(false);
        } catch (e) {
          console.warn("Error stopping recognition:", e);
        }
      }
    };
  }, [isTranslationEnabled]);

  // Clear функцийг шинэчлэх
  const clearAll = () => {
    setAllTranscripts([]);
    setAllTranslations([]);
    setInterimTranscript("");
    setError(null);
    setConfidence(0);
  };

  // Орчуулах функц нэмэх
  const handleTranslate = async () => {
    // Үлдсэн орчуулаагүй текстүүдийг олох
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

      // 3 секундын дараа автоматаар алга болох
      setTimeout(() => {
        successMessage.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 500);
      }, 3000);
    } else {
      // Буруу код оруулсан үед улаан өнгөтэй alert
      const errorMessage = document.createElement("div");
      errorMessage.className =
        "fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg transition-opacity duration-500 flex items-center";
      errorMessage.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <span class="font-medium">Буруу код! Дахин оролдоно уу.</span>
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

  // Toast үзүүлэх функц
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
    showToast("Орчуулгын горимоос гарлаа", "success");
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* English Speech Recognition Card */}
        <Card className="overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Speech to Text
              </h2>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  onClick={toggleListening}
                  className={`flex-1 sm:flex-none ${
                    isListening
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                  } text-white hover:opacity-90 transition-opacity`}
                  disabled={!recognition}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  ) : (
                    <Mic className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  )}
                  {isListening ? "Stop" : "Start"}
                </Button>
                {allTranscripts.length > 0 && (
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    className="flex-1 sm:flex-none border-2 hover:bg-gray-50"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="min-h-[300px] p-4 bg-gray-50 rounded-lg overflow-y-auto shadow-inner">
              {allTranscripts.map((text, index) => (
                <div
                  key={index}
                  className="mb-3 text-base md:text-lg leading-relaxed text-black font-medium"
                >
                  {text}
                </div>
              ))}
              {interimTranscript && (
                <div className="text-base md:text-lg text-gray-600 italic">
                  {interimTranscript}
                </div>
              )}
              {allTranscripts.length === 0 && !interimTranscript && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Mic className="w-8 h-8 mb-2 opacity-50" />
                  <p>Start speaking...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mongolian Translation Card */}
        <Card className="overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Монгол орчуулга
              </h2>
              <div className="flex items-center gap-4">
                {!isTranslationEnabled ? (
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition-opacity"
                  >
                    Орчуулах
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-green-500">
                      Орчуулга идэвхтэй
                    </div>
                    <Button
                      onClick={handleDisableTranslation}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1"
                      size="sm"
                    >
                      Гарах
                    </Button>
                  </div>
                )}
                {interimTranscript && (
                  <div className="text-sm text-gray-500 animate-pulse">
                    Бэлэн болсон...
                  </div>
                )}
              </div>
            </div>

            {translationError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {translationError}
              </div>
            )}

            <div className="min-h-[300px] p-4 bg-gray-50 rounded-lg overflow-y-auto shadow-inner">
              {allTranslations.map((text, index) => (
                <div
                  key={index}
                  className="mb-3 text-base md:text-lg leading-relaxed text-black font-medium"
                >
                  {text}
                </div>
              ))}
              {allTranslations.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg
                    className="w-8 h-8 mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  <p>Орчуулга энд харагдана...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <TranslationCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default SpeechToText;
