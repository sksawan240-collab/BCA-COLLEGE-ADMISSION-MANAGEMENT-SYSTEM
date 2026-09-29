import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content } from '@google/generative-ai';

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Define the type for the chat history
interface HistoryItem {
  role: "user" | "model";
  parts: { text: string }[];
}

export const handleChat = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { message, history } = req.body as { message: string; history: HistoryItem[] };

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessageStream(message);

    res.setHeader('Content-Type', 'text/plain');
    res.flushHeaders(); // Flush headers to start streaming

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }

    res.end();
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ message: error.message });
  }
};