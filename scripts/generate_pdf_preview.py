from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "voorbeeld-uitslag-endometriosetest.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

INK = HexColor("#161316")
MUTED = HexColor("#4A4448")
MAGENTA = HexColor("#C52A72")
ORANGE = HexColor("#F28A2E")
PALE = HexColor("#FCF4F8")
LINE = HexColor("#EBDDE5")

pdfmetrics.registerFont(TTFont("Host", str(ROOT / "public" / "fonts" / "host-grotesk-400.ttf")))
pdfmetrics.registerFont(TTFont("HostMedium", str(ROOT / "public" / "fonts" / "host-grotesk-500.ttf")))
pdfmetrics.registerFont(TTFont("HostBold", str(ROOT / "public" / "fonts" / "host-grotesk-700.ttf")))


def para(c, text, x, top, width, font="Host", size=10, leading=13, color=MUTED):
    style = ParagraphStyle("p", fontName=font, fontSize=size, leading=leading, textColor=color, alignment=TA_LEFT)
    paragraph = Paragraph(text, style)
    _, height = paragraph.wrap(width, 100 * mm)
    paragraph.drawOn(c, x, top - height)
    return top - height


def brand(c, page):
    width, height = A4
    c.setFillColor(MAGENTA)
    c.rect(0, height - 5 * mm, width, 5 * mm, fill=1, stroke=0)
    c.setFont("HostBold", 15)
    c.drawString(18 * mm, height - 23 * mm, "Endometriose")
    c.drawString(18 * mm, height - 29 * mm, "Stichting")
    c.setStrokeColor(LINE)
    c.setLineWidth(0.3)
    c.line(18 * mm, 19 * mm, width - 18 * mm, 19 * mm)
    c.setFillColor(MUTED)
    c.setFont("Host", 8.5)
    c.drawString(18 * mm, 12 * mm, "Endometriose Stichting  |  endometriose.nl")
    c.drawRightString(width - 18 * mm, 12 * mm, f"{page} / 2")


questions = [
    "Vanaf de eerste menstruaties heb ik al hevige menstruatiepijn die niet goed reageert op pijnstillers.",
    "Door mijn menstruatieproblemen ben ik al vroeg aan de pil begonnen.",
    "De menstruatiepijn verdwijnt niet tijdens de pil of komt snel weer terug.",
    "Door mijn menstruatieproblemen moet ik soms van school, werk, sport e.d. verzuimen.",
    "Endometriose komt bij mij in de familie voor.",
    "Voor, tijdens of na de menstruatie heb ik last met mijn stoelgang en/of plassen.",
    "Seksuele activiteit zorgt voor klachten in de onderbuik.",
    "Ik heb doorbraakbloedingen tijdens pilgebruik.",
]
answers = ["Ja", "Ja", "Ja", "Ja", "Nee", "Nee", "Nee", "Nee"]

c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
c.setTitle("Voorbeeld uitslag Endometriosetest")
c.setAuthor("Endometriose Stichting")
width, height = A4

brand(c, 1)
c.setFillColor(MAGENTA)
c.setFont("HostMedium", 10)
c.drawString(18 * mm, height - 42 * mm, "JOUW UITSLAG")
para(c, "Er is kans dat je endometriose hebt.", 18 * mm, height - 49 * mm, 174 * mm, "HostBold", 24, 27, INK)
c.setFillColor(MUTED)
c.setFont("HostMedium", 11)
c.drawString(18 * mm, height - 66 * mm, "Je hebt 4 van de 8 vragen met 'ja' beantwoord.")

c.setFillColor(PALE)
c.roundRect(18 * mm, height - 130 * mm, 174 * mm, 52 * mm, 6 * mm, fill=1, stroke=0)
c.setFillColor(INK)
c.setFont("HostBold", 12)
c.drawString(26 * mm, height - 91 * mm, "Bespreek je klachten met je huisarts")
para(c, "Je antwoorden geven reden om je klachten verder te bespreken. Dat betekent niet automatisch dat je endometriose hebt. Deze test kan endometriose niet aantonen of uitsluiten.", 26 * mm, height - 99 * mm, 158 * mm, "Host", 10, 13, MUTED)

c.setStrokeColor(MAGENTA)
c.setLineWidth(0.7)
c.circle(23 * mm, height - 145 * mm, 4 * mm, fill=0, stroke=1)
c.setFillColor(MAGENTA)
c.setFont("HostBold", 9)
c.drawCentredString(23 * mm, height - 147 * mm, "i")
para(c, "Bij drie of meer keer 'ja' adviseren we je contact op te nemen met je huisarts.", 32 * mm, height - 141 * mm, 154 * mm, "HostMedium", 10, 13, INK)

c.setFillColor(ORANGE)
c.setFont("HostMedium", 10)
c.drawString(18 * mm, height - 168 * mm, "WAT NU?")

steps = [
    ("1", "Bewaar je uitslag", "Download dit overzicht en neem het mee wanneer je jouw klachten bespreekt."),
    ("2", "Maak een afspraak", "Plan een afspraak bij je huisarts en vertel welke klachten je ervaart."),
    ("3", "Neem je antwoorden mee", "Je antwoorden kunnen helpen om het gesprek over passende vervolgstappen te voeren."),
]
top = height - 178 * mm
for number, title, copy in steps:
    c.setFillColor(MAGENTA)
    c.circle(23 * mm, top, 4.5 * mm, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("HostBold", 9)
    c.drawCentredString(23 * mm, top - 2 * mm, number)
    c.setFillColor(INK)
    c.setFont("HostBold", 11)
    c.drawString(32 * mm, top + 1 * mm, title)
    para(c, copy, 32 * mm, top - 4 * mm, 154 * mm, "Host", 9.5, 12, MUTED)
    top -= 27 * mm

c.showPage()
brand(c, 2)
c.setFillColor(MAGENTA)
c.setFont("HostMedium", 10)
c.drawString(18 * mm, height - 42 * mm, "ENDOMETRIOSETEST")
c.setFillColor(INK)
c.setFont("HostBold", 24)
c.drawString(18 * mm, height - 54 * mm, "Jouw antwoorden")
c.setFillColor(MUTED)
c.setFont("Host", 10)
c.drawString(18 * mm, height - 63 * mm, "Een overzicht om te bewaren of mee te nemen naar je huisarts.")

top = height - 73 * mm
for index, (question, answer) in enumerate(zip(questions, answers), start=1):
    card_height = 18 * mm
    c.setFillColor(PALE if index % 2 else white)
    c.setStrokeColor(LINE)
    c.roundRect(18 * mm, top - card_height, 174 * mm, card_height, 4 * mm, fill=1, stroke=0 if index % 2 else 1)
    c.setFillColor(MAGENTA)
    c.setFont("HostBold", 10)
    c.drawString(24 * mm, top - 8 * mm, str(index))
    para(c, question, 34 * mm, top - 5 * mm, 112 * mm, "Host", 9.5, 11.5, INK)
    c.setFillColor(MAGENTA if answer == "Ja" else MUTED)
    c.roundRect(158 * mm, top - 14 * mm, 27 * mm, 9 * mm, 4.5 * mm, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("HostMedium", 8.5)
    c.drawCentredString(171.5 * mm, top - 11 * mm, answer)
    top -= 21 * mm

para(c, "Let op: deze test kan endometriose niet aantonen of uitsluiten en vervangt geen medisch onderzoek of gesprek met een zorgprofessional.", 18 * mm, 44 * mm, 174 * mm, "Host", 8.5, 10.5, MUTED)
c.save()
print(OUTPUT)
