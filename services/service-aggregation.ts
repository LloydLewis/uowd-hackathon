import { scrapeAmazon } from '@/lib/scrapers/amazon'
import { scrapeNoon } from '@/lib/scrapers/noon'
import { scrapeCarrefour } from '@/lib/scrapers/carrefour'
import { Price } from '@/lib/types'

export async function aggregatePrices(productName: string): Promise<Price[]> {
  try {
    const [amazonResults, noonResults, carrefourResults] = await Promise.all([
      scrapeAmazon(productName),
      scrapeNoon(productName),
      scrapeCarrefour(productName)
    ])

    const allResults = [...amazonResults, ...noonResults, ...carrefourResults]

    const uniqueResults = Array.from(
      new Map(allResults.map(item => [item.retailer, item])).values()
    )

    return uniqueResults
  } catch (error) {
    console.error('Data aggregation failed:', error)
    return []
  }
}
