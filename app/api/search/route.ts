import { NextRequest, NextResponse } from 'next/server'
import { aggregatePrices } from '@/services/dataAggregation'
import { generateRecommendations } from '@/lib/gemini'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const prices = await aggregatePrices(query)

    if (prices.length === 0) {
      return NextResponse.json({
        prices: [],
        recommendations: {},
        message: 'No products found'
      })
    }

    const productData = prices
      .map(p => `${p.retailer}: ${p.price} AED (shipping: ${p.shipping_cost}, delivery: ${p.delivery_days} days)`)
      .join('\n')

    const recommendations = await generateRecommendations(productData)

    try {
      const { data: product } = await supabase
        .from('products')
        .insert([{ name: query, category: 'general' }])
        .select()
        .single()

      if (product) {
        const pricesWithProductId = prices.map(p => ({
          ...p,
          product_id: product.id
        }))

        await supabase.from('prices').insert(pricesWithProductId)
      }
    } catch (dbError) {
      console.error('Database save failed:', dbError)
    }

    return NextResponse.json({
      prices,
      recommendations,
      count: prices.length
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed', details: String(error) },
      { status: 500 }
    )
  }
}
