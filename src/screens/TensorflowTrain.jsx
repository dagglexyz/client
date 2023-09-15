import "../styles/TensorflowTrain.css";
import React, { useState } from "react";
import { LeftDrawer } from "../components/LeftDrawer";
import { Box } from "@mui/material";
import { Navbar } from "../components/Navbar";

// Code Editor Imports
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another

import { BlueButton } from "../components/BlueButton";
import { getDatasets } from "../api/dataset";
import { useEffect } from "react";
import { Info } from "../components/Info";
import { useNavigate } from "react-router-dom";
import { createTensorJob, uploadScript } from "../api/bacalhau";
import { toast } from "react-toastify";
import { getWalletAddress, switchChain } from "../utils/wallet";
import LilypadInterface from "../contracts/Lilypad.json";
import Web3 from "web3";
import {
	JobSpecDocker,
	PublisherSpec,
	Spec,
	StorageSpec,
} from "@daggle/bacalhau-js/models";
import { CHAIN } from "../constants";
import { createLilypadJob } from "../api/lilypad";

export const TensorflowTrain = () => {
	const [loading, setLoading] = useState(false);
	const [datasetOptions, setDatasetOptions] = useState([]);
	const [selectedDataset, setSelectedDataset] = useState("");
	const [code, setCode] = useState(`# Paste your python code here.`);
	const navigate = useNavigate();
	const [fileUrl, setFileUrl] = useState("");

	async function train() {
		setLoading(true);
		const fileUplaodResolved = await uploadScript(code);
		if (fileUplaodResolved.statusCode !== 200)
			return toast("Script upload failed", { type: "error" });

		const bacalhauResolved = await createTensorJob(
			fileUplaodResolved.data.protocolLink,
			fileUplaodResolved.data.filename,
			fileUrl
		);
		if (bacalhauResolved.statusCode === 200) {
			setCode(`# Paste your python code here.`);
		}
		setLoading(false);
	}

	async function createLilyJob() {
		setLoading(true);
		// Script Upload
		const fileUplaodResolved = await uploadScript(code);
		if (fileUplaodResolved.statusCode !== 200)
			return toast("Script upload failed", { type: "error" });

		// Prepare Spec
		let scriptUrl = `${fileUplaodResolved.data.protocolLink}/${fileUplaodResolved.data.filename}`;

		const data = new Spec({
			docker: new JobSpecDocker({
				entrypoint: ["python", fileUplaodResolved.data.filename],
				image: "tensorflow/tensorflow",
				WorkingDirectory: "/inputs",
			}),
			publisher_spec: new PublisherSpec({ type: "Estuary" }),
			timeout: 1800,
			verifier: "Noop",
			inputs: [fileUrl, scriptUrl].map(
				(url) =>
					new StorageSpec({
						StorageSource: "URLDownload",
						cid: url,
						url,
						path: "/inputs",
					})
			),
			outputs: [new StorageSpec({ name: "outputs", path: "/outputs" })],
		});
		// Chain configs
		await switchChain();
		const FEE = Web3.utils.toWei("0.04");
		let spec = JSON.stringify(data.toJson);

		const web3 = new Web3(window.ethereum);
		const contract = new web3.eth.Contract(
			LilypadInterface.abi,
			CHAIN.contract_address
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
				await createLilypadJob({
					job_id: receipt.events.JobCreated.returnValues.jobId,
					tx_hash: receipt.transactionHash,
				});
				setLoading(false);
				alert("Succesfully created a job🥳🍾");
			});
		setLoading(false);
	}

	async function gd() {
		const resolved = await getDatasets();
		if (resolved.statusCode === 200) {
			setDatasetOptions(resolved.data);
			if (resolved.data.length > 0) {
				setFileUrl(`${resolved.data[0].file}/${resolved.data[0].name}`);
			}
		}
	}

	useEffect(() => {
		gd();
	}, []);

	return (
		<Box sx={{ display: "flex" }}>
			<LeftDrawer />
			<Box style={{ width: `calc(100vw - 280px)`, maxHeight: "100vh" }}>
				<Navbar />
				<Box sx={{ p: 2, display: "flex" }}>
					<Box flex={3} mr={1}>
						<h2>Train Tensorflow Models ⚒️</h2>
						<br />
						<Editor
							value={code}
							onValueChange={(code) => setCode(code)}
							highlight={(code) => highlight(code, languages.js)}
							padding={10}
							style={{
								fontFamily: '"Fira code", "Fira Mono", monospace',
								fontSize: 12,
								maxHeight: "75vh",
							}}
							className="editor"
						/>
					</Box>
					<Box
						flex={1}
						p={1}
						borderLeft="1px solid #ededed"
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							height: "82.5vh",
							alignItems: "center",
						}}
					>
						<Box>
							<h4 style={{ color: "#525252" }}>Train</h4>
							<Box pl={2} mt={1} sx={{ fontWeight: "600", fontSize: "14px" }}>
								<ul>
									<li>Upload only Python code.</li>
									<li>Paste only Tensorflow enabled model training code.</li>
									<li>Datasets can be accessed via /inputs/ directory.</li>
									<li>Save your weights/models to outputs folder.</li>
									<li>model.save('/outputs/')</li>
									<li>model.save_weights('/outputs/')</li>
								</ul>
							</Box>
						</Box>
						<Box width={"100%"}>
							<Info
								title={"Add datasets 🪣"}
								description={
									<>
										Not able to find datasets, you can add new datasets from{" "}
										<span
											style={{ cursor: "pointer", color: "blue" }}
											onClick={() => navigate("/datasetupload")}
										>
											here
										</span>
										!
									</>
								}
							/>
							<Box>
								<select
									name="datasets"
									id="datasets"
									value={selectedDataset}
									placeholder="Select dataset"
									onChange={(e) => {
										setSelectedDataset(e.target.value);
										setFileUrl(e.target.value.split("--")[1] + "/");
									}}
								>
									{datasetOptions.map((o, i) => {
										return (
											<option value={o._id + "--" + o.file} key={i}>
												{o.name}
											</option>
										);
									})}
								</select>
							</Box>
							<Box flex={1} mt={1}>
								<BlueButton
									title={"Train Model"}
									loading={loading}
									onClick={createLilyJob}
								/>
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};
