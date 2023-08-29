import "../styles/Docker.css";
import { Box } from "@mui/material";
import React, { useRef, useState } from "react";
import { LeftDrawer } from "../components/LeftDrawer";
import { Navbar } from "../components/Navbar";
import { Info } from "../components/Info";
import { MdAddCircleOutline } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BlueButton } from "../components/BlueButton";
import { runDocker } from "../api/bacalhau";
import { toast } from "react-toastify";

export const Docker = () => {
	const [image, setImage] = useState("");
	const [workingdir, setWorkingdir] = useState("");
	const inputs = useRef([]);
	const [inputList, setInputList] = useState([]);

	const entrypoints = useRef([]);
	const [entrypointsList, setEntrypointsList] = useState([]);

	async function createDockerJob() {
		if (!image)
			return toast("Please specify the required fields", { type: "info" });
		const resp = await runDocker(
			{
				image,
				working_directory: workingdir,
				entrypoint: entrypoints.current,
			},
			inputs.current
		);
		console.log(resp);
	}

	return (
		<Box sx={{ display: "flex" }}>
			<LeftDrawer />
			<Box style={{ width: `calc(100vw - 280px)` }}>
				<Navbar />
				<Box sx={{ p: 2 }}>
					<h2>Run Docker 🐋</h2>
					<br />
					{/* Image */}
					<Box maxWidth="50vw" mb={2}>
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
					{/* Tag */}
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
					{/* Inputs */}
					<Box maxWidth="50vw" mb={3}>
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
										placeholder="URL"
										value={inputs.current[i].cid}
										onInput={(e) => {
											inputs.current[i].cid = e.target.value;
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
						<BlueButton title={"Submit"} onClick={createDockerJob} />
					</Box>
					<Info
						title={"Run Docker images."}
						description={
							"Run any docker image from using this simple dashboard."
						}
					/>
				</Box>
			</Box>
		</Box>
	);
};
