# DeepSeek AI Configuration Guide

Follow these steps to activate your **Free-Tier DeepSeek V3** tactical intelligence.

### 1. Account Creation
- Visit the [DeepSeek Platform](https://platform.deepseek.com/).
- Sign up for a free account.
- DeepSeek typically provides free trial tokens or a generous free tier for new users.

### 2. API Key Acquisition
- Navigate to the **API Keys** section.
- Click **Create API Key**.
- Copy the generated key.

### 3. Environment Activation
- Open your `.env` file in the project root: `d:\Code\Football\fc-escuela-final\.env`.
- Locate the `DEEPSEEK_API_KEY` variable.
- Replace `your_deepseek_api_key_here` with your copied key.

### 4. Verification
- Restart your development server: `npm run dev`.
- Navigate to `/coaching/analysis`.
- Click **GENERATE_REAL_ANALYSIS**.
- The HUD should display **MODEL: DEEPSEEK_V3** and return live tactical insights.

> [!NOTE]
> DeepSeek's API is highly efficient and OpenAI-compatible, providing world-class reasoning for complex tactical queries at a fraction of the cost.
