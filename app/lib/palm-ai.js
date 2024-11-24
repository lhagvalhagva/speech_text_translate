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
const MAX_CONTEXT_LENGTH = 30000; // Maximum context length for Gemini

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
   You are an artificial intelligence assistant. Your assistant is Worl and travel. going to an interview.Use the following information to answer the questions.

    ${context}

    Question: "${question}"

    Rules:
    1. If the question is in context, use the context information above.
    2. If such information is not in the context, answer the questions
    3. Keep the answers concise and clear using simple words and sentences
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
