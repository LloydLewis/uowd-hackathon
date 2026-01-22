import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY!
)

export const generateRecommendations = async (productData: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a smart shopping assistant. Analyze these product prices and provide clear recommendations.

Product Data:
${productData}

Return ONLY a JSON object (no markdown, no extra text) with exactly this structure:
{
  "bestPrice": {
    "retailer": "name of retailer with lowest total cost",
    "reason": "brief 1-sentence explanation why"
  },
  "bestValue": {
    "retailer": "name of retailer with best price-to-quality ratio",
    "reason": "brief 1-sentence explanation why"
  },
  "bestSustainable": {
    "retailer": "name of local/most sustainable option",
    "reason": "brief 1-sentence explanation why"
  }
}

Be concise. If data is missing, infer reasonably.`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    try {
      return JSON.parse(text)
    } catch (e) {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw e
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    return {
      bestPrice: { retailer: 'Unable to determine', reason: 'Analysis failed' },
      bestValue: { retailer: 'Unable to determine', reason: 'Analysis failed' },
      bestSustainable: { retailer: 'Unable to determine', reason: 'Analysis failed' }
    }
  }
}

export const analyzeSustainability = async (productName: string, retailer: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `For "${productName}" from ${retailer}, estimate the carbon footprint impact:
- Shipping distance to UAE
- Packaging type
- Product durability

Return JSON:
{
  "carbon_kg": number (estimated kg CO2),
  "durability_rating": number (1-10),
  "local_shipping": boolean
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    try {
      return JSON.parse(text)
    } catch (e) {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw e
    }
  } catch (error) {
    console.error('Sustainability analysis error:', error)
    return {
      carbon_kg: 5,
      durability_rating: 7,
      local_shipping: false
    }
  }
}
