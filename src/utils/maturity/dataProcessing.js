import { questions } from "../../components/maturity/questions";

export function processAssessmentData(answers) {
	if (!answers)
		return {
			sections: [],
			radarChartData: [],
			overallScore: 0,
		};

	// Process each section
	const sections = questions
		.map((section) => {
			const sectionAnswers = answers[section.id];
			if (!sectionAnswers) return null;

			// Calculate section score
			const score = calculateSectionScore(sectionAnswers, section.questions);

			// Generate section summary
			const summary = generateSectionSummary(sectionAnswers, section.questions);

			return {
				name: section.title,
				id: section.id,
				score,
				summary,
			};
		})
		.filter(Boolean);

	// Format data for radar chart
	const radarChartData = sections.map((section) => ({
		dimension: section.name,
		current: section.score || 0,
		target: 4,
	}));

	// Calculate overall maturity score
	const overallScore = sections.reduce((sum, section) => sum + section.score, 0) / (sections.length || 1);

	return {
		sections,
		radarChartData,
		overallScore: Math.round(overallScore * 10) / 10,
	};
}

function calculateSectionScore(sectionAnswers, questions) {
	let totalScore = 0;
	let totalQuestions = 0;

	questions.forEach((question) => {
		const answer = sectionAnswers[question.id];
		if (!answer) return;

		if (question.type === "likert") {
			const responses = Object.values(answer);
			const score = responses.reduce((sum, val) => sum + getLikertValue(val), 0);
			totalScore += score;
			totalQuestions += responses.length;
		} else if (question.type === "rating") {
			const ratings = Object.values(answer);
			totalScore += ratings.reduce((sum, val) => sum + (val || 0), 0);
			totalQuestions += ratings.length;
		}
	});

	return totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 10) / 10 : 0;
}

function generateSectionSummary(sectionAnswers, questions) {
	const summary = {
		strengths: [],
		weaknesses: [],
		recommendations: [],
	};

	questions.forEach((question) => {
		const answer = sectionAnswers[question.id];
		if (!answer) return;

		if (question.type === "likert") {
			Object.entries(answer).forEach(([statement, response]) => {
				const score = getLikertValue(response);
				if (score >= 4) {
					summary.strengths.push(statement);
				} else if (score <= 2) {
					summary.weaknesses.push(statement);
					summary.recommendations.push(generateRecommendation(statement, question));
				}
			});
		}
	});

	return summary;
}

function getLikertValue(response) {
	const likertValues = {
		"Strongly Disagree": 1,
		Disagree: 2,
		Neutral: 3,
		Agree: 4,
		"Strongly Agree": 5,
		Initial: 1,
		Developing: 2,
		Defined: 3,
		Managed: 4,
		Optimized: 5,
	};

	return likertValues[response] || 3;
}

function generateRecommendation(statement, question) {
	const recommendations = {
		farCompliance: "Consider implementing a formal FAR compliance program",
		supplyChainSecurity: "Establish documented supply chain security procedures",
		qualityManagement: "Implement quality management system certification",
		cybersecurity: "Develop comprehensive cybersecurity policies and procedures",
	};

	return recommendations[question.id] || `Improve capabilities related to: ${statement}`;
}
