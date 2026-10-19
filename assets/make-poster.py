"""Generate the SJTU-Bench promo poster (16:9) with python-pptx."""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

W, H = 13.333, 7.5
BG = RGBColor(0x0B, 0x12, 0x20)
CARD = RGBColor(0x12, 0x1C, 0x2E)
WHITE = RGBColor(0xF8, 0xFA, 0xFC)
MUTED = RGBColor(0x94, 0xA3, 0xB8)
CYAN = RGBColor(0x22, 0xD3, 0xEE)
LIME = RGBColor(0xA3, 0xE6, 0x35)
ORANGE = RGBColor(0xFB, 0x92, 0x3C)
PURPLE = RGBColor(0xC4, 0xB5, 0xFD)
FONT = "Microsoft YaHei"


def set_font(run, size, bold=False, color=WHITE):
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = FONT
    rPr = run._r.get_or_add_rPr()
    ea = rPr.find(qn("a:ea"))
    if ea is None:
        ea = rPr.makeelement(qn("a:ea"), {})
        rPr.append(ea)
    ea.set("typeface", FONT)


def textbox(slide, left, top, width, height, lines, size=16, color=WHITE,
            bold=False, align=PP_ALIGN.LEFT, spacing=1.0, anchor=MSO_ANCHOR.TOP):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = 0
    tf.margin_right = 0
    tf.margin_top = 0
    tf.margin_bottom = 0
    if isinstance(lines, str):
        lines = [lines]
    for index, line in enumerate(lines):
        paragraph = tf.paragraphs[0] if index == 0 else tf.add_paragraph()
        paragraph.alignment = align
        paragraph.line_spacing = spacing
        if isinstance(line, tuple):
            text, opts = line
        else:
            text, opts = line, {}
        run = paragraph.add_run()
        run.text = text
        set_font(run, opts.get("size", size), opts.get("bold", bold), opts.get("color", color))
    return box


def rect(slide, left, top, width, height, fill, radius=True):
    type_ = MSO_SHAPE.ROUNDED_RECTANGLE if radius else MSO_SHAPE.RECTANGLE
    shape = slide.shapes.add_shape(type_, Inches(left), Inches(top), Inches(width), Inches(height))
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    shape.line.fill.background()
    if radius:
        shape.adjustments[0] = 0.1
    return shape


def circle(slide, left, top, size, fill):
    shape = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(left), Inches(top), Inches(size), Inches(size))
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    shape.line.fill.background()
    return shape


prs = Presentation()
prs.slide_width = Inches(W)
prs.slide_height = Inches(H)
slide = prs.slides.add_slide(prs.slide_layouts[6])
slide.background.fill.solid()
slide.background.fill.fore_color.rgb = BG

# background decoration
circle(slide, 11.3, -1.5, 4.3, RGBColor(0x0F, 0x2A, 0x3A))
circle(slide, 12.2, 4.5, 2.7, RGBColor(0x1A, 0x2A, 0x12))
circle(slide, 10.5, 5.7, 1.3, RGBColor(0x2A, 0x1A, 0x10))
rect(slide, 0.0, 0.0, 0.16, H, CYAN, radius=False)

# badge
rect(slide, 0.7, 0.5, 3.2, 0.4, RGBColor(0x16, 0x2A, 0x3C))
textbox(slide, 0.83, 0.56, 3.0, 0.3, "SJTU · CAMPUS AI BENCH", 10.5, CYAN, True)

# left: title
title = slide.shapes.add_textbox(Inches(0.7), Inches(1.02), Inches(8.0), Inches(0.9))
tf = title.text_frame
tf.word_wrap = False
tf.margin_left = 0
tf.margin_right = 0
tf.margin_top = 0
tf.margin_bottom = 0
para = tf.paragraphs[0]
for text, color in [("SJTU-", WHITE), ("BENCH", CYAN)]:
    run = para.add_run()
    run.text = text
    set_font(run, 54, True, color)

# subtitle
subtitle = slide.shapes.add_textbox(Inches(0.72), Inches(1.98), Inches(8.2), Inches(0.7))
stf = subtitle.text_frame
stf.word_wrap = False
stf.margin_left = 0
stf.margin_right = 0
stf.margin_top = 0
stf.margin_bottom = 0
spara = stf.paragraphs[0]
for text, color in [("AI ", CYAN), ("帮你掌握校园的一切", WHITE)]:
    run = spara.add_run()
    run.text = text
    set_font(run, 30, True, color)
textbox(slide, 0.74, 2.72, 8.0, 0.4, "15 个真实校园任务 · L1–L4", 14, MUTED)

# left: four big task categories
levels = [
    ("L1", "查课表 / 通知 / 水源 / 交我办", LIME),
    ("L2", "DDL / 公众号 / 邮箱 / 活动", CYAN),
    ("L3", "政务流程 / 云盘 / 报销（只预填）", ORANGE),
    ("L4", "每日简报 / 工作流 / 你的 Agent 方案", PURPLE),
]
y = 3.36
for tag, desc, color in levels:
    rect(slide, 0.7, y, 7.25, 0.78, CARD)
    rect(slide, 0.7, y, 0.9, 0.78, color)
    textbox(slide, 0.7, y + 0.19, 0.9, 0.4, tag, 17, BG, True, PP_ALIGN.CENTER)
    textbox(slide, 1.85, y + 0.14, 5.9, 0.5, desc, 16, WHITE, True)
    y += 0.94

# right: simple trigger card
rect(slide, 8.45, 1.35, 4.25, 5.55, CARD)
textbox(slide, 8.65, 1.85, 3.85, 1.2, "“我要试一试\nsjtubench”", 24, WHITE, True, PP_ALIGN.CENTER, 1.15)
textbox(slide, 8.7, 3.35, 3.75, 0.4, "登录一下 jAccount", 14, MUTED, False, PP_ALIGN.CENTER)
textbox(slide, 8.7, 3.83, 3.75, 0.55, "↓", 28, CYAN, True, PP_ALIGN.CENTER)
textbox(slide, 8.6, 4.47, 3.95, 0.8, "AI 能帮我省多少时间？", 20, WHITE, True, PP_ALIGN.CENTER)
textbox(slide, 8.6, 6.18, 3.95, 0.4, "一切隐私信息严格保存在本地", 11, CYAN, False, PP_ALIGN.CENTER)

# footer
rect(slide, 0.0, 7.0, W, 0.5, RGBColor(0x0F, 0x18, 0x28), radius=False)
textbox(slide, 0.7, 7.12, 7.5, 0.3, "github.com/zhenghong-li/sjtu-bench", 13, WHITE, True)
textbox(slide, 8.6, 7.14, 3.9, 0.28, "娱乐向 · 非官方 · MIT", 10.5, MUTED, False, PP_ALIGN.RIGHT)

prs.save("assets/sjtu-bench-poster-16x9.pptx")
print("saved assets/sjtu-bench-poster-16x9.pptx")
