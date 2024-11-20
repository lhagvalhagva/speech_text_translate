"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Mic, MicOff } from "lucide-react";

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
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
          setError("Your browser doesn't support Speech Recognition API.");
          return null;
        }

        const instance = new SpeechRecognition();

        instance.continuous = true;
        instance.interimResults = true;
        instance.maxAlternatives = 3;
        instance.lang = "en-US";

        instance.audioStart = () => {
          console.log("Audio capturing started");
        };

        instance.soundstart = () => {
          console.log("Sound detected");
        };

        instance.speechstart = () => {
          console.log("Speech detected");
          setError(null);
        };

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

                // Шинэ мөр эхлэх эсэхийг шалгах
                if (timeSinceLastSpeech > PAUSE_THRESHOLD) {
                  setAllTranscripts((prev) => [...prev, cleanText]);

                  // Орчуулга хийх
                  const translatedText = await translateText(cleanText);
                  if (translatedText) {
                    setAllTranslations((prev) => [...prev, translatedText]);
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
                setError("Ямар нэгэн дуу сонсогдсонгүй");
                break;
              case "audio-capture":
                setError("Микрофон олдсонгүй. Микрофоноо шалгана уу.");
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

    if (typeof window !== "undefined" && !recognition) {
      recognitionInstance = initializeRecognition();
      setRecognition(recognitionInstance);
    }

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
  }, [retryCount, isListening, reconnectTimer, isReconnecting]);

  // Clear функцийг шинэчлэх
  const clearAll = () => {
    setAllTranscripts([]);
    setAllTranslations([]);
    setInterimTranscript("");
    setError(null);
    setConfidence(0);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* English Speech Recognition */}
        <Card className="mb-4">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h2 className="text-xl md:text-2xl font-bold">Speech to Text</h2>
              <div className="flex gap-2">
                <Button
                  onClick={toggleListening}
                  className={`${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-sm md:text-base`}
                  disabled={!recognition}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  ) : (
                    <Mic className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  )}
                  {isListening ? "Stop" : "Start"}
                </Button>
                {allTranscripts.length > 0 && (
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    className="bg-gray-100 hover:bg-gray-200 text-sm md:text-base"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="min-h-[200px] md:min-h-[300px] p-3 md:p-4 bg-gray-100 rounded-lg overflow-y-auto">
              {/* Бүх текстүүд */}
              {allTranscripts.map((text, index) => (
                <div key={index} className="mb-2 text-sm md:text-base">
                  {text}
                </div>
              ))}
              {/* Түр зуурын текст */}
              {interimTranscript && (
                <div className="text-gray-500 italic text-sm md:text-base">
                  {interimTranscript}
                </div>
              )}
              {allTranscripts.length === 0 && !interimTranscript && (
                <div className="text-gray-500 text-sm md:text-base">
                  Start speaking...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mongolian Translation */}
        <Card className="mb-4">
          <CardContent className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold">Монгол орчуулга</h2>
              {interimTranscript && (
                <div className="text-sm text-gray-500">Орчуулж байна...</div>
              )}
            </div>
            <div className="min-h-[200px] md:min-h-[300px] p-3 md:p-4 bg-gray-100 rounded-lg overflow-y-auto whitespace-pre-line">
              {allTranslations.map((text, index) => (
                <div key={index} className="mb-2 text-sm md:text-base">
                  {text}
                </div>
              ))}
              {allTranslations.length === 0 && (
                <div className="text-gray-500 text-sm md:text-base">
                  Орчуулга энд харагдана...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeechToText;
