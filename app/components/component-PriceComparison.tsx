'use client'

import { Price } from '@/lib/types'

interface PriceComparisonProps {
  prices: Price[]
}

export default function PriceComparison({ prices }: PriceComparisonProps) {
  if (!prices || prices.length === 0) {
    return <p className="text-center text-gray-500">No results found</p>
  }

  const sortedPrices = [...prices].sort(
    (a, b) => (a.price + a.shipping_cost) - (b.price + b.shipping_cost)
  )

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">Retailer</th>
            <th className="border p-3 text-right">Price</th>
            <th className="border p-3 text-right">Shipping</th>
            <th className="border p-3 text-right">Total</th>
            <th className="border p-3 text-center">Delivery</th>
            <th className="border p-3 text-center">Stock</th>
            <th className="border p-3">Link</th>
          </tr>
        </thead>
        <tbody>
          {sortedPrices.map((price, idx) => (
            <tr key={idx} className={idx === 0 ? 'bg-green-50' : ''}>
              <td className="border p-3 font-semibold">{price.retailer}</td>
              <td className="border p-3 text-right">{price.price} {price.currency}</td>
              <td className="border p-3 text-right">{price.shipping_cost}</td>
              <td className="border p-3 text-right font-bold">
                {(price.price + price.shipping_cost).toFixed(2)} {price.currency}
              </td>
              <td className="border p-3 text-center">{price.delivery_days} days</td>
              <td className="border p-3 text-center">
                <span className={price.stock_status === 'In Stock' ? 'text-green-600' : 'text-red-600'}>
                  {price.stock_status}
                </span>
              </td>
              <td className="border p-3">
                <a
                  href={price.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
