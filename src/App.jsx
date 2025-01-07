import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { useGlobalStore } from "./stores/globalStore";
import { useUserCompanyStore } from "./stores/userCompanyStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppRouter from "./components/layout/AppRouter";

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
	const { setActiveUser, setActiveCompany, setActiveTeam, activeUserData, activeUserId } = useGlobalStore();
	const { userCompanies, fetchUserCompanies, loading } = useUserCompanyStore();
	const [initError, setInitError] = useState(null);

	// Debug current user state
	useEffect(() => {
		console.log("Auth change detected:", user);

		if (!user) {
			console.log("No user data provided");
			return;
		}

		try {
			const userData = {
				id: user.userId,
				email: user.signInDetails?.loginId,
				cognitoId: user.userId,
			};

			setActiveUser(userData);
			if (activeUserId) {
				fetchUserCompanies(activeUserId);
				console.log("@@@@userCompanies", userCompanies);
				setActiveCompany(userCompanies[0].id);
			}
			console.log("Active user set successfully");
		} catch (err) {
			console.error("Error setting active user:", err);
		}

		console.log("Current activeUserData:", activeUserData);
	}, [user]);

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
