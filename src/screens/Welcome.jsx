import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import LoginImage from "../assets/loginpage.png";
import BacalhauLogo from "../assets/bacalhaulogo.png";
import MagicLogo from "../assets/magiclogo.png";
import { useNavigate } from "react-router-dom";
import { connectWalletToSite, getWalletAddress } from "../utils/wallet";
import { createUser, magicLogin } from "../api/user";
import { BlueButton } from "../components/BlueButton";
import { PrimaryGrey } from "../constants";
import { toast } from "react-toastify";
import { Magic } from "magic-sdk";

const magic = new Magic(process.env.REACT_APP_MAGIC_KEY, {
	network: "goerli",
});

export const Welcome = () => {
	const navigate = useNavigate();
	// const [isLogin, setIsLogin] = useState(true);
	// const [loading, setLoading] = useState(false);
	// const [username, setUsername] = useState();
	// const [password, setPassword] = useState();
	const [magicLoading, setMagicLoading] = useState(false);

	async function connectSite() {
		let token = localStorage.getItem("token");
		await connectWalletToSite();
		if (token && token !== "" && token !== "undefined") {
			return navigate("/home");
		}
		const address = await getWalletAddress();
		if (address && address !== "") {
			localStorage.setItem("address", address);
			if (!token || token === "" || token === "undefined") {
				await createUser(address);
			}
			token = localStorage.getItem("token");
			if (token && token !== "" && token !== "undefined") {
				navigate("/home");
			}
		}
	}

	// async function signup() {
	// 	if (!validate()) return;
	// 	setLoading(true);
	// 	await signUpUser(username, password);
	// 	let token = localStorage.getItem("token");
	// 	if (token && token !== "" && token !== "undefined") {
	// 		navigate("/home");
	// 	}
	// 	setLoading(false);
	// }

	// async function login() {
	// 	if (!validate()) return;
	// 	setLoading(true);
	// 	await loginUser(username, password);
	// 	let token = localStorage.getItem("token");
	// 	if (token && token !== "" && token !== "undefined") {
	// 		navigate("/home");
	// 	}
	// 	setLoading(false);
	// }

	// function validate() {
	// 	if (!password || !username) {
	// 		toast("Please fill all the fields.", {
	// 			type: "warning",
	// 		});
	// 		return false;
	// 	}
	// 	if (password.length < 6) {
	// 		toast("Password should be greater than 6 characters", {
	// 			type: "warning",
	// 		});
	// 		return false;
	// 	}
	// 	if (username.length < 6) {
	// 		toast("Username should be greater than 6 characters", {
	// 			type: "warning",
	// 		});
	// 		return false;
	// 	}
	// 	return true;
	// }

	async function mL() {
		try {
			setMagicLoading(true);
			const accounts = await magic.wallet.connectWithUI();
			await magicLogin(accounts[0]);
			setMagicLoading(false);
			let token = localStorage.getItem("token");
			if (token && token !== "" && token !== "undefined") {
				localStorage.setItem("address", accounts[0]);
				navigate("/home");
			}
		} catch (error) {
			toast(error.message, {
				type: "warning",
			});
		}
	}

	useEffect(() => {
		connectSite();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box
			display={"flex"}
			height="100vh"
			position={"relative"}
			zIndex={magicLoading ? -1 : 1}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					height: "100%",
					flex: 1,
				}}
			>
				<Box textAlign={"center"}>
					<Box
						fontFamily={"'Alata', sans-serif"}
						fontSize={"30px"}
						sx={{ display: "flex", flexDirection: "column", color: "#4954fd" }}
					>
						<Box
							sx={{
								backgroundImage: `url("${BacalhauLogo}")`,
								backgroundPosition: "center",
								backgroundSize: "contain",
								backgroundRepeat: "no-repeat",
								height: "45px",
							}}
						></Box>
						Daggle
					</Box>
					<br />
					<h1>Log in to your account.</h1>
					<p style={{ color: PrimaryGrey }}>
						Hello power user, please connect your wallet or signin.
					</p>
					<br />
					<br />
					{/* Magic Component */}
					<Box mb={2}>
						<BlueButton
							title={"Connect your wallet"}
							onClick={connectSite}
							style={{
								backgroundColor: "transparent",
								color: "black",
								border: "1px solid grey",
							}}
						/>
					</Box>
					<Box mb={1}>
						<BlueButton
							onClick={mL}
							title={"Signin using email"}
							loading={magicLoading}
							style={{
								background: "linear-gradient(45deg, #0049ff, #33ccff)",
								color: "white",
							}}
						/>
					</Box>
					<Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
						<Box
							mr={0.5}
							sx={{ cursor: "pointer" }}
							onClick={() => window.open("https://magic.link/", "_blank")}
						>
							<h6 style={{ color: PrimaryGrey }}>Powered by </h6>
						</Box>
						<img
							style={{ cursor: "pointer" }}
							src={MagicLogo}
							alt="magic logo"
							height={"20px"}
							onClick={() => window.open("https://magic.link/", "_blank")}
						/>
						<Box
							ml={0.5}
							sx={{ cursor: "pointer" }}
							onClick={() => window.open("https://magic.link/", "_blank")}
						>
							<h6 style={{ color: PrimaryGrey }}>Magic</h6>
						</Box>
					</Box>
					{/* Email Component */}
					{/* <Box>
						<TextField
							placeholder="Enter username"
							size="small"
							onChange={(e) => {
								setUsername(e.target.value);
							}}
							sx={{
								width: "100%",
								mt: 2,
							}}
							InputProps={{
								style: {
									border: "1px solid white",
								},
							}}
						/>
						<TextField
							placeholder="Enter password"
							size="small"
							type="password"
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							sx={{
								width: "100%",
								mt: 1,
							}}
							InputProps={{
								style: {
									border: "1px solid white",
								},
							}}
						/>
						<br />
						<br />
						<Box
							sx={{ color: "#4954FD", textAlign: "left", cursor: "pointer" }}
							onClick={() => setIsLogin(!isLogin)}
						>
							{isLogin ? "Signup" : "Login"} instead?
						</Box>
						<br />
						<BlueButton
							title={isLogin ? "Login" : "Signup"}
							onClick={isLogin ? login : signup}
							loading={loading}
						/>
					</Box> */}
				</Box>
			</Box>
			<Box
				sx={{
					backgroundImage: `url("${LoginImage}")`,
					backgroundPosition: "center",
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
					height: "100%",
					width: "100%",
					flex: 1,
				}}
			></Box>
		</Box>
	);
};
