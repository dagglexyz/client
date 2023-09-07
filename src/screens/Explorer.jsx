import { Box, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { LeftDrawer } from "../components/LeftDrawer";
import { Navbar } from "../components/Navbar";
import { getJobs } from "../api/bacalhau";
import { useLocation } from "react-router-dom";
import { JobExploreComponent } from "../components/JobExploreComponent";
import { SearchComponent } from "../components/search/SearchComponent";

export const Explorer = () => {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const search = useLocation().search;
	const query = new URLSearchParams(search).get("query");
	const [input, setInput] = useState("");

	async function gJ(query) {
		setLoading(true);
		const resolved = await getJobs(query, true);
		if (resolved.statusCode === 200) {
			setJobs(resolved.data);
		}
		setLoading(false);
	}

	useEffect(() => {
		gJ(query);
	}, [query]);

	return (
		<Box sx={{ display: "flex" }}>
			<LeftDrawer />
			<Box style={{ width: `calc(100vw - 280px)` }}>
				<Navbar />
				<Box sx={{ p: 2 }}>
					<h2>Explorer 🧭</h2>
					<br />
					<Box sx={{ width: "fit-content" }}>
						<SearchComponent
							title="Search by job/client ID"
							onChange={(e) => setInput(e.target.value)}
							onSearch={() => {
								if (input !== "") {
									gJ(input);
								}
							}}
							onEnter={(event) => {
								const value = event.target.value;
								if (event.key === "Enter") {
									if (value !== "") gJ(value);
								}
							}}
						/>
					</Box>
					<br />
					{loading ? (
						<Box>
							{Array.from({ length: 10 }).map((_, i) => (
								<Skeleton
									variant="rectangular"
									sx={{ my: 1 }}
									height={"75px"}
									key={i}
								/>
							))}
						</Box>
					) : (
						<Box>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignContent: "center",
									borderBottom: "1px solid #ededed",
								}}
								pb={2}
							>
								<Box
									style={{
										fontWeight: "500",
										color: "#828488",
										display: "flex",
										flex: 4,
										fontSize: "12px",
									}}
								>
									<p>Id</p>
								</Box>
								<Box
									style={{
										textAlign: "start",
										flex: 1,
										fontSize: "12px",
										color: "#828488",
									}}
								>
									<p>Created</p>
								</Box>
							</Box>
							<Box>
								{jobs.map((j, i) => (
									<JobExploreComponent job={j.job} key={i} />
								))}
							</Box>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};
