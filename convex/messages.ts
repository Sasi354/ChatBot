import { mutation, query } from "./_generated/server";

export const sendMessage = mutation(async ({ db }, message: { text: string; sender: "user" | "bot" }) => {
  await db.insert("messages", { ...message, createdAt: Date.now() });
});

export const getMessages = query(async ({ db }) => {
  db.query("messages").order("asc").collect();
});
