from pathlib import Path
from typing import Iterable

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "vragenlijst-huisartsbezoek.pdf"
PUBLIC_OUTPUT = ROOT / "public" / "downloads" / "vragenlijst-huisartsbezoek.pdf"

W, H = A4
MARGIN = 56
CONTENT_W = W - 2 * MARGIN

INK = HexColor("#161316")
MUTED = HexColor("#4A4448")
MAGENTA = HexColor("#C52A72")
ORANGE = HexColor("#F38627")
GRID = HexColor("#E8E3E6")
PALE = HexColor("#FCF4F8")
WHITE = colors.white

REGULAR = "HostGrotesk"
MEDIUM = "HostGrotesk-Medium"
BOLD = "HostGrotesk-Bold"


def register_fonts() -> None:
    fonts = ROOT / "public" / "fonts"
    pdfmetrics.registerFont(TTFont(REGULAR, str(fonts / "host-grotesk-400.ttf")))
    pdfmetrics.registerFont(TTFont(MEDIUM, str(fonts / "host-grotesk-500.ttf")))
    pdfmetrics.registerFont(TTFont(BOLD, str(fonts / "host-grotesk-700.ttf")))


def bottom(top: float, height: float = 0) -> float:
    return H - top - height


def wrap_lines(text: str, font: str, size: float, width: float) -> list[str]:
    lines: list[str] = []
    for paragraph in text.split("\n"):
        if not paragraph:
            lines.append("")
            continue
        words = paragraph.split()
        line = words[0]
        for word in words[1:]:
            candidate = f"{line} {word}"
            if pdfmetrics.stringWidth(candidate, font, size) <= width:
                line = candidate
            else:
                lines.append(line)
                line = word
        lines.append(line)
    return lines


def draw_text(
    c: canvas.Canvas,
    text: str,
    x: float,
    top: float,
    width: float,
    *,
    font: str = REGULAR,
    size: float = 9,
    leading: float | None = None,
    color=INK,
) -> float:
    leading = leading or size * 1.35
    c.setFont(font, size)
    c.setFillColor(color)
    y = H - top - size
    for line in wrap_lines(text, font, size, width):
        c.drawString(x, y, line)
        y -= leading
    return H - y


def draw_logo(c: canvas.Canvas) -> None:
    c.saveState()
    c.setStrokeColor(MAGENTA)
    c.setFillColor(MAGENTA)
    c.setLineWidth(3.8)
    c.setLineCap(1)
    center_x = MARGIN + 11
    center_y = H - 68
    c.circle(center_x, center_y, 9.5, fill=0, stroke=1)
    c.line(center_x - 8, center_y + 2, center_x + 8, center_y - 2)
    c.line(center_x, center_y - 9.5, center_x, center_y - 27)
    c.line(center_x - 7, center_y - 20.5, center_x + 7, center_y - 20.5)
    c.setFont(BOLD, 14.5)
    c.drawString(MARGIN + 32, H - 69, "Endometriose")
    c.drawString(MARGIN + 32, H - 86, "Stichting")
    c.restoreState()


def draw_footer(c: canvas.Canvas, page: int, prompt: str | None = None) -> None:
    # Draw once more after all widgets; some PDF writers restart the content stream
    # when creating AcroForm appearances.
    draw_logo(c)
    if prompt:
        c.setFillColor(MUTED)
        c.setFont(REGULAR, 8.5)
        label = prompt
        width = pdfmetrics.stringWidth(label, REGULAR, 8.5)
        c.drawString(W - MARGIN - width - 14, bottom(750, 9), label)
        c.setLineWidth(1)
        c.line(W - MARGIN - 8, bottom(750, 4), W - MARGIN, bottom(750, 4))
        c.line(W - MARGIN - 4, bottom(746, 4), W - MARGIN, bottom(750, 4))
        c.line(W - MARGIN - 4, bottom(754, 4), W - MARGIN, bottom(750, 4))
    c.setStrokeColor(GRID)
    c.setLineWidth(0.7)
    c.line(MARGIN, bottom(770), W - MARGIN, bottom(770))
    c.setFillColor(MUTED)
    c.setFont(REGULAR, 7.7)
    c.drawString(MARGIN, bottom(786, 8), "Endometriose Stichting | endometriose.nl")
    page_label = f"{page} / 10"
    c.drawRightString(W - MARGIN, bottom(786, 8), page_label)


def header_band(c: canvas.Canvas, top: float, left: str, right: str, color=MAGENTA, split=0.5) -> None:
    x = MARGIN
    width = CONTENT_W
    height = 31
    c.setFillColor(color)
    c.roundRect(x, bottom(top, height), width, height, 13, fill=1, stroke=0)
    c.rect(x, bottom(top, height), width, height - 13, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(MEDIUM, 8.8)
    c.drawString(x + 13, bottom(top + 11, 8.8), left)
    c.drawString(x + width * split + 13, bottom(top + 11, 8.8), right)


def table_outline(c: canvas.Canvas, top: float, height: float) -> None:
    c.setStrokeColor(GRID)
    c.setLineWidth(0.65)
    c.roundRect(MARGIN, bottom(top, height), CONTENT_W, height, 14, fill=0, stroke=1)


def row_lines(c: canvas.Canvas, top: float, heights: Iterable[float], split=0.5) -> list[tuple[float, float]]:
    cells: list[tuple[float, float]] = []
    y_top = top
    heights_list = list(heights)
    total = sum(heights_list)
    c.setStrokeColor(GRID)
    c.setLineWidth(0.65)
    c.line(MARGIN + CONTENT_W * split, bottom(top), MARGIN + CONTENT_W * split, bottom(top, total))
    for index, height in enumerate(heights_list):
        cells.append((y_top, height))
        y_top += height
        if index != len(heights_list) - 1:
            c.line(MARGIN, bottom(y_top), W - MARGIN, bottom(y_top))
    return cells


def add_text_field(c: canvas.Canvas, name: str, x: float, top: float, width: float, height: float, multiline=True) -> None:
    c.acroForm.textfield(
        name=name,
        tooltip=name.replace("_", " "),
        x=x,
        y=bottom(top, height),
        width=width,
        height=height,
        borderWidth=0,
        fillColor=WHITE,
        textColor=INK,
        fontName="Helvetica",
        fontSize=8.5,
        fieldFlags="multiline" if multiline else "",
        forceBorder=False,
    )


def add_checkbox(c: canvas.Canvas, name: str, x: float, top: float, label: str, label_width: float = 170) -> None:
    size = 8
    c.acroForm.checkbox(
        name=name,
        tooltip=label,
        x=x,
        y=bottom(top, size),
        size=size,
        buttonStyle="check",
        borderWidth=0.7,
        borderColor=GRID,
        fillColor=WHITE,
        forceBorder=True,
    )
    draw_text(c, label, x + 14, top - 1, label_width, size=8.3, leading=10.5)


def draw_question_cell(c: canvas.Canvas, title: str, description: str | None, x: float, top: float, width: float, italic: str | None = None) -> None:
    used = draw_text(c, title, x, top, width, font=MEDIUM, size=8.7, leading=11.3)
    cursor = used + 6
    if description:
        cursor = draw_text(c, description, x, cursor, width, size=8.2, leading=10.7, color=MUTED) + 4
    if italic:
        draw_text(c, italic, x, cursor, width, size=7.8, leading=10, color=MUTED)


def draw_simple_table(
    c: canvas.Canvas,
    top: float,
    rows: list[tuple[str, float]],
    prefix: str,
    *,
    header: tuple[str, str] | None = None,
    header_color=MAGENTA,
    split=0.5,
) -> None:
    start = top
    if header:
        header_band(c, top, header[0], header[1], header_color, split)
        start += 31
    heights = [height for _, height in rows]
    table_outline(c, top, sum(heights) + (31 if header else 0))
    cells = row_lines(c, start, heights, split)
    left_w = CONTENT_W * split
    for index, ((label, _), (row_top, row_h)) in enumerate(zip(rows, cells), start=1):
        draw_text(c, label, MARGIN + 13, row_top + 8, left_w - 26, size=8.5, leading=10.7)
        add_text_field(
            c,
            f"{prefix}_{index}",
            MARGIN + left_w + 7,
            row_top + 5,
            CONTENT_W - left_w - 14,
            row_h - 10,
        )


def page_one(c: canvas.Canvas) -> None:
    draw_logo(c)
    draw_text(c, "Vragenlijst huisartsbezoek", MARGIN, 145, CONTENT_W, font=MEDIUM, size=9, color=MAGENTA)
    draw_text(c, "Voor je eerste afspraak over endometriose:\nwat je kunt verwachten", MARGIN, 166, CONTENT_W, font=BOLD, size=20.5, leading=23)
    draw_text(c, "Een praktische gids om je goed voor te bereiden", MARGIN, 219, CONTENT_W, size=9.5, color=MUTED)
    paragraphs = [
        "Je hebt al een tijd last van pijn in je onderbuik, vermoeidheid of andere klachten die niet normaal aanvoelen. Misschien heeft je omgeving het lange tijd afgedaan als 'erbij horen', of heeft het maanden - soms jaren - geduurd voordat iemand je serieus nam. Maar jij voelt: dit klopt niet. En nu is het moment daar - je hebt eindelijk een afspraak bij de gynaecoloog gemaakt.",
        "Die eerste afspraak is spannend. Er komt veel op je af, en je wilt niets belangrijks vergeten. Daarom is een goede voorbereiding ontzettend waardevol. Hoe duidelijker jij je klachten kunt omschrijven, hoe beter de arts je kan helpen en een passend behandelplan kan opstellen.",
        "In deze vragenlijst vind je een overzicht van vragen die je arts mogelijk zal stellen. Door hier van tevoren over na te denken en je antwoorden eventueel op te schrijven, krijg je meer grip op het gesprek en haal je alles uit je consult.",
    ]
    cursor = 255
    for paragraph in paragraphs:
        cursor = draw_text(c, paragraph, MARGIN, cursor, CONTENT_W, size=9.2, leading=12.2, color=MUTED) + 8
    rows = [
        ("Datum van je eerste menstruatie:", 32),
        ("Datum van je meest recente menstruatie:", 32),
        ("Duur van je menstruatie per keer:", 32),
        ("Soort menstruatie (zwaar, normaal, licht):", 32),
        ("Heb je last van tussentijdse bloedingen?", 32),
    ]
    draw_simple_table(c, 493, rows, "basis", header=("Basis vragen", "Jouw antwoorden"))
    draw_footer(c, 1, "Ga door naar de volgende pagina")
    c.showPage()


def page_two(c: canvas.Canvas) -> None:
    draw_logo(c)
    rows = [
        ("Menstrueer je elke 28-30 dagen of wijkt je cyclus daar vanaf?", 45),
        ("Wat voor soort medicijnen, welke pil, wat voor hormonen en/of supplementen gebruik je regelmatig?", 63),
        ("Geef aan hoe sterk deze medicijnen zijn en hoe vaak je ze gebruikt.", 45),
        ("Soort menstruatie (zwaar, normaal, licht):", 35),
        ("Heb je last van tussentijdse bloedingen?", 35),
        ("Menstrueer je elke 28-30 dagen of wijkt je cyclus daar vanaf?", 45),
        ("Wat voor soort medicijnen, welke pil, wat voor hormonen en/of supplementen gebruik je regelmatig?", 63),
        ("- Geef aan hoe sterk deze medicijnen zijn en hoe vaak je ze gebruikt.", 50),
        ("Noteer alle ziektes die je ooit hebt gehad (inclusief SOA's) en alle operaties die je ooit hebt ondergaan:", 98),
        ("Noteer alle ziektes die in je directe familie voorkomen:", 48),
        ("Noteer alle allergieën die je hebt:", 35),
    ]
    draw_simple_table(c, 145, rows, "basis_vervolg")
    draw_footer(c, 2, "Ga door naar de volgende pagina")
    c.showPage()


def page_three(c: canvas.Canvas) -> None:
    draw_logo(c)
    top = 145
    heights = [43, 43, 43, 190]
    table_outline(c, top, sum(heights))
    cells = row_lines(c, top, heights)
    labels = [
        "Rook je? Zo ja, hoeveel en hoe vaak?",
        "Drink je alcohol? Zo ja, hoeveel en hoe vaak?",
        "Heb je ooit drugs gebruikt? Zo ja, hoeveel en hoe vaak?",
    ]
    for index, label in enumerate(labels):
        row_top, row_h = cells[index]
        draw_text(c, label, MARGIN + 13, row_top + 10, CONTENT_W / 2 - 26, font=MEDIUM, size=8.7)
        add_text_field(c, f"leefstijl_{index + 1}", MARGIN + CONTENT_W / 2 + 7, row_top + 5, CONTENT_W / 2 - 14, row_h - 10)
    row_top, _ = cells[3]
    draw_question_cell(
        c,
        "Heb je pijn tijdens je menstruatie?",
        "Probeer een patroon vast te stellen van je pijn. Het is van belang om te vertellen of je gedurende de hele menstruatie pijn hebt, of dat de pijn afwisselend voorkomt. Je kunt deze vraag het beste beantwoorden als je een 'pijn dagboek' bijhoudt (zie onder).",
        MARGIN + 13,
        row_top + 10,
        CONTENT_W / 2 - 26,
        "Zo houd je bij wanneer je pijn hebt (datum en dagdeel), hoe lang de pijn aanhoudt en hoe zwaar de pijn is. Bijvoorbeeld: had je de gehele dag pijn, of alleen een deel van de dag?",
    )
    x = MARGIN + CONTENT_W / 2 + 13
    add_checkbox(c, "menstruatiepijn_ja", x, row_top + 28, "Ja")
    add_checkbox(c, "menstruatiepijn_nee", x, row_top + 59, "Nee")
    add_checkbox(c, "menstruatiepijn_soms", x, row_top + 90, "Soms")
    draw_footer(c, 3, "Ga door naar de volgende pagina")
    c.showPage()


def page_four(c: canvas.Canvas) -> None:
    draw_logo(c)
    top = 145
    header_band(c, top, "Vragen over pijn", "Jouw antwoorden")
    start = top + 31
    heights = [36, 115, 36, 158, 36, 82]
    table_outline(c, top, 31 + sum(heights))
    cells = row_lines(c, start, heights)
    left_x = MARGIN + 13
    right_x = MARGIN + CONTENT_W / 2 + 13
    draw_text(c, "Heb je pijn tijdens of na het vrijen?", left_x, cells[0][0] + 10, 210, font=MEDIUM, size=8.6)
    for idx, label in enumerate(["Ja", "Nee", "Soms"]):
        add_checkbox(c, f"vrijen_{label.lower()}", right_x + idx * 48, cells[0][0] + 12, label, 34)
    draw_text(c, "Het is het beste om open en eerlijk te zijn over de pijn tijdens of na het vrijen. Geef aan of diepe penetratie pijn doet, of het de hele tijd pijn doet, of een orgasme de pijn erger maakt en of je manieren hebt om de pijn te verminderen.", left_x, cells[1][0] + 10, 210, size=8.2, leading=10.5, color=MUTED)
    for idx, label in enumerate(["Pijn is erger tijdens diepe penetratie", "Ik heb pijn tijdens een orgasme", "Ik heb pijn na een orgasme", "Ik heb pijn tijdens bepaalde seksuele posities"]):
        add_checkbox(c, f"vrijen_detail_{idx + 1}", right_x, cells[1][0] + 13 + idx * 24, label, 190)
    draw_text(c, "Heb je last van pijnlijke darm activiteit?", left_x, cells[2][0] + 10, 210, font=MEDIUM, size=8.6)
    for idx, label in enumerate(["Ja", "Nee", "Soms"]):
        add_checkbox(c, f"darm_{label.lower()}", right_x + idx * 48, cells[2][0] + 12, label, 34)
    draw_text(c, "Veel vrouwen met endometriose hebben duidelijke darmklachten, zoals pijnlijke darmactiviteit, rectale pijn, verstoppingen of diarree. De arts zal ook willen weten of je wel eens bloed in je ontlasting hebt gehad en of deze symptomen tijdens de menstruatie voorkomen.", left_x, cells[3][0] + 10, 210, size=8.2, leading=10.5, color=MUTED)
    for idx, label in enumerate(["Ik heb darmpijn", "Ik heb rectale pijn", "Ik heb last van verstoppingen en/of diarree, of afwisselend last van beide", "Ik heb bloed in mijn ontlasting", "Mijn darmklachten zijn erger tijdens mijn menstruatie"]):
        add_checkbox(c, f"darm_detail_{idx + 1}", right_x, cells[3][0] + 12 + idx * 27, label, 190)
    draw_text(c, "Heb je pijn in het bekken tijdens fysieke inspanning (sporten)?", left_x, cells[4][0] + 7, 210, font=MEDIUM, size=8.6, leading=10.5)
    for idx, label in enumerate(["Ja", "Nee", "Soms"]):
        add_checkbox(c, f"inspanning_{label.lower()}", right_x + idx * 48, cells[4][0] + 12, label, 34)
    draw_text(c, "Sommige vrouwen met endometriose hebben meer pijn wanneer ze zich fysiek inspannen. Deze pijn kan toenemen tijdens de menstruatie.", left_x, cells[5][0] + 10, 210, size=8.2, leading=10.5, color=MUTED)
    add_checkbox(c, "inspanning_erger_menstruatie", right_x, cells[5][0] + 16, "Pijn tijdens fysieke inspanning is erger tijdens mijn menstruatie", 190)
    draw_footer(c, 4, "Ga door naar de volgende pagina")
    c.showPage()


def page_five(c: canvas.Canvas) -> None:
    draw_logo(c)
    top = 145
    heights = [38, 146, 130, 127, 56]
    table_outline(c, top, sum(heights))
    cells = row_lines(c, top, heights)
    items = [
        ("Wanneer is jouw pijn begonnen?", None, None),
        ("Waar heb je pijn?", "Wanneer je deze vraag beantwoordt, wijs dan naar of beschrijf het deel van je lichaam waar je last van hebt. Sommige artsen tonen een tekening van het lichaam zodat je daarop aan kan geven waar het pijn doet.", None),
        ("Wat voor soort pijn voel je?", "Wanneer je de pijn beschrijft, gebruik dan bijvoeglijke naamwoorden die het beste beschrijven hoe jij je voelt. Vrouwen beschrijven endometriose pijn vaak als brandend, stekend, kramp, pulserend, koud, scherp, aanhoudend of drukkend.", None),
        ("Wat is de mate van je pijn?", None, "Bijvoorbeeld, je kunt een bijvoeglijk naamwoord gebruiken zoals ondraaglijk, ernstig, gemiddeld of licht. Of je kunt gebruik maken van een pijn schaal, waarbij 1 staat voor geen pijn en 10 voor pijn zo erg dat je flauwvalt. Als het je handig lijkt, kun je gebruik maken van Andrea Mankoski's Pijn Schaal (zie onder)."),
        ("Hoe erg is je pijn op dit moment?", None, "Wees eerlijk!"),
    ]
    for i, (title, desc, italic) in enumerate(items):
        row_top, row_h = cells[i]
        draw_question_cell(c, title, desc, MARGIN + 13, row_top + 9, CONTENT_W / 2 - 26, italic)
        if i == 3:
            draw_text(c, "Pijn op een schaal van 1-10:", MARGIN + CONTENT_W / 2 + 13, row_top + 15, 200, size=8.4)
            add_text_field(c, "pijn_schaal", MARGIN + CONTENT_W / 2 + 13, row_top + 34, CONTENT_W / 2 - 26, 31, False)
            draw_text(c, "Pijn als bijvoorbeeld naamwoord:", MARGIN + CONTENT_W / 2 + 13, row_top + 76, 200, size=8.4)
            add_text_field(c, "pijn_omschrijving", MARGIN + CONTENT_W / 2 + 13, row_top + 94, CONTENT_W / 2 - 26, 25, False)
        else:
            add_text_field(c, f"pijn_algemeen_{i + 1}", MARGIN + CONTENT_W / 2 + 7, row_top + 5, CONTENT_W / 2 - 14, row_h - 10)
    draw_footer(c, 5, "Ga door naar de volgende pagina")
    c.showPage()


def page_six(c: canvas.Canvas) -> None:
    draw_logo(c)
    top = 145
    heights = [145, 96, 105, 175]
    table_outline(c, top, sum(heights))
    cells = row_lines(c, top, heights)
    draw_question_cell(c, "Hoeveel dagen per maand heb je pijn?", None, MARGIN + 13, cells[0][0] + 10, 210, "Als je een heel goed geheugen hebt, dan zul je het aantal dagen dat je per maand pijn hebt goed kunnen inschatten. Maar de meesten van ons proberen de pijn zo snel mogelijk te vergeten zodra het voorbij is en dus zijn onze schattingen niet altijd even accuraat. Daarom is een 'pijn dagboek' (zie onder) een betere manier om het precieze aantal pijndagen per maand te bepalen.")
    draw_text(c, "Aantal dagen per maand dat ik pijn heb:", MARGIN + CONTENT_W / 2 + 13, cells[0][0] + 12, 200, size=8.4)
    add_text_field(c, "pijndagen_per_maand", MARGIN + CONTENT_W / 2 + 13, cells[0][0] + 35, CONTENT_W / 2 - 26, 32, False)
    draw_question_cell(c, "Wordt de pijn erger?", "Is de pijn erger geworden sinds het moment dat de pijn begon? Zo ja, hoezeer?", MARGIN + 13, cells[1][0] + 10, 210)
    right_x = MARGIN + CONTENT_W / 2 + 13
    for idx, label in enumerate(["Pijn is veel erger geworden", "Pijn is een beetje erger geworden", "Pijn is ongeveer constant gebleven", "Pijn is ietsje minder geworden"]):
        add_checkbox(c, f"pijn_verloop_{idx + 1}", right_x, cells[1][0] + 12 + idx * 20, label, 190)
    draw_question_cell(c, "Hoe beïnvloedt de pijn je leven?", "Vertel je arts of je werk of school moet missen of dat je sociale activiteiten afslaat vanwege de pijn. De arts zal ook vragen of de pijn je ervan weerhoudt om te sporten.", MARGIN + 13, cells[2][0] + 10, 210)
    add_text_field(c, "invloed_op_leven", MARGIN + CONTENT_W / 2 + 7, cells[2][0] + 5, CONTENT_W / 2 - 14, cells[2][1] - 10)
    draw_question_cell(c, "Noteer welke medicijnen je gebruikt hebt om de pijn te verlichten en of deze medicijnen ook geholpen hebben.", None, MARGIN + 13, cells[3][0] + 9, 210, "De meeste vrouwen met endometriose hebben verschillende soorten pijnonderdrukkende of ontstekingsremmende pijnstillers geprobeerd. Vertel je arts over medicijnen die je bij de drogist hebt gehaald of medicijnen die je door je huisarts voorgeschreven hebt gekregen, op dit moment of in het verleden. Vermeld ook of en hoelang ze je pijn verlichten.")
    draw_text(c, "Medicijnen die ik genomen heb:", right_x, cells[3][0] + 12, 190, size=8.4)
    add_text_field(c, "medicijnen_pijn", right_x, cells[3][0] + 32, CONTENT_W / 2 - 26, 60)
    draw_text(c, "Heeft het geholpen?", right_x, cells[3][0] + 104, 190, size=8.4)
    add_text_field(c, "medicijnen_effect", right_x, cells[3][0] + 122, CONTENT_W / 2 - 26, 40)
    draw_footer(c, 6, "Ga door naar de volgende pagina")
    c.showPage()


def page_seven(c: canvas.Canvas) -> None:
    draw_logo(c)
    top = 145
    first_h = 142
    table_outline(c, top, first_h)
    row_lines(c, top, [first_h])
    draw_question_cell(c, "Noteer hier of je aan alternatieve manieren van pijnbestrijding hebt gedaan (of doet):", None, MARGIN + 13, top + 10, 210, "Wanneer traditionele methodes niet werken, wenden veel vrouwen zich tot alternatieve benaderingen van pijnbestrijding (zoals acupunctuur of chiropractie). Vertel je arts of je bepaalde kruiden neemt of dat je alternatieve genezers bezoekt vanwege je pijn en of deze methoden succesvol zijn.")
    right_x = MARGIN + CONTENT_W / 2 + 13
    draw_text(c, "Alternatieve methode:", right_x, top + 12, 190, size=8.4)
    add_text_field(c, "alternatieve_methode", right_x, top + 31, CONTENT_W / 2 - 26, 47)
    draw_text(c, "Heeft het geholpen?", right_x, top + 89, 190, size=8.4)
    add_text_field(c, "alternatieve_methode_effect", right_x, top + 106, CONTENT_W / 2 - 26, 25, False)
    symptom_top = top + first_h + 30
    header_band(c, symptom_top, "Andere symptomen", "Jouw antwoorden")
    rows = [
        "Heb je altijd last van misselijkheid tijdens je menstruatie?",
        "Moet je overgeven tijdens je menstruatie?",
        "Heb je last van ongewone vaginale bloedingen tijdens je cyclus?",
        "Heb je altijd last van pijn bij het plassen of bloed in je urine tijdens je cyclus?",
        "Heb je last van een opgeblazen gevoel tijdens je menstruatie of op andere tijden?",
        "Heb je er moeite mee om af te vallen of aan te komen?",
        "Heb je last van vermoeidheid?",
    ]
    heights = [45, 36, 50, 53, 53, 45, 36]
    table_outline(c, symptom_top, 31 + sum(heights))
    cells = row_lines(c, symptom_top + 31, heights)
    for idx, (label, (row_top, _)) in enumerate(zip(rows, cells), start=1):
        draw_text(c, label, MARGIN + 13, row_top + 9, CONTENT_W / 2 - 26, size=8.4, leading=10.4)
        add_checkbox(c, f"symptoom_{idx}_ja", right_x, row_top + 13, "Ja", 30)
        add_checkbox(c, f"symptoom_{idx}_nee", right_x + 50, row_top + 13, "Nee", 35)
    draw_footer(c, 7, "Meer info op de volgende pagina")
    c.showPage()


def draw_static_table(c: canvas.Canvas, top: float, headers: list[str], widths: list[float], rows: list[list[str]], row_heights: list[float], header_h=62) -> None:
    x = MARGIN
    total_h = header_h + sum(row_heights)
    c.setStrokeColor(GRID)
    c.setLineWidth(0.65)
    c.roundRect(x, bottom(top, total_h), CONTENT_W, total_h, 14, fill=0, stroke=1)
    c.setFillColor(ORANGE)
    c.roundRect(x, bottom(top, header_h), CONTENT_W, header_h, 14, fill=1, stroke=0)
    c.rect(x, bottom(top, header_h), CONTENT_W, header_h - 14, fill=1, stroke=0)
    cursor_x = x
    for header, width in zip(headers, widths):
        draw_text(c, header, cursor_x + 12, top + 15, width - 24, font=MEDIUM, size=8.5, leading=10.5, color=WHITE)
        cursor_x += width
        if cursor_x < x + CONTENT_W:
            c.setStrokeColor(HexColor("#E07A22"))
            c.line(cursor_x, bottom(top), cursor_x, bottom(top, total_h))
    row_top = top + header_h
    for row, row_h in zip(rows, row_heights):
        cursor_x = x
        for value, width in zip(row, widths):
            draw_text(c, value, cursor_x + 12, row_top + 11, width - 24, size=8.2, leading=10.5)
            cursor_x += width
        row_top += row_h
        if row_top < top + total_h:
            c.setStrokeColor(GRID)
            c.line(x, bottom(row_top), x + CONTENT_W, bottom(row_top))


def page_eight(c: canvas.Canvas) -> None:
    draw_logo(c)
    draw_text(c, "Voorbeeld van een dagelijks pijn dagboek", MARGIN, 145, CONTENT_W, font=BOLD, size=17.5)
    draw_text(c, "Een praktische gids om je goed voor te bereiden", MARGIN, 171, CONTENT_W, size=9.2, color=MUTED)
    widths = [70, 70, 78, 105, 78, CONTENT_W - 401]
    headers = ["Datum", "Dag in\ncyclus", "Activiteit &\ninspanning", "Soort &\nlocatie pijn\n/ andere\nsymptomen", "Hoe lang\nhield de\npijn aan?", "Medicijnen\n&\neffectiviteit"]
    rows = [
        ["15 maart", "Dag 4", "3", "Kramp en drukkend gevoel net onder de navel.\n\nDiarree na de lunch.", "2 uur", "Tylenol\n(enigszins effectief)"],
        ["17 maart", "Dag 6", "2", "Opgeblazen buik na het avondeten.\n\nHoofdpijn de hele dag.", "3 uur", "Paracetamol\n(werkte niet echt)\n\nIbuprofen\n(werkte voor hoofdpijn)"],
    ]
    draw_static_table(c, 202, headers, widths, rows, [132, 145], 73)
    draw_footer(c, 8, "Meer info op de volgende pagina")
    c.showPage()


def page_nine(c: canvas.Canvas) -> None:
    draw_logo(c)
    draw_text(c, "Andrea Mankoski's pijn schaal", MARGIN, 145, CONTENT_W, font=BOLD, size=17.5)
    widths = [54, 274, CONTENT_W - 328]
    headers = ["Niveau", "Omschrijving", "Medicijnen"]
    rows = [
        ["0", "Pijn vrij.", "Geen medicijnen nodig."],
        ["1", "Heel klein beetje last - af en toe kleine pijnscheutjes.", "Geen medicijnen nodig."],
        ["2", "Klein beetje last - af en toe sterke pijnscheuten.", "Geen medicijnen nodig."],
        ["3", "Vervelend genoeg om erdoor afgeleid te worden.", "Lichte pijnstillers zijn effectief (bijv. aspirine of ibuprofen)."],
        ["4", "Pijn kan genegeerd worden wanneer je opgaat in wat je doet, maar het leidt wel af.", "Lichte pijnstillers verlichten de pijn 3-4 uur."],
        ["5", "Kan niet meer dan 30 minuten genegeerd worden.", "Lichte pijnstillers verlichten de pijn 3-4 uur."],
        ["6", "Kan niet meer genegeerd worden, maar je kunt nog wel werken en meedoen aan sociale activiteiten.", "Sterke pijnstillers (Codeine, Vicodin) verminderen de pijn gedurende 3-4 uur."],
        ["7", "Moeilijk om te concentreren, bemoeilijkt het slapen. Je kunt nog met moeite functioneren. Sterke pijnstillers zijn maar gedeeltelijk effectief.", "Sterkste pijnstillers verlichten de pijn (Oxycontin, Morfine)."],
        ["8", "Fysieke activiteiten beperkt. Je kunt met moeite lezen en praten. Misselijkheid en duizeligheid beginnen te komen als onderdeel van de pijn.", "Sterke pijnstillers zijn niet echt effectief meer. Ze verminderen de pijn gedurende 3-4 uur."],
        ["9", "Niet in staat om te praten - ongecontroleerd huilen en kreunen - nabij een delirium.", "Sterkste pijnstillers zijn maar gedeeltelijk effectief."],
        ["10", "Bewusteloosheid. De pijn zorgt ervoor dat je flauwvalt.", "Sterkste pijnstillers zijn maar gedeeltelijk effectief."],
    ]
    heights = [26, 30, 30, 45, 48, 37, 57, 67, 67, 50, 38]
    draw_static_table(c, 180, headers, widths, rows, heights, 31)
    draw_footer(c, 9)
    c.showPage()


def page_ten(c: canvas.Canvas) -> None:
    draw_logo(c)
    draw_text(c, "Nog even dit", MARGIN, 145, CONTENT_W, font=MEDIUM, size=9, color=MAGENTA)
    draw_text(c, "Praten over je klachten met een arts", MARGIN, 166, CONTENT_W, font=BOLD, size=17.5)
    text_one = "Het kan best spannend zijn om naar de dokter te gaan met klachten zoals bekkenpijn of andere vervelende symptomen. Vooral als je jong bent, voelt het vaak ongemakkelijk om zulke persoonlijke dingen te bespreken - zeker bij een gynaecoloog. Toch is het heel belangrijk om eerlijk en open te zijn over wat je voelt en ervaart."
    text_two = "Hoe duidelijker jij jouw symptomen kunt omschrijven, hoe beter je arts begrijpt wat er aan de hand is. Ook dingen die je misschien gênant of onbelangrijk vindt, kunnen waardevolle informatie opleveren voor een juiste diagnose. Door eerlijk te vertellen waar je last van hebt, geef je de arts de kans om je echt goed te helpen - met de juiste onderzoeken, uitleg en een behandelplan dat bij jou past."
    cursor = draw_text(c, text_one, MARGIN, 198, CONTENT_W, size=9.2, leading=12.2, color=MUTED) + 10
    cursor = draw_text(c, text_two, MARGIN, cursor, CONTENT_W, size=9.2, leading=12.2, color=MUTED) + 10
    draw_text(c, "Onthoud: jouw ervaring telt. En je hoeft je nergens voor te schamen.", MARGIN, cursor, CONTENT_W, size=9.2, color=MUTED)
    draw_text(c, "© 2003 Ellen T. Johnson", MARGIN, 741, CONTENT_W, font=MEDIUM, size=8.2, color=MAGENTA)
    draw_footer(c, 10)


def build_pdf(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(path), pagesize=A4, pageCompression=1)
    c.setTitle("Vragenlijst huisartsbezoek - Endometriose Stichting")
    c.setAuthor("Endometriose Stichting")
    c.setSubject("Invulbare voorbereiding op een afspraak over endometriose")
    for renderer in [page_one, page_two, page_three, page_four, page_five, page_six, page_seven, page_eight, page_nine, page_ten]:
        renderer(c)
    c.save()


def main() -> None:
    register_fonts()
    build_pdf(OUTPUT)
    PUBLIC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_OUTPUT.write_bytes(OUTPUT.read_bytes())
    print(OUTPUT)


if __name__ == "__main__":
    main()
