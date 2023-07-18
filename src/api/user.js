import { default as axios } from "axios";
import { SERVER_URL, SERVER_URL_X } from "../constants";
import { toast } from "react-toastify";

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

export const signUpUser = async function (username, password) {
	try {
		const nonceResponse = await axios.post(
			`${SERVER_URL_X}/user/generateNonce`,
			{ address: " " },
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
			}
		);
		const formattedNonceResponse = nonceResponse.data;
		const nonce = formattedNonceResponse.nonce;

		const response = await axios.post(
			`${SERVER_URL_X}/user/signup`,
			{ username, password, displayName: "Unnamed", nonce },
			{
				method: "POST",
				headers: {
					"Content-Type": `application/json`,
				},
			}
		);
		if (response.status === 201) {
			localStorage.setItem("token", response.data.token);

			return response;
		}
	} catch (error) {
		if (error.response.status === 400) {
			if (
				error.response.data.message.includes("duplicate") &&
				error.response.data.message.includes("username")
			) {
				toast("Username is already taken", { type: "error" });
			}
		}
		console.log(error.message);
	}
};

export const loginUser = async function (username, password) {
	try {
		const nonceResponse = await axios.post(
			`${SERVER_URL_X}/user/generateNonce`,
			{ address: " " },
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
			}
		);
		const formattedNonceResponse = nonceResponse.data;
		const nonce = formattedNonceResponse.nonce;

		const response = await axios.post(
			`${SERVER_URL_X}/user/login`,
			{ username, password, nonce },
			{
				method: "POST",
				headers: {
					"Content-Type": `application/json`,
				},
			}
		);
		if (response.status === 200) {
			localStorage.setItem("token", response.data.token);

			return response;
		}
	} catch (error) {
		if (error.response.status === 500) {
			toast(error.response.data.message, { type: "error" });
		}
		console.log(error.message);
	}
};

export const getUser = async function () {
	try {
		let token = localStorage.getItem("token");
		const response = await axios.get(SERVER_URL_X + "/user", {
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

export const addCredits = async function () {
	try {
		let token = localStorage.getItem("token");
		const response = await axios
			.post(
				SERVER_URL + "/user/addcredits",
				{ credits: 5 },
				{
					headers: {
						"Content-Type": `application/json`,
						Authorization: "Bearer " + token,
					},
				}
			)
			.catch((er) => {
				alert(er.response.data.message);
			});
		if (response.status === 200) {
			return response.data;
		}
	} catch (error) {
		console.log(error.message);
	}
};
