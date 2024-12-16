import React from 'react';
import { AboutSection } from '../sections/AboutSection';
import { CapabilitiesSection } from '../sections/CapabilitiesSection';
import { CompetitiveSection } from '../sections/CompetitiveSection';
import { MissionVisionSection } from '../sections/MissionVisionSection';
import { PastPerformanceSection } from '../sections/PastPerformanceSection';
import { CertificationsSection } from '../sections/CertificationsSection';
import { ReviewSection } from '../sections/ReviewSection';

export function StepContent({
  activeStep,
  formData,
  setFormData,
  handlePerformanceChange,
  certifications,
}) {
  switch (activeStep) {
    case 0:
      return (
        <AboutSection
          aboutUs={formData.aboutUs}
          keywords={formData.keywords}
          onAboutUsChange={(value) => setFormData(prev => ({ ...prev, aboutUs: value }))}
          onKeywordsChange={(value) => setFormData(prev => ({ ...prev, keywords: value }))}
        />
      );
    case 1:
      return (
        <CapabilitiesSection
          value={formData.keyCapabilities}
          onChange={(value) => setFormData(prev => ({ ...prev, keyCapabilities: value }))}
        />
      );
    case 2:
      return (
        <CompetitiveSection
          value={formData.competitiveAdvantage}
          onChange={(value) => setFormData(prev => ({ ...prev, competitiveAdvantage: value }))}
        />
      );
    case 3:
      return (
        <MissionVisionSection
          mission={formData.mission}
          vision={formData.vision}
          onMissionChange={(value) => setFormData(prev => ({ ...prev, mission: value }))}
          onVisionChange={(value) => setFormData(prev => ({ ...prev, vision: value }))}
        />
      );
    case 4:
      return (
        <PastPerformanceSection
          value={formData.performances}
          onChange={handlePerformanceChange}
        />
      );
    case 5:
      return <CertificationsSection />;
    case 6:
      return (
        <ReviewSection
          formData={formData}
          performances={formData.performances}
          certifications={certifications}
        />
      );
    default:
      return null;
  }
}