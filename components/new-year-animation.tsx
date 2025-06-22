"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface NewYearAnimationProps {
	onComplete: () => void;
	showSkipButton?: boolean;
	autoSkip?: boolean;
	autoSkipDelay?: number;
}

export default function NewYearAnimation({
	onComplete,
	showSkipButton = false,
	autoSkip = false,
	autoSkipDelay = 5000,
}: NewYearAnimationProps) {
	const [showSkip, setShowSkip] = useState(false);

	useEffect(() => {
		console.log("NewYearAnimation: Component mounted, starting timers");

		let skipTimer: NodeJS.Timeout | undefined;
		let completeTimer: NodeJS.Timeout | undefined;

		// Show skip button immediately if showSkipButton, else after 1s
		if (showSkipButton) {
			setShowSkip(true);
		} else {
			skipTimer = setTimeout(() => {
				console.log("NewYearAnimation: Showing skip button");
				setShowSkip(true);
			}, 1000);
		}

		// Auto-complete after autoSkipDelay if autoSkip is true
		if (autoSkip) {
			completeTimer = setTimeout(() => {
				console.log(
					"NewYearAnimation: Auto-skip timer completed, calling onComplete"
				);
				if (onComplete && typeof onComplete === "function") {
					onComplete();
				} else {
					console.error(
						"NewYearAnimation: onComplete is not a function"
					);
				}
			}, autoSkipDelay);
		}

		// Cleanup function
		return () => {
			console.log("NewYearAnimation: Cleaning up timers");
			if (skipTimer) clearTimeout(skipTimer);
			if (completeTimer) clearTimeout(completeTimer);
		};
	}, [onComplete, showSkipButton, autoSkip, autoSkipDelay]);

	const handleSkip = () => {
		console.log(
			"NewYearAnimation: Skip button clicked, calling onComplete immediately"
		);
		if (onComplete && typeof onComplete === "function") {
			onComplete();
		} else {
			console.error(
				"NewYearAnimation: onComplete function not available"
			);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
			{/* Fireworks */}
			{[...Array(8)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-4 h-4 rounded-full bg-yellow-400"
					style={{
						left: `${30 + Math.random() * 40}%`,
						top: `${30 + Math.random() * 40}%`,
					}}
					initial={{ scale: 0, opacity: 1 }}
					animate={{
						scale: [0, 2, 0],
						opacity: [1, 1, 0],
						x: [0, (Math.random() - 0.5) * 200],
						y: [0, (Math.random() - 0.5) * 200],
					}}
					transition={{
						duration: 1.5,
						delay: Math.random() * 0.5,
						ease: "easeOut",
					}}
				/>
			))}

			{/* Main Text */}
			<motion.div
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.5, duration: 0.8 }}
				className="text-center z-20"
			>
				<motion.h1
					className="text-6xl md:text-8xl font-bold text-yellow-400 mb-4 drop-shadow-2xl"
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.8, duration: 0.6 }}
				>
					LET THE
				</motion.h1>
				<motion.h1
					className="text-6xl md:text-8xl font-bold text-white mb-8 drop-shadow-2xl"
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 1.2, duration: 0.6 }}
				>
					GAMES BEGIN!
				</motion.h1>

				<motion.div
					className="text-2xl md:text-3xl text-yellow-300 font-bold"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.8, duration: 0.5 }}
				>
					🏆 Office Olympics 2025 🏆
				</motion.div>
			</motion.div>

			{/* Sparkles */}
			{[...Array(6)].map((_, i) => (
				<motion.div
					key={`sparkle-${i}`}
					className="absolute text-yellow-300 text-2xl z-10"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
					}}
					animate={{
						opacity: [0, 1, 0],
						scale: [0, 1, 0],
						rotate: [0, 360],
					}}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						delay: Math.random() * 2,
					}}
				>
					✨
				</motion.div>
			))}

			{/* Skip Button */}
			<AnimatePresence>
				{showSkip && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="absolute top-8 right-8 z-30"
					>
						<Button
							onClick={handleSkip}
							className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-lg"
						>
							Skip Animation
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
