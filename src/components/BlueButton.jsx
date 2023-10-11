import { Box, CircularProgress } from "@mui/material";
import React from "react";

export const BlueButton = ({ onClick, title, loading, style }) => {
	return (
		<Box
			onClick={onClick}
			sx={{
				backgroundColor: "#4954FD",
				color: "white",
				padding: "8px 16px",
				borderRadius: "4px",
				fontWeight: "600",
				marginRIght: "32px",
				cursor: "pointer",
				minWidth: "100px",
				textAlign: "center",
				...style,
			}}
		>
			{loading ? <CircularProgress size={14} sx={{ color: "white" }} /> : title}
		</Box>
	);
};
