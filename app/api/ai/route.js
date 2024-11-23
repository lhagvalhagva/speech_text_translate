import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
      });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create prompt
    const prompt = `You are an interview assistant. When asked "${text}", please provide a professional and concise answer based on common interview best practices. Keep the response natural and conversational.`;

    try {
      // Generate response
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const textResponse = response.text();

      return new Response(JSON.stringify({ response: textResponse }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (genError) {
      console.error("Gemini API error:", genError);
      return new Response(
        JSON.stringify({
          error: "AI боловсруулалтад алдаа гарлаа",
          details: genError.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
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
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
