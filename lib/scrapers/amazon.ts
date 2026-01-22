import * as cheerio from 'cheerio'
import axios from 'axios'
import { Price } from '@/lib/types'

export async function scrapeAmazon(productName: string): Promise<Price[]> {
  try {
    const searchUrl = `https://amazon.ae/s?k=${encodeURIComponent(productName)}`

    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(data)
    const results: Price[] = []

    $('[data-component-type="s-search-result"]').slice(0, 5).each((_, el) => {
      try {
        const title = $(el).find('h2 a span').first().text()
        const priceText = $(el).find('.a-price-whole').first().text()
        const url = $(el).find('h2 a').attr('href')

        const price = parseFloat(priceText.replace(/[^\d.]/g, ''))

        if (title && price) {
          results.push({
            product_id: '',
            retailer: 'Amazon.ae',
            price: price,
            currency: 'AED',
            shipping_cost: 0,
            delivery_days: 2,
            stock_status: 'In Stock',
            url: `https://amazon.ae${url}` || ''
          })
        }
      } catch (e) {
        console.error('Error parsing Amazon result:', e)
      }
    })

    return results
  } catch (error) {
    console.error('Amazon scrape failed:', error)
    return []
  }
}
