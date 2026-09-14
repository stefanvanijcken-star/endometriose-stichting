import { useState } from 'react';
import { createTestResultPdf } from './testResultPdf';

const symptoms = [
  ['Buik- of bekkenpijn', '/images/symptom-pelvic.svg'],
  ['Heftige menstruatiepijn', '/images/symptom-menstruation.svg'],
  ['Pijn tijdens of na seks', '/images/symptom-sex.svg'],
  ['Darm- of blaasklachten', '/images/symptom-bowel-bladder.svg'],
  ['Vruchtbaarheidsproblemen', '/images/symptom-fertility.svg'],
  ['Extreme vermoeidheid', '/images/symptom-fatigue.svg'],
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

const getPageHref = (label: string) => {
  if (label === 'Doe de Endometriosetest') return '/endometriosetest';
  if (label === 'Wat is endometriose?') return '/wat-is-endometriose';
  if (label === 'Klachten') return '/klachten';
  if (label === 'Bereid je huisartsbezoek voor') return '/bereid-je-huisartsbezoek-voor';
  return '#';
};

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
  <div className="hero-main"><div className="hero-copy"><h1>Je klachten verdienen aandacht.</h1><p>Endometriose kan grote invloed hebben op je dagelijks leven. Herken de klachten, krijg betrouwbare informatie en ontdek welke stap je nu kunt nemen.</p></div><div className="button-row"><Button href="/endometriosetest">Doe de endometriosetest</Button><Button variant="white" href="/wat-is-endometriose">Wat is endometriose?</Button></div></div>
  <div className="hero-meta"><div className="diagnosis"><strong>Heb je al een diagnose?</strong><span>Vind <u>hier</u> informatie en ondersteuning die bij jou past.</span></div><div><strong>1 op de 10</strong><span>vrouwen heeft endometriose</span></div></div>
  </section>; }

function SectionHeading({ title, copy, action }: { title: string; copy: string; action?: React.ReactNode }) { return <div className="section-heading"><div><h2>{title}</h2><p>{copy}</p></div>{action}</div>; }

function Symptoms() { return <section className="section symptoms" id="klachten"><SectionHeading title="Herken je dit?" copy="Endometriose uit zich bij iedereen anders. Klachten kunnen tijdens de menstruatie optreden, maar ook op andere momenten." action={<Button href="/klachten">Bekijk alle klachten</Button>} /><div className="symptoms-layout"><div className="symptom-grid">{symptoms.map(([title, icon]) => <article className="symptom-card" key={title}><span className="symptom-icon"><img src={icon} alt="" /></span><h3>{title}</h3></article>)}</div><img className="symptoms-image" src="/images/symptoms-photo.png" alt="Vrouw bij een raam" /></div><div className="mobile-section-action"><Button full href="/klachten">Bekijk alle klachten</Button></div></section>; }

function TestSection() { const [answer, setAnswer] = useState('Ja'); return <section className="section test-section"><div className="test-copy"><SectionHeading title="Zijn jouw klachten normaal?" copy="Beantwoord acht korte vragen over je klachten. De test stelt geen diagnose, maar helpt je bepalen of het verstandig is om je klachten met je huisarts te bespreken." /><ul className="facts"><li><img src="/images/test-questions.svg" alt="" />8 vragen</li><li><img src="/images/test-time.svg" alt="" />Ongeveer 2 minuten</li><li><img src="/images/test-insight.svg" alt="" />Direct inzicht in mogelijke vervolgstappen</li></ul><Button href="/endometriosetest">Start de test</Button></div><div className="question-card"><small>4/8</small><h3>Moet je door je menstruatieklachten soms thuisblijven van school, werk of sport?</h3><div className="radio-list">{['Ja', 'Nee', 'Weet ik niet'].map(option => <label key={option}><input type="radio" name="answer" checked={answer === option} onChange={() => setAnswer(option)} />{option}</label>)}</div></div></section>; }

function Routes() { return <section className="section routes"><SectionHeading title="Waar sta jij?" copy="Iedere situatie is anders. Kies wat het beste bij jou past, dan helpen we je gericht verder." /><div className="route-grid">{routes.map(([title, copy, action]) => <article className="soft-card route-card" key={title}><div><h3>{title}</h3><p>{copy}</p></div><Button variant="outline" href={title === 'Ik heb klachten' ? '/klachten' : undefined}>{action}</Button></article>)}</div></section>; }

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
          {shouldContactDoctor ? <><Button href="/bereid-je-huisartsbezoek-voor">Bereid mijn huisartsbezoek voor</Button><Button variant="magenta-outline" href="/klachten">Bekijk alle klachten</Button></> : <><Button href="/klachten">Bekijk alle klachten</Button><Button variant="magenta-outline" href="/bereid-je-huisartsbezoek-voor">Bereid een huisartsbezoek voor</Button></>}
        </div>
      </section>
    </div>

    {shouldContactDoctor && <section className="test-result-panel test-next-steps" aria-labelledby="next-steps-title">
      <p className="test-result-eyebrow test-result-eyebrow--orange">Wat nu?</p>
      <div className="test-step-list">
        <div className="test-step"><div><h2 id="next-steps-title">Stap 1: Download de uitslag</h2><p>Klik op ‘Download mijn uitslag’ om jouw informatie te bewaren en terug te kijken. Je kan de uitslag ook meenemen naar de huisarts. Dit kan helpen om jouw klachten te bespreken. Het helpt de huisarts ook om te bepalen of je misschien endometriose hebt.</p></div><Button variant="outline" onClick={onDownload}>Download mijn uitslag</Button></div>
        <div className="test-step"><div><h2>Stap 2: Maak een afspraak bij de huisarts</h2><p>Er is kans dat je endometriose hebt. Maak daarom een afspraak bij de huisarts. De huisarts zal je klachten met je bespreken en kan, met jouw toestemming, onderzoek doen.</p></div></div>
        <div className="test-step"><div><h2>Stap 3: Neem de uitslag mee naar de huisarts</h2><p>Neem de uitslag mee naar de huisarts. Dit helpt de huisarts om te beoordelen of je misschien endometriose hebt. Als de huisarts denkt dat je endometriose hebt, kan er een behandeling worden gestart. Klik op ‘Bereid mijn huisartsbezoek voor’ voor meer informatie over de afspraak bij de huisarts.</p></div><Button variant="outline" href="/bereid-je-huisartsbezoek-voor">Bereid mijn huisartsbezoek voor</Button></div>
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

type RelatedArticle = { title: string; copy: string; image: string; href: string };

function ArticleHero({ title, copy, current, image, primary, secondary, breadcrumbs = ['Endometriose', 'Begrijpen'] }: { title: string; copy: React.ReactNode; current: string; image: string; primary: React.ReactNode; secondary: React.ReactNode; breadcrumbs?: string[] }) {
  const backgroundImage = "linear-gradient(90deg,rgba(243,134,39,.08),rgba(197,42,114,.2)),linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2)),url('" + image + "')";
  return <section className="article-hero" style={{ backgroundImage }}>
    <div className="article-hero-inner">
      <div className="article-breadcrumbs" aria-label="Broodkruimelpad">
        <a href="/" aria-label="Home"><img src="/images/breadcrumb-home.svg" alt="" /></a>
        {[...breadcrumbs, current].map(item => <span key={item}><img src="/images/breadcrumb-chevron.svg" alt="" />{item}</span>)}
      </div>
      <div className="article-hero-copy"><h1>{title}</h1><div className="article-hero-description">{typeof copy === 'string' ? <p>{copy}</p> : copy}</div></div>
      <div className="article-actions">{primary}{secondary}</div>
    </div>
  </section>;
}

function ArticleSummary({ items }: { items: string[] }) {
  return <section className="article-section article-summary"><div className="article-summary-inner"><img src="/images/article-summary.svg" alt="" /><div><h2>In het kort</h2><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></div></div></section>;
}

function ArticleCallout({ children }: { children: React.ReactNode }) {
  return <div className="article-callout"><span aria-hidden="true" /><p>{children}</p></div>;
}

function MedicalReview({ inverse = false }: { inverse?: boolean }) {
  return <div className={'medical-review' + (inverse ? ' medical-review--inverse' : '')}>
    <p><strong>Laatste inhoudelijke controle:</strong> 13-09-2026<br /><strong>Medisch gecontroleerd door:</strong> Lennie van Hanegem</p>
    <p>Deze informatie is algemeen en vervangt geen persoonlijk medisch advies. Bespreek vragen of zorgen over je gezondheid met je huisarts of behandelend arts.</p>
  </div>;
}

function RelatedArticles({ cards }: { cards: RelatedArticle[] }) {
  return <section className="article-section article-related"><div className="article-wide"><h2>Lees ook</h2><div className="article-related-grid">{cards.map(card => <a className="article-related-card" href={card.href} key={card.title}><img src={card.image} alt="" /><div><div><h3>{card.title}</h3><p>{card.copy}</p></div><span className="button button--magenta-outline">Meer info</span></div></a>)}</div></div></section>;
}

const whatRelated: RelatedArticle[] = [
  { title: 'Klachten', copy: 'Lees welke klachten bij endometriose kunnen voorkomen.', image: '/images/related-complaints.png', href: '/klachten' },
  { title: 'Diagnose', copy: 'Lees hoe onderzoek en diagnose verlopen en wat je kunt verwachten.', image: '/images/related-diagnosis.png', href: '#' },
  { title: 'Adenomyose', copy: 'Lees wat adenomyose is en hoe het verschilt van endometriose.', image: '/images/related-adenomyosis.png', href: '#' },
];

const complaintsRelated: RelatedArticle[] = [
  { title: 'Wat is endometriose?', copy: 'Lees wat endometriose is en welke invloed de aandoening kan hebben.', image: '/images/article-endometriosis-hero.jpg', href: '/wat-is-endometriose' },
  { title: 'Adenomyose', copy: 'Lees wat adenomyose is en hoe het verschilt van endometriose.', image: '/images/related-adenomyosis.png', href: '#' },
  { title: 'Diagnose', copy: 'Lees hoe onderzoek en diagnose verlopen en wat je kunt verwachten.', image: '/images/related-diagnosis.png', href: '#' },
];

function WhatIsEndometriosisPage() {
  return <><Header /><main className="article-page" id="top">
    <ArticleHero
      current="Wat is endometriose?"
      title="Wat is endometriose?"
      copy="Endometriose is een chronische aandoening waarbij weefsel dat lijkt op het slijmvlies aan de binnenkant van de baarmoeder buiten de baarmoeder aanwezig is. Dit kan ontstekingen, littekenweefsel en verklevingen veroorzaken. Waar endometriose voorkomt en hoeveel klachten iemand ervaart, verschilt per persoon."
      image="/images/article-endometriosis-hero.jpg"
      primary={<Button href="/klachten">Bekijk de klachten</Button>}
      secondary={<Button variant="white" href="/endometriosetest">Doe de Endometriosetest</Button>}
    />
    <ArticleSummary items={[
      'Endometrioseweefsel bevindt zich buiten de baarmoeder.',
      'Het kan ontstekingen, pijn, littekenweefsel en verklevingen veroorzaken.',
      'Endometriose wordt meestal gevonden in de buik en het bekken.',
      'De klachten en de invloed op het dagelijks leven verschillen per persoon.',
      'De precieze oorzaak van endometriose is nog niet bekend.',
    ]} />
    <section className="article-section article-section--pale"><div className="article-flow">
      <div className="article-copy"><h2>Wat gebeurt er in het lichaam?</h2><p>Aan de binnenkant van de baarmoeder zit het baarmoederslijmvlies. Dit slijmvlies verandert onder invloed van hormonen tijdens de menstruatiecyclus.</p><p>Bij endometriose bevindt zich buiten de baarmoeder weefsel dat op dit baarmoederslijmvlies lijkt. Ook dit weefsel is gevoelig voor hormonen en kan een chronische ontstekingsreactie veroorzaken.</p><p>Door deze ontstekingsreactie kunnen pijn, littekenweefsel en verklevingen ontstaan. Bij verklevingen komen organen of andere structuren in de buik aan elkaar vast te zitten. Dit kan pijn of andere klachten veroorzaken.</p><p>Niet iedereen met endometriose ervaart dezelfde klachten. De hoeveelheid endometriose die bij onderzoek zichtbaar is, zegt bovendien niet altijd iets over de hoeveelheid pijn die iemand heeft.</p><ArticleCallout>Endometriose is meer dan menstruatiepijn. De aandoening kan invloed hebben op verschillende delen van het lichaam en op het dagelijks leven.</ArticleCallout></div>
      <div className="article-copy"><h2>Waar kan endometriose voorkomen?</h2><p>Endometriose wordt meestal gevonden in de buik en het bekken. Veelvoorkomende plaatsen zijn:</p><ul><li>het buikvlies;</li><li>de eierstokken;</li><li>rondom de baarmoeder en eileiders;</li><li>tussen de baarmoeder en de endeldarm;</li><li>op of rondom de darmen;</li><li>op of rondom de blaas.</li></ul><p>Op de eierstokken kunnen cysten ontstaan die gevuld zijn met oud bloed. Deze cysten worden endometriomen genoemd.</p><p>Endometriose kan soms ook op andere plaatsen in het lichaam voorkomen, bijvoorbeeld rond het middenrif of in een operatielitteken. Dit gebeurt minder vaak.</p><p>De plaats van de endometriose bepaalt niet automatisch hoeveel klachten iemand ervaart. Een kleine plek kan veel pijn veroorzaken, terwijl uitgebreidere endometriose soms weinig klachten geeft.</p></div>
      <img className="article-diagram" src="/images/endometriosis-diagram.png" alt="Illustratie van plaatsen waar endometriose kan voorkomen" />
      <div className="article-copy"><h2>Hoe ontstaat endometriose?</h2><p>De precieze oorzaak van endometriose is nog niet bekend. Waarschijnlijk spelen meerdere factoren samen een rol.</p><p>Onderzoekers kijken onder andere naar:</p><ul><li>erfelijke aanleg;</li><li>de werking van hormonen;</li><li>het afweersysteem;</li><li>ontstekingsreacties in het lichaam.</li></ul><p>Endometriose komt in sommige families vaker voor. Dat betekent niet dat iedereen met endometriose ook een familielid met de aandoening heeft.</p><p>Ook is niet aangetoond dat endometriose ontstaat door één bepaalde leefstijl, voedingskeuze of hoeveelheid stress.</p><ArticleCallout>Endometriose is niet jouw schuld.</ArticleCallout></div>
      <MedicalReview />
    </div></section>
    <section className="article-section"><div className="article-copy article-cta"><h2>Herken je klachten bij jezelf?</h2><p>Endometriose kan verschillende klachten veroorzaken, zoals heftige menstruatiepijn, buik- of bekkenpijn, darm- en blaasklachten, pijn tijdens of na seks en extreme vermoeidheid.</p><p>Lees welke klachten kunnen voorkomen of beantwoord acht korte vragen met de Endometriosetest. De test stelt geen diagnose, maar kan helpen bepalen of het verstandig is om je klachten met de huisarts te bespreken.</p><div className="article-actions"><Button href="/klachten">Bekijk de klachten</Button><Button variant="magenta-outline" href="/endometriosetest">Doe de Endometriosetest</Button></div></div></section>
    <RelatedArticles cards={whatRelated} />
  </main><Footer /></>;
}

const complaintCards = [
  ['Heftige menstruatiepijn', 'Pijn die je dagelijkse leven, school, werk, slaap of sport belemmert.', '/images/symptom-menstruation.svg'],
  ['Buik- of bekkenpijn', 'Terugkerende of aanhoudende pijn, ook buiten je menstruatie.', '/images/symptom-pelvic.svg'],
  ['Darm- of blaasklachten', 'Pijn of andere klachten rond ontlasting en plassen.', '/images/symptom-bowel-bladder.svg'],
  ['Pijn tijdens of na seks', 'Pijn of een onaangenaam gevoel tijdens of na seksuele activiteit.', '/images/symptom-sex.svg'],
  ['Extreme vermoeidheid', 'Een uitputting die niet verdwijnt na een goede nachtrust.', '/images/symptom-fatigue.svg'],
  ['Vruchtbaarheidsproblemen', 'Moeilijk zwanger worden kan samenhangen met endometriose.', '/images/symptom-fertility.svg'],
];

function ComplaintDetail({ title, icon, children, callout }: { title: string; icon: string; children: React.ReactNode; callout?: string }) {
  return <div className="complaint-detail"><span className="complaint-detail-icon"><img src={icon} alt="" /></span><div className="article-copy"><h2>{title}</h2>{children}{callout && <ArticleCallout>{callout}</ArticleCallout>}</div></div>;
}

function ComplaintsPage() {
  return <><Header /><main className="article-page" id="top">
    <ArticleHero
      current="Klachten"
      title="Klachten van endometriose"
      copy="Endometriose kan verschillende klachten veroorzaken. Welke klachten je hebt en hoeveel last je daarvan ervaart, verschilt per persoon. Sommige klachten ontstaan vooral rond de menstruatie, andere kunnen op ieder moment aanwezig zijn."
      image="/images/article-complaints-hero.png"
      primary={<Button href="/endometriosetest">Doe de Endometriosetest</Button>}
      secondary={<Button variant="white" href="/bereid-je-huisartsbezoek-voor">Bereid je huisartsbezoek voor</Button>}
    />
    <ArticleSummary items={[
      'Endometriose uit zich bij iedereen anders.',
      'De hoeveelheid pijn zegt niet altijd iets over de ernst van de aandoening.',
      'Klachten kunnen ook buiten de menstruatie voorkomen.',
      'Alleen een arts kan beoordelen waardoor je klachten ontstaan.',
    ]} />
    <section className="article-section article-section--pale"><div className="article-wide article-complaint-intro"><div><h2>Herken je dit?</h2><p>Deze klachten komen regelmatig voor bij endometriose. Eén klacht zegt niet alles: klachten kunnen ook een andere oorzaak hebben.</p></div><div className="article-complaint-grid">{complaintCards.map(([title, copy, icon]) => <article key={title}><span className="symptom-icon"><img src={icon} alt="" /></span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></section>
    <section className="article-section"><div className="article-copy"><h2>Klachten verschillen per persoon</h2><p>Niet iedereen met endometriose ervaart dezelfde klachten. De ene persoon heeft vooral pijn tijdens de menstruatie, terwijl een ander dagelijks buik- of bekkenpijn heeft. Ook de intensiteit kan wisselen.</p><p>De hoeveelheid pijn komt niet altijd overeen met de hoeveelheid of uitgebreidheid van de endometriose. Iemand met weinig zichtbare endometriose kan veel pijn ervaren, terwijl iemand anders met uitgebreidere endometriose relatief weinig klachten heeft.</p><ArticleCallout>Jouw ervaring telt. Pijn of andere klachten die je dagelijks leven beperken, verdienen aandacht.</ArticleCallout></div></section>
    <section className="article-section article-section--pale"><div className="article-flow">
      <ComplaintDetail title="Heftige menstruatiepijn" icon="/images/symptom-menstruation.svg"><p>Buikkrampen tijdens de menstruatie komen vaak voor. Maar pijn waardoor je niet naar school of werk kunt, niet kunt slapen of nauwelijks normaal kunt functioneren, is een reden om hulp te zoeken.</p><p>De pijn kan vóór de menstruatie beginnen en tijdens of na de menstruatie doorgaan. Sommige mensen hebben daarnaast last van lage rugpijn, pijn in de benen, misselijkheid of hevig bloedverlies.</p><p><strong>Let bijvoorbeeld op:</strong></p><ul><li>je moet regelmatig thuisblijven vanwege de pijn;</li><li>gewone pijnstillers helpen onvoldoende;</li><li>de pijn wordt sterker of houdt langer aan;</li><li>je kunt dagelijkse activiteiten niet normaal uitvoeren.</li></ul></ComplaintDetail>
      <ComplaintDetail title="Buik- of bekkenpijn" icon="/images/symptom-pelvic.svg"><p>Endometriose kan terugkerende of langdurige pijn in de onderbuik of het bekken veroorzaken. Deze pijn hoeft niet uitsluitend tijdens de menstruatie aanwezig te zijn.</p><p>De pijn kan stekend, zeurend, krampend of drukkend aanvoelen. Soms straalt de pijn uit naar de onderrug of benen. Langdurige pijn kan ook invloed hebben op slaap, concentratie, beweging en mentale gezondheid.</p></ComplaintDetail>
      <ComplaintDetail title="Darm- en blaasklachten" icon="/images/symptom-bowel-bladder.svg"><p>Darm- en blaasklachten kunnen rond de menstruatie sterker worden, maar ook op andere momenten voorkomen.</p><p><strong>Mogelijke darmklachten zijn:</strong></p><ul><li>buikkrampen;</li><li>pijn bij de ontlasting;</li><li>diarree of verstopping;</li><li>een opgeblazen gevoel;</li><li>het gevoel dat je naar het toilet moet terwijl er niets komt.</li></ul><p><strong>Mogelijke blaasklachten zijn:</strong></p><ul><li>pijn of een branderig gevoel bij het plassen;</li><li>vaker moeten plassen;</li><li>plotselinge of loze aandrang;</li><li>pijn rond een volle blaas.</li></ul><p>Darm- en blaasklachten kunnen verschillende oorzaken hebben. Bespreek terugkerende, ernstige of onverklaarde klachten daarom met je huisarts.</p></ComplaintDetail>
      <ComplaintDetail title="Pijn tijdens of na seks" icon="/images/symptom-sex.svg" callout="Seks hoort niet iets te zijn waar je doorheen moet vanwege de pijn."><p>Endometriose kan pijn veroorzaken tijdens of na seksuele activiteit. De pijn kan oppervlakkig zijn, maar ook dieper in de buik of het bekken worden gevoeld.</p><p>Pijn kan ervoor zorgen dat je onbewust je bekkenbodemspieren aanspant of seksuele activiteit gaat vermijden. Het is begrijpelijk als je dit lastig vindt om te bespreken, maar je hoeft je er niet voor te schamen. Je kunt deze klacht met je huisarts of behandelaar bespreken.</p></ComplaintDetail>
      <ComplaintDetail title="Extreme vermoeidheid" icon="/images/symptom-fatigue.svg"><p>Vermoeidheid bij endometriose kan anders voelen dan gewone moeheid. Je kunt je uitgeput voelen na een kleine inspanning of onvoldoende herstellen na slaap en rust.</p><p>Vermoeidheid is niet specifiek voor endometriose en kan veel verschillende oorzaken hebben. Bespreek aanhoudende of ernstige vermoeidheid daarom met je huisarts.</p></ComplaintDetail>
      <ComplaintDetail title="Vruchtbaarheid en kinderwens" icon="/images/symptom-fertility.svg"><p>Endometriose kan invloed hebben op de vruchtbaarheid, maar dit betekent niet dat iedereen met endometriose moeilijk zwanger wordt.</p><p>Heb je een kinderwens of lukt het niet om zwanger te worden? Bespreek dit dan met je huisarts of behandelend arts. Samen kunnen jullie bekijken of verder onderzoek nodig is.</p></ComplaintDetail>
    </div></section>
    <section className="article-section article-other-complaints"><div className="article-flow"><div className="article-copy"><h2>Andere mogelijke klachten</h2><p>Naast de meest voorkomende klachten kunnen mensen onder andere last hebben van:</p><ul><li>lage rugpijn;</li><li>pijn in de benen;</li><li>pijn rond de eisprong;</li><li>een gezwollen of opgeblazen buik;</li><li>slecht slapen;</li><li>problemen met concentreren;</li><li>somberheid of prikkelbaarheid;</li><li>pijn tijdens een inwendig onderzoek.</li></ul><p>Deze klachten kunnen ook een andere oorzaak hebben. Ze betekenen op zichzelf niet dat je endometriose hebt.</p></div><MedicalReview inverse /></div></section>
    <section className="article-section"><div className="article-copy article-cta"><h2>Klachten kunnen veranderen</h2><p>Klachten kunnen in de loop van de tijd veranderen. Ze kunnen sterker of vaker worden, maar ook tijdelijk verminderen. Sommige mensen hebben eerst alleen pijn tijdens de menstruatie en krijgen later ook klachten op andere momenten.</p><p>Het kan helpen om gedurende enkele weken of menstruatiecycli bij te houden:</p><ul><li>welke klachten je hebt;</li><li>wanneer ze optreden;</li><li>hoe hevig ze zijn;</li><li>hoelang ze duren;</li><li>wat de invloed is op je dagelijks leven;</li><li>welke medicijnen je gebruikt en of die helpen.</li></ul><Button><img src="/images/download-white.svg" alt="" />Download het klachtendagboek</Button></div></section>
    <section className="article-section article-section--pale"><div className="article-copy article-cta"><h2>Wanneer ga je naar de huisarts?</h2><p>Maak een afspraak wanneer klachten terugkeren, erger worden of je dagelijks leven beïnvloeden. Denk bijvoorbeeld aan pijn waardoor je niet naar school, werk of sport kunt, pijnstillers die onvoldoende helpen of buikpijn die ook buiten de menstruatie blijft bestaan.</p><p>Je hoeft niet eerst zeker te weten dat het endometriose is. De huisarts kan met je bespreken waardoor de klachten mogelijk ontstaan en welke vervolgstappen passend zijn.</p><Button href="/bereid-je-huisartsbezoek-voor">Bereid je huisartsbezoek voor<img src="/images/arrow-white.svg" alt="" /></Button></div></section>
    <section className="article-section"><div className="article-copy article-cta"><h2>Wat kun je nu doen?</h2><p>Herken je meerdere klachten of hebben ze invloed op je dagelijks leven? Doe de test of bereid een gesprek met je huisarts voor.</p><div className="article-actions"><Button href="/endometriosetest">Doe de Endometriosetest</Button><Button variant="magenta-outline">Stel je vraag aan een ervaringsdeskundige</Button></div></div></section>
    <RelatedArticles cards={complaintsRelated} />
  </main><Footer /></>;
}

const doctorVisitRelated: RelatedArticle[] = [
  { title: 'Klachten', copy: 'Lees welke klachten bij endometriose kunnen voorkomen.', image: '/images/related-complaints.png', href: '/klachten' },
  { title: 'Adenomyose', copy: 'Lees wat adenomyose is en hoe het verschilt van endometriose.', image: '/images/related-adenomyosis.png', href: '#' },
  { title: 'Wat is endometriose?', copy: 'Lees wat endometriose is en welke invloed de aandoening kan hebben.', image: '/images/article-endometriosis-hero.jpg', href: '/wat-is-endometriose' },
];

function DoctorStep({ number, title, children }: { number: 1 | 2 | 3; title: string; children: React.ReactNode }) {
  return <article className="doctor-step"><img src={`/images/doctor-step-${number}.svg`} alt={`Stap ${number}`} /><div><h3>{title}</h3>{children}</div></article>;
}

function DoctorVisitPage() {
  return <><Header /><main className="article-page doctor-page" id="top">
    <ArticleHero
      current="Bereid je huisartsbezoek voor"
      breadcrumbs={['Hulp & Zorg', 'Klachten en diagnose']}
      title="Ga voorbereid naar je huisarts"
      copy={<><p>Heb je klachten die mogelijk bij endometriose passen? Een goede voorbereiding helpt je om duidelijk te vertellen wat je ervaart en welke invloed dit op je dagelijks leven heeft.</p><p>Op deze pagina lees je wat je vooraf kunt bijhouden, wat je kunt meenemen en welke vragen je aan de huisarts kunt stellen.</p></>}
      image="/images/doctor-visit-hero.png"
      primary={<Button href="#vragenlijst">Download de gesprekshulp</Button>}
      secondary={<Button variant="white" href="#voorbereiden">Zo bereid je je voor</Button>}
    />
    <section className="article-section doctor-summary"><div className="doctor-summary-inner">
      <div className="article-summary-inner"><img src="/images/article-summary.svg" alt="" /><div><h2>In het kort</h2><ul><li>Houd bij wanneer je klachten optreden.</li><li>Beschrijf wat de klachten met je dagelijks leven doen.</li><li>Noteer welke medicijnen of oplossingen je hebt geprobeerd.</li><li>Bedenk wat je tijdens de afspraak wilt vragen.</li><li>Neem je aantekeningen mee op papier of op je telefoon.</li></ul></div></div>
      <ArticleCallout>Wacht niet met het maken van een afspraak totdat je alles hebt bijgehouden. Ook zonder volledig overzicht kun je naar je huisarts.</ArticleCallout>
    </div></section>
    <section className="article-section article-section--pale" id="voorbereiden"><div className="doctor-steps article-wide">
      <div className="doctor-section-heading"><h2>Bereid je gesprek in 3 stappen voor</h2><p>Je hoeft geen uitgebreid medisch verslag te maken. Korte en concrete aantekeningen kunnen de huisarts al helpen om je klachten beter te begrijpen.</p></div>
      <div className="doctor-step-list">
        <DoctorStep number={1} title="Houd je klachten bij"><p>Schrijf gedurende een aantal dagen of weken op wanneer je klachten optreden. Noteer ook of je op dat moment ongesteld bent.</p><p>Schrijf per moment kort op:</p><ul><li>welke klacht je hebt;</li><li>waar je de klacht voelt;</li><li>hoe ernstig de klacht is op een schaal van 0 tot 10;</li><li>hoe lang de klacht duurt;</li><li>wat je hierdoor niet of moeilijk kunt doen.</li></ul></DoctorStep>
        <DoctorStep number={2} title="Noteer wat de klachten met je leven doen"><p>Vertel niet alleen hoeveel pijn je hebt. Het is ook belangrijk om te beschrijven welke invloed de klachten op je dagelijks leven hebben.</p><p>Denk bijvoorbeeld aan:</p><ul><li>school, studie of werk missen;</li><li>activiteiten moeten afzeggen;</li><li>slecht slapen;</li><li>moeite hebben met bewegen;</li><li>pijn bij het plassen of de ontlasting;</li><li>pijn tijdens of na seks;</li><li>vermoeidheid of concentratieproblemen.</li></ul></DoctorStep>
        <DoctorStep number={3} title="Schrijf op wat je al hebt geprobeerd"><p>Noteer welke medicijnen, anticonceptie of andere oplossingen je gebruikt of hebt geprobeerd.</p><p>Schrijf daarbij op:</p><ul><li>wat je hebt gebruikt;</li><li>of het voldoende hielp;</li><li>of je bijwerkingen kreeg;</li><li>waarom je eventueel bent gestopt.</li></ul><p>Denk bijvoorbeeld aan pijnstillers, hormonale anticonceptie, warmte, rust of fysiotherapie. Verander het gebruik van medicijnen niet zonder overleg met je huisarts of apotheker.</p></DoctorStep>
      </div>
    </div></section>
    <section className="article-section doctor-download" id="vragenlijst"><div className="article-copy article-cta"><h2>Vul de vragenlijst vooraf in</h2><p>De Endometriose Stichting heeft een uitgebreide vragenlijst gemaakt om je te helpen bij de voorbereiding op je afspraak. De vragen gaan onder andere over je menstruatie, pijn, darm- en blaasklachten, medicijnen en de invloed van je klachten op je leven.</p><p>Vul in wat voor jou relevant is. Je hoeft niet op iedere vraag direct een antwoord te weten. Neem de ingevulde vragenlijst mee op papier of op je telefoon.</p><Button variant="white">Download de vragenlijst</Button></div></section>
    <section className="article-section doctor-guidance"><div className="article-flow">
      <div className="article-copy"><h2>Neem iemand mee die je vertrouwt</h2><p>Een afspraak kan spannend of overweldigend zijn. Je mag daarom iemand meenemen, bijvoorbeeld je partner, een familielid, vriend of vriendin.</p><p>Die persoon kan:</p><ul><li>je helpen om je verhaal te vertellen;</li><li>meeluisteren en aantekeningen maken;</li><li>vragen stellen die je zelf vergeet;</li><li>je ondersteunen als je gespannen raakt;</li><li>na afloop samen met jou de afspraken doornemen.</li></ul><p>Bespreek vooraf wat je graag zelf wilt vertellen en waarbij de ander je kan helpen.</p><ArticleCallout>Vraag degene die met je meegaat om de gemaakte afspraken op te schrijven. Zo hoef jij tijdens het gesprek niet alles tegelijk te onthouden.</ArticleCallout></div>
      <div className="article-copy"><h2>Vertel wat de klachten met je leven doen</h2><p>Je hoeft geen medische termen te gebruiken en je hoeft zelf geen diagnose te stellen. Vertel zo concreet mogelijk wat je ervaart, hoe vaak dit gebeurt en wat je door de klachten niet of moeilijk kunt doen.</p><p>Vertel ook wanneer je klachten niet alleen tijdens je menstruatie optreden. Benoem wat je al hebt geprobeerd en of dat voldoende heeft geholpen.</p></div>
      <div className="article-copy"><h2>Stel alle vragen die je hebt</h2><p>Jouw vragen zijn een belangrijk onderdeel van de afspraak. Schrijf ze vooraf op en neem de lijst mee. Er zijn geen verkeerde of onbelangrijke vragen.</p><p>Je kunt bijvoorbeeld vragen:</p><ul><li>Kunnen mijn klachten bij endometriose passen?</li><li>Welke andere oorzaken kunnen mijn klachten hebben?</li><li>Is onderzoek nodig?</li><li>Welke behandelingen of pijnbestrijding kunnen we proberen?</li><li>Wat zijn de mogelijke voordelen en nadelen daarvan?</li><li>Wanneer kan ik verbetering verwachten?</li><li>Wat doen we als deze aanpak onvoldoende helpt?</li><li>Wanneer is een verwijzing naar een gynaecoloog passend?</li><li>Bij welke veranderingen moet ik opnieuw contact opnemen?</li><li>Wanneer bespreken we hoe het gaat?</li></ul><p>Heb je veel vragen? Vertel dit aan het begin van de afspraak. Als niet alles besproken kan worden, vraag dan om een vervolgafspraak voor de vragen die nog openstaan.</p><ArticleCallout>Je mag altijd om uitleg vragen. Bijvoorbeeld: “Kunt u dat in eenvoudigere woorden uitleggen?” of “Waarom adviseert u deze stap?”</ArticleCallout></div>
      <div className="article-copy"><h2>Zorg dat je weet wat de volgende stap is</h2><p>Aan het einde van de afspraak hoort duidelijk te zijn wat jullie hebben besproken en hoe het verdergaat. Neem samen de gemaakte afspraken door en schrijf ze op.</p><p>Controleer voordat je vertrekt of je weet:</p><ul><li>wat de huisarts denkt dat er mogelijk aan de hand is;</li><li>of er onderzoek of een behandeling wordt voorgesteld;</li><li>wat je zelf kunt doen;</li><li>wanneer jullie het resultaat evalueren;</li><li>wanneer je opnieuw contact moet opnemen;</li><li>wat er gebeurt als je klachten niet verminderen;</li><li>of en wanneer een verwijzing wordt overwogen.</li></ul></div>
      <div className="article-copy"><h2>Bespreek samen wat er is afgesproken</h2><p>Neem na de afspraak rustig je aantekeningen door, bij voorkeur samen met degene die met je mee was. Schrijf vragen die later opkomen meteen op.</p><p>Is iets onduidelijk, veranderen je klachten of helpt de afgesproken aanpak onvoldoende? Neem dan opnieuw contact op met de huisartsenpraktijk.</p><ArticleCallout>Blijf benoemen welke invloed de klachten op je dagelijks leven hebben. Klachten die je structureel beperken, verdienen aandacht.</ArticleCallout></div>
    </div></section>
    <RelatedArticles cards={doctorVisitRelated} />
  </main><Footer /></>;
}

function HomePage() { return <><Header /><main><Hero /><Symptoms /><TestSection /><Routes /><Experts /><Stories /><Agenda /><About /><Donation /></main><Footer /></>; }

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  if (pathname === '/doneren' || pathname === '/donatie') return <DonationPage />;
  if (pathname === '/endometriosetest' || pathname === '/test') return <TestPage />;
  if (pathname === '/wat-is-endometriose') return <WhatIsEndometriosisPage />;
  if (pathname === '/klachten') return <ComplaintsPage />;
  if (pathname === '/bereid-je-huisartsbezoek-voor') return <DoctorVisitPage />;
  return <HomePage />;
}
