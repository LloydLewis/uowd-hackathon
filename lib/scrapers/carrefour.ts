import * as cheerio from 'cheerio'
import axios from 'axios'
import { Price } from '@/lib/types'

export async function scrapeCarrefour(productName: string): Promise<Price[]> {
  try {
    const searchUrl = `https://www.carrefouruae.com/mafcs/c/search?searchTerm=${encodeURIComponent(productName)}`

    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(data)
    const results: Price[] = []

    $('.product-item').slice(0, 5).each((_, el) => {
      try {
        const title = $(el).find('.product-name').text()
        const priceText = $(el).find('.product-price').text()
        const url = $(el).find('a').attr('href')

        const price = parseFloat(priceText.replace(/[^\d.]/g, ''))

        if (title && price) {
          results.push({
            product_id: '',
            retailer: 'Carrefour.ae',
            price: price,
            currency: 'AED',
            shipping_cost: 5,
            delivery_days: 3,
            stock_status: 'In Stock',
            url: url || ''
          })
        }
      } catch (e) {
        console.error('Error parsing Carrefour result:', e)
      }
    })

    return results
  } catch (error) {
    console.error('Carrefour scrape failed:', error)
    return []
  }
}
