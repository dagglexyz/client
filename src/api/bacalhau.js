import { default as axios } from "axios";
import { SERVER_URL, SERVER_URL_X } from "../constants";
import { resolve } from "../utils/resolver";
import { toast } from "react-toastify";
import { JobSpecDocker } from "../models/JobSpecDocker";
import { StorageSpec } from "../models/StorageSpec";

export const createTensorJob = async function (scriptUrl, filename, datasetUrl) {
	try {
		let token = localStorage.getItem("token");

		const resolved = await resolve(
			axios.post(
				SERVER_URL + "/bacalhau/traintensorflow",
				{ scriptUrl, filename, datasetUrl },
				{
					headers: {
						"Content-Type": `application/json`,
						Authorization: `Bearer ${token}`,
					},
				}
			)
		);
		if (resolved.statusCode === 200) {
			toast("Successfully created a job in Bacalhau, please check jobs for status🚀", { type: "success" });
		}
		return resolved;
	} catch (error) {
		console.log(error.message);
	}
};

export const createRemovebgJob = async function (file) {
	try {
		let token = localStorage.getItem("token");

		// Image Upload
		const form = new FormData();
		form.append("file", file, file.name);
		const response = await axios.post(SERVER_URL_X + "/upload/file", form, {
			headers: {
				"Content-Type": `multipart/form-data`,
				Authorization: `Bearer ${token}`,
			},
		});
		console.log(response)
		if (response.status !== 200) {
			return toast("File upload failed", { type: "warning" })
		}
		const resolved = await resolve(
			axios.post(
				SERVER_URL + "/bacalhau/removebg",
				{ filename: response.data.file.filename, fileUrl: response.data.protocolLink },
				{
					headers: {
						"Content-Type": `application/json`,
						Authorization: `Bearer ${token}`,
					},
				}
			)
		);
		if (resolved.statusCode === 200) {
			toast("Successfully created a job in Bacalhau, please check jobs for status🚀", { type: "success" });
		}
		return resolved;
	} catch (error) {
		console.log(error.message);
	}
};

export const fileUpload = async function (url) {
	try {
		let token = localStorage.getItem("token");

		const resolved = await resolve(
			axios.post(
				SERVER_URL_X + "/bacalhau/submit",
				{
					"jobspecdocker": new JobSpecDocker({
						image: "alpine",
						entrypoint: ["sh", "-c", "cp -r /inputs/* /outputs/"]
					}).toJson(),
					"storagespec": [new StorageSpec({
						storage_source: "URLDownload",
						path: "/inputs",
						url
					}).toJson()],
					type: "file-upload"
				},
				{
					headers: {
						"Content-Type": `application/json`,
						Authorization: `Bearer ${token}`,
					},
				}
			)
		);
		if (resolved.statusCode === 404) {
			const data = resolved.data;
			if (data.data.message && data.data.message.includes("authenticate")) {
				toast("Please connect your wallet!", {
					type: "info",
				});
			}
		} else if (resolved.statusCode === 200) {
			toast("Successfully started upload to IPFS, check status in jobs sections.", { type: "success" });
		}
		return resolved;
	} catch (error) {
		console.log(error.message);
	}
};

export const getJobs = async function (query) {
	try {
		let token = localStorage.getItem("token");

		const resolved = await resolve(
			axios.get(SERVER_URL_X + `/jobs?query=${query ?? ""}`, {
				headers: {
					"Content-Type": `application/json`,
					Authorization: `Bearer ${token}`,
				},
			})
		);
		return resolved;
	} catch (error) {
		console.log(error.message);
	}
};

export const getModels = async function () {
	try {
		let token = localStorage.getItem("token");

		const resolved = await resolve(
			axios.get(SERVER_URL_X + "/files?type=model", {
				headers: {
					"Content-Type": `application/json`,
					Authorization: `Bearer ${token}`,
				},
			})
		);
		return resolved;
	} catch (error) {
		console.log(error.message);
	}
};

export const uploadScript = async function (script) {
	try {
		let token = localStorage.getItem("token");

		const resolved = await resolve(
			axios.post(
				SERVER_URL_X + "/upload/pythonscript",
				{ script },
				{
					headers: {
						"Content-Type": `application/json`,
						Authorization: `Bearer ${token}`,
					},
				}
			)
		);
		return resolved;
	} catch (error) {
		console.log(error.message);
	}
}

export const uploadNodejsScript = async function (script) {
	try {
		let token = localStorage.getItem("token");

		const resolved = await resolve(
			axios.post(
				SERVER_URL_X + "/upload/nodescript",
				{ script },
				{
					headers: {
						"Content-Type": `application/json`,
						Authorization: `Bearer ${token}`,
					},
				}
			)
		);
		return resolved;
	} catch (error) {
		console.log(error.message);
	}
}

export const runPythonScript = async function (scriptUrl, filename) {
	try {
		let token = localStorage.getItem("token");

		const resolved = await resolve(
			axios.post(
				SERVER_URL + "/bacalhau/runpython",
				{ scriptUrl, filename },
				{
					headers: {
						"Content-Type": `application/json`,
						Authorization: `Bearer ${token}`,
					},
				}
			)
		);
		if (resolved.statusCode === 200) {
			toast("Successfully created a job in Bacalhau, please check jobs for status🚀", { type: "success" });
		}
		return resolved;
	} catch (error) {
		console.log(error.message);
	}
};

export const runNodejsScript = async function (scriptUrl, filename) {
	try {
		let token = localStorage.getItem("token");

		const resolved = await resolve(
			axios.post(
				SERVER_URL_X + "/bacalhau/submit",
				{
					"jobspecdocker": new JobSpecDocker({
						image: "node:alpine",
						entrypoint: ["node", filename],
						working_directory: "/inputs"
					}),
					"storagespec": [new StorageSpec({
						storage_source: "IPFS",
						path: "/inputs",
						cid: scriptUrl.replace("https://", "").replace(".ipfs.sphn.link", "")
					}).toJson()],
					type: "script-nodejs"
				},
				{
					headers: {
						"Content-Type": `application/json`,
						Authorization: `Bearer ${token}`,
					},
				}
			)
		);
		if (resolved.statusCode === 200) {
			toast("Successfully created a job in Bacalhau, please check jobs for status🚀", { type: "success" });
		}
		return resolved;
	} catch (error) {
		console.log(error.message);
	}
};

export const getJob = async function (id, type) {
	try {
		let token = localStorage.getItem("token");

		const resolved = await resolve(
			axios.get(`${SERVER_URL_X}/jobs/state/${id}`, {
				headers: {
					"Content-Type": `application/json`,
					Authorization: `Bearer ${token}`,
				},
			})
		);
		return resolved;
	} catch (error) {
		console.log(error.message);
	}
};
