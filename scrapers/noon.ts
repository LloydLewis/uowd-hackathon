import cheerio from 'cheerio'
import axios from 'axios'
import { Price } from '@/lib/types'

export async function scrapeNoon(productName: string): Promise<Price[]> {
  try {
    const searchUrl = `https://www.noon.com/uae/en/search?q=${encodeURIComponent(productName)}`

    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(data)
    const results: Price[] = []

    $('.productContainer').slice(0, 5).each((_, el) => {
      try {
        const title = $(el).find('.productTitle').text()
        const priceText = $(el).find('.priceOnCard').text()
        const url = $(el).find('a').attr('href')

        const price = parseFloat(priceText.replace(/[^\d.]/g, ''))

        if (title && price) {
          results.push({
            product_id: '',
            retailer: 'Noon.com',
            price: price,
            currency: 'AED',
            shipping_cost: 0,
            delivery_days: 1,
            stock_status: 'In Stock',
            url: url || ''
          })
        }
      } catch (e) {
        console.error('Error parsing Noon result:', e)
      }
    })

    return results
  } catch (error) {
    console.error('Noon scrape failed:', error)
    return []
  }
}
