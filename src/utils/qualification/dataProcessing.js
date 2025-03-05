export function processQualificationData(answers) {
  if (!answers) return {
    sections: [],
    radarChartData: [],
    overallScore: 0
  };

  // Process each section
  const sections = Object.entries(answers).map(([sectionId, sectionAnswers]) => {
    if (!sectionAnswers) return null;

    // Calculate section score
    const scores = Object.values(sectionAnswers).map(questionAnswers => {
      if (!questionAnswers) return 0;
      
      const values = Object.values(questionAnswers).map(answer => {
        const scaleValues = {
          'No Experience': 1, 'Basic': 2, 'Intermediate': 3, 'Advanced': 4, 'Expert': 5,
          'Inadequate': 1, 'Adequate': 3, 'Strong': 4, 'Exceptional': 5,
          'Poor': 1, 'Fair': 2, 'Good': 3, 'Very Good': 4, 'Excellent': 5,
          'None': 1, 'Established': 3, 'Optimized': 5
        };
        return scaleValues[answer] || 3;
      });
      
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    const sectionScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // Generate section summary
    const summary = {
      strengths: [],
      weaknesses: [],
      recommendations: []
    };

    Object.entries(sectionAnswers).forEach(([questionId, answers]) => {
      Object.entries(answers).forEach(([statement, response]) => {
        const score = getScoreFromResponse(response);
        if (score >= 4) {
          summary.strengths.push(statement);
        } else if (score <= 2) {
          summary.weaknesses.push(statement);
          summary.recommendations.push(generateRecommendation(statement, questionId));
        }
      });
    });

    return {
      id: sectionId,
      name: getSectionName(sectionId),
      score: Math.round(sectionScore * 10) / 10,
      summary
    };
  }).filter(Boolean);

  // Format data for radar chart
  const radarChartData = sections.map(section => ({
    dimension: section.name,
    current: section.score || 0,
    target: 4
  }));

  // Calculate overall score
  const overallScore = sections.reduce((sum, section) => sum + section.score, 0) / sections.length;

  return {
    sections,
    radarChartData,
    overallScore: Math.round(overallScore * 10) / 10
  };
}

function getScoreFromResponse(response) {
  const scaleValues = {
    'No Experience': 1, 'Basic': 2, 'Intermediate': 3, 'Advanced': 4, 'Expert': 5,
    'Inadequate': 1, 'Adequate': 3, 'Strong': 4, 'Exceptional': 5,
    'Poor': 1, 'Fair': 2, 'Good': 3, 'Very Good': 4, 'Excellent': 5,
    'None': 1, 'Established': 3, 'Optimized': 5
  };
  return scaleValues[response] || 3;
}

function getSectionName(sectionId) {
  const names = {
    technicalCapability: "Technical Capability",
    pastPerformance: "Past Performance",
    managementApproach: "Management Approach"
  };
  return names[sectionId] || sectionId;
}

function generateRecommendation(statement, questionId) {
  const recommendations = {
    technicalExperience: "Consider obtaining relevant technical certifications and training",
    staffingCapability: "Develop a staffing plan to address capability gaps",
    contractPerformance: "Implement performance monitoring and improvement processes",
    projectManagement: "Establish formal project management methodologies"
  };
  return recommendations[questionId] || `Improve capabilities related to: ${statement}`;
}