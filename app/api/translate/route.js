import { NextResponse } from "next/server";

export const config = {
  runtime: "edge",
  regions: ["iad1"], // Optionally specify regions
};

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  try {
    const body = await request.text();
    if (!body) {
      return new Response(JSON.stringify({ error: "Empty request body" }), {
        status: 400,
        headers,
      });
    }

    let data;
    try {
      data = JSON.parse(body);
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON format",
          details: parseError.message,
        }),
        { status: 400, headers }
      );
    }

    const { text } = data;
    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers,
      });
    }

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|mn`
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const translationData = await response.json();

    if (translationData.responseStatus !== 200) {
      throw new Error(translationData.responseDetails || "Translation failed");
    }

    const translation = translationData.responseData.translatedText;

    return new Response(JSON.stringify({ translation }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Request processing error:", error);
    return new Response(
      JSON.stringify({
        error: "Орчуулгын алдаа гарлаа",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}
