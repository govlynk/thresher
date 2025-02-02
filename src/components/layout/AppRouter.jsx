import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useMemo, memo } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useGlobalStore } from "../../stores/globalStore";
import MainLayout from "../layout/MainLayout";
import NotFoundPage from "../../screens/NotFoundPage";

// Loading component
const LoadingScreen = () => (
	<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
		<CircularProgress />
	</Box>
);

// Lazy loaded components
const AgencyAnalysisScreen = lazy(() => import("../../screens/AgencyAnalysisScreen"));
const TodoScreen = lazy(() => import("../../screens/TodoScreen"));
//Profile
const FileBrowserScreen = lazy(() => import("../../screens/FileBrowserScreen"));

//Admin
const ClientSetupScreen = lazy(() => import("../../screens/ClientSetupScreen"));
const UserScreen = lazy(() => import("../../screens/UserScreen"));
const CompanyScreen = lazy(() => import("../../screens/CompanyScreen"));
const TeamScreen = lazy(() => import("../../screens/TeamScreen"));

const UserCompanyAccessScreen = lazy(() => import("../../screens/UserCompanyAccessScreen"));
const ContactsScreen = lazy(() => import("../../screens/ContactsScreen"));
const ContactAdminScreen = lazy(() => import("../../screens/ContactAdminScreen"));

const ProtectedRoute = ({ children, requiredGroups }) => {
	const { activeUserData } = useGlobalStore();
	console.log("Active User Data", activeUserData);
	console.log("Required Groups", requiredGroups);
	// Memoize access check
	const isAllowed = useMemo(() => {
		console.log("Required Groups", requiredGroups, activeUserData?.groups);
		if (!requiredGroups || !activeUserData?.groups) return false;
		return requiredGroups.some((requiredGroup) => activeUserData.groups.includes(requiredGroup));
	}, [requiredGroups, activeUserData?.groups]);

	if (!isAllowed) {
		console.log("Not Authorized", requiredGroups);
		return <Navigate to='/' />;
	}
	return children;
};

const AppRouter = ({ signOut }) => {
	const { activeUserData } = useGlobalStore();

	return (
		<Routes>
			<Route path='/' element={<MainLayout signOut={signOut} />}>
				<Route
					index
					element={
						<Suspense fallback={<LoadingScreen />}>
							<TodoScreen />
						</Suspense>
					}
				/>
				
				{/* Agency */}
				<Route
					path="agency-analysis"
					element={
						<Suspense fallback={<LoadingScreen />}>
							<AgencyAnalysisScreen />
						</Suspense>
					}
				/>

				{/* Management */}
				<Route
					path='todos'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<TodoScreen />
						</Suspense>
					}
				/>
				<Route
					path='user-admin'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<UserScreen />
						</Suspense>
					}
				/>
				<Route
					path='company'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<CompanyScreen />
						</Suspense>
					}
				/>
				<Route
					path='team'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<TeamScreen />
						</Suspense>
					}
				/>
				<Route
					path='company-files'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<FileBrowserScreen />
						</Suspense>
					}
				/>

				{/* Administration */}
				<Route
					path='user-company-access'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<UserCompanyAccessScreen />
						</Suspense>
					}
				/>
				<Route
					path='contacts'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<ContactsScreen />
						</Suspense>
					}
				/>
				<Route
					path='contact-admin'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<ContactAdminScreen />
						</Suspense>
					}
				/>

				{/* Protected GovLynk Routes */}
				<Route
					path='client-setup'
					element={
						<ProtectedRoute requiredGroups={["GOVLYNK_ADMIN", "COMPANY_ADMIN"]}>
							<Suspense fallback={<LoadingScreen />}>
								<ClientSetupScreen />
							</Suspense>
						</ProtectedRoute>
					}
				/>

				<Route
					path='user-admin'
					element={
						<ProtectedRoute requiredGroups={["GOVLYNK_ADMIN", "COMPANY_ADMIN"]}>
							<Suspense fallback={<LoadingScreen />}>
								<UserScreen />
							</Suspense>
						</ProtectedRoute>
					}
				/>

				{/* 404 */}
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default memo(AppRouter); // Memoize the component