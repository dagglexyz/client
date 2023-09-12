import { default as axios } from "axios";
import { SERVER_URL_X } from "../constants";

export const createLilypadJob = async function (data) {
	try {
		let token = localStorage.getItem("token");
		const response = await axios.post(SERVER_URL_X + "/lilypad", data, {
			headers: {
				"Content-Type": `application/json`,
				Authorization: "Bearer " + token,
			},
		});
		if (response.status === 200) {
			return response.data;
		}
	} catch (error) {
		console.log(error.message);
	}
};

export const getLilypadJob = async function (jobId) {
	try {
		let token = localStorage.getItem("token");
		const response = await axios.get(SERVER_URL_X + "/lilypad/" + jobId, {
			headers: {
				Authorization: "Bearer " + token,
			},
		});
		if (response.status === 200) {
            console.log(response)
			return response;
		}
	} catch (error) {
		console.log(error.message);
	}
};

export const getLilypadJobs = async function () {
	try {
		let token = localStorage.getItem("token");
		const response = await axios.get(SERVER_URL_X + "/lilypad", {
			headers: {
				Authorization: "Bearer " + token,
			},
		});
		if (response.status === 200) {
			return response.data;
		}
	} catch (error) {
		console.log("user", error.message);
	}
};
