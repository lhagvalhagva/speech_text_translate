import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const MAX_CONTEXT_LENGTH = 40000; // Maximum context length for Gemini

// Файлуудаас контекст цуглуулах функц
async function getContextFromFiles(userId) {
  try {
    console.log("\n=== Getting Context Start ===");
    console.log({
      message: "Getting context for user",
      userId: userId,
      timestamp: new Date().toISOString(),
    });

    // Basic query without orderBy first
    const filesQuery = query(
      collection(db, "files"),
      where("userId", "==", userId)
    );

    console.log("Executing basic query...");
    const querySnapshot = await getDocs(filesQuery);

    // Log each document for debugging
    querySnapshot.forEach((doc) => {
      console.log("Document data:", {
        id: doc.id,
        data: doc.data(),
      });
    });

    console.log({
      message: "Files found",
      totalFiles: querySnapshot.size,
      files: querySnapshot.docs.map((doc) => ({
        id: doc.id,
        fileName: doc.data().fileName,
        hasContent: !!doc.data().content,
        contentPreview: doc.data().content?.substring(0, 50),
      })),
    });

    let context = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.content) {
        context += `${data.content}\n\n`;
      }
    });

    console.log({
      message: "Context built",
      contextLength: context.length,
      contextPreview: context.substring(0, 100),
      hasContent: context.length > 0,
    });

    return context;
  } catch (error) {
    // Log detailed error information
    console.error({
      message: "Firestore error details",
      errorCode: error.code,
      errorMessage: error.message,
      errorName: error.name,
      stack: error.stack,
      userId: userId,
    });

    // Try alternative query if permission error
    if (error.code === "permission-denied") {
      console.log("Attempting alternative query...");
      try {
        const altQuery = collection(db, "files");
        const altSnapshot = await getDocs(altQuery);
        console.log("Alternative query results:", {
          totalDocs: altSnapshot.size,
        });
      } catch (altError) {
        console.error("Alternative query failed:", altError);
      }
    }

    return "";
  }
}

// AI хариулт авах функц
export async function getPalmResponse(question, userId) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const context = await getContextFromFiles(userId);

    console.log({
      message: "Building prompt",
      hasContext: !!context,
      contextLength: context?.length || 0,
    });

    // Simplified prompt
    const prompt = `
    Answer the questions by pretending that you are going to an interview for the work and travel program. Your role is to provide helpful, accurate responses to any questions, even if they are not directly covered in the provided context.

    Context information (if available):
    ${context}

    Question: "${question}"

    Rules:
    1. If the question relates to information in the context above, use that information in your response
    2. If the question is not covered by the context, still provide a helpful response based on your general knowledge
    3. Keep answers concise and clear using simple words and sentences
    4. Never say "I cannot find the answer" or "the information is not in the context"
    5. Always provide a helpful response based on your general knowledge when context is not available
    6. If you're not completely certain about something, acknowledge that while still providing your best guidance
    7. Respond in the same language as the user's question
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    console.log({
      message: "AI response generated",
      response: response.text(),
    });

    return response.text();
  } catch (error) {
    console.error("Error in getPalmResponse:", error);
    throw error;
  }
}
