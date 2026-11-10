import { useState } from 'react'
import { App, L, SESS, Vacancy, answerPaid, applyTo, cancelApp, checkIn, fmtDate, money, nav, PER, rateApp, set, today, useStore, useT } from '../store'
import { Btn, Chip, Empty, Icon, Screen, Sheet, Tag, Trust } from '../ui'

export function VacCard({ v, onBoraman }: { v: Vacancy; onBoraman?: () => void }) {
  const s = useStore(); const t = useT()
  const b = s.bizs.find(x => x.id === v.bizId)!
  const free = v.slots ? v.slots.reduce((a, x) => a + (x.cap - x.taken), 0) : null
  return <article className={`card vac${v.urgent ? ' urgent' : ''}`} onClick={() => nav.push('vac', v.id)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && nav.push('vac', v.id)}>
    <div className="vac-top">
      <span className="pay">{money(v.pay, s.lang)}<small> / {L(PER[v.per], s.lang)}</small></span>
      {v.toy && <Tag tone="toy">{t('To‘y', 'Свадьба')}</Tag>}{v.urgent && <Tag tone="warn">{t('Shoshilinch', 'Срочно')}</Tag>}
    </div>
    <b className="vac-title">{L(v.title, s.lang)}</b>
    <div className="vac-meta"><span>{b.name}</span><span>·</span><span>{v.date ? `${fmtDate(v.date, s.lang)}, ${v.slots?.[0]?.time}` : v.time}</span></div>
    <div className="vac-trust">
      {b.verified && <Trust>Tekshirilgan</Trust>}
      {b.paid[1] > 0 && <span className="paid-line"><Icon n="check" s={14} />{t('Vaqtida to‘lagan', 'Платит вовремя')}: {b.paid[0]} / {b.paid[1]}</span>}
    </div>
    {onBoraman && free! > 0 && <div className="vac-cta" onClick={e => e.stopPropagation()}><span className="muted">{free} {t('ta joy qoldi', 'мест осталось')}</span><Btn sm onClick={onBoraman}>Boraman</Btn></div>}
  </article>
}

export function IshFeed() {
  const s = useStore(); const t = useT()
  const [f, setF] = useState<string>('all')
  const [boraman, setBoraman] = useState<Vacancy | null>(null)
  const list = s.vacs.filter(v => !v.closed).filter(v => {
    const b = s.bizs.find(x => x.id === v.bizId)!
    return f === 'bugun' ? v.date === today() : f === 'yaqin' ? b.district === s.user!.district : f === 'kunlik' ? v.kind === 'smena' : f === 'doimiy' ? v.kind === 'doimiy' : true
  })
  const urgent = list.filter(v => v.urgent && v.date === today())
  const rest = list.filter(v => !urgent.includes(v))
  return <Screen title="Ish" sub={t('Navoiydagi barcha ishlar', 'Вся работа в Навои')}>
    <div className="chips sticky">{[['all', t('Hammasi', 'Все')], ['bugun', 'Bugun'], ['yaqin', 'Yaqin'], ['kunlik', 'Kunlik'], ['doimiy', 'Doimiy']].map(([k, l]) => <Chip key={k} on={f === k} onClick={() => setF(k)}>{l}</Chip>)}</div>
    {urgent.length > 0 && <><h2 className="sec"><Icon n="bolt" s={18} />{t('Shoshilinch bugun', 'Срочно сегодня')}</h2>{urgent.map(v => <VacCard key={v.id} v={v} onBoraman={() => setBoraman(v)} />)}</>}
    {rest.length > 0 && <><h2 className="sec">{t('Barcha ishlar', 'Вся работа')}</h2>{rest.map(v => <VacCard key={v.id} v={v} />)}</>}
    {list.length === 0 ? <Empty title={t('Hozircha bu yerda ish yo‘q', 'Здесь пока нет работы')} text={t('Yangi ish chiqsa, bot xabar beradi.', 'Когда появится новая — бот сообщит.')}><Btn sm kind="soft" onClick={() => setF('all')}>{t('Hammasini ko‘rish', 'Показать все')}</Btn></Empty>
      : <p className="note end">{t('Yangi ish chiqsa, bot xabar beradi.', 'Когда появится новая работа — бот сообщит.')}</p>}
    {boraman && <ApplySheet v={boraman} onClose={() => setBoraman(null)} />}
  </Screen>
}

function ApplySheet({ v, onClose }: { v: Vacancy; onClose: () => void }) {
  const s = useStore(); const t = useT()
  const open = (v.slots || []).filter(x => x.taken < x.cap)
  const [slot, setSlot] = useState(open.length === 1 ? open[0].id : '')
  const [done, setDone] = useState(false)
  const b = s.bizs.find(x => x.id === v.bizId)!
  if (!s.user!.myid) return <Sheet title={t('Avval shaxsingizni tasdiqlang', 'Сначала подтвердите личность')} onClose={onClose}>
    <p className="lead">{t('Bir marta, MyID orqali. Tekshirilganlarni ish beruvchilar birinchi oladi.', 'Один раз, через MyID. Проверенных работодатели берут первыми.')}</p>
    <Btn block icon="shield" onClick={() => set(x => { x.user!.myid = true })}>{t('MyID orqali tasdiqlash', 'Подтвердить через MyID')}</Btn>
    <p className="note">{t('Namoyish rejimi: MyID taqlid qilinadi.', 'Демо-режим: MyID имитируется.')}</p>
  </Sheet>
  if (done) return <Sheet title={v.kind === 'smena' ? 'Boraman!' : t('Ariza yuborildi', 'Заявка отправлена')} onClose={onClose}>
    <div className="done"><span><Icon n="check" s={30} /></span><b>{v.kind === 'smena' ? t('Ish beruvchi sizni kutadi', 'Работодатель вас ждёт') : t('Ish beruvchi profilingizni ko‘radi', 'Работодатель увидит ваш профиль')}</b>
      <p>{v.kind === 'smena' ? `${b.name} · ${fmtDate(v.date!, s.lang)}, ${v.slots!.find(x => x.id === slot)?.time}` : t('Taklif qilsa, telefoningiz ochiladi. Holatni «Arizalarim»da ko‘rasiz.', 'Если пригласит — откроется телефон. Статус — в «Arizalarim».')}</p></div>
    <Btn block onClick={() => { onClose(); nav.reset('mine') }}>{t('Arizalarimni ochish', 'Открыть мои заявки')}</Btn>
  </Sheet>
  if (v.kind === 'doimiy') return <Sheet title={t('Ariza berish', 'Подать заявку')} onClose={onClose}>
    <p className="lead">{t('Profilingiz ish beruvchiga boradi. Telefoningiz faqat u taklif qilganda ochiladi.', 'Ваш профиль уйдёт работодателю. Телефон откроется, только когда он пригласит.')}</p>
    <Btn block onClick={() => { applyTo(v.id); setDone(true) }}>{t('Ariza yuborish', 'Отправить заявку')}</Btn>
  </Sheet>
  const sl = v.slots!.find(x => x.id === slot)
  return <Sheet title={t('Vaqtni tanlang', 'Выберите время')} onClose={onClose}>
    <div className="slots">{v.slots!.map(x => { const full = x.taken >= x.cap; return <button key={x.id} disabled={full} className={`slot${slot === x.id ? ' on' : ''}${full ? ' full' : ''}`} onClick={() => setSlot(x.id)}>
      <b>{fmtDate(v.date!, s.lang)}, {x.time}</b><span>{full ? t('to‘ldi', 'занято') : `${x.cap - x.taken} ${t('ta joy', 'мест')}`}</span></button> })}</div>
    <Btn block disabled={!sl} onClick={() => { applyTo(v.id, slot); setDone(true) }}>{sl ? `Boraman, ${sl.time.split('–')[0]} ${t('da', '')}` : 'Boraman'}</Btn>
    <p className="note warn">{t('Kelmasangiz, davomat foizi tushadi. Bora olmasangiz — oldindan bekor qiling.', 'Не придёте — явка снизится. Не можете — отмените заранее.')}</p>
  </Sheet>
}

export function VacPage({ id }: { id: string }) {
  const s = useStore(); const t = useT()
  const [sheet, setSheet] = useState(false)
  const v = s.vacs.find(x => x.id === id)!; const b = s.bizs.find(x => x.id === v.bizId)!
  const mine = s.apps.find(a => a.vacId === id && a.status !== 'cancelled')
  return <Screen back title={L(v.title, s.lang)} sub={b.name}
    bottom={b.mine ? <p className="note">{t('Bu sizning vakansiyangiz.', 'Это ваша вакансия.')}</p> : mine ? <Btn block kind="soft" onClick={() => nav.reset('mine')}>{t('Arizalarimda ko‘rish', 'Смотреть в моих заявках')}</Btn>
      : <Btn block onClick={() => setSheet(true)}>{v.kind === 'smena' ? 'Boraman' : t('Ariza berish', 'Подать заявку')}</Btn>}>
    <div className="card hero-pay">
      <span className="pay xl">{money(v.pay, s.lang)}</span><span className="muted">/ {L(PER[v.per], s.lang)} · {L(v.payWhen, s.lang)}</span>
      <div className="row wrap">{v.toy && <Tag tone="toy">{t('To‘y', 'Свадьба')}</Tag>}{v.urgent && <Tag tone="warn">{t('Shoshilinch', 'Срочно')}</Tag>}<Tag>{v.date ? fmtDate(v.date, s.lang) : t('Doimiy', 'Постоянная')}</Tag></div>
    </div>
    <button className="card trust-card" onClick={() => nav.push('bizpage', b.id)}>
      <div><b>{b.name}</b>{b.verified ? <Trust>Tekshirilgan</Trust> : <Tag>{t('Tekshirilmagan', 'Не проверен')}</Tag>}</div>
      {b.paid[1] > 0 && <div className="paid-big"><Icon n="check" s={18} /><span>{t('Vaqtida to‘lagan', 'Платит вовремя')}: <b>{b.paid[0]} / {b.paid[1]}</b> {t('smena', 'смен')}</span></div>}
      <small className="muted">{t('Bu raqamni ish beruvchi o‘zgartira olmaydi.', 'Работодатель не может изменить эту цифру.')}</small>
    </button>
    <h2 className="sec">{t('Nima qilish kerak', 'Что делать')}</h2><ul className="bul">{v.duties.map((d, i) => <li key={i}>{L(d, s.lang)}</li>)}</ul>
    {v.reqs.length > 0 && <><h2 className="sec">{t('Talablar', 'Требования')}</h2><ul className="bul">{v.reqs.map((d, i) => <li key={i}>{L(d, s.lang)}</li>)}</ul></>}
    {v.perks.length > 0 && <><h2 className="sec">{t('Nima beriladi', 'Что дают')}</h2><div className="chips">{v.perks.map((d, i) => <Tag key={i} tone="ok">{L(d, s.lang)}</Tag>)}</div></>}
    <h2 className="sec">{t('Vaqt va joy', 'Время и место')}</h2>
    <div className="kv"><Icon n="clock" s={18} /><span>{v.date ? v.slots!.map(x => x.time).join(' · ') : v.time}</span></div>
    <div className="kv"><Icon n="pin" s={18} /><span>{b.address}</span></div>
    {sheet && <ApplySheet v={v} onClose={() => setSheet(false)} />}
  </Screen>
}

const ST: Record<string, [string, string, 'muted' | 'ok' | 'warn' | 'bad' | 'accent']> = {
  sent: ['Yuborildi', 'Отправлена', 'muted'], invited: ['Taklif qilishdi', 'Пригласили', 'ok'], accepted: ['Qabul qilishdi', 'Приняли', 'ok'], rejected: ['To‘g‘ri kelmadi', 'Не подошли', 'bad'],
  booked: ['Yozildingiz', 'Вы записаны', 'accent'], came: ['Keldingiz', 'Вы пришли', 'ok'], paid: ['Yakunlandi', 'Завершена', 'muted'], cancelled: ['Bekor qilindi', 'Отменена', 'muted'],
}

function AppCard({ a }: { a: App }) {
  const s = useStore(); const t = useT()
  const [rate, setRate] = useState(false); const [confirm, setConfirm] = useState(false)
  const v = s.vacs.find(x => x.id === a.vacId)!; const b = s.bizs.find(x => x.id === v.bizId)!
  const st = ST[a.status]
  return <article className="card">
    <div className="between"><b>{L(v.title, s.lang)}</b><Tag tone={st[2]}>{t(st[0], st[1])}</Tag></div>
    <div className="vac-meta"><span>{b.name}</span><span>·</span><span className="pay sm">{money(v.pay, s.lang)}</span></div>
    {a.kind === 'smena' && <div className="kv"><Icon n="clock" s={16} /><span>{fmtDate(v.date!, s.lang)}, {v.slots!.find(x => x.id === a.slotId)?.time}</span></div>}
    {a.status === 'sent' && <p className="note">{t('Ish beruvchi 3 kun ichida javob beradi.', 'Работодатель ответит в течение 3 дней.')}</p>}
    {a.status === 'invited' && <div className="bot"><b>{t('Suhbatga taklif qilishdi', 'Вас пригласили на собеседование')}</b><a className="btn soft block" href={`tel:${b.phone.replace(/\s/g, '')}`}><Icon n="phone" s={18} /><span>{b.phone}</span></a></div>}
    {a.status === 'booked' && <div className="row"><Btn icon="qr" onClick={() => checkIn(a.id)}>{t('Keldim — QR skanerlash', 'Я на месте — сканировать QR')}</Btn><Btn kind="ghost" onClick={() => setConfirm(true)}>{t('Bekor qilish', 'Отменить')}</Btn></div>}
    {a.status === 'came' && <div className="bot"><small>Bandla bot</small><b>{t('Maosh oldingizmi?', 'Вам заплатили?')}</b><div className="row"><Btn sm kind="ok" onClick={() => answerPaid(a.id, 'yes')}>{t('Ha', 'Да')}</Btn><Btn sm kind="soft" onClick={() => answerPaid(a.id, 'part')}>{t('Qisman', 'Частично')}</Btn><Btn sm kind="danger" onClick={() => answerPaid(a.id, 'no')}>{t('Yo‘q', 'Нет')}</Btn></div></div>}
    {a.status === 'paid' && (a.rated ? <p className="note">{t('Baholar 3 kundan keyin ko‘rinadi.', 'Оценки станут видны через 3 дня.')}</p> : <Btn kind="soft" icon="star" onClick={() => setRate(true)}>{t('Ish beruvchini baholash', 'Оценить работодателя')}</Btn>)}
    {confirm && <Sheet title={t('Smenani bekor qilasizmi?', 'Отменить смену?')} onClose={() => setConfirm(false)}><p className="lead">{t('Ish beruvchiga xabar boradi.', 'Работодатель получит сообщение.')}</p><div className="row"><Btn kind="danger" onClick={() => { cancelApp(a.id); setConfirm(false) }}>{t('Ha, bekor qilaman', 'Да, отменяю')}</Btn><Btn kind="soft" onClick={() => setConfirm(false)}>{t('Yo‘q, boraman', 'Нет, приду')}</Btn></div></Sheet>}
    {rate && <RateSheet onClose={() => setRate(false)} onDone={() => { rateApp(a.id); setRate(false) }} />}
  </article>
}

function RateSheet({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const t = useT()
  const Q = [t('Halol to‘lov', 'Честная оплата'), t('E’londagidek', 'Как в вакансии'), t('Muomala', 'Отношение')]
  const [r, setR] = useState<(number | null)[]>([null, null, null])
  return <Sheet title={t('Baholang', 'Оцените')} onClose={onClose}>
    <Btn block kind="soft" icon="star" onClick={() => setR([10, 10, 10])}>Hammasi a’lo</Btn>
    {Q.map((q, i) => <div key={q} className="scale"><span>{q}</span><div>{Array.from({ length: 11 }, (_, n) => <button key={n} className={r[i] === n ? 'on' : ''} onClick={() => setR(r.map((x, k) => (k === i ? n : x)))}>{n}</button>)}</div></div>)}
    <Btn block disabled={r.some(x => x === null)} onClick={onDone}>{t('Yuborish', 'Отправить')}</Btn>
    <p className="note">{t('Baholar 3 kundan keyin ko‘rinadi.', 'Оценки станут видны через 3 дня.')}</p>
  </Sheet>
}

export function Mine() {
  const s = useStore(); const t = useT()
  return <Screen title={t('Mening', 'Мои')} sub={t('Arizalar, smenalar va so‘rovlar', 'Заявки, смены и запросы')}>
    <h2 className="sec">Arizalarim</h2>
    {s.apps.length === 0 ? <Empty title={t('Hali ariza yo‘q', 'Заявок пока нет')} text={t('Ishni tanlang va «Boraman» ni bosing.', 'Выберите работу и нажмите «Boraman».')}><Btn sm onClick={() => nav.reset('ish')}>{t('Ish ko‘rish', 'Смотреть работу')}</Btn></Empty> : s.apps.map(a => <AppCard key={a.id} a={a} />)}
    <h2 className="sec">So‘rovlarim</h2>
    {s.reqs.length === 0 ? <Empty title={t('Hali so‘rov yo‘q', 'Запросов пока нет')} text={t('To‘yxonadan sanani so‘rang.', 'Запросите дату у тойханы.')}><Btn sm kind="soft" onClick={() => nav.reset('toy')}>{t('To‘yxonalar', 'Тойханы')}</Btn></Empty>
      : s.reqs.map(r => { const v = s.venues.find(x => x.id === r.venueId)!; return <article key={r.id} className="card toy-acc">
        <div className="between"><b className="serif">{v.name}</b><Tag tone={r.status === 'free' ? 'ok' : 'muted'}>{r.status === 'sent' ? t('Yuborildi', 'Отправлен') : t('Javob keldi', 'Есть ответ')}</Tag></div>
        <div className="vac-meta"><span>{fmtDate(r.date, s.lang)}</span><span>·</span><span>{L(SESS[r.session], s.lang)}</span><span>·</span><span>{r.guests} {t('mehmon', 'гостей')}</span></div>
        {r.status === 'sent' ? <p className="note">{t('To‘yxona odatda 2 soat ichida javob beradi.', 'Тойхана обычно отвечает в течение 2 часов.')}</p>
          : <div className="bot"><b>{t('Bo‘sh, ko‘rishga keling', 'Свободно, приходите посмотреть')}</b><a className="btn soft block" href={`tel:${v.phone.replace(/\s/g, '')}`}><Icon n="phone" s={18} /><span>{v.phone}</span></a></div>}
      </article> })}
  </Screen>
}
