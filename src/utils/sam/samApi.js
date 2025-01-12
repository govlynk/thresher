import { get } from "@aws-amplify/api";
import { fetchAuthSession } from "@aws-amplify/auth";

const sanitizeData = (data) => {
	if (!data) return null;
	return JSON.parse(JSON.stringify(data));
};

export async function getEntity(uei) {
	try {
		const session = await fetchAuthSession();
		const response = await get({
			apiName: "samApi",
			path: "/",
			options: {
				queryParams: {
					uei,
					action: "entity",
				},
				headers: {
					Authorization: `Bearer ${session.tokens?.accessToken.toString()}`,
				},
			},
		});

		if (!response.body) {
			throw new Error("Network response was not ok");
		}

		return sanitizeData(response.body);
	} catch (error) {
		const serializedError = new Error(error.message || "Failed to fetch entity data");
		throw serializedError;
	}
}

export async function getRepsAndCerts(uei) {
	try {
		const session = await fetchAuthSession();
		const response = await get({
			apiName: "samApi",
			path: "/",
			options: {
				queryParams: {
					uei,
					action: "repsAndCerts",
				},
				headers: {
					Authorization: `Bearer ${session.tokens?.accessToken.toString()}`,
				},
			},
		});

		if (!response.body) {
			throw new Error("Network response was not ok");
		}

		return sanitizeData(response.body);
	} catch (error) {
		const serializedError = new Error(error.message || "Failed to fetch reps and certs data");
		throw serializedError;
	}
}
