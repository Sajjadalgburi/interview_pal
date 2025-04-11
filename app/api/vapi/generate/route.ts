import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { geminiPrompt } from "@/lib/prompts";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
  return Response.json(
    {
      message: "Hello from VAPI API",
    },
    {
      status: 200,
    },
  );
}

export async function POST(req: NextRequest) {
  const { type, role, level, techstack, amount, userid } = await req.json();
  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: geminiPrompt({ type, role, level, techstack, amount }),
    });

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","), // stores an array
      questions: JSON.parse(questions), // parsing the questions string to JSON to be saved into firebase
      coverImage: getRandomInterviewCover(), // todo : we can let the user pass the cover image as well
      createdAt: new Date().toISOString(), // firebase requires a string
      userId: userid,
    };

    await db.collection("interviews").add(interview);

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong in /api/vapi/generate/route.ts",
      },
      {
        status: 500,
      },
    );
  }
}
