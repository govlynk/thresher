import React from "react";
import { Grid } from "@mui/material";
import CompanyInfoSection from "./sections/CompanyInfoSection";
import CompanyContactSection from "./sections/CompanyContactSection";
import CompanyAddressSection from "./sections/CompanyAddressSection";
import CompanyBusinessSection from "./sections/CompanyBusinessSection";
import CompanyStructureSection from "./sections/CompanyStructureSection";
import CompanyNaicsSection from "./sections/CompanyNaicsSection";
import CompanyCertificationsSection from "./sections/CompanyCertificationsSection";
import CompanyPscSection from "./sections/CompanyPSCSection";
import CompanySbaSection from "./sections/CompanySbaSection";

export default function CompanyDetailsGrid({ company }) {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={6}>
				<CompanyInfoSection company={company} />
			</Grid>

			<Grid item xs={12} md={6}>
				<CompanyContactSection company={company} />
			</Grid>

			<Grid item xs={12} md={6}>
				<CompanyAddressSection
					title='Physical Address'
					address={{
						line1: company.shippingAddressStreetLine1,
						line2: company.shippingAddressStreetLine2,
						city: company.shippingAddressCity,
						state: company.shippingAddressStateCode,
						zip: company.shippingAddressZipCode,
						country: company.shippingAddressCountryCode,
					}}
				/>
			</Grid>

			<Grid item xs={12} md={6}>
				<CompanyAddressSection
					title='Mailing Address'
					address={{
						line1: company.billingAddressStreetLine1,
						line2: company.billingAddressStreetLine2,
						city: company.billingAddressCity,
						state: company.billingAddressStateCode,
						zip: company.billingAddressZipCode,
						country: company.billingAddressCountryCode,
					}}
				/>
			</Grid>

			<Grid item xs={12} md={6}>
				<CompanyBusinessSection company={company} />
			</Grid>

			<Grid item xs={12} md={6}>
				<CompanyStructureSection company={company} />
			</Grid>

			<Grid item xs={12} md={6}>
				<CompanyPscSection company={company} />
			</Grid>

			{company.naicsCode?.length > 0 && (
				<Grid item xs={12} md={6}>
					<CompanyNaicsSection company={company} />
				</Grid>
			)}

			{company.sbaBusinessTypeDesc?.length > 0 && (
				<Grid item xs={12} md={6}>
					<CompanySbaSection company={company} />
				</Grid>
			)}

			{company.sbaCertificationEntryDate?.length > 0 && (
				<Grid item xs={12} md={6}>
					<CompanyCertificationsSection company={company} />
				</Grid>
			)}
		</Grid>
	);
}
