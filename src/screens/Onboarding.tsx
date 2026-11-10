import { useState } from 'react'
import { BTYPES, DISTRICTS, Goal, JOBS, L, SESS, Sess, createBiz, nav, set, useStore, useT } from '../store'
import { Btn, Chip, Field, Icon, Screen } from '../ui'

const BICON: Record<string, string> = { dokon: 'store', kafe: 'clock', toyxona: 'rings', salon: 'star', xizmat: 'bolt', boshqa: 'more' }

export function Onboarding() {
  const s = useStore(); const t = useT()
  const [i, setI] = useState(0)
  const [f, setF] = useState({ name: s.user?.name || '', phone: s.user?.phone || '', birthYear: s.user?.birthYear || 2003, district: s.user?.district || DISTRICTS[0], goals: (s.user ? ['xodim'] : s.door ? [s.door] : []) as Goal[], skills: [] as string[], times: [] as string[], btype: '', bname: '', address: '', hours: '09:00–20:00', inn: '', hall: 'Asosiy zal', cap: 300, from: 70000, to: 120000, sessions: ['tush', 'kech'] as Sess[] })
  const [ver, setVer] = useState(false)
  const up = (p: Partial<typeof f>) => setF({ ...f, ...p })
  const tog = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])
  const steps = [...(s.user ? [] : ['login', 'about', 'goal']), ...(f.goals.includes('ish') ? ['skills'] : []), ...(f.goals.includes('xodim') ? ['btype', 'binfo', 'bverify', ...(f.btype === 'toyxona' ? ['bvenue'] : [])] : [])]
  const step = steps[i]

  const finish = (verified = ver) => {
    if (s.user) set(x => { x.user!.goals = [...new Set([...x.user!.goals, 'xodim' as Goal])]; if (verified) x.user!.myid = true; x.door = null })
    else set(x => { x.user = { name: f.name || 'Mehmon', birthYear: f.birthYear, district: f.district, phone: f.phone || '+998 90 000 00 00', goals: f.goals, skills: f.skills, times: f.times, myid: verified, came: 0, missed: 0 }; x.door = null })
    if (f.goals.includes('xodim')) {
      createBiz({ name: f.bname || 'Mening biznesim', type: f.btype, district: f.district, address: f.address || f.district, hours: f.hours, verified }, f.btype === 'toyxona' ? { hall: f.hall, cap: f.cap, from: f.from, to: f.to, sessions: f.sessions } : undefined)
      nav.reset('bugun')
    } else nav.reset(f.goals.includes('ish') ? 'ish' : 'toy')
  }
  const next = () => (i < steps.length - 1 ? setI(i + 1) : finish())
  const can = step === 'about' ? f.name.trim().length > 1 : step === 'goal' ? f.goals.length > 0 : step === 'btype' ? !!f.btype : step === 'binfo' ? f.bname.trim().length > 1 : true

  return <Screen
    title={<span className="progress">{steps.map((_, k) => <i key={k} className={k <= i ? 'on' : ''} />)}</span>}
    right={i > 0 ? <button className="icon-btn" onClick={() => setI(i - 1)} aria-label="Orqaga"><Icon n="back" /></button> : <button className="icon-btn" onClick={() => (s.user ? nav.back() : nav.reset('root'))} aria-label="Yopish"><Icon n="x" /></button>}
    bottom={step === 'login' || step === 'bverify' ? null : <Btn block disabled={!can} onClick={next}>{i === steps.length - 1 ? t('Tayyor', 'Готово') : t('Davom etish', 'Продолжить')}</Btn>}>

    {step === 'login' && <div className="onb">
      <h2>{t('Xush kelibsiz', 'Добро пожаловать')}</h2>
      <p className="lead">{t('Parol kerak emas. Telegram ism va raqamingizni bir bosishda beradi.', 'Пароль не нужен. Telegram передаст имя и номер в одно нажатие.')}</p>
      <Btn block icon="send" onClick={() => { up({ name: f.name || 'Aziz', phone: '+998 90 123 45 67' }); setI(1) }}>{t('Telegram orqali kirish', 'Войти через Telegram')}</Btn>
      <div className="or">{t('yoki', 'или')}</div>
      <Field label={t('Telefon raqami', 'Номер телефона')}><input inputMode="tel" placeholder="+998 __ ___ __ __" value={f.phone} onChange={e => up({ phone: e.target.value })} /></Field>
      <Btn block kind="soft" disabled={f.phone.replace(/\D/g, '').length < 9} onClick={() => setI(1)}>{t('SMS kod olish', 'Получить SMS-код')}</Btn>
      <p className="note">{t('Namoyish rejimi: kirish va SMS hozircha taqlid qilinadi.', 'Демо-режим: вход и SMS пока имитируются.')}</p>
    </div>}

    {step === 'about' && <div className="onb">
      <h2>{t('O‘zingiz haqingizda', 'О себе')}</h2>
      <Field label={t('Ismingiz', 'Ваше имя')}><input value={f.name} onChange={e => up({ name: e.target.value })} placeholder={t('Masalan, Aziz', 'Например, Азиз')} /></Field>
      <Field label={t('Tug‘ilgan yil', 'Год рождения')} hint={t('Bolalarga ish ko‘rsatmaslik uchun.', 'Чтобы не показывать работу детям.')}><input type="number" min={1950} max={2012} value={f.birthYear} onChange={e => up({ birthYear: +e.target.value })} /></Field>
      <Field label={t('Hudud', 'Район')} hint={t('Faqat Navoiy viloyati.', 'Только Навоийская область.')}><select value={f.district} onChange={e => up({ district: e.target.value })}>{DISTRICTS.map(d => <option key={d}>{d}</option>)}</select></Field>
    </div>}

    {step === 'goal' && <div className="onb">
      <h2>{t('Sizga nima kerak?', 'Что вам нужно?')}</h2>
      <p className="lead">{t('Bir nechtasini tanlash mumkin.', 'Можно выбрать несколько.')}</p>
      {([['ish', 'brief', t('Ish topish', 'Найти работу'), t('Smenalar va doimiy ish', 'Смены и постоянная работа')], ['xodim', 'users', t('Xodim topish', 'Найти сотрудников'), t('Biznesim bor', 'У меня бизнес')], ['toy', 'rings', t('To‘yxona tanlash', 'Выбрать тойхану'), t('To‘y yoki marosim uchun', 'Для свадьбы или торжества')]] as [Goal, string, string, string][]).map(([g, ic, a, b]) =>
        <button key={g} className={`pick ${g}${f.goals.includes(g) ? ' on' : ''}`} aria-pressed={f.goals.includes(g)} onClick={() => up({ goals: tog(f.goals, g) })}><span className="d-ic"><Icon n={ic} /></span><span><b>{a}</b><small>{b}</small></span><span className="tick"><Icon n="check" s={16} /></span></button>)}
    </div>}

    {step === 'skills' && <div className="onb">
      <h2>{t('Kim bo‘lib ishlay olasiz?', 'Кем можете работать?')}</h2>
      <p className="lead">{t('O‘tkazib yuborish mumkin — keyin to‘ldirasiz.', 'Можно пропустить и заполнить позже.')}</p>
      <div className="chips">{Object.entries(JOBS).map(([k, p]) => <Chip key={k} on={f.skills.includes(k)} onClick={() => up({ skills: tog(f.skills, k) })}>{L(p, s.lang)}</Chip>)}</div>
      <h3>{t('Qachon bo‘shsiz?', 'Когда свободны?')}</h3>
      <div className="chips">{[['ert', t('Ertalab', 'Утро')], ['kech', t('Kechqurun', 'Вечер')], ['dam', t('Dam olish kunlari', 'Выходные')]].map(([k, l]) => <Chip key={k} on={f.times.includes(k)} onClick={() => up({ times: tog(f.times, k) })}>{l}</Chip>)}</div>
    </div>}

    {step === 'btype' && <div className="onb">
      <h2>{t('Biznesingiz turi', 'Тип вашего бизнеса')}</h2>
      <p className="lead">{t('Panelingiz shunga moslashadi.', 'От этого зависят модули панели.')}</p>
      <div className="grid2">{Object.entries(BTYPES).map(([k, p]) => <button key={k} className={`tile${f.btype === k ? ' on' : ''}${k === 'toyxona' ? ' toy' : ''}`} aria-pressed={f.btype === k} onClick={() => up({ btype: k })}><Icon n={BICON[k]} s={26} /><b>{L(p, s.lang)}</b></button>)}</div>
    </div>}

    {step === 'binfo' && <div className="onb">
      <h2>{t('Biznes haqida', 'О бизнесе')}</h2>
      <Field label={t('Nomi', 'Название')}><input value={f.bname} onChange={e => up({ bname: e.target.value })} placeholder={t('Masalan, Oila market', 'Например, Oila market')} /></Field>
      <Field label={t('Manzil', 'Адрес')} hint={t('Faqat Navoiy viloyati ichida.', 'Только в границах Навоийской области.')}><input value={f.address} onChange={e => up({ address: e.target.value })} placeholder={t('Ko‘cha, uy', 'Улица, дом')} /></Field>
      <Field label={t('Ish vaqti', 'Часы работы')}><input value={f.hours} onChange={e => up({ hours: e.target.value })} /></Field>
    </div>}

    {step === 'bverify' && <div className="onb">
      <div className="badge-xl"><Icon n="shield" s={34} /></div>
      <h2>{t('Tekshiruvdan o‘ting', 'Пройдите проверку')}</h2>
      <p className="lead">{t('«Tekshirilgan» belgisi bilan vakansiyalaringiz yuqorida turadi va odamlar ko‘proq ishonadi.', 'Со значком «Tekshirilgan» ваши вакансии стоят выше, и люди доверяют больше.')}</p>
      <Field label={t('STIR yoki patent raqami', 'ИНН или номер патента')}><input inputMode="numeric" value={f.inn} onChange={e => up({ inn: e.target.value })} placeholder="_________" /></Field>
      <Btn block icon="shield" disabled={f.inn.replace(/\D/g, '').length < 9} onClick={() => { setVer(true); i < steps.length - 1 ? setI(i + 1) : finish(true) }}>{t('MyID orqali tasdiqlash', 'Подтвердить через MyID')}</Btn>
      <Btn block kind="ghost" onClick={next}>{t('Keyinroq', 'Позже')}</Btn>
      <p className="note">{t('Namoyish rejimi: MyID hozircha taqlid qilinadi.', 'Демо-режим: MyID пока имитируется.')}</p>
    </div>}

    {step === 'bvenue' && <div className="onb">
      <h2 className="serif">{t('To‘yxonangiz', 'Ваша тойхана')}</h2>
      <p className="lead">{t('Oilalar katalogda aynan shuni ko‘radi.', 'Именно это семьи увидят в каталоге.')}</p>
      <div className="row2"><Field label={t('Zal nomi', 'Название зала')}><input value={f.hall} onChange={e => up({ hall: e.target.value })} /></Field><Field label={t('Sig‘imi', 'Вместимость')}><input type="number" value={f.cap} onChange={e => up({ cap: +e.target.value })} /></Field></div>
      <div className="row2"><Field label={t('Narx (dan), so‘m', 'Цена от, сум')}><input type="number" step={5000} value={f.from} onChange={e => up({ from: +e.target.value })} /></Field><Field label={t('Narx (gacha)', 'Цена до')}><input type="number" step={5000} value={f.to} onChange={e => up({ to: +e.target.value })} /></Field></div>
      <h3>{t('Seanslar', 'Сеансы')}</h3>
      <div className="chips">{(Object.keys(SESS) as Sess[]).map(k => <Chip key={k} on={f.sessions.includes(k)} onClick={() => up({ sessions: tog(f.sessions, k) })}>{L(SESS[k], s.lang)}</Chip>)}</div>
      <p className="note">{t('Rasmlar va menyu paketlarini keyin panelda qo‘shasiz.', 'Фото и пакеты меню добавите позже в панели.')}</p>
    </div>}
  </Screen>
}
