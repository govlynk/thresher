import React from "react";
import { Briefcase } from "lucide-react";
import InfoCard from "../InfoCard";
import DataField from "../DataField";
import { formatDate } from "../../../utils/formatters";

export default function CompanyBusinessSection({ company }) {
	return (
		<InfoCard title='Business Information' icon={Briefcase}>
			<DataField label='Entity Start Date' value={formatDate(company.entityStartDate)} />
			<DataField label='Fiscal Year End' value={formatDate(company.fiscalYearEndCloseDate)} />
			<DataField label='State of Incorporation' value={company.stateOfIncorporationCode} />
			<DataField label='Country of Incorporation' value={company.countryOfIncorporationCode} />
			<DataField label='Disaster Registry' value={company.disasterRegistryFlag ? "Yes" : "No"} />
		</InfoCard>
	);
}
