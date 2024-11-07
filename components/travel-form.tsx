'use client';

import {
	accommodationEmojis,
	BACKEND_URL,
	dietaryOptions,
	interestOptions,
} from '@/app/utils/constants';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';

import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import {
	Activity,
	AlertCircle,
	CalendarIcon,
	Check,
	ChevronsUpDown,
	Compass,
	Heart,
	Home,
	Users,
	Utensils,
	Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
	destination: z.string().min(2, 'Select a valid destination'),
	dates: z.object({
		from: z.date(),
		to: z.date(),
	}),
	travelers: z.number().min(1).max(10),
	groupType: z.enum(['solo', 'couple', 'family', 'friends']),
	tripStyle: z.enum(['adventure', 'cultural', 'relaxed', 'foodie', 'budget']),
	budget: z.number().min(1000),
	currency: z.string().min(1, 'Select a currency'),
	interests: z.array(z.string()).min(1, 'Select at least one interest'),
	dietaryPreferences: z.array(z.string()),
	accommodationType: z.enum([
		'hotel',
		'hostel',
		'apartment',
		'resort',
		'local',
	]),
	activityLevel: z.enum(['low', 'medium', 'high']),
	specialRequirements: z.string().optional(),
});

export function TravelForm({
	setTripPlan,
}: {
	setTripPlan: React.Dispatch<React.SetStateAction<string>>;
}) {
	const { toast } = useToast();
	const [currentStep, setCurrentStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [calendarOpen, setCalendarOpen] = useState(false);

	const [destinationSearchQuery, setDestinationSearchQuery] = useState('');
	const [citySuggestions, setCitySuggestions] = useState([]);
	const [loadingCities, setLoadingCities] = useState(false);

	const cityOptions = !loadingCities
		? citySuggestions.map((city) => ({
				value: city,
				label: city,
		  }))
		: [{ value: 'Loading cities...', label: 'Loading cities...' }];

	console.log('City options are , ', cityOptions);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			destination: '',
			travelers: 1,
			groupType: 'solo',
			tripStyle: 'cultural',
			budget: 5000,
			currency: 'inr',
			interests: [],
			dietaryPreferences: [],
			accommodationType: 'hotel',
			activityLevel: 'medium',
			specialRequirements: '',
		},
	});

	// Debounced function to fetch cities from backend
	const fetchCities = debounce(async (query) => {
		// if (!query) return;
		setLoadingCities(true);
		try {
			const response = await fetch(
				// `http://localhost:8000/autocomplete?search=${query}`
				`${BACKEND_URL}/autocomplete?search=${query}`
			);
			const data = await response.json();
			setCitySuggestions(data); // Assuming backend returns an array of city names
		} catch (error) {
			console.error('Error fetching cities:', error);
		} finally {
			setLoadingCities(false);
		}
	}, 300);

	// Effect to trigger city search whenever destination input changes
	useEffect(() => {
		fetchCities(destinationSearchQuery);
	}, [destinationSearchQuery]);

	async function onSubmit(values: any) {
		if (currentStep !== 3) {
			return; // Only submit when on the final step
		}

		try {
			setLoading(true);
			const response = await fetch('http://localhost:8000/generate-trip-plan', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) throw new Error('Failed to fetch trip plan');

			const data = await response.json();
			setTripPlan(data.plan);
		} catch (error) {
			console.error('Trip generation error:', error);
			toast({
				variant: 'destructive',
				title: 'Oops! Something went wrong',
				description: 'Failed to generate your trip plan. Please try again.',
			});
		} finally {
			setLoading(false);
		}
	}

	const validateStep = async () => {
		let isValid = false;

		if (currentStep === 1) {
			isValid = await form.trigger([
				'destination',
				'dates',
				'travelers',
				'groupType',
			]);
		} else if (currentStep === 2) {
			isValid = await form.trigger([
				'tripStyle',
				'interests',
				'dietaryPreferences',
			]);
		}

		if (!isValid) {
			const errors = form.formState.errors;
			const errorMessage =
				Object.values(errors)[0]?.message ||
				'Please fill in all required fields';
			toast({
				variant: 'destructive',
				title: 'Required Fields',
				description: errorMessage,
			});
			return false;
		}
		return true;
	};

	const handleNext = async (e: React.MouseEvent) => {
		e.preventDefault(); // Prevent form submission
		const isValid = await validateStep();
		if (isValid) {
			setCurrentStep((step) => step + 1);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="mb-8">
					<div className="h-2 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-primary transition-all duration-500 ease-out"
							style={{ width: `${(currentStep / 3) * 100}%` }}
						/>
					</div>
					<div className="mt-2 text-sm text-muted-foreground">
						Step {currentStep} of 3
					</div>
				</div>

				{currentStep === 1 && (
					<div className="genz-card p-6 space-y-8 step-animation">
						<FormField
							control={form.control}
							name="destination"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Destination</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													className={cn(
														'w-[200px] justify-between',
														!field.value && 'text-muted-foreground'
													)}>
													{field.value
														? cityOptions.find(
																(option) => option.value === field.value
														  )?.label
														: 'Select Destination'}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-[200px] p-0">
											<Command>
												<CommandInput
													onChangeCapture={(e) =>
														setDestinationSearchQuery(
															(e.target as HTMLInputElement).value
														)
													}
													placeholder="Search destination..."
												/>
												<CommandList>
													<CommandEmpty>No Destination found.</CommandEmpty>
													<CommandGroup>
														{cityOptions.map((option) => (
															<CommandItem
																value={option.label}
																key={option.value}
																onSelect={() => {
																	form.setValue('destination', option.value);
																}}>
																{option.label}
																<Check
																	className={cn(
																		'ml-auto',
																		option.value === field.value
																			? 'opacity-100'
																			: 'opacity-0'
																	)}
																/>
															</CommandItem>
														))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
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
										<CalendarIcon className="w-5 h-5" /> When are you planning
										to go?
									</FormLabel>
									<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={`genz-input w-full justify-start text-left font-normal ${
													!field.value && 'text-muted-foreground'
												}`}>
												{field.value?.from ? (
													field.value.to ? (
														<>
															{format(field.value.from, 'MMM d')} -{' '}
															{format(field.value.to, 'MMM d, yyyy')}
														</>
													) : (
														format(field.value.from, 'MMM d, yyyy')
													)
												) : (
													<span>Select your travel dates</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0 bg-white"
											align="start">
											<Calendar
												initialFocus
												mode="range"
												defaultMonth={field.value?.from}
												selected={field.value}
												onSelect={(value) => {
													field.onChange(value);
													if (value?.from && value?.to) {
														setCalendarOpen(false);
													}
												}}
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
												onChange={(e) =>
													field.onChange(parseInt(e.target.value))
												}
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
										<FormLabel className="emoji-label">
											Who&apos;s going?
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="genz-input">
													<SelectValue placeholder="Select group type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="bg-white">
												<SelectItem value="solo">🙋‍♂️ Solo Adventure</SelectItem>
												<SelectItem value="couple">
													👫 Couple&apos;s Getaway
												</SelectItem>
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
										<Compass className="w-5 h-5" /> What&apos;s your travel
										style?
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="genz-input">
												<SelectValue placeholder="Choose your vibe" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="bg-white">
											<SelectItem value="adventure">
												🏃‍♂️ Adventure Seeker
											</SelectItem>
											<SelectItem value="cultural">
												🏛️ Culture Explorer
											</SelectItem>
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
													variant={
														field.value.includes(interest.value)
															? 'default'
															: 'outline'
													}
													className="cursor-pointer text-base py-2 px-4"
													onClick={() => {
														const newValue = field.value.includes(
															interest.value
														)
															? field.value.filter((i) => i !== interest.value)
															: [...field.value, interest.value];
														field.onChange(newValue);
													}}>
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
													variant={
														field.value.includes(diet.value)
															? 'default'
															: 'outline'
													}
													className="cursor-pointer text-base py-2 px-4"
													onClick={() => {
														const newValue = field.value.includes(diet.value)
															? field.value.filter((i) => i !== diet.value)
															: [...field.value, diet.value];
														field.onChange(newValue);
													}}>
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
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="genz-input">
												<SelectValue placeholder="Select accommodation type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="bg-white">
											{Object.entries(accommodationEmojis).map(
												([value, emoji]) => (
													<SelectItem key={value} value={value}>
														{emoji}{' '}
														{value.charAt(0).toUpperCase() + value.slice(1)}
													</SelectItem>
												)
											)}
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
										<Wallet className="w-5 h-5" /> What&apos;s your daily
										budget?
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											className="genz-input"
											min={1000}
											placeholder="₹ Amount per day"
											{...field}
											onChange={(e) => field.onChange(parseInt(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="currency"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="emoji-label">
										<Wallet className="w-5 h-5" /> Choose your currency?
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="genz-input">
												<SelectValue placeholder="Select currency" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="bg-white">
											<SelectItem value="usd">💵 USD ($)</SelectItem>
											<SelectItem value="eur">💶 EUR (€)</SelectItem>
											<SelectItem value="gbp">💷 GBP (£)</SelectItem>
											<SelectItem value="inr">₹ INR (₹)</SelectItem>
											<SelectItem value="aud">💵 AUD ($)</SelectItem>
											<SelectItem value="cad">💵 CAD ($)</SelectItem>
											<SelectItem value="jpy">¥ JPY (¥)</SelectItem>
											<SelectItem value="cny">¥ CNY (¥)</SelectItem>
										</SelectContent>
									</Select>
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
										<Activity className="w-5 h-5" /> How active do you want to
										be?
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="genz-input">
												<SelectValue placeholder="Select activity level" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="bg-white">
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
										<AlertCircle className="w-5 h-5" /> Any special
										requirements?
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
							onClick={() => setCurrentStep((step) => step - 1)}>
							← Back
						</Button>
					)}

					{currentStep < 3 ? (
						<Button
							type="button"
							className="genz-button ml-auto"
							onClick={handleNext}>
							Next →
						</Button>
					) : (
						<Button
							type="submit"
							className="genz-button ml-auto"
							disabled={loading}>
							{loading ? '✨ Creating your perfect trip...' : '🚀 Plan My Trip'}
						</Button>
					)}
				</div>
			</form>
		</Form>
	);
}
