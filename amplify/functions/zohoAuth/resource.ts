import { defineFunction } from "@aws-amplify/backend-function";
import { defineBackend } from "@aws-amplify/backend";
import { RestApi, LambdaIntegration, Cors } from "aws-cdk-lib/aws-apigateway";

export const zohoAuth = defineFunction({
	name: "zohoAuth",
	entry: "./handler.ts", // Path to your Lambda function handler
	runtime: 18, // Correct runtime value (must be a string)
	memoryMB: 2048,
	timeoutSeconds: 30,
});

export const backend = defineBackend({
	zohoAuth, // Add the Lambda function to the backend definition
});

// Create a new stack for API Gateway
const apiStack = backend.createStack("api-stack");

// Define the REST API
const restApi = new RestApi(apiStack, "ZohoRestApi", {
	restApiName: "ZohoRestApi",
	deployOptions: { stageName: "dev" },
	defaultCorsPreflightOptions: {
		allowOrigins: Cors.ALL_ORIGINS,
		allowMethods: Cors.ALL_METHODS,
	},
});

// Integrate the Lambda function with API Gateway
const lambdaIntegration = new LambdaIntegration(zohoAuth.resources.lambda);

// Create resources and methods in the REST API
const zohoResource = restApi.root.addResource("zoho");
const callbackResource = zohoResource.addResource("callback");
callbackResource.addMethod("GET", lambdaIntegration);

// Add an output for the REST API endpoint
backend.addOutput({
	ZohoRestApiEndpoint: restApi.url, // Outputs the API Gateway URL
});
