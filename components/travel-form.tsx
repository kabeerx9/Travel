"use client"

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { 
  CalendarIcon, Plane, Users, Compass, 
  Wallet, Activity, Heart, Utensils, 
  Home, AlertCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TripPreview } from './trip-preview'
import { generateTripPlan } from '@/lib/ai-service'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  destination: z.string().min(2, "Please enter a destination"),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
  travelers: z.number().min(1).max(10),
  groupType: z.enum(["solo", "couple", "family", "friends"]),
  tripStyle: z.enum(["adventure", "cultural", "relaxed", "foodie", "budget"]),
  budget: z.number().min(1000),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  dietaryPreferences: z.array(z.string()),
  accommodationType: z.enum(["hotel", "hostel", "apartment", "resort", "local"]),
  activityLevel: z.enum(["low", "medium", "high"]),
  specialRequirements: z.string().optional(),
})

const interestOptions = [
  { value: "history", label: "History & Culture", emoji: "🏛️" },
  { value: "nature", label: "Nature & Outdoors", emoji: "🌲" },
  { value: "food", label: "Food & Cuisine", emoji: "🍜" },
  { value: "adventure", label: "Adventure Sports", emoji: "🏃‍♂️" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "nightlife", label: "Nightlife", emoji: "🌙" },
  { value: "art", label: "Art & Museums", emoji: "🎨" },
  { value: "relaxation", label: "Wellness & Spa", emoji: "💆‍♀️" },
]

const dietaryOptions = [
  { value: "vegetarian", label: "Vegetarian", emoji: "🥗" },
  { value: "vegan", label: "Vegan", emoji: "🌱" },
  { value: "halal", label: "Halal", emoji: "🥩" },
  { value: "kosher", label: "Kosher", emoji: "✡️" },
  { value: "glutenFree", label: "Gluten Free", emoji: "🌾" },
  { value: "dairyFree", label: "Dairy Free", emoji: "🥛" },
]

const accommodationEmojis = {
  hotel: "🏨",
  hostel: "🛏️",
  apartment: "🏢",
  resort: "🌴",
  local: "🏠"
}

export function TravelForm() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [tripPlan, setTripPlan] = useState(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      travelers: 1,
      groupType: "solo",
      tripStyle: "cultural",
      budget: 5000,
      interests: [],
      dietaryPreferences: [],
      accommodationType: "hotel",
      activityLevel: "medium",
      specialRequirements: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const plan = await generateTripPlan(values)
      setTripPlan(plan)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: "Failed to generate your trip plan. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (tripPlan) {
    return <TripPreview plan={tripPlan} onSave={async (contactInfo) => {
      // Handle saving the trip plan
      toast({
        title: "Trip plan saved! 🎉",
        description: "We'll send you the details shortly.",
      })
    }} />
  }

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-8">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="genz-card p-6 space-y-8 step-animation">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="emoji-label">
                    <Plane className="w-5 h-5" /> Where's your dream destination?
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Tokyo, Japan" 
                      className="genz-input"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="emoji-label">
                    <CalendarIcon className="w-5 h-5" /> When are you planning to go?
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`genz-input w-full justify-start text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, "MMM d")} -{" "}
                              {format(field.value.to, "MMM d, yyyy")}
                            </>
                          ) : (
                            format(field.value.from, "MMM d, yyyy")
                          )
                        ) : (
                          <span>Select your travel dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                        className="rounded-2xl border-2 border-black/10 p-3"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="travelers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="emoji-label">
                      <Users className="w-5 h-5" /> How many travelers?
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="genz-input"
                        min={1}
                        max={10}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="groupType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="emoji-label">Who's going?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="genz-input">
                          <SelectValue placeholder="Select group type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solo">🙋‍♂️ Solo Adventure</SelectItem>
                        <SelectItem value="couple">👫 Couple's Getaway</SelectItem>
                        <SelectItem value="family">👨‍👩‍👧‍👦 Family Trip</SelectItem>
                        <SelectItem value="friends">👥 Friend Squad</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="genz-card p-6 space-y-8 step-animation">
            <FormField
              control={form.control}
              name="tripStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="emoji-label">
                    <Compass className="w-5 h-5" /> What's your travel style?
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="genz-input">
                        <SelectValue placeholder="Choose your vibe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="adventure">🏃‍♂️ Adventure Seeker</SelectItem>
                      <SelectItem value="cultural">🏛️ Culture Explorer</SelectItem>
                      <SelectItem value="relaxed">🏖️ Chill Vibes</SelectItem>
                      <SelectItem value="foodie">🍜 Food Lover</SelectItem>
                      <SelectItem value="budget">💰 Budget Explorer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="emoji-label">
                    <Heart className="w-5 h-5" /> What interests you?
                  </FormLabel>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map((interest) => (
                        <Badge
                          key={interest.value}
                          variant={field.value.includes(interest.value) ? "default" : "outline"}
                          className="cursor-pointer text-base py-2 px-4"
                          onClick={() => {
                            const newValue = field.value.includes(interest.value)
                              ? field.value.filter(i => i !== interest.value)
                              : [...field.value, interest.value]
                            field.onChange(newValue)
                          }}
                        >
                          {interest.emoji} {interest.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dietaryPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="emoji-label">
                    <Utensils className="w-5 h-5" /> Any dietary preferences?
                  </FormLabel>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {dietaryOptions.map((diet) => (
                        <Badge
                          key={diet.value}
                          variant={field.value.includes(diet.value) ? "default" : "outline"}
                          className="cursor-pointer text-base py-2 px-4"
                          onClick={() => {
                            const newValue = field.value.includes(diet.value)
                              ? field.value.filter(i => i !== diet.value)
                              : [...field.value, diet.value]
                            field.onChange(newValue)
                          }}
                        >
                          {diet.emoji} {diet.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="genz-card p-6 space-y-8 step-animation">
            <FormField
              control={form.control}
              name="accommodationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="emoji-label">
                    <Home className="w-5 h-5" /> Where would you like to stay?
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="genz-input">
                        <SelectValue placeholder="Select accommodation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(accommodationEmojis).map(([value, emoji]) => (
                        <SelectItem key={value} value={value}>
                          {emoji} {value.charAt(0).toUpperCase() + value.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="emoji-label">
                    <Wallet className="w-5 h-5" /> What's your daily budget?
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      className="genz-input"
                      min={1000}
                      placeholder="₹ Amount per day"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="emoji-label">
                    <Activity className="w-5 h-5" /> How active do you want to be?
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="genz-input">
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">🐌 Taking it easy</SelectItem>
                      <SelectItem value="medium">🚶‍♂️ Balanced mix</SelectItem>
                      <SelectItem value="high">🏃‍♂️ Super active</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="emoji-label">
                    <AlertCircle className="w-5 h-5" /> Any special requirements?
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="E.g., accessibility needs, specific interests, etc."
                      className="genz-input min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-between gap-4">
          {currentStep > 1 && (
            <Button 
              type="button"
              variant="outline"
              className="genz-button bg-white text-primary hover:bg-white/90"
              onClick={() => setCurrentStep(step => step - 1)}
            >
              ← Back
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button 
              type="button"
              className="genz-button ml-auto"
              onClick={() => setCurrentStep(step => step + 1)}
            >
              Next →
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="genz-button ml-auto"
              disabled={loading}
            >
              {loading ? "✨ Creating your perfect trip..." : "🚀 Plan My Trip"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}