"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import mammoth from "mammoth";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "./auth/AuthProvider";

const FileUploader = ({ onTextExtracted }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      let text = "";

      // Файлыг текст болгох
      if (file.name.toLowerCase().endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.name.toLowerCase().endsWith(".txt")) {
        text = await file.text();
      } else {
        throw new Error("Зөвхөн .docx болон .txt файл оруулна уу");
      }

      // Текстийг эхлээд дамжуулах
      onTextExtracted(text);

      // Firestore-д хадгалах
      if (user) {
        await addDoc(collection(db, "documents"), {
          userId: user.uid,
          fileName: file.name,
          content: text,
          createdAt: new Date().toISOString(),
          wordCount: text.split(/\s+/).length,
        });
      }
    } catch (err) {
      setError(err.message);
      console.error("File processing error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Файлаас текст оруулах</h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={loading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {loading ? "Уншиж байна..." : "Файл сонгох"}
            </label>
            <span className="text-sm text-gray-500">
              .docx, .txt файл оруулна уу
            </span>
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
