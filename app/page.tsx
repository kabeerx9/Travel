import { TravelForm } from '@/components/travel-form'
import { Plane } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-6">
          <div className="inline-block floating">
            <div className="bg-white rounded-full p-4 genz-border">
              <Plane className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-6xl font-black">
            Travel
            <span className="gradient-text">Mate</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            ✨ Your AI bestie for the perfect vacay ✈️
          </p>
        </div>
        <TravelForm />
      </div>
    </main>
  )
}