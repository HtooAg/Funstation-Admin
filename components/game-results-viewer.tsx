"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Trophy, Medal, Award } from "lucide-react";

interface GameResultsViewerProps {
	gameId: string;
	gameName: string;
	teams: string[];
	onBack: () => void;
	onPrevious?: () => void;
	onNext?: () => void;
	canGoPrevious?: boolean;
	canGoNext?: boolean;
}

export default function GameResultsViewer({
	gameId,
	gameName,
	teams,
	onBack,
	onPrevious,
	onNext,
	canGoPrevious,
	canGoNext,
}: GameResultsViewerProps) {
	const [gameResults, setGameResults] = useState<any[]>([]);

	useEffect(() => {
		const gameData = JSON.parse(localStorage.getItem("gameData") || "[]");
		const game = gameData.find((g: any) => g.id === gameId);

		if (game) {
			const results = Object.entries(game.teams || {})
				.map(([teamName, data]: [string, any]) => ({
					name: teamName,
					time: data.time,
					completed: data.completed,
				}))
				.sort((a, b) => a.time - b.time)
				.map((team, index) => ({ ...team, position: index + 1 }));

			setGameResults(results);
		}
	}, [gameId]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const getPodiumIcon = (position: number) => {
		switch (position) {
			case 1:
				return <Trophy className="w-6 h-6 text-yellow-500" />;
			case 2:
				return <Medal className="w-6 h-6 text-gray-400" />;
			case 3:
				return <Award className="w-6 h-6 text-amber-600" />;
			default:
				return (
					<div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">
						{position}
					</div>
				);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			{/* Header */}
			<motion.header
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 shadow-sm"
			>
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Button
							onClick={onBack}
							variant="outline"
							className="border-slate-300 text-slate-700 hover:bg-slate-100"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Dashboard
						</Button>
						<div>
							<h1 className="text-2xl font-bold text-slate-900">
								{gameName} Results
							</h1>
							<p className="text-slate-600 font-medium">
								Individual game performance
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-2">
						{canGoPrevious && (
							<Button
								onClick={onPrevious}
								variant="outline"
								className="border-slate-300 text-slate-700 hover:bg-slate-100"
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Previous Game
							</Button>
						)}
						{canGoNext && (
							<Button
								onClick={onNext}
								variant="outline"
								className="border-slate-300 text-slate-700 hover:bg-slate-100"
							>
								Next Game
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						)}
					</div>
				</div>
			</motion.header>

			<div className="max-w-4xl mx-auto p-6 space-y-6">
				{/* Game Winner */}
				{gameResults.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center"
					>
						<Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg">
							<CardContent className="p-8">
								<Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
								<h2 className="text-3xl font-bold text-slate-900 mb-2">
									Game Winner
								</h2>
								<h3 className="text-2xl font-semibold text-yellow-700 mb-2">
									{gameResults[0]?.name}
								</h3>
								<p className="text-lg text-slate-600">
									Time:{" "}
									{formatTime(gameResults[0]?.time || 0)}
								</p>
							</CardContent>
						</Card>
					</motion.div>
				)}

				{/* Full Results */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card className="bg-white shadow-lg border border-slate-200">
						<CardHeader>
							<CardTitle className="text-slate-900 font-bold text-xl">
								Complete Results
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-3">
								{(gameId === "house-of-cards"
									? gameResults.slice(0, 3)
									: gameResults
								).map((team, index) => (
									<motion.div
										key={team.name}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.1 * index }}
										className={`p-4 rounded-xl border-2 ${
											team.position === 1
												? "bg-yellow-50 border-yellow-200"
												: team.position === 2
												? "bg-slate-50 border-slate-200"
												: team.position === 3
												? "bg-amber-50 border-amber-200"
												: "bg-slate-50 border-slate-200"
										}`}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-4">
												{getPodiumIcon(team.position)}
												<div>
													<h3 className="font-bold text-slate-900 text-lg">
														{team.name}
													</h3>
													<p className="text-slate-600">
														{team.position === 1
															? "1st Place"
															: team.position ===
															  2
															? "2nd Place"
															: team.position ===
															  3
															? "3rd Place"
															: `${team.position}th Place`}
													</p>
												</div>
											</div>
											<div className="text-right">
												<div className="text-2xl font-bold text-slate-900">
													{formatTime(team.time)}
												</div>
												<Badge
													className={
														team.position === 1
															? "bg-yellow-100 text-yellow-800 border-yellow-200"
															: team.position <= 3
															? "bg-blue-100 text-blue-800 border-blue-200"
															: "bg-slate-100 text-slate-600 border-slate-200"
													}
												>
													{team.position === 1
														? "Winner"
														: `Position ${team.position}`}
												</Badge>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Navigation Buttons */}
				<div className="flex justify-center gap-4 mt-8">
					<Button
						onClick={onBack}
						variant="outline"
						className="px-6 py-3 text-lg"
					>
						Return to Dashboard
					</Button>
					{onNext && (
						<Button
							onClick={onNext}
							className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 text-lg"
						>
							Continue to Next Game
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
