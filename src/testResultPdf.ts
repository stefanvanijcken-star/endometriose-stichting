type PdfAnswer = string | null;

const colors = {
  ink: [22, 19, 22] as const,
  muted: [74, 68, 72] as const,
  magenta: [197, 42, 114] as const,
  orange: [243, 134, 39] as const,
  pale: [252, 244, 248] as const,
  white: [255, 255, 255] as const,
  border: [248, 231, 240] as const,
  divider: [236, 235, 236] as const,
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
  const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait', compress: true });
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
    // The PDF remains usable with Helvetica if a local font fails to load.
  }

  const setFont = (style: 'normal' | 'medium' | 'bold' = 'normal') => {
    doc.setFont(fontFamily, fontFamily === 'HostGrotesk' ? style : style === 'normal' ? 'normal' : 'bold');
  };
  const setText = (color: readonly [number, number, number]) => doc.setTextColor(...color);
  const setFill = (color: readonly [number, number, number]) => doc.setFillColor(...color);
  const setDraw = (color: readonly [number, number, number]) => doc.setDrawColor(...color);
  const linesFor = (text: string, width: number, size: number) => {
    doc.setFontSize(size);
    return doc.splitTextToSize(text, width) as string[];
  };
  const drawTextBlock = (text: string, x: number, firstBaseline: number, width: number, size: number, lineHeight = 1.4) => {
    const lines = linesFor(text, width, size);
    doc.text(lines, x, firstBaseline, { lineHeightFactor: lineHeight });
    return firstBaseline + (lines.length - 1) * size * lineHeight;
  };
  const drawLogo = async () => {
    try {
      const logo = await svgAsPng('/images/logo.svg', 354, 96);
      doc.addImage(logo, 'PNG', 56, 56, 177, 48);
    } catch {
      setText(colors.magenta);
      setFont('bold');
      doc.setFontSize(20);
      doc.text(['Endometriose', 'Stichting'], 56, 75, { lineHeightFactor: 1.15 });
    }
  };
  const drawFooter = (page: number, withNextPagePrompt = false) => {
    if (withNextPagePrompt) {
      setText(colors.magenta);
      setFont('normal');
      doc.setFontSize(11);
      doc.text('Bekijk jouw antwoorden op de volgende pagina', 521, 751, { align: 'right' });
      doc.setLineWidth(1.2);
      setDraw(colors.magenta);
      doc.line(529, 747, 538, 747);
      doc.line(534, 743, 538, 747);
      doc.line(534, 751, 538, 747);
    }
    setDraw(colors.divider);
    doc.setLineWidth(0.8);
    doc.line(56, 762, 539, 762);
    setText(colors.muted);
    setFont('normal');
    doc.setFontSize(11);
    doc.text('Endometriose Stichting | endometriose.nl', 56, 783);
    doc.text(`${page} / 2`, 539, 783, { align: 'right' });
  };

  doc.setProperties({
    title: 'Uitslag Endometriosetest',
    subject: 'Persoonlijk overzicht van de Endometriosetest',
    author: 'Endometriose Stichting',
    creator: 'Endometriose Stichting',
  });

  await drawLogo();
  setText(colors.magenta);
  setFont('medium');
  doc.setFontSize(11);
  doc.text('Jouw uitslag', 56, 155);

  setText(colors.ink);
  setFont('bold');
  doc.setFontSize(24);
  doc.text(shouldContactDoctor ? 'Er is kans dat je endometriose hebt.' : 'Blijf luisteren naar je lichaam.', 56, 184);

  setText(colors.muted);
  setFont('medium');
  doc.setFontSize(11);
  doc.text(`Je hebt ${yesCount} van de 8 vragen met ‘ja’ beantwoord.`, 56, 205);

  setText(colors.ink);
  setFont('bold');
  doc.setFontSize(18);
  doc.text(shouldContactDoctor ? 'Bespreek je klachten met je huisarts' : 'Blijf goed naar je lichaam luisteren', 56, 266);

  setText(colors.muted);
  setFont('normal');
  const summary = shouldContactDoctor
    ? 'Je antwoorden geven reden om je klachten verder te bespreken. Dat betekent niet automatisch dat je endometriose hebt. Deze test kan endometriose niet aantonen of uitsluiten.'
    : 'Je antwoorden geven op dit moment geen sterke aanwijzing. Deze test kan endometriose echter niet aantonen of uitsluiten. Blijven je klachten aanhouden of beperken ze je dagelijks leven, bespreek ze dan met je huisarts.';
  drawTextBlock(summary, 56, 287, 483, 11, 1.4);

  setFill(colors.pale);
  doc.roundedRect(56, 317, 483, 56, 24, 24, 'F');
  setDraw(colors.magenta);
  doc.setLineWidth(1.5);
  doc.circle(84, 345, 10, 'S');
  setText(colors.magenta);
  setFont('medium');
  doc.setFontSize(11);
  doc.text('i', 84, 349, { align: 'center' });
  setText(colors.ink);
  setFont('medium');
  doc.setFontSize(11);
  doc.text('Bij drie of meer keer ‘ja’ adviseren we je contact op te nemen met je huisarts.', 112, 349);

  setText(colors.orange);
  setFont('medium');
  doc.setFontSize(11);
  doc.text('Wat nu?', 56, 425);

  const steps = shouldContactDoctor
    ? [
        ['Bewaar je uitslag', 'Download dit overzicht en neem het mee wanneer je jouw klachten gaat bespreken met jouw huisarts.'],
        ['Maak een afspraak', 'Plan een afspraak bij je huisarts en vertel welke klachten je ervaart.'],
        ['Neem je antwoorden mee', 'Je antwoorden kunnen helpen om het gesprek over passende vervolgstappen te voeren.'],
      ]
    : [
        ['Bewaar je uitslag', 'Download dit overzicht zodat je jouw antwoorden later nog eens kunt bekijken.'],
        ['Blijf je klachten volgen', 'Schrijf op wanneer klachten terugkomen en wat ze met je dagelijks leven doen.'],
        ['Vraag hulp als dat nodig is', 'Bespreek aanhoudende of beperkende klachten altijd met je huisarts.'],
      ];
  const stepCenters = [452, 513, 559];
  steps.forEach(([heading, copy], index) => {
    const centerY = stepCenters[index];
    setFill(colors.orange);
    doc.circle(68, centerY, 12, 'F');
    setText(colors.white);
    setFont('medium');
    doc.setFontSize(11);
    doc.text(`${index + 1}`, 68, centerY + 4, { align: 'center' });
    setText(colors.ink);
    setFont('medium');
    doc.setFontSize(11);
    doc.text(heading, 92, centerY - 2);
    setText(colors.muted);
    setFont('normal');
    drawTextBlock(copy, 92, centerY + 17, 447, 11, 1.4);
  });
  drawFooter(1, true);

  doc.addPage();
  await drawLogo();
  let y = 144;
  questions.forEach((question, index) => {
    const answer = answers[index] ?? 'Niet beantwoord';
    setFont('medium');
    const questionLines = linesFor(question, 299, 11);
    const cardHeight = Math.max(60, 32 + questionLines.length * 15.4);
    setFill(index % 2 === 0 ? colors.pale : colors.white);
    setDraw(colors.border);
    doc.setLineWidth(1);
    doc.roundedRect(56, y, 483, cardHeight, 24, 24, index % 2 === 0 ? 'F' : 'FD');

    setFill(colors.magenta);
    doc.circle(84, y + cardHeight / 2, 12, 'F');
    setText(colors.white);
    setFont('medium');
    doc.setFontSize(11);
    doc.text(`${index + 1}`, 84, y + cardHeight / 2 + 4, { align: 'center' });

    setText(colors.ink);
    setFont('medium');
    doc.setFontSize(11);
    const firstQuestionBaseline = y + (cardHeight - questionLines.length * 15.4) / 2 + 11;
    doc.text(questionLines, 108, firstQuestionBaseline, { lineHeightFactor: 1.4 });

    const answerColor = answer === 'Ja' ? colors.magenta : answer === 'Weet ik niet' ? colors.orange : colors.muted;
    setFill(answerColor);
    doc.roundedRect(431, y + (cardHeight - 28) / 2, 92, 28, 14, 14, 'F');
    setText(colors.white);
    setFont('medium');
    doc.setFontSize(11);
    doc.text(answer, 477, y + cardHeight / 2 + 4, { align: 'center' });
    y += cardHeight + 12;
  });
  drawFooter(2);

  doc.save('uitslag-endometriosetest.pdf');
}
