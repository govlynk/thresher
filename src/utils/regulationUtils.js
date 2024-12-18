export const REGULATION_TYPES = {
	FAR: "FAR",
	DFAR: "DFAR",
};

export const DOCUMENT_TYPES = {
	FAR: "FAR",
	DFAR: "DFAR",
	COMBINED: "COMBINED",
};

export const processRegulationResponses = (repsAndCerts) => {
	const regulations = [];

	// Process FAR responses
	if (repsAndCerts.repsAndCerts?.certifications?.FARResponses) {
		regulations.push(
			...processResponses(repsAndCerts.repsAndCerts.certifications.FARResponses, REGULATION_TYPES.FAR)
		);
	}

	// Process DFAR responses
	if (repsAndCerts.repsAndCerts?.certifications?.dFARResponses) {
		regulations.push(
			...processResponses(repsAndCerts.repsAndCerts.certifications.dFARResponses, REGULATION_TYPES.DFAR)
		);
	}

	return regulations;
};

const processResponses = (responses, type) => {
	return responses.map((response) => ({
		type,
		provisionId: response.provisionId,
		answers: response.listOfAnswers.map((answer) => ({
			answerId: answer.answerId,
			questionText: answer.questionText,
			answerText: answer.answerText,
			section: answer.section,
		})),
	}));
};

export const processDocumentLinks = (repsAndCerts) => {
	const { pdfLinks } = repsAndCerts.repsAndCerts.certifications;
	return {
		farPdf: pdfLinks?.farPDF || null,
		dfarPdf: pdfLinks?.farAndDfarsPDF || null,
	};
};
