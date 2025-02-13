import { mutation, query } from "./_generated/server";

export const sendMessage = mutation(async ({ db }, message: { text: string; sender: "user" | "bot" }) => {
  await db.insert("messages", { ...message, createdAt: Date.now() });
});

// export const getMessages = query(async ({ db }) => {
//  const results = db.query("messages").order("asc").collect();
// });

export const getMessages = query({
  args: {},
  handler: async (ctx, args) => {
    const message = await ctx.db
      .query("messages")
      .order("desc")
      .collect();
    return message;
  },
});