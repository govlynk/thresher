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
	if (repsAndCerts?.certifications?.fARResponses) {
		regulations.push(...processResponses(repsAndCerts.certifications.fARResponses, REGULATION_TYPES.FAR));
	}

	// Process DFAR responses
	if (repsAndCerts?.certifications?.dFARResponses) {
		regulations.push(...processResponses(repsAndCerts.certifications.dFARResponses, REGULATION_TYPES.DFAR));
	}

	return regulations;
};

const processResponses = (responses, type) => {
	if (!Array.isArray(responses)) return [];

	return responses.map((response) => ({
		type,
		provisionId: response.provisionId,
		listOfAnswers:
			response.listOfAnswers?.map((answer) => ({
				answerId: answer.answerId,
				questionText: answer.questionText,
				answerText: answer.answerText,
				section: answer.section,
			})) || [],
	}));
};

export const processDocumentLinks = (repsAndCerts) => {
	const api_key = import.meta.env.VITE_SAM_API_KEY;
	if (!api_key) {
		console.error("SAM API key is not configured");
		return {
			farPDF: null,
			dfarPDF: null,
		};
	}

	const pdfLinks = repsAndCerts?.pdfLinks || {};

	return {
		farPDF: pdfLinks.farPDF?.replace("REPLACE_WITH_API_KEY", api_key) || null,
		dfarPDF: pdfLinks.farAndDfarsPDF?.replace("REPLACE_WITH_API_KEY", api_key) || null,
	};
};
