import { default as axios } from "axios";
import { SERVER_URL_X } from "../constants";

export const createTemplate = async function (data) {
	try {
		let token = localStorage.getItem("token");
		const response = await axios.post(SERVER_URL_X + "/template", data, {
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

export const cloneTemplate = async function (data) {
	try {
		let token = localStorage.getItem("token");
		const response = await axios.post(SERVER_URL_X + "/template/clone", data, {
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

export const getTemplates = async function () {
	try {
		let token = localStorage.getItem("token");
		const response = await axios.get(SERVER_URL_X + "/template", {
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

export const searchTemplates = async function (name) {
	try {
		let token = localStorage.getItem("token");
		const response = await axios.get(
			SERVER_URL_X + `/template/search?name=${name}`,
			{
				headers: {
					Authorization: "Bearer " + token,
				},
			}
		);
		if (response.status === 200) {
			return response.data;
		}
	} catch (error) {
		console.log("user", error.message);
	}
};

export const deleteTemplate = async function (id) {
	try {
		let token = localStorage.getItem("token");
		const response = await axios.delete(SERVER_URL_X + "/template/" + id, {
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
