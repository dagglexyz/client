import { default as axios } from "axios";
import { SERVER_URL_X } from "../constants";

export const downloadJobResult = async function (cid) {
	try {
		let token = localStorage.getItem("token");
		const response = await axios.get(SERVER_URL_X + "/saturn/" + cid, {
			headers: {
				Authorization: "Bearer " + token,
			},
			responseType: "blob",
		});
		if (response.status === 200) {
			return response.data;
		}
	} catch (error) {
		console.log("user", error.message);
	}
};
