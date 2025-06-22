"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Users,
	UserCheck,
	Trophy,
	Play,
	BarChart3,
	LogOut,
	Crown,
	Target,
	Clock,
	Zap,
	AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import GameInterface from "@/components/game-interface";
import NewYearAnimation from "@/components/new-year-animation";
import ResultsScreen from "@/components/results-screen";
import { useWebSocket } from "@/hooks/use-websocket";
import GameResultsViewer from "@/components/game-results-viewer";

interface AdminDashboardProps {
	teams: string[];
	marshals: string[];
}

const games = [
	{
		id: "house-of-cards",
		name: "House of Cards",
		icon: <Crown className="w-6 h-6" />,
		description:
			"Build the tallest card tower - Score based on size + creativity bonus (-15 seconds)",
		maxTime: 10,
	},
	{
		id: "office-chair-race",
		name: "Office Chair Race",
		icon: <Zap className="w-6 h-6" />,
		description:
			"Speed racing on office chairs - Penalties: +5 seconds per mishap",
		maxTime: 10,
	},
	{
		id: "around-the-clock",
		name: "Around the Clock",
		icon: <Clock className="w-6 h-6" />,
		description: "Time-based precision challenge",
		maxTime: 10,
	},
	{
		id: "pass-the-spud",
		name: "Pass the Spud",
		icon: <Target className="w-6 h-6" />,
		description: "Team coordination game",
		maxTime: 10,
	},
	{
		id: "drop-the-ball",
		name: "Skin the snake",
		icon: <Trophy className="w-6 h-6" />,
		description: "Precision dropping challenge - FINAL GAME",
		maxTime: 10,
	},
];

export default function AdminDashboard({
	teams,
	marshals,
}: AdminDashboardProps) {
	const [currentView, setCurrentView] = useState<
		"dashboard" | "game" | "animation" | "results"
	>("dashboard");
	const [selectedGame, setSelectedGame] = useState<string | null>(null);
	const [currentGameIndex, setCurrentGameIndex] = useState(0);
	const [showRules, setShowRules] = useState(false);
	const { toast } = useToast();
	const { sendMessage } = useWebSocket();
	const [viewingGameResults, setViewingGameResults] = useState<string | null>(
		null
	);
	const [completedGames, setCompletedGames] = useState<string[]>([]);

	useEffect(() => {
		const checkCompletedGames = () => {
			const gameData = JSON.parse(
				localStorage.getItem("gameData") || "[]"
			);
			const completed = gameData.map((game: any) => game.id);
			setCompletedGames(completed);
		};

		checkCompletedGames();
		const interval = setInterval(checkCompletedGames, 1000);
		return () => clearInterval(interval);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("auth-token");
		localStorage.removeItem("user-role");
		localStorage.removeItem("teams");
		localStorage.removeItem("marshals");
		window.location.reload();
	};

	const handleStartGames = () => {
		console.log("handleStartGames: Starting games - showing rules");
		setShowRules(true);
	};

	const handleRulesAccepted = () => {
		console.log("handleRulesAccepted: Rules accepted");

		// Clear data
		localStorage.removeItem("gameData");
		localStorage.removeItem("gameCompleted");
		setCompletedGames([]);
		setCurrentGameIndex(0);
		setSelectedGame(null);
		setShowRules(false);

		console.log("handleRulesAccepted: Data cleared, starting animation");

		// Go directly to animation
		setCurrentView("animation");
	};

	const handleAnimationComplete = () => {
		console.log(
			"handleAnimationComplete: Animation completed, setting up first game"
		);

		// Set up first game immediately
		const firstGame = games[0];
		setCurrentGameIndex(0);
		setSelectedGame(firstGame.id);

		// Use setTimeout to ensure state updates are processed
		setTimeout(() => {
			setCurrentView("game");
			console.log(`handleAnimationComplete: Starting ${firstGame.name}`);

			toast({
				title: "Games Started!",
				description: `Starting ${firstGame.name} - Game 1 of ${games.length}`,
			});
		}, 100);
	};

	const handleGameComplete = () => {
		const currentGame = games[currentGameIndex];
		console.log(
			`handleGameComplete: Game ${currentGameIndex + 1} completed: ${
				currentGame.name
			}`
		);

		// Send WebSocket notification
		sendMessage("GAME_COMPLETED", {
			gameId: currentGame.id,
			gameName: currentGame.name,
			gameIndex: currentGameIndex + 1,
			totalGames: games.length,
		});

		// Store completion data
		localStorage.setItem(
			"gameCompleted",
			JSON.stringify({
				gameId: currentGame.id,
				gameName: currentGame.name,
				timestamp: Date.now(),
			})
		);

		// Check if this was the last game (5th game)
		if (currentGameIndex === games.length - 1) {
			console.log(
				"handleGameComplete: All games completed - showing results"
			);
			toast({
				title: "All Games Completed!",
				description: "Competition finished! Viewing final results.",
			});
			setCurrentView("results");
		} else {
			// Move to next game
			const nextGameIndex = currentGameIndex + 1;
			const nextGame = games[nextGameIndex];
			console.log(
				`handleGameComplete: Moving to ${nextGame.name} (Game ${
					nextGameIndex + 1
				})`
			);

			setCurrentGameIndex(nextGameIndex);
			setSelectedGame(nextGame.id);

			toast({
				title: "Next Game!",
				description: `Starting ${nextGame.name} - Game ${
					nextGameIndex + 1
				} of ${games.length}`,
			});
		}
	};

	const handleViewGameResults = (gameId: string) => {
		setViewingGameResults(gameId);
	};

	const handlePreviousGameResult = () => {
		if (!viewingGameResults) return;
		const currentIndex = games.findIndex(
			(g) => g.id === viewingGameResults
		);
		if (currentIndex > 0) {
			const previousGame = games[currentIndex - 1];
			if (completedGames.includes(previousGame.id)) {
				setViewingGameResults(previousGame.id);
			}
		}
	};

	const handleNextGameResult = () => {
		if (!viewingGameResults) return;
		const currentIndex = games.findIndex(
			(g) => g.id === viewingGameResults
		);
		if (currentIndex < games.length - 1) {
			const nextGame = games[currentIndex + 1];
			if (completedGames.includes(nextGame.id)) {
				setViewingGameResults(nextGame.id);
				toast({
					title: "Viewing Next Game Results",
					description: `Now viewing results for ${
						nextGame.name
					} (Game ${currentIndex + 2} of ${games.length})`,
				});
			}
		}
	};

	// Debug logging
	console.log("AdminDashboard render:", {
		currentView,
		selectedGame,
		currentGameIndex,
		showRules,
		completedGames: completedGames.length,
	});

	// Render animation
	if (currentView === "animation") {
		console.log("AdminDashboard: Rendering animation");
		return (
			<NewYearAnimation
				onComplete={handleAnimationComplete}
				showSkipButton={true}
				autoSkip={true}
				autoSkipDelay={5000}
			/>
		);
	}

	// Render results
	if (currentView === "results") {
		console.log("AdminDashboard: Rendering results");
		return (
			<ResultsScreen
				teams={teams}
				onBack={() => setCurrentView("dashboard")}
			/>
		);
	}

	// Render game
	if (currentView === "game" && selectedGame) {
		const game = games.find((g) => g.id === selectedGame);
		console.log(
			"AdminDashboard: Rendering game interface for:",
			game?.name
		);

		if (!game) {
			console.error("AdminDashboard: Game not found:", selectedGame);
			setCurrentView("dashboard");
			return null;
		}

		return (
			<GameInterface
				game={game}
				teams={teams}
				gameIndex={currentGameIndex}
				totalGames={games.length}
				onComplete={handleGameComplete}
				onBack={() => setCurrentView("dashboard")}
			/>
		);
	}

	// Render game results viewer
	if (viewingGameResults) {
		const game = games.find((g) => g.id === viewingGameResults);
		const currentIndex = games.findIndex(
			(g) => g.id === viewingGameResults
		);

		return (
			<GameResultsViewer
				gameId={viewingGameResults}
				gameName={game?.name || ""}
				teams={teams}
				onBack={() => setViewingGameResults(null)}
				onPrevious={handlePreviousGameResult}
				onNext={handleNextGameResult}
				canGoPrevious={
					currentIndex > 0 &&
					completedGames.includes(games[currentIndex - 1]?.id)
				}
				canGoNext={
					currentIndex < games.length - 1 &&
					completedGames.includes(games[currentIndex + 1]?.id)
				}
			/>
		);
	}

	// Render main dashboard
	console.log("AdminDashboard: Rendering main dashboard");
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			{/* Rules Modal */}
			<AnimatePresence>
				{showRules && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-200"
						>
							<div className="text-center mb-8">
								<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<AlertTriangle className="w-8 h-8 text-yellow-600" />
								</div>
								<h2 className="text-3xl font-bold text-slate-900 mb-2">
									Office Olympics Rules
								</h2>
								<p className="text-slate-600">
									Please read carefully before starting the
									competition
								</p>
							</div>

							<div className="space-y-6 text-slate-700">
								<div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
									<h3 className="font-bold text-lg mb-3 flex items-center">
										<Clock className="w-5 h-5 mr-2 text-slate-600" />
										Time Limit
									</h3>
									<p className="font-medium">
										Each game must be completed within{" "}
										<strong className="text-slate-900">
											10 minutes maximum
										</strong>
									</p>
								</div>

								<div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
									<h3 className="font-bold text-lg mb-3 flex items-center">
										<Trophy className="w-5 h-5 mr-2 text-slate-600" />
										Winning Criteria
									</h3>
									<p className="font-medium">
										The team with the{" "}
										<strong className="text-slate-900">
											lowest total time
										</strong>{" "}
										across all 5 games wins!
									</p>
								</div>

								<div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
									<h3 className="font-bold text-lg mb-3 flex items-center">
										<Play className="w-5 h-5 mr-2 text-slate-600" />
										Game Sequence
									</h3>
									<ol className="list-decimal list-inside space-y-2 font-medium">
										<li>
											House of Cards (Score + creativity
											bonus = -15 seconds)
										</li>
										<li>
											Office Chair Race (Penalties: +5
											seconds per mishap)
										</li>
										<li>Around the Clock</li>
										<li>Pass the Spud</li>
										<li>Skin the snake (FINAL GAME)</li>
									</ol>
								</div>
							</div>

							<div className="flex gap-4 mt-8">
								<Button
									onClick={() => {
										console.log(
											"Rules modal: Cancel clicked"
										);
										setShowRules(false);
									}}
									variant="outline"
									className="flex-1 h-12 border-slate-300 text-slate-700 hover:bg-slate-50"
								>
									Cancel
								</Button>
								<Button
									onClick={() => {
										console.log(
											"Rules modal: Start Games clicked"
										);
										handleRulesAccepted();
									}}
									className="flex-1 h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
								>
									Start Games!
								</Button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

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
								width={50}
								height={50}
								className="rounded-xl"
							/>
						</div>
						<div>
							<h1 className="text-2xl font-bold text-slate-900">
								Office Olympics
							</h1>
							<p className="text-slate-600 font-medium">
								Admin Control Panel
							</p>
						</div>
					</div>
					<Button
						onClick={handleLogout}
						variant="outline"
						className="border-slate-300 text-slate-700 hover:bg-slate-50"
					>
						<LogOut className="w-4 h-4 mr-2" />
						Logout
					</Button>
				</div>
			</motion.header>

			<div className="max-w-7xl mx-auto p-6 space-y-8">
				{/* Stats Cards */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="grid grid-cols-1 md:grid-cols-3 gap-6"
				>
					<Card className="bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-semibold text-slate-600">
								Total Teams
							</CardTitle>
							<div className="p-2 bg-blue-50 rounded-lg">
								<Users className="h-4 w-4 text-blue-600" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-slate-900">
								{teams.length}
							</div>
							<p className="text-xs text-slate-500 mt-1">
								Ready to compete
							</p>
						</CardContent>
					</Card>

					<Card className="bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-semibold text-slate-600">
								Marshals
							</CardTitle>
							<div className="p-2 bg-green-50 rounded-lg">
								<UserCheck className="h-4 w-4 text-green-600" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-slate-900">
								{marshals.length}
							</div>
							<p className="text-xs text-slate-500 mt-1">
								Game supervisors
							</p>
						</CardContent>
					</Card>

					<Card className="bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-semibold text-slate-600">
								Games Available
							</CardTitle>
							<div className="p-2 bg-purple-50 rounded-lg">
								<Trophy className="h-4 w-4 text-purple-600" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-slate-900">
								{games.length}
							</div>
							<p className="text-xs text-slate-500 mt-1">
								Olympic events
							</p>
						</CardContent>
					</Card>
				</motion.div>

				{/* Main Content */}
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border border-slate-200">
						<TabsTrigger
							value="overview"
							className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 font-medium"
						>
							<BarChart3 className="w-4 h-4 mr-2" />
							Overview
						</TabsTrigger>
						<TabsTrigger
							value="teams"
							className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 font-medium"
						>
							<Users className="w-4 h-4 mr-2" />
							Teams
						</TabsTrigger>
						<TabsTrigger
							value="marshals"
							className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 font-medium"
						>
							<Users className="w-4 h-4 mr-2" />
							Marshals
						</TabsTrigger>
						<TabsTrigger
							value="games"
							className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 font-medium"
						>
							<Play className="w-4 h-4 mr-2" />
							Games
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<Card className="bg-white shadow-lg border border-slate-200">
								<CardHeader>
									<CardTitle className="text-slate-900 font-bold text-xl">
										Games Overview
									</CardTitle>
									<CardDescription className="text-slate-600">
										All 5 Olympic games for your teams
									</CardDescription>
								</CardHeader>
								<CardContent className="p-6">
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
										{games.map((game, index) => {
											const isCompleted =
												completedGames.includes(
													game.id
												);
											return (
												<motion.div
													key={game.id}
													initial={{
														opacity: 0,
														y: 20,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													transition={{
														delay: index * 0.1,
													}}
													whileHover={{ scale: 1.02 }}
													className={`p-6 rounded-xl border cursor-pointer transition-all ${
														isCompleted
															? "bg-green-50 border-green-200 hover:shadow-md"
															: "bg-slate-50 border-slate-200 hover:shadow-md"
													}`}
													onClick={() =>
														isCompleted &&
														handleViewGameResults(
															game.id
														)
													}
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-3 flex-1">
															<div className="p-2 bg-white rounded-lg shadow-sm">
																{game.icon}
															</div>
															<div>
																<h3 className="font-semibold text-slate-900">
																	{game.name}
																</h3>
																<p className="text-slate-600 text-sm mb-2">
																	{
																		game.description
																	}
																</p>
																<p className="text-slate-500 text-xs font-medium">
																	Game{" "}
																	{index + 1}{" "}
																	of{" "}
																	{
																		games.length
																	}
																</p>
															</div>
														</div>
														{isCompleted && (
															<Badge className="bg-green-100 text-green-700 border-green-200 ml-2">
																Completed -
																Click to View
															</Badge>
														)}
													</div>
												</motion.div>
											);
										})}
									</div>

									<div className="text-center">
										<Button
											onClick={() => {
												console.log(
													"Start Olympic Games button clicked"
												);
												handleStartGames();
											}}
											size="lg"
											className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
										>
											<Play className="w-5 h-5 mr-2" />
											Start Olympic Games!
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</TabsContent>

					<TabsContent value="teams" className="space-y-6">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<Card className="bg-white shadow-lg border border-slate-200">
								<CardHeader>
									<CardTitle className="text-slate-900 flex items-center font-bold text-xl">
										<Users className="w-5 h-5 mr-2" />
										Competing Teams
									</CardTitle>
									<CardDescription className="text-slate-600">
										All teams registered for the Office
										Olympics
									</CardDescription>
								</CardHeader>
								<CardContent className="p-6">
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										<AnimatePresence>
											{teams.map((team, index) => (
												<motion.div
													key={team}
													initial={{
														opacity: 0,
														x: -20,
													}}
													animate={{
														opacity: 1,
														x: 0,
													}}
													transition={{
														delay: index * 0.1,
													}}
													whileHover={{ scale: 1.02 }}
												>
													<Card className="bg-slate-50 border border-slate-200 hover:shadow-md transition-all">
														<CardContent className="p-4">
															<div className="flex items-center justify-between">
																<div>
																	<h3 className="font-semibold text-slate-900">
																		{team}
																	</h3>
																	<p className="text-slate-500 text-sm">
																		Team #
																		{index +
																			1}
																	</p>
																</div>
																<Badge className="bg-green-100 text-green-700 border-green-200">
																	Active
																</Badge>
															</div>
														</CardContent>
													</Card>
												</motion.div>
											))}
										</AnimatePresence>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</TabsContent>

					<TabsContent value="marshals" className="space-y-6">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<Card className="bg-white shadow-lg border border-slate-200">
								<CardHeader>
									<CardTitle className="text-slate-900 flex items-center font-bold text-xl">
										<UserCheck className="w-5 h-5 mr-2" />
										Game Marshals
									</CardTitle>
									<CardDescription className="text-slate-600">
										Officials overseeing the Olympic games
									</CardDescription>
								</CardHeader>
								<CardContent className="p-6">
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										<AnimatePresence>
											{marshals.map((marshal, index) => (
												<motion.div
													key={marshal}
													initial={{
														opacity: 0,
														x: -20,
													}}
													animate={{
														opacity: 1,
														x: 0,
													}}
													transition={{
														delay: index * 0.1,
													}}
													whileHover={{ scale: 1.02 }}
												>
													<Card className="bg-slate-50 border border-slate-200 hover:shadow-md transition-all">
														<CardContent className="p-4">
															<div className="flex items-center justify-between">
																<div>
																	<h3 className="font-semibold text-slate-900">
																		{
																			marshal
																		}
																	</h3>
																	<p className="text-slate-500 text-sm">
																		Marshal
																		#
																		{index +
																			1}
																	</p>
																</div>
																<Badge className="bg-blue-100 text-blue-700 border-blue-200">
																	Official
																</Badge>
															</div>
														</CardContent>
													</Card>
												</motion.div>
											))}
										</AnimatePresence>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</TabsContent>

					<TabsContent value="games" className="space-y-6">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<Card className="bg-white shadow-lg border border-slate-200">
								<CardHeader>
									<CardTitle className="text-slate-900 flex items-center font-bold text-xl">
										<Play className="w-5 h-5 mr-2" />
										Olympic Games
									</CardTitle>
									<CardDescription className="text-slate-600">
										5 games to complete the competition
									</CardDescription>
								</CardHeader>
								<CardContent className="p-6">
									<div className="space-y-4">
										{games.map((game, index) => (
											<motion.div
												key={game.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													delay: index * 0.1,
												}}
											>
												<Card className="bg-slate-50 border border-slate-200 hover:shadow-md transition-all">
													<CardContent className="p-6">
														<div className="flex items-center justify-between">
															<div className="flex items-center space-x-4">
																<div className="p-3 bg-white rounded-xl shadow-sm">
																	{game.icon}
																</div>
																<div>
																	<h3 className="text-xl font-semibold text-slate-900">
																		{
																			game.name
																		}
																	</h3>
																	<p className="text-slate-600">
																		{
																			game.description
																		}
																	</p>
																	<p className="text-slate-500 text-sm mt-1">
																		Game{" "}
																		{index +
																			1}{" "}
																		of{" "}
																		{
																			games.length
																		}
																	</p>
																</div>
															</div>
														</div>
													</CardContent>
												</Card>
											</motion.div>
										))}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
