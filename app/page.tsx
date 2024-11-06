'use client';
import { TravelForm } from '@/components/travel-form';
import { Plane } from 'lucide-react';

// import Groq from 'groq-sdk';
// import { useEffect } from 'react';

// const groq = new Groq({
// 	apiKey: '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',
// 	dangerouslyAllowBrowser: true,
// });

// export async function main() {
// 	const chatCompletion = await getGroqChatCompletion();
// 	// Print the completion returned by the LLM.
// 	console.log(chatCompletion.choices[0]?.message?.content || '');
// }

// export async function getGroqChatCompletion() {
// 	return groq.chat.completions.create({
// 		messages: [
// 			{
// 				role: 'user',
// 				content:
// 					'Name the best football player of all time . Name a single one',
// 			},
// 		],
// 		model: 'llama3-8b-8192',
// 	});
// }

export default function Home() {
	// async function getData() {
	// 	const res = await main();
	// 	console.log(res);
	// }

	// useEffect(() => {
	// 	getData();
	// }, []);

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

				<div className="form-container">
					<TravelForm />
				</div>
			</div>
		</main>
	);
}
