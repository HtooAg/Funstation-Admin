"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, Trophy, ArrowRight, Plus, Minus } from "lucide-react";
import Image from "next/image";

interface Game {
	id: string;
	name: string;
	icon: React.ReactNode;
	description: string;
	maxTime: number;
}

interface GameInterfaceProps {
	game: Game;
	teams: string[];
	gameIndex: number;
	totalGames: number;
	onComplete: () => void;
	onBack: () => void;
}

interface TeamTime {
	minutes: number;
	seconds: number;
	penalties?: number;
	bonuses?: number;
	completed: boolean;
	position?: number;
}

export default function GameInterface({
	game,
	teams,
	gameIndex,
	totalGames,
	onComplete,
	onBack,
}: GameInterfaceProps) {
	const [teamTimes, setTeamTimes] = useState<{
		[teamName: string]: TeamTime;
	}>({});
	const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
	const { toast } = useToast();

	useEffect(() => {
		// Always start with fresh data for each game
		const initialTimes: { [teamName: string]: TeamTime } = {};
		teams.forEach((team) => {
			initialTimes[team] = {
				minutes: 0,
				seconds: 0,
				penalties: 0,
				bonuses: 0,
				completed: false,
			};
		});
		setTeamTimes(initialTimes);
		setCurrentTeamIndex(0); // Reset to first team
		console.log(`GameInterface: Starting ${game.name} with fresh data`);
	}, [teams, game.id]); // Reset when game changes

	const updateTeamTime = (
		teamName: string,
		field: keyof TeamTime,
		value: number | boolean
	) => {
		setTeamTimes((prev) => ({
			...prev,
			[teamName]: {
				...prev[teamName],
				[field]: value,
			},
		}));
	};

	const calculateFinalTime = (teamTime: TeamTime): number => {
		if (game.id === "house-of-cards") {
			// Use position-based time
			let base = 0;
			if (teamTime.position === 1) base = 60;
			else if (teamTime.position === 2) base = 75;
			else if (teamTime.position === 3) base = 90;
			if (teamTime.bonuses) base -= 15;
			return Math.max(0, base);
		}
		let totalSeconds = teamTime.minutes * 60 + teamTime.seconds;
		if (game.id === "office-chair-race" && teamTime.penalties) {
			totalSeconds += teamTime.penalties * 5;
		}
		return Math.max(0, totalSeconds);
	};

	const handleCompleteTeam = (teamName: string) => {
		const teamTime = teamTimes[teamName];
		if (game.id === "house-of-cards") {
			if (!teamTime.position) {
				toast({
					title: "Select Position",
					description: "Please select the team's position.",
					variant: "destructive",
				});
				return;
			}
		} else if (teamTime.minutes === 0 && teamTime.seconds === 0) {
			toast({
				title: "Invalid Time",
				description: "Please set a valid time for the team.",
				variant: "destructive",
			});
			return;
		}

		const finalTime = calculateFinalTime(teamTime);
		const finalMinutes = Math.floor(finalTime / 60);
		const finalSeconds = finalTime % 60;

		updateTeamTime(teamName, "completed", true);

		toast({
			title: "Team Completed!",
			description: `${teamName} finished in ${finalMinutes}:${finalSeconds
				.toString()
				.padStart(2, "0")}`,
		});

		// Store only current game data, preserving previous games
		const gameData = JSON.parse(localStorage.getItem("gameData") || "[]");
		const existingGameIndex = gameData.findIndex(
			(g: any) => g.id === game.id
		);

		if (existingGameIndex >= 0) {
			gameData[existingGameIndex].teams[teamName] = {
				time: finalTime,
				completed: true,
			};
		} else {
			gameData.push({
				id: game.id,
				name: game.name,
				teams: {
					[teamName]: {
						time: finalTime,
						completed: true,
					},
				},
			});
		}

		localStorage.setItem("gameData", JSON.stringify(gameData));
	};

	const handleNextGame = () => {
		const completedTeams = Object.entries(teamTimes).filter(
			([_, time]) => time.completed
		).length;

		if (completedTeams < teams.length) {
			toast({
				title: "Incomplete Game",
				description: `Please complete times for all ${teams.length} teams before proceeding.`,
				variant: "destructive",
			});
			return;
		}

		// Show a toast after each game is completed
		toast({
			title: isFinalGame ? "Final Game Completed!" : "Game Completed!",
			description: isFinalGame
				? `${game.name} completed! Preparing final results...`
				: `${game.name} (Game ${
						gameIndex + 1
				  } of ${totalGames}) has been completed by all teams.`,
		});

		setTimeout(() => {
			onComplete();
		}, 1500);
	};

	const currentTeam = teams[currentTeamIndex];
	const isFinalGame = gameIndex === totalGames - 1;

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
						<div className="relative">
							<Image
								src="/fun-station-logo.png"
								alt="Fun Station Logo"
								width={40}
								height={40}
								className="rounded-xl shadow-md"
							/>
							<div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl blur opacity-20"></div>
						</div>
						<div>
							<h1 className="text-xl font-bold text-slate-900">
								{game.name}{" "}
								{isFinalGame && (
									<span className="text-red-600">
										(FINAL GAME)
									</span>
								)}
							</h1>
							<p className="text-slate-600 font-medium">
								Game {gameIndex + 1} of {totalGames}
							</p>
						</div>
					</div>
					<Badge className="bg-slate-100 text-slate-700 border-slate-300 px-4 py-2">
						<Clock className="w-4 h-4 mr-2" />
						Max: {game.maxTime} min
					</Badge>
				</div>
			</motion.header>

			<div className="max-w-6xl mx-auto p-6 space-y-6">
				{/* Game Description */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<Card className="bg-white shadow-lg border border-slate-200">
						<CardContent className="p-6">
							<div className="flex items-center space-x-4 text-slate-900">
								<div className="p-3 bg-slate-50 rounded-xl">
									{game.icon}
								</div>
								<div>
									<h2 className="text-2xl font-bold">
										{game.name}
									</h2>
									<p className="text-slate-600 font-medium">
										{game.description}
									</p>
									{isFinalGame && (
										<p className="text-red-600 font-bold mt-2">
											🏆 This is the final game! 🏆
										</p>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Team Navigation */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Card className="bg-white shadow-lg border border-slate-200">
						<CardHeader>
							<CardTitle className="text-slate-900 font-bold">
								Team Selection
							</CardTitle>
							<CardDescription className="text-slate-600">
								Select a team to record their time
							</CardDescription>
						</CardHeader>
						<CardContent className="p-6">
							<div className="flex flex-wrap gap-3">
								{teams.map((team, index) => (
									<Button
										key={team}
										onClick={() =>
											setCurrentTeamIndex(index)
										}
										variant={
											currentTeamIndex === index
												? "default"
												: "outline"
										}
										className={`${
											currentTeamIndex === index
												? "bg-yellow-400 hover:bg-yellow-500 text-black"
												: "border-slate-300 text-slate-700 hover:bg-slate-50"
										} font-medium ${
											teamTimes[team]?.completed
												? "ring-2 ring-green-400"
												: ""
										}`}
									>
										{team}
										{teamTimes[team]?.completed && (
											<Trophy className="w-4 h-4 ml-2 text-green-600" />
										)}
									</Button>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Time Input */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card className="bg-white shadow-lg border border-slate-200">
						<CardHeader>
							<CardTitle className="text-slate-900 font-bold">
								Time Recording - {currentTeam}
								{teamTimes[currentTeam]?.completed && (
									<Badge className="ml-2 bg-green-100 text-green-700 border-green-200">
										Completed
									</Badge>
								)}
							</CardTitle>
							<CardDescription className="text-slate-600">
								{game.id === "house-of-cards"
									? "Select the team's position and creativity bonus."
									: "Manually input the team's completion time"}
							</CardDescription>
						</CardHeader>
						<CardContent className="p-6 space-y-6">
							{/* House of Cards: Position and Creativity Bonus */}
							{game.id === "house-of-cards" ? (
								<HouseOfCardsInput
									teamName={currentTeam}
									teamTime={teamTimes[currentTeam]}
									updateTeamTime={updateTeamTime}
									completed={
										teamTimes[currentTeam]?.completed
									}
								/>
							) : (
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<label className="text-sm font-semibold text-slate-700">
											Minutes
										</label>
										<Select
											value={
												teamTimes[
													currentTeam
												]?.minutes.toString() || "0"
											}
											onValueChange={(value) =>
												updateTeamTime(
													currentTeam,
													"minutes",
													Number.parseInt(value)
												)
											}
										>
											<SelectTrigger className="bg-white border-slate-300 hover:bg-slate-50 focus:border-yellow-400">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Array.from(
													{ length: 11 },
													(_, i) => (
														<SelectItem
															key={i}
															value={i.toString()}
														>
															{i} min
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-semibold text-slate-700">
											Seconds
										</label>
										<Select
											value={
												teamTimes[
													currentTeam
												]?.seconds.toString() || "0"
											}
											onValueChange={(value) =>
												updateTeamTime(
													currentTeam,
													"seconds",
													Number.parseInt(value)
												)
											}
										>
											<SelectTrigger className="bg-white border-slate-300 hover:bg-slate-50 focus:border-yellow-400">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Array.from(
													{ length: 60 },
													(_, i) => (
														<SelectItem
															key={i}
															value={i.toString()}
														>
															{i} sec
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</div>
								</div>
							)}

							{/* Game-specific inputs */}
							{game.id === "house-of-cards" && (
								<div className="bg-green-50 p-4 rounded-xl border border-green-200">
									<h3 className="font-semibold text-slate-900 mb-3">
										Creativity Bonus
									</h3>
									<div className="flex items-center space-x-3">
										<input
											type="checkbox"
											checked={
												teamTimes[currentTeam]
													?.bonuses === 1
											}
											onChange={(e) =>
												updateTeamTime(
													currentTeam,
													"bonuses",
													e.target.checked ? 1 : 0
												)
											}
											className="rounded border-slate-300"
										/>
										<span className="text-slate-700 font-medium">
											Apply creativity bonus (-15 seconds)
										</span>
									</div>
								</div>
							)}

							{game.id === "office-chair-race" && (
								<div className="bg-red-50 p-4 rounded-xl border border-red-200">
									<h3 className="font-semibold text-slate-900 mb-3">
										Penalties
									</h3>
									<div className="flex items-center space-x-4">
										<Button
											onClick={() =>
												updateTeamTime(
													currentTeam,
													"penalties",
													Math.max(
														0,
														(teamTimes[currentTeam]
															?.penalties || 0) -
															1
													)
												)
											}
											size="sm"
											variant="outline"
											className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-800"
										>
											<Minus className="w-4 h-4" />
										</Button>
										<span className="text-slate-900 font-semibold min-w-[80px] text-center">
											{teamTimes[currentTeam]
												?.penalties || 0}{" "}
											penalties
										</span>
										<Button
											onClick={() =>
												updateTeamTime(
													currentTeam,
													"penalties",
													(teamTimes[currentTeam]
														?.penalties || 0) + 1
												)
											}
											size="sm"
											variant="outline"
											className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-800"
										>
											<Plus className="w-4 h-4" />
										</Button>
									</div>
									<p className="text-red-600 text-sm mt-2 font-medium">
										+5 seconds per penalty
									</p>
								</div>
							)}

							{/* Final Time Display */}
							<div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
								<h3 className="font-semibold text-slate-900 mb-2">
									Final Time
								</h3>
								<div className="text-3xl font-bold text-blue-700">
									{Math.floor(
										calculateFinalTime(
											teamTimes[currentTeam] || {
												minutes: 0,
												seconds: 0,
												completed: false,
											}
										) / 60
									)}
									:
									{(
										calculateFinalTime(
											teamTimes[currentTeam] || {
												minutes: 0,
												seconds: 0,
												completed: false,
											}
										) % 60
									)
										.toString()
										.padStart(2, "0")}
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-4">
								<Button
									onClick={() =>
										handleCompleteTeam(currentTeam)
									}
									disabled={teamTimes[currentTeam]?.completed}
									className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-12"
								>
									{teamTimes[currentTeam]?.completed
										? "Completed"
										: "Complete Team"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Progress and Next */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<Card className="bg-white shadow-lg border border-slate-200">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-semibold text-slate-900">
										Game Progress
									</h3>
									<p className="text-slate-600">
										{
											Object.values(teamTimes).filter(
												(t) => t.completed
											).length
										}{" "}
										of {teams.length} teams completed
									</p>
								</div>
								<Button
									onClick={handleNextGame}
									size="lg"
									className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3"
								>
									{isFinalGame ? "Finish Games" : "Next Game"}
									<ArrowRight className="w-5 h-5 ml-2" />
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}

function HouseOfCardsInput({
	teamName,
	teamTime,
	updateTeamTime,
	completed,
}: {
	teamName: string;
	teamTime: TeamTime;
	updateTeamTime: (
		teamName: string,
		field: keyof TeamTime,
		value: number | boolean
	) => void;
	completed: boolean;
}) {
	// 1st: +60s, 2nd: +75s, 3rd: +90s
	const positionOptions = [
		{ label: "1st Place (+1:00 minute)", value: 1, penalty: 60 },
		{ label: "2nd Place (+1:15 minutes)", value: 2, penalty: 75 },
		{ label: "3rd Place (+1:30 minutes)", value: 3, penalty: 90 },
	];
	const selectedPosition = teamTime.position || null;
	const creativity = teamTime.bonuses === 1;

	const handlePositionChange = (val: number) => {
		updateTeamTime(teamName, "position", val);
	};
	const handleCreativityChange = (checked: boolean) => {
		updateTeamTime(teamName, "bonuses", checked ? 1 : 0);
	};

	return (
		<div className="space-y-6">
			<div>
				<label className="flex items-center gap-2 font-medium text-slate-900">
					<input
						type="checkbox"
						checked={creativity}
						disabled={completed}
						onChange={(e) =>
							handleCreativityChange(e.target.checked)
						}
						className="mr-2"
					/>
					Creativity Bonus (-15 seconds)
				</label>
				<p className="text-slate-600 text-sm ml-6">
					Check if the team built something creative and awesome
				</p>
			</div>
			<div>
				<p className="font-semibold text-slate-900 mb-2">
					Team Position
				</p>
				<div className="flex flex-col gap-2 ml-2">
					{positionOptions.map((opt) => (
						<label
							key={opt.value}
							className="flex items-center gap-2"
						>
							<input
								type="radio"
								name={`position-${teamName}`}
								value={opt.value}
								checked={selectedPosition === opt.value}
								disabled={completed}
								onChange={() => handlePositionChange(opt.value)}
							/>
							{opt.label}
						</label>
					))}
				</div>
				<p className="text-slate-600 text-sm ml-6">
					Position-based time adjustments for competitive scoring
				</p>
			</div>
		</div>
	);
}
