import { Routes, Route } from "react-router-dom";

import ClienSetupScreen from "../../screens/ClientSetupScreen";
import UserScreen from "../../screens/UserScreen";
import CompanyScreen from "../../screens/CompanyScreen";
import TeamScreen from "../../screens/TeamScreen";
import AdminScreen from "../../screens/AdminScreen";
import UserCompanyRoleScreen from "../../screens/UserCompanyRoleScreen";
import ContactsScreen from "../../screens/ContactsScreen";
import ContactAdminScreen from "../../screens/ContactAdminScreen";
import SAMRegistrationScreen from "../../screens/SAMRegistrationScreen";
import OpportunitiesScreen from "../../screens/OpportunitiesScreen";
import SpendingAnalysisScreen from "../../screens/SpendingAnalysisScreen";
import NotFoundPage from "../../screens/NotFoundPage";
import MainLayout from "../layout/MainLayout";
import TodoScreen from "../../screens/TodoScreen";
import AssessmentScreen from "../../screens/AssessmentScreen";

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
				<Route path='admin' element={<AdminScreen />} />
				<Route path='user-company-roles' element={<UserCompanyRoleScreen />} />
				<Route path='client-setup' element={<ClienSetupScreen />} />
				<Route path='contacts' element={<ContactsScreen />} />
				<Route path='contact-admin' element={<ContactAdminScreen />} />
				<Route path='sam' element={<SAMRegistrationScreen />} />
				<Route path='opportunities' element={<OpportunitiesScreen />} />
				<Route path='assessment' element={<AssessmentScreen />} />
				<Route path='spending-analysis' element={<SpendingAnalysisScreen />} />
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default AppRouter;
