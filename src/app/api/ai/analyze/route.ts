import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { matchData } = await req.json()
    
    // Support either GROQ_API_KEY (Recommended Free) or DEEPSEEK_API_KEY
    const apiKey = process.env.GROQ_API_KEY || process.env.DEEPSEEK_API_KEY
    const apiBase = process.env.GROQ_API_KEY ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.deepseek.com/chat/completions'
    const model = process.env.GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'deepseek-chat'

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY or DEEPSEEK_API_KEY not configured in environment.' },
        { status: 500 }
      )
    }

    const response = await fetch(apiBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an elite football tactical analyst. provide a professional, deep-dive tactical report based on the match data provided. focus on strategic efficiency, personnel performance, and CRITICALLY, provide actionable tactical adjustments for the next match. keep the tone technical and broadcast-ready.'
          },
          {
            role: 'user',
            content: `Analyze this match performance: ${JSON.stringify(matchData)}. 
            Provide the analysis in the following JSON format:
            {
              "summary": "Full tactical summary",
              "efficiency": ["Performance point 1", "Point 2"],
              "vulnerability": ["Weakness 1", "Weakness 2"],
              "next_match_adjustments": ["Actionable advice 1", "Advice 2"],
              "metrics": {
                "intensity": "0-10",
                "success_rate": "percentage",
                "sync_link": "ID-CODE"
              }
            }`
          }
        ],
        response_format: { type: 'json_object' }
      })
    })

    const data = await response.json()
    
    if (data.error) {
       // Graceful handling of balance/quota issues
       const errorMsg = data.error.message || 'AI API Error'
       if (errorMsg.includes('Insufficient Balance')) {
          throw new Error('AI_QUOTA_EXHAUSTED: Please check your API balance or switch to Groq (Free Tier).')
       }
       throw new Error(errorMsg)
    }

    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('Invalid response from AI Provider')
    }

    const analysis = JSON.parse(content)

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('Tactical Analysis Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
