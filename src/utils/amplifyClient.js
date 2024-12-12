import { generateClient } from "aws-amplify/data";

// Create a singleton client instance
const client = generateClient({
	authMode: "userPool",
});

export default client;
