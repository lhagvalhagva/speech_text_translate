import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ translation: "" });
    }

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|mn`
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails || "Translation failed");
    }

    const translation = data.responseData.translatedText;

    return NextResponse.json({ translation });
  } catch (error) {
    console.warn("Translation error:", error);
    return NextResponse.json(
      { error: "Орчуулга амжилтгүй боллоо. Дахин оролдоно уу." },
      { status: 500 }
    );
  }
}
