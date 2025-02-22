import { defineFunction } from "@aws-amplify/backend-function";
import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { RestApi, LambdaIntegration, Cors } from "aws-cdk-lib/aws-apigateway";

export const zohoAuth = defineFunction({
	name: "zohoAuth", // Function name
	entry: "./handler.ts", // Path to the handler file
	runtime: 18, // Node.js runtime
	memoryMB: 2048, // Memory allocation
	timeoutSeconds: 30,
	environment: {
		REDIRECT_URI: "https://d1hcn7nmh82rdz.execute-api.us-east-1.amazonaws.com/dev/zoho/callback", // Redirect URI as per Zoho Console
		ZOHO_CLIENT_ID: "ZOHO_CLIENT_ID", // Environment variable for client ID
		ZOHO_CLIENT_SECRET: "ZOHO_CLIENT_SECRET", // Environment variable for client secret
	},
});

// Define the backend and create a REST API with API Gateway
export const backend = defineBackend({
	zohoAuth,
});

// Create a new stack for the REST API
const apiStack = backend.createStack("api-stack");

// Create the REST API using API Gateway
const restApi = new RestApi(apiStack, "ZohoRestApi", {
	restApiName: "ZohoRestApi",
	deployOptions: {
		stageName: "dev",
	},
	defaultCorsPreflightOptions: {
		allowOrigins: Cors.ALL_ORIGINS, // Restrict to trusted domains in production
		allowMethods: Cors.ALL_METHODS,
		allowHeaders: Cors.DEFAULT_HEADERS,
	},
});

// Integrate the Lambda function with the REST API
const lambdaIntegration = new LambdaIntegration(backend.zohoAuth.resources.lambda);

// Add a route for Zoho callback
const zohoCallbackResource = restApi.root.addResource("zoho").addResource("callback");
zohoCallbackResource.addMethod("GET", lambdaIntegration); // Attach GET method to the route

// Output the API endpoint for use in your application
backend.addOutput({
	custom: {
		ZohoRestApiEndpoint: {
			url: restApi.url,
			stageName: restApi.deploymentStage.stageName,
		},
	},
});
