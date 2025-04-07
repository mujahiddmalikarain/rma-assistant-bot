# 🤖 RMA Policy Bot

A smart Slack bot that responds only when mentioned, intelligently distinguishes between hardware and software issues, and shares your RMA policy link when asked about coverage. Built using Node.js, Slack Bolt, and OpenRouter AI.

---

## 🚀 Features

- 🧠 AI-powered hardware vs software detection (via Mistral/OpenRouter)
- 🔕 Quiet in busy channels unless @mentioned
- 📄 Replies with policy link if someone asks about policy coverage
- 📎 Optional: Upload RMA policy PDF
- 💬 Threaded replies for clean conversations
- 🌐 Easy to customize handle or Slack user ID

---

## 📂 Project Structure


---

## ⚙️ Requirements

- Node.js v16+
- Slack App (Bot Token + Signing Secret)
- OpenRouter API key (or replace with your preferred AI provider)

---

## 🔐 Environment Setup

Copy the sample env and fill in your values:

```bash
cp .env.example .env
