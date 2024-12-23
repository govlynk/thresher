import React, { useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { useAuthStore } from "./stores/authStore";
import { useGlobalStore } from "./stores/globalStore";
import AppRouter from "./components/layout/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { initializeUserData, initializeCompanyData, initializeTeamData } from "./utils/initializationUtils";

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false,
		},
	},
});

// Separate component to handle authenticated state
const AuthenticatedApp = ({ signOut, user }) => {
	const initializeAuth = useAuthStore((state) => state.initialize);
	const { setActiveUser, setActiveCompany, setActiveTeam } = useGlobalStore();
	const [initError, setInitError] = React.useState(null);

	useEffect(() => {
		if (user) {
			const initializeApp = async () => {
				try {
					// Initialize auth and get user data
					const userData = await initializeAuth(user);

					if (!userData) {
						console.error("[AuthenticatedApp] No user data returned from auth initialization");
						setInitError("Failed to initialize user data");
						return;
					}

					// Initialize user
					const userId = await initializeUserData(userData);
					if (userId) {
						setActiveUser(userId);
					}

					// Initialize company
					const companyId = await initializeCompanyData(userData.companies);
					if (companyId) {
						setActiveCompany(companyId);

						// Initialize team
						const teamId = await initializeTeamData(companyId);
						if (teamId) {
							setActiveTeam(teamId);
						}
					}

					setInitError(null);
				} catch (err) {
					setInitError(err.message || "Failed to initialize application");
				}
			};

			initializeApp();
		}
	}, [user, initializeAuth, setActiveUser, setActiveCompany, setActiveTeam]);

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
