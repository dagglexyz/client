import "../styles/JobComponent.css";
import React, { useEffect, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { IoRefreshOutline } from "react-icons/io5";
import { PrimaryGrey } from "../constants";
import { Box, Collapse, Tooltip } from "@mui/material";
import { getJobEvents } from "../api/bacalhau";
import { AiOutlineDown, AiOutlineRight } from "react-icons/ai";

export const JobExploreComponent = ({ job: jb }) => {
	const [isOpened, setIsOpened] = useState(false);
	const [copyEnabled, setCopyEnabled] = useState(false);
	const [open, setOpen] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [job, setJob] = useState();
	const [events, setEvents] = useState([]);

	function toggleCopy() {
		setCopyEnabled(!copyEnabled);
	}

	async function gJE() {
		if (refreshing) return;
		setRefreshing(true);
		const jobResolved = await getJobEvents(job.job_id);
		if (jobResolved.statusCode === 200) {
			setEvents(jobResolved.data);
		}
		setRefreshing(false);
		setIsOpened(true);
	}

	useEffect(() => {
		if (jb) {
			setJob(jb);
		}
	}, [jb]);

	return !job ? (
		<></>
	) : (
		<Box pb={2} pt={2} sx={{ borderBottom: "1px solid #ededed" }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignContent: "center",
				}}
			>
				<Box
					style={{
						fontWeight: "500",
						color: "rgb(48, 48, 49)",
						display: "flex",
						fontSize: "12px",
						flex: 4,
					}}
					onMouseEnter={toggleCopy}
					onMouseLeave={toggleCopy}
				>
					{job.job_id}
					<Tooltip
						title="Copied!"
						placement="top"
						open={open}
						onClose={() => setOpen(false)}
					>
						<Box
							onClick={() => {
								navigator.clipboard.writeText(job.job_id);
								setOpen(true);
							}}
						>
							<MdContentCopy
								style={{
									color: PrimaryGrey,
									visibility: copyEnabled ? "visible" : "hidden",
									cursor: "pointer",
								}}
								size={16}
							/>
						</Box>
					</Tooltip>
				</Box>
				{/* <Box>09/04/2023 20:29</Box> */}
				<Box
					style={{
						textAlign: "start",
						flex: 1,
						color: "#828488",
						fontSize: "12px",
					}}
				>
					{`${new Date(job.event_time).toLocaleDateString()} ${new Date(
						job.event_time
					).toLocaleTimeString()}`}
				</Box>
				<Box style={{ cursor: "pointer" }}>
					{refreshing ? (
						<Box className={`refresh-icon ${refreshing ? "active" : ""}`}>
							<IoRefreshOutline
								style={{
									color: PrimaryGrey,
									visibility: refreshing
										? "visible"
										: copyEnabled
										? "visible"
										: "hidden",
									cursor: "pointer",
								}}
								size={16}
							/>
						</Box>
					) : isOpened ? (
						<AiOutlineDown
							color={PrimaryGrey}
							onClick={() => setIsOpened(false)}
						/>
					) : (
						<AiOutlineRight color={PrimaryGrey} onClick={gJE} />
					)}
				</Box>
			</Box>
			<Collapse in={isOpened} timeout="auto" unmountOnExit>
				{events.map((j, i) => (
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							fontWeight: "500",
							fontSize: "10px",
							color: "#303031",
						}}
						my={0.5}
						key={i}
					>
						<Box
							sx={{
								flex: 4,
							}}
						>
							{j.event_name}
						</Box>
						<Box
							sx={{
								flex: 1,
							}}
						>
							{new Date(j.createdAt).toDateString()}
						</Box>
						<Box style={{ cursor: "pointer" }}>
							<AiOutlineDown color={"transparent"} onClick={gJE} />
						</Box>
					</Box>
				))}
			</Collapse>
		</Box>
	);
};
