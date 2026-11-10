import { useSyncExternalStore } from 'react'

/* ---------- types ---------- */
export type Lang = 'uz' | 'ru'
export type P = [string, string] // [uz, ru]
export type Goal = 'ish' | 'xodim' | 'toy'
export type Sess = 'ert' | 'tush' | 'kech'

export interface User { name: string; birthYear: number; district: string; phone: string; goals: Goal[]; skills: string[]; times: string[]; myid: boolean; came: number; missed: number }
export interface Biz { id: string; name: string; type: string; district: string; address: string; hours: string; phone: string; verified: boolean; paid: [number, number]; resp: number; mine?: boolean; plan?: string }
export interface Slot { id: string; time: string; cap: number; taken: number }
export interface Vacancy { id: string; bizId: string; title: P; pay: number; per: 'smena' | 'kun' | 'oy'; kind: 'smena' | 'doimiy'; date?: string; time?: string; slots?: Slot[]; duties: P[]; reqs: P[]; perks: P[]; payWhen: P; urgent?: boolean; toy?: boolean; views?: number; closed?: boolean }
export interface App { id: string; vacId: string; kind: 'ariza' | 'smena'; slotId?: string; status: 'sent' | 'invited' | 'accepted' | 'rejected' | 'booked' | 'came' | 'paid' | 'cancelled'; paid?: 'yes' | 'part' | 'no'; rated?: boolean; ts: number }
export interface Cand { id: string; vacId: string; name: string; age: number; district: string; att: number; shifts: number; before?: boolean; phone: string; status: 'new' | 'invited' | 'accepted' | 'rejected' }
export interface Staff { id: string; name: string; role: P; rate: number; per: 'smena' | 'kun' | 'oy'; phone: string; time: string; came: number; advance: number; today?: 'came' | 'absent' }
export interface Kassa { id: string; type: 'in' | 'out'; amount: number; note: string; date: string }
export interface Venue { id: string; bizId: string; name: string; district: string; phone: string; halls: { name: P; cap: number }[]; from: number; to: number; sessions: Sess[]; rating: number; reviews: number; busy: string[]; menus: { name: P; price: number }[]; hue: number }
export interface Req { id: string; venueId: string; date: string; session: Sess; guests: number; status: 'sent' | 'free' | 'busy'; ts: number }
export interface InReq { id: string; family: string; phone: string; date: string; session: Sess; guests: number; status: 'new' | 'free' | 'busy' | 'booked' }
export interface Booking { id: string; family: string; phone: string; date: string; session: Sess; guests: number; menu: P; total: number; deposit: number; staffed?: boolean }

export interface State {
  lang: Lang; mode: 'me' | 'biz'; user: User | null; door: Goal | null
  bizs: Biz[]; vacs: Vacancy[]; apps: App[]; cands: Cand[]; staff: Staff[]; kassa: Kassa[]
  venues: Venue[]; reqs: Req[]; inReqs: InReq[]; bookings: Booking[]
  search: { date: string; guests: number; session: Sess }
}

/* ---------- helpers ---------- */
const pad = (n: number) => String(n).padStart(2, '0')
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const today = () => iso(new Date())
export const dplus = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d) }
const MON: P[] = [['yanvar', 'января'], ['fevral', 'февраля'], ['mart', 'марта'], ['aprel', 'апреля'], ['may', 'мая'], ['iyun', 'июня'], ['iyul', 'июля'], ['avgust', 'августа'], ['sentabr', 'сентября'], ['oktabr', 'октября'], ['noyabr', 'ноября'], ['dekabr', 'декабря']]
export function fmtDate(d: string, lang: Lang) {
  if (d === today()) return lang === 'ru' ? 'сегодня' : 'bugun'
  if (d === dplus(1)) return lang === 'ru' ? 'завтра' : 'ertaga'
  const [, m, day] = d.split('-').map(Number)
  return lang === 'ru' ? `${day} ${MON[m - 1][1]}` : `${day}-${MON[m - 1][0]}`
}
export const num = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
export const money = (n: number, lang: Lang) => `${num(n)} ${lang === 'ru' ? 'сум' : 'so‘m'}`
export const uid = () => Math.random().toString(36).slice(2, 9)

export const DISTRICTS = ['Navoiy shahri', 'Karmana', 'Zarafshon', 'Qiziltepa', 'Navbahor', 'Xatirchi', 'Konimex', 'Nurota', 'Uchquduq', 'Tomdi', 'G‘ozg‘on']
export const JOBS: Record<string, P> = {
  ofitsiant: ['Ofitsiant', 'Официант'], sotuvchi: ['Sotuvchi-kassir', 'Продавец-кассир'], oshpaz: ['Oshpaz', 'Повар'], oshyor: ['Oshpaz yordamchisi', 'Помощник повара'],
  barista: ['Barista', 'Бариста'], farrosh: ['Farrosh', 'Уборщица'], yuk: ['Yuk tashuvchi', 'Грузчик'], haydovchi: ['Haydovchi', 'Водитель'], admin: ['Administrator', 'Администратор'], kuryer: ['Kuryer', 'Курьер'],
}
export const BTYPES: Record<string, P> = {
  dokon: ['Do‘kon', 'Магазин'], kafe: ['Kafe yoki restoran', 'Кафе или ресторан'], toyxona: ['To‘yxona', 'Тойхана'],
  salon: ['Go‘zallik saloni', 'Салон красоты'], xizmat: ['Xizmat yoki ustaxona', 'Услуги или мастерская'], boshqa: ['Boshqa', 'Другое'],
}
export const SESS: Record<Sess, P> = { ert: ['Ertalab', 'Утро'], tush: ['Tushlik', 'Обед'], kech: ['Kechki', 'Вечер'] }
export const PER: Record<string, P> = { smena: ['smena', 'смену'], kun: ['kun', 'день'], oy: ['oy', 'месяц'] }

/* ---------- seed ---------- */
const MENUS = (a: number, b: number, c: number) => [{ name: ['Standart', 'Стандарт'] as P, price: a }, { name: ['Bayram', 'Праздничный'] as P, price: b }, { name: ['Shohona', 'Премиум'] as P, price: c }]
function seed(): State {
  return {
    lang: 'uz', mode: 'me', user: null, door: null,
    bizs: [
      { id: 'b1', name: 'Zarafshon kafe', type: 'kafe', district: 'Navoiy shahri', address: 'G‘alaba shoh ko‘chasi, 12', hours: '08:00–23:00', phone: '+998 79 223 10 10', verified: true, paid: [47, 48], resp: 92 },
      { id: 'b2', name: 'Oila market', type: 'dokon', district: 'Karmana', address: 'Karmana, Navoiy ko‘chasi, 48', hours: '07:00–22:00', phone: '+998 79 224 20 20', verified: true, paid: [31, 31], resp: 88 },
      { id: 'b3', name: 'Registon to‘yxonasi', type: 'toyxona', district: 'Navoiy shahri', address: 'Xalqlar do‘stligi ko‘chasi, 5', hours: '09:00–23:00', phone: '+998 79 225 30 30', verified: true, paid: [112, 115], resp: 95 },
      { id: 'b4', name: 'Gul go‘zallik saloni', type: 'salon', district: 'Navoiy shahri', address: 'Navoiy ko‘chasi, 27', hours: '09:00–20:00', phone: '+998 79 226 40 40', verified: false, paid: [6, 7], resp: 60 },
      { id: 'b5', name: 'Navro‘z saroyi', type: 'toyxona', district: 'Karmana', address: 'Karmana, Buxoro yo‘li, 3', hours: '09:00–23:00', phone: '+998 79 227 50 50', verified: true, paid: [64, 64], resp: 90 },
    ],
    vacs: [
      { id: 'v1', bizId: 'b3', title: JOBS.ofitsiant, pay: 150000, per: 'smena', kind: 'smena', date: today(), slots: [{ id: 's1', time: '17:00–23:00', cap: 8, taken: 5 }], duties: [['To‘yda mehmonlarga xizmat qilish', 'Обслуживание гостей на свадьбе'], ['Stollarni tayyorlash va yig‘ishtirish', 'Сервировка и уборка столов']], reqs: [['Tajriba shart emas', 'Опыт не нужен'], ['18 yoshdan', 'От 18 лет']], perks: [['Ovqat', 'Питание'], ['Forma beriladi', 'Форма выдаётся']], payWhen: ['Smena oxirida, naqd', 'В конце смены, наличными'], urgent: true, toy: true },
      { id: 'v6', bizId: 'b2', title: JOBS.yuk, pay: 100000, per: 'smena', kind: 'smena', date: today(), slots: [{ id: 's1', time: '15:00–19:00', cap: 2, taken: 0 }], duties: [['Mashinadan tovar tushirish', 'Разгрузка товара из машины']], reqs: [['18 yoshdan', 'От 18 лет']], perks: [], payWhen: ['Smena oxirida, naqd', 'В конце смены, наличными'], urgent: true },
      { id: 'v3', bizId: 'b1', title: JOBS.barista, pay: 120000, per: 'smena', kind: 'smena', date: dplus(1), slots: [{ id: 's1', time: '08:00–14:00', cap: 1, taken: 0 }, { id: 's2', time: '14:00–20:00', cap: 1, taken: 1 }], duties: [['Qahva tayyorlash, kassa', 'Приготовление кофе, касса'], ['Ish joyini toza tutish', 'Чистота рабочего места']], reqs: [['O‘rgatamiz', 'Научим']], perks: [['Ovqat', 'Питание'], ['O‘qitish', 'Обучение']], payWhen: ['Smena oxirida, kartaga', 'В конце смены, на карту'] },
      { id: 'v2', bizId: 'b2', title: JOBS.sotuvchi, pay: 3500000, per: 'oy', kind: 'doimiy', time: '08:00–17:00, 6/1', duties: [['Xaridorlarga xizmat, kassa', 'Обслуживание покупателей, касса'], ['Tovarni joylash', 'Выкладка товара']], reqs: [['O‘zbek va rus tili', 'Узбекский и русский'], ['Tajriba — afzallik', 'Опыт — преимущество']], perks: [['Rasmiylashtirish', 'Официальное оформление'], ['Ovqat', 'Питание']], payWhen: ['Oyda ikki marta, kartaga', 'Два раза в месяц, на карту'] },
      { id: 'v4', bizId: 'b5', title: JOBS.oshyor, pay: 180000, per: 'smena', kind: 'smena', date: dplus(2), slots: [{ id: 's1', time: '10:00–18:00', cap: 3, taken: 1 }], duties: [['Sabzavot to‘g‘rash, oshpazga yordam', 'Нарезка, помощь повару']], reqs: [['Sanitariya daftarchasi', 'Санитарная книжка']], perks: [['Ovqat', 'Питание']], payWhen: ['Smena oxirida, naqd', 'В конце смены, наличными'], toy: true },
      { id: 'v5', bizId: 'b4', title: JOBS.admin, pay: 2800000, per: 'oy', kind: 'doimiy', time: '09:00–18:00, 5/2', duties: [['Mijozlarni yozish, qo‘ng‘iroqlar', 'Запись клиентов, звонки']], reqs: [['Muloyim muomala', 'Вежливость']], perks: [['O‘qitish', 'Обучение']], payWhen: ['Oyda bir marta', 'Раз в месяц'] },
    ],
    apps: [], cands: [], staff: [], kassa: [],
    venues: [
      { id: 't1', bizId: 'b3', name: 'Registon', district: 'Navoiy shahri', phone: '+998 79 225 30 30', halls: [{ name: ['Katta zal', 'Большой зал'], cap: 600 }, { name: ['Kichik zal', 'Малый зал'], cap: 200 }], from: 75000, to: 140000, sessions: ['ert', 'tush', 'kech'], rating: 4.8, reviews: 36, busy: [`${dplus(3)}|kech`, `${dplus(5)}|kech`, `${dplus(6)}|tush`, `${dplus(10)}|kech`], menus: MENUS(75000, 105000, 140000), hue: 328 },
      { id: 't2', bizId: 'b5', name: 'Navro‘z saroyi', district: 'Karmana', phone: '+998 79 227 50 50', halls: [{ name: ['Asosiy zal', 'Основной зал'], cap: 450 }], from: 60000, to: 110000, sessions: ['tush', 'kech'], rating: 4.6, reviews: 21, busy: [`${dplus(4)}|kech`, `${dplus(5)}|kech`, `${dplus(11)}|kech`], menus: MENUS(60000, 85000, 110000), hue: 18 },
      { id: 't3', bizId: 'b3', name: 'Oltin Vodiy', district: 'Navoiy shahri', phone: '+998 79 228 60 60', halls: [{ name: ['Oltin zal', 'Золотой зал'], cap: 800 }, { name: ['VIP zal', 'VIP-зал'], cap: 120 }], from: 90000, to: 180000, sessions: ['ert', 'tush', 'kech'], rating: 4.9, reviews: 52, busy: [`${dplus(2)}|kech`, `${dplus(3)}|kech`, `${dplus(5)}|kech`, `${dplus(6)}|kech`, `${dplus(7)}|kech`], menus: MENUS(90000, 130000, 180000), hue: 42 },
      { id: 't4', bizId: 'b5', name: 'Baxt', district: 'Zarafshon', phone: '+998 79 229 70 70', halls: [{ name: ['Zal', 'Зал'], cap: 300 }], from: 55000, to: 95000, sessions: ['tush', 'kech'], rating: 4.4, reviews: 12, busy: [`${dplus(5)}|kech`], menus: MENUS(55000, 75000, 95000), hue: 205 },
      { id: 't5', bizId: 'b3', name: 'Dilkusho', district: 'Navoiy shahri', phone: '+998 79 230 80 80', halls: [{ name: ['Zal', 'Зал'], cap: 350 }], from: 65000, to: 120000, sessions: ['ert', 'tush', 'kech'], rating: 4.7, reviews: 28, busy: [`${dplus(3)}|kech`, `${dplus(9)}|kech`], menus: MENUS(65000, 90000, 120000), hue: 268 },
    ],
    reqs: [], inReqs: [], bookings: [],
    search: { date: dplus(5), guests: 300, session: 'kech' },
  }
}

/* ---------- store ---------- */
const KEY = 'bandla-v1'
function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s: State = JSON.parse(raw)
      const t = today()
      s.vacs.forEach(v => { if (v.date && v.date < t) v.date = t })
      if (s.search.date < t) s.search.date = dplus(5)
      s.apps.forEach(a => { if (a.kind === 'ariza' && a.status === 'sent') a.status = 'invited' })
      s.reqs.forEach(r => { if (r.status === 'sent') r.status = 'free' })
      return s
    }
  } catch { /* storage unavailable */ }
  return seed()
}
let state = load()
const subs = new Set<() => void>()
export function set(fn: (s: State) => void) {
  const next: State = JSON.parse(JSON.stringify(state))
  fn(next); state = next
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
  subs.forEach(f => f())
}
export const get = () => state
const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }
export const useStore = () => useSyncExternalStore(subscribe, get)
export function useT() { const lang = useStore().lang; return (uz: string, ru: string) => (lang === 'ru' ? ru : uz) }
export const L = (p: P, lang: Lang) => p[lang === 'ru' ? 1 : 0]
export function resetAll() { try { localStorage.removeItem(KEY) } catch { /* ignore */ } state = seed(); subs.forEach(f => f()); nav.reset('root') }
const later = (ms: number, fn: (s: State) => void) => setTimeout(() => set(fn), ms)

/* ---------- navigation ---------- */
export interface Route { n: string; p?: any }
let stack: Route[] = [{ n: 'root' }]
const nsubs = new Set<() => void>()
const emit = () => { nsubs.forEach(f => f()); window.scrollTo(0, 0) }
export const nav = {
  push(n: string, p?: any) { stack = [...stack, { n, p }]; emit() },
  back() { if (stack.length > 1) { stack = stack.slice(0, -1); emit() } },
  reset(n: string, p?: any) { stack = [{ n, p }]; emit() },
}
export const useNav = () => useSyncExternalStore(f => { nsubs.add(f); return () => { nsubs.delete(f) } }, () => stack)

/* ---------- selectors ---------- */
export const myBiz = (s: State) => s.bizs.find(b => b.mine)
export const myVenue = (s: State) => { const b = myBiz(s); return b && s.venues.find(v => v.bizId === b.id) }
export const attendance = (u: User) => (u.came + u.missed === 0 ? null : Math.round((u.came / (u.came + u.missed)) * 100))

/* ---------- actions: worker ---------- */
export function applyTo(vacId: string, slotId?: string) {
  const id = uid()
  set(s => {
    const v = s.vacs.find(x => x.id === vacId)!
    if (slotId) { const sl = v.slots!.find(x => x.id === slotId)!; sl.taken++ }
    s.apps.unshift({ id, vacId, kind: slotId ? 'smena' : 'ariza', slotId, status: slotId ? 'booked' : 'sent', ts: Date.now() })
  })
  if (!slotId) later(4000, s => { const a = s.apps.find(x => x.id === id); if (a && a.status === 'sent') a.status = 'invited' })
}
export function cancelApp(id: string) {
  set(s => { const a = s.apps.find(x => x.id === id)!; a.status = 'cancelled'; const v = s.vacs.find(x => x.id === a.vacId); const sl = v?.slots?.find(x => x.id === a.slotId); if (sl && sl.taken > 0) sl.taken-- })
}
export function checkIn(id: string) { set(s => { s.apps.find(x => x.id === id)!.status = 'came'; s.user!.came++ }) }
export function answerPaid(id: string, ans: 'yes' | 'part' | 'no') {
  set(s => { const a = s.apps.find(x => x.id === id)!; a.status = 'paid'; a.paid = ans; const b = s.bizs.find(x => x.id === s.vacs.find(v => v.id === a.vacId)!.bizId)!; b.paid[1]++; if (ans === 'yes') b.paid[0]++ })
}
export function rateApp(id: string) { set(s => { s.apps.find(x => x.id === id)!.rated = true }) }

/* ---------- actions: family ---------- */
export function sendReq(venueId: string) {
  const id = uid()
  set(s => { s.reqs.unshift({ id, venueId, ...s.search, status: 'sent', ts: Date.now() }) })
  later(4500, s => { const r = s.reqs.find(x => x.id === id); if (r && r.status === 'sent') r.status = 'free' })
}

/* ---------- actions: owner ---------- */
export function createBiz(b: { name: string; type: string; district: string; address: string; hours: string; verified: boolean }, venue?: { hall: string; cap: number; from: number; to: number; sessions: Sess[] }) {
  set(s => {
    const phone = s.user!.phone
    s.bizs.push({ id: 'me', ...b, phone, paid: [0, 0], resp: 100, mine: true, plan: 'free' })
    s.staff = [
      { id: uid(), name: 'Dilnoza Karimova', role: JOBS.sotuvchi, rate: 3200000, per: 'oy', phone: '+998 90 111 22 33', time: '08:00–17:00', came: 18, advance: 800000 },
      { id: uid(), name: 'Jasur Toshev', role: JOBS.yuk, rate: 110000, per: 'smena', phone: '+998 91 444 55 66', time: '09:00–15:00', came: 11, advance: 300000 },
    ]
    s.kassa = [
      { id: uid(), type: 'in', amount: 2400000, note: 'Savdo', date: today() },
      { id: uid(), type: 'out', amount: 650000, note: 'Tovar', date: today() },
      { id: uid(), type: 'in', amount: 3100000, note: 'Savdo', date: dplus(-1) },
      { id: uid(), type: 'out', amount: 400000, note: 'Ijara', date: dplus(-1) },
    ]
    if (venue) {
      s.venues.unshift({ id: 'tm', bizId: 'me', name: b.name, district: b.district, phone, halls: [{ name: [venue.hall, venue.hall], cap: venue.cap }], from: venue.from, to: venue.to, sessions: venue.sessions, rating: 0, reviews: 0, busy: [`${dplus(8)}|kech`], menus: MENUS(venue.from, Math.round((venue.from + venue.to) / 2000) * 1000, venue.to), hue: 328 })
      s.inReqs = [
        { id: uid(), family: 'Rahimovlar oilasi', phone: '+998 93 700 11 22', date: dplus(12), session: 'kech', guests: Math.min(300, venue.cap), status: 'new' },
        { id: uid(), family: 'Sobir aka', phone: '+998 94 300 44 55', date: dplus(8), session: 'kech', guests: Math.min(250, venue.cap), status: 'new' },
      ]
      s.bookings = [{ id: uid(), family: 'Yo‘ldoshevlar oilasi', phone: '+998 97 123 45 67', date: dplus(8), session: 'kech', guests: Math.min(280, venue.cap), menu: ['Bayram', 'Праздничный'], total: Math.min(280, venue.cap) * venue.from, deposit: 5000000 }]
    }
    s.mode = 'biz'
  })
}
const DEMO_CANDS = [
  { name: 'Aziza Nurmatova', age: 21, district: 'Navoiy shahri', att: 96, shifts: 23, before: true, phone: '+998 90 555 01 01' },
  { name: 'Bekzod Rajabov', age: 19, district: 'Karmana', att: 88, shifts: 8, phone: '+998 91 555 02 02' },
  { name: 'Madina Yusupova', age: 24, district: 'Navoiy shahri', att: 100, shifts: 5, phone: '+998 93 555 03 03' },
]
export function publishVac(v: Omit<Vacancy, 'id' | 'bizId'>) {
  const id = uid()
  set(s => { s.vacs.unshift({ ...v, id, bizId: 'me', views: 0 }) })
  later(3500, s => { const vac = s.vacs.find(x => x.id === id); if (!vac) return; vac.views = 14; DEMO_CANDS.slice(0, 2).forEach(c => s.cands.push({ ...c, id: uid(), vacId: id, status: 'new' })) })
  return id
}
export function setCand(id: string, status: Cand['status']) {
  set(s => {
    const c = s.cands.find(x => x.id === id)!; c.status = status
    if (status === 'accepted') { const v = s.vacs.find(x => x.id === c.vacId)!; s.staff.push({ id: uid(), name: c.name, role: v.title, rate: v.pay, per: v.per, phone: c.phone, time: v.time || v.slots?.[0]?.time || '09:00–18:00', came: 0, advance: 0 }) }
  })
}
export function markStaff(id: string, m: 'came' | 'absent') { set(s => { const p = s.staff.find(x => x.id === id)!; if (p.today === 'came') p.came--; p.today = m; if (m === 'came') p.came++ }) }
export function giveAdvance(id: string, amount: number) { set(s => { s.staff.find(x => x.id === id)!.advance += amount; s.kassa.unshift({ id: uid(), type: 'out', amount, note: 'Avans', date: today() }) }) }
export function addKassa(type: 'in' | 'out', amount: number, note: string) { set(s => { s.kassa.unshift({ id: uid(), type, amount, note, date: today() }) }) }
export const accrued = (p: Staff) => (p.per === 'oy' ? Math.round((p.rate / 26) * p.came) : p.rate * p.came)

/* ---------- actions: venue owner ---------- */
export function answerInReq(id: string, status: 'free' | 'busy') { set(s => { s.inReqs.find(x => x.id === id)!.status = status }) }
export function bookInReq(id: string, deposit: number) {
  set(s => {
    const r = s.inReqs.find(x => x.id === id)!; r.status = 'booked'
    const v = s.venues.find(x => x.id === 'tm')!
    s.bookings.unshift({ id: uid(), family: r.family, phone: r.phone, date: r.date, session: r.session, guests: r.guests, menu: v.menus[0].name, total: r.guests * v.from, deposit })
    v.busy.push(`${r.date}|${r.session}`)
    if (deposit) s.kassa.unshift({ id: uid(), type: 'in', amount: deposit, note: 'Zaklad', date: today() })
  })
}
const SESS_TIME: Record<Sess, string> = { ert: '06:00–11:00', tush: '11:00–16:00', kech: '17:00–23:00' }
export function staffBooking(id: string, count: number, pay: number) {
  set(s => {
    const b = s.bookings.find(x => x.id === id)!; b.staffed = true
    s.vacs.unshift({ id: uid(), bizId: 'me', title: JOBS.ofitsiant, pay, per: 'smena', kind: 'smena', date: b.date, slots: [{ id: 's1', time: SESS_TIME[b.session], cap: count, taken: 0 }], duties: [['To‘yda mehmonlarga xizmat qilish', 'Обслуживание гостей на свадьбе'], ['Stollarni tayyorlash va yig‘ishtirish', 'Сервировка и уборка столов']], reqs: [['18 yoshdan', 'От 18 лет']], perks: [['Ovqat', 'Питание']], payWhen: ['Smena oxirida, naqd', 'В конце смены, наличными'], toy: true, views: 0 })
  })
}
export function setPlan(plan: string) { set(s => { myBiz(s)!.plan = plan }) }
