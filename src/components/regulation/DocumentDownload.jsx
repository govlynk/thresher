import React from "react";
import { Button, Tooltip, Box } from "@mui/material";
import { Download } from "lucide-react";

export function DocumentDownload({ pdfLinks }) {
	const handleDownload = (url) => {
		if (url) {
			window.open(url, "_blank");
		}
	};

	return (
		<Box>
			<Tooltip title='Download FAR/DFAR Documentation'>
				<span>
					<Button
						variant='contained'
						startIcon={<Download size={20} />}
						onClick={() => handleDownload(pdfLinks?.farPDF)}
						disabled={!pdfLinks?.farPDF}
					>
						Download Documents
					</Button>
				</span>
			</Tooltip>
		</Box>
	);
}
