// Notes.tsx

import { useState } from "react";
import Input from "@/components/ui/input";
import Tesseract from "tesseract.js";
import { useMutation } from "@tanstack/react-query";
import { OpenAI } from "openai";
import "katex/dist/katex.min.css";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Notes() {
  const [generatedNotes, setGeneratedNotes] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);  // Nowy stan, który śledzi proces

  const extractTextMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsProcessing(true); // Rozpoczynamy proces
      const { data: { text } } = await Tesseract.recognize(file, "pol");
      return text;
    },
    onSuccess: (data) => {
      // Po wyodrębnieniu tekstu, automatycznie uruchamiamy generowanie notatek
      generateNotesMutation.mutate(data);
    },
    onError: (error) => {
      setIsProcessing(false); // Kończymy proces
      setGeneratedNotes("Błąd wyodrębniania tekstu! Spróbuj ponownie.");
      console.error("Błąd OCR:", error);
    },
  });

  const generateNotesMutation = useMutation({
    mutationFn: async (text: string) => {
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4", // Wybierz odpowiedni model do generowania notatek
        messages: [
          {
            role: "system",
            content:
              "Stwórz jasne, zrozumiałe i dobrze zorganizowane notatki na podstawie tekstu OCR. Użyj zwykłych znaków Unicode do zapisu matematyki (np. ², √, ±, ÷), nie używaj LaTeX-a ani Markdowna. Zachowaj strukturę przedmiotu i formatuj tekst, używając nagłówków, punktów i list.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      });
      return chatCompletion.choices[0].message.content;
    },
    onSuccess: (data) => {
      setGeneratedNotes(data || "");
      setIsProcessing(false);  // Kończymy proces
    },
    onError: (error) => {
      setGeneratedNotes("Błąd generowania notatek! Spróbuj ponownie.");
      setIsProcessing(false);  // Kończymy proces
      console.error("Błąd OpenAI:", error);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      extractTextMutation.mutate(selectedFile); // Rozpoczynamy proces OCR
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Widok tylko dla użytkownika po przesłaniu pliku */}
      {!generatedNotes && !isProcessing && (
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full max-w-md"
        />
      )}

      {/* Pokazanie komunikatu o postępie */}
      {isProcessing && (
        <p className="text-muted-foreground">Przetwarzanie obrazu, proszę czekać...</p>
      )}

      {/* Pokazanie wygenerowanych notatek */}
      {generatedNotes && !isProcessing && (
        <div className="w-full max-w-lg flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Wygenerowane notatki:</h3>
          <pre
            className="rounded-md bg-muted p-4 font-mono text-sm whitespace-pre-wrap"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {generatedNotes}
          </pre>
        </div>
      )}
    </div>
  );
}
