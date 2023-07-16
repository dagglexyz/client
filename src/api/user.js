import { default as axios } from "axios";
import { SERVER_URL, SERVER_URL_X } from "../constants";
let token = localStorage.getItem("token");

export const createUser = async function (address) {
	try {
		const nonceResponse = await axios.post(
			`${SERVER_URL_X}/user/generateNonce`,
			{ address },
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
			}
		);
		const formattedNonceResponse = nonceResponse.data;
		const nonce = formattedNonceResponse.nonce;

		const sign = await window.ethereum.request({
			method: "personal_sign",
			params: [address, "Please approve this message \n \nNonce:\n" + nonce],
		});

		const response = await axios.post(
			`${SERVER_URL_X}/user/signin`,
			{ displayName: "Unnamed", sign, nonce },
			{
				method: "POST",
				headers: {
					"Content-Type": `application/json`,
				},
			}
		);
		if (response.status === 201) {
			localStorage.setItem("token", response.data.token);

			return response.data;
		}
	} catch (error) {
		console.log(error.message);
	}
};

export const getUser = async function () {
	try {
		const response = await axios.get(SERVER_URL_X + "/user", {
			headers: {
				Authorization: "Bearer " + token
			}
		});
		if (response.status === 200) {
			return response.data;
		}
	} catch (error) {
		console.log("user", error.message);
	}
};

export const addCredits = async function () {
	try {
		const response = await axios.post(SERVER_URL + "/user/addcredits", { credits: 5 }, {
			headers: {
				"Content-Type": `application/json`,
				Authorization: "Bearer " + token
			}
		}).catch(er => {
			alert(er.response.data.message)
		})
		if (response.status === 200) {
			return response.data;
		}
	} catch (error) {
		console.log(error.message)
	}
}
