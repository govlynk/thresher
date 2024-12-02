import React from "react";
import {
	Box,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import { Edit, Trash2, Mail, Phone } from "lucide-react";

export function ContactList({ contacts, onEditContact, onDeleteContact }) {
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Mobile Phone</TableCell>
						<TableCell>Business Phone</TableCell>
						<TableCell align='right'>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{contacts.map((contact) => (
						<TableRow key={contact.id} hover>
							<TableCell>{`${contact.firstName} ${contact.lastName}`}</TableCell>
							<TableCell>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Mail size={16} />
									{contact.contactEmail}
								</Box>
							</TableCell>
							<TableCell>
								{contact.contactMobilePhone ? (
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Phone size={16} />
										{contact.contactMobilePhone}
									</Box>
								) : (
									"-"
								)}
							</TableCell>
							<TableCell>
								{contact.contactBusinessPhone ? (
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Phone size={16} />
										{contact.contactBusinessPhone}
									</Box>
								) : (
									"-"
								)}
							</TableCell>
							<TableCell align='right'>
								<IconButton onClick={() => onEditContact(contact)} size='small' aria-label='Edit contact'>
									<Edit size={18} />
								</IconButton>
								<IconButton
									onClick={() => onDeleteContact(contact.id)}
									size='small'
									color='error'
									aria-label='Delete contact'
								>
									<Trash2 size={18} />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
