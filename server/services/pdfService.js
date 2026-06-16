import puppeteer from 'puppeteer';

export const generatePDF = async (resumeId, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const url = `${clientUrl}/resume/print/${resumeId}?token=${token}`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=medium',
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 1600 });

    // Navigate and wait for content to render
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for the resume content to be rendered
    await page.waitForSelector('#resume-print-root', { timeout: 10000 }).catch(() => {});

    // Small delay for fonts and animations to settle
    await new Promise((r) => setTimeout(r, 1500));

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      displayHeaderFooter: false,
    });

    return pdf;
  } finally {
    await browser.close();
  }
};
