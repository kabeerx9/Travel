import { format } from 'date-fns';
import Groq from 'groq-sdk';
const groq = new Groq({
	apiKey: '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',
	dangerouslyAllowBrowser: true,
});

export async function main(prompt: string) {
	const chatCompletion = await getGroqChatCompletion(prompt);
	console.log(chatCompletion.choices[0]?.message?.content || '');
}

export async function getGroqChatCompletion(prompt: string) {
	return groq.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: prompt,
			},
		],
		model: 'llama3-8b-8192',
	});
}

export async function generateTripPlan(formData: any) {
	const {
		destination,
		dates,
		travelers,
		groupType,
		tripStyle,
		interests,
		dietaryPreferences,
		accommodationType,
		activityLevel,
		budget,
		specialRequirements,
	} = formData;

	const prompt = `
  Generate a detailed, day-by-day itinerary for a ${travelers}-person ${groupType} trip to ${destination} with the following details:

  Destination: ${destination}
  Travel Dates: ${format(dates.from, 'MMM d, yyyy')} - ${format(
		dates.to,
		'MMM d, yyyy'
	)}
  Travel Style: ${tripStyle}
  Interests: ${interests.join(', ')}
  Dietary Preferences: ${dietaryPreferences.join(', ')}
  Accommodation Type: ${accommodationType}
  Activity Level: ${activityLevel}
  Daily Budget: ₹${budget.toLocaleString('en-IN')} per person
  Special Requirements: ${specialRequirements || 'None'}

  Please ensure the following:
  - Only return a full itinerary if the specified city actually exists. 
  - If the city does not exist, return only this exact line without any further explanation: "Madarchod anpad"
  - If generating the itinerary, only include activities and dining suggestions if certain they exist. Avoid naming any restaurants or places if unsure of their authenticity.

  Format the itinerary with clear, structured day-by-day activities, attractions, dining recommendations, and transportation details.
  `;

	// Call the AI API with the prompt and return the generated itinerary
	const response = await main(prompt);
	return response;
}
