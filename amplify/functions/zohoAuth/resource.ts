import { defineFunction } from "@aws-amplify/backend-function";
import { defineBackend } from "@aws-amplify/backend";
import { RestApi, LambdaIntegration, Cors } from "aws-cdk-lib/aws-apigateway";
import { Function } from "aws-cdk-lib/aws-lambda";

// Define the Lambda function
export const zohoAuth = defineFunction({
	name: "zohoAuth",
	entry: "./handler.ts", // Path to your Lambda function handler
	runtime: 18, // Correct runtime value (must be a string)
	memoryMB: 2048,
	timeoutSeconds: 30,
});

// Define backend with function
export const backend = defineBackend({
	zohoAuth,
});

// Create API Gateway stack
const apiStack = backend.createStack("api-stack");
const restApi = new RestApi(apiStack, "ZohoRestApi", {
	restApiName: "ZohoRestApi",
	deployOptions: { stageName: "dev" },
	defaultCorsPreflightOptions: {
		allowOrigins: Cors.ALL_ORIGINS,
		allowMethods: Cors.ALL_METHODS,
	},
});

// Create API route with Lambda integration
const lambdaStack = backend.createStack("lambda");
const lambdaFunction = (zohoAuth as any).construct.node.defaultChild;
const integration = new LambdaIntegration(lambdaFunction);
restApi.root.addResource("zoho").addResource("callback").addMethod("GET", integration);

backend.addOutput({
	custom: {
		ZohoRestApiEndpoint: restApi.url,
	},
});
