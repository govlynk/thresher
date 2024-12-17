export const validateBasicInfo = (formData) => {
  const errors = {};
  
  if (!formData.aboutUs?.trim()) {
    errors.aboutUs = 'About Us is required';
  }
  
  if (!formData.mission?.trim()) {
    errors.mission = 'Mission is required';
  }
  
  if (!formData.vision?.trim()) {
    errors.vision = 'Vision is required';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validatePastPerformance = (performance) => {
  const errors = {};
  
  if (!performance.projectName?.trim()) {
    errors.projectName = 'Project name is required';
  }
  
  if (!performance.client?.trim()) {
    errors.client = 'Client is required';
  }
  
  if (!performance.startDate) {
    errors.startDate = 'Start date is required';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateCertification = (certification) => {
  const errors = {};
  
  if (!certification.name?.trim()) {
    errors.name = 'Certification name is required';
  }
  
  if (!certification.issuer?.trim()) {
    errors.issuer = 'Issuer is required';
  }
  
  if (!certification.dateObtained) {
    errors.dateObtained = 'Date obtained is required';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};