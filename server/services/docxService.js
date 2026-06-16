import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType, UnderlineType,
} from 'docx';

function pt(n) { return n * 20; } // half-points

const accentColor = '6366F1';

function makeBold(text, size = 24) {
  return new TextRun({ text, bold: true, size, font: 'Calibri' });
}

function makeRun(text, size = 22) {
  return new TextRun({ text, size, font: 'Calibri' });
}

function makeLine() {
  return new Paragraph({
    border: { bottom: { color: accentColor, space: 1, style: BorderStyle.SINGLE, size: 4 } },
    spacing: { before: pt(2), after: pt(4) },
  });
}

function makeHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, color: accentColor, font: 'Calibri' })],
    spacing: { before: pt(8), after: pt(2) },
  });
}

export const generateDOCX = async (resume) => {
  const s = resume.sections || {};
  const pi = s.personalInfo || {};
  const children = [];

  // Header — Name
  if (pi.name) {
    children.push(new Paragraph({
      children: [new TextRun({ text: pi.name, bold: true, size: 48, font: 'Calibri', color: '1a1a2e' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: pt(4) },
    }));
  }

  // Contact line
  const contactParts = [pi.email, pi.phone, pi.location, pi.linkedin, pi.portfolio].filter(Boolean);
  if (contactParts.length) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join('  |  '), size: 20, color: '555577', font: 'Calibri' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: pt(6) },
    }));
  }

  children.push(makeLine());

  // Summary
  if (s.summary?.text) {
    children.push(makeHeading('Professional Summary'));
    children.push(makeLine());
    children.push(new Paragraph({ children: [makeRun(s.summary.text)], spacing: { after: pt(4) } }));
  }

  // Experience
  if ((s.experience || []).length > 0) {
    children.push(makeHeading('Experience'));
    children.push(makeLine());
    s.experience.forEach((exp) => {
      children.push(new Paragraph({
        children: [
          makeBold(`${exp.role} — `),
          new TextRun({ text: exp.company, size: 24, color: accentColor, font: 'Calibri' }),
        ],
        spacing: { before: pt(4), after: pt(1) },
      }));
      const dateStr = `${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}`;
      children.push(new Paragraph({
        children: [new TextRun({ text: dateStr, size: 20, italics: true, color: '777788', font: 'Calibri' })],
        spacing: { after: pt(2) },
      }));
      (exp.bullets || []).forEach((bullet) => {
        children.push(new Paragraph({
          children: [makeRun(`• ${bullet}`)],
          spacing: { before: pt(1), after: pt(1) },
          indent: { left: pt(16) },
        }));
      });
    });
  }

  // Education
  if ((s.education || []).length > 0) {
    children.push(makeHeading('Education'));
    children.push(makeLine());
    s.education.forEach((edu) => {
      children.push(new Paragraph({
        children: [makeBold(`${edu.degree} in ${edu.field}`), makeRun(` — ${edu.institution}`)],
        spacing: { before: pt(4), after: pt(1) },
      }));
      const parts = [];
      if (edu.startDate || edu.endDate) parts.push(`${edu.startDate || ''} – ${edu.endDate || ''}`);
      if (edu.gpa) parts.push(`GPA: ${edu.gpa}`);
      if (parts.length) {
        children.push(new Paragraph({
          children: [new TextRun({ text: parts.join('  |  '), size: 20, italics: true, color: '777788', font: 'Calibri' })],
          spacing: { after: pt(2) },
        }));
      }
    });
  }

  // Skills
  if ((s.skills || []).length > 0) {
    children.push(makeHeading('Skills'));
    children.push(makeLine());
    const skillText = s.skills.map((sk) => `${sk.name} (${sk.level})`).join('  •  ');
    children.push(new Paragraph({ children: [makeRun(skillText)], spacing: { after: pt(4) } }));
  }

  // Projects
  if ((s.projects || []).length > 0) {
    children.push(makeHeading('Projects'));
    children.push(makeLine());
    s.projects.forEach((proj) => {
      children.push(new Paragraph({
        children: [makeBold(proj.name)],
        spacing: { before: pt(4), after: pt(1) },
      }));
      if (proj.techStack?.length) {
        children.push(new Paragraph({
          children: [new TextRun({ text: proj.techStack.join(', '), size: 20, color: accentColor, font: 'Calibri' })],
          spacing: { after: pt(1) },
        }));
      }
      if (proj.description) {
        children.push(new Paragraph({ children: [makeRun(proj.description)], spacing: { after: pt(2) } }));
      }
    });
  }

  // Certifications
  if ((s.certifications || []).length > 0) {
    children.push(makeHeading('Certifications'));
    children.push(makeLine());
    s.certifications.forEach((cert) => {
      children.push(new Paragraph({
        children: [makeBold(cert.name), makeRun(` — ${cert.issuer}${cert.date ? ' (' + cert.date + ')' : ''}`)],
        spacing: { before: pt(2), after: pt(2) },
      }));
    });
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: pt(36), right: pt(36), bottom: pt(36), left: pt(36) } },
      },
      children,
    }],
  });

  return await Packer.toBuffer(doc);
};
