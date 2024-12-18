import { Routes, Route } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import NotFoundPage from "../../screens/NotFoundPage";

import ClienSetupScreen from "../../screens/ClientSetupScreen";
import UserScreen from "../../screens/UserScreen";
import CompanyScreen from "../../screens/CompanyScreen";
import TeamScreen from "../../screens/TeamScreen";
import UserCompanyAccessScreen from "../../screens/UserCompanyAccessScreen";
import ContactsScreen from "../../screens/ContactsScreen";
import ContactAdminScreen from "../../screens/ContactAdminScreen";
import SAMRegistrationScreen from "../../screens/SAMRegistrationScreen";
import OpportunitiesScreen from "../../screens/OpportunitiesScreen";
import TodoScreen from "../../screens/TodoScreen";
import PipelineScreen from "../../screens/PipelineScreen";
import SpendingAnalysisScreen from "../../screens/SpendingAnalysisScreen";
import AssessmentScreen from "../../screens/AssessmentScreen";
import CapabilityStatementScreen from "../../screens/CapabilityStatementScreen";
import RegulationManagement from "../../screens/RegulationManagement";
import TestScreen from "../../screens/TestScreen";

const AppRouter = ({ signOut, user }) => {
	return (
		<Routes>
			<Route path='/' element={<MainLayout signOut={signOut} />}>
				<Route index element={<TodoScreen />} />
				<Route path='todos' element={<TodoScreen />} />
				<Route path='user-admin' element={<UserScreen />} />
				<Route path='company' element={<CompanyScreen />} />
				<Route path='company/:companyId/team' element={<TeamScreen />} />
				<Route path='team' element={<TeamScreen />} />
				<Route path='user-company-access' element={<UserCompanyAccessScreen />} />
				<Route path='client-setup' element={<ClienSetupScreen />} />
				<Route path='contacts' element={<ContactsScreen />} />
				<Route path='contact-admin' element={<ContactAdminScreen />} />
				<Route path='sam' element={<SAMRegistrationScreen />} />
				<Route path='opportunities' element={<OpportunitiesScreen />} />
				<Route path='assessment' element={<AssessmentScreen />} />
				<Route path='capability' element={<CapabilityStatementScreen />} />
				<Route path='spending-analysis' element={<SpendingAnalysisScreen />} />
				<Route path='pipeline' element={<PipelineScreen />} />
				<Route path='test' element={<TestScreen />} />
				<Route path='far' element={<RegulationManagement />} />
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default AppRouter;
