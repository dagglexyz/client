import "../styles/Docker.css";
import {
	Avatar,
	Box,
	IconButton,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Skeleton,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { LeftDrawer } from "../components/LeftDrawer";
import { Navbar } from "../components/Navbar";
import { MdAddCircleOutline } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BlueButton } from "../components/BlueButton";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import LilypadInterface from "../contracts/Lilypad.json";
import { getWalletAddress } from "../utils/wallet";
import { createLilypadJob, getLilypadJobs } from "../api/lilypad";
import { AiFillDelete, AiFillFolder } from "react-icons/ai";
import { LilyJobComponent } from "../components/LilyJobComponent";
const {
	Spec,
	JobSpecDocker,
	PublisherSpec,
} = require("@daggle/bacalhau-js/models");

export const Lilypad = () => {
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState("");
	const [workingdir, setWorkingdir] = useState("");
	const inputs = useRef([]);
	const [inputList, setInputList] = useState([]);
	const [modules, setModules] = useState([]);
	const [lilyPadJobs, setLilyPadJobs] = useState([]);
	const navigate = useNavigate();

	const entrypoints = useRef([]);
	const [entrypointsList, setEntrypointsList] = useState([]);

	async function gM() {
		const resp = await getLilypadJobs();
		setModules(resp);
		setLilyPadJobs(resp);
	}

	const data = new Spec({
		docker: new JobSpecDocker({
			entrypoint: entrypoints.current,
			image: image,
		}),
		publisher_spec: new PublisherSpec({ type: "Estuary" }),
		timeout: 1800,
		verifier: "Noop",
	});

	async function createJob() {
		setLoading(true);
		const FEE = Web3.utils.toWei("0.03");
		let spec = JSON.stringify(data.toJson);

		const web3 = new Web3(window.ethereum);
		const contract = new web3.eth.Contract(
			LilypadInterface.abi,
			"0xdD6a7F72d68fbe6F347ff4c20EC0fa7eC9abB40B"
		);

		const currentAddress = await getWalletAddress();

		// Gas Calculation
		const gasPrice = await web3.eth.getGasPrice();
		const gas = await contract.methods.runJob(spec).estimateGas({
			from: currentAddress,
			value: FEE,
		});

		await contract.methods
			.runJob(spec)
			.send({ from: currentAddress, gasPrice, gas, value: FEE })
			.on("receipt", async function (receipt) {
				console.log(receipt);
				await createLilypadJob({
					job_id: receipt.events.JobCreated.returnValues.jobId,
					tx_hash: receipt.transactionHash,
				});

				setLoading(false);
				alert("Succesfully created a job🥳🍾");
			});
		setLoading(false);
	}

	useEffect(() => {
		gM();
	}, []);

	return (
		<Box sx={{ display: "flex" }}>
			<LeftDrawer />
			<Box style={{ width: `calc(100vw - 250px)` }}>
				<Navbar />
				<Box
					sx={{
						p: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#256afe",
						color: "white",
						width: "100%",
						fontWeight: "500",
						cursor: "pointer",
					}}
					onClick={() => navigate("/docker")}
				>
					Dont have metamask? Try the dashboard without metamask here 🔗
				</Box>
				<Box>
					<Box display={"flex"}>
						<Box sx={{ p: 2, flex: 1 }} mr={2}>
							<h2 style={{ textAlign: "center" }}>Lilypad Jobs 🍃</h2>
							<br />
							<Box display={"flex"}>
								{/* Image */}
								<Box maxWidth="50vw" mr={2}>
									<Box mb={1}>
										<h5>Image*</h5>
									</Box>
									<Box maxWidth="20vw" display={"flex"}>
										<Box className="param search-container">
											<input
												type="url"
												id="search"
												placeholder="leostelon/dedocker"
												value={image}
												onChange={(e) => setImage(e.target.value)}
											/>
										</Box>
									</Box>
								</Box>
								{/* Working Directory */}
								<Box maxWidth="50vw" mb={2}>
									<Box mb={1}>
										<h5>Working Directory</h5>
									</Box>
									<Box maxWidth="20vw" display={"flex"}>
										<Box className="param search-container">
											<input
												type="url"
												id="workingdir"
												placeholder="/inputs"
												value={workingdir}
												onChange={(e) => setWorkingdir(e.target.value)}
											/>
										</Box>
									</Box>
								</Box>
							</Box>
							{/* Inputs */}
							<Box maxWidth="50vw" mr={2} mb={3}>
								<Box mb={1} display={"flex"}>
									<Box mr={1}>
										<h5>Inputs</h5>
									</Box>

									<MdAddCircleOutline
										style={{ cursor: "pointer" }}
										onClick={() => {
											inputs.current.push({ StorageSource: "IPFS" });
											setInputList((_) => [...inputs.current]);
										}}
									/>
								</Box>
								{inputList.map((d, i) => (
									<Box
										maxWidth="30vw"
										sx={{
											display: "flex",
											alignItems: "center",
										}}
										key={i}
										mb={1}
									>
										<Box mr={2}>
											<select
												name="storage-spec"
												className="storage-select search-container"
												defaultValue="IPFS"
												value={inputs.current[i].StorageSource}
												onChange={(e) => {
													inputs.current[i].StorageSource = e.target.value;
													setInputList((_) => [...inputs.current]);
												}}
											>
												<option value="IPFS">IPFS</option>
												<option value="URLDownload">URL</option>
											</select>
										</Box>
										<Box className="param search-container" mr={2}>
											<input
												type="url"
												id={`search-${i}`}
												placeholder="URL/CID"
												value={inputs.current[i].cid}
												onInput={(e) => {
													if (inputs.current[i].StorageSource === "IPFS") {
														inputs.current[i].cid = e.target.value;
													} else {
														inputs.current[i].url = e.target.value;
													}
													setInputList((_) => [...inputs.current]);
												}}
											/>
										</Box>
										<Box className="param search-container" mr={2}>
											<input
												type="text"
												id={`input-${i}`}
												placeholder="Save to directory"
												value={inputs.current[i].path}
												onInput={(e) => {
													inputs.current[i].path = e.target.value;
													setInputList((_) => [...inputs.current]);
												}}
											/>
										</Box>
										<Box>
											<AiOutlineCloseCircle
												style={{ cursor: "pointer" }}
												onClick={() => {
													inputs.current.splice(i, 1);
													setInputList((_) => [...inputs.current]);
												}}
											/>
										</Box>
									</Box>
								))}
							</Box>
							{/* Entrypoints */}
							<Box maxWidth="50vw" mb={3}>
								<Box mb={1} display={"flex"}>
									<Box mr={1}>
										<h5>Entrypoint</h5>
									</Box>

									<MdAddCircleOutline
										style={{ cursor: "pointer" }}
										onClick={() => {
											entrypoints.current.push("");
											setEntrypointsList((_) => [...entrypoints.current]);
										}}
									/>
								</Box>
								{entrypointsList.map((d, i) => (
									<Box
										maxWidth="30vw"
										sx={{
											display: "flex",
											alignItems: "center",
										}}
										key={i}
										mb={1}
									>
										<Box className="param search-container" mr={2}>
											<input
												type="text"
												id={`entrypoint-${i}`}
												placeholder="Command"
												value={entrypoints.current[i]}
												onInput={(e) => {
													entrypoints.current[i] = e.target.value;
													setEntrypointsList((_) => [...entrypoints.current]);
												}}
											/>
										</Box>
										<Box>
											<AiOutlineCloseCircle
												style={{ cursor: "pointer" }}
												onClick={() => {
													entrypoints.current.splice(i, 1);
													setEntrypointsList((_) => [...entrypoints.current]);
												}}
											/>
										</Box>
									</Box>
								))}
							</Box>
							{/* Replicas */}
							<Box maxWidth="50vw" mb={2}>
								<Box mb={1}>
									<h5>Replicas</h5>
								</Box>
								<Box maxWidth="20vw" display={"flex"}>
									<Box className="param search-container">
										<input
											style={{ cursor: "no-drop" }}
											type="text"
											placeholder="1"
											value={"1"}
											disabled={true}
										/>
									</Box>
								</Box>
							</Box>
							<Box maxWidth="20vw">
								<BlueButton
									title={"Submit"}
									onClick={createJob}
									loading={loading}
								/>
							</Box>
						</Box>
						<Box sx={{ p: 2, flex: 1 }} width={"100%"}>
							<Box sx={{ textAlign: "center" }}>
								<h2>Saved Modules 💾</h2>
								<p>Click to load modules.</p>
							</Box>
							<br />
							<Box>
								{modules.map((m, i) => {
									return (
										<ListItem
											secondaryAction={
												<IconButton edge="end" aria-label="delete">
													<AiFillDelete />
												</IconButton>
											}
											key={i}
										>
											<ListItemAvatar>
												<Avatar>
													<AiFillFolder />
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={"Module Name"}
												secondary={"09/04/2023 20:29"}
											/>
										</ListItem>
									);
								})}
							</Box>
						</Box>
					</Box>
					<Box sx={{ p: 2 }}>
						<h2>Jobs 📃</h2>
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
								<table>
									<thead>
										<tr>
											<th>Id</th>
											<th>Result</th>
											<th>Transaction</th>
											<th>Created</th>
										</tr>
									</thead>
									<tbody>
										{lilyPadJobs.map((job, i) => (
											<LilyJobComponent key={i} job={job} />
										))}
									</tbody>
								</table>
							</Box>
						)}
					</Box>
				</Box>
			</Box>
		</Box>
	);
};
