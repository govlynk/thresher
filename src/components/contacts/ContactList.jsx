import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from "@mui/material";
import { Edit, Trash2 } from "lucide-react";

export function ContactList({ contacts, onEditContact, onDeleteContact }) {
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Phone</TableCell>
						<TableCell>Title</TableCell>
						<TableCell align='right'>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{contacts.map((contact) => (
						<TableRow key={contact.id} hover>
							<TableCell>
								{contact.firstName} {contact.lastName}
							</TableCell>
							<TableCell>{contact.contactEmail}</TableCell>
							<TableCell>{contact.contactMobilePhone || contact.contactBusinessPhone}</TableCell>
							<TableCell>{contact.title}</TableCell>
							<TableCell align='right'>
								<IconButton onClick={() => onEditContact(contact)} size='small'>
									<Edit size={18} />
								</IconButton>
								<IconButton onClick={() => onDeleteContact(contact.id)} size='small' color='error'>
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
