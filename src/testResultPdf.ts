type PdfAnswer = string | null;

const colors = {
  ink: [22, 19, 22] as const,
  muted: [74, 68, 72] as const,
  magenta: [197, 42, 114] as const,
  orange: [242, 138, 46] as const,
  pale: [252, 244, 248] as const,
  white: [255, 255, 255] as const,
  line: [235, 222, 229] as const,
};

async function fileAsBase64(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Kon ${url} niet laden`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = '';
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

async function svgAsPng(url: string, width: number, height: number) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Kon ${url} niet laden`);
  const objectUrl = URL.createObjectURL(new Blob([await response.text()], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    const scale = 3;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is niet beschikbaar');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function createTestResultPdf(questions: string[], answers: PdfAnswer[], yesCount: number) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
  const shouldContactDoctor = yesCount >= 3;
  let fontFamily = 'helvetica';

  try {
    const [regular, medium, bold] = await Promise.all([
      fileAsBase64('/fonts/host-grotesk-400.ttf'),
      fileAsBase64('/fonts/host-grotesk-500.ttf'),
      fileAsBase64('/fonts/host-grotesk-700.ttf'),
    ]);
    doc.addFileToVFS('HostGrotesk-Regular.ttf', regular);
    doc.addFileToVFS('HostGrotesk-Medium.ttf', medium);
    doc.addFileToVFS('HostGrotesk-Bold.ttf', bold);
    doc.addFont('HostGrotesk-Regular.ttf', 'HostGrotesk', 'normal');
    doc.addFont('HostGrotesk-Medium.ttf', 'HostGrotesk', 'medium');
    doc.addFont('HostGrotesk-Bold.ttf', 'HostGrotesk', 'bold');
    fontFamily = 'HostGrotesk';
  } catch {
    // Helvetica keeps the PDF usable if a local font cannot be loaded.
  }

  const setFont = (style: 'normal' | 'medium' | 'bold' = 'normal') => {
    doc.setFont(fontFamily, fontFamily === 'HostGrotesk' ? style : style === 'normal' ? 'normal' : 'bold');
  };
  const setText = (color: readonly [number, number, number]) => doc.setTextColor(color[0], color[1], color[2]);
  const setFill = (color: readonly [number, number, number]) => doc.setFillColor(color[0], color[1], color[2]);
  const setDraw = (color: readonly [number, number, number]) => doc.setDrawColor(color[0], color[1], color[2]);
  const writeWrapped = (text: string, x: number, y: number, width: number, fontSize: number, lineHeight: number) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, width) as string[];
    doc.text(lines, x, y, { lineHeightFactor: lineHeight });
    return y + lines.length * fontSize * 0.3528 * lineHeight;
  };
  const drawFooter = (page: number) => {
    setDraw(colors.line);
    doc.setLineWidth(0.3);
    doc.line(18, 278, 192, 278);
    setText(colors.muted);
    setFont('normal');
    doc.setFontSize(8.5);
    doc.text('Endometriose Stichting  |  endometriose.nl', 18, 285);
    doc.text(`${page} / 2`, 192, 285, { align: 'right' });
  };
  const drawBrand = async () => {
    setFill(colors.magenta);
    doc.rect(0, 0, 210, 5, 'F');
    try {
      const logo = await svgAsPng('/images/logo.svg', 354, 96);
      doc.addImage(logo, 'PNG', 18, 15, 44.25, 12);
    } catch {
      setText(colors.magenta);
      setFont('bold');
      doc.setFontSize(14);
      doc.text('Endometriose Stichting', 18, 23);
    }
  };

  doc.setProperties({ title: 'Uitslag Endometriosetest', subject: 'Persoonlijk overzicht van de Endometriosetest', author: 'Endometriose Stichting', creator: 'Endometriose Stichting' });

  await drawBrand();
  setText(colors.magenta);
  setFont('medium');
  doc.setFontSize(10);
  doc.text('JOUW UITSLAG', 18, 40);
  setText(colors.ink);
  setFont('bold');
  const title = shouldContactDoctor ? 'Er is kans dat je endometriose hebt.' : 'Blijf luisteren naar je lichaam.';
  let y = writeWrapped(title, 18, 51, 174, 24, 1.15) + 3;
  setText(colors.muted);
  setFont('medium');
  doc.setFontSize(11);
  doc.text(`Je hebt ${yesCount} van de 8 vragen met 'ja' beantwoord.`, 18, y);
  y += 10;

  setFill(colors.pale);
  doc.roundedRect(18, y, 174, shouldContactDoctor ? 54 : 68, 6, 6, 'F');
  setText(colors.ink);
  setFont('bold');
  doc.setFontSize(12);
  doc.text(shouldContactDoctor ? 'Bespreek je klachten met je huisarts' : 'Blijf goed naar je lichaam luisteren', 26, y + 12);
  setText(colors.muted);
  setFont('normal');
  const summary = shouldContactDoctor
    ? 'Je antwoorden geven reden om je klachten verder te bespreken. Dat betekent niet automatisch dat je endometriose hebt. Deze test kan endometriose niet aantonen of uitsluiten.'
    : 'Deze score geeft niet automatisch het advies om contact op te nemen met je huisarts. De test kan endometriose echter niet aantonen of uitsluiten. Bespreek aanhoudende of beperkende klachten alsnog met je huisarts.';
  writeWrapped(summary, 26, y + 22, 158, 10, 1.35);
  y += shouldContactDoctor ? 64 : 78;

  setDraw(colors.magenta);
  doc.setLineWidth(0.6);
  doc.circle(23, y + 4, 4, 'S');
  setText(colors.magenta);
  setFont('bold');
  doc.setFontSize(9);
  doc.text('i', 23, y + 5.5, { align: 'center' });
  setText(colors.ink);
  setFont('medium');
  writeWrapped("Bij drie of meer keer 'ja' adviseren we je contact op te nemen met je huisarts.", 32, y + 2, 154, 10, 1.3);
  y += 24;

  setText(colors.orange);
  setFont('medium');
  doc.setFontSize(10);
  doc.text(shouldContactDoctor ? 'WAT NU?' : 'EEN LUISTEREND OOR', 18, y);
  y += 9;
  const steps = shouldContactDoctor ? [
    ['1', 'Bewaar je uitslag', 'Download dit overzicht en neem het mee wanneer je jouw klachten bespreekt.'],
    ['2', 'Maak een afspraak', 'Plan een afspraak bij je huisarts en vertel welke klachten je ervaart.'],
    ['3', 'Neem je antwoorden mee', 'Je antwoorden kunnen helpen om het gesprek over passende vervolgstappen te voeren.'],
  ] : [
    ['1', 'Houd je klachten in de gaten', 'Blijf luisteren naar je lichaam en noteer klachten die terugkomen.'],
    ['2', 'Vraag hulp als dat nodig is', 'Maak je je zorgen of beperken klachten je dagelijks leven? Bespreek ze dan met je huisarts.'],
  ];
  for (const [number, heading, copy] of steps) {
    setFill(colors.magenta);
    doc.circle(23, y + 4, 4.5, 'F');
    setText(colors.white);
    setFont('bold');
    doc.setFontSize(9);
    doc.text(number, 23, y + 5.4, { align: 'center' });
    setText(colors.ink);
    setFont('bold');
    doc.setFontSize(11);
    doc.text(heading, 32, y + 3.5);
    setText(colors.muted);
    setFont('normal');
    writeWrapped(copy, 32, y + 10, 154, 9.5, 1.3);
    y += 27;
  }
  drawFooter(1);

  doc.addPage();
  await drawBrand();
  setText(colors.magenta);
  setFont('medium');
  doc.setFontSize(10);
  doc.text('ENDOMETRIOSETEST', 18, 40);
  setText(colors.ink);
  setFont('bold');
  doc.setFontSize(24);
  doc.text('Jouw antwoorden', 18, 52);
  setText(colors.muted);
  setFont('normal');
  doc.setFontSize(10);
  doc.text('Een overzicht om te bewaren of mee te nemen naar je huisarts.', 18, 61);

  y = 72;
  questions.forEach((question, index) => {
    const answer = answers[index] ?? 'Niet beantwoord';
    const questionLines = doc.splitTextToSize(question, 115) as string[];
    const cardHeight = Math.max(20, 10 + questionLines.length * 4.5);
    setFill(index % 2 === 0 ? colors.pale : colors.white);
    if (index % 2 !== 0) setDraw(colors.line);
    doc.roundedRect(18, y, 174, cardHeight, 4, 4, index % 2 === 0 ? 'F' : 'FD');
    setText(colors.magenta);
    setFont('bold');
    doc.setFontSize(10);
    doc.text(`${index + 1}`, 25, y + 8);
    setText(colors.ink);
    setFont('normal');
    doc.setFontSize(9.5);
    doc.text(questionLines, 34, y + 7, { lineHeightFactor: 1.25 });
    const answerColor = answer === 'Ja' ? colors.magenta : answer === 'Weet ik niet' ? colors.orange : colors.muted;
    setFill(answerColor);
    doc.roundedRect(158, y + 5, 27, 9, 4.5, 4.5, 'F');
    setText(colors.white);
    setFont('medium');
    doc.setFontSize(8.5);
    doc.text(answer, 171.5, y + 10.8, { align: 'center' });
    y += cardHeight + 3;
  });

  setText(colors.muted);
  setFont('normal');
  writeWrapped('Let op: deze test kan endometriose niet aantonen of uitsluiten en vervangt geen medisch onderzoek of gesprek met een zorgprofessional.', 18, 266, 174, 8.5, 1.25);
  drawFooter(2);
  doc.save('uitslag-endometriosetest.pdf');
}
