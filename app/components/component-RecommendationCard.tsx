'use client'

import { Recommendation } from '@/lib/types'

interface RecommendationCardProps {
  recommendations: Recommendation
}

export default function RecommendationCard({ recommendations }: RecommendationCardProps) {
  const cards = [
    {
      title: '💰 Best Price',
      data: recommendations.bestPrice,
      color: 'bg-green-50 border-green-200',
      emoji: '💰'
    },
    {
      title: '⭐ Best Value',
      data: recommendations.bestValue,
      color: 'bg-blue-50 border-blue-200',
      emoji: '⭐'
    },
    {
      title: '🌱 Most Sustainable',
      data: recommendations.bestSustainable,
      color: 'bg-emerald-50 border-emerald-200',
      emoji: '🌱'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {cards.map((card, idx) => (
        <div key={idx} className={`p-4 border-2 rounded-lg ${card.color}`}>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span>{card.emoji}</span>
            {card.title}
          </h3>
          {card.data ? (
            <div>
              <p className="text-2xl font-bold text-gray-800">{card.data.retailer}</p>
              <p className="text-sm text-gray-600 mt-3">{card.data.reason}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">Analysis in progress...</p>
          )}
        </div>
      ))}
    </div>
  )
}
