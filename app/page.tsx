'use client';
import { TravelForm } from '@/components/travel-form';
import TripPreview from '@/components/trip-preview';
import { Plane } from 'lucide-react';
import { useState } from 'react';

const TEMP_PLAN =
	"<h1>Agra, Nov 7, 2024 - Nov 15, 2024</h1>\n\n<h2>Day 1: November 7, 2024</h2>\n<ul>\n  <li><strong>Arrival in Agra</strong> - Reach Agra by overnight train or early morning bus / taxi from Delhi.<strong>Cost: INR 300 - 1,000</strong></li>\n  <li><strong.Check-in to Hotel</strong> - Check-in to a culturally rich hotel in Agra, such as the Hotel Amar Vilas or similar. Strongly recommend an early check-in to avoid delays. <strong>Cost: INR 3,000 - 5,000 per night</strong></li>\n  <li><strong.Local Exploration</strong> - Spend the day exploring the local markets, temples, and ghats of Agra.</li>\n  <li><em>Meal Recommendation: Karhi</em> - Try a local non-vegetarian dish like Karhi, available at various street stalls and small eateries. <strong>Cost: INR 100 - 200</strong></li>\n</ul>\n\n<p> Transportation Tip: Opt for a local bus or rickshaw to get around Agra, as traffic can be chaotic. Strongly advise against haggling over prices with rickshaw operators.</p>\n\n<h2>Day 2: November 8, 2024</h2>\n<ul>\n  <li><strong.Taj Mahal Sunrise View</strong> - Start the day with a breathtaking sunrise view of the Taj Mahal. <strong>Cost: INR 50</strong></li>\n  <li><strong.Taj Mahal Guided Tour</strong> - Take a guided tour of the Taj Mahal, exploring its intricate marble work and historical significance. <strong>Cost: INR 150</strong></li>\n  <li><em>Meal Recommendation: Mughlai Cuisine</em> - Enjoy a non-vegetarian Mughlai meal at a local restaurant. <strong>Cost: INR 300 - 500</strong></li>\n</ul>\n\n<p>Accommodation Tip: Be sure to book a room with a lake view at your hotel for a serene experience.</p>\n\n<h2>Day 3: November 9, 2024</h2>\n<ul>\n  <li><strong.Fatehpur Sikri Excursion</strong> - Take a day trip to the abandoned city of Fatehpur Sikri, a UNESCO World Heritage Site. <strong>Cost: INR 200</strong></li>\n  <li><strong.Lunch Recommendation</strong> - Try a local non-vegetarian thali at a small eatery near the city's ruins. <strong>Cost: INR 100 - 200</strong></li>\n  <li><strong.River Cruise</strong> - Enjoy a tranquil evening river cruise, taking in the city's lights and sounds. <strong>Cost: INR 300</strong></li>\n</ul>\n\n<p>Transportation Tip: Opt for an air-conditioned car or bus for the Fatehpur Sikri excursion, as the journey can be long and hot.</p>\n\n<h2>Day 4: November 10, 2024</h2>\n<ul>\n  <li><strong.Agra Fort Guided Tour</strong> - Explore the stunning Agra Fort, a UNESCO World Heritage Site, and learn about its rich history. <strong>Cost: INR 50</strong></li>\n  <li><em>Meal Recommendation: Street Food</em> - Indulge in local street food, such as kebabs or chaats, at a popular market. <strong>Cost: INR 100 - 200</strong></li>\n  <li><strong.Evening Exploration</strong> - Wander around the city's markets and temples, soaking in the local culture.</li>\n</ul>\n\n<p>Accommodation Tip: Take advantage of the hotel's spa facilities to unwind after a long day of exploring.</p>\n\n<h2>Day 5: November 11, 2024</h2>\n<ul>\n  <li><strong.Busya and Nakkhal Restaurant</strong> - Visit this popular local eatery for a non-vegetarian meal. <strong>Cost: INR 300 - 500</strong></li>\n  <li><strong.Kaanch Mahal</strong> - Explore this stunning palace with intricate marble work and learn about its historical significance. <strong>Cost: INR 50</strong></li>\n  <li><strong.Evening Relaxation</strong> - Unwind and relax at your hotel or take a leisurely stroll around the city.</li>\n</ul>\n\n<p>Transportation Tip: Book a local sightseeing tour with a reputable operator for the day's activities.</p>\n\n<h2>Day 6: November 12, 2024</h2>\n<ul>\n  <li><strong.Manjhara</strong> - Explore this beautiful garden and take in the city's natural beauty. <strong>Cost: INR 50</strong></li>\n  <li><em>Meal Recommendation: Local Cuisine</em> - Savor local non-vegetarian dishes at a small eatery or street stall. <strong>Cost: INR 100 - 200</strong></li>\n  <li><strong.Evening Entertainment</strong> - Catch a local cultural performance or attend a festival (if scheduled) to immerse yourself in the city's vibrant culture.</li>\n</ul>\n\n<p>Accommodation Tip: Check-in at your hotel's restaurant for a relaxing evening and to enjoy the local ambiance.</p>\n\n<h2>Day 7: November 13, 2024</h2>\n<ul>\n  <li><strong.Local Bazaar</strong> - Visit the local markets and ghats, taking in the sights and sounds of the city. <strong>Cost: FREE</strong></li>\n  <li><strong.Feast of Love</strong> - Enjoy an exquisite non-vegetarian meal at a local restaurant, with dishes inspired by the region's rich culinary heritage. <strong>Cost: INR 500 - 700</strong></li>\n  <li><strong.Evening Leisure</strong> - Unwind and relax at your hotel or take a leisurely stroll around the city.</li>\n</ul>\n\n<p>Transportation Tip: Opt for a local rickshaw or auto-rickshaw for transportation around the city, as they are economical and convenient.</p>\n\n<h2>Day 8: November 14, 2024</h2>\n<ul>\n  <li><strong.Last-minute Shopping</strong> - Spend the day shopping for local souvenirs and handicrafts. <strong>Cost: INR 500 - 1,000</strong></li>\n  <li><em>Meal Recommendation: Farewell Dinner</em> - Celebrate your last evening in Agra with a special non-vegetarian farewell dinner at a local restaurant. <strong>Cost: INR 500 - 700</strong></li>\n  <li><strong.Evening Departure</strong> - Check-out of your hotel and depart for Delhi.</li>\n</ul>\n\n<p>Transportation Tip: Book a morning bus or train from Agra to Delhi for your onward journey.</p>\n\n<h2>Day 9-15: November 14, 2024 - November 15, 2024</h2>\n<p>These days are allocated for your return journey to your starting point, or for any additional activities and exploration you might want to undertake.</p>\n\n<h2>Budget Breakdown:</h2>\n<ul>\n  <li>\n    <p><strong.Accommodation:</strong> INR 21,000 (avg. INR 3,500 per night)</p>\n  </li>\n  <li>\n    <p><strong.Meals:</strong> INR 7,200 (avg. INR 400 per meal)</p>\n  </li>\n  <li>\n    <p><strong.Transportation:</strong> INR 3,300 (avg. INR 1,100 for train/bus tickets and INR 200 for local transportation)</p>\n  </li>\n  <li>\n    <p><strong.Attractions:</strong> INR 1,800 (avg. INR 200 per entrance fee)</p>\n  </li>\n  <li>\n    <p><strong.Total:</strong> INR 33,400</p>\n  </li>\n</ul>\n\nNote: The budget breakdown is an estimate and may vary based on individual preferences and exchange rates.";

export default function Home() {
	// const [tripPlan, setTripPlan] = useState(TEMP_PLAN);
	const [tripPlan, setTripPlan] = useState('');

	return (
		<main className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-accent">
			<div className="max-w-3xl mx-auto space-y-12">
				<div className="text-center space-y-8">
					<div className="inline-block floating">
						<div className="bg-white/90 backdrop-blur-sm rounded-full p-6 neon-shadow">
							<Plane className="w-16 h-16 text-primary" />
						</div>
					</div>
					<div className="space-y-4">
						<h1 className="text-7xl font-black tracking-tight">
							Travel
							<span className="gradient-text">Mate</span>
						</h1>
						<p className="text-2xl text-muted-foreground font-medium">
							✨ Your AI bestie for the perfect vacay ✈️
						</p>
					</div>
					<div className="max-w-xl mx-auto">
						<p className="text-lg text-muted-foreground">
							Tell us your travel dreams, and we&apos;ll craft the perfect
							itinerary just for you. Let&apos;s make your next adventure
							unforgettable! 🌎
						</p>
					</div>
				</div>

				{tripPlan.length > 0 ? (
					<TripPreview tripPlan={tripPlan} setTripPlan={setTripPlan} />
				) : (
					<div className="form-container">
						<TravelForm setTripPlan={setTripPlan} />
					</div>
				)}
			</div>
		</main>
	);
}
