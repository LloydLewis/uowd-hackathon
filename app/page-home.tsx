'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-6">Smart Value Recommender</h1>
        <p className="text-2xl mb-8 opacity-90">AI-powered price comparison saves you money and the planet</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 text-lg"
        >
          Start Searching
        </button>
      </div>
    </main>
  )
}
