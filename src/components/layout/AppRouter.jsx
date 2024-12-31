import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import NotFoundPage from "../../screens/NotFoundPage";

// Lazy load screens for better performance
import React, { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import StrategicPositioiningForm from "../marketPositioning/StrategicPositioningForm";

// Loading component for suspense fallback
const LoadingScreen = () => (
	<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
		<CircularProgress />
	</Box>
);

// Lazy loaded components
const TodoScreen = lazy(() => import("../../screens/TodoScreen"));

const SAMRegistrationScreen = lazy(() => import("../../screens/SAMRegistrationScreen"));
const OpportunitiesScreen = lazy(() => import("../../screens/OpportunitiesScreen"));
const PipelineScreen = lazy(() => import("../../screens/PipelineScreen"));

const SpendingAnalysisScreen = lazy(() => import("../../screens/SpendingAnalysisScreen"));
const AssessmentScreen = lazy(() => import("../../screens/AssessmentScreen"));
const StrategicPositioiningScreen = lazy(() => import("../../screens/StrategicPositioiningScreen"));

const MaturityAssessmentScreen = lazy(() => import("../../screens/MaturityAssessmentScreen"));
const CapabilityStatementScreen = lazy(() => import("../../screens/CapabilityStatementScreen"));

const RegulationManagement = lazy(() => import("../../screens/RegulationManagement"));
const FileBrowserScreen = lazy(() => import("../../screens/FileBrowserScreen"));

const ClientSetupScreen = lazy(() => import("../../screens/ClientSetupScreen"));
const UserScreen = lazy(() => import("../../screens/UserScreen"));
const CompanyScreen = lazy(() => import("../../screens/CompanyScreen"));
const TeamScreen = lazy(() => import("../../screens/TeamScreen"));
const UserCompanyAccessScreen = lazy(() => import("../../screens/UserCompanyAccessScreen"));
const ContactsScreen = lazy(() => import("../../screens/ContactsScreen"));
const ContactAdminScreen = lazy(() => import("../../screens/ContactAdminScreen"));
const TestScreen = lazy(() => import("../../screens/TestScreen"));

const AppRouter = ({ signOut, user }) => {
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
				{/* Market Positioning Routes */}
				<Route
					path='strategy'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<StrategicPositioiningScreen />
						</Suspense>
					}
				/>

				{/* Market Intelligence Routes */}
				<Route
					path='spending-analysis'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<SpendingAnalysisScreen />
						</Suspense>
					}
				/>

				{/* Sales Routes */}
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

				{/* Management Routes */}
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
					path='company/:companyId/team'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<TeamScreen />
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

				{/* Administration Routes */}
				<Route
					path='user-company-access'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<UserCompanyAccessScreen />
						</Suspense>
					}
				/>
				<Route
					path='client-setup'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<ClientSetupScreen />
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

				{/* Profile Routes */}
				<Route
					path='sam'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<SAMRegistrationScreen />
						</Suspense>
					}
				/>
				<Route
					path='assessment'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<AssessmentScreen />
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
					path='capability'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<CapabilityStatementScreen />
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

				{/* Development Routes */}
				<Route
					path='test'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<TestScreen />
						</Suspense>
					}
				/>

				{/* 404 Route */}
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default AppRouter;
