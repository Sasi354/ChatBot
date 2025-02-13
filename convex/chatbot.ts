"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

export const generateChatbotResponse = action({
  args: {
    message: v.string(), // The message that the user sends to the bot
  },
  handler: async (_, args) => {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      if (!args.message) {
        console.error(
          { error: "Message content is missing." },
          { status: 400 },
        );
        return { error: "Message content is missing." };
      }

      console.log("backend", args.message)

      // Prepare the prompt for ChatGPT based on the user's message
      const prompt = ` You are a helpful assistant. User message: ${args.message}`;

      // Call OpenAI API to get a response
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Adjust if you're using a different model
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      });

      // Extract response content
      const reply = response.choices[0]?.message?.content;
      if (!reply) {
        console.error(
          { error: "Failed to generate a valid response." },
          { status: 500 },
        );
        return { error: "Failed to generate a valid response." };
      }
      console.log("backend reply",reply )

      return reply;  // Send back the reply content to the frontend
    } catch (error) {
      console.error("Error generating response:", error);
      if ((error as Error).message.includes("401")) {
        return { error: "Invalid or missing OpenAI API key." };
      }
      return { error: "An error occurred while generating the response." };
    }
  },
});
