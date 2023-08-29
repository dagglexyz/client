import { Box } from "@mui/material";
import React from "react";
import { LeftDrawer } from "../components/LeftDrawer";
import { Navbar } from "../components/Navbar";

export const Docker = () => {
	return (
		<Box sx={{ display: "flex" }}>
			<LeftDrawer />
			<Box style={{ width: `calc(100vw - 280px)` }}>
				<Navbar />
				<Box sx={{ p: 2 }}>
					<h2>Screen Title</h2>
					<br />
				</Box>
			</Box>
		</Box>
	);
};
