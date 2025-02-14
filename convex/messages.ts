// import { mutation, query } from "./_generated/server";

// export const sendMessage = mutation(async ({ db }, message: { text: string; sender: "user" | "bot" }) => {
//   await db.insert("messages", { ...message, createdAt: Date.now() });
// });

// // export const getMessages = query(async ({ db }) => {
// //  const results = db.query("messages").order("asc").collect();
// // });

// export const getMessages = query({
//   args: {},
//   handler: async (ctx, args) => {
//     const message = await ctx.db
//       .query("messages")
//       .order("desc")
//       .collect();
//     return message;
//   },
// });

import { mutation, query } from "./_generated/server";

export const sendMessage = mutation(async ({ db }, message: { text: string; sender: "user" | "bot" }) => {
  await db.insert("messages", { ...message, createdAt: Date.now() });
});

// Fetch messages in descending order (latest first)
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

// Delete all messages
export const deleteMessages = mutation(async ({ db }) => {
  const messages = await db.query("messages").collect();
  for (const msg of messages) {
    await db.delete(msg._id);
  }
});
