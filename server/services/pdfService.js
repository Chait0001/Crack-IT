import os from 'os';
import fs from 'fs';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const getLocalChromePath = () => {
  const platform = os.platform();
  if (platform === 'darwin') {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  } else if (platform === 'win32') {
    const paths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) return p;
    }
  } else {
    const paths = ['/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium'];
    for (const p of paths) {
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
};

export const generatePDF = async (resumeId, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const url = `${clientUrl}/resume/print/${resumeId}?token=${token}`;

  const isProd = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
  
  const executablePath = isProd 
    ? await chromium.executablePath() 
    : getLocalChromePath();

  const browser = await puppeteer.launch({
    args: isProd ? chromium.args : [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=medium',
    ],
    defaultViewport: chromium.defaultViewport,
    executablePath: executablePath || undefined,
    headless: isProd ? chromium.headless : 'new',
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
