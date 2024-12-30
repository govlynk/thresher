import React from "react";
import { Box, Typography, Drawer, IconButton, Divider, Chip, Link } from "@mui/material";
import { CircleX, Building2, Calendar, MapPin, DollarSign, Mail, Phone, Tag, ExternalLink } from "lucide-react";
import { formatDate, formatCurrency } from "../../utils/formatters";

export function OpportunityDetailsSidebar({ open, onClose, opportunity }) {
	const renderSection = (title, content, icon) => (
		<Box sx={{ mb: 3 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
				{icon}
				<Typography variant='subtitle2' color='text.secondary'>
					{title}
				</Typography>
			</Box>
			<Typography variant='body1'>{content}</Typography>
		</Box>
	);

	const renderContactInfo = (contact) => (
		<Box sx={{ mb: 2 }}>
			<Typography variant='body2'>
				<strong>{contact.pocType}:</strong> {contact.pocName}
			</Typography>
			{contact.pocEmail && (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Mail size={16} />
					<Link href={`mailto:${contact.pocEmail}`}>{contact.pocEmail}</Link>
				</Box>
			)}
			{contact.pocPhone && (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Phone size={16} />
					<Typography variant='body2'>{contact.pocPhone}</Typography>
				</Box>
			)}
		</Box>
	);

	return (
		<Drawer
			anchor='right'
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: { width: "600px" },
			}}
		>
			<Box sx={{ p: 3 }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
					<Typography variant='h6'>Opportunity Details</Typography>
					<IconButton onClick={onClose}>
						<CircleX />
					</IconButton>
				</Box>

				<Divider sx={{ mb: 3 }} />

				<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
					{/* Title and Notice ID */}
					<Box>
						<Typography variant='h5' gutterBottom>
							{opportunity.title}
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							Notice ID: {opportunity.noticeId}
						</Typography>
					</Box>

					{/* Type and Set-Aside */}
					<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
						<Chip label={opportunity.type} color='primary' />
						{opportunity.typeOfSetAside && <Chip label={opportunity.typeOfSetAside} color='secondary' />}
					</Box>

					{/* Department Info */}
					{renderSection(
						"Department Information",
						<Box>
							<Typography variant='body1'>{opportunity.department}</Typography>
							<Typography variant='body2' color='text.secondary'>
								{opportunity.subtier}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								{opportunity.office}
							</Typography>
						</Box>,
						<Building2 size={20} />
					)}

					{/* Dates */}
					{renderSection(
						"Important Dates",
						<Box>
							<Typography variant='body2'>
								<strong>Posted:</strong> {formatDate(opportunity.postedDate)}
							</Typography>
							<Typography variant='body2'>
								<strong>Response Deadline:</strong>{" "}
								<Box component='span' color='error.main'>
									{formatDate(opportunity.responseDeadLine)}
								</Box>
							</Typography>
						</Box>,
						<Calendar size={20} />
					)}

					{/* Location */}
					{opportunity.placeOfPerformance &&
						renderSection(
							"Place of Performance",
							`${opportunity.placeOfPerformance.state?.name || ""}, 
             ${opportunity.placeOfPerformance.country?.name || ""}`,
							<MapPin size={20} />
						)}

					{/* Award Amount */}
					{opportunity.award?.amount &&
						renderSection("Award Amount", formatCurrency(opportunity.award.amount), <DollarSign size={20} />)}

					{/* NAICS Codes */}
					{opportunity.naicsCode &&
						renderSection(
							"NAICS Codes",
							<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
								{opportunity.naicsCodes?.map((code, index) => (
									<Chip key={index} icon={<Tag size={14} />} label={code} variant='outlined' size='small' />
								))}
							</Box>,
							<Tag size={20} />
						)}

					{/* Points of Contact */}
					<Box>
						<Typography variant='subtitle2' color='text.secondary' sx={{ mb: 2 }}>
							Points of Contact
						</Typography>
						{opportunity.pointOfContact?.map((contact, index) => (
							<Box key={index}>
								{renderContactInfo(contact)}
								{index < opportunity.pointOfContact.length - 1 && <Divider sx={{ my: 1 }} />}
							</Box>
						))}
					</Box>

					{/* Description */}
					{opportunity.description && (
						<Box>
							<Typography variant='subtitle2' color='text.secondary' gutterBottom>
								Description
							</Typography>
							<Typography
								variant='body2'
								sx={{
									whiteSpace: "pre-wrap",
									bgcolor: "background.default",
									p: 2,
									borderRadius: 1,
								}}
							>
								{opportunity.description}
							</Typography>
						</Box>
					)}

					{/* Links */}
					<Box>
						<Typography variant='subtitle2' color='text.secondary' gutterBottom>
							Resource Links
						</Typography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
							{opportunity.resourceLinks?.map((link, index) => (
								<Link
									key={index}
									href={link}
									target='_blank'
									rel='noopener noreferrer'
									sx={{ display: "flex", alignItems: "center", gap: 1 }}
								>
									<ExternalLink size={16} />
									Resource {index + 1}
								</Link>
							))}
						</Box>
					</Box>
				</Box>
			</Box>
		</Drawer>
	);
}
