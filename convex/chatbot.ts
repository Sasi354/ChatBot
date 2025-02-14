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


// "use node";
// import { action } from "./_generated/server";
// import { v } from "convex/values";
// import OpenAI from "openai";
// import { AnthropicVertex } from "@anthropic-ai/vertex-sdk";

// // Access the environment variables
// const convexDeployment = process.env.CONVEX_DEPLOYMENT;
// const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
// const setupScriptRan = process.env.SETUP_SCRIPT_RAN === '1'; // Assuming '1' indicates true

// // Google Cloud configuration (for Anthropic Vertex)
// const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID!;
// const region = process.env.GOOGLE_CLOUD_REGION!;

// // Initialize Anthropic Vertex client
// const anthropic = new AnthropicVertex({
//   projectId,
//   region,
// });

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// export const generateChatbotResponse = action({
//   args: {
//     message: v.string(),
//   },
//   handler: async (_, args) => {
//     try {
//       if (!args.message.trim()) {
//         console.error({ error: "Message content is missing." });
//         return { error: "Message content is missing." };
//       }

//       console.log("User message received:", args.message);
//       console.log(`Using Convex Deployment: ${convexDeployment}`);
//       console.log(`Convex URL: ${convexUrl}`);
//       console.log(`Setup Script Ran: ${setupScriptRan}`);

//       // Try Claude-3 Haiku first
//       try {
//         const anthropicResponse = await anthropic.messages.create({
//           model: "claude-3-haiku@20240307",
//           max_tokens: 100,
//           messages: [{ role: "user", content: args.message }],
//         });

//         if (anthropicResponse?.content) {
//           console.log("Claude-3 Response:", anthropicResponse.content);
//           return anthropicResponse.content;
//         }
//       } catch (error) {
//         console.error("Anthropic API error, falling back to OpenAI:", error);
//       }

//       // Fallback to OpenAI GPT-4o Mini
//       const openaiResponse = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: "You are a helpful assistant." },
//           { role: "user", content: args.message },
//         ],
//       });

//       const reply = openaiResponse.choices[0]?.message?.content;

//       if (!reply) {
//         console.error({ error: "Failed to generate a valid response." });
//         return { error: "Failed to generate a valid response." };
//       }

//       console.log("OpenAI Response:", reply);
//       return reply;
//     } catch (error) {
//       console.error("Error generating response:", error);
//       return { error: "An unexpected error occurred while generating the response." };
//     }
//   },
// });