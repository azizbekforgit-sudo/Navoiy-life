import { BTYPES, JOBS, L, attendance, myBiz, nav, resetAll, set, useStore, useT } from '../store'
import { Btn, Icon, LangSwitch, Screen, Tag, Trust } from '../ui'
import { VacCard } from './Ish'

export function Profil() {
  const s = useStore(); const t = useT(); const u = s.user!; const b = myBiz(s)
  const att = attendance(u)
  return <Screen title="Men" right={<LangSwitch />}>
    <div className="card prof">
      <span className="ava xl">{u.name[0]}</span>
      <div><b>{u.name}</b><small>{new Date().getFullYear() - u.birthYear} {t('yosh', 'лет')} · {u.district}</small>{u.myid ? <Trust>MyID</Trust> : <Tag>{t('MyID tasdiqlanmagan', 'MyID не подтверждён')}</Tag>}</div>
    </div>
    <div className="card funnel big"><div><b>{att === null ? '—' : att + '%'}</b><small>Davomat</small></div><div><b>{u.came}</b><small>{t('smena', 'смен')}</small></div><div><b>{s.apps.filter(a => a.rated).length}</b><small>{t('baho berdim', 'оценок дал')}</small></div></div>
    {att === null && <p className="note">{t('Birinchi smenadan keyin davomat paydo bo‘ladi. Bu — sizning rezyumengiz.', 'Явка появится после первой смены. Это и есть ваше резюме.')}</p>}
    {u.skills.length > 0 && <><h2 className="sec">{t('Kasblar', 'Профессии')}</h2><div className="chips">{u.skills.map(k => <Tag key={k}>{L(JOBS[k], s.lang)}</Tag>)}</div></>}

    <h2 className="sec">{t('Biznes', 'Бизнес')}</h2>
    {b ? <button className="card menu" onClick={() => { set(x => { x.mode = 'biz' }); nav.reset('bugun') }}><span className="d-ic panel"><Icon n="store" /></span><div><b>{b.name}</b><small>{t('Biznesim rejimiga o‘tish', 'Перейти в режим «Biznesim»')}</small></div><Icon n="right" /></button>
      : <button className="card menu" onClick={() => { set(x => { x.door = 'xodim' }); nav.push('onb') }}><span className="d-ic panel"><Icon n="plus" /></span><div><b>{t('Biznes qo‘shish', 'Добавить бизнес')}</b><small>{t('Vakansiya, davomat, maosh, kassa', 'Вакансии, явка, зарплата, касса')}</small></div><Icon n="right" /></button>}

    <h2 className="sec">{t('Sozlamalar', 'Настройки')}</h2>
    <div className="kv between"><span>{t('Telefon', 'Телефон')}</span><b>{u.phone}</b></div>
    <Btn block kind="ghost" onClick={() => { if (confirm(t('Barcha namoyish ma’lumotlari o‘chadi. Davom etasizmi?', 'Все демо-данные будут стёрты. Продолжить?'))) resetAll() }}>{t('Namoyishni qaytadan boshlash', 'Начать демо заново')}</Btn>
  </Screen>
}

export function BizPage({ id }: { id: string }) {
  const s = useStore(); const t = useT()
  const b = s.bizs.find(x => x.id === id)!
  const vacs = s.vacs.filter(v => v.bizId === id && !v.closed)
  return <Screen back title={b.name} sub={L(BTYPES[b.type] || BTYPES.boshqa, s.lang)}>
    <div className="card trust-card">
      <div>{b.verified ? <Trust>Tekshirilgan ish beruvchi</Trust> : <Tag>{t('Tekshirilmagan', 'Не проверен')}</Tag>}</div>
      {b.paid[1] > 0 ? <div className="paid-big"><Icon n="check" s={18} /><span>{t('Vaqtida to‘lagan', 'Платит вовремя')}: <b>{b.paid[0]} / {b.paid[1]}</b> {t('smena', 'смен')}</span></div> : <small className="muted">{t('Hali smena bo‘lmagan.', 'Смен пока не было.')}</small>}
      <small className="muted">{t('Arizalarga javob', 'Отвечает на заявки')}: {b.resp}%</small>
    </div>
    <div className="kv"><Icon n="pin" s={18} /><span>{b.address}</span></div>
    <div className="kv"><Icon n="clock" s={18} /><span>{b.hours}</span></div>
    <h2 className="sec">{t('Ochiq vakansiyalar', 'Открытые вакансии')}</h2>
    {vacs.length === 0 ? <p className="note">{t('Hozircha ochiq vakansiya yo‘q.', 'Открытых вакансий пока нет.')}</p> : vacs.map(v => <VacCard key={v.id} v={v} />)}
    {b.mine && <p className="note">{t('Odamlar sahifangizni shunday ko‘radi.', 'Так вашу страницу видят люди.')}</p>}
  </Screen>
}
