import { default as axios } from "axios";
import { SERVER_URL, SERVER_URL_X } from "../constants";
import { resolve } from "../utils/resolver";

export const uploadDataset = async function (
	files,
	name,
	description,
) {
	try {
		let token = localStorage.getItem("token");
		const form = new FormData();
		for (let i = 0; i < files.length; i++) {
			form.append("file", files[i], files[i].name);
		}
		form.append("name", name);
		form.append("description", description);

		const response = await axios.post(SERVER_URL_X + "/upload/dataset", form, {
			headers: {
				"Content-Type": `multipart/form-data`,
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.status === 200) {
			return response.data;
		}
	} catch (error) {
		console.log(error.message);
	}
};

export const getDatasets = async function () {
	try {
		let token = localStorage.getItem("token");

		const response = await resolve(axios.get(SERVER_URL_X + "/files?type=dataset", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}));
		return response;
	} catch (error) {
		console.log(error.message);
	}
};

export const searchDatasets = async function (name) {
	try {
		const response = await axios.get(
			SERVER_URL + "/datasets/search?name=" + name
		);
		if (response.status === 200) {
			return response.data.repositories;
		}
	} catch (error) {
		console.log(error.message);
	}
};
