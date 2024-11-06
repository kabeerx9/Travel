"use client"

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from 'date-fns'
import { TripPlan, ContactInfo } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const contactSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  whatsapp: z.string().optional(),
})

interface TripPreviewProps {
  plan: TripPlan;
  onSave: (contactInfo: ContactInfo) => Promise<void>;
}

export function TripPreview({ plan, onSave }: TripPreviewProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      whatsapp: "",
    },
  })

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    try {
      setIsSaving(true)
      await onSave(values)
      toast({
        title: "Success! 🎉",
        description: "Your itinerary has been sent to your email!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops! 😅",
        description: "Failed to save itinerary. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Your Trip to {plan.destination}</h2>
        <p className="text-muted-foreground">
          {format(plan.dates.from, 'MMM d')} - {format(plan.dates.to, 'MMM d, yyyy')}
        </p>
      </div>

      <div className="space-y-6">
        {plan.itinerary.map((day) => (
          <div key={day.day} className="genz-card p-6 space-y-4">
            <h3 className="text-xl font-bold">Day {day.day} - {format(new Date(day.date), 'MMM d')}</h3>
            <div className="space-y-4">
              {day.schedule.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{item.time} - {item.activity}</div>
                    <div className="text-muted-foreground">₹{item.cost}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {item.location && (
                    <p className="text-sm">📍 {item.location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="genz-card p-6 space-y-6">
        <h3 className="text-xl font-bold">Save Your Itinerary</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your@email.com" 
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
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+91 1234567890" 
                      className="genz-input"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="genz-button w-full"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Itinerary"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}