import { defineFunction } from "@aws-amplify/backend-function";
import { defineBackend } from "@aws-amplify/backend";
import { RestApi, LambdaIntegration, Cors } from "aws-cdk-lib/aws-apigateway";

// Define the backend first
export const backend = defineBackend({});

// Define the Lambda function
export const zohoAuth = defineFunction({
	name: "zohoAuth",
	entry: "./handler.ts", // Path to your Lambda function handler
	runtime: 18, // Correct runtime value (must be a string)
	memoryMB: 2048,
	timeoutSeconds: 30,
});

// Add function to backend
backend.addFunction("zohoAuth", zohoAuth);

// Create API Gateway stack
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

// Create API route with Lambda integration
const integration = new LambdaIntegration(zohoAuth.node.defaultChild);
restApi.root.addResource("zoho").addResource("callback").addMethod("GET", integration);

// Add an output for the REST API endpoint
backend.addOutput({
	ZohoRestApiEndpoint: restApi.url, // Outputs the API Gateway URL
});
