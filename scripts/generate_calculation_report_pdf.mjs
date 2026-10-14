import fs from 'node:fs';
import path from 'node:path';
import { jsPDF } from 'jspdf';

const root = process.cwd();
const inputPath = path.join(root, 'docs', 'Pyrolysis_Calculator_Calculation_Logic_Report.md');
const outputPath = path.join(root, 'docs', 'Pyrolysis_Calculator_Calculation_Logic_Report.pdf');

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const markdown = fs.readFileSync(inputPath, 'utf8');
const lines = markdown.replace(/\r\n/g, '\n').split('\n');

const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const marginLeft = 15;
const marginRight = 15;
const marginTop = 15;
const marginBottom = 15;
const maxTextWidth = pageWidth - marginLeft - marginRight;

let y = marginTop;
let pageNumber = 1;

const addFooter = () => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
};

const newPage = () => {
  addFooter();
  doc.addPage();
  pageNumber += 1;
  y = marginTop;
};

const ensureSpace = (requiredHeightMm) => {
  if (y + requiredHeightMm > pageHeight - marginBottom) {
    newPage();
  }
};

const writeWrapped = (text, fontStyle = 'normal', fontSize = 10, extraGap = 1.2) => {
  doc.setFont('helvetica', fontStyle);
  doc.setFontSize(fontSize);
  doc.setTextColor(20, 20, 20);

  const wrapped = doc.splitTextToSize(text, maxTextWidth);
  const lineHeight = fontSize * 0.38 + extraGap;
  const neededHeight = wrapped.length * lineHeight + 1;
  ensureSpace(neededHeight);

  wrapped.forEach((line) => {
    doc.text(line, marginLeft, y);
    y += lineHeight;
  });
};

for (const raw of lines) {
  const line = raw.trimEnd();

  if (line.trim() === '') {
    y += 2.2;
    continue;
  }

  if (line.startsWith('# ')) {
    y += 1;
    writeWrapped(line.slice(2), 'bold', 15, 1.4);
    y += 1.5;
    continue;
  }

  if (line.startsWith('## ')) {
    y += 1;
    writeWrapped(line.slice(3), 'bold', 12, 1.2);
    y += 0.8;
    continue;
  }

  if (line.startsWith('### ')) {
    writeWrapped(line.slice(4), 'bold', 11, 1.2);
    continue;
  }

  if (line.startsWith('- ')) {
    writeWrapped(`- ${line.slice(2)}`, 'normal', 10, 1.1);
    continue;
  }

  if (/^\d+\.\s/.test(line)) {
    writeWrapped(line, 'normal', 10, 1.1);
    continue;
  }

  if (line.startsWith('$$') || line.startsWith('$')) {
    writeWrapped(line, 'normal', 9, 1.0);
    continue;
  }

  writeWrapped(line, 'normal', 10, 1.1);
}

addFooter();
doc.save(outputPath);
console.log(`PDF generated: ${outputPath}`);
