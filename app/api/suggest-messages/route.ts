import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const { postContent = "", userDraft = "" } = JSON.parse(text || "{}");
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You generate concise, friendly reply suggestions for an anonymous conversation app. " +
          "Each suggestion must be a complete message. " +
          "Keep tone encouraging, kind, and natural. " +
          "Avoid emojis unless the user uses them first. " +
          "Never repeat the user's post. " +
          "Output exactly 3 suggestions separated by `||` with no numbering or labels.",
      },
      {
        role: "user",
        content:
          `User wrote a post: "${postContent}"\n` +
          `They are currently typing this reply: "${userDraft}"\n` +
          "Make suggestions that are relevant to both.",
      },
    ];

    const response = await client.chat.completions.create({
      model: "x-ai/grok-4.1-fast",
      stream: true,
      messages,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices?.[0]?.delta?.content;
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("Suggestion API Error:", err);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
