const MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";

export async function translateText(text) {
  try {
    if (!text?.trim()) {
      return "";
    }

    const response = await fetch(
      `${MYMEMORY_API_URL}?q=${encodeURIComponent(text)}&langpair=en|mn`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails || "Translation failed");
    }

    return data.responseData.translatedText;
  } catch (error) {
    console.warn("Translation error:", error);
    throw new Error("Орчуулга амжилтгүй боллоо. Дахин оролдоно уу.");
  }
}
