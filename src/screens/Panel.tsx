import { useRef, useState } from 'react'
import { JOBS, L, P, PER, SESS, accrued, addKassa, answerInReq, bookInReq, dplus, fmtDate, giveAdvance, markStaff, money, myBiz, myVenue, nav, num, publishVac, set, setCand, setPlan, staffBooking, today, useStore, useT } from '../store'
import { Btn, Chip, Empty, Field, Icon, Screen, Seg, Sheet, Tag } from '../ui'

/* ---------- Bugun ---------- */
export function Bugun() {
  const s = useStore(); const t = useT()
  const b = myBiz(s)!; const venue = myVenue(s)
  const newC = s.cands.filter(c => c.status === 'new').length
  const newR = s.inReqs.filter(r => r.status === 'new').length
  const unmarked = s.staff.filter(p => !p.today).length
  const tk = s.kassa.filter(k => k.date === today())
  const inn = tk.filter(k => k.type === 'in').reduce((a, k) => a + k.amount, 0), out = tk.filter(k => k.type === 'out').reduce((a, k) => a + k.amount, 0)
  const todayToy = s.bookings.filter(x => x.date === today())
  return <Screen accent="panel" title="Bugun" sub={b.name} right={<button className="icon-btn" onClick={() => nav.push('newvac')} aria-label="Yangi vakansiya"><Icon n="plus" /></button>}>
    {(newC > 0 || newR > 0 || unmarked > 0) && <h2 className="sec">{t('Sizni kutmoqda', 'Ждут вашего действия')}</h2>}
    {newC > 0 && <button className="card act" onClick={() => nav.reset('vacs')}><span className="n">{newC}</span><div><b>{t('Yangi nomzodlar', 'Новые кандидаты')}</b><small>{t('3 kun javobsiz qolsa, ariza yopiladi', 'Без ответа 3 дня — заявка закроется')}</small></div><Icon n="right" /></button>}
    {newR > 0 && <button className="card act toy" onClick={() => nav.reset('btoy')}><span className="n">{newR}</span><div><b>{t('Sana so‘rovlari', 'Запросы дат')}</b><small>{t('Oilalar javob kutmoqda', 'Семьи ждут ответа')}</small></div><Icon n="right" /></button>}
    {unmarked > 0 && <button className="card act" onClick={() => nav.reset('staff')}><span className="n">{unmarked}</span><div><b>{t('Davomat belgilanmagan', 'Не отмечена явка')}</b><small>{t('Kim keldi, kim kelmadi', 'Кто пришёл, кто нет')}</small></div><Icon n="right" /></button>}

    <h2 className="sec">{t('Bugungi kassa', 'Касса за день')}</h2>
    <button className="card kassa-card" onClick={() => nav.push('kassa')}>
      <div><small>{t('Kirim', 'Приход')}</small><b className="pos">+{num(inn)}</b></div><div><small>{t('Chiqim', 'Расход')}</small><b className="neg">−{num(out)}</b></div><div><small>{t('Qoldi', 'Итог')}</small><b>{num(inn - out)}</b></div>
    </button>

    {venue && <><h2 className="sec">{t('Bugungi to‘ylar', 'Свадьбы сегодня')}</h2>{todayToy.length === 0 ? <p className="note">{t('Bugun to‘y yo‘q.', 'Сегодня свадеб нет.')}</p> : todayToy.map(x => <div key={x.id} className="card"><b>{x.family}</b><span className="muted">{L(SESS[x.session], s.lang)} · {x.guests} {t('mehmon', 'гостей')}</span></div>)}</>}

    <h2 className="sec">{t('Bugun ishda', 'Сегодня на смене')}</h2>
    {s.staff.map(p => <div key={p.id} className="card person"><div><b>{p.name}</b><small>{L(p.role, s.lang)} · {p.time}</small></div>{p.today ? <Tag tone={p.today === 'came' ? 'ok' : 'bad'}>{p.today === 'came' ? 'Keldi' : 'Kelmadi'}</Tag> : <Tag>—</Tag>}</div>)}

    <Btn block kind="soft" icon="mic" onClick={() => nav.push('newvac')}>{t('Ovozli vakansiya', 'Вакансия голосом')}</Btn>
  </Screen>
}

/* ---------- Vacancies ---------- */
export function Vacs() {
  const s = useStore(); const t = useT()
  const mine = s.vacs.filter(v => v.bizId === 'me')
  return <Screen accent="panel" title="Vakansiyalar" sub={t('E’lonlar va nomzodlar', 'Объявления и кандидаты')} right={<button className="icon-btn" onClick={() => nav.push('newvac')} aria-label="Yangi"><Icon n="plus" /></button>}>
    {mine.length === 0 && <Empty title={t('Hali vakansiya yo‘q', 'Вакансий пока нет')} text={t('Ayting — biz maydonlarga joylaymiz.', 'Скажите — мы разложим по полям.')}><Btn sm icon="mic" onClick={() => nav.push('newvac')}>{t('Vakansiya qo‘shish', 'Добавить вакансию')}</Btn></Empty>}
    {mine.map(v => { const cs = s.cands.filter(c => c.vacId === v.id); const nw = cs.filter(c => c.status === 'new').length; return <article key={v.id} className="card">
      <div className="between"><b>{L(v.title, s.lang)}</b>{v.toy && <Tag tone="toy">{t('To‘y', 'Свадьба')}</Tag>}</div>
      <span className="pay sm">{money(v.pay, s.lang)}<small> / {L(PER[v.per], s.lang)}</small></span>
      <div className="funnel"><div><b>{v.views || 0}</b><small>{t('ko‘rildi', 'просмотров')}</small></div><div><b>{cs.length}</b><small>{t('nomzod', 'кандидатов')}</small></div><div><b>{cs.filter(c => c.status === 'accepted').length}</b><small>{t('qabul', 'принято')}</small></div></div>
      {cs.length === 0 ? <p className="note">{t('Nomzodlar kelishi bilan bot xabar beradi.', 'Как только появятся кандидаты — бот сообщит.')}</p> : <Btn block kind={nw ? 'primary' : 'soft'} onClick={() => nav.push('cands', v.id)}>{nw ? `${nw} ${t('ta yangi nomzod', 'новых кандидатов')}` : t('Nomzodlarni ko‘rish', 'Смотреть кандидатов')}</Btn>}
    </article> })}
  </Screen>
}

const WORDS: [RegExp, string][] = [[/ofitsiant|официант/i, 'ofitsiant'], [/sotuvchi|kassir|продав|кассир/i, 'sotuvchi'], [/yordamchi|помощник/i, 'oshyor'], [/oshpaz|повар/i, 'oshpaz'], [/barista|бариста/i, 'barista'], [/farrosh|уборщи/i, 'farrosh'], [/yuk|грузчик/i, 'yuk'], [/haydovchi|водител/i, 'haydovchi'], [/administrator|администратор/i, 'admin'], [/kuryer|курьер/i, 'kuryer']]
function parseVoice(txt: string) {
  const job = WORDS.find(([r]) => r.test(txt))?.[1]
  const m = txt.replace(/(\d)\s+(?=\d{3})/g, '$1').match(/(\d+(?:[.,]\d+)?)\s*(ming|тыс|mln|million|млн)?/i)
  let pay = 0
  if (m) { pay = parseFloat(m[1].replace(',', '.')); if (/mln|million|млн/i.test(m[2] || '')) pay *= 1e6; else if (/ming|тыс/i.test(m[2] || '') || pay < 10000) pay *= 1000 }
  const time = /kech|вечер/i.test(txt) ? '18:00–23:00' : /ertalab|утр/i.test(txt) ? '08:00–14:00' : ''
  const monthly = /oyiga|oylik|в месяц|doimiy|постоян/i.test(txt) || pay >= 1e6
  return { job, pay, time, monthly }
}

export function NewVac() {
  const s = useStore(); const t = useT()
  const [job, setJob] = useState(''); const [pay, setPay] = useState(0); const [kind, setKind] = useState<'smena' | 'doimiy'>('smena')
  const [date, setDate] = useState(today()); const [time, setTime] = useState('18:00–23:00'); const [cap, setCap] = useState(1); const [urgent, setUrgent] = useState(false)
  const [said, setSaid] = useState(''); const [listening, setListening] = useState(false); const [err, setErr] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  const apply = (txt: string) => { setSaid(txt); const r = parseVoice(txt); if (r.job) setJob(r.job); if (r.pay) setPay(r.pay); if (r.time) setTime(r.time); setKind(r.monthly ? 'doimiy' : 'smena') }
  const mic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { ref.current?.focus(); return }
    const r = new SR(); r.lang = s.lang === 'ru' ? 'ru-RU' : 'uz-UZ'; r.onresult = (e: any) => apply(e.results[0][0].transcript); r.onend = () => setListening(false); r.onerror = () => { setListening(false); ref.current?.focus() }
    setListening(true); r.start()
  }
  const save = () => {
    if (!pay) { setErr(true); return }
    publishVac({ title: JOBS[job], pay, per: kind === 'doimiy' ? 'oy' : 'smena', kind, date: kind === 'smena' ? date : undefined, time: kind === 'doimiy' ? time : undefined, slots: kind === 'smena' ? [{ id: 's1', time, cap, taken: 0 }] : undefined, duties: [['Asosiy vazifalar joyida tushuntiriladi', 'Основные обязанности объяснят на месте']], reqs: [], perks: [], payWhen: kind === 'smena' ? ['Smena oxirida', 'В конце смены'] : ['Oyda ikki marta', 'Два раза в месяц'], urgent: urgent && kind === 'smena' && date === today() })
    nav.reset('vacs')
  }
  return <Screen accent="panel" back title={t('Yangi vakansiya', 'Новая вакансия')} bottom={<Btn block disabled={!job} onClick={save}>{t('E’lon qilish', 'Опубликовать')}</Btn>}>
    <div className="card voice">
      <button className={`mic${listening ? ' live' : ''}`} onClick={mic} aria-label={t('Ovoz bilan aytish', 'Сказать голосом')}><Icon n="mic" s={28} /></button>
      <div><b>{listening ? t('Tinglayapman…', 'Слушаю…') : t('Ayting yoki yozing', 'Скажите или напишите')}</b>
        <textarea ref={ref} rows={2} value={said} onChange={e => apply(e.target.value)} placeholder={t('«Kechki smenaga ofitsiant kerak, 150 ming»', '«Нужен официант на вечер, 150 тысяч»')} /></div>
    </div>
    <h2 className="sec">{t('Tekshiring', 'Проверьте')}</h2>
    <Field label={t('Lavozim', 'Должность')}><div className="chips">{Object.entries(JOBS).map(([k, p]) => <Chip key={k} on={job === k} onClick={() => setJob(k)}>{L(p as P, s.lang)}</Chip>)}</div></Field>
    <Seg value={kind} onChange={setKind} options={[['smena', t('Smena', 'Смена')], ['doimiy', t('Doimiy ish', 'Постоянная')]]} />
    <Field label={`${t('Maosh', 'Зарплата')}, ${t('so‘m', 'сум')} / ${kind === 'smena' ? t('smena', 'смену') : t('oy', 'месяц')}`} hint={err && !pay ? t('Maoshni yozing. Maoshsiz vakansiyani e’lon qilib bo‘lmaydi.', 'Укажите зарплату. Без неё вакансию не опубликовать.') : undefined}>
      <input className={err && !pay ? 'bad' : ''} inputMode="numeric" value={pay ? num(pay) : ''} onChange={e => setPay(+e.target.value.replace(/\D/g, ''))} placeholder="150 000" /></Field>
    {kind === 'smena' && <div className="row2"><Field label={t('Sana', 'Дата')}><input type="date" min={today()} value={date} onChange={e => setDate(e.target.value || today())} /></Field><Field label={t('Necha kishi', 'Сколько людей')}><input type="number" min={1} value={cap} onChange={e => setCap(Math.max(1, +e.target.value))} /></Field></div>}
    <Field label={t('Vaqt', 'Время')}><input value={time} onChange={e => setTime(e.target.value)} /></Field>
    {kind === 'smena' && date === today() && <label className="check"><input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} /><span><b>Shoshilinch</b><small>{t('Lentaning tepasiga chiqadi · 15 000 so‘m, hozir bepul', 'Поднимется наверх ленты · 15 000 сум, сейчас бесплатно')}</small></span></label>}
  </Screen>
}

export function Cands({ id }: { id: string }) {
  const s = useStore(); const t = useT()
  const v = s.vacs.find(x => x.id === id)!
  const list = s.cands.filter(c => c.vacId === id).sort((a, b) => +!!b.before - +!!a.before)
  return <Screen accent="panel" back title="Nomzodlar" sub={L(v.title, s.lang)}>
    {list.map(c => <article key={c.id} className="card cand">
      <div className="between"><div className="who"><span className="ava">{c.name[0]}</span><div><b>{c.name}</b><small>{c.age} {t('yosh', 'лет')} · {c.district}</small></div></div>{c.before && <Tag tone="accent">{t('Sizda ishlagan', 'Работал у вас')}</Tag>}</div>
      <div className="funnel"><div><b>{c.att}%</b><small>Davomat</small></div><div><b>{c.shifts}</b><small>{t('smena', 'смен')}</small></div><div><b>MyID</b><small>{t('tasdiqlangan', 'подтверждён')}</small></div></div>
      {c.status === 'new' && <div className="row"><Btn sm kind="ok" onClick={() => setCand(c.id, 'accepted')}>Qabul</Btn><Btn sm kind="soft" onClick={() => setCand(c.id, 'invited')}>Suhbatga</Btn><Btn sm kind="ghost" onClick={() => setCand(c.id, 'rejected')}>Rad</Btn></div>}
      {c.status === 'invited' && <><a className="btn soft block" href={`tel:${c.phone.replace(/\s/g, '')}`}><Icon n="phone" s={18} /><span>{c.phone}</span></a><div className="row"><Btn sm kind="ok" onClick={() => setCand(c.id, 'accepted')}>Qabul</Btn><Btn sm kind="ghost" onClick={() => setCand(c.id, 'rejected')}>Rad</Btn></div></>}
      {c.status === 'accepted' && <Tag tone="ok">{t('Qabul qilindi — «Xodimlar»da', 'Принят — уже в «Xodimlar»')}</Tag>}
      {c.status === 'rejected' && <Tag>{t('Rad etildi', 'Отказ')}</Tag>}
    </article>)}
  </Screen>
}

/* ---------- Staff: list / attendance / pay ---------- */
export function StaffTab() {
  const s = useStore(); const t = useT()
  const [tab, setTab] = useState<'dav' | 'maosh' | 'list'>('dav')
  const [absent, setAbsent] = useState<string | null>(null); const [adv, setAdv] = useState<string | null>(null); const [sum, setSum] = useState(0)
  const pa = s.staff.find(p => p.id === absent), pv = s.staff.find(p => p.id === adv)
  return <Screen accent="panel" title="Xodimlar" sub={`${s.staff.length} ${t('kishi', 'человек')}`}>
    <Seg value={tab} onChange={setTab} options={[['dav', 'Davomat'], ['maosh', 'Maosh'], ['list', t('Ro‘yxat', 'Список')]]} />
    {s.staff.length === 0 && <Empty title={t('Hali xodim yo‘q', 'Сотрудников пока нет')} text={t('Qabul qilingan nomzod shu yerda paydo bo‘ladi.', 'Принятый кандидат появится здесь сам.')} />}
    {tab === 'dav' && s.staff.map(p => <article key={p.id} className="card">
      <div className="between"><div><b>{p.name}</b><br /><small className="muted">{p.time}</small></div>{p.today && <Tag tone={p.today === 'came' ? 'ok' : 'bad'}>{p.today === 'came' ? 'Keldi' : 'Kelmadi'}</Tag>}</div>
      <div className="row"><Btn sm kind={p.today === 'came' ? 'ok' : 'soft'} icon="check" onClick={() => markStaff(p.id, 'came')}>Keldi</Btn><Btn sm kind={p.today === 'absent' ? 'danger' : 'ghost'} onClick={() => setAbsent(p.id)}>Kelmadi</Btn></div>
    </article>)}
    {tab === 'maosh' && s.staff.map(p => { const a = accrued(p); return <article key={p.id} className="card">
      <div className="between"><b>{p.name}</b><small className="muted">{p.came} {t('smena', 'смен')}</small></div>
      <div className="funnel"><div><b>{num(a)}</b><small>{t('hisoblandi', 'начислено')}</small></div><div><b>{num(p.advance)}</b><small>avans</small></div><div><b className={a - p.advance < 0 ? 'neg' : 'pos'}>{num(a - p.advance)}</b><small>{t('qoldi', 'осталось')}</small></div></div>
      <Btn sm kind="soft" icon="wallet" onClick={() => { setAdv(p.id); setSum(0) }}>{t('Avans berish', 'Выдать аванс')}</Btn>
    </article> })}
    {tab === 'maosh' && s.staff.length > 0 && <p className="note">{t('Xodim xuddi shu raqamlarni o‘zida ko‘radi — bahs kamayadi.', 'Сотрудник видит у себя те же цифры — споров меньше.')}</p>}
    {tab === 'list' && s.staff.map(p => <article key={p.id} className="card person"><div><b>{p.name}</b><small>{L(p.role, s.lang)} · {money(p.rate, s.lang)} / {L(PER[p.per], s.lang)}</small></div><a className="icon-btn" href={`tel:${p.phone.replace(/\s/g, '')}`} aria-label={p.phone}><Icon n="phone" /></a></article>)}
    {pa && <Sheet title={`${pa.name.split(' ')[0]} ${t('kelmadimi?', 'не пришёл?')}`} onClose={() => setAbsent(null)}><p className="lead">{t('Bu uning davomatini pasaytiradi.', 'Это снизит его явку.')}</p><div className="row"><Btn kind="danger" onClick={() => { markStaff(pa.id, 'absent'); setAbsent(null) }}>{t('Ha, kelmadi', 'Да, не пришёл')}</Btn><Btn kind="soft" onClick={() => setAbsent(null)}>{t('Orqaga', 'Назад')}</Btn></div></Sheet>}
    {pv && <Sheet title={`Avans · ${pv.name}`} onClose={() => setAdv(null)}><Field label={t('Summa, so‘m', 'Сумма, сум')}><input autoFocus inputMode="numeric" value={sum ? num(sum) : ''} onChange={e => setSum(+e.target.value.replace(/\D/g, ''))} placeholder="200 000" /></Field><div className="chips">{[100000, 200000, 500000].map(n => <Chip key={n} onClick={() => setSum(n)}>{num(n)}</Chip>)}</div><Btn block disabled={!sum} onClick={() => { giveAdvance(pv.id, sum); setAdv(null) }}>{t('Berildi', 'Выдано')}</Btn><p className="note">{t('Kassaga chiqim bo‘lib yoziladi.', 'Запишется в кассу как расход.')}</p></Sheet>}
  </Screen>
}

/* ---------- More / Kassa / Tariffs ---------- */
export function More() {
  const s = useStore(); const t = useT(); const b = myBiz(s)!
  const items: [string, string, string, string][] = [['kassa', 'wallet', 'Kassa daftari', t('Kunlik kirim va chiqim', 'Приход и расход за день')], ['bizpage', 'store', 'Sahifa', t('Odamlar ko‘radigan sahifa', 'Страница, которую видят люди')], ['tarif', 'star', 'Tariflar', t('Obuna va xizmatlar', 'Подписка и услуги')]]
  return <Screen accent="panel" title={t('Yana', 'Ещё')} sub={b.name}>
    {items.map(([r, ic, a, d]) => <button key={r} className="card menu" onClick={() => nav.push(r, r === 'bizpage' ? b.id : undefined)}><span className="d-ic"><Icon n={ic} /></span><div><b>{a}</b><small>{d}</small></div><Icon n="right" /></button>)}
    {[['Nasiya daftari', t('Xaridorlar qarzi', 'Долги покупателей')], ['Menejerlar', t('Administratorga ruxsat', 'Доступ администратору')]].map(([a, d]) => <div key={a} className="card menu soon"><span className="d-ic"><Icon n="clock" /></span><div><b>{a}</b><small>{d}</small></div><Tag>{t('Tez orada', 'Скоро')}</Tag></div>)}
    <Btn block kind="ghost" icon="user" onClick={() => { set(x => { x.mode = 'me' }); nav.reset('ish') }}>{t('Shaxsiy rejimga o‘tish', 'Перейти в личный режим')}</Btn>
  </Screen>
}

export function KassaPage() {
  const s = useStore(); const t = useT()
  const [type, setType] = useState<'in' | 'out' | null>(null); const [sum, setSum] = useState(0); const [note, setNote] = useState('')
  const tot = (list: typeof s.kassa, ty: string) => list.filter(k => k.type === ty).reduce((a, k) => a + k.amount, 0)
  const td = s.kassa.filter(k => k.date === today()); const mon = s.kassa.filter(k => k.date.slice(0, 7) === today().slice(0, 7))
  const days = [...new Set(s.kassa.map(k => k.date))].sort().reverse()
  const NOTES = type === 'in' ? [t('Savdo', 'Продажи'), t('Xizmat', 'Услуга'), t('Zaklad', 'Задаток')] : [t('Tovar', 'Товар'), t('Ijara', 'Аренда'), t('Maosh', 'Зарплата'), t('Kommunal', 'Коммуналка')]
  return <Screen accent="panel" back title="Kassa daftari" bottom={<div className="row"><Btn block kind="ok" icon="plus" onClick={() => { setType('in'); setSum(0); setNote('') }}>{t('Kirim', 'Приход')}</Btn><Btn block kind="danger" onClick={() => { setType('out'); setSum(0); setNote('') }}>− {t('Chiqim', 'Расход')}</Btn></div>}>
    <div className="card kassa-card big"><div><small>{t('Bugun', 'Сегодня')}</small><b>{num(tot(td, 'in') - tot(td, 'out'))}</b></div><div><small>{t('Shu oy', 'За месяц')}</small><b>{num(tot(mon, 'in') - tot(mon, 'out'))}</b></div></div>
    {days.map(d => <div key={d}><h2 className="sec">{fmtDate(d, s.lang)}</h2>{s.kassa.filter(k => k.date === d).map(k => <div key={k.id} className="kv between"><span>{k.note}</span><b className={k.type === 'in' ? 'pos' : 'neg'}>{k.type === 'in' ? '+' : '−'}{num(k.amount)}</b></div>)}</div>)}
    {type && <Sheet title={type === 'in' ? t('Kirim', 'Приход') : t('Chiqim', 'Расход')} onClose={() => setType(null)}>
      <Field label={t('Summa, so‘m', 'Сумма, сум')}><input autoFocus inputMode="numeric" value={sum ? num(sum) : ''} onChange={e => setSum(+e.target.value.replace(/\D/g, ''))} placeholder="0" /></Field>
      <div className="chips">{NOTES.map(n => <Chip key={n} on={note === n} onClick={() => setNote(n)}>{n}</Chip>)}</div>
      <Btn block disabled={!sum} onClick={() => { addKassa(type, sum, note || NOTES[0]); setType(null) }}>{t('Yozish', 'Записать')}</Btn>
    </Sheet>}
  </Screen>
}

export function Tarif() {
  const s = useStore(); const t = useT(); const b = myBiz(s)!
  const venue = b.type === 'toyxona'
  const plans: { id: string; name: string; price: string; items: string[]; toy?: boolean }[] = [
    { id: 'free', name: t('Boshlang‘ich', 'Стартовый'), price: t('Bepul', 'Бесплатно'), items: [t('Sahifa va «Tekshirilgan» belgisi', 'Страница и значок «Tekshirilgan»'), t('2 ta faol vakansiya', '2 активные вакансии'), t('3 xodimgacha: davomat va maosh', 'До 3 сотрудников: явка и зарплата'), 'Kassa daftari'] },
    { id: 'biznes', name: 'Biznes', price: `99 000 ${t('so‘m / oy', 'сум / мес')}`, items: [t('Cheksiz vakansiyalar', 'Вакансии без лимита'), t('Cheksiz xodimlar va jadval', 'Сотрудники и график без лимита'), t('Oyiga 3 ta «Shoshilinch»', '3 «Срочно» в месяц'), t('Nasiya daftari va menejerlar', 'Долговая тетрадь и менеджеры')] },
    ...(venue ? [{ id: 'toyxona', name: 'To‘yxona', price: `299 000 ${t('so‘m / oy', 'сум / мес')}`, toy: true, items: [t('«Biznes»dagi hammasi', 'Всё из «Biznes»'), t('Kalendar, so‘rovlar va bronlar', 'Календарь, запросы и брони'), t('Katalogda yuqori o‘rin', 'Выше в каталоге'), t('To‘y uchun xodim — bir bosishda', 'Люди на свадьбу — в одно нажатие')] }] : []),
  ]
  return <Screen accent="panel" back title="Tariflar" sub={t('Birinchi 3 oy hammasi bepul', 'Первые 3 месяца всё бесплатно')}>
    {plans.map(p => <article key={p.id} className={`card plan${b.plan === p.id ? ' on' : ''}${p.toy ? ' toy-acc' : ''}`}>
      <div className="between"><b className={p.toy ? 'serif' : ''}>{p.name}</b>{b.plan === p.id && <Tag tone="ok">{t('Joriy', 'Текущий')}</Tag>}</div>
      <span className="pay sm">{p.price}</span>
      <ul className="bul tick">{p.items.map(i => <li key={i}>{i}</li>)}</ul>
      {b.plan !== p.id && <Btn block kind={p.id === 'free' ? 'ghost' : 'primary'} onClick={() => setPlan(p.id)}>{t('Tanlash', 'Выбрать')}</Btn>}
    </article>)}
    <div className="card"><div className="between"><b>Shoshilinch</b><span className="pay sm">15 000 {t('so‘m', 'сум')}</span></div><small className="muted">{t('Bir martalik: smena lentaning tepasiga chiqadi va yaqin atrofdagi ishonchli odamlarga yuboriladi.', 'Разово: смена поднимается наверх ленты и рассылается надёжным людям рядом.')}</small></div>
    <p className="note">{t('Ish qidiruvchilar va oilalar uchun Bandla doim bepul. To‘lov — Click yoki Payme (namoyishda o‘chirilgan).', 'Для соискателей и семей Bandla бесплатна всегда. Оплата — Click или Payme (в демо отключена).')}</p>
  </Screen>
}

/* ---------- Venue module ---------- */
export function BToy() {
  const s = useStore(); const t = useT(); const v = myVenue(s)!
  const [tab, setTab] = useState<'req' | 'book' | 'cal'>('req')
  const [book, setBook] = useState<string | null>(null); const [dep, setDep] = useState(0)
  const [staff, setStaff] = useState<string | null>(null); const [cnt, setCnt] = useState(8); const [pay, setPay] = useState(150000)
  const sb = s.bookings.find(x => x.id === staff)
  const days = Array.from({ length: 21 }, (_, i) => dplus(i))
  return <Screen accent="toy" title={<span className="serif">To‘yxona</span>} sub={v.name}>
    <Seg value={tab} onChange={setTab} options={[['req', `So‘rovlar${s.inReqs.filter(r => r.status === 'new').length ? ' · ' + s.inReqs.filter(r => r.status === 'new').length : ''}`], ['book', 'Bronlar'], ['cal', 'Kalendar']]} />
    {tab === 'req' && (s.inReqs.length === 0 ? <Empty title={t('Hozircha so‘rov yo‘q', 'Запросов пока нет')} /> : s.inReqs.map(r => { const clash = v.busy.includes(`${r.date}|${r.session}`) && r.status !== 'booked'; return <article key={r.id} className="card">
      <div className="between"><b>{r.family}</b><Tag tone={r.status === 'new' ? 'warn' : r.status === 'booked' ? 'ok' : 'muted'}>{r.status === 'new' ? t('Yangi', 'Новый') : r.status === 'free' ? t('Ko‘rishga chaqirildi', 'Приглашены на просмотр') : r.status === 'busy' ? t('Band deyildi', 'Отвечено: занято') : t('Bron qilindi', 'Забронировано')}</Tag></div>
      <div className="vac-meta"><span>{fmtDate(r.date, s.lang)}</span><span>·</span><span>{L(SESS[r.session], s.lang)}</span><span>·</span><span>{r.guests} {t('mehmon', 'гостей')}</span></div>
      {clash && <p className="note warn">{t('Bu sana kalendarda band.', 'Эта дата в календаре занята.')}</p>}
      {r.status === 'new' && <div className="row"><Btn sm kind="ok" disabled={clash} onClick={() => answerInReq(r.id, 'free')}>{t('Bo‘sh, ko‘rishga keling', 'Свободно, приходите')}</Btn><Btn sm kind="ghost" onClick={() => answerInReq(r.id, 'busy')}>{t('Band', 'Занято')}</Btn></div>}
      {r.status === 'free' && <div className="row"><a className="btn soft sm" href={`tel:${r.phone.replace(/\s/g, '')}`}><Icon n="phone" s={16} /><span>{r.phone}</span></a><Btn sm onClick={() => { setBook(r.id); setDep(0) }}>{t('Bron qilish', 'Забронировать')}</Btn></div>}
      {r.status === 'busy' && <p className="note">{t('Ilova oilaga qo‘shni bo‘sh sanalarni taklif qildi.', 'Приложение предложило семье соседние свободные даты.')}</p>}
    </article> }))}
    {tab === 'book' && (s.bookings.length === 0 ? <Empty title={t('Hali bron yo‘q', 'Броней пока нет')} /> : s.bookings.map(b => <article key={b.id} className="card toy-acc">
      <div className="between"><b>{b.family}</b><span className="muted">{fmtDate(b.date, s.lang)} · {L(SESS[b.session], s.lang)}</span></div>
      <div className="funnel"><div><b>{b.guests}</b><small>{t('mehmon', 'гостей')}</small></div><div><b>{num(b.deposit)}</b><small>{t('zaklad', 'задаток')}</small></div><div><b>{num(b.total - b.deposit)}</b><small>{t('qoldi', 'остаток')}</small></div></div>
      {b.staffed ? <Tag tone="ok">{t('Smena e’lon qilindi — «Ish» lentasida', 'Смена опубликована — в ленте «Ish»')}</Tag> : <Btn block icon="users" onClick={() => { setStaff(b.id); setCnt(Math.max(2, Math.round(b.guests / 35))) }}>{t('To‘y uchun xodim', 'Люди на свадьбу')}</Btn>}
    </article>))}
    {tab === 'cal' && <>{v.sessions.map(se => <div key={se}><h2 className="sec">{L(SESS[se], s.lang)}</h2><div className="cal">{days.map(d => { const key = `${d}|${se}`; const busy = v.busy.includes(key); const booked = s.bookings.some(b => b.date === d && b.session === se); return <button key={d} disabled={booked} className={busy ? 'busy' : 'free'} onClick={() => set(x => { const vv = x.venues.find(y => y.id === 'tm')!; vv.busy = busy ? vv.busy.filter(k => k !== key) : [...vv.busy, key] })}><b>{+d.slice(8)}</b><small>{booked ? 'bron' : busy ? t('band', 'занято') : t('bo‘sh', 'своб.')}</small></button> })}</div></div>)}<p className="note">{t('Sanani bosib band yoki bo‘sh qiling. Bo‘sh sanalar katalogda darhol ko‘rinadi.', 'Нажмите на дату, чтобы занять или освободить. Свободные даты сразу видны в каталоге.')}</p></>}

    {book && <Sheet title={t('Bron qilish', 'Забронировать')} onClose={() => setBook(null)}><Field label={t('Zaklad, so‘m', 'Задаток, сум')}><input autoFocus inputMode="numeric" value={dep ? num(dep) : ''} onChange={e => setDep(+e.target.value.replace(/\D/g, ''))} placeholder="5 000 000" /></Field><Btn block onClick={() => { bookInReq(book, dep); setBook(null); setTab('book') }}>{t('Tasdiqlash', 'Подтвердить')}</Btn><p className="note">{t('Sana kalendarda o‘zi band bo‘ladi.', 'Дата сама займётся в календаре.')}</p></Sheet>}
    {sb && <Sheet title={t('To‘y uchun xodim', 'Люди на свадьбу')} onClose={() => setStaff(null)}>
      <div className="summary"><div><small>{t('Sana', 'Дата')}</small><b>{fmtDate(sb.date, s.lang)}</b></div><div><small>{t('Seans', 'Сеанс')}</small><b>{L(SESS[sb.session], s.lang)}</b></div><div><small>{t('Mehmonlar', 'Гости')}</small><b>{sb.guests}</b></div></div>
      <div className="row2"><Field label={t('Ofitsiantlar soni', 'Официантов')}><input type="number" min={1} value={cnt} onChange={e => setCnt(Math.max(1, +e.target.value))} /></Field><Field label={t('Stavka, so‘m', 'Ставка, сум')}><input inputMode="numeric" value={num(pay)} onChange={e => setPay(+e.target.value.replace(/\D/g, ''))} /></Field></div>
      <Btn block disabled={!pay} onClick={() => { staffBooking(sb.id, cnt, pay); setStaff(null) }}>{t('Smenani e’lon qilish', 'Опубликовать смену')}</Btn>
      <p className="note">{t('Avval o‘zingizning tekshirilgan ishchilaringiz ko‘radi, keyin hamma.', 'Сначала её увидят ваши проверенные работники, потом все.')}</p>
    </Sheet>}
  </Screen>
}
