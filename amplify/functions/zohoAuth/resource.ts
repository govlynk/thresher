import { defineFunction } from "@aws-amplify/backend-function";
import { defineBackend } from "@aws-amplify/backend";
import { Function } from "aws-cdk-lib/aws-lambda";
import { RestApi, LambdaIntegration, Cors } from "aws-cdk-lib/aws-apigateway";

// Define the Lambda function
export const zohoAuth = defineFunction({
	name: "zohoAuth",
	entry: "./handler.ts", // Path to your Lambda function handler
	runtime: 18, // Correct runtime value (must be a string)
	memoryMB: 2048,
	timeoutSeconds: 30,
	environment: {
		REDIRECT_URI: "https://d1hcn7nmh82rdz.execute-api.us-east-1.amazonaws.com/dev/zoho/callback",
		ZOHO_CLIENT_ID: "ZOHO_CLIENT_ID",
		ZOHO_CLIENT_SECRET: "ZOHO_CLIENT_SECRET",
	},
});

// Define backend with function
export const backend = defineBackend({
	zohoAuth,
});

const apiStack = backend.createStack("api-stack");

// Get Lambda function
const lambdaFn = apiStack.node.findChild("zohoAuth") as Function;

// Create API Gateway
const restApi = new RestApi(apiStack, "ZohoRestApi", {
	restApiName: "ZohoRestApi",
	deployOptions: { stageName: "dev" },
	defaultCorsPreflightOptions: {
		allowOrigins: Cors.ALL_ORIGINS,
		allowMethods: Cors.ALL_METHODS,
	},
});

// Create API route with Lambda integration
const integration = new LambdaIntegration(lambdaFn);
restApi.root.addResource("zoho").addResource("callback").addMethod("GET", integration);

backend.addOutput({
	custom: {
		ZohoRestApiEndpoint: restApi.url,
	},
});
