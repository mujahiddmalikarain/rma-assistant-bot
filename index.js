

const { App } = require("@slack/bolt");
const fetch = require("node-fetch");
require("dotenv").config();

// Initialize Slack App
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const MUJAHID_SLACK_ID = "U08M51N21FD"; // Update this with your ID

// Function to call OpenRouter (Mistral model)
async function callMiniModel(prompt) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free", // Adjust if needed
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("API Response:", response.status, await response.text());
      throw new Error("API request failed");
    }

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      console.error("⚠️ No valid response from OpenRouter:", data);
      return "Sorry, I didn’t receive a proper response from the AI. If all steps don’t work, please contact Mujahid.";
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("❌ OpenRouter Error:", error.message);
    return "I’m facing network issues contacting the AI. If all steps don’t work, please contact Mujahid.";
  }
}

// Handle messages in Slack
app.event("message", async ({ event, say }) => {
  try {
    if (event.subtype === "bot_message" || !event.text) return;
    console.log('sddsd')
    // Check if the message mentions Mujahid (using Slack ID or plain text handle)
    const mentionsMujahid = event.text.includes(`<@${MUJAHID_SLACK_ID}>`) || event.text.includes("@Mujahidramzan");
    console.log(mentionsMujahid);
    if (!mentionsMujahid) {
      console.log('sddsd')
      return; // Ignore messages without Mujahid’s mention
    }

    // Prompt for analyzing hardware/software when mentioned
    const prompt = `
      You are the AI assistant of Mujahid, an RMA support specialist. 
      Someone mentioned Mujahid in this query: "${event.text}". 
      Analyze the query and determine if it describes a hardware problem or a software problem. 
      - If it’s a hardware problem, respond only with: "This seems to be a hardware issue. Please contact Mujahid for final approval for RMA."
      - If it’s a software problem, provide a solution to fix it.
    `;
    const reply = await callMiniModel(prompt);

    await say({ text: reply, thread_ts: event.ts });
  } catch (err) {
    console.error("❌ Slack handler error:", err.message);
    await say({ text: "Something went wrong processing your message. If all steps don’t work, please contact Mujahid." });
  }
});

// Start app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡ RMA Bot is running using FREE Mistral model!");
})();