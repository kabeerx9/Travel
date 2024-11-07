import React from 'react';
import 'tailwindcss/tailwind.css';
import { Button } from './ui/button';

interface TripPreviewProps {
	tripPlan: string;
	setTripPlan: React.Dispatch<React.SetStateAction<string>>;
}

const TripPreview: React.FC<TripPreviewProps> = ({ tripPlan, setTripPlan }) => {
	console.log('Plan in trip preview', tripPlan);

	return (
		<>
			<Button onClick={() => setTripPlan('')}>Create New Plan</Button>
			<div
				className="text-gray-800 space-y-10"
				dangerouslySetInnerHTML={{ __html: tripPlan }}
			/>
		</>
	);
};

export default TripPreview;
