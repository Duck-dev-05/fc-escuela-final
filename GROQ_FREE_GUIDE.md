# Groq Free-Tier AI Configuration Guide

If your DeepSeek balance is exhausted, follow these steps to activate your **Permanently Free (Beta)** tactical intelligence using Groq and Llama 3.

### 1. Account Creation
- Visit the [Groq Console](https://console.groq.com/).
- Sign in with your account.
- Groq's free tier is exceptionally fast and currently free for developers.

### 2. API Key Acquisition
- Navigate to the **API Keys** section.
- Click **Create API Key**.
- Copy the generated key.

### 3. Environment Activation
- Open your `.env` file in the project root: `d:\Code\Football\fc-escuela-final\.env`.
- Locate the `GROQ_API_KEY` variable.
- Replace `your_groq_api_key_here` with your copied key.
- **Note**: If `GROQ_API_KEY` is present, the system will prioritize it over DeepSeek.

### 4. Verification
- Restart your development server: `npm run dev`.
- Navigate to `/coaching/analysis`.
- Click **GENERATE_REAL_ANALYSIS**.
- The HUD will now utilize Llama 3 for world-class tactical insights at lightning speed.

> [!TIP]
> Groq is the fastest inference engine on the planet. Your tactical reports will now generate in under 500ms.
