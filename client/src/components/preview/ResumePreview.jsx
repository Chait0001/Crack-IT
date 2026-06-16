import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import MinimalTemplate from './MinimalTemplate';
import CreativeTemplate from './CreativeTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';

const TEMPLATES = { modern: ModernTemplate, classic: ClassicTemplate, minimal: MinimalTemplate, creative: CreativeTemplate, executive: ExecutiveTemplate };

const SPACING_SCALE = { compact: 0.85, standard: 1, spacious: 1.15 };

export default function ResumePreview({ readonly = false, print = false }) {
  const { sections, template, colorTheme, fontFamily, spacing } = useResumeStore();
  const Template = TEMPLATES[template] || ModernTemplate;
  const scale = SPACING_SCALE[spacing] || 1;

  const fontMap = {
    Inter: "'Inter', sans-serif",
    Georgia: "Georgia, serif",
    Roboto: "'Roboto', sans-serif",
    'Playfair Display': "'Playfair Display', serif",
  };

  const containerStyle = {
    fontFamily: fontMap[fontFamily] || fontMap.Inter,
    '--accent': colorTheme,
    '--spacing-scale': scale,
  };

  return (
    <div
      className={`${print ? 'w-full' : 'w-full max-w-[210mm] shadow-2xl'} bg-white rounded-lg overflow-hidden`}
      style={containerStyle}
    >
      <Template sections={sections} accentColor={colorTheme} spacingScale={scale} />
    </div>
  );
}
