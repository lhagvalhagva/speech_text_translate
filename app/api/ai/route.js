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
  regions: ["iad1"], // Optionally specify regions
};

export async function POST(request) {
  // CORS headers нэмэх
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  try {
    const body = await request.text();
    if (!body) {
      return new Response(
        JSON.stringify({
          error: "Empty request body",
        }),
        {
          status: 400,
          headers,
        }
      );
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
        {
          status: 400,
          headers,
        }
      );
    }

    const { text, userId } = data;

    if (!text || !userId) {
      return new Response(
        JSON.stringify({
          error: "Text and userId are required",
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    try {
      const response = await getPalmResponse(text, userId);

      if (!response) {
        throw new Error("Empty response from AI");
      }

      return new Response(JSON.stringify({ response }), {
        status: 200,
        headers,
      });
    } catch (genError) {
      console.error("AI processing error:", genError);
      return new Response(
        JSON.stringify({
          error: "AI боловсруулалтад алдаа гарлаа",
          details: genError.message,
        }),
        {
          status: 500,
          headers,
        }
      );
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return new Response(
      JSON.stringify({
        error: "Хүсэлт боловсруулахад алдаа гарлаа",
        details: error.message,
      }),
      {
        status: 500,
        headers,
      }
    );
  }
}
