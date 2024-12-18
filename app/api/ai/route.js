import { getPalmResponse } from "../../lib/palm-ai";

// OPTIONS method нэмж өгөх
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

export const config = {
  runtime: "edge",
  regions: ["iad1"],
};

export async function POST(request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  const API_KEY =
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

  if (!API_KEY) {
    return new Response(
      JSON.stringify({
        error: "AI service is not configured",
        details: "Please contact the administrator",
      }),
      { status: 503, headers }
    );
  }

  try {
    const body = await request.text();

    if (!body) {
      console.error("Empty request body received");
      return new Response(JSON.stringify({ error: "Empty request body" }), {
        status: 400,
        headers,
      });
    }

    let data;
    try {
      data = JSON.parse(body);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid JSON format",
          details: parseError.message,
        }),
        { status: 400, headers }
      );
    }

    const { text, userId } = data;

    if (!text || !userId) {
      console.error("Missing required fields:", { text, userId });
      return new Response(
        JSON.stringify({
          error: "Text and userId are required",
          received: { hasText: !!text, hasUserId: !!userId },
        }),
        { status: 400, headers }
      );
    }

    const response = await getPalmResponse(text, userId);

    return new Response(JSON.stringify({ response }), { status: 200, headers });
  } catch (error) {
    console.error("API error:", {
      message: error.message,
      stack: error.stack,
    });

    return new Response(
      JSON.stringify({
        error: error.message || "AI боловсруулалтад алдаа гарлаа",
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers }
    );
  }
}
