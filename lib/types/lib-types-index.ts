export interface Product {
  id?: string
  name: string
  category: string
  specs?: Record<string, unknown>
}

export interface Price {
  id?: string
  product_id: string
  retailer: string
  price: number
  currency: string
  shipping_cost: number
  delivery_days: number
  stock_status: string
  url: string
}

export interface Recommendation {
  bestPrice?: { retailer: string; reason: string }
  bestValue?: { retailer: string; reason: string }
  bestSustainable?: { retailer: string; reason: string }
}
