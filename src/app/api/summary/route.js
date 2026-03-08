import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  // TODO 1: Get logs from request body using request.json()
  const { logs } = await request.json();

  // TODO 2: If no logs, return error response using NextResponse.json()
  if (!logs || logs.length === 0) {
    return NextResponse.json({ error: "No Log Found" }, { status: 400 });
  }

  // TODO 3: Convert logs array into readable text format for AI
  const readable = logs
    .map(
      (value, index) => `Day ${index + 1}:
    - Did: ${value.did}
    - Blockers: ${value.blockers || "none"}
    - Plan: ${value.plan || "none"}    
    `,
    )
    .join("\n\n");

  // TODO 4: Send logs to OpenAI using openai.chat.completions.create()
  // - model: "gpt-3.5-turbo"
  // - messages: system prompt + user logs
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that summarizes a developer's weekly standup logs in a clear, concise and motivating way.",
      },
      {
        role: "user",
        content: `Here are my logs:\n\n${readable}\n\nGive me a short weekly summary.`,
      },
    ],
  });

  const summary = completion.choices[0].message.content;
  return NextResponse.json({ summary });
}
