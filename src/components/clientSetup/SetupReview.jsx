import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Alert, CircularProgress, Button, Divider, useTheme } from "@mui/material";
import { ArrowLeft, Check } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import { useCompanyStore } from "../../stores/companyStore";
import { useUserStore } from "../../stores/userStore";
import { useTeamStore } from "../../stores/teamStore";
import { useUserCompanyRoleStore } from "../../stores/userCompanyRoleStore";
import { useAuthStore } from "../../stores/authStore";

const client = generateClient();

export function SetupReview({ setupData, onBack, onComplete }) {
	const theme = useTheme();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const { addCompany } = useCompanyStore();
	const { addUser } = useUserStore();
	const { addTeam } = useTeamStore();
	const { addUserCompanyRole } = useUserCompanyRoleStore();
	const { user } = useAuthStore();

	const handleSetup = async () => {
		setLoading(true);
		setError(null);
		console.log("++++++Starting setup process with data:", setupData);

		try {
			if (!user?.sub) {
				throw new Error("User not authenticated");
			}

			if (!setupData?.company || !setupData?.user || !setupData?.team) {
				throw new Error("Missing required setup data");
			}

			const companyData = {
				// Basic Information
				legalBusinessName: setupData.company.legalBusinessName,
				dbaName: setupData.company.dbaName || null,
				uei: setupData.company.uei,
				cageCode: setupData.company.cageCode || null,
				ein: setupData.company.ein || null,
				status: "ACTIVE",

				// Contact Information
				companyEmail: setupData.company.companyEmail || setupData.user.contactEmail || null,
				companyPhoneNumber: setupData.company.companyPhoneNumber || setupData.user.contactBusinessPhone || null,
				companyWebsite: setupData.company.entityURL
					? setupData.company.entityURL.startsWith("http")
						? setupData.company.entityURL
						: `https://${setupData.company.entityURL}`
					: null,

				// Physical Address (Shipping)
				shippingAddressStreetLine1: setupData.company.shippingAddressStreetLine1 || null,
				shippingAddressStreetLine2: setupData.company.shippingAddressStreetLine2 || null,
				shippingAddressCity: setupData.company.shippingAddressCity || null,
				shippingAddressStateCode: setupData.company.shippingAddressStateCode || null,
				shippingAddressZipCode: setupData.company.shippingAddressZipCode || null,
				shippingAddressCountryCode: setupData.company.shippingAddressCountryCode || null,

				// Mailing Address (Billing)
				billingAddressStreetLine1: setupData.company.billingAddressStreetLine1 || null,
				billingAddressStreetLine2: setupData.company.billingAddressStreetLine2 || null,
				billingAddressCity: setupData.company.billingAddressCity || null,
				billingAddressStateCode: setupData.company.billingAddressStateCode || null,
				billingAddressZipCode: setupData.company.billingAddressZipCode || null,
				billingAddressCountryCode: setupData.company.billingAddressCountryCode || null,

				// Business Information
				companyStartDate: new Date(setupData.company.companyStartDate).toISOString() || null,
				entityStartDate: new Date(setupData.company.entityStartDate).toISOString() || null,
				entityDivisionName: setupData.company.entityDivisionName || null,
				entityStructureDesc: setupData.company.entityStructureDesc || null,
				entityTypeDesc: setupData.company.entityTypeDesc || null,
				organizationStructureDesc: setupData.company.organizationStructureDesc || null,
				profitStructureDesc: setupData.company.profitStructureDesc || null,

				// Registration Information
				registrationDate: new Date(setupData.company.registrationDate).toISOString() || null,
				registrationExpirationDate: new Date(setupData.company.registrationExpirationDate).toISOString() || null,
				registrationStatus: setupData.company.registrationStatus || null,
				purposeOfRegistrationDesc: setupData.company.purposeOfRegistrationDesc || null,
				submissionDate: new Date(setupData.company.submissionDate).toISOString() || null,
				lastUpdateDate: new Date(setupData.company.lastUpdateDate).toISOString() || null,
				SAMPullDate: new Date().toISOString(),

				// Location Information
				congressionalDistrict: setupData.company.congressionalDistrict || null,
				coreCongressionalDistrict: setupData.company.coreCongressionalDistrict || null,
				stateOfIncorporationCode: setupData.company.stateOfIncorporationCode || null,
				countryOfIncorporationCode: setupData.company.countryOfIncorporationCode || null,

				// Business Classifications
				primaryNaics: setupData.company.primaryNaics || null,
				naicsCode: setupData.company.naicsCode || [],
				pscCode: setupData.company.pscCode || [],
				sbaBusinessTypeDesc: setupData.company.sbaBusinessTypeDesc || [],
				// certificationEntryDate: new Date(setupData.company.certificationEntryDate).toISOString() || [],

				// Additional Information
				fiscalYearEndCloseDate: new Date(setupData.company.fiscalYearEndCloseDate).toISOString() || null,
				exclusionStatusFlag: setupData.company.exclusionStatusFlag || null,
				expirationDate: new Date(setupData.company.expirationDate).toISOString() || null,
				activationDate: new Date(setupData.company.activationDate).toISOString() || null,
			};

			console.log("Creating company with data:", companyData);
			const companyResponse = await client.models.Company.create(companyData);
			console.log("Company created:", companyResponse);

			if (!companyResponse?.data?.id) {
				throw new Error("Failed to create company");
			}
			const companyId = companyResponse.data.id;
			// 2. Create contact
			const contactData = {
				firstName: setupData.user.firstName,
				lastName: setupData.user.lastName,
				title: setupData.user.title || null,
				department: setupData.user.department || null,
				contactEmail: setupData.user.contactEmail,
				contactMobilePhone: setupData.user.contactMobilePhone || null,
				contactBusinessPhone: setupData.user.contactBusinessPhone || null,
				workAddressStreetLine1: setupData.user.workAddressStreetLine1 || null,
				workAddressStreetLine2: setupData.user.workAddressStreetLine2 || null,
				workAddressCity: setupData.user.workAddressCity || null,
				workAddressStateCode: setupData.user.workAddressStateCode || null,
				workAddressZipCode: setupData.user.workAddressZipCode || null,
				workAddressCountryCode: setupData.user.workAddressCountryCode || "USA",
				dateLastContacted: new Date().toISOString(),
				notes: `Initial contact created during company setup. Role: ${setupData.user.role}`,
				companyId: companyId,
			};

			console.log("Creating contact with data:", contactData);
			const contactResponse = await client.models.Contact.create(contactData);
			console.log("Created contact:", contactResponse);

			const contactId = contactResponse.data.id;

			// 3. Create user
			const userData = {
				cognitoId: setupData.user.cognitoId || user.sub,
				email: setupData.user.contactEmail,
				name: `${setupData.user.firstName} ${setupData.user.lastName}`,
				phone: setupData.user.contactBusinessPhone || setupData.user.contactMobilePhone || null,
				status: "ACTIVE",
				lastLogin: new Date().toISOString(),
			};

			console.log("Creating user with data:", userData);
			const userResponse = await client.models.User.create(userData);
			console.log("User created:", userResponse);

			const userId = userResponse.data.id;

			// 4. Create team
			console.log("Creating team with data:", setupData.team);
			const teamData = {
				name: setupData.team.name,
				description: setupData.team.description,
				companyId: companyId,
			};

			console.log("Creating team with data:", teamData);
			const teamResponse = await client.models.Team.create(teamData);
			console.log("Team created:", teamResponse);

			// 5. Create user-company role
			const userCompanyRoleData = {
				userId: userId,
				companyId: companyId,
				roleId: setupData.user.roleId,
				status: "ACTIVE",
			};

			console.log("Creating user-company role with data:", userCompanyRoleData);
			const userCompanyRole = await client.models.UserCompanyRole.create(userCompanyRoleData);
			console.log("User-company role created:", userCompanyRole);

			setSuccess(true);
			if (onComplete) {
				onComplete();
			}
		} catch (err) {
			console.error("Setup error:", err);
			setError(err.message || "Failed to complete setup");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box>
			<Typography variant='h5'>Setup Review</Typography>
			<Paper elevation={3} sx={{ p: 3, mt: 2 }}>
				<Typography variant='h6'>Company Information</Typography>
				<Divider sx={{ my: 2 }} />
				<Typography>
					<strong>Legal Business Name:</strong> {setupData.company.legalBusinessName}
				</Typography>
				<Typography>
					<strong>DBA Name:</strong> {setupData.company.dbaName || "-"}
				</Typography>
				<Typography>
					<strong>UEI:</strong> {setupData.company.uei}
				</Typography>
				<Typography>
					<strong>CAGE Code:</strong> {setupData.company.cageCode || "-"}
				</Typography>
				<Typography>
					<strong>Company Email:</strong> {setupData.company.companyEmail || "-"}
				</Typography>
				<Typography>
					<strong>Company Phone:</strong> {setupData.company.companyPhoneNumber || "-"}
				</Typography>

				<Divider sx={{ my: 2 }} />
				<Typography variant='h6'>Administrator Information</Typography>
				<Divider sx={{ my: 2 }} />
				<Typography>
					<strong>Name:</strong> {setupData.user.firstName} {setupData.user.lastName}
				</Typography>
				<Typography>
					<strong>Email:</strong> {setupData.user.contactEmail}
				</Typography>
				<Typography>
					<strong>Role:</strong> {setupData.user.roleId}
				</Typography>
				<Typography>
					<strong>Phone:</strong> {setupData.user.contactMobilePhone || "-"}
				</Typography>

				<Divider sx={{ my: 2 }} />
				<Typography variant='h6'>Team Information</Typography>
				<Divider sx={{ my: 2 }} />
				<Typography>
					<strong>Team Name:</strong> {setupData.team.name}
				</Typography>
				<Typography>
					<strong>Description:</strong> {setupData.team.description || "-"}
				</Typography>
			</Paper>

			{error && (
				<Alert severity='error' sx={{ mt: 2 }}>
					{error}
				</Alert>
			)}

			{success && (
				<Alert severity='success' sx={{ mt: 2 }}>
					Setup completed successfully!
				</Alert>
			)}

			<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
				<Button variant='outlined' startIcon={<ArrowLeft />} onClick={onBack} disabled={loading}>
					Back
				</Button>
				<Button
					variant='contained'
					endIcon={loading ? <CircularProgress size={20} /> : <Check />}
					onClick={handleSetup}
					disabled={loading || success}
				>
					{loading ? "Setting up..." : "Complete Setup"}
				</Button>
			</Box>
		</Box>
	);
}
