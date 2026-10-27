import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';


const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// DEFAULT_BRIEF is the source of truth for all generated deliverables.
export const DEFAULT_BRIEF = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data', 'event-brief.json'), 'utf8'),
);


/**
 * 功能：把概率和影响转换为风险等级。
 * 输入：probability 与 impact 均为 1-5 的整数。
 * 输出：high、medium 或 low。
 */
export function riskLevel(probability, impact) {
  const score = probability * impact;
  if (score >= 15) return 'high';
  if (score >= 8) return 'medium';
  return 'low';
}


/**
 * 功能：生成活动时间表。
 * 输入：brief 为活动基本信息。
 * 输出：包含时间、环节、负责人和要点的数组。
 */
export function buildSchedule(brief = DEFAULT_BRIEF) {
  return [
    { time: '08:00-09:00', item: '签到与场地布置', owner: '后勤组', note: '检录、医疗点、计分台和补给点就位' },
    { time: '09:00-09:30', item: '开幕式', owner: '主持组', note: '学院致辞、规则说明、队伍亮相' },
    { time: '09:30-12:00', item: '小组循环赛', owner: '竞赛组', note: `${brief.teamCount} 支队伍分两组进行循环赛` },
    { time: '12:00-13:30', item: '午间休整', owner: '后勤组', note: '场地检查、设备充电、志愿者轮换' },
    { time: '13:30-15:30', item: '半决赛', owner: '竞赛组', note: '两个小组前两名交叉对阵' },
    { time: '15:30-16:30', item: '决赛与季军赛', owner: '竞赛组', note: '同步记录比分、犯规和暂停' },
    { time: '16:30-17:00', item: '颁奖与合影', owner: '宣传组', note: '颁发冠亚季军与新生风采奖' },
    { time: '17:00-17:30', item: '清点与撤场', owner: '后勤组', note: '回收物资，确认无遗留垃圾' },
  ];
}


/**
 * 功能：生成赛制说明。
 * 输入：brief 为活动基本信息。
 * 输出：赛制对象，包含分组、晋级和比赛规则。
 */
export function buildFormat(brief = DEFAULT_BRIEF) {
  return {
    teamCount: brief.teamCount,
    groups: ['A 组', 'B 组'],
    groupSize: brief.teamCount / 2,
    format: '小组单循环，每组前两名进入半决赛',
    semifinal: 'A1 对 B2，B1 对 A2',
    final: '半决赛胜者争冠，负者进行季军赛',
    gameRule: '每场 2 节，每节 12 分钟，节间休息 3 分钟',
  };
}


/**
 * 功能：生成人员配置。
 * 输入：brief 为活动基本信息。
 * 输出：岗位、人数和职责数组。
 */
export function buildStaffing(brief = DEFAULT_BRIEF) {
  return [
    { role: '总协调', count: 2, duty: '流程调度与跨组决策' },
    { role: '裁判', count: 4, duty: '执裁、计分与记录' },
    { role: '志愿者', count: 12, duty: '检录、补给、引导和场地维护' },
    { role: '医疗与安全', count: 3, duty: '健康观察、应急处理和人员分流' },
    { role: '宣传摄影', count: 4, duty: '素材拍摄、采访和即时发布' },
    { role: '后勤', count: 6, duty: '物资、餐饮、电源与撤场' },
  ];
}


/**
 * 功能：生成预算分类和计划支出。
 * 输入：brief 为活动基本信息，含 budgetCap。
 * 输出：包含明细、总额和预算上限的对象。
 */
export function buildBudget(brief = DEFAULT_BRIEF) {
  const items = [
    { category: '场地保障', purpose: '场地清洁与临时设施', quantity: 1, unitPrice: 1800, owner: '后勤组' },
    { category: '裁判服务', purpose: '4 名裁判全天执裁', quantity: 4, unitPrice: 600, owner: '竞赛组' },
    { category: '奖杯奖牌', purpose: '冠亚季军与个人奖项', quantity: 1, unitPrice: 1800, owner: '竞赛组' },
    { category: '参赛队服', purpose: '8 队 × 12 人纪念队服', quantity: 96, unitPrice: 50, owner: '宣传组' },
    { category: '饮用水', purpose: '运动员、裁判与志愿者补给', quantity: 20, unitPrice: 40, owner: '后勤组' },
    { category: '医疗物资', purpose: '冰袋、绷带与基础急救用品', quantity: 1, unitPrice: 700, owner: '安全组' },
    { category: '宣传物料', purpose: '海报、横幅、指引牌', quantity: 1, unitPrice: 2200, owner: '宣传组' },
    { category: '摄影摄像', purpose: '活动记录与赛后素材整理', quantity: 1, unitPrice: 1500, owner: '宣传组' },
    { category: '志愿者餐饮', purpose: '工作人员午餐与补给', quantity: 31, unitPrice: 40, owner: '后勤组' },
    { category: '音响设备', purpose: '开幕式、播报与颁奖', quantity: 1, unitPrice: 2000, owner: '技术组' },
    { category: '场地布置', purpose: '计分台、队牌与分区标识', quantity: 1, unitPrice: 1800, owner: '后勤组' },
    { category: '应急预备金', purpose: '天气、医疗和临时采购', quantity: 1, unitPrice: 2000, owner: '总协调' },
  ].map((item) => ({ ...item, subtotal: item.quantity * item.unitPrice }));
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  return { items, total, budgetCap: brief.budgetCap, remaining: brief.budgetCap - total };
}


/**
 * 功能：生成风险清单并自动计算风险等级。
 * 输入：brief 为活动基本信息。
 * 输出：按风险分数降序排列的风险数组。
 */
export function buildRisks(brief = DEFAULT_BRIEF) {
  const rows = [
    ['R-01', '天气', '降雨导致场地湿滑', 4, 4, '总协调', '提前确认室内备选场地，雨停后检查地面'],
    ['R-02', '运动伤害', '球员扭伤或碰撞', 4, 4, '安全组', '设置医疗点，每场前检查鞋服与热身情况'],
    ['R-03', '赛程延误', '小组赛超出计划时间', 3, 3, '竞赛组', '每场设置硬截止时间，必要时缩短节间休息'],
    ['R-04', '设备故障', '计分器或音响断电', 3, 3, '技术组', '准备移动电源、备用音箱和纸质计分表'],
    ['R-05', '人员拥挤', '出入口和计分台周边拥堵', 3, 3, '志愿者组', '设置单向动线和观众隔离带'],
    ['R-06', '食品安全', '午餐储存不当', 2, 4, '后勤组', '集中冷藏保存，发放前检查包装与时间'],
    ['R-07', '高温或失温', '天气骤变影响人员状态', 3, 3, '安全组', '准备遮阳与保温物资，定时播报补水'],
    ['R-08', '比赛争议', '判罚或比分记录不一致', 3, 3, '裁判组', '双人记录，争议球由主裁和记录台共同确认'],
    ['R-09', '紧急通道阻塞', '应急车辆无法靠近', 2, 5, '安全组', '预留消防通道并安排专人值守'],
    ['R-10', '报名不足', '部分班级临时缺队', 2, 3, '策划组', '设置联合组队机制，报名截止前每日跟进'],
    ['R-11', '素材风险', '未经同意拍摄并公开肖像', 2, 3, '宣传组', '报名时取得授权，发布前二次核对'],
    ['R-12', '志愿者疲劳', '连续值守导致响应下降', 3, 2, '总协调', '分上午下午两班，保证轮休和饮水'],
  ];
  return rows.map(([id, category, risk, probability, impact, owner, response]) => ({
    id,
    category,
    risk,
    probability,
    impact,
    score: probability * impact,
    level: riskLevel(probability, impact),
    owner,
    response,
  })).sort((a, b) => b.score - a.score);
}


/**
 * 功能：生成宣传主题、文案与发布节奏。
 * 输入：brief 为活动基本信息。
 * 输出：主题、短文案、渠道和时间节点。
 */
export function buildPromotions(brief = DEFAULT_BRIEF) {
  return {
    theme: brief.theme,
    tagline: '新生第一场，从并肩开始',
    announcement: `${brief.organizer}将于 ${brief.date} 在${brief.venue}举办${brief.name}，面向计算机学院 2026 级新生，共 ${brief.teamCount} 支队伍。`,
    messages: [
      { timing: '活动前 14 天', channel: '学院公众号', message: '发布报名规则和队伍召集信息' },
      { timing: '活动前 7 天', channel: '班级群', message: '公布赛程、场地地图和观赛提醒' },
      { timing: '活动前 1 天', channel: '公众号与班级群', message: '确认签到时间、天气和装备要求' },
      { timing: '活动当天', channel: '现场摄影与公众号', message: '发布赛果、照片和志愿者致谢' },
    ],
  };
}


/**
 * 功能：汇总所有专业 Agent 的结构化结果。
 * 输入：brief 为活动基本信息。
 * 输出：完整策划数据对象。
 */
export function buildPlan(brief = DEFAULT_BRIEF) {
  return {
    brief,
    schedule: buildSchedule(brief),
    format: buildFormat(brief),
    staffing: buildStaffing(brief),
    budget: buildBudget(brief),
    risks: buildRisks(brief),
    promotion: buildPromotions(brief),
  };
}
