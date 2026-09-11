from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
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
ORANGE = HexColor("#F38627")
PALE = HexColor("#FCF4F8")
BORDER = HexColor("#F8E7F0")
DIVIDER = HexColor("#ECEBEC")

pdfmetrics.registerFont(TTFont("Host", str(ROOT / "public" / "fonts" / "host-grotesk-400.ttf")))
pdfmetrics.registerFont(TTFont("HostMedium", str(ROOT / "public" / "fonts" / "host-grotesk-500.ttf")))
pdfmetrics.registerFont(TTFont("HostBold", str(ROOT / "public" / "fonts" / "host-grotesk-700.ttf")))


def paragraph(text, width, font="Host", size=11, leading=15.4, color=MUTED):
    style = ParagraphStyle(
        "pdf-text",
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=color,
        spaceAfter=0,
        spaceBefore=0,
    )
    value = Paragraph(text, style)
    _, value.height = value.wrap(width, A4[1])
    return value


def draw_paragraph(c, text, x, top, width, font="Host", size=11, leading=15.4, color=MUTED):
    value = paragraph(text, width, font, size, leading, color)
    value.drawOn(c, x, top - value.height)
    return value.height


def draw_logo(c):
    try:
        from svglib.svglib import svg2rlg
        from reportlab.graphics import renderPDF

        logo = svg2rlg(str(ROOT / "public" / "images" / "logo.svg"))
        scale = min(177 / logo.width, 48 / logo.height)
        logo.scale(scale, scale)
        renderPDF.draw(logo, c, 56, A4[1] - 56 - 48)
    except Exception:
        c.setFillColor(MAGENTA)
        c.setFont("HostBold", 20)
        c.drawString(56, A4[1] - 75, "Endometriose")
        c.drawString(56, A4[1] - 98, "Stichting")


def draw_footer(c, page, with_prompt=False):
    if with_prompt:
        c.setFillColor(MAGENTA)
        c.setFont("Host", 11)
        c.drawRightString(521, A4[1] - 751, "Bekijk jouw antwoorden op de volgende pagina")
        c.setStrokeColor(MAGENTA)
        c.setLineWidth(1.2)
        y = A4[1] - 747
        c.line(529, y, 538, y)
        c.line(534, y + 4, 538, y)
        c.line(534, y - 4, 538, y)
    c.setStrokeColor(DIVIDER)
    c.setLineWidth(0.8)
    c.line(56, A4[1] - 762, 539, A4[1] - 762)
    c.setFillColor(MUTED)
    c.setFont("Host", 11)
    c.drawString(56, A4[1] - 783, "Endometriose Stichting | endometriose.nl")
    c.drawRightString(539, A4[1] - 783, f"{page} / 2")


questions = [
    "Vanaf de eerste menstruaties heb ik al hevige menstruatiepijn die niet goed reageert op pijnstillers.",
    "Door mijn menstruatieproblemen ben ik al vroeg aan de pil begonnen.",
    "De menstruatiepijn verdwijnt niet tijdens de pil of komt snel weer terug.",
    "Door mijn menstruatieproblemen moet ik soms van school, werk, sport e.d. verzuimen.",
    "Endometriose komt bij mij in de familie voor.",
    "Voor, tijdens of na de menstruatie heb ik last met mijn stoelgang en/of plassen",
    "Seksuele activiteit zorgt voor klachten in de onderbuik.",
    "Ik heb doorbraakbloedingen tijdens pilgebruik.",
]
answers = ["Ja", "Ja", "Ja", "Nee", "Weet ik niet", "Nee", "Ja", "Nee"]

c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
c.setTitle("Voorbeeld uitslag Endometriosetest")
c.setSubject("Persoonlijk overzicht van de Endometriosetest")
c.setAuthor("Endometriose Stichting")
page_height = A4[1]

draw_logo(c)
c.setFillColor(MAGENTA)
c.setFont("HostMedium", 11)
c.drawString(56, page_height - 155, "Jouw uitslag")
c.setFillColor(INK)
c.setFont("HostBold", 24)
c.drawString(56, page_height - 184, "Er is kans dat je endometriose hebt.")
c.setFillColor(MUTED)
c.setFont("HostMedium", 11)
c.drawString(56, page_height - 205, "Je hebt 4 van de 8 vragen met ‘ja’ beantwoord.")

c.setFillColor(INK)
c.setFont("HostBold", 18)
c.drawString(56, page_height - 266, "Bespreek je klachten met je huisarts")
draw_paragraph(
    c,
    "Je antwoorden geven reden om je klachten verder te bespreken. Dat betekent niet automatisch dat je endometriose hebt. Deze test kan endometriose niet aantonen of uitsluiten.",
    56,
    page_height - 278,
    483,
)

c.setFillColor(PALE)
c.roundRect(56, page_height - 373, 483, 56, 24, fill=1, stroke=0)
c.setStrokeColor(MAGENTA)
c.setLineWidth(1.5)
c.circle(84, page_height - 345, 10, fill=0, stroke=1)
c.setFillColor(MAGENTA)
c.setFont("HostMedium", 11)
c.drawCentredString(84, page_height - 349, "i")
c.setFillColor(INK)
c.drawString(112, page_height - 349, "Bij drie of meer keer ‘ja’ adviseren we je contact op te nemen met je huisarts.")

c.setFillColor(ORANGE)
c.setFont("HostMedium", 11)
c.drawString(56, page_height - 425, "Wat nu?")
steps = [
    ("Bewaar je uitslag", "Download dit overzicht en neem het mee wanneer je jouw klachten gaat bespreken met jouw huisarts."),
    ("Maak een afspraak", "Plan een afspraak bij je huisarts en vertel welke klachten je ervaart."),
    ("Neem je antwoorden mee", "Je antwoorden kunnen helpen om het gesprek over passende vervolgstappen te voeren."),
]
for index, ((heading, copy), center_y) in enumerate(zip(steps, [452, 513, 559]), start=1):
    c.setFillColor(ORANGE)
    c.circle(68, page_height - center_y, 12, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("HostMedium", 11)
    c.drawCentredString(68, page_height - center_y - 4, str(index))
    c.setFillColor(INK)
    c.setFont("HostMedium", 11)
    c.drawString(92, page_height - center_y + 2, heading)
    draw_paragraph(c, copy, 92, page_height - center_y - 8, 447)
draw_footer(c, 1, True)

c.showPage()
draw_logo(c)
y = 144
for index, (question, answer) in enumerate(zip(questions, answers), start=1):
    question_paragraph = paragraph(question, 299, "HostMedium", 11, 15.4, INK)
    card_height = max(60, 32 + question_paragraph.height)
    card_bottom = page_height - y - card_height
    c.setFillColor(PALE if index % 2 else white)
    c.setStrokeColor(BORDER)
    c.setLineWidth(1)
    c.roundRect(56, card_bottom, 483, card_height, 24, fill=1, stroke=0 if index % 2 else 1)
    center_y = page_height - y - card_height / 2
    c.setFillColor(MAGENTA)
    c.circle(84, center_y, 12, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("HostMedium", 11)
    c.drawCentredString(84, center_y - 4, str(index))
    question_paragraph.drawOn(c, 108, card_bottom + (card_height - question_paragraph.height) / 2)
    answer_color = MAGENTA if answer == "Ja" else ORANGE if answer == "Weet ik niet" else MUTED
    c.setFillColor(answer_color)
    c.roundRect(431, center_y - 14, 92, 28, 14, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("HostMedium", 11)
    c.drawCentredString(477, center_y - 4, answer)
    y += card_height + 12
draw_footer(c, 2)
c.save()
print(OUTPUT)
