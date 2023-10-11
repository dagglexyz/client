import "../styles/navbar.css";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Menu, MenuItem } from "@mui/material";
import { HiOutlineBell, HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { SearchComponent } from "./search/SearchComponent";
import NoProfilePicture from "../assets/default-profile-icon.png";
import { getShortAddress } from "../utils/addressShort";
import { EmbedSDK } from "@pushprotocol/uiembed";

import { ethers } from "ethers";
import { PrimaryGrey } from "../constants";
import { Magic } from "magic-sdk";

const magic = new Magic(process.env.REACT_APP_MAGIC_KEY, {
	network: "goerli",
});

export const Navbar = ({ disableSearch = false }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();
	const username = localStorage.getItem("address");
	const [connectedToSite, setConnectedToSite] = useState(false);
	const [ensName, setEnsName] = useState("");
	const [ensAvatar, setEnsAvatar] = useState("");
	const [input, setInput] = useState("");
	const [logoutLoading, setLogoutLoading] = useState(false);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	async function connectSite() {
		let token = localStorage.getItem("token");
		if (!token || token === "" || token === "undefined") {
			setConnectedToSite(false);
			return navigate("/");
		}
		setConnectedToSite(true);
	}

	async function getEnsName() {
		const provider = new ethers.providers.JsonRpcProvider(
			process.env.REACT_APP_QUICK_NODE
		);
		if (!username.includes("0x")) return;
		const name = await provider.lookupAddress(username);
		console.log({ ENSNAME: name });
		if (!name) return;
		setEnsName(name);
		const resolver = await provider.getResolver(name);
		const avatar = await resolver.getAvatar();
		console.log({ ENSAVATAR: avatar });
		if (!avatar || !avatar.url) return;
		setEnsAvatar(avatar.url);
	}

	useEffect(() => {
		connectSite();
		if (username) {
			getEnsName();
			// 'your connected wallet address'
			EmbedSDK.init({
				headerText: "Notifications", // optional
				targetID: "sdk-trigger-id", // mandatory
				appName: "consumerApp", // mandatory
				user: username, // mandatory
				chainId: 1, // mandatory
				viewOptions: {
					type: "sidebar", // optional [default: 'sidebar', 'modal']
					showUnreadIndicator: true, // optional
					unreadIndicatorColor: "#cc1919",
					unreadIndicatorPosition: "bottom-right",
				},
				theme: "light",
				onOpen: () => {},
				onClose: () => {},
			});
		}

		return () => {
			EmbedSDK.cleanup();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box
			sx={{
				position: "relative",
				width: "100%",
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				borderBottom: "1px solid #f5f5f5",
			}}
		>
			<div className="navbar">
				<div
					style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
				>
					{!disableSearch && (
						<Box mr={2}>
							<SearchComponent
								onSearch={() => {
									console.log(input);
									if (input !== "") {
										navigate(`/jobs?query=${input}`);
									}
								}}
								onChange={(e) => setInput(e.target.value)}
								onEnter={(event) => {
									const value = event.target.value;
									if (event.key === "Enter") {
										if (value === "") {
											navigate(`/jobs`);
										} else navigate(`/jobs?query=${value}`);
									}
								}}
								title="Search jobs by id..."
							/>
						</Box>
					)}
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Box
						mr={3}
						sx={{ display: "flex", position: "relative", cursor: "pointer" }}
						id="sdk-trigger-id"
					>
						<HiOutlineBell size={24} color="#828488" />
						<Box
							sx={{
								position: "absolute",
								color: "red",
								size: "50px",
								top: "-8px",
								right: 0,
							}}
						>
							●
						</Box>
					</Box>
					{!connectedToSite ? (
						<Box onClick={connectSite} className="upload-button">
							Connect Wallet
						</Box>
					) : (
						<Box>
							<Box display="flex" alignItems={"center"}>
								<Box
									sx={{
										backgroundImage: `url("${
											ensAvatar !== "" ? ensAvatar : NoProfilePicture
										}")`,
										backgroundPosition: "center",
										backgroundRepeat: "no-repeat",
										backgroundSize: "cover",
									}}
									className="profile-icon"
									onClick={handleClick}
								></Box>
								<Box sx={{ fontWeight: "bold", ml: "6px" }}>
									{ensName !== "" ? ensName : getShortAddress(username || "")}
								</Box>
							</Box>
							<Menu
								sx={{ top: "4px" }}
								id="basic-menu"
								anchorEl={anchorEl}
								open={open}
								onClose={handleClose}
								MenuListProps={{
									"aria-labelledby": "basic-button",
								}}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
							>
								{/* <MenuItem
									onClick={() => {
										const address = localStorage.getItem("address");
										navigate("/profile/" + address);
										setAnchorEl(null);
									}}
								>
									<MdOutlinePersonOutline color="#828488" size={20} />
									<p
										style={{
											fontSize: "14px",
										}}
									>
										Change Profile
									</p>
								</MenuItem> */}
								<MenuItem
									onClick={async () => {
										try {
											setLogoutLoading(true);
											await magic.user.logout();
											localStorage.clear();
											setLogoutLoading(false);
											window.location.replace("/");
											setAnchorEl(null);
										} catch (error) {
											console.log(error.message);
										}
									}}
								>
									{logoutLoading ? (
										<CircularProgress size={14} sx={{ color: "grey" }} />
									) : (
										<HiOutlineLogout
											color="#828488"
											size={20}
											onClick={async () => {
												try {
													setLogoutLoading(true);
													await magic.user.logout();
													localStorage.clear();
													setLogoutLoading(false);
													window.location.replace("/");
													setAnchorEl(null);
												} catch (error) {
													console.log(error.message);
												}
											}}
										/>
									)}
									&nbsp;
									<p
										style={{
											fontSize: "14px",
										}}
									>
										Logout
									</p>
								</MenuItem>
								<Box
									sx={{
										fontSize: "10px",
										color: PrimaryGrey,
										textAlign: "center",
									}}
								>
									Names and Avatars
									<br /> powered by{" "}
									<span
										style={{ color: "blue", cursor: "pointer" }}
										onClick={() =>
											window.open("https://ens.domains/", "_blank")
										}
									>
										ENS
									</span>
								</Box>
							</Menu>
						</Box>
					)}
				</div>
			</div>
		</Box>
	);
};
