import "../styles/JobComponent.css";
import React, { useEffect, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { IoRefreshOutline } from "react-icons/io5";
import { PrimaryGrey, SERVER_URL_X } from "../constants";
import { Box, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { getJob } from "../api/bacalhau";
import { downloadJobResult } from "../api/saturn";

export const JobComponent = ({ job: jb }) => {
	const [copyEnabled, setCopyEnabled] = useState(false);
	const [open, setOpen] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [job, setJob] = useState();

	function toggleCopy() {
		setCopyEnabled(!copyEnabled);
	}

	async function gJ() {
		if (refreshing) return;
		setRefreshing(true);
		const jobResolved = await getJob(job._id);
		if (jobResolved.statusCode === 200) {
			console.log(job);
			setJob(jobResolved.data);
			toast("Successfully refreshed.", { type: "success" });
		} else {
			toast("Some error occured, try again.", { type: "warning" });
		}

		setRefreshing(false);
	}

	useEffect(() => {
		if (jb) {
			setJob(jb);
		}
	}, [jb]);

	return !job ? (
		<></>
	) : (
		<tr>
			<td
				style={{ fontWeight: "500", color: "#303031", display: "flex" }}
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
				{job.status !== "Completed" && (
					<Box
						onClick={gJ}
						className={`refresh-icon ${refreshing ? "active" : ""}`}
					>
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
				)}
			</td>
			<td>{job.type}</td>
			<td>{job.status}</td>
			<td
				onClick={() => {
					window.open(`https://ipfs.io/ipfs/${job.result}`, "_blank");
				}}
				style={{ cursor: "pointer" }}
			>
				{job.status === "Completed" ? "Check Result" : "-"}
			</td>
			<td
				onClick={() => downloadJobResult(job.result)}
				style={{ cursor: "pointer" }}
			>
				{job.status === "Completed" ? (
					<a
						style={{ textDecoration: "none", color: "#828488" }}
						href={SERVER_URL_X + "/saturn/" + job.result}
					>
						Download Result
					</a>
				) : (
					"-"
				)}
			</td>
			{/* <td>09/04/2023 20:29</td> */}
			<td>{new Date(job.createdAt).toDateString()}</td>
		</tr>
	);
};
