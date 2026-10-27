"""Generate the four campus event knowledge-base PDFs."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / "knowledge"
INK = colors.HexColor("#102A2A")
ORANGE = colors.HexColor("#D86D38")
PAPER = colors.HexColor("#F2EBDD")
MINT = colors.HexColor("#35B7A0")


def make_styles():
    """功能：创建中文 PDF 排版样式。

    输入：无。
    输出：包含 title、heading、body 和 note 的样式字典。
    """
    font_path = Path("C:/Windows/Fonts/Deng.ttf")
    if font_path.exists():
        pdfmetrics.registerFont(TTFont("CampusCJK", str(font_path)))
        font_name = "CampusCJK"
    else:
        pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
        font_name = "STSong-Light"
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "CampusTitle",
            parent=base["Title"],
            fontName=font_name,
            fontSize=24,
            leading=32,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=16,
        ),
        "heading": ParagraphStyle(
            "CampusHeading",
            parent=base["Heading2"],
            fontName=font_name,
            fontSize=15,
            leading=22,
            textColor=ORANGE,
            spaceBefore=10,
            spaceAfter=7,
        ),
        "body": ParagraphStyle(
            "CampusBody",
            parent=base["BodyText"],
            fontName=font_name,
            fontSize=10.5,
            leading=18,
            textColor=INK,
            spaceAfter=7,
        ),
        "note": ParagraphStyle(
            "CampusNote",
            parent=base["BodyText"],
            fontName=font_name,
            fontSize=9,
            leading=15,
            textColor=colors.HexColor("#526B67"),
        ),
        "tableHeader": ParagraphStyle(
            "CampusTableHeader",
            parent=base["BodyText"],
            fontName=font_name,
            fontSize=9.5,
            leading=14,
            textColor=colors.white,
        ),
    }


def table_block(rows, widths):
    """功能：创建统一风格的数据表。

    输入：rows 为二维文本数据，widths 为列宽列表。
    输出：已应用表头和网格样式的 Table。
    """
    data = []
    for row_index, row in enumerate(rows):
        style = STYLES["tableHeader"] if row_index == 0 else STYLES["body"]
        data.append([Paragraph(str(cell), style) for cell in row])
    table = Table(data, colWidths=widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), INK),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#B8AD99")),
                ("BACKGROUND", (0, 1), (-1, -1), PAPER),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def build_document(file_name, title, intro, sections):
    """功能：生成一份两页以内的知识库 PDF。

    输入：file_name 为文件名，title 为标题，intro 为摘要，sections 为章节列表。
    输出：PDF 文件路径。
    """
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / file_name
    document = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=18 * mm,
        title=title,
        author="AI校园活动策划团队",
    )
    story = [
        Paragraph(title, STYLES["title"]),
        Paragraph(intro, STYLES["body"]),
        Spacer(1, 5 * mm),
    ]
    for heading, body, rows in sections:
        story.append(Paragraph(heading, STYLES["heading"]))
        story.append(Paragraph(body, STYLES["body"]))
        if rows:
            story.append(table_block(rows, [38 * mm, 48 * mm, 82 * mm]))
            story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("版本：2026-10-27 · 适用范围：校园篮球迎新活动", STYLES["note"]))
    document.build(story)
    return output_path


PDFS = [
    (
        "策划统筹流程.pdf",
        "校园活动策划统筹流程",
        "用于统一策划、竞赛、后勤、安全和宣传组的协作顺序，确保活动从筹备到撤场均有明确责任人。",
        [
            (
                "阶段一：立项与资源确认",
                "确认活动目标、日期、场地、参与规模和预算上限；场地变更必须同步到所有执行群。",
                [
                    ["环节", "责任人", "完成标准"],
                    ["立项确认", "总协调", "目标、预算和日期签字确认"],
                    ["场地检查", "后勤组", "动线、电源、医疗点可用"],
                    ["人员排班", "各组负责人", "岗位与轮休表发布"],
                ],
            ),
            (
                "阶段二：执行与复盘",
                "08:00 前完成签到和场地布置，按赛程推进；突发问题由总协调统一决策。活动结束后 48 小时内完成数据、素材和费用复盘。",
                [],
            ),
        ],
    ),
    (
        "预算标准.pdf",
        "校园活动预算编制标准",
        "预算按必要性、可追溯性和安全优先的原则编制，所有支出必须有类别、用途、责任人和凭证。",
        [
            (
                "预算结构",
                "固定项目优先，预留不少于总预算 5% 的应急预备金。活动前不得将预备金计入已执行支出。",
                [
                    ["类别", "建议占比", "说明"],
                    ["场地与设备", "15%-25%", "场地保障、音响和临时设施"],
                    ["人员与安全", "15%-25%", "裁判、医疗、安全物资"],
                    ["宣传与记录", "10%-20%", "海报、摄影和赛后发布"],
                    ["物资与补给", "20%-30%", "队服、饮水、餐饮"],
                ],
            ),
            (
                "报销规则",
                "所有采购保留订单或发票；临时支出需在活动后一个工作日内补录。预算余量不足时优先削减装饰性支出。",
                [],
            ),
        ],
    ),
    (
        "风险评估标准.pdf",
        "校园活动风险分级标准",
        "风险分数等于发生概率乘以影响程度，两项均按 1-5 分评估。高风险需要活动前闭环确认。",
        [
            (
                "等级规则",
                "分数 15 分及以上为高风险，8-14 分为中风险，7 分及以下为低风险。每个风险必须有责任人和可执行预案。",
                [
                    ["风险类型", "重点检查", "最低要求"],
                    ["天气", "降雨、风力、温度", "确认室内备选地"],
                    ["医疗", "扭伤、碰撞、中暑", "医疗点和急救包"],
                    ["拥挤", "出入口、计分台", "单向动线与隔离"],
                    ["设备", "电源、计分、音响", "备用设备和纸表"],
                ],
            ),
            (
                "升级机制",
                "出现人员伤害、设备失控或场地不可用时，现场负责人立即暂停相关环节，由总协调决定恢复、转移或终止。",
                [],
            ),
        ],
    ),
    (
        "宣传规范.pdf",
        "校园活动宣传执行规范",
        "宣传内容应准确说明时间、地点、报名对象和参与方式，避免夸大效果或使用未经授权的肖像。",
        [
            (
                "发布节奏",
                "活动前 14 天发布报名通知，前 7 天发布赛程与地图，前 1 天确认签到信息，活动当天发布赛果与致谢。",
                [
                    ["时间", "渠道", "核心内容"],
                    ["前 14 天", "学院公众号", "报名规则与队伍召集"],
                    ["前 7 天", "班级群", "赛程、地图与观赛提醒"],
                    ["活动当天", "现场摄影", "赛果、照片与志愿者致谢"],
                ],
            ),
            (
                "审核要求",
                "日期、地点、联系人和赛制由活动负责人核对；涉及个人肖像的素材需取得授权，撤稿请求应及时处理。",
                [],
            ),
        ],
    ),
]


def main():
    """功能：批量生成知识库 PDF。

    输入：无。
    输出：无返回值；成功时打印生成路径。
    """
    for file_name, title, intro, sections in PDFS:
        print(build_document(file_name, title, intro, sections))


STYLES = make_styles()

if __name__ == "__main__":
    main()
