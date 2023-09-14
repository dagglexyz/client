import "../styles/JobComponent.css";
import React, { useEffect, useState } from "react";
import { IoRefreshOutline } from "react-icons/io5";
import { CHAIN, PrimaryGrey } from "../constants";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { getLilypadJob } from "../api/lilypad";

export const LilyJobComponent = ({ job: jb }) => {
	const [copyEnabled, setCopyEnabled] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [job, setJob] = useState();

	function toggleCopy() {
		setCopyEnabled(!copyEnabled);
	}

	async function gJ() {
		try {
			if (refreshing) return;
			setRefreshing(true);
			const jobResolved = await getLilypadJob(job._id);
			if (jobResolved.status === 200) {
				setJob(jobResolved.data);
				toast("Successfully refreshed.", { type: "success" });
			} else {
				throw Error();
			}
			setRefreshing(false);
		} catch (e) {
			toast("Some error occured, try again.", { type: "warning" });
		}
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
				style={{
					fontWeight: "500",
					color: "#303031",
					display: "flex",
				}}
				onMouseEnter={toggleCopy}
				onMouseLeave={toggleCopy}
			>
				{job.job_id}
				{!job.result && (
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
			<td
				onClick={() => {
					if (!job.result) return;
					window.open(`https://ipfs.io/ipfs/${job.result}`, "_blank");
				}}
				style={{ cursor: !job.result ? "default" : "pointer" }}
			>
				{job.result ? "Check Result" : "-"}
			</td>
			<td
				onClick={() => {
					window.open(`${CHAIN.blockExplorerUrls[0]}/tx/${job.tx_hash}`, "_blank");
				}}
				style={{ cursor: "pointer" }}
			>
				View Transaction
			</td>
			<td>{`${new Date(job.createdAt).toLocaleDateString()} ${new Date(
				job.createdAt
			).toLocaleTimeString()}`}</td>
		</tr>
	);
};
