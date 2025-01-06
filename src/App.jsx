import { StrictMode } from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter } from "react-router-dom";
import { useGlobalStore } from "./stores/globalStore";
import AppRouter from "./components/layout/AppRouter";

export default function App() {
	const setActiveUser = useGlobalStore((state) => state.setActiveUser);

	const handleAuthChange = async (user) => {
		if (!user) return;

		try {
			await setActiveUser({
				id: user.userId,
				email: user.signInDetails?.loginId,
				name: user.username,
				cognitoId: user.userId,
			});
		} catch (err) {
			console.error("Error setting active user:", err);
		}
	};

	return (
		<Authenticator.Provider>
			<Authenticator loginMechanisms={["email"]} onSignIn={handleAuthChange}>
				{(props) => <AppRouter {...props} />}
			</Authenticator>
		</Authenticator.Provider>
	);
}
