// src/components/regulation/DocumentDownload.jsx
import React from "react";
import { Button } from "@mui/material";
import { Download } from "lucide-react";
import { useDocumentStore } from "../../stores/regulation/documentationStore";

export function DocumentDownload() {
	const { documents } = useDocumentStore();

	const handleDownload = (url) => {
		if (url) {
			window.open(url, "_blank");
		}
	};

	return (
		<Button
			variant='contained'
			startIcon={<Download />}
			onClick={() => handleDownload(documents?.farPdf)}
			disabled={!documents?.farPdf}
		>
			Download Documents
		</Button>
	);
}
