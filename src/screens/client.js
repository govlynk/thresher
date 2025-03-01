import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";

export const client = generateClient({ authMode: "userPool" });
export const { useAIConversation, useAIGeneration } = createAIHooks(client);
