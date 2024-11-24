import { getPalmResponse } from "../../lib/palm-ai";

export async function POST(request) {
  try {
    const { text, userId } = await request.json();

    if (!text || !userId) {
      return new Response(
        JSON.stringify({
          error: "Text and userId are required",
        }),
        { status: 400 }
      );
    }

    try {
      const response = await getPalmResponse(text, userId);

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
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return new Response(
      JSON.stringify({
        error: "Хүсэлт боловсруулахад алдаа гарлаа",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
