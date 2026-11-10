import { useState } from 'react'
import { L, SESS, Sess, Venue, dplus, fmtDate, money, nav, sendReq, set, useStore, useT } from '../store'
import { Btn, Chip, Empty, Icon, Screen, Seg, Sheet, Tag, Trust } from '../ui'

export function VenueArt({ v, h = 180, title }: { v: Venue; h?: number; title?: boolean }) {
  return <div className="v-art" style={{ height: h, ['--h' as any]: v.hue }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth=".5">
      {[0, 45].map(r => <rect key={r} x="26" y="26" width="48" height="48" transform={`rotate(${r} 50 50)`} />)}<circle cx="50" cy="50" r="14" /><circle cx="50" cy="50" r="34" />
    </g></svg>
    {title && <span>{v.name}</span>}
  </div>
}
const isFree = (v: Venue, date: string, sess: Sess) => v.sessions.includes(sess) && !v.busy.includes(`${date}|${sess}`)

export function ToySearch() {
  const s = useStore(); const t = useT()
  const q = s.search
  const upd = (p: Partial<typeof q>) => set(x => { Object.assign(x.search, p) })
  const fit = s.venues.filter(v => Math.max(...v.halls.map(h => h.cap)) >= q.guests && isFree(v, q.date, q.session))
  return <Screen accent="toy" title={<span className="serif">To‘ylar</span>} sub={t('Sana bo‘yicha bo‘sh to‘yxonalar', 'Свободные тойханы на вашу дату')}>
    <div className="card search">
      <label className="field"><span>{t('Sana', 'Дата')}</span><input type="date" min={dplus(0)} value={q.date} onChange={e => e.target.value && upd({ date: e.target.value })} /></label>
      <label className="field"><span>{t('Mehmonlar', 'Гости')}</span><div className="chips">{[100, 200, 300, 400, 600].map(n => <Chip key={n} on={q.guests === n} onClick={() => upd({ guests: n })}>{n}</Chip>)}</div></label>
      <label className="field"><span>{t('Seans', 'Сеанс')}</span><Seg value={q.session} onChange={v => upd({ session: v })} options={(Object.keys(SESS) as Sess[]).map(k => [k, L(SESS[k], s.lang)])} /></label>
    </div>
    <h2 className="sec">{fit.length > 0 ? `${fit.length} ${t('ta zal bo‘sh', 'залов свободно')} · ${fmtDate(q.date, s.lang)}` : fmtDate(q.date, s.lang)}</h2>
    {fit.length === 0 && <Empty title={t('Bu sanada bo‘sh zal yo‘q', 'На эту дату свободных залов нет')} text={t('Boshqa seans yoki qo‘shni sanani sinab ko‘ring.', 'Попробуйте другой сеанс или соседнюю дату.')} />}
    {fit.map(v => { const b = s.bizs.find(x => x.id === v.bizId); return <article key={v.id} className="card venue" onClick={() => nav.push('venue', v.id)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && nav.push('venue', v.id)}>
      <VenueArt v={v} title />
      <div className="venue-b">
        <div className="between"><span className="muted">{v.district}</span><Tag tone="ok">{t('Shu sanada bo‘sh', 'Свободно в эту дату')}</Tag></div>
        <div className="between"><span className="pay sm">{t('', 'от ')}{money(v.from, s.lang)}{t(' dan', '')}<small> / {t('mehmon', 'гость')}</small></span><span className="muted">{Math.max(...v.halls.map(h => h.cap))} {t('gacha', 'гостей макс.')}</span></div>
        <div className="row wrap">{b?.verified && <Trust>Tekshirilgan</Trust>}{v.reviews > 0 && <span className="rate"><Icon n="star" s={14} />{v.rating} · {v.reviews}</span>}</div>
      </div>
    </article> })}
  </Screen>
}

export function VenuePage({ id }: { id: string }) {
  const s = useStore(); const t = useT()
  const [sheet, setSheet] = useState(false); const [sent, setSent] = useState(false)
  const v = s.venues.find(x => x.id === id)!; const b = s.bizs.find(x => x.id === v.bizId); const q = s.search
  const days = Array.from({ length: 21 }, (_, i) => dplus(i))
  const free = isFree(v, q.date, q.session)
  const has = s.reqs.find(r => r.venueId === id && r.date === q.date && r.session === q.session)
  return <Screen accent="toy" back title={<span className="serif">{v.name}</span>} sub={v.district}
    bottom={b?.mine ? <p className="note">{t('Bu sizning to‘yxonangiz — oilalar shuni ko‘radi.', 'Это ваша тойхана — так её видят семьи.')}</p> : <div className="row"><a className="btn soft" href={`tel:${v.phone.replace(/\s/g, '')}`} aria-label="Qo‘ng‘iroq"><Icon n="phone" s={20} /></a>
      {has ? <Btn block kind="soft" onClick={() => nav.reset('mine')}>{t('So‘rov yuborilgan', 'Запрос отправлен')}</Btn> : <Btn block disabled={!free} onClick={() => setSheet(true)}>{free ? t('Sanani so‘rash', 'Запросить дату') : t('Bu sana band', 'Эта дата занята')}</Btn>}</div>}>
    <div className="v-hero"><VenueArt v={v} h={230} title /></div>
    <div className="row wrap">{b?.verified && <Trust>Tekshirilgan</Trust>}{v.reviews > 0 && <span className="rate"><Icon n="star" s={14} />{v.rating} · {v.reviews} {t('sharh', 'отзывов')}</span>}</div>

    <h2 className="sec">{t('Bo‘sh sanalar', 'Свободные даты')}</h2>
    <Seg value={q.session} onChange={x => set(st => { st.search.session = x })} options={v.sessions.map(k => [k, L(SESS[k], s.lang)])} />
    <div className="cal">{days.map(d => { const f = isFree(v, d, q.session); return <button key={d} disabled={!f} className={`${f ? 'free' : 'busy'}${d === q.date ? ' on' : ''}`} onClick={() => set(st => { st.search.date = d })}><b>{+d.slice(8)}</b><small>{f ? t('bo‘sh', 'своб.') : t('band', 'занято')}</small></button> })}</div>

    <h2 className="sec">{t('Zallar', 'Залы')}</h2>
    {v.halls.map((h, i) => <div key={i} className="kv between"><span>{L(h.name, s.lang)}</span><b>{h.cap} {t('mehmongacha', 'гостей')}</b></div>)}
    <h2 className="sec">{t('Menyu paketlari', 'Пакеты меню')}</h2>
    {v.menus.map((m, i) => <div key={i} className="kv between"><span>{L(m.name, s.lang)}</span><b className="pay sm">{money(m.price, s.lang)}<small> / {t('mehmon', 'гость')}</small></b></div>)}
    <h2 className="sec">{t('Narxga kiradi', 'Входит в цену')}</h2>
    <div className="chips">{[t('Zal bezagi', 'Оформление зала'), t('Ofitsiantlar', 'Официанты'), t('Idish-tovoq', 'Посуда'), t('Ovoz apparaturasi', 'Звук'), t('Avtoturargoh', 'Парковка')].map(x => <Tag key={x}>{x}</Tag>)}</div>
    <div className="kv"><Icon n="pin" s={18} /><span>{b?.address}</span></div>
    <p className="note">{t('Sharhlarni faqat shu yerda to‘y qilgan oilalar yoza oladi.', 'Отзывы могут оставить только семьи, у которых здесь была бронь.')}</p>

    {sheet && <Sheet title={sent ? t('So‘rov yuborildi', 'Запрос отправлен') : t('Sanani so‘rash', 'Запросить дату')} onClose={() => setSheet(false)}>
      {sent ? <><div className="done"><span><Icon n="check" s={30} /></span><b>{t('To‘yxona odatda 2 soat ichida javob beradi', 'Тойхана обычно отвечает в течение 2 часов')}</b><p>{t('Javob Telegram’ga va «So‘rovlarim»ga keladi.', 'Ответ придёт в Telegram и в «So‘rovlarim».')}</p></div><Btn block onClick={() => nav.reset('mine')}>{t('So‘rovlarimni ochish', 'Открыть мои запросы')}</Btn></>
        : <><div className="summary"><div><small>{t('Sana', 'Дата')}</small><b>{fmtDate(q.date, s.lang)}</b></div><div><small>{t('Seans', 'Сеанс')}</small><b>{L(SESS[q.session], s.lang)}</b></div><div><small>{t('Mehmonlar', 'Гости')}</small><b>{q.guests}</b></div></div>
          <div className="kv"><Icon n="user" s={18} /><span>{s.user!.name} · {s.user!.phone}</span></div>
          <Btn block onClick={() => { sendReq(v.id); setSent(true) }}>{t('So‘rov yuborish', 'Отправить запрос')}</Btn>
          <p className="note">{t('To‘yxona odatda 2 soat ichida javob beradi.', 'Тойхана обычно отвечает в течение 2 часов.')}</p></>}
    </Sheet>}
  </Screen>
}
