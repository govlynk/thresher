import React from "react";
import { Briefcase } from "lucide-react";
import InfoCard from "../InfoCard";
import DataField from "../DataField";

export default function CompanyBusinessSection({ company }) {
	const formatDate = (dateString) => {
		if (!dateString) return null;
		return new Date(dateString).toLocaleDateString();
	};

	return (
		<InfoCard title='Business Information' icon={Briefcase}>
			<DataField label='Company Start Date' value={formatDate(company.companyStartDate)} />
			<DataField label='Entity Start Date' value={formatDate(company.entityStartDate)} />
			<DataField label='Fiscal Year End' value={company.fiscalYearEndCloseDate} />
			<DataField label='State of Incorporation' value={company.stateOfIncorporationCode} />
			<DataField label='Country of Incorporation' value={company.countryOfIncorporationCode} />
		</InfoCard>
	);
}