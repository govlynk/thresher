import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useMemo, memo } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useGlobalStore } from "../../stores/globalStore";
import MainLayout from "../layout/MainLayout";
import NotFoundPage from "../../screens/NotFoundPage";
import SettingsScreen from "../../screens/SettingsScreen";

// Loading component
const LoadingScreen = () => (
	<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
		<CircularProgress />
	</Box>
);

// Lazy loaded components
const CalendarScreen = lazy(() => import("../../screens/CalendarScreen"));
const TodoScreen = lazy(() => import("../../screens/TodoScreen"));
//Profile

const SAMRegistrationScreen = lazy(() => import("../../screens/SAMRegistrationScreen"));
const FileBrowserScreen = lazy(() => import("../../screens/FileBrowserScreen"));

//Strategic Positioning
const SwotScreen = lazy(() => import("../../screens/SwotScreen"));
const StrategicPositioningScreen = lazy(() => import("../../screens/StrategicPositioningScreen"));
const MaturityAssessmentScreen = lazy(() => import("../../screens/MaturityAssessmentScreen"));

//Sales
const OpportunitiesScreen = lazy(() => import("../../screens/OpportunitiesScreen"));
const OpportunityHigherGovScreen = lazy(() => import("../../screens/OpportunityHigherGovScreen"));
const PipelineScreen = lazy(() => import("../../screens/PipelineScreen"));

//Market Positioning
const SpendingAnalysisScreen = lazy(() => import("../../screens/SpendingAnalysisScreen"));
const PastPerformanceScreen = lazy(() => import("../../screens/PastPerformanceScreen"));
const CertificationScreen = lazy(() => import("../../screens/CertificationScreen"));
// agency
const AgencyAnalysisScreen = lazy(() => import("../../screens/AgencyAnalysisScreen"));
const AgencyTreemapScreen = lazy(() => import("../../screens/AgencyTreemapScreen"));

//Regulation
const RegulationManagement = lazy(() => import("../../screens/RegulationManagement"));

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
					path='swot'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<SwotScreen />
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
				{/* Agency */}
				<Route
					path='agency-overview'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<AgencyTreemapScreen />
						</Suspense>
					}
				/>

				<Route
					path='agency-analysis'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<AgencyAnalysisScreen />
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
					path='hg'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<OpportunityHigherGovScreen />
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

				{/* Management */}

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
				<Route
					path='settings'
					element={
						<ProtectedRoute requiredGroups={["COMPANY_ADMIN", "GOVLYNK_ADMIN"]}>
							<SettingsScreen />
						</ProtectedRoute>
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

				{/* Add this route to handle Zoho callback */}
				<Route path='/auth/zoho/callback' element={<TestScreen />} />

				{/* 404 */}
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default memo(AppRouter); // Memoize the component
