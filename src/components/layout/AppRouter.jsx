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
const SprintScreen = lazy(() => import("../../screens/SprintScreen")); // Add Sprint Screen
const TodoScreen = lazy(() => import("../../screens/TodoScreen"));

//Sales
const OpportunitiesScreen = lazy(() => import("../../screens/OpportunitiesScreen"));
const PipelineScreen = lazy(() => import("../../screens/PipelineScreen"));
const CalendarScreen = lazy(() => import("../../screens/CalendarScreen"));
//Market Positioning
const SpendingAnalysisScreen = lazy(() => import("../../screens/SpendingAnalysisScreen"));
const PastPerformanceScreen = lazy(() => import("../../screens/PastPerformanceScreen"));
const CertificationScreen = lazy(() => import("../../screens/CertificationScreen"));
//Profile
const StrategicPositioningScreen = lazy(() => import("../../screens/StrategicPositioningScreen"));
const MaturityAssessmentScreen = lazy(() => import("../../screens/MaturityAssessmentScreen"));
const SAMRegistrationScreen = lazy(() => import("../../screens/SAMRegistrationScreen"));

//Regulation
const RegulationManagement = lazy(() => import("../../screens/RegulationManagement"));
const FileBrowserScreen = lazy(() => import("../../screens/FileBrowserScreen"));
//Admin
const ClientSetupScreen = lazy(() => import("../../screens/ClientSetupScreen"));
const UserScreen = lazy(() => import("../../screens/UserScreen"));
const CompanyScreen = lazy(() => import("../../screens/CompanyScreen"));
const TeamScreen = lazy(() => import("../../screens/TeamScreen"));
const UserCompanyAccessScreen = lazy(() => import("../../screens/UserCompanyAccessScreen"));
const ContactsScreen = lazy(() => import("../../screens/ContactsScreen"));
const ContactAdminScreen = lazy(() => import("../../screens/ContactAdminScreen"));
//Development
const TestScreen = lazy(() => import("../../screens/TestScreen"));

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
				<Route
					path='sprints'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<SprintScreen />
						</Suspense>
					}
				/>

				{/* Market Positioning */}
				<Route
					path='strategy'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<StrategicPositioningScreen />
						</Suspense>
					}
				/>
				<Route
					path='experience'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<PastPerformanceScreen />
						</Suspense>
					}
				/>
				<Route
					path='certification'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<CertificationScreen />
						</Suspense>
					}
				/>

				{/* Market Intelligence */}
				<Route
					path='spending-analysis'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<SpendingAnalysisScreen />
						</Suspense>
					}
				/>

				{/* Sales */}
				<Route
					path='opportunities'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<OpportunitiesScreen />
						</Suspense>
					}
				/>
				<Route
					path='pipeline'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<PipelineScreen />
						</Suspense>
					}
				/>
				<Route
					path='calendar'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<CalendarScreen />
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
				{/* Development */}
				<Route
					path='test'
					element={
						<ProtectedRoute requiredGroups={["GOVLYNK_ADMIN", "COMPANY_ADMIN"]}>
							<Suspense fallback={<LoadingScreen />}>
								<TestScreen />
							</Suspense>
						</ProtectedRoute>
					}
				/>

				{/* Profile */}
				<Route
					path='sam'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<SAMRegistrationScreen />
						</Suspense>
					}
				/>
				<Route
					path='maturity'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<MaturityAssessmentScreen />
						</Suspense>
					}
				/>
				<Route
					path='far'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<RegulationManagement />
						</Suspense>
					}
				/>

				{/* 404 */}
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default memo(AppRouter); // Memoize the component
