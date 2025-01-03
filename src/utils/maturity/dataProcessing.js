export function processAssessmentData(answers) {
	if (!answers) return [];

	// Define dimensions and their corresponding questions
	const dimensions = {
		compliance: ["farCompliance", "supplyChainSecurity", "taaCompliance"],
		marketReadiness: ["federalPresence"],
		financialHealth: ["contractCapacity"],
		operationalExcellence: ["qualityManagement", "deliveryCapabilities"],
		businessDevelopment: ["pipelineManagement"],
		technicalInfrastructure: ["cybersecurity", "systemsCompliance"],
	};

	// Calculate average scores for each dimension
	const dimensionScores = Object.entries(dimensions).map(([dimension, questions]) => {
		const scores = {
			dimension: dimension.charAt(0).toUpperCase() + dimension.slice(1),
			current: calculateDimensionScore(answers[dimension], questions),
			target: 5, // Set target level
			benchmark: 4, // Set industry benchmark
		};
		return scores;
	});

	return dimensionScores;
}

function calculateDimensionScore(dimensionAnswers, questions) {
	if (!dimensionAnswers) return 0;

	let totalScore = 0;
	let count = 0;

	questions.forEach((question) => {
		const answer = dimensionAnswers[question];
		if (answer) {
			if (typeof answer === "number") {
				totalScore += answer;
				count++;
			} else if (Array.isArray(answer)) {
				// Handle array responses (e.g., multiple choice)
				totalScore += answer.length / 5; // Normalize to 5-point scale
				count++;
			}
		}
	});

	return count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0;
}
