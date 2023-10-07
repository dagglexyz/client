import { Avatar, Box, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { LeftDrawer } from "../components/LeftDrawer";
import { Navbar } from "../components/Navbar";
import { BiRightArrowAlt } from "react-icons/bi";
import { PrimaryGrey } from "../constants";
import { cloneTemplate, searchTemplates } from "../api/template";
import { toast } from "react-toastify";
import ModulesImage from "../assets/modules.png";
import { SearchComponent } from "../components/search/SearchComponent";

export const Modules = () => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);

	const gM = async (name) => {
		setLoading(true);
		const res = await searchTemplates(name);

		setData(res);
		setLoading(false);
	};

	async function clone(id) {
		const name = prompt("Enter module name");
		if (!name || name === "") return;
		const res = await cloneTemplate({
			name,
			id,
		});
		if (res) {
			toast("Clone created", { type: "success" });
		} else {
			toast("Clone failed", { type: "error" });
		}
		gM();
	}

	useEffect(() => {
		gM("");
	}, []);

	return (
		<Box sx={{ display: "flex" }}>
			<LeftDrawer />
			<Box style={{ width: `calc(100vw - 280px)` }}>
				<Navbar />
				<Box sx={{ p: 2 }}>
					<h2>Modules💾</h2>
					<br />
					<Box maxWidth={"min-content"} mb={2}>
						<SearchComponent onChange={(e) => gM(e.target.value)} />
					</Box>
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
						<Box sx={{ flex: 1 }}>
							{data?.length > 0 &&
								data.map((t) => (
									<Box
										key={t._id}
										sx={{
											bgcolor: "rgb(221 221 221)",
											width: "100%",
											minHeight: "120px",
											borderRadius: "5px",
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
												src={t.img ? t.img : ModulesImage}
												style={{
													backgroundColor: !t.img ? "white" : "",
													borderRadius: !t.img ? "5pc" : "",
													height: "55px",
													width: "55px",
												}}
											/>
										</Box>
										{/* details box */}
										<Box>
											<Box sx={{ mt: 2, fontWeight: 600, cursor: "pointer" }}>
												{t.name}
											</Box>
											<Box
												sx={{
													mt: 0.5,
													fontWeight: 500,
													cursor: "pointer",
												}}
											>
												{t.user.displayName}/{t.name}
											</Box>
											<Box
												sx={{
													mt: 0.5,
													mb: t.description ? 2 : 1,
												}}
											>
												{t.description}
											</Box>
											<Box
												sx={{
													fontWeight: 400,
													fontSize: "12px",
												}}
											>
												Updated {t.updatedAt}
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
												onClick={() => clone(t._id)}
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
