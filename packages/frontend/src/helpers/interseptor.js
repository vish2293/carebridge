import axios from "axios";
import { decryptData, encryptData } from "./encryption-decryption";

const apiClient = axios.create();

apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");

		if (config.data) {
			const payloads = encryptData(config.data);
			config.data = { encryptedData: payloads };
		}

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response) => {
		if (response.data?.encryptedData) {
			const apiResponse = decryptData(response.data.encryptedData);
			return { ...response, data: apiResponse };
		}
		return response;
	},
	(error) => {
		if (error.response.data?.encryptedData) {
			try {
				const apiResponse = decryptData(error.response.data.encryptedData);

				return Promise.reject({
					...error,
					response: { ...error.response, data: apiResponse },
				});
			} catch (decryptError) {
				console.error("Error decrypting response:", decryptError);
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
