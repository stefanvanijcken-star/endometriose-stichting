import { useState } from 'react';
import { createTestResultPdf } from './testResultPdf';

const symptoms = [
  ['Heftige menstruatiepijn', 'Pijn die je dagelijkse leven, school, werk of sport belemmert.'],
  ['Buik- of bekkenpijn', 'Terugkerende of aanhoudende pijn, ook buiten je menstruatie.'],
  ['Darm- of blaasklachten', 'Pijn of andere klachten rondom de ontlasting en het plassen.'],
  ['Pijn tijdens of na seks', 'Pijn tijdens of na seks is een veelvoorkomende klacht bij endometriose.'],
  ['Extreme vermoeidheid', 'Een uitputting die niet verdwijnt na een goede nachtrust.'],
  ['Vruchtbaarheidsproblemen', 'Moeilijk zwanger worden kan samenhangen met endometriose.'],
];

const routes = [
  ['Ik heb klachten', 'Herken de signalen en ontdek welke stap je nu kunt nemen.', 'Start hier'],
  ['Ik heb net de diagnose', 'Lees wat de diagnose betekent en welke behandelingen er zijn.', 'Krijg houvast'],
  ['Ik leef al langer met endometriose', 'Praktische ondersteuning bij pijn, werk, relaties en mentale gezondheid.', 'Vind ondersteuning'],
  ['Ik wil iemand ondersteunen', 'Informatie voor partners, familie, vrienden en andere naasten.', 'Lees wat jij kunt doen'],
];

const stories = [
  ['/images/image-7.jpg', 'Werk en energie', '“Hoe ik mijn grenzen eerder leerde herkennen — en erover leerde praten.”'],
  ['/images/image-8.jpg', 'Relaties en intimiteit', 'Hoe vertel je wat pijn met je doet, zonder jezelf kwijt te raken?'],
  ['/images/image-9.jpg', 'Mentale gezondheid', 'Leven met onzekerheid vraagt meer dan alleen medische zorg.'],
];

const footerColumns = [
  ['Endometriose', 'Wat is endometriose?', 'Klachten', 'Diagnose', 'Behandeling', 'Adenomyose'],
  ['Hulp en ondersteuning', 'Doe de Endometriosetest', 'Bereid je huisartsbezoek voor', 'Zorgwijzer', 'Stel je vraag', 'Leven met endometriose'],
  ['Ontmoeten', 'Ervaringsverhalen', 'Lotgenotencontact', 'Agenda', 'Nieuws', 'Podcast'],
  ['Over de stichting', 'Over ons', 'Contact', 'Word vrijwilliger', 'Voor zorgprofessionals', 'Steun ons'],
];

const testQuestions = [
  'Vanaf de eerste menstruaties heb ik al hevige menstruatiepijn die niet goed reageert op pijnstillers.',
  'Door mijn menstruatieproblemen ben ik al vroeg aan de pil begonnen.',
  'De menstruatiepijn verdwijnt niet tijdens de pil of komt snel weer terug.',
  'Door mijn menstruatieproblemen moet ik soms van school, werk, sport e.d. verzuimen.',
  'Endometriose komt bij mij in de familie voor.',
  'Voor, tijdens of na de menstruatie heb ik last met mijn stoelgang en/of plassen.',
  'Seksuele activiteit zorgt voor klachten in de onderbuik.',
  'Ik heb doorbraakbloedingen tijdens pilgebruik.',
];

const getPageHref = (label: string) => label === 'Doe de Endometriosetest' ? '/endometriosetest' : '#';

function Button({ children, variant = 'primary', onClick, full = false, href }: { children: React.ReactNode; variant?: 'primary' | 'orange' | 'white' | 'outline' | 'magenta-outline'; onClick?: () => void; full?: boolean; href?: string }) {
  const className = `button button--${variant}${full ? ' button--full' : ''}`;
  if (href) return <a className={className} href={href}>{children}</a>;
  return <button className={className} onClick={onClick}>{children}</button>;
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const menus: Record<string, [string, string[]][]> = {
    Endometriose: [['Begrijpen', ['Wat is endometriose?', 'Klachten', 'Adenomyose', 'Veelgestelde vragen']], ['Diagnose en behandeling', ['Diagnose', 'Behandeling', 'Endometriose en vruchtbaarheid', 'Onderzoek en ontwikkelingen']]],
    'Hulp & Zorg': [['Klachten en diagnose', ['Doe de Endometriosetest', 'Bereid je huisartsbezoek voor', 'Hoe wordt endometriose vastgesteld?', 'Na de diagnose']], ['Informatie en ondersteuning', ['Behandelmogelijkheden', 'Stel je vraag', 'Folders en hulpmiddelen', 'Veelgestelde vragen']]],
    'Leven met endometriose': [['Dagelijks leven', ['Pijn en vermoeidheid', 'Werk en studie', 'Mentale gezondheid', 'Bewegen en dagelijks functioneren']], ['Relaties en toekomst', ['Relaties en intimiteit', 'Vruchtbaarheid en kinderwens', 'Voor partners en naasten', 'Leven na een behandeling']]],
    Ontmoeten: [['Ervaringen delen', ['Ervaringsverhalen', 'Lotgenotencontact', 'Stel je vraag']], ['Meedoen en transparantie', ['Agenda', 'Online bijeenkomsten', 'Podcast', 'Nieuws']]],
    'Over ons': [['De stichting', ['Over de stichting', 'Wat we doen', 'Team en vrijwilligers', 'Samenwerkingen']], ['Meedoen en transparantie', ['Word vrijwilliger', 'Voor zorgprofessionals', 'Jaarverslagen en ANBI', 'Contact']]],
  };
  return <header className={`header${mobileOpen ? ' header--open' : ''}${active ? ' header--mega-open' : ''}`} onMouseLeave={() => setActive(null)}>
    <a className="logo" href="/" aria-label="Endometriose Stichting"><img src="/images/logo.svg" alt="Endometriose Stichting" /></a>
    <nav className="desktop-nav" aria-label="Hoofdnavigatie">
      {Object.keys(menus).map(label => <div className="nav-item" key={label} onMouseEnter={() => setActive(label)}>
        <button className={`nav-trigger${active === label ? ' nav-trigger--active' : ''}`} aria-expanded={active === label} onClick={() => setActive(label)}>{label}<img src={active === label ? '/images/chevron-magenta.svg' : '/images/chevron.svg'} alt="" /></button>
      </div>)}
    </nav>
    <div className="header-actions"><Button variant="orange" href="/doneren"><img src="/images/donate.svg" alt="" />Doneer</Button><Button href="/endometriosetest">Doe de test</Button></div>
    <button className="menu-button" aria-label="Menu openen" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><img src={mobileOpen ? '/images/close.svg' : '/images/menu.svg'} alt="" /></button>
    {active && <div className="desktop-mega">{menus[active].map(([heading, links]) => <div className="mega-column" key={heading}><strong>{heading}</strong>{links.map(link => <a href={getPageHref(link)} key={link}>{link}</a>)}</div>)}</div>}
    {mobileOpen && <nav className="mobile-nav">{Object.keys(menus).map(label => <div className="mobile-menu-group" key={label}><button className={mobileSection === label ? 'active' : ''} onClick={() => setMobileSection(mobileSection === label ? null : label)}>{label}<img src={mobileSection === label ? '/images/chevron-magenta.svg' : '/images/chevron.svg'} alt="" /></button>{mobileSection === label && <div className="mobile-submenu">{menus[label].map(([heading, links]) => <div key={heading}><strong>{heading}</strong>{links.map(link => <a href={getPageHref(link)} key={link}>{link}</a>)}</div>)}</div>}</div>)}<div className="mobile-nav-actions"><Button variant="orange" full href="/doneren"><img src="/images/donate.svg" alt="" />Doneer</Button><Button full href="/endometriosetest">Doe de endometriosetest</Button></div></nav>}
  </header>;
}

function Hero() { return <section className="hero" id="top">
  <div className="hero-main"><div className="hero-copy"><h1>Je klachten verdienen aandacht.</h1><p>Endometriose kan grote invloed hebben op je dagelijks leven. Herken de klachten, krijg betrouwbare informatie en ontdek welke stap je nu kunt nemen.</p></div><div className="button-row"><Button href="/endometriosetest">Doe de endometriosetest</Button><Button variant="white">Wat is endometriose?</Button></div></div>
  <div className="hero-meta"><div className="diagnosis"><strong>Heb je al een diagnose?</strong><span>Vind <u>hier</u> informatie en ondersteuning die bij jou past.</span></div><div><strong>1 op de 10</strong><span>vrouwen heeft endometriose</span></div></div>
  </section>; }

function SectionHeading({ title, copy, action }: { title: string; copy: string; action?: React.ReactNode }) { return <div className="section-heading"><div><h2>{title}</h2><p>{copy}</p></div>{action}</div>; }

function Symptoms() { return <section className="section symptoms" id="klachten"><SectionHeading title="Herken je dit?" copy="Endometriose uit zich bij iedereen anders. Klachten kunnen tijdens de menstruatie optreden, maar ook op andere momenten." action={<Button>Bekijk alle klachten</Button>} /><div className="symptoms-layout"><div className="symptom-grid">{symptoms.map(([title, copy]) => <article className="soft-card" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div><img className="symptoms-image" src="/images/image-4.jpg" alt="Vrouw met buikpijn" /></div><div className="mobile-section-action"><Button full>Bekijk alle klachten</Button></div></section>; }

function TestSection() { const [answer, setAnswer] = useState('Ja'); return <section className="section test-section"><div className="test-copy"><SectionHeading title="Zijn jouw klachten normaal?" copy="Beantwoord acht korte vragen over je klachten. De test stelt geen diagnose, maar helpt je bepalen of het verstandig is om je klachten met je huisarts te bespreken." /><ul className="facts"><li><img src="/images/test-questions.svg" alt="" />8 vragen</li><li><img src="/images/test-time.svg" alt="" />Ongeveer 2 minuten</li><li><img src="/images/test-insight.svg" alt="" />Direct inzicht in mogelijke vervolgstappen</li></ul><Button href="/endometriosetest">Start de test</Button></div><div className="question-card"><small>4/8</small><h3>Moet je door je menstruatieklachten soms thuisblijven van school, werk of sport?</h3><div className="radio-list">{['Ja', 'Nee', 'Weet ik niet'].map(option => <label key={option}><input type="radio" name="answer" checked={answer === option} onChange={() => setAnswer(option)} />{option}</label>)}</div></div></section>; }

function Routes() { return <section className="section routes"><SectionHeading title="Waar sta jij?" copy="Iedere situatie is anders. Kies wat het beste bij jou past, dan helpen we je gericht verder." /><div className="route-grid">{routes.map(([title, copy, action]) => <article className="soft-card route-card" key={title}><div><h3>{title}</h3><p>{copy}</p></div><Button variant="outline">{action}</Button></article>)}</div></section>; }

function Experts() { return <section className="section split pale experts"><div className="split-copy"><SectionHeading title="Je hoeft het niet alleen uit te zoeken." copy="Onze ervaringsdeskundige vrijwilligers weten hoe ingrijpend endometriose kan zijn. Ze luisteren, denken mee en wijzen je de weg naar betrouwbare informatie." /><blockquote>“Soms helpt het al als iemand begrijpt waar je doorheen gaat.”</blockquote><Button>Stel je vraag</Button><small>Meestal ontvang je binnen vijf werkdagen antwoord.</small></div><img src="/images/image-5.jpg" alt="Ervaringsdeskundige" /></section>; }

function Stories() { return <section className="section stories"><SectionHeading title="Leven met endometriose." copy="Herkenning, praktische tips en eerlijke verhalen over de impact op het dagelijks leven." action={<Button>Bekijk alle verhalen</Button>} /><div className="story-grid">{stories.map(([image, title, copy]) => <article className="story-card" key={title}><img src={image} alt="" /><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div><div className="mobile-section-action"><Button full>Bekijk alle verhalen</Button></div></section>; }

function Agenda() {
  const [openEvent, setOpenEvent] = useState<number | null>(null);
  const events = [
    { title: 'Vraagavond met een ervaringsdeskundige', date: 'Online · 23 augustus · 19.30 uur', description: 'Stel je vragen in een veilige online omgeving aan een opgeleide ervaringsdeskundige. Er is ruimte voor herkenning, praktische tips en persoonlijke situaties.', details: ['Online via videobellen', '19.30–21.00 uur', 'Gratis deelname'] },
    { title: 'Lotgenotendag: ruimte voor jouw verhaal', date: 'Utrecht · 2 september · 13.00 uur', description: 'Een toegankelijke middag om ervaringen uit te wisselen, nieuwe inzichten op te doen en andere mensen met endometriose te ontmoeten.', details: ['Utrecht, centraal gelegen', '13.00–16.30 uur', 'Inclusief koffie en thee'] },
  ];
  return <section className={`section agenda${openEvent !== null ? ' agenda--expanded' : ''}`}><SectionHeading title="Ontmoet, leer en deel." copy="Online en door het hele land organiseert de stichting bijeenkomsten voor iedereen die met endometriose te maken heeft." action={<Button variant="outline">Bekijk de volledige agenda</Button>} /><div className="event-list">{events.map((event,index) => { const isOpen = openEvent === index; return <article className={`event${isOpen ? ' event--open' : ''}`} key={event.title}><div className="event-main"><div className="event-summary"><h3>{event.title}</h3><p>{event.date}</p><button className="event-more" aria-expanded={isOpen} onClick={() => setOpenEvent(isOpen ? null : index)}>{isOpen ? 'Lees minder' : 'Lees meer'} <img src="/images/arrow-right.svg" alt="" /></button></div><Button>Schrijf je in!</Button></div>{isOpen && <div className="event-details"><p>{event.description}</p><ul>{event.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>}</article>; })}</div><div className="mobile-section-action"><Button variant="outline" full>Bekijk de volledige agenda</Button></div></section>;
}

function About() { return <section className="section split about"><div className="split-copy"><SectionHeading title="Over de Endometriose Stichting." copy="We delen betrouwbare kennis, brengen mensen bij elkaar en maken ons sterk voor snellere diagnoses en toegankelijke endometriosezorg." /><ul className="facts"><li><img src="/images/fact-volunteers.svg" alt="" />25+ ervaringsdeskundige vrijwilligers</li><li><img src="/images/fact-country.svg" alt="" />Landelijk actief voor mensen met endometriose</li></ul><div className="button-row"><Button>Over de stichting</Button><Button variant="orange">Word vrijwilliger</Button></div></div><img src="/images/image-6.jpg" alt="Presentatie van de stichting" /></section>; }

function Donation() {
  const [frequency, setFrequency] = useState('Maandelijks');
  const [amount, setAmount] = useState('7');
  const [customAmount, setCustomAmount] = useState('');

  return <section className="section donation">
    <div className="donation-copy">
      <SectionHeading title="Help mensen sneller de juiste zorg te vinden." copy="Met jouw bijdrage bieden we betrouwbare informatie, leiden we ervaringsdeskundigen op en zetten we ons in voor betere endometriosezorg." />
      <small className="donation-note donation-note--desktop">Eenmalig of periodiek. Elk bedrag helpt.</small>
    </div>
    <div className="donation-card">
      <div className="choice-stack">
        <Choice label="Hoe vaak wil je geven?" options={['Eenmalig','Maandelijks','Jaarlijks']} value={frequency} onChange={setFrequency} />
        <Choice label={`Kies een ${frequency.toLowerCase()} bedrag`} options={['5','7','15','Anders']} value={amount} onChange={setAmount} />
        {amount === 'Anders' && <label className="custom-amount">
          <span>Vul je eigen bedrag in</span>
          <span className="custom-amount-field"><span aria-hidden="true">€</span><input autoFocus inputMode="decimal" min="1" step="1" type="number" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} placeholder="Bijvoorbeeld 25" aria-label="Eigen donatiebedrag in euro" /></span>
        </label>}
      </div>
      <Button variant="orange" href="/doneren">Doneer nu</Button>
    </div>
    <small className="donation-note donation-note--mobile">Eenmalig of periodiek. Elk bedrag helpt.</small>
  </section>;
}

function Choice({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v:string)=>void }) { return <div className="choice"><p>{label}</p><div>{options.map(option => <button className={value === option ? 'selected' : ''} onClick={() => onChange(option)} key={option}>{option}</button>)}</div></div>; }

function DonationPageForm() {
  const [frequency, setFrequency] = useState('Maandelijks');
  const [amount, setAmount] = useState('7');
  const [customAmount, setCustomAmount] = useState('');

  return <div className="donation-page-form">
    <div className="choice-stack">
      <Choice label="Hoe vaak wil je geven?" options={['Eenmalig', 'Maandelijks', 'Jaarlijks']} value={frequency} onChange={setFrequency} />
      <Choice label={`Kies een ${frequency.toLowerCase()} bedrag`} options={['5', '7', '15', 'Anders']} value={amount} onChange={setAmount} />
      {amount === 'Anders' && <label className="custom-amount">
        <span>Vul je eigen bedrag in</span>
        <span className="custom-amount-field"><span aria-hidden="true">€</span><input autoFocus inputMode="decimal" min="1" step="1" type="number" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} placeholder="Bijvoorbeeld 25" aria-label="Eigen donatiebedrag in euro" /></span>
      </label>}
    </div>
    <Button variant="orange">Doneer nu</Button>
  </div>;
}

function DonationPage() {
  return <>
    <Header />
    <main className="donation-page" id="top">
      <section className="donation-page-intro">
        <div>
          <h1>Help mensen sneller de juiste zorg te vinden.</h1>
          <p>Met jouw bijdrage bieden we betrouwbare informatie, leiden we ervaringsdeskundigen op en zetten we ons in voor betere endometriosezorg.</p>
        </div>
      </section>
      <section className="donation-page-content" aria-label="Donatie instellen">
        <div className="donation-page-panel">
          <img src="/images/image-10.jpg" alt="Twee vriendinnen die elkaar omhelzen" />
          <DonationPageForm />
        </div>
      </section>
    </main>
    <Footer />
  </>;
}

type TestAnswer = 'Ja' | 'Nee' | 'Weet ik niet';

function TestHeader({ finished = false }: { finished?: boolean }) {
  return <header className="test-header">
    <a className="logo" href="/" aria-label="Endometriose Stichting"><img src="/images/logo.svg" alt="Endometriose Stichting" /></a>
    <Button href="/">{finished ? 'Terug naar home' : 'Stop test'}</Button>
  </header>;
}

function TestResults({ yesCount, onBack, onDownload }: { yesCount: number; onBack: () => void; onDownload: () => void }) {
  const shouldContactDoctor = yesCount >= 3;

  return <>
    <div className="test-result-primary">
      <button className="test-back" onClick={onBack}><img src="/images/test-back.svg" alt="" />Terug naar de laatste vraag</button>
      <section className="test-card test-result" aria-labelledby="test-result-title">
        <div className="test-result-copy">
          <div className="test-result-heading">
            <p>Jouw uitslag</p>
            <h1 id="test-result-title">{shouldContactDoctor ? 'Er is kans dat je endometriose hebt.' : 'Blijf luisteren naar je lichaam.'}</h1>
            <strong>Je hebt {yesCount} van de 8 vragen met ‘ja’ beantwoord.</strong>
          </div>
          {shouldContactDoctor ? <p>Je antwoorden geven reden om je klachten verder te bespreken. Dat betekent niet automatisch dat je endometriose hebt. De test kan endometriose niet aantonen of uitsluiten.</p> : <div className="test-result-description"><p>Op basis van deze test krijg je niet automatisch het advies om contact op te nemen met je huisarts. De test kan endometriose echter niet aantonen of uitsluiten.</p><p>Heb je aanhoudende klachten, maak je je zorgen of word je in je dagelijkse leven beperkt? Bespreek je klachten dan alsnog met je huisarts.</p></div>}
        </div>
        <div className="test-result-callout"><img src="/images/test-result-info.svg" alt="" /><p>Bij drie of meer keer ‘ja’ adviseren we je contact op te nemen met je huisarts.</p></div>
        <div className="test-result-actions">
          {shouldContactDoctor ? <><Button>Bereid mijn huisartsbezoek voor</Button><Button variant="magenta-outline" href="/#klachten">Bekijk alle klachten</Button></> : <><Button href="/#klachten">Bekijk alle klachten</Button><Button variant="magenta-outline">Bereid een huisartsbezoek voor</Button></>}
        </div>
      </section>
    </div>

    {shouldContactDoctor && <section className="test-result-panel test-next-steps" aria-labelledby="next-steps-title">
      <p className="test-result-eyebrow test-result-eyebrow--orange">Wat nu?</p>
      <div className="test-step-list">
        <div className="test-step"><div><h2 id="next-steps-title">Stap 1: Download de uitslag</h2><p>Klik op ‘Download mijn uitslag’ om jouw informatie te bewaren en terug te kijken. Je kan de uitslag ook meenemen naar de huisarts. Dit kan helpen om jouw klachten te bespreken. Het helpt de huisarts ook om te bepalen of je misschien endometriose hebt.</p></div><Button variant="outline" onClick={onDownload}>Download mijn uitslag</Button></div>
        <div className="test-step"><div><h2>Stap 2: Maak een afspraak bij de huisarts</h2><p>Er is kans dat je endometriose hebt. Maak daarom een afspraak bij de huisarts. De huisarts zal je klachten met je bespreken en kan, met jouw toestemming, onderzoek doen.</p></div></div>
        <div className="test-step"><div><h2>Stap 3: Neem de uitslag mee naar de huisarts</h2><p>Neem de uitslag mee naar de huisarts. Dit helpt de huisarts om te beoordelen of je misschien endometriose hebt. Als de huisarts denkt dat je endometriose hebt, kan er een behandeling worden gestart. Klik op ‘Bereid mijn huisartsbezoek voor’ voor meer informatie over de afspraak bij de huisarts.</p></div><Button variant="outline">Bereid mijn huisartsbezoek voor</Button></div>
      </div>
    </section>}

    <section className="test-result-panel test-listening-card">
      <div><p className={`test-result-eyebrow${shouldContactDoctor ? '' : ' test-result-eyebrow--orange'}`}>Een luisterend oor</p><div><h2>{shouldContactDoctor ? 'Wil je eerst met iemand praten?' : 'Wil je graag met iemand praten?'}</h2><p>Onze ervaringsdeskundige vrijwilligers denken met je mee.</p></div></div>
      <Button variant={shouldContactDoctor ? 'magenta-outline' : 'outline'}>Stel je vraag</Button>
    </section>
  </>;
}

function TestPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(TestAnswer | null)[]>(() => testQuestions.map(() => null));
  const [finished, setFinished] = useState(false);
  const currentAnswer = answers[questionIndex];
  const yesCount = answers.filter(answer => answer === 'Ja').length;

  const chooseAnswer = (answer: TestAnswer) => {
    setAnswers(previous => previous.map((value, index) => index === questionIndex ? answer : value));
  };

  const goNext = () => {
    if (!currentAnswer) return;
    if (questionIndex === testQuestions.length - 1) {
      setFinished(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setQuestionIndex(index => index + 1);
  };

  const goBack = () => {
    if (finished) {
      setFinished(false);
      return;
    }
    setQuestionIndex(index => Math.max(0, index - 1));
  };

  const downloadResult = () => createTestResultPdf(testQuestions, answers, yesCount);

  return <>
    <TestHeader finished={finished} />
    <main className="endometriosis-test" id="top">
      <div className={`test-flow${finished ? ' test-flow--results' : ''}`}>
        {!finished && questionIndex > 0 && <button className="test-back" onClick={goBack}><img src="/images/test-back.svg" alt="" />Vorige vraag</button>}
        {!finished ? <section className="test-card" aria-labelledby="test-question">
          <div className="test-question-heading">
            <p>{questionIndex + 1}/{testQuestions.length}</p>
            <h1 id="test-question">{testQuestions[questionIndex]}</h1>
          </div>
          <div className="test-options" role="radiogroup" aria-labelledby="test-question">
            {(['Ja', 'Nee', 'Weet ik niet'] as TestAnswer[]).map(option => <button key={option} className={currentAnswer === option ? 'selected' : ''} role="radio" aria-checked={currentAnswer === option} onClick={() => chooseAnswer(option)}><img src={currentAnswer === option ? '/images/test-radio-checked.svg' : '/images/test-radio.svg'} alt="" />{option}</button>)}
          </div>
          <button className="test-next" onClick={goNext} disabled={!currentAnswer}>{questionIndex === testQuestions.length - 1 ? 'Bekijk mijn uitslag' : 'Volgende'}<img src="/images/test-next.svg" alt="" /></button>
        </section> : <TestResults yesCount={yesCount} onBack={goBack} onDownload={downloadResult} />}
      </div>
    </main>
    <Footer />
  </>;
}

function Footer() { return <footer><div className="footer-main"><div className="footer-brand"><div className="footer-brand-copy"><img src="/images/footer-logo.svg" alt="Endometriose Stichting" /><p>Voor erkenning, betrouwbare kennis en betere endometriosezorg.</p></div><Button variant="white" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><img src="/images/top-arrow.svg" alt="" />Naar boven</Button></div><div className="footer-columns">{footerColumns.map(([title,...links]) => <div key={title}><h3>{title}</h3>{links.map(link => <a href={getPageHref(link)} key={link}>{link}</a>)}</div>)}</div></div><div className="footer-bottom"><strong>© Endometriose Stichting</strong><div><a href="#">Privacy</a><a href="#">Cookies</a><a href="#">Disclaimer</a><a href="#">Toegangkelijkheid</a></div><span>ANBI/RSIN nummer: 8156.17.987</span></div></footer>; }

function HomePage() { return <><Header /><main><Hero /><Symptoms /><TestSection /><Routes /><Experts /><Stories /><Agenda /><About /><Donation /></main><Footer /></>; }

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  if (pathname === '/doneren' || pathname === '/donatie') return <DonationPage />;
  if (pathname === '/endometriosetest' || pathname === '/test') return <TestPage />;
  return <HomePage />;
}
