import { promises as fs } from "fs";
import path from "path";

export async function POST(request) {
  try {
    const { answers } = await request.json();

    // Answers файл үүсгэх эсвэл шинэчлэх
    const answersPath = path.join(process.cwd(), "app/data/answers.json");
    await fs.writeFile(answersPath, JSON.stringify(answers, null, 2));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating answers:", error);
    return new Response(JSON.stringify({ error: "Failed to update answers" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
