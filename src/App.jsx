import React, { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from "aws-amplify/auth";
// import { useAuthStore } from "./stores/authStore";
import { useGlobalStore, setActiveUser } from "./stores/globalStore";
import AppRouter from "./components/layout/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			refetchOnWindowFocus: false,
		},
	},
});

const userProfile = {
	cognitoId: "",
	name: "",
	email: "",
	phone: "",
	username: "",
	userId: "",
	authFlowType: "",

	contactId: "",
	groups: [],
	isAuthenticated: false,
	isAdmin: false,
	isGovLynk: false,
	isGovLynkAdmin: false,
};

const AuthenticatedApp = ({ signOut, user }) => {
	// const initializeAuth = useAuthStore((state) => state.initialize);
	const { setActiveUser } = useGlobalStore();
	const [initError, setInitError] = useState(null);
	const [isSessionValid, setIsSessionValid] = useState(false);

	useEffect(() => {
		const validateSessionAndInitialize = async () => {
			// Initialize user data from Cognito
			try {
				userProfile.username = user.username;
				userProfile.cognitoId = user.userId;
				userProfile.email = user.signInDetails?.loginId;
				userProfile.authFlowType = user.signInDetails?.authFlowType;
				// get User DB info
				try {
					const { data: users } = await client.models.User.list({
						filter: { cognitoId: { eq: user.userId } },
					});
					// console.log("[&&&AuthStore] Users:", response.data?.[4], users?.[0]);

					if (users?.[0]) {
						userProfile.id = users[0].id;
						userProfile.name = users[0].name;
						userProfile.phone = users[0].phone;
						userProfile.contactId = users[0].contactId;
						setActiveUser(userProfile.id);
						// Update last login
						await client.models.User.update({
							id: users[0].id,
							lastLogin: new Date().toISOString(),
						});
					}
				} catch (err) {
					console.warn("[AuthStore] Failed to fetch/update user data:", err);
				}

				const session = await fetchAuthSession();
				if (!session.tokens?.accessToken) {
					throw new Error("Invalid session");
				}

				// Extract user groups
				const groups = session.tokens.accessToken.payload["cognito:groups"][0] || [];
				userProfile.isAuthenticated = true;
				userProfile.isAdmin = groups.includes("ADMIN");
				userProfile.isGovLynk = groups.includes("GOVLYNK");
				userProfile.isGovLynkAdmin = groups.includes("GOVLYNK_ADMIN");
				userProfile.groups = groups;

				//set session as valid with no errors
				setActiveUser(userProfile);
				setIsSessionValid(true);
				setInitError(null);
			} catch (err) {
				console.error("[AuthenticatedApp] Initialization error", err);
				setInitError(err.message || "Failed to initialize application");
				setIsSessionValid(false);
			}
		};

		if (user) {
			validateSessionAndInitialize();
		}
	}, [user]);

	if (!isSessionValid) {
		return (
			<div style={{ padding: 20 }}>
				<h3>Validating session...</h3>
			</div>
		);
	}

	if (initError) {
		return (
			<div style={{ padding: 20, color: "red" }}>
				<h3>Initialization Error</h3>
				<p>{initError}</p>
				<button onClick={() => window.location.reload()}>Retry</button>
			</div>
		);
	}

	return <AppRouter signOut={signOut} user={user} />;
};

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Authenticator loginMechanisms={["email"]}>{(props) => <AuthenticatedApp {...props} />}</Authenticator>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
