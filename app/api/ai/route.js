import { getPalmResponse } from "../../lib/palm-ai";

export async function POST(request) {
  try {
    // Request body шалгах
    const body = await request.text();
    if (!body) {
      return new Response(
        JSON.stringify({
          error: "Empty request body",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // JSON parse хийх
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
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { text, userId } = data;

    // Required fields шалгах
    if (!text || !userId) {
      return new Response(
        JSON.stringify({
          error: "Text and userId are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    try {
      const response = await getPalmResponse(text, userId);

      // Response шалгах
      if (!response) {
        throw new Error("Empty response from AI");
      }

      return new Response(JSON.stringify({ response }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
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
          headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
