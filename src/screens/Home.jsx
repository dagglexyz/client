import { Box } from "@mui/material";
import React from "react";
import { LeftDrawer } from "../components/LeftDrawer";

export const Home = () => {
	return (
		<Box sx={{ display: "flex" }}>
			<LeftDrawer />
			<Box>Home</Box>
		</Box>
	);
};
