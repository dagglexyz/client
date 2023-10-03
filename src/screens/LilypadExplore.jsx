import { Avatar, Box, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { LeftDrawer } from "../components/LeftDrawer";
import { Navbar } from "../components/Navbar";
import { BiRightArrowAlt } from "react-icons/bi";
import { PrimaryGrey } from "../constants";
import { getTemplates } from "../api/template";

export const LilypadExplore = () => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);

	const gM = async () => {
		const res = await getTemplates();
		console.log(res);

		setData(res);
		setLoading(false);
	};

	useEffect(() => {
		gM();
	}, []);

	return (
		<Box sx={{ display: "flex" }}>
			<LeftDrawer />
			<Box style={{ width: `calc(100vw - 280px)` }}>
				<Navbar />
				<Box sx={{ p: 2 }}>
					<h2>Modules💾</h2>
					<br />
					{loading ? (
						<Box sx={{ pl: 1, flex: 1 }}>
							<Skeleton
								variant="rectangular"
								width={"100%"}
								height={"150px"}
								sx={{ borderRadius: "5px" }}
							/>
							<br />
							<Skeleton
								variant="rectangular"
								width={"100%"}
								height={"150px"}
								sx={{ borderRadius: "5px" }}
							/>
						</Box>
					) : (
						<Box sx={{ pl: 1, flex: 1, ml: 2 }}>
							{data?.length > 0 &&
								data.map((value) => (
									<Box
										key={value._id}
										sx={{
											bgcolor: "rgb(43, 49, 57)",
											width: "100%",
											minHeight: "120px",
											borderRadius: "5px",
											color: "white",
											fontSize: "14px",
											fontWeight: 500,
											display: "flex",
											mb: 1,
											p: 2,
										}}
									>
										{/* image box */}
										<Box
											sx={{
												height: "60px",
												width: "60px",
												m: 1,
												mt: 2,
											}}
										>
											<Avatar
												src={
													value.img ? value.img : "/images/defaultModule.png"
												}
												style={{
													backgroundColor: !value.img ? "white" : "",
													borderRadius: !value.img ? "5pc" : "",
													height: "55px",
													width: "55px",
												}}
											/>
										</Box>
										{/* details box */}
										<Box>
											<Box sx={{ mt: 2, fontWeight: 600, cursor: "pointer" }}>
												{value.name}
											</Box>
											<Box
												sx={{
													mt: 0.5,
													fontWeight: 500,
													color: "#9f9f9f",
													cursor: "pointer",
												}}
											>
												{value.user.displayName}/{value.name}
											</Box>
											<Box
												sx={{
													mt: 0.5,
													mb: value.description ? 2 : 1,
												}}
											>
												{value.description}
											</Box>
											<Box
												sx={{
													fontWeight: 400,
													fontSize: "12px",
													color: "#9f9f9f",
												}}
											>
												Updated {value.updatedAt}
											</Box>

											<Box
												sx={{
													mt: 2,
												}}
											>
												{/* {[1, 2, 3, 4].map((t) => (
									<Chip
										label={`Tag ${t}`}
										sx={{ borderRadius: "4px", height: "24px", ml: 0.6 }}
									/>
								))} */}
											</Box>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													"&:hover": {
														color: PrimaryGrey,
													},
													cursor: "pointer",
												}}
												onClick={() => {}}
											>
												<Box mr={0.5}>
													<p>clone</p>
												</Box>
												<BiRightArrowAlt />
											</Box>
										</Box>
									</Box>
								))}
						</Box>
					)}{" "}
				</Box>
			</Box>
		</Box>
	);
};
