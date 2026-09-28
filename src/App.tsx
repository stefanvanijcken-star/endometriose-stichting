import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createTestResultPdf } from './testResultPdf';

type NavLink = { label: string; href: string };
type NavGroup = { heading?: string; links: NavLink[] };
type NavItem = { label: string; href?: string; groups: NavGroup[] };

const nav: NavItem[] = [
  {
    label: 'Endometriose',
    href: '/wat-is-endometriose',
    groups: [
      { heading: 'Begrijpen', links: [
        { label: 'Wat is endometriose?', href: '/wat-is-endometriose' },
        { label: 'Wat is adenomyose?', href: '/wat-is-adenomyose' },
      ] },
      { heading: 'Herkennen', links: [
        { label: 'Klachten en symptomen', href: '/klachten' },
        { label: 'Doe de Endometriosetest', href: '/endometriosetest' },
      ] },
    ],
  },
  {
    label: 'Zorg',
    groups: [
      { heading: 'Diagnose en behandeling', links: [
        { label: 'Bereid je huisartsbezoek voor', href: '/bereid-je-huisartsbezoek-voor' },
        { label: 'Onderzoek en diagnose', href: '#' },
        { label: 'Behandelmogelijkheden', href: '#' },
      ] },
    ],
  },
  {
    label: 'Leven & hulp',
    groups: [
      { heading: 'Ondersteuning en contact', links: [
        { label: 'Leven met endometriose', href: '#' },
        { label: 'Hulp en lotgenotencontact', href: '#' },
        { label: 'Voor naasten', href: '#' },
        { label: 'Ervaringsverhalen', href: '#' },
        { label: 'Agenda', href: '#' },
      ] },
    ],
  },
  {
    label: 'Over ons',
    groups: [
      { heading: 'De stichting', links: [
        { label: 'Over de Endometriose Stichting', href: '#' },
        { label: 'Wat we doen', href: '#' },
        { label: 'Help de stichting', href: '#' },
        { label: 'Word vrijwilliger', href: '#' },
        { label: 'Nieuws, onderzoek en media', href: '#' },
      ] },
      { heading: 'Meer informatie', links: [
        { label: 'Downloads en folders', href: '#' },
        { label: 'Voor zorgprofessionals', href: '#' },
        { label: 'Jaarverslagen en ANBI', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Webshop', href: '#' },
      ] },
    ],
  },
];

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

function Button({ children, variant = 'primary', onClick, full = false, href, download }: { children: React.ReactNode; variant?: 'primary' | 'orange' | 'white' | 'outline' | 'magenta-outline'; onClick?: () => void; full?: boolean; href?: string; download?: boolean | string }) {
  const className = `button button--${variant}${full ? ' button--full' : ''}`;
  if (href) return <a className={className} href={href} download={download}>{children}</a>;
  return <button className={className} onClick={onClick}>{children}</button>;
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      if (currentY < 120) setHidden(false);
      else if (delta > 4) setHidden(true);
      else if (delta < -4) setHidden(false);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileOpen]);

  const shouldHide = hidden && !mobileOpen && !active;
  return <header className={`header${mobileOpen ? ' header--open' : ''}${active ? ' header--mega-open' : ''}${shouldHide ? ' header--hidden' : ''}`} onMouseLeave={() => setActive(null)}>
    <a className="logo" href="/" aria-label="Endometriose Stichting"><img src="/images/logo.svg" alt="Endometriose Stichting" /></a>
    <nav className="desktop-nav" aria-label="Hoofdnavigatie">
      {nav.map(item => <div className="nav-item" key={item.label} onMouseEnter={() => setActive(item.label)}>
        {item.href ? <a className={`nav-trigger${active === item.label ? ' nav-trigger--active' : ''}`} href={item.href} aria-haspopup="true" aria-expanded={active === item.label}>{item.label}<img src={active === item.label ? '/images/chevron-magenta.svg' : '/images/chevron.svg'} alt="" /></a>
          : <button className={`nav-trigger${active === item.label ? ' nav-trigger--active' : ''}`} aria-expanded={active === item.label} onClick={() => setActive(item.label)}>{item.label}<img src={active === item.label ? '/images/chevron-magenta.svg' : '/images/chevron.svg'} alt="" /></button>}
      </div>)}
    </nav>
    <div className="header-actions"><Button variant="orange" href="/doneren"><img src="/images/donate.svg" alt="" />Doneer</Button><Button href="/endometriosetest">Doe de test</Button></div>
    <button className="menu-button" aria-label="Menu openen" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><img src={mobileOpen ? '/images/close.svg' : '/images/menu.svg'} alt="" /></button>
    {active && <div className="desktop-mega">{nav.map(item => <div className={`desktop-mega-panel${item.label === active ? ' desktop-mega-panel--visible' : ''}`} key={item.label} aria-hidden={item.label !== active}>{item.groups.map((group, index) => <div className="mega-column" key={group.heading ?? index}>{group.heading && <strong>{group.heading}</strong>}<div className="mega-links">{group.links.map(link => <a href={link.href} key={link.label} tabIndex={item.label === active ? undefined : -1}>{link.label}</a>)}</div></div>)}</div>)}</div>}
    {mobileOpen && <nav className="mobile-nav">{nav.map(item => <div className="mobile-menu-group" key={item.label}><button className={mobileSection === item.label ? 'active' : ''} aria-expanded={mobileSection === item.label} onClick={() => setMobileSection(mobileSection === item.label ? null : item.label)}>{item.label}<img src={mobileSection === item.label ? '/images/chevron-magenta.svg' : '/images/chevron.svg'} alt="" /></button>{mobileSection === item.label && <div className="mobile-submenu">{item.groups.map((group, index) => <div key={group.heading ?? index}>{group.heading && <strong>{group.heading}</strong>}{group.links.map(link => <a href={link.href} key={link.label}>{link.label}</a>)}</div>)}</div>}</div>)}<div className="mobile-nav-actions"><Button variant="orange" full href="/doneren"><img src="/images/donate.svg" alt="" />Doneer</Button><Button full href="/endometriosetest">Doe de endometriosetest</Button></div></nav>}
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
  return <section className={`section agenda${openEvent !== null ? ' agenda--expanded' : ''}`}><SectionHeading title="Ontmoet, leer en deel." copy="Online en door het hele land organiseert de stichting bijeenkomsten voor iedereen die met endometriose te maken heeft." action={<Button variant="outline">Bekijk de volledige agenda</Button>} /><div className="event-list">{events.map((event,index) => { const isOpen = openEvent === index; return <article className={`event${isOpen ? ' event--open' : ''}`} key={event.title}><div className="event-main"><div className="event-summary"><h3>{event.title}</h3><p>{event.date}</p><button className="event-more" aria-expanded={isOpen} onClick={() => setOpenEvent(isOpen ? null : index)}>{isOpen ? 'Lees minder' : 'Lees meer'} <img src="/images/arrow-right.svg" alt="" /></button></div><Button variant="magenta-outline">Schrijf je in!</Button></div>{isOpen && <div className="event-details"><p>{event.description}</p><ul>{event.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>}</article>; })}</div><div className="mobile-section-action"><Button variant="outline" full>Bekijk de volledige agenda</Button></div></section>;
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

function Footer() { return <footer><div className="footer-main"><div className="footer-brand"><div className="footer-brand-copy"><img src="/images/footer-logo.svg" alt="Endometriose Stichting" /><p>Voor erkenning, betrouwbare kennis en betere endometriosezorg.</p></div><Button variant="white" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><img src="/images/top-arrow.svg" alt="" />Naar boven</Button></div><div className="footer-columns">{nav.map(item => <div key={item.label}><h3>{item.label}</h3>{item.groups.flatMap(group => group.links).map(link => <a href={link.href} key={link.label}>{link.label}</a>)}</div>)}</div></div><div className="footer-bottom"><strong>© Endometriose Stichting</strong><div><a href="#">Privacy</a><a href="#">Cookies</a><a href="#">Disclaimer</a><a href="#">Toegangkelijkheid</a></div><span>ANBI/RSIN nummer: 8156.17.987</span></div></footer>; }

type RelatedArticle = { title: string; copy: string; image: string; href: string; cta?: string };

function ArticleHero({ title, copy, current, image, imageRotated = false, label, primary, secondary, breadcrumbs = ['Endometriose', 'Begrijpen'] }: { title: string; copy: React.ReactNode; current: string; image: string; imageRotated?: boolean; label?: string; primary: React.ReactNode; secondary: React.ReactNode; breadcrumbs?: string[] }) {
  return <section className="article-hero">
    <div className="article-hero-photo" style={{ backgroundImage: `url('${image}')`, transform: imageRotated ? 'rotate(180deg)' : undefined }} />
    <div className="article-hero-overlay" />
    <div className="article-hero-inner">
      <div className="article-breadcrumbs" aria-label="Broodkruimelpad">
        <a href="/" aria-label="Home"><img src="/images/breadcrumb-home.svg" alt="" /></a>
        {[...breadcrumbs, current].map(item => <span key={item}><img src="/images/breadcrumb-chevron.svg" alt="" />{item}</span>)}
      </div>
      <div className="article-hero-copy">{label && <p className="article-hero-label">{label}</p>}<h1>{title}</h1><div className="article-hero-description">{typeof copy === 'string' ? <p>{copy}</p> : copy}</div></div>
      <div className="article-actions">{primary}{secondary}</div>
    </div>
  </section>;
}

function ArticleSummary({ items }: { items: string[] }) {
  return <section className="article-section article-summary"><div className="article-summary-inner"><img src="/images/article-summary.svg" alt="" /><div><h2>In het kort</h2><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></div></div></section>;
}

function ArticleCallout({ children }: { children: React.ReactNode }) {
  return <div className="article-callout"><span aria-hidden="true" /><div>{children}</div></div>;
}

type TocSectionDef = { id: string; navLabel: string };

const TocContext = createContext<{ openIds: Set<string>; toggle: (id: string) => void } | null>(null);

function ArticleTocNav({ sections, activeId, ghost = false }: { sections: TocSectionDef[]; activeId: string; ghost?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    if (ghost) return;
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const activeLink = container.querySelector<HTMLElement>(`[data-id="${activeId}"]`);
      if (activeLink) setIndicator({ top: activeLink.offsetTop, height: activeLink.offsetHeight });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, ghost, sections.length]);

  return <div className={`article-toc-nav${ghost ? ' article-toc-nav--ghost' : ''}`} aria-hidden={ghost || undefined} ref={containerRef}>
    {!ghost && indicator && <span className="article-toc-indicator" style={{ transform: `translateY(${indicator.top}px)`, height: indicator.height }} />}
    {sections.map(section => <a
      key={section.id}
      data-id={section.id}
      href={`#${section.id}`}
      tabIndex={ghost ? -1 : undefined}
      className={`article-toc-navlink${!ghost && section.id === activeId ? ' article-toc-navlink--active' : ''}`}
      onClick={ghost ? undefined : (event) => {
        event.preventDefault();
        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', `#${section.id}`);
      }}
    >{section.navLabel}</a>)}
  </div>;
}

function ArticleTocLayout({ sections, children }: { sections: TocSectionDef[]; children: React.ReactNode }) {
  const ids = sections.map(section => section.id);
  const idsKey = ids.join('|');
  const [activeId, setActiveId] = useState(ids[0] ?? '');
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const hash = window.location.hash.slice(1);
    return new Set(hash && ids.includes(hash) ? [hash] : []);
  });

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash || !ids.includes(hash)) return;
      setOpenIds(previous => previous.has(hash) ? previous : new Set(previous).add(hash));
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }));
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  useEffect(() => {
    const targets = ids.map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (!visible.length) return;
      const top = visible.reduce((a, b) => a.boundingClientRect.top < b.boundingClientRect.top ? a : b);
      setActiveId(top.target.id);
    }, { rootMargin: '-140px 0px -65% 0px', threshold: 0 });
    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  const toggle = (id: string) => setOpenIds(previous => {
    const next = new Set(previous);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return <TocContext.Provider value={{ openIds, toggle }}>
    <div className="article-toc-row">
      <ArticleTocNav sections={sections} activeId={activeId} />
      <div className="article-toc-content">{children}</div>
      <ArticleTocNav sections={sections} activeId={activeId} ghost />
    </div>
  </TocContext.Provider>;
}

function ArticleTocSection({ id, heading, icon, children }: { id: string; heading: string; icon?: React.ReactNode; children: React.ReactNode }) {
  const ctx = useContext(TocContext)!;
  const open = ctx.openIds.has(id);
  return <div className={`article-toc-section${open ? ' article-toc-section--open' : ''}`} id={id}>
    <button type="button" className="article-toc-toggle" aria-expanded={open} onClick={() => ctx.toggle(id)}>
      <span className="article-toc-toggle-heading">{icon && <span className="article-toc-icon">{icon}</span>}<h2>{heading}</h2></span>
      <img className="article-toc-chevron" src="/images/chevron.svg" alt="" />
    </button>
    <div className="article-toc-body">{children}</div>
  </div>;
}

function TocSummaryCard({ id, items }: { id: string; items: string[] }) {
  return <div className="article-toc-summary" id={id}>
    <img src="/images/article-summary.svg" alt="" />
    <div><h2>In het kort</h2><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></div>
  </div>;
}

function CompareTable({ rows }: { rows: [string, string][] }) {
  return <div className="compare-table">
    <div className="compare-row compare-row--head"><span>Adenomyose</span><span className="compare-divider" /><span>Endometriose</span></div>
    {rows.map(([left, right], index) => <div className={`compare-row${index % 2 === 0 ? ' compare-row--pale' : ''}`} key={left}><span>{left}</span><span className="compare-divider" /><span>{right}</span></div>)}
  </div>;
}

function ZoomableImage({ src, alt = '' }: { src: string; alt?: string }) {
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setZoom(0); };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = previousOverflow; };
  }, [zoom]);

  return <>
    <img className="article-toc-image" src={src} alt={alt} role="button" tabIndex={0} onClick={() => setZoom(1)} onKeyDown={(event) => { if (event.key === 'Enter') setZoom(1); }} />
    {zoom > 0 && <div className="image-lightbox" onClick={() => setZoom(0)}>
      <button type="button" className="image-lightbox-close" aria-label="Sluiten" onClick={(event) => { event.stopPropagation(); setZoom(0); }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
      </button>
      <img
        className={`image-lightbox-img${zoom === 2 ? ' image-lightbox-img--zoomed' : ''}`}
        src={src}
        alt={alt}
        onClick={(event) => { event.stopPropagation(); setZoom(previous => previous === 1 ? 2 : 1); }}
      />
    </div>}
  </>;
}

function MailIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>;
}

function ShareIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v13" /><path d="m16 6-4-4-4 4" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /></svg>;
}

function DropletIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.5-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /></svg>;
}

function PersonStandingIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="1" /><path d="m9 20 3-6 3 6" /><path d="m6 8 6 2 6-2" /><path d="M12 10v4" /></svg>;
}

function ToiletIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.6a.5.5 0 0 0-.4.8l1.5 2.4a.5.5 0 0 1-.4.8H5.4a.5.5 0 0 1-.4-.8L7 18" /><path d="M7 12a5 5 0 0 1-5-5V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v3a5 5 0 0 1-5 5H7Z" /></svg>;
}

function HeartIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>;
}

function BedDoubleIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M12 4v6" /><path d="M2 18h20" /></svg>;
}

function SproutIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10" /><path d="M10 20c0-4.4-1.5-7-4-8.5C3.5 10 2 8 2 6a4 4 0 0 1 4-4c2 0 3 1 4 2 1-1 2-2 4-2a4 4 0 0 1 4 4c0 2-1.5 4-4 5.5-2.5 1.5-4 4.1-4 8.5" /><path d="M10 20a4 4 0 1 0-8 0" /></svg>;
}

function ArticleShare() {
  return <div className="article-toc-share">
    <span aria-hidden="true" />
    <strong>Pagina delen</strong>
    <div className="article-actions">
      <a className="button button--magenta-outline" href={`mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(window.location.href)}`}><MailIcon />Email</a>
      <button type="button" className="button button--magenta-outline" onClick={() => { if (navigator.share) navigator.share({ url: window.location.href, title: document.title }); else navigator.clipboard?.writeText(window.location.href); }}><ShareIcon />Delen</button>
    </div>
  </div>;
}

function MedicalReview({ inverse = false, date = '13-09-2026', reviewer = 'Lennie van Hanegem', note = 'Deze informatie is algemeen en vervangt geen persoonlijk medisch advies. Bespreek vragen of zorgen over je gezondheid met je huisarts of behandelend arts.' }: { inverse?: boolean; date?: string; reviewer?: string; note?: string }) {
  return <div className={'medical-review' + (inverse ? ' medical-review--inverse' : '')}>
    <p><strong>Laatste inhoudelijke controle:</strong> {date}<br /><strong>Medisch gecontroleerd door:</strong> {reviewer}</p>
    <p>{note}</p>
  </div>;
}

function RelatedArticles({ cards }: { cards: RelatedArticle[] }) {
  return <section className="article-section article-related"><div className="article-wide"><h2>Lees ook</h2><div className="article-related-grid">{cards.map(card => <a className="article-related-card" href={card.href} key={card.title}><img src={card.image} alt="" /><div><div><h3>{card.title}</h3><p>{card.copy}</p></div><span className="button button--magenta-outline">{card.cta ?? 'Meer info'}</span></div></a>)}</div></div></section>;
}

const whatRelated: RelatedArticle[] = [
  { title: 'Klachten', copy: 'Lees welke klachten bij endometriose kunnen voorkomen.', image: '/images/related-complaints.png', href: '/klachten' },
  { title: 'Diagnose', copy: 'Lees hoe onderzoek en diagnose verlopen en wat je kunt verwachten.', image: '/images/related-diagnosis.png', href: '#' },
  { title: 'Adenomyose', copy: 'Lees wat adenomyose is en hoe het verschilt van endometriose.', image: '/images/related-adenomyosis.png', href: '/wat-is-adenomyose' },
];

const complaintsRelated: RelatedArticle[] = [
  { title: 'Wat is endometriose?', copy: 'Lees wat er bij endometriose in het lichaam gebeurt en waar de aandoening kan voorkomen.', image: '/images/article-endometriosis-hero.jpg', href: '/wat-is-endometriose' },
  { title: 'Bereid je huisartsbezoek voor', copy: 'Lees hoe je klachten en vragen kunt voorbereiden en hoe je samen een concrete vervolgstap afspreekt.', image: '/images/doctor-visit-hero.png', href: '/bereid-je-huisartsbezoek-voor' },
  { title: 'Onderzoek en diagnose', copy: 'Lees wat je kunt verwachten van gesprekken, onderzoeken en een mogelijke verwijzing.', image: '/images/related-diagnosis.png', href: '#' },
];

const adenomyosisRelated: RelatedArticle[] = [
  { title: 'Wat is endometriose?', copy: 'Lees wat endometriose is en welke invloed de aandoening kan hebben.', image: '/images/article-endometriosis-hero.jpg', href: '/wat-is-endometriose' },
  { title: 'Klachten', copy: 'Lees welke klachten bij endometriose kunnen voorkomen.', image: '/images/related-complaints.png', href: '/klachten' },
  { title: 'Bereid je huisartsbezoek voor', copy: 'Lees hoe je je afspraak met de huisarts goed voorbereidt.', image: '/images/doctor-visit-hero.png', href: '/bereid-je-huisartsbezoek-voor' },
];

const whatIsEndometriosisSections: TocSectionDef[] = [
  { id: 'in-het-kort', navLabel: 'In het kort' },
  { id: 'in-het-lichaam', navLabel: 'In het lichaam' },
  { id: 'waar-zit-het', navLabel: 'Waar zit het?' },
  { id: 'gevolgen', navLabel: 'Gevolgen' },
  { id: 'mogelijke-oorzaken', navLabel: 'Mogelijke oorzaken' },
  { id: 'hoe-vaak-komt-het-voor', navLabel: 'Hoe vaak komt het voor?' },
  { id: 'dagelijks-leven', navLabel: 'Dagelijks leven' },
  { id: 'behandeling', navLabel: 'Behandeling' },
  { id: 'hulp-zoeken', navLabel: 'Hulp zoeken' },
];

function WhatIsEndometriosisPage() {
  return <><Header /><main className="article-page" id="top">
    <ArticleHero
      current="Wat is endometriose?"
      breadcrumbs={['Endometriose']}
      title="Wat is endometriose?"
      copy="Endometriose is een chronische aandoening waarbij weefsel dat lijkt op baarmoederslijmvlies buiten de baarmoeder aanwezig is. Dit weefsel kan ontstekingen, littekenweefsel en verklevingen veroorzaken. Waar de endometriose zit en hoeveel klachten iemand heeft, verschilt sterk per persoon."
      image="/images/article-endometriosis-hero.jpg"
      primary={<Button href="/klachten">Bekijk de klachten</Button>}
      secondary={<Button variant="white" href="/endometriosetest">Doe de Endometriosetest</Button>}
    />
    <section className="article-section">
      <ArticleTocLayout sections={whatIsEndometriosisSections}>
        <TocSummaryCard id="in-het-kort" items={[
          'Endometriose is weefsel dat lijkt op baarmoederslijmvlies en zich buiten de baarmoeder bevindt.',
          'Het komt meestal voor in de buik en het bekken.',
          'Het kan een ontstekingsreactie, littekenweefsel, cysten en verklevingen veroorzaken.',
          'De plaats en hoeveelheid endometriose zeggen niet altijd hoeveel klachten iemand heeft.',
          'De precieze oorzaak van endometriose is nog niet bekend.',
          'Endometriose is chronisch, maar er zijn verschillende manieren om klachten te behandelen.',
        ]} />

        <ArticleTocSection id="in-het-lichaam" heading="Wat gebeurt er in het lichaam?">
          <p>Aan de binnenkant van de baarmoeder zit het baarmoederslijmvlies. Dit heet het endometrium. Tijdens de menstruatiecyclus wordt dit slijmvlies dikker. Als er geen zwangerschap ontstaat, wordt een deel ervan tijdens de menstruatie afgestoten.</p>
          <p>Bij endometriose bevindt zich buiten de baarmoeder weefsel dat op dit baarmoederslijmvlies lijkt. Het is dus niet precies hetzelfde weefsel, maar het heeft wel vergelijkbare eigenschappen.</p>
          <p>Het endometrioseweefsel kan reageren op hormonen en een ontstekingsreactie in het lichaam veroorzaken. Na verloop van tijd kunnen hierdoor littekenweefsel en verklevingen ontstaan. Verklevingen zijn strengen littekenweefsel waardoor organen of andere weefsels aan elkaar kunnen vastzitten.</p>
          <p>Op de eierstokken kunnen ook cysten ontstaan die met oud bloed zijn gevuld. Deze cysten worden endometriomen genoemd.</p>
          <p><strong>Belangrijk om te weten:</strong> De hoeveelheid endometriose zegt niet automatisch iets over de ernst van de klachten. Iemand met weinig zichtbare endometriose kan veel pijn hebben. Iemand met uitgebreide endometriose kan juist weinig klachten ervaren.</p>
          <ZoomableImage src="/images/endometriosis-body-1.png" />
        </ArticleTocSection>

        <ArticleTocSection id="waar-zit-het" heading="Waar kan endometriose voorkomen?">
          <p>Endometriose komt meestal voor in het bekken. Veelvoorkomende plaatsen zijn:</p>
          <ul><li>op het buikvlies;</li><li>op of rond de eierstokken;</li><li>rond de baarmoeder en eileiders;</li><li>in de ruimte achter de baarmoeder;</li><li>op of in de darm;</li><li>op of in de blaas;</li><li>rond de urineleiders.</li></ul>
          <p>Endometriose kan oppervlakkig aanwezig zijn, maar ook dieper in omliggend weefsel of een orgaan groeien. In zeldzame gevallen komt endometriose buiten de buik of het bekken voor, bijvoorbeeld rond het middenrif of in de borstkas.</p>
          <p>De plaats van de endometriose kan invloed hebben op de soort klachten. Endometriose bij de darm kan bijvoorbeeld samengaan met pijn bij de ontlasting. Endometriose bij de blaas kan klachten bij het plassen geven. Toch kun je op basis van klachten alleen niet vaststellen waar endometriose aanwezig is.</p>
          <ZoomableImage src="/images/endometriosis-body-2.png" />
        </ArticleTocSection>

        <ArticleTocSection id="gevolgen" heading="Wat kan endometriose veroorzaken?">
          <p>De ontstekingsreactie rond endometrioseweefsel kan verschillende veranderingen in het lichaam veroorzaken.</p>
          <p><strong>Ontstekingen</strong></p>
          <p>Endometriose kan een langdurige ontstekingsreactie veroorzaken. Dit kan bijdragen aan pijn en irritatie van omliggend weefsel.</p>
          <p><strong>Littekenweefsel en verklevingen</strong></p>
          <p>Door ontstekingen en herstelreacties kan littekenweefsel ontstaan. Hierdoor kunnen organen of weefsels minder vrij langs elkaar bewegen.</p>
          <p><strong>Cysten op de eierstokken</strong></p>
          <p>Op een eierstok kan een endometriosecyste ontstaan. Zo'n cyste wordt ook een endometrioom genoemd.</p>
          <p><strong>Pijn en overgevoeligheid</strong></p>
          <p>Wanneer pijn lang aanwezig is, kunnen zenuwen en spieren in en rond het bekken gevoeliger worden. Daardoor kan pijn soms blijven bestaan of sterker worden, ook wanneer er weinig endometriose zichtbaar is.</p>
          <p>Niet iedereen met endometriose ervaart dezelfde gevolgen. Sommige mensen hebben dagelijks klachten, anderen alleen rond bepaalde momenten in de menstruatiecyclus en weer anderen hebben nauwelijks klachten.</p>
        </ArticleTocSection>

        <ArticleTocSection id="mogelijke-oorzaken" heading="Hoe ontstaat endometriose?">
          <p>De precieze oorzaak van endometriose is nog niet bekend. Waarschijnlijk ontstaat de aandoening door een combinatie van verschillende factoren.</p>
          <p>Onderzoekers kijken onder andere naar:</p>
          <ul><li>erfelijke aanleg;</li><li>hormonen;</li><li>de werking van het afweersysteem;</li><li>de manier waarop bepaalde cellen zich ontwikkelen en verplaatsen;</li><li>processen die tijdens de ontwikkeling van het lichaam ontstaan.</li></ul>
          <p>Endometriose komt vaker voor binnen sommige families. Dat betekent dat erfelijke aanleg waarschijnlijk een rol speelt. Het betekent niet dat iedereen met endometriose de aandoening doorgeeft of dat iemand de aandoening zeker krijgt wanneer een familielid deze heeft.</p>
          <p>Er bestaan verschillende theorieën over het ontstaan van endometriose, maar geen enkele theorie verklaart alle vormen van de aandoening.</p>
          <ArticleCallout><p className="callout-label">Endometriose is niet jouw schuld.</p><p>De aandoening ontstaat niet doordat je iets verkeerd hebt gedaan. Op dit moment is er ook geen bekende manier om endometriose volledig te voorkomen.</p></ArticleCallout>
        </ArticleTocSection>

        <ArticleTocSection id="hoe-vaak-komt-het-voor" heading="Hoe vaak komt endometriose voor?">
          <p>Naar schatting heeft ongeveer 1 op de 10 vrouwen in de vruchtbare levensfase endometriose. Wereldwijd gaat het volgens de Wereldgezondheidsorganisatie om ongeveer 190 miljoen vrouwen.</p>
          <p>Het werkelijke aantal kan hoger zijn. Niet iedereen heeft herkenbare klachten en het kan lang duren voordat endometriose wordt ontdekt.</p>
          <p>Klachten kunnen al vanaf de eerste menstruaties ontstaan. Endometriose wordt vaak besproken als een aandoening bij vrouwen, maar kan ook voorkomen bij trans mannen en non-binaire mensen.</p>
          <ZoomableImage src="/images/endometriosis-body-3.png" />
        </ArticleTocSection>

        <ArticleTocSection id="dagelijks-leven" heading="Wat kan endometriose voor je leven betekenen?">
          <p>Endometriose kan veel meer <span className="accent">invloed</span> hebben dan alleen pijn tijdens de menstruatie. De aandoening kan bijvoorbeeld gevolgen hebben voor:</p>
          <ul><li>energie en slaap;</li><li>werk, school of studie;</li><li>bewegen en dagelijkse activiteiten;</li><li>relaties en intimiteit;</li><li>stemming en mentale gezondheid;</li><li>sociale activiteiten;</li><li>vruchtbaarheid en een eventuele kinderwens.</li></ul>
          <p>De invloed verschilt sterk per persoon. Sommige mensen kunnen hun dagelijks leven grotendeels voortzetten. Anderen moeten regelmatig afspraken afzeggen, zich ziek melden of activiteiten aanpassen.</p>
          <p>Ook de klachten kunnen in de loop van de tijd veranderen. Je kunt goede en slechte periodes hebben. Dat maakt endometriose soms moeilijk uit te leggen aan anderen.</p>
          <p>Endometriose betekent niet automatisch dat iemand minder vruchtbaar is. Veel mensen met endometriose worden zonder medische hulp zwanger. Bij anderen duurt dit langer of kan extra begeleiding nodig zijn.</p>
          <ArticleCallout><p className="callout-label">Wat je ervaart is echt</p><p>Klachten die niet altijd zichtbaar zijn, kunnen toch veel invloed hebben. Je hoeft je pijn, vermoeidheid of beperkingen niet eerst tegenover anderen te bewijzen om hulp te mogen vragen.</p></ArticleCallout>
        </ArticleTocSection>

        <ArticleTocSection id="behandeling" heading="Kan endometriose worden behandeld?">
          <p>Er is op dit moment geen behandeling die endometriose bij iedereen definitief geneest. Er zijn wel verschillende manieren om klachten te verminderen en de invloed op het dagelijks leven te beperken.</p>
          <p>Mogelijke <span className="accent">behandelingen</span> zijn onder andere:</p>
          <ul><li>pijnmedicatie;</li><li>hormonale behandeling;</li><li>een operatie;</li><li>bekkenfysiotherapie of andere aanvullende begeleiding;</li><li>ondersteuning bij het omgaan met langdurige pijn en vermoeidheid.</li></ul>
          <p>Welke behandeling passend is, hangt af van je klachten, persoonlijke situatie, eerdere behandelingen en eventuele kinderwens. Wat voor de één goed werkt, hoeft voor een ander niet de beste keuze te zijn.</p>
          <p>Samen met een arts bespreek je wat je met een behandeling wilt bereiken en welke voordelen, nadelen en mogelijke bijwerkingen daarbij horen.</p>
        </ArticleTocSection>

        <ArticleTocSection id="hulp-zoeken" heading="Wanneer is het verstandig om hulp te zoeken?">
          <p>Menstruatieklachten horen je dagelijks leven niet te beheersen. Maak een afspraak met je huisarts wanneer je bijvoorbeeld:</p>
          <ul><li>regelmatig zoveel pijn hebt dat je niet kunt werken, studeren, sporten of slapen;</li><li>vaak thuisblijft door menstruatie- of buikklachten;</li><li>langdurige of terugkerende buik- of bekkenpijn hebt;</li><li>pijn hebt tijdens of na seks;</li><li>terugkerende darm- of blaasklachten hebt;</li><li>veel vermoeidheid ervaart zonder duidelijke verklaring;</li><li>vragen of zorgen hebt over vruchtbaarheid;</li><li>jezelf herkent in meerdere klachten van endometriose.</li></ul>
          <p>Deze klachten kunnen ook een andere oorzaak hebben. Daarom is het belangrijk om ze met een arts te bespreken. Alleen een zorgprofessional kan samen met jou onderzoeken wat er aan de hand is.</p>
          <p>Je kunt je afspraak voorbereiden door bij te houden wanneer de klachten ontstaan, hoe ernstig ze zijn en wat ze met je dagelijks leven doen.</p>
          <div className="article-actions"><Button variant="magenta-outline" href="/klachten">Bekijk de klachten</Button><Button variant="magenta-outline" href="/bereid-je-huisartsbezoek-voor">Bereid je huisartsbezoek voor</Button></div>
        </ArticleTocSection>

        <MedicalReview />
        <ArticleShare />
      </ArticleTocLayout>
    </section>
    <RelatedArticles cards={whatRelated} />
  </main><Footer /></>;
}

const whatIsAdenomyosisSections: TocSectionDef[] = [
  { id: 'in-het-kort-adeno', navLabel: 'In het kort' },
  { id: 'in-de-baarmoeder', navLabel: 'In de baarmoeder' },
  { id: 'klachten-adeno', navLabel: 'Klachten' },
  { id: 'verschil-met-endometriose', navLabel: 'Verschil met endometriose' },
  { id: 'mogelijke-oorzaken-adeno', navLabel: 'Mogelijke oorzaken' },
  { id: 'hoe-vaak-komt-het-voor-adeno', navLabel: 'Hoe vaak komt het voor?' },
  { id: 'onderzoek', navLabel: 'Onderzoek' },
  { id: 'behandeling-adeno', navLabel: 'Behandeling' },
  { id: 'dagelijks-leven-adeno', navLabel: 'Dagelijks leven' },
  { id: 'hulp-zoeken-adeno', navLabel: 'Hulp zoeken' },
];

function WhatIsAdenomyosisPage() {
  return <><Header /><main className="article-page" id="top">
    <ArticleHero
      current="Wat is adenomyose?"
      breadcrumbs={['Endometriose']}
      title="Wat is adenomyose?"
      copy="Adenomyose is een aandoening waarbij weefsel dat lijkt op baarmoederslijmvlies aanwezig is in de spierwand van de baarmoeder. Dit kan onder andere hevige menstruaties, menstruatiepijn en pijn in het bekken veroorzaken. Adenomyose en endometriose zijn verschillende aandoeningen, maar ze kunnen wel tegelijkertijd voorkomen."
      image="/images/article-adenomyosis-hero.png"
      imageRotated
      primary={<Button href="/klachten">Bekijk de klachten</Button>}
      secondary={<Button variant="white" href="/bereid-je-huisartsbezoek-voor">Bereid je huisartsbezoek voor</Button>}
    />
    <section className="article-section">
      <ArticleTocLayout sections={whatIsAdenomyosisSections}>
        <TocSummaryCard id="in-het-kort-adeno" items={[
          'Bij adenomyose bevindt weefsel dat lijkt op baarmoederslijmvlies zich in de spierwand van de baarmoeder.',
          'Adenomyose kan hevige en pijnlijke menstruaties veroorzaken.',
          'Sommige mensen hebben ook buiten de menstruatie pijn of een zwaar gevoel in de onderbuik.',
          'Adenomyose en endometriose zijn niet hetzelfde, maar kunnen wel samen voorkomen.',
          'Adenomyose kan meestal met een vaginale echo worden herkend. Soms is aanvullend een MRI nodig.',
          'Niet iedereen met adenomyose heeft klachten of heeft een behandeling nodig.',
        ]} />

        <ArticleTocSection id="in-de-baarmoeder" heading="Wat gebeurt er in de baarmoeder?">
          <p>De wand van de baarmoeder bestaat uit verschillende lagen. Aan de binnenkant zit het baarmoederslijmvlies. Dit heet het endometrium. Daaromheen ligt een dikke spierlaag: het myometrium.</p>
          <p>Bij adenomyose is in deze spierlaag weefsel aanwezig dat lijkt op baarmoederslijmvlies. Dit weefsel kan reageren op hormonale veranderingen tijdens de menstruatiecyclus. Hierdoor kunnen in de spierwand ontsteking, zwelling en pijn ontstaan.</p>
          <p>De spierwand kan op sommige plaatsen of in een groter deel van de baarmoeder veranderen. Daardoor kan de baarmoeder soms dikker of groter worden. Niet iedereen merkt daar iets van.</p>
          <p>Adenomyose kan op twee manieren voorkomen:</p>
          <ul><li><strong>diffuus:</strong> verspreid over een groter deel van de spierwand;</li><li><strong>focaal:</strong> geconcentreerd op één of enkele plaatsen.</li></ul>
          <p>Een plaatselijke verdikking door adenomyose wordt ook wel een adenomyoom genoemd.</p>
          <p><strong>Belangrijk om te weten:</strong> Hoe uitgebreid adenomyose op een echo zichtbaar is, zegt niet altijd hoeveel klachten iemand ervaart. De klachten en invloed op het dagelijks leven verschillen per persoon.</p>
          <ZoomableImage src="/images/endometriosis-body-1.png" />
        </ArticleTocSection>

        <ArticleTocSection id="klachten-adeno" heading="Welke klachten kunnen bij adenomyose voorkomen?">
          <p>De klachten verschillen per persoon. Sommige mensen hebben veel klachten, terwijl anderen nauwelijks iets merken. Adenomyose wordt soms bij toeval op een echo ontdekt.</p>
          <p>Mogelijke klachten zijn:</p>
          <ul><li>hevige menstruaties;</li><li>menstruaties die langer duren dan normaal;</li><li>ernstige krampen of pijn tijdens de menstruatie;</li><li>pijn in de onderbuik of het bekken;</li><li>een zwaar, vol of drukkend gevoel in de onderbuik;</li><li>een opgeblazen gevoel;</li><li>pijn tijdens of na seks;</li><li>vermoeidheid.</li></ul>
          <p>Hevig bloedverlies kan soms leiden tot ijzertekort of bloedarmoede. Dit kan klachten geven zoals vermoeidheid, duizeligheid, hoofdpijn, hartkloppingen of kortademigheid bij inspanning.</p>
          <p>De klachten kunnen tijdens de menstruatie het sterkst zijn, maar pijn of een zwaar gevoel kan ook op andere momenten voorkomen.</p>
          <ArticleCallout><p>Menstruatiepijn of bloedverlies dat je belemmert in je dagelijkse activiteiten verdient aandacht. Je hoeft niet te wachten totdat je klachten ondraaglijk worden voordat je hulp vraagt.</p></ArticleCallout>
        </ArticleTocSection>

        <ArticleTocSection id="verschil-met-endometriose" heading="Wat is het verschil tussen adenomyose en endometriose?">
          <p>Adenomyose en <span className="accent">endometriose</span> zijn aan elkaar verwante, maar verschillende aandoeningen. Het belangrijkste verschil is de plaats waar het afwijkende weefsel zich bevindt.</p>
          <p><strong>Adenomyose</strong></p>
          <p>Bij adenomyose bevindt weefsel dat lijkt op baarmoederslijmvlies zich in de spierwand van de baarmoeder.</p>
          <p><strong>Endometriose</strong></p>
          <p>Bij endometriose bevindt vergelijkbaar weefsel zich buiten de baarmoeder, bijvoorbeeld op het buikvlies, de eierstokken, de darm of de blaas.</p>
          <p>Beide aandoeningen kunnen onder andere menstruatiepijn, buik- of bekkenpijn en pijn tijdens seks veroorzaken. Bij adenomyose staan hevig bloedverlies en een pijnlijke of vergrote baarmoeder vaker op de voorgrond. Bij endometriose kunnen de klachten mede afhangen van de plaatsen waar de endometriose zich bevindt.</p>
          <p>Je kunt adenomyose en endometriose tegelijkertijd hebben. Op basis van de klachten alleen is daarom niet altijd vast te stellen welke aandoening iemand heeft.</p>
          <CompareTable rows={[
            ['In de spierwand van de baarmoeder', 'Buiten de baarmoeder'],
            ['Vaak hevige en pijnlijke menstruaties', 'Verschillende klachten afhankelijk van de plaats'],
            ['Kan de baarmoeder dikker of groter maken', 'Kan ontstekingen, cysten en verklevingen veroorzaken'],
            ['Wordt vaak onderzocht met een vaginale echo', 'Onderzoek kan bestaan uit een gesprek, echo en soms MRI of operatie'],
          ]} />
        </ArticleTocSection>

        <ArticleTocSection id="mogelijke-oorzaken-adeno" heading="Hoe ontstaat adenomyose?">
          <p>De precieze oorzaak van adenomyose is niet bekend. Onderzoekers denken dat verschillende factoren een rol kunnen spelen, waaronder:</p>
          <ul><li>hormonen;</li><li>erfelijke aanleg;</li><li>ontstekingsprocessen;</li><li>de ontwikkeling en groei van de baarmoeder;</li><li>veranderingen in de grens tussen het baarmoederslijmvlies en de spierwand.</li></ul>
          <p>Er bestaan verschillende theorieën, maar nog geen daarvan verklaart precies waarom de ene persoon adenomyose krijgt en de andere niet.</p>
          <p>Adenomyose ontstaat niet doordat je iets verkeerd hebt gedaan. Het wordt ook niet veroorzaakt door een anticonceptiepil of hormoonspiraal. Hormonale anticonceptie kan juist onderdeel zijn van een behandeling om klachten te verminderen.</p>
          <p>Op dit moment is er geen bekende manier om adenomyose volledig te voorkomen.</p>
        </ArticleTocSection>

        <ArticleTocSection id="hoe-vaak-komt-het-voor-adeno" heading="Hoe vaak komt adenomyose voor?">
          <p>Het is niet precies bekend hoeveel mensen adenomyose hebben. Dat komt onder andere doordat:</p>
          <ul><li>niet iedereen klachten heeft;</li><li>de klachten ook bij andere aandoeningen kunnen voorkomen;</li><li>adenomyose vroeger vaak pas na het verwijderen van de baarmoeder werd vastgesteld;</li><li>verschillende onderzoeken niet altijd dezelfde criteria gebruiken.</li></ul>
          <p>Adenomyose werd lange tijd vooral herkend bij mensen boven de veertig die eerder zwanger waren geweest. Door betere echoapparatuur en meer kennis weten we inmiddels dat adenomyose ook op jongere leeftijd kan voorkomen.</p>
          <p>Adenomyose kan voorkomen bij iedereen met een baarmoeder. De aandoening wordt ook regelmatig gezien bij mensen die daarnaast endometriose hebben.</p>
          <ArticleCallout><p className="callout-label">Niet alleen na je veertigste</p><p>Ook jongere mensen kunnen adenomyose hebben. Leeftijd alleen mag geen reden zijn om aanhoudende klachten niet verder te onderzoeken.</p></ArticleCallout>
        </ArticleTocSection>

        <ArticleTocSection id="onderzoek" heading="Hoe wordt adenomyose onderzocht?">
          <p>Klachten zoals hevig bloedverlies en bekkenpijn kunnen verschillende oorzaken hebben. Daarom begint een arts meestal met een gesprek over je klachten, menstruaties en gezondheid.</p>
          <p>De arts kan bijvoorbeeld vragen:</p>
          <ul><li>hoeveel pijn je hebt;</li><li>wanneer de pijn optreedt;</li><li>hoe lang en hoeveel je bloedt;</li><li>of de klachten je dagelijks leven beïnvloeden;</li><li>welke medicijnen of behandelingen je al hebt geprobeerd;</li><li>of je nu of later zwanger wilt worden.</li></ul>
          <p><strong>Vaginale echo</strong></p>
          <p>Een vaginale echo is meestal het eerste beeldvormende onderzoek bij een vermoeden van adenomyose. Hiermee kan de arts kijken naar de vorm, dikte en structuur van de baarmoederwand.</p>
          <p>Niet iedere verandering is altijd duidelijk zichtbaar. De ervaring van degene die de echo uitvoert kan daarom een rol spelen.</p>
          <p><strong>MRI-scan</strong></p>
          <p>Soms wordt een MRI-scan gemaakt wanneer een echo onvoldoende duidelijkheid geeft of wanneer meer informatie nodig is voor een behandelkeuze.</p>
          <p>Met een echo of MRI kan vaak een sterke verdenking op adenomyose worden vastgesteld. Het is niet altijd mogelijk om met volledige zekerheid te zeggen hoeveel van de klachten door adenomyose wordt veroorzaakt.</p>
          <ZoomableImage src="/images/endometriosis-body-2.png" />
        </ArticleTocSection>

        <ArticleTocSection id="behandeling-adeno" heading="Kan adenomyose worden behandeld?">
          <p>Niet iedereen met adenomyose heeft behandeling nodig. Wanneer adenomyose op een echo wordt gezien maar je geen klachten hebt, kan samen met de arts worden besloten om niets te behandelen.</p>
          <p>Heb je wel klachten, dan wordt de behandeling afgestemd op:</p>
          <ul><li>de soort en ernst van je klachten;</li><li>hoeveel bloed je verliest;</li><li>je leeftijd en gezondheid;</li><li>eerdere behandelingen;</li><li>mogelijke bijwerkingen;</li><li>een huidige of toekomstige kinderwens;</li><li>je eigen voorkeuren.</li></ul>
          <p>Mogelijke behandelingen zijn onder andere:</p>
          <p><strong>Medicijnen tegen pijn</strong></p>
          <p>Pijnstillers of ontstekingsremmende medicijnen kunnen helpen om menstruatiepijn te verminderen. Bespreek met een arts of apotheker welk middel veilig en passend is.</p>
          <p><strong>Medicijnen tegen hevig bloedverlies</strong></p>
          <p>Er bestaan medicijnen die het bloedverlies tijdens de menstruatie kunnen verminderen. Een arts kan beoordelen of deze voor jou geschikt zijn.</p>
          <p><strong>Hormonale behandeling</strong></p>
          <p>Een hormoonspiraal, anticonceptiepil of ander hormonaal middel kan het bloedverlies en de pijn verminderen. Het effect en de mogelijke bijwerkingen verschillen per persoon.</p>
          <p><strong>Operatie</strong></p>
          <p>Wanneer andere behandelingen onvoldoende helpen, kan een operatie worden besproken. Het verwijderen van de baarmoeder behandelt adenomyose definitief, omdat de aandoening zich in de baarmoederwand bevindt.</p>
          <p>Een baarmoederverwijdering is een ingrijpende en onomkeerbare operatie. Daarna kun je niet meer zwanger worden. Deze behandeling wordt daarom alleen na een zorgvuldige afweging besproken en is niet voor iedereen nodig of passend.</p>
          <ArticleCallout><p>Je hoeft een behandelkeuze niet alleen te maken. Vraag naar de verwachte voordelen, mogelijke nadelen, alternatieven en wat de behandeling betekent voor een eventuele kinderwens.</p></ArticleCallout>
        </ArticleTocSection>

        <ArticleTocSection id="dagelijks-leven-adeno" heading="Wat kan adenomyose voor je dagelijks leven betekenen?">
          <p>Hevige menstruaties en langdurige pijn kunnen invloed hebben op verschillende delen van het leven. Je kunt bijvoorbeeld moeite hebben met:</p>
          <ul><li>slapen;</li><li>werken of studeren;</li><li>sporten en bewegen;</li><li>sociale afspraken;</li><li>reizen;</li><li>seks en intimiteit;</li><li>het verdelen van je energie.</li></ul>
          <p>Bij hevig bloedverlies kan ook de onzekerheid over doorlekken veel aandacht vragen. Sommige mensen plannen activiteiten rondom hun menstruatie of nemen altijd extra menstruatieproducten en kleding mee.</p>
          <p>Langdurige pijn en vermoeidheid kunnen daarnaast invloed hebben op je stemming. Je kunt je gefrustreerd, onzeker of alleen voelen. Dit betekent niet dat de klachten 'tussen je oren zitten'. Lichamelijke klachten en mentale belasting kunnen elkaar wel beïnvloeden.</p>
          <p>Het kan helpen om je klachten en bloedverlies een aantal cycli bij te houden. Zo krijg je zelf meer inzicht en kun je een arts duidelijker laten zien wat de invloed op je leven is.</p>
          <ZoomableImage src="/images/endometriosis-body-3.png" />
        </ArticleTocSection>

        <ArticleTocSection id="hulp-zoeken-adeno" heading="Wanneer is het verstandig om hulp te zoeken?">
          <p>Maak een afspraak met je huisarts wanneer:</p>
          <ul><li>je menstruaties steeds pijnlijker of heviger worden;</li><li>je regelmatig doorlekt of 's nachts vaak moet verschonen;</li><li>pijn of bloedverlies je werk, studie, slaap of sociale leven beïnvloedt;</li><li>je ook buiten de menstruatie buik- of bekkenpijn hebt;</li><li>je pijn hebt tijdens of na seks;</li><li>je vaak een zwaar of drukkend gevoel in de onderbuik hebt;</li><li>je je langdurig moe, duizelig of kortademig voelt;</li><li>je tussen menstruaties of na seks bloed verliest;</li><li>je vragen hebt over zwanger worden;</li><li>je je zorgen maakt over je klachten.</li></ul>
          <p>Deze klachten kunnen ook een andere oorzaak hebben, zoals endometriose, een vleesboom of een andere gynaecologische aandoening. Een arts kan samen met jou onderzoeken wat er aan de hand is.</p>
          <p>Bereid de afspraak voor door bij te houden wanneer je klachten optreden, hoeveel bloed je verliest en wat de klachten met je dagelijks leven doen.</p>
          <div className="article-actions"><Button variant="magenta-outline" href="/bereid-je-huisartsbezoek-voor">Bereid je huisartsbezoek voor</Button><Button variant="magenta-outline">Download het klachtendagboek</Button></div>
        </ArticleTocSection>

        <MedicalReview />
        <ArticleShare />
      </ArticleTocLayout>
    </section>
    <RelatedArticles cards={adenomyosisRelated} />
  </main><Footer /></>;
}

const complaintCards: [string, string, () => React.ReactElement][] = [
  ['Heftige menstruatiepijn', 'Pijn die school, werk, sport, sociale activiteiten of slaap belemmert.', DropletIcon],
  ['Buik- of bekkenpijn', 'Terugkerende of aanhoudende pijn, ook buiten je menstruatie.', PersonStandingIcon],
  ['Darm- of blaasklachten', 'Pijn of andere klachten rondom de ontlasting en het plassen.', ToiletIcon],
  ['Pijn tijdens of na seks', 'Pijn of een onaangenaam gevoel tijdens of na seksuele activiteit.', HeartIcon],
  ['Extreme vermoeidheid', 'Een gevoel van uitputting dat niet verdwijnt na een goede nachtrust.', BedDoubleIcon],
  ['Vruchtbaarheidsproblemen', 'Moeilijk zwanger worden kan bij sommige mensen samenhangen met endometriose.', SproutIcon],
];

const complaintsSections: TocSectionDef[] = [
  { id: 'in-het-kort-klachten', navLabel: 'In het kort' },
  { id: 'herken-je-dit', navLabel: 'Herken je dit?' },
  { id: 'klachten-verschillen', navLabel: 'Verschillen per persoon' },
  { id: 'heftige-menstruatiepijn', navLabel: 'Menstruatiepijn' },
  { id: 'buik-bekkenpijn', navLabel: 'Buik- en bekkenpijn' },
  { id: 'darm-blaasklachten', navLabel: 'Darm en blaas' },
  { id: 'pijn-seks', navLabel: 'Seks' },
  { id: 'extreme-vermoeidheid', navLabel: 'Vermoeidheid' },
  { id: 'vruchtbaarheid', navLabel: 'Vruchtbaarheid' },
  { id: 'andere-klachten', navLabel: 'Andere klachten' },
  { id: 'klachten-veranderen', navLabel: 'Klachten bijhouden' },
  { id: 'wanneer-huisarts', navLabel: 'Naar de huisarts' },
  { id: 'wat-nu', navLabel: 'Wat kun je doen?' },
];

function ComplaintsPage() {
  return <><Header /><main className="article-page" id="top">
    <ArticleHero
      current="Klachten en symptomen"
      breadcrumbs={['Endometriose']}
      label="Klachten herkennen"
      title="Klachten en symptomen van endometriose"
      copy="Endometriose kan verschillende klachten veroorzaken. Welke klachten iemand heeft, wanneer ze optreden en hoeveel invloed ze hebben, verschilt sterk per persoon. Klachten die je dagelijks leven beperken verdienen aandacht, ook als ze niet alleen tijdens je menstruatie optreden."
      image="/images/article-complaints-hero.png"
      primary={<Button href="/endometriosetest">Doe de Endometriosetest</Button>}
      secondary={<Button variant="white" href="/bereid-je-huisartsbezoek-voor">Bereid je huisartsbezoek voor</Button>}
    />
    <section className="article-section">
      <ArticleTocLayout sections={complaintsSections}>
        <TocSummaryCard id="in-het-kort-klachten" items={[
          'Endometriose uit zich bij iedereen anders.',
          'Klachten kunnen rond de menstruatie én op andere momenten voorkomen.',
          'Veel pijn betekent niet automatisch dat er veel endometriose aanwezig is.',
          'Weinig zichtbare endometriose kan toch ernstige klachten veroorzaken.',
          'Sommige mensen met endometriose hebben weinig of geen klachten.',
          'Alleen een zorgprofessional kan onderzoeken wat de oorzaak van je klachten is.',
        ]} />

        <ArticleTocSection id="herken-je-dit" heading="Herken je dit?">
          <p>Deze klachten kunnen voorkomen bij endometriose. Eén klacht zegt niet alles. Ook hoef je niet alle klachten te hebben om endometriose te kunnen hebben.</p>
          <div className="article-toc-complaint-grid">{complaintCards.map(([title, copy, Icon]) => <article key={title}><span className="symptom-icon"><Icon /></span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        </ArticleTocSection>

        <ArticleTocSection id="klachten-verschillen" heading="Klachten verschillen per persoon">
          <p>Niet iedereen met endometriose heeft dezelfde klachten. De ene persoon heeft vooral pijn tijdens de menstruatie. Een ander heeft dagelijks buikpijn, darmklachten of extreme vermoeidheid. Sommige mensen hebben weinig of geen merkbare klachten.</p>
          <p>Klachten kunnen ook in de loop van de tijd veranderen. Je kunt maanden hebben met relatief weinig klachten en periodes waarin de klachten veel invloed hebben.</p>
          <p>De ernst van de pijn komt niet altijd overeen met de hoeveelheid endometriose die tijdens onderzoek zichtbaar is. Iemand met weinig zichtbare endometriose kan ernstige pijn hebben. Andersom kan uitgebreide endometriose soms weinig klachten geven.</p>
          <p>Ook de plek waar je pijn voelt, vertelt niet altijd precies waar endometriose aanwezig is. Pijn kan uitstralen en ook spieren, zenuwen en de bekkenbodem kunnen bij langdurige klachten gevoeliger worden.</p>
          <ArticleCallout><p>Jouw ervaring telt. Pijn of andere klachten die je dagelijks leven beperken verdienen aandacht, ongeacht wat er op dat moment wel of niet zichtbaar is tijdens onderzoek.</p></ArticleCallout>
        </ArticleTocSection>

        <ArticleTocSection id="heftige-menstruatiepijn" heading="Heftige menstruatiepijn" icon={<DropletIcon />}>
          <p>Buikkrampen tijdens de menstruatie komen vaak voor. Maar pijn waardoor gewone dagelijkse activiteiten niet lukken, moet niet als vanzelfsprekend worden beschouwd.</p>
          <p>Bij endometriose kan pijn optreden:</p>
          <ul><li>in de dagen vóór de menstruatie;</li><li>tijdens de menstruatie;</li><li>in de dagen erna;</li><li>rond de eisprong;</li><li>op andere momenten in de cyclus.</li></ul>
          <p>De pijn kan krampend, stekend, brandend, drukkend of zeurend aanvoelen. De pijn kan in de onderbuik zitten en uitstralen naar de onderrug, liezen of benen.</p>
          <p>Let bijvoorbeeld op wanneer je door de pijn:</p>
          <ul><li>niet naar school, studie of werk kunt;</li><li>niet kunt slapen;</li><li>sociale afspraken moet afzeggen;</li><li>niet kunt sporten of bewegen;</li><li>bijna flauwvalt, moet overgeven of volledig uitgeput raakt;</li><li>regelmatig meer pijnstilling nodig hebt;</li><li>je dagelijkse activiteiten rond je menstruatie moet plannen.</li></ul>
          <p>Hevig of langdurig bloedverlies kan ook voorkomen, maar kan verschillende oorzaken hebben. Adenomyose, vleesbomen en andere aandoeningen kunnen bijvoorbeeld eveneens hevig bloedverlies veroorzaken.</p>
        </ArticleTocSection>

        <ArticleTocSection id="buik-bekkenpijn" heading="Buik- of bekkenpijn" icon={<PersonStandingIcon />}>
          <p>Endometriose kan terugkerende of langdurige pijn in de buik of het bekken veroorzaken. Deze pijn kan tijdens de menstruatie erger worden, maar ook buiten de menstruatie aanwezig zijn.</p>
          <p>De pijn kan worden gevoeld:</p>
          <ul><li>onder in de buik;</li><li>diep in het bekken;</li><li>aan één of beide kanten;</li><li>in de onderrug;</li><li>in de liezen;</li><li>in de heupen of bovenbenen.</li></ul>
          <p>Sommige mensen hebben pijn bij bewegen, sporten, lang zitten of staan. Anderen ervaren een zwaar, drukkend of gespannen gevoel in de onderbuik.</p>
          <p>Buik- en bekkenpijn kan veel verschillende oorzaken hebben. De plaats van de pijn is daarom niet voldoende om endometriose vast te stellen.</p>
          <ArticleCallout><p>Pijn hoeft niet constant aanwezig te zijn om belangrijk te zijn. Ook terugkerende pijn die iedere maand je leven beïnvloedt is een reden om hulp te zoeken.</p></ArticleCallout>
        </ArticleTocSection>

        <ArticleTocSection id="darm-blaasklachten" heading="Darm- en blaasklachten" icon={<ToiletIcon />}>
          <p>Endometriose kan samengaan met klachten rond de ontlasting of het plassen. Deze klachten kunnen tijdens de menstruatie duidelijker worden, maar soms ook op andere momenten voorkomen.</p>
          <p><strong>Mogelijke darmklachten</strong></p>
          <ul><li>pijn of krampen bij de ontlasting;</li><li>diarree;</li><li>verstopping;</li><li>afwisseling tussen diarree en verstopping;</li><li>een opgeblazen buik;</li><li>misselijkheid;</li><li>druk of pijn rond de endeldarm;</li><li>het gevoel dat de darm niet helemaal leeg is.</li></ul>
          <p><strong>Mogelijke blaasklachten</strong></p>
          <ul><li>pijn of een branderig gevoel bij het plassen;</li><li>vaak moeten plassen;</li><li>plotseling sterke aandrang;</li><li>pijn wanneer de blaas vol is;</li><li>moeite om de blaas helemaal leeg te plassen;</li><li>buik- of bekkenpijn na het plassen.</li></ul>
          <p>Darm- en blaasklachten kunnen ook andere oorzaken hebben. Het is daarom belangrijk om ze met een arts te bespreken en niet zelf aan te nemen dat ze door endometriose worden veroorzaakt.</p>
          <ArticleCallout><p>Vertel het altijd aan een arts wanneer je bloed bij de ontlasting of in de urine ziet.</p></ArticleCallout>
        </ArticleTocSection>

        <ArticleTocSection id="pijn-seks" heading="Pijn tijdens of na seks" icon={<HeartIcon />}>
          <p>Pijn tijdens of na seks komt regelmatig voor bij mensen met endometriose. De pijn kan oppervlakkig bij de ingang van de vagina worden gevoeld, maar ook dieper in de buik of het bekken.</p>
          <p>De pijn kan:</p>
          <ul><li>tijdens penetratie ontstaan;</li><li>vooral bij diepe penetratie optreden;</li><li>pas na de seksuele activiteit beginnen;</li><li>nog uren of langer aanhouden;</li><li>samengaan met buikpijn, krampen of bloedverlies.</li></ul>
          <p>Uit angst voor pijn kun je onbewust je bekkenbodemspieren aanspannen. Dit kan de pijn verder versterken. Ook vermoeidheid, eerdere pijnervaringen en spanning kunnen invloed hebben.</p>
          <p>Seks hoort niet iets te zijn waar je doorheen moet omdat je denkt dat de pijn erbij hoort. Stop wanneer iets pijn doet en bespreek samen wat wel prettig of mogelijk is.</p>
          <ArticleCallout><p>Vind je het moeilijk om deze klachten te bespreken? Een huisarts of gynaecoloog is gewend om vragen over seks en pijn te bespreken. Wanneer dat passend is, kan ook begeleiding door een bekkenfysiotherapeut of seksuoloog worden overwogen.</p></ArticleCallout>
        </ArticleTocSection>

        <ArticleTocSection id="extreme-vermoeidheid" heading="Extreme vermoeidheid" icon={<BedDoubleIcon />}>
          <p>Vermoeidheid bij endometriose kan verder gaan dan gewone moeheid na een drukke dag. Het kan voelen alsof je lichaam volledig leeg is, ook wanneer je voldoende hebt geslapen.</p>
          <p>Vermoeidheid kan mogelijk samenhangen met:</p>
          <ul><li>langdurige of terugkerende pijn;</li><li>slecht slapen door klachten;</li><li>de lichamelijke belasting van ontstekingsprocessen;</li><li>hevig bloedverlies en ijzertekort;</li><li>bijwerkingen van medicijnen;</li><li>steeds moeten plannen en omgaan met klachten;</li><li>mentale spanning of somberheid.</li></ul>
          <p>Vermoeidheid kan het moeilijk maken om te werken, studeren, bewegen, sociale activiteiten te ondernemen of voor jezelf en anderen te zorgen.</p>
          <p>Vermoeidheid heeft veel mogelijke oorzaken. Bespreek aanhoudende of extreme vermoeidheid daarom met je huisarts. De arts kan beoordelen of aanvullend onderzoek nodig is, bijvoorbeeld naar bloedarmoede of een andere aandoening.</p>
          <ArticleCallout><p>Extreme vermoeidheid is niet hetzelfde als luiheid. Ook wanneer anderen niet aan je zien hoe uitgeput je bent, kan de invloed op je leven groot zijn.</p></ArticleCallout>
        </ArticleTocSection>

        <ArticleTocSection id="vruchtbaarheid" heading="Vruchtbaarheidsproblemen" icon={<SproutIcon />}>
          <p>Endometriose kan bij sommige mensen invloed hebben op de vruchtbaarheid. Soms wordt endometriose ontdekt tijdens onderzoek omdat zwanger worden niet lukt.</p>
          <p>Endometriose betekent niet automatisch dat je niet zwanger kunt worden. Veel mensen met endometriose worden zonder medische hulp zwanger. Bij anderen kan het langer duren of kan aanvullende begeleiding nodig zijn.</p>
          <p>De invloed op vruchtbaarheid verschilt onder andere door:</p>
          <ul><li>de plaats en uitgebreidheid van de endometriose;</li><li>de aanwezigheid van verklevingen;</li><li>endometriosecysten op de eierstokken;</li><li>leeftijd;</li><li>andere medische factoren bij jezelf of je partner.</li></ul>
          <p>Heb je een huidige of toekomstige kinderwens? Bespreek dit dan met je arts voordat je een behandeling kiest. Sommige behandelingen onderdrukken tijdelijk de menstruatie en bepaalde operaties kunnen relevant zijn voor je vruchtbaarheid.</p>
          <p>Maak je je zorgen omdat zwanger worden niet lukt? Bespreek dan met je huisarts wanneer verder onderzoek in jouw situatie passend is.</p>
        </ArticleTocSection>

        <ArticleTocSection id="andere-klachten" heading="Andere mogelijke klachten">
          <p>Naast de zes belangrijkste klachtengroepen kunnen ook andere klachten voorkomen, zoals:</p>
          <ul><li>pijn in de onderrug;</li><li>pijn die uitstraalt naar de benen;</li><li>pijn rond de eisprong;</li><li>een sterk opgeblazen buik;</li><li>misselijkheid;</li><li>slaapproblemen;</li><li>moeite met concentreren;</li><li>hoofdpijn;</li><li>prikkelbaarheid, angst of somberheid.</li></ul>
          <p>In zeldzame gevallen kan endometriose buiten het bekken voorkomen. Dit kan bijvoorbeeld samengaan met terugkerende klachten rond de schouder of borstkas die een patroon met de menstruatie lijken te volgen.</p>
          <p>Geen van deze klachten bewijst op zichzelf dat je endometriose hebt. De klachten kunnen ook bij andere aandoeningen voorkomen.</p>
        </ArticleTocSection>

        <ArticleTocSection id="klachten-veranderen" heading="Klachten kunnen veranderen">
          <p>Klachten kunnen per maand en per levensfase verschillen. Ze kunnen veranderen door bijvoorbeeld:</p>
          <ul><li>hormonale schommelingen;</li><li>gebruik of verandering van anticonceptie;</li><li>zwangerschap;</li><li>een behandeling;</li><li>stress en slaap;</li><li>veranderingen in lichamelijke belasting;</li><li>de overgang.</li></ul>
          <p>Ook na een behandeling kunnen klachten blijven bestaan of later terugkomen. Bespreek duidelijke veranderingen met je behandelaar, vooral wanneer klachten toenemen of nieuwe klachten ontstaan.</p>
          <h3>Houd je klachten bij</h3>
          <p>Een klachtenoverzicht helpt je om patronen te herkennen en duidelijker uit te leggen wat je ervaart. Je kunt hiervoor een dagboek, agenda of notitie op je telefoon gebruiken.</p>
          <p>Noteer bijvoorbeeld:</p>
          <ul><li>de datum en het moment van de dag;</li><li>waar je je in je menstruatiecyclus bevindt;</li><li>welke klacht je hebt;</li><li>waar je de klacht voelt;</li><li>hoe de klacht aanvoelt;</li><li>hoe ernstig de klacht is op een schaal van 0 tot 10;</li><li>hoelang de klacht duurt;</li><li>welke invloed de klacht heeft op je activiteiten;</li><li>welke medicijnen of andere oplossingen je gebruikt;</li><li>of die oplossingen helpen;</li><li>eventuele darm-, blaas- of seksuele klachten.</li></ul>
          <p>Houd bij wat haalbaar is. Je hoeft niet maandenlang alles perfect te registreren voordat je hulp mag vragen.</p>
          <h3>Breng je klachten in kaart</h3>
          <p>Gebruik het klachtendagboek om bij te houden wanneer klachten optreden en wat ze met je dagelijks leven doen.</p>
          <Button><img src="/images/download-white.svg" alt="" />Download het klachtendagboek</Button>
        </ArticleTocSection>

        <ArticleTocSection id="wanneer-huisarts" heading="Wanneer ga je naar de huisarts?">
          <p>Maak een afspraak met je huisarts wanneer klachten regelmatig terugkomen, erger worden of je dagelijks leven beïnvloeden.</p>
          <p>Ga bijvoorbeeld naar de huisarts wanneer:</p>
          <ul><li>menstruatiepijn je belemmert in school, studie, werk of slaap;</li><li>je door klachten activiteiten of afspraken moet afzeggen;</li><li>je ook buiten de menstruatie buik- of bekkenpijn hebt;</li><li>je regelmatig pijn hebt bij de ontlasting of het plassen;</li><li>je pijn hebt tijdens of na seks;</li><li>je langdurig of extreem vermoeid bent;</li><li>je veel of langdurig bloed verliest;</li><li>je vragen of zorgen hebt over vruchtbaarheid;</li><li>je jezelf herkent in meerdere klachten van endometriose;</li><li>je je zorgen maakt, ook als je klachten niet in een lijst passen.</li></ul>
          <p>De huisarts kan met je bespreken welke oorzaken mogelijk zijn, of verder onderzoek nodig is en welke vervolgstap passend kan zijn.</p>
        </ArticleTocSection>

        <ArticleTocSection id="wat-nu" heading="Wat kun je doen?">
          <ArticleCallout><p>Neem bij plotselinge hevige klachten of wanneer je je ernstig ziek voelt direct contact op met je huisarts of huisartsenpost.</p></ArticleCallout>
          <Button variant="magenta-outline" href="/bereid-je-huisartsbezoek-voor">Bereid je huisartsbezoek voor</Button>
        </ArticleTocSection>

        <MedicalReview date="[datum invullen]" reviewer="[naam en functie invullen]" note="Deze informatie is algemeen en vervangt geen persoonlijk medisch advies. Klachten kunnen verschillende oorzaken hebben. Bespreek vragen of zorgen over je gezondheid met je huisarts of behandelaar." />
        <ArticleShare />
      </ArticleTocLayout>
    </section>
    <RelatedArticles cards={complaintsRelated} />
  </main><Footer /></>;
}

const doctorVisitRelated: RelatedArticle[] = [
  { title: 'Klachten en symptomen', copy: 'Lees welke klachten bij endometriose kunnen voorkomen en welke informatie belangrijk kan zijn voor je huisarts.', image: '/images/related-complaints.png', href: '/klachten' },
  { title: 'Onderzoek en diagnose', copy: 'Lees wat je kunt verwachten van een verwijzing, gesprekken en mogelijke onderzoeken.', image: '/images/related-diagnosis.png', href: '#' },
  { title: 'Doe de Endometriosetest', copy: 'Beantwoord acht korte vragen en ontvang een advies over een mogelijke vervolgstap.', image: '/images/image-1.jpg', href: '/endometriosetest', cta: 'Doe de test' },
];

function DoctorStep({ number, title, children }: { number: 1 | 2 | 3; title: string; children: React.ReactNode }) {
  return <article className="doctor-step"><img src={`/images/doctor-step-${number}.svg`} alt={`Stap ${number}`} /><div><h3>{title}</h3>{children}</div></article>;
}

const doctorVisitSections: TocSectionDef[] = [
  { id: 'in-het-kort-huisarts', navLabel: 'In het kort' },
  { id: 'bereid-je-voor', navLabel: 'Drie stappen' },
  { id: 'vragenlijst', navLabel: 'De vragenlijst' },
  { id: 'neem-iemand-mee', navLabel: 'Iemand meenemen' },
  { id: 'tijdens-gesprek', navLabel: 'Tijdens het gesprek' },
  { id: 'stel-vragen', navLabel: 'Stel je vragen' },
  { id: 'maak-plan', navLabel: 'Maak een plan' },
  { id: 'na-afspraak', navLabel: 'Na de afspraak' },
];

function DoctorVisitPage() {
  return <><Header /><main className="article-page doctor-page" id="top">
    <ArticleHero
      current="Bereid je huisartsbezoek voor"
      breadcrumbs={['Zorg']}
      title="Ga voorbereid naar je huisarts"
      copy="Heb je klachten die mogelijk bij endometriose of adenomyose passen? Een goede voorbereiding helpt je om duidelijk te vertellen wat je ervaart, alle vragen te stellen die je hebt en samen met je huisarts een concrete vervolgstap af te spreken. Je hoeft tijdens het gesprek niet alles uit je hoofd te weten. Schrijf je klachten en vragen vooraf op en neem gerust iemand mee."
      image="/images/doctor-visit-hero.png"
      primary={<Button href="/downloads/vragenlijst-huisartsbezoek.pdf" download="vragenlijst-huisartsbezoek.pdf">Download de gesprekshulp</Button>}
      secondary={<Button variant="white" href="#bereid-je-voor">Zo bereid je je voor</Button>}
    />
    <section className="article-section">
      <ArticleTocLayout sections={doctorVisitSections}>
        <TocSummaryCard id="in-het-kort-huisarts" items={[
          'Wacht niet met het maken van een afspraak totdat je alles perfect hebt bijgehouden. Ook zonder een volledig overzicht kun je met je klachten naar de huisarts.',
          'Houd vóór de afspraak bij wanneer je klachten optreden.',
          'Beschrijf niet alleen de klacht, maar ook wat deze met je dagelijks leven doet.',
          'Schrijf alle vragen op die je wilt stellen.',
          'Neem iemand mee als dat jou helpt om je verhaal te vertellen en informatie te onthouden.',
          'Vraag aan het einde wat de volgende stap is en wanneer deze wordt geëvalueerd.',
        ]} />

        <ArticleTocSection id="bereid-je-voor" heading="Bereid je gesprek in drie stappen voor">
          <p>Je hoeft geen uitgebreid medisch verslag te maken. Korte en concrete aantekeningen kunnen je huisarts al helpen om een beter beeld te krijgen.</p>
          <div className="doctor-step-list">
            <DoctorStep number={1} title="Houd je klachten bij">
              <p>Schrijf gedurende een aantal dagen of weken op wanneer je klachten optreden. Noteer ook of de klachten op dat moment samenhangen met je menstruatie.</p>
              <p>Schrijf bijvoorbeeld op:</p>
              <ul><li>welke klacht je hebt;</li><li>wanneer de klacht begint;</li><li>hoe lang de klacht duurt;</li><li>hoe ernstig de klacht is op een schaal van 0 tot 10;</li><li>waar in je lichaam je de klacht voelt;</li><li>wat je op dat moment niet of moeilijk kunt doen;</li><li>wat de klacht vermindert of juist erger maakt.</li></ul>
              <p>Je hoeft niet te wachten totdat je meerdere menstruatiecycli hebt bijgehouden. Maak eerder een afspraak als je klachten ernstig zijn of je dagelijks leven beperken.</p>
            </DoctorStep>
            <DoctorStep number={2} title="Beschrijf wat de klachten met je leven doen">
              <p>Vertel niet alleen hoeveel pijn je hebt, maar ook welke invloed de klachten hebben.</p>
              <p>Denk bijvoorbeeld aan:</p>
              <ul><li>niet naar school, studie of werk kunnen;</li><li>afspraken of activiteiten moeten afzeggen;</li><li>slecht slapen;</li><li>niet kunnen sporten of bewegen;</li><li>pijn bij het plassen of de ontlasting;</li><li>pijn tijdens of na seks;</li><li>extreme vermoeidheid;</li><li>moeite met concentreren;</li><li>zorgen, spanning of somberheid door de klachten.</li></ul>
              <p>Concrete voorbeelden helpen de huisarts om de ernst van de situatie beter te begrijpen.</p>
            </DoctorStep>
            <DoctorStep number={3} title="Noteer wat je al hebt geprobeerd">
              <p>Schrijf op welke medicijnen, anticonceptie of andere oplossingen je gebruikt of eerder hebt geprobeerd.</p>
              <p>Noteer wanneer mogelijk:</p>
              <ul><li>de naam van het middel;</li><li>hoeveel en hoe vaak je het gebruikt;</li><li>of het hielp;</li><li>welke bijwerkingen je merkte;</li><li>waarom je ermee bent gestopt.</li></ul>
              <p>Denk ook aan andere dingen die je hebt geprobeerd, zoals warmte, rust, beweging, fysiotherapie of veranderingen in je dagelijkse activiteiten.</p>
              <p>Verander het gebruik van medicijnen niet zonder overleg met een arts of apotheker.</p>
            </DoctorStep>
          </div>
        </ArticleTocSection>

        <ArticleTocSection id="vragenlijst" heading="Vul de vragenlijst vooraf in">
          <p>De Endometriose Stichting heeft een vragenlijst gemaakt om je te helpen je klachten en medische voorgeschiedenis op een rij te zetten.</p>
          <p>In de vragenlijst komen onderwerpen aan bod zoals:</p>
          <ul><li>je menstruatie;</li><li>buik- en bekkenpijn;</li><li>darm- en blaasklachten;</li><li>pijn tijdens of na seks;</li><li>vermoeidheid;</li><li>eerdere onderzoeken;</li><li>gebruikte medicijnen en anticonceptie;</li><li>eventuele kinderwens;</li><li>de invloed van klachten op je dagelijks leven.</li></ul>
          <p>Je hoeft niet op iedere vraag meteen een antwoord te weten. Vul in wat voor jou van toepassing is en neem de vragenlijst mee op papier of op je telefoon.</p>
          <p>De vragenlijst kan helpen bij een afspraak met de huisarts én bij een eventuele latere afspraak met een gynaecoloog.</p>
          <h3>Wat neem je mee?</h3>
          <p>Je hoeft geen groot dossier samen te stellen. Neem mee wat jou helpt om je verhaal duidelijk te vertellen.</p>
          <p>Denk aan:</p>
          <ul><li>de ingevulde vragenlijst;</li><li>je klachtenoverzicht of klachtendagboek;</li><li>een lijst met medicijnen en anticonceptie;</li><li>je belangrijkste vragen;</li><li>relevante informatie over eerdere onderzoeken of behandelingen;</li><li>eventueel iemand die je vertrouwt.</li></ul>
          <p>Heb je veel klachten of vragen? Vraag bij het maken van de afspraak of er extra tijd mogelijk is.</p>
          <Button href="/downloads/vragenlijst-huisartsbezoek.pdf" download="vragenlijst-huisartsbezoek.pdf">Download de vragenlijst</Button>
        </ArticleTocSection>

        <ArticleTocSection id="neem-iemand-mee" heading="Neem iemand mee die je vertrouwt">
          <p>Een afspraak kan spannend zijn. Daardoor is het soms moeilijk om alles te vertellen of te onthouden. Je mag daarom iemand meenemen, bijvoorbeeld je partner, een familielid of een vriend.</p>
          <p>Bespreek vooraf wat je van die persoon nodig hebt. Diegene kan bijvoorbeeld:</p>
          <ul><li>je helpen je verhaal te vertellen;</li><li>belangrijke aanvullingen geven;</li><li>meeluisteren;</li><li>vragen stellen die je zelf vergeet;</li><li>aantekeningen maken;</li><li>na afloop met jou bespreken wat er is afgesproken.</li></ul>
          <p>Jij bepaalt wat er tijdens de afspraak wordt besproken. Spreek daarom vooraf af dat de ander jou ondersteunt en niet het gesprek van je overneemt.</p>
          <ArticleCallout><p>Vraag degene die met je meegaat om de afspraken en vervolgstappen op te schrijven. Dan hoef jij tijdens het gesprek niet alles tegelijk te onthouden.</p></ArticleCallout>
        </ArticleTocSection>

        <ArticleTocSection id="tijdens-gesprek" heading="Vertel duidelijk wat je ervaart">
          <p>Begin het gesprek met de klachten die voor jou het belangrijkst zijn. Je hoeft je verhaal niet in medische woorden te vertellen.</p>
          <p>Je kunt bijvoorbeeld zeggen:</p>
          <p>"Ik heb al langere tijd pijn en andere klachten rond mijn menstruatie. Hierdoor kan ik regelmatig niet werken, studeren of normaal deelnemen aan activiteiten. Ik wil graag onderzoeken waar deze klachten vandaan komen en wat eraan gedaan kan worden."</p>
          <p>Vertel vervolgens:</p>
          <ul><li>wanneer de klachten zijn begonnen;</li><li>waar je last van hebt;</li><li>wanneer de klachten optreden;</li><li>hoe vaak en hoe ernstig ze zijn;</li><li>of ze tijdens je menstruatie erger worden;</li><li>wat de invloed is op je dagelijks leven;</li><li>wat je al hebt geprobeerd;</li><li>waar je je zorgen over maakt.</li></ul>
          <p>Vertel ook over klachten die misschien moeilijk zijn om te bespreken, zoals pijn tijdens seks, darmklachten, blaasklachten of mentale belasting. Deze informatie kan belangrijk zijn voor het totaalbeeld.</p>
          <p><strong>Bagatelliseer je klachten niet.</strong> Zeg niet automatisch dat het "wel meevalt" wanneer de klachten je leven daadwerkelijk beperken.</p>
        </ArticleTocSection>

        <ArticleTocSection id="stel-vragen" heading="Stel alle vragen die je hebt">
          <p>Jouw vragen zijn een belangrijk onderdeel van de afspraak. Schrijf ze vooraf op en begin met de vragen die voor jou het belangrijkst zijn.</p>
          <p>Mogelijke vragen zijn:</p>
          <ul><li>Welke oorzaken kunnen bij mijn klachten passen?</li><li>Zou endometriose of adenomyose een mogelijke oorzaak kunnen zijn?</li><li>Is aanvullend onderzoek nodig?</li><li>Kunnen we nu al iets proberen om mijn klachten te verminderen?</li><li>Wat zijn de voordelen, nadelen en mogelijke bijwerkingen?</li><li>Wanneer wordt een verwijzing naar een gynaecoloog overwogen?</li><li>Wat kan ik doen terwijl ik op onderzoek of een vervolgafspraak wacht?</li><li>Wanneer moet ik opnieuw contact opnemen?</li><li>Wat gebeurt er als mijn klachten niet verbeteren?</li><li>Wat betekent een behandeling voor een huidige of toekomstige kinderwens?</li></ul>
          <p>Je hoeft niet alle vragen uit deze lijst te stellen. Kies de vragen die voor jouw situatie belangrijk zijn.</p>
          <p>Begrijp je een uitleg niet? Vraag gerust:</p>
          <ul><li>"Kunt u dat in eenvoudigere woorden uitleggen?"</li><li>"Kunt u een voorbeeld geven?"</li><li>"Wilt u dat nog een keer herhalen?"</li><li>"Kan ik dit ergens nalezen?"</li></ul>
          <p>Je mag altijd om uitleg vragen. Het is de bedoeling dat jij begrijpt wat er wordt besproken en wat de mogelijke vervolgstappen zijn.</p>
        </ArticleTocSection>

        <ArticleTocSection id="maak-plan" heading="Maak samen een concreet plan">
          <p>Zorg dat je voor het einde van de afspraak weet wat de volgende stap is.</p>
          <p>Bespreek bijvoorbeeld:</p>
          <ul><li>wat de huisarts op dit moment denkt;</li><li>of er onderzoek nodig is;</li><li>of je een behandeling of medicijn gaat proberen;</li><li>wanneer je hiervan effect kunt verwachten;</li><li>welke bijwerkingen belangrijk zijn;</li><li>wanneer de afspraak wordt geëvalueerd;</li><li>wanneer een verwijzing wordt overwogen;</li><li>wat je moet doen als de klachten erger worden;</li><li>hoe en wanneer je een uitslag ontvangt.</li></ul>
          <p>Vraag of de belangrijkste afspraken kunnen worden opgeschreven. Je kunt ze ook zelf noteren of laten opschrijven door degene die met je mee is.</p>
          <p><strong>Aandachtspunt</strong></p>
          <p>Ga indien mogelijk niet weg zonder antwoord op deze drie vragen:</p>
          <ol><li>Wat is nu de volgende stap?</li><li>Wanneer bespreken we of deze stap voldoende helpt?</li><li>Wat kan ik doen als mijn klachten eerder erger worden?</li></ol>
          <h3>Wat als je je niet gehoord voelt?</h3>
          <p>Het kan gebeuren dat je na het gesprek het gevoel hebt dat de invloed van je klachten nog niet duidelijk is.</p>
          <p>Probeer dan concreet te benoemen:</p>
          <ul><li>welke activiteiten niet meer lukken;</li><li>hoe vaak je door de klachten thuisblijft;</li><li>hoeveel pijn of bloedverlies je ervaart;</li><li>hoe lang de klachten al bestaan;</li><li>wat je al hebt geprobeerd;</li><li>waar je je zorgen over maakt.</li></ul>
          <p>Je kunt vragen:</p>
          <ul><li>waarom verder onderzoek of een verwijzing op dit moment wel of niet passend is;</li><li>wanneer de situatie opnieuw wordt beoordeeld;</li><li>bij welke veranderingen je eerder contact moet opnemen;</li><li>welke andere mogelijkheden er zijn.</li></ul>
          <p>Kom je er in één gesprek niet uit? Maak dan een vervolgafspraak. Je kunt opnieuw iemand meenemen of bespreken of een verwijzing of tweede mening in jouw situatie passend is.</p>
          <p>Voor jezelf opkomen betekent niet dat je tegenover je huisarts staat. Het doel is om samen duidelijk te krijgen welke zorg nu nodig is.</p>
        </ArticleTocSection>

        <ArticleTocSection id="na-afspraak" heading="Na de afspraak">
          <p>Neem na het gesprek even de tijd om terug te kijken.</p>
          <p>Controleer of je weet:</p>
          <ul><li>wat er is afgesproken;</li><li>wat je zelf gaat doen;</li><li>of en wanneer je met een behandeling begint;</li><li>wanneer je een uitslag krijgt;</li><li>wanneer de volgende afspraak is;</li><li>wanneer je eerder contact moet opnemen.</li></ul>
          <p>Bespreek de afspraak eventueel met degene die mee was. Schrijf onduidelijkheden of nieuwe vragen op voor een volgend gesprek.</p>
          <p>Blijf je klachten bijhouden wanneer dat onderdeel is van het afgesproken plan. Neem eerder contact op wanneer je klachten duidelijk veranderen of erger worden.</p>
        </ArticleTocSection>

        <MedicalReview date="[datum invullen]" reviewer="[naam en functie invullen]" note="Deze informatie helpt je om een gesprek voor te bereiden en vervangt geen persoonlijk medisch advies." />
        <ArticleShare />
      </ArticleTocLayout>
    </section>
    <RelatedArticles cards={doctorVisitRelated} />
  </main><Footer /></>;
}

function HomePage() { return <><Header /><main><Hero /><Symptoms /><TestSection /><Routes /><Experts /><Stories /><Agenda /><About /><Donation /></main><Footer /></>; }

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  if (pathname === '/doneren' || pathname === '/donatie') return <DonationPage />;
  if (pathname === '/endometriosetest' || pathname === '/test') return <TestPage />;
  if (pathname === '/wat-is-endometriose') return <WhatIsEndometriosisPage />;
  if (pathname === '/wat-is-adenomyose') return <WhatIsAdenomyosisPage />;
  if (pathname === '/klachten') return <ComplaintsPage />;
  if (pathname === '/bereid-je-huisartsbezoek-voor') return <DoctorVisitPage />;
  return <HomePage />;
}
