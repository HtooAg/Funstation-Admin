"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield } from "lucide-react";
import Image from "next/image";
import SplashScreen from "@/components/splash-screen";
import TeamSetup from "@/components/team-setup";
import AdminDashboard from "@/components/admin-dashboard";

type AppState =
	| "login"
	| "splash"
	| "team-setup"
	| "admin-dashboard"
	| "marshal-dashboard";
type UserRole = "admin" | "marshal" | null;

export default function HomePage() {
	const [appState, setAppState] = useState<AppState>("login");
	const [userRole, setUserRole] = useState<UserRole>(null);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{
		username?: string;
		password?: string;
	}>({});
	const [teams, setTeams] = useState<string[]>([]);
	const [marshals, setMarshals] = useState<string[]>([]);
	const { toast } = useToast();

	useEffect(() => {
		const token = localStorage.getItem("auth-token");
		const role = localStorage.getItem("user-role") as UserRole;

		if (token && role) {
			setUserRole(role);
			const savedTeams = localStorage.getItem("teams");
			const savedMarshals = localStorage.getItem("marshals");

			if (role === "admin") {
				if (savedTeams && savedMarshals) {
					setTeams(JSON.parse(savedTeams));
					setMarshals(JSON.parse(savedMarshals));
					setAppState("admin-dashboard");
				} else {
					setAppState("team-setup");
				}
			} else {
				setAppState("splash");
			}
		}
	}, []);

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		const newErrors: { username?: string; password?: string } = {};

		if (!username) {
			newErrors.username = "Username is required";
		}

		if (!password) {
			newErrors.password = "Password is required";
		}

		// Admin authentication
		if (username === "ericlalta@fantasia.com" && password === "eric@2025") {
			localStorage.setItem("auth-token", "admin-token-2025");
			localStorage.setItem("user-role", "admin");
			setUserRole("admin");

			toast({
				title: "Login Successful!",
				description: "You're now logged in successfully Eric!",
				duration: 3000,
			});

			setTimeout(() => {
				setAppState("splash");
			}, 1000);
			return;
		}

		// Invalid credentials
		if (username && password) {
			newErrors.username = "Incorrect username";
			newErrors.password = "Incorrect password";
		}

		setErrors(newErrors);
	};

	const handleSplashComplete = () => {
		setAppState("team-setup");
	};

	const handleTeamSetupComplete = (
		teamNames: string[],
		marshalNames: string[]
	) => {
		setTeams(teamNames);
		setMarshals(marshalNames);
		localStorage.setItem("teams", JSON.stringify(teamNames));
		localStorage.setItem("marshals", JSON.stringify(marshalNames));
		setAppState("admin-dashboard");
	};

	if (appState === "login") {
		return (
			<div className="min-h-screen bg-gradient-to-br from-yellow-100 via-slate-100 to-yellow-300 flex items-center justify-center p-4 relative overflow-hidden">
				{/* Animated Background Elements */}
				{[...Array(8)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute rounded-full bg-yellow-200 opacity-40 blur-2xl"
						style={{
							width: `${80 + Math.random() * 120}px`,
							height: `${80 + Math.random() * 120}px`,
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							zIndex: 0,
						}}
						animate={{
							y: [0, Math.random() * 40 - 20, 0],
							x: [0, Math.random() * 40 - 20, 0],
							opacity: [0.3, 0.5, 0.3],
						}}
						transition={{
							duration: 6 + Math.random() * 4,
							repeat: Infinity,
							repeatType: "mirror",
							delay: Math.random() * 2,
						}}
					/>
				))}
				<motion.div
					initial={{ opacity: 0, y: 40, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.7, type: "spring" }}
				>
					<Card className="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/30 shadow-2xl relative z-10 ring-1 ring-white/40 overflow-hidden">
						{/* Glass shine overlay */}
						<div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-br from-white/40 via-white/10 to-white/0" />
						<CardHeader className="text-center space-y-6 pb-8 relative z-10">
							<div className="flex justify-center">
								<div className="relative">
									<Image
										src="/fun-station-logo.png"
										alt="Fun Station Logo"
										width={80}
										height={80}
										className="rounded-2xl shadow-lg"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<CardTitle className="text-2xl font-bold text-slate-900">
									Office Olympic Games
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-8 px-8 pb-8 relative z-10">
							<form onSubmit={handleLogin} className="space-y-6">
								<div className="space-y-2">
									<Label
										htmlFor="username"
										className="text-slate-700 font-medium"
									>
										Username
									</Label>
									<Input
										id="username"
										type="email"
										placeholder="Enter your username"
										value={username}
										onChange={(e) =>
											setUsername(e.target.value)
										}
										className={`h-12 bg-white/20 backdrop-blur-md border border-white/30 focus:border-yellow-400 focus:ring-yellow-300/60 focus:ring-2 shadow-inner text-slate-900 placeholder:text-slate-400 ${
											errors.username
												? "border-red-400"
												: ""
										}`}
									/>
									{errors.username && (
										<p className="text-sm text-red-500">
											{errors.username}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="password"
										className="text-slate-700 font-medium"
									>
										Password
									</Label>
									<div className="relative">
										<Input
											id="password"
											type={
												showPassword
													? "text"
													: "password"
											}
											placeholder="Enter your password"
											value={password}
											onChange={(e) =>
												setPassword(e.target.value)
											}
											className={`h-12 bg-white/20 backdrop-blur-md border border-white/30 focus:border-yellow-400 focus:ring-yellow-300/60 focus:ring-2 shadow-inner text-slate-900 placeholder:text-slate-400 pr-12 ${
												errors.password
													? "border-red-400"
													: ""
											}`}
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
											onClick={() =>
												setShowPassword(!showPassword)
											}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4 text-slate-400" />
											) : (
												<Eye className="h-4 w-4 text-slate-400" />
											)}
										</Button>
									</div>
									{errors.password && (
										<p className="text-sm text-red-500">
											{errors.password}
										</p>
									)}
								</div>
								<Button
									type="submit"
									className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
								>
									<motion.span
										whileTap={{ scale: 0.97 }}
										className="block w-full h-full"
									>
										Login
									</motion.span>
								</Button>
							</form>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		);
	}

	if (appState === "splash") {
		return (
			<SplashScreen
				onComplete={handleSplashComplete}
				userRole={userRole}
			/>
		);
	}

	if (appState === "team-setup") {
		return <TeamSetup onComplete={handleTeamSetupComplete} />;
	}

	if (appState === "admin-dashboard") {
		return <AdminDashboard teams={teams} marshals={marshals} />;
	}

	return null;
}
