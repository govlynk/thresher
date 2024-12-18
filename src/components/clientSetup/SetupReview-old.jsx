import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Alert, CircularProgress, Button, Divider, useTheme } from "@mui/material";
import { ArrowLeft, Check } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import { useCompanyStore } from "../../stores/companyStore";
import { useUserStore } from "../../stores/userStore";
import { useTeamStore } from "../../stores/teamStore";
import { useTeamMemberStore } from "../../stores/teamMemberStore";
import { useUserCompanyAccessStore } from "../../stores/userCompanyAccessStore";
import { useAuthStore } from "../../stores/authStore";
import { useGlobalStore } from "../../stores/globalStore";

const client = generateClient();

export function SetupReview({ setupData, onBack, onComplete }) {
	const theme = useTheme();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const { addCompany } = useCompanyStore();
	const { addUser } = useUserStore();
	const { addTeam } = useTeamStore();
	const { addTeamMember } = useTeamMemberStore();
	const { addUserCompanyAccess } = useUserCompanyAccessStore();
	const { user } = useAuthStore();
	// const { setActiveCompany, setActiveTeam, setActiveUser } = useGlobalStore();
	const [newCompany, setCompany] = useState(null);
	const [newTeam, setTeam] = useState(null);
	const [newUser, setUser] = useState([]);
	const [newContact, setContact] = useState([]);

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

			// 1. Create Company
			const companyData = {
				legalBusinessName: setupData.company.legalBusinessName.trim(),
				dbaName: setupData.company.dbaName?.trim() || null,
				uei: setupData.company.uei.trim(),
				cageCode: setupData.company.cageCode || null,
				ein: setupData.company.ein || null,
				status: "ACTIVE",

				activationDate: setupData.company.activationDate
					? new Date(setupData.company.activationDate).toISOString()
					: null,
				shippingAddressStreetLine1: setupData.company.shippingAddressStreetLine1 || null,
				shippingAddressStreetLine2: setupData.company.shippingAddressStreetLine2 || null,
				shippingAddressCity: setupData.company.shippingAddressCity || null,
				shippingAddressStateCode: setupData.company.shippingAddressStateCode || null,
				shippingAddressZipCode: setupData.company.shippingAddressZipCode || null,
				shippingAddressCountryCode: setupData.company.shippingAddressCountryCode || null,
				billingAddressCity: setupData.company.billingAddressCity || null,
				billingAddressCountryCode: setupData.company.billingAddressCountryCode || null,
				billingAddressStateCode: setupData.company.billingAddressStateCode || null,
				billingAddressStreetLine1: setupData.company.billingAddressStreetLine1 || null,
				billingAddressStreetLine2: setupData.company.billingAddressStreetLine2 || null,
				billingAddressZipCode: setupData.company.billingAddressZipCode || null,

				companyStartDate: setupData.company.companyStartDate
					? new Date(setupData.company.companyStartDate).toISOString()
					: null,
				congressionalDistrict: setupData.company.congressionalDistrict || null,
				coreCongressionalDistrict: setupData.company.coreCongressionalDistrict || null,
				countryOfIncorporationCode: setupData.company.countryOfIncorporationCode || null,
				entityDivisionName: setupData.company.entityDivisionName || null,
				entityStartDate: setupData.company.entityStartDate
					? new Date(setupData.company.entityStartDate).toISOString()
					: null,
				entityStructureDesc: setupData.company.entityStructureDesc || null,
				entityTypeDesc: setupData.company.entityTypeDesc || null,
				exclusionStatusFlag: setupData.company.exclusionStatusFlag || null,
				expirationDate: setupData.company.expirationDate
					? new Date(setupData.company.expirationDate).toISOString()
					: null,
				fiscalYearEndCloseDate: setupData.company.fiscalYearEndCloseDate
					? new Date(setupData.company.fiscalYearEndCloseDate).toISOString()
					: null,
				lastUpdateDate: setupData.company.lastUpdateDate
					? new Date(setupData.company.lastUpdateDate).toISOString()
					: null,

				companyEmail: setupData.company.companyEmail || setupData.user.contactEmail || null,
				companyPhoneNumber: setupData.company.companyPhoneNumber || setupData.user.contactBusinessPhone || null,
				companyWebsite: setupData.company.entityURL
					? setupData.company.entityURL.startsWith("http")
						? setupData.company.entityURL
						: `https://${setupData.company.entityURL}`
					: null,
				organizationStructureDesc: setupData.company.organizationStructureDesc || null,
				profitStructureDesc: setupData.company.profitStructureDesc || null,
				//
				registrationDate: setupData.company.registrationDate
					? new Date(setupData.company.registrationDate).toISOString()
					: null,
				//
				registrationExpirationDate: setupData.company.registrationExpirationDate
					? new Date(setupData.company.registrationExpirationDate).toISOString()
					: null,

				registrationStatus: setupData.company.registrationStatus || null,
				purposeOfRegistrationDesc: setupData.company.purposeOfRegistrationDesc || null,

				submissionDate: setupData.company.submissionDate
					? new Date(setupData.company.submissionDate).toISOString()
					: null,
				SAMPullDate: new Date().toISOString(),

				naicsCode: setupData.company.naicsCode || [],
				primaryNaics: setupData.company.primaryNaics || null,
			};

			console.log("Creating company with data:", companyData);
			const company = await addCompany(companyData);
			console.log("Company created:", company);

			if (!company.data?.id) {
				throw new Error("Failed to create company");
			}
			setCompany(company.data.id);

			// 2. Create Contact
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
				notes: `Initial contact created during company setup. Role: ${setupData.user.roleId}`,
				companyId: company.data?.id,
			};

			console.log("Creating contact with data:", contactData);
			const contact = await client.models.Contact.create(contactData);
			console.log("Contact created:", contact);

			if (!contact?.data?.id) {
				throw new Error("Failed to create contact");
			}

			// 3. Create User
			const userData = {
				cognitoId: setupData.user.cognitoId || null,
				email: setupData.user.contactEmail,
				name: `${setupData.user.firstName} ${setupData.user.lastName}`,
				phone: setupData.user.contactBusinessPhone || setupData.user.contactMobilePhone || null,
				contactId: contact.data.id,
				status: "ACTIVE",
				lastLogin: new Date().toISOString(),
			};

			console.log("Creating user with data:", userData);
			const newUser = await addUser(userData);
			console.log("User created:", newUser);

			if (!newUser?.id) {
				throw new Error("Failed to create user");
			}
			setActiveUser(newUser.id);

			// 4. Create Team
			const teamData = {
				name: setupData.team.name,
				description: setupData.team.description,
				companyId: company.data.id,
			};

			console.log("Creating team with data:", teamData);
			const team = await addTeam(teamData);
			console.log("Team created:", team);

			if (!team?.id) {
				throw new Error("Failed to create team");
			}
			setActiveTeam(team.id);

			// 5. Create Team Member
			const teamMemberData = {
				teamId: team.id,
				contactId: contact.data.id,
				role: setupData.user.roleId,
			};

			console.log("Creating team member with data:", teamMemberData);
			const teamMember = await addTeamMember(teamMemberData);
			console.log("Team member created:", teamMember);

			// 6. Create User Company Role
			const UserCompanyAccessData = {
				userId: newUser.id,
				companyId: company.data.id,
				access: setupData.user.accessLevel,
				status: "ACTIVE",
			};

			console.log("Creating user company access with data:", UserCompanyAccessData);
			const UserCompanyAccess = await addUserCompanyAccess(UserCompanyAccessData);
			console.log("User company access created:", UserCompanyAccess);

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
