'use client'

import { useState } from 'react'
import SearchBar from '@/app/components/SearchBar'
import PriceComparison from '@/app/components/PriceComparison'
import RecommendationCard from '@/app/components/RecommendationCard'
import { Price, Recommendation } from '@/lib/types'

export default function Dashboard() {
  const [prices, setPrices] = useState<Price[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation>({})
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = async (query: string) => {
    setIsLoading(true)
    setSearchQuery(query)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      const data = await response.json()

      if (data.prices) {
        setPrices(data.prices)
      }

      if (data.recommendations) {
        setRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error('Search failed:', error)
      alert('Search failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Smart Value Recommender</h1>
          <p className="text-gray-600 text-lg">AI-powered price comparison & smart shopping</p>
        </div>

        <div className="flex justify-center mb-12">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {searchQuery && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Results for: {searchQuery}</h2>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Searching and analyzing products...</p>
              </div>
            ) : prices.length > 0 ? (
              <>
                <PriceComparison prices={prices} />
                <RecommendationCard recommendations={recommendations} />
              </>
            ) : (
              <p className="text-center text-gray-500 py-12">No products found. Try a different search.</p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
