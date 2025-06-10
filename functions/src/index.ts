import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import * as functions from "firebase-functions";

dotenv.config();

const gemi = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();

app.use(cors({ origin: true }));
// app.options("*", cors());
app.use(express.json());

// Default route
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from Firebase Functions + Express + TypeScript!");
});

// Example dynamic route
app.get("/hello/:name", (req: Request, res: Response) => {
  const name = req.params.name;
  res.send(`Hello, ${name}!`);
});

app.get("/ask-gemi", async (req: Request, res: Response) => {
  const question = req.query.question || "What is Road to Legacy 2.0?";

  const systemPrompt = "";

  const response = await gemi.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Here is some important context:\n\n${systemPrompt}\n\nNow, answer the following question: (if the question is not in the context try to match to the context as a chat assistant bot related to this context or if can not match however give a normal reply: EX:hello? reply: How are you How can i assist you with RTL <- this is how it shoud be , and remember act as a chatbot assistant and do not say "The provided document does not contain.., I am sorry, the provided document does not include ..." like things you can simple say sorry i can not assist that for you like thing) \n${question}`,
          },
        ],
      },
    ],
  });

  try {
    const answer = response.text || "No response generated.";
    res.status(200).json({ answer });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Error generating response",
      details: (error as Error).message,
    });
  }
});

// Export the Express app as a Firebase HTTPS Function
export const api = functions.https.onRequest(app);
