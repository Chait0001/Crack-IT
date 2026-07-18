import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType, UnderlineType,
  ExternalHyperlink, ImageRun
} from 'docx';

function pt(n) { return n * 20; } // half-points

const accentColor = '6366F1';

function compactScale(resume) {
  const s = resume.sections || {};
  const text = [
    s.summary?.text,
    ...(s.experience || []).flatMap((item) => [item.role, item.company, ...(item.bullets || [])]),
    ...(s.projects || []).flatMap((item) => [item.name, item.description]),
    ...(s.education || []).flatMap((item) => [item.institution, item.degree, item.field]),
  ].filter(Boolean).join(' ');

  // DOCX has no reliable cross-platform page-count API. This conservative
  // content-length threshold preserves the normal document for short resumes
  // and only reduces long documents enough to strongly favour one page.
  if (text.length > 5000) return 0.72;
  if (text.length > 3900) return 0.8;
  if (text.length > 2900) return 0.9;
  return 1;
}

function scaled(size, scale) { return Math.max(14, Math.round(size * scale)); }

function makeBold(text, size = 24, scale = 1) {
  return new TextRun({ text, bold: true, size: scaled(size, scale), font: 'Calibri' });
}

function makeRun(text, size = 22, scale = 1) {
  return new TextRun({ text, size: scaled(size, scale), font: 'Calibri' });
}

function makeLine() {
  return new Paragraph({
    border: { bottom: { color: accentColor, space: 1, style: BorderStyle.SINGLE, size: 4 } },
    spacing: { before: pt(2), after: pt(4) },
  });
}

function makeHeading(text, scale = 1) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: scaled(24, scale), color: accentColor, font: 'Calibri' })],
    spacing: { before: pt(8), after: pt(2) },
  });
}

const getCircularCloudinaryUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/image/upload/', '/image/upload/w_200,h_200,c_fill,r_max,f_png/');
};

const getPhotoBuffer = async (photo) => {
  if (!photo) return null;
  try {
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      const url = getCircularCloudinaryUrl(photo);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch photo: ${res.statusText}`);
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } else {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const localPath = path.resolve(__dirname, '..', photo.startsWith('/') ? photo.slice(1) : photo);
      if (fs.existsSync(localPath)) {
        return fs.readFileSync(localPath);
      }
    }
  } catch (err) {
    console.error('Error loading photo for DOCX:', err);
  }
  return null;
};

const getPhotoType = (photo) => {
  if (!photo) return 'png';
  if (photo.includes('cloudinary.com')) return 'png';
  const lower = photo.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'jpg';
  if (lower.endsWith('.gif')) return 'gif';
  return 'png';
};

export const generateDOCX = async (resume) => {
  const s = resume.sections || {};
  const pi = s.personalInfo || {};
  const scale = compactScale(resume);
  const children = [];

  // Profile Photo
  if (pi.photo) {
    const photoBuffer = await getPhotoBuffer(pi.photo);
    if (photoBuffer) {
      children.push(new Paragraph({
        children: [
          new ImageRun({
            data: photoBuffer,
            transformation: {
              width: 80,
              height: 80,
            },
            type: getPhotoType(pi.photo),
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: pt(4) },
      }));
    }
  }

  // Header — Name
  if (pi.name) {
    children.push(new Paragraph({
      children: [new TextRun({ text: pi.name, bold: true, size: scaled(48, scale), font: 'Calibri', color: '1a1a2e' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: pt(4) },
    }));
  }

  // Contact line
  const contactChildren = [];
  if (pi.email) {
    contactChildren.push(new TextRun({ text: pi.email, size: scaled(20, scale), color: '555577', font: 'Calibri' }));
  }
  if (pi.phone) {
    if (contactChildren.length) contactChildren.push(new TextRun({ text: '  |  ', size: scaled(20, scale), color: '555577', font: 'Calibri' }));
    contactChildren.push(new TextRun({ text: pi.phone, size: scaled(20, scale), color: '555577', font: 'Calibri' }));
  }
  if (pi.location) {
    if (contactChildren.length) contactChildren.push(new TextRun({ text: '  |  ', size: scaled(20, scale), color: '555577', font: 'Calibri' }));
    contactChildren.push(new TextRun({ text: pi.location, size: scaled(20, scale), color: '555577', font: 'Calibri' }));
  }
  if (pi.linkedin) {
    if (contactChildren.length) contactChildren.push(new TextRun({ text: '  |  ', size: scaled(20, scale), color: '555577', font: 'Calibri' }));
    contactChildren.push(new ExternalHyperlink({
      children: [
        new TextRun({
          text: 'LinkedIn',
          size: scaled(20, scale),
          color: '0563C1',
          underline: {
            type: UnderlineType.SINGLE,
            color: '0563C1',
          },
          font: 'Calibri',
        })
      ],
      link: pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`,
    }));
  }
  if (pi.portfolio) {
    if (contactChildren.length) contactChildren.push(new TextRun({ text: '  |  ', size: scaled(20, scale), color: '555577', font: 'Calibri' }));
    contactChildren.push(new ExternalHyperlink({
      children: [
        new TextRun({
          text: 'Portfolio',
          size: scaled(20, scale),
          color: '0563C1',
          underline: {
            type: UnderlineType.SINGLE,
            color: '0563C1',
          },
          font: 'Calibri',
        })
      ],
      link: pi.portfolio.startsWith('http') ? pi.portfolio : `https://${pi.portfolio}`,
    }));
  }

  if (contactChildren.length) {
    children.push(new Paragraph({
      children: contactChildren,
      alignment: AlignmentType.CENTER,
      spacing: { after: pt(6) },
    }));
  }

  children.push(makeLine());

  // Summary
  if (s.summary?.text) {
    children.push(makeHeading('Professional Summary', scale));
    children.push(makeLine());
    children.push(new Paragraph({ children: [makeRun(s.summary.text, 22, scale)], spacing: { after: pt(4) } }));
  }

  // Experience
  if ((s.experience || []).length > 0) {
    children.push(makeHeading('Experience', scale));
    children.push(makeLine());
    s.experience.forEach((exp) => {
      children.push(new Paragraph({
        children: [
          makeBold(`${exp.role} — `, 24, scale),
          new TextRun({ text: exp.company, size: scaled(24, scale), color: accentColor, font: 'Calibri' }),
        ],
        spacing: { before: pt(4), after: pt(1) },
      }));
      const dateStr = `${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}`;
      children.push(new Paragraph({
        children: [new TextRun({ text: dateStr, size: scaled(20, scale), italics: true, color: '777788', font: 'Calibri' })],
        spacing: { after: pt(2) },
      }));
      (exp.bullets || []).forEach((bullet) => {
        children.push(new Paragraph({
          children: [makeRun(`• ${bullet}`, 22, scale)],
          spacing: { before: pt(1), after: pt(1) },
          indent: { left: pt(16) },
        }));
      });
    });
  }

  // Education
  if ((s.education || []).length > 0) {
    children.push(makeHeading('Education', scale));
    children.push(makeLine());
    s.education.forEach((edu) => {
      children.push(new Paragraph({
        children: [makeBold(`${edu.degree} in ${edu.field}`, 24, scale), makeRun(` — ${edu.institution}`, 22, scale)],
        spacing: { before: pt(4), after: pt(1) },
      }));
      const parts = [];
      if (edu.startDate || edu.endDate) parts.push(`${edu.startDate || ''} – ${edu.endDate || ''}`);
      if (edu.gpa) parts.push(`GPA: ${edu.gpa}`);
      if (parts.length) {
        children.push(new Paragraph({
          children: [new TextRun({ text: parts.join('  |  '), size: scaled(20, scale), italics: true, color: '777788', font: 'Calibri' })],
          spacing: { after: pt(2) },
        }));
      }
    });
  }

  // Skills
  if ((s.skills || []).length > 0) {
    children.push(makeHeading('Skills', scale));
    children.push(makeLine());
    const skillText = s.skills.map((sk) => `${sk.name} (${sk.level})`).join('  •  ');
    children.push(new Paragraph({ children: [makeRun(skillText, 22, scale)], spacing: { after: pt(4) } }));
  }

  // Projects
  if ((s.projects || []).length > 0) {
    children.push(makeHeading('Projects', scale));
    children.push(makeLine());
    s.projects.forEach((proj) => {
      children.push(new Paragraph({
        children: [makeBold(proj.name, 24, scale)],
        spacing: { before: pt(4), after: pt(1) },
      }));
      if (proj.techStack?.length) {
        children.push(new Paragraph({
          children: [new TextRun({ text: proj.techStack.join(', '), size: scaled(20, scale), color: accentColor, font: 'Calibri' })],
          spacing: { after: pt(1) },
        }));
      }
      if (proj.description) {
        children.push(new Paragraph({ children: [makeRun(proj.description, 22, scale)], spacing: { after: pt(2) } }));
      }
    });
  }

  // Certifications
  if ((s.certifications || []).length > 0) {
    children.push(makeHeading('Certifications', scale));
    children.push(makeLine());
    s.certifications.forEach((cert) => {
      children.push(new Paragraph({
        children: [makeBold(cert.name, 24, scale), makeRun(` — ${cert.issuer}${cert.date ? ' (' + cert.date + ')' : ''}`, 22, scale)],
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
