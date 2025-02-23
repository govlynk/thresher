import { defineFunction } from "@aws-amplify/backend-function";
import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { RestApi, LambdaIntegration, Cors } from "aws-cdk-lib/aws-apigateway";

export const zohoAuth = defineFunction({
	name: "zohoAuth",
	entry: "./handler.ts",
	runtime: 18,
	memoryMB: 2048,
	timeoutSeconds: 30,
});

export const backend = defineBackend({
	zohoAuth,
});

const apiStack = backend.createStack("api-stack");

const restApi = new RestApi(apiStack, "ZohoRestApi", {
	restApiName: "ZohoRestApi",
	deployOptions: { stageName: "dev" },
	defaultCorsPreflightOptions: {
		allowOrigins: Cors.ALL_ORIGINS,
		allowMethods: Cors.ALL_METHODS,
	},
});

const lambdaIntegration = new LambdaIntegration(backend.zohoAuth.resources.lambda);

const zohoCallbackResource = restApi.root.addResource("zoho").addResource("callback");
zohoCallbackResource.addMethod("GET", lambdaIntegration);

backend.addOutput({
	custom: { ZohoRestApiEndpoint: { url: restApi.url, stageName: restApi.deploymentStage.stageName } },
});
