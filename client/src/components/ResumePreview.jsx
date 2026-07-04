import React from 'react';
import { ModernTemplate, MinimalTemplate, OverleafTemplate, CorporateTemplate } from './ResumeTemplates';

const ResumePreview = ({ data }) => {
  const template = data.template || 'modern';

  switch (template) {
    case 'minimal':
      return <MinimalTemplate data={data} />;
    case 'overleaf':
      return <OverleafTemplate data={data} />;
    case 'corporate':
      return <CorporateTemplate data={data} />;
    case 'modern':
    default:
      return <ModernTemplate data={data} />;
  }
};

export default ResumePreview;
