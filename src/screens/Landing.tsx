import { useState } from 'react'
import { Goal, L, money, nav, set, useStore, useT } from '../store'
import { Btn, Icon, LangSwitch, Seg, Trust } from '../ui'
import { VenueArt } from './Toylar'

export function Landing() {
  const s = useStore(); const t = useT()
  const [how, setHow] = useState<Goal>('ish')
  const go = (door: Goal | null) => { set(x => { x.door = door }); nav.push('onb') }
  const HOW: Record<Goal, [string, string][]> = {
    ish: [[t('Ishni tanlang', 'Выберите работу'), t('Maosh har doim birinchi qatorda.', 'Зарплата всегда в первой строке.')], [t('«Boraman» ni bosing', 'Нажмите «Boraman»'), t('Vaqtni tanlang — joy sizniki.', 'Выберите время — место ваше.')], [t('Keling va pulingizni oling', 'Придите и получите деньги'), t('Har smena profilingizni kuchaytiradi.', 'Каждая смена усиливает ваш профиль.')]],
    xodim: [[t('Vakansiyani ayting', 'Продиктуйте вакансию'), t('Ovoz bilan — bir daqiqada.', 'Голосом — за минуту.')], [t('Nomzodlarni ko‘ring', 'Смотрите кандидатов'), t('Davomati va smenalari ko‘rinadi.', 'Видны явка и число смен.')], [t('Xodim panelda', 'Сотрудник в панели'), t('Jadval, davomat, maosh — bitta joyda.', 'График, явка, зарплата — в одном месте.')]],
    toy: [[t('Sana va mehmonlar', 'Дата и гости'), t('Faqat bo‘sh zallar qoladi.', 'Останутся только свободные залы.')], [t('Zalni tanlang', 'Выберите зал'), t('Rasm, narx, menyu — qo‘ng‘iroqsiz.', 'Фото, цены, меню — без звонков.')], [t('Sanani so‘rang', 'Запросите дату'), t('To‘yxona odatda 2 soatda javob beradi.', 'Тойхана обычно отвечает за 2 часа.')]],
  }
  const WHY: [string, string, string][] = [
    ['pin', t('Faqat Navoiy', 'Только Навои'), t('Boshqa shaharlar e’lonlari yo‘q.', 'Никаких объявлений из других городов.')],
    ['wallet', t('Maosh doim ko‘rinadi', 'Зарплата всегда видна'), t('Maoshsiz vakansiya chiqmaydi.', 'Без зарплаты вакансию не опубликовать.')],
    ['shield', t('Tekshirilgan egalar', 'Проверенные владельцы'), t('MyID va STIR orqali.', 'Через MyID и ИНН.')],
    ['cal', t('Bo‘sh sanalar', 'Свободные даты'), t('To‘yxonalar — qo‘ng‘iroqsiz.', 'Тойханы — без звонков.')],
  ]
  const FAQ: [string, string][] = [
    [t('Bu pullikmi?', 'Это платно?'), t('Ish qidiruvchilar va oilalar uchun doim bepul. Biznes uchun boshlash bepul.', 'Для соискателей и семей бесплатно всегда. Для бизнеса старт бесплатный.')],
    [t('Ilova o‘rnatish kerakmi?', 'Нужно ли ставить приложение?'), t('Yo‘q. Telegram ichida ochiladi.', 'Нет. Открывается внутри Telegram.')],
    [t('Ish beruvchi to‘lamasa-chi?', 'А если работодатель не заплатит?'), t('Har smenadan keyin so‘raymiz: «Maosh oldingizmi?». Javoblar hammaga ko‘rinadi.', 'После каждой смены спрашиваем: «Вам заплатили?». Ответы видят все.')],
    [t('Mendan pul so‘rashsa?', 'А если с меня просят деньги?'), t('Ish uchun oldindan pul so‘rash taqiqlangan. Shikoyat qiling — bloklaymiz.', 'Просить деньги за работу запрещено. Пожалуйтесь — заблокируем.')],
    [t('To‘yxonam bor. Qanday qo‘shilaman?', 'У меня тойхана. Как подключиться?'), t('«Xodim kerak» ni tanlang va biznes turini «To‘yxona» qiling.', 'Выберите «Нужны сотрудники» и тип бизнеса «Тойхана».')],
  ]
  return <div className="landing">
    <div className="l-top"><div className="logo"><i />bandla</div><div className="row"><LangSwitch /><button className="link" onClick={() => go(null)}>{t('Kirish', 'Войти')}</button></div></div>

    <section className="hero">
      <span className="eyebrow">{t('Faqat Navoiy', 'Только Навои')}</span>
      <h1>{t('Navoiyda ish, xodim va to‘yxona — bitta joyda', 'Работа, сотрудники и тойхана в Навои — в одном месте')}</h1>
      <p>{t('Har bir ish beruvchi tekshirilgan. Maosh har doim ko‘rinadi.', 'Каждый работодатель проверен. Зарплата всегда видна.')}</p>
    </section>

    <section className="doors">
      <button className="door ish" onClick={() => go('ish')}><span className="d-ic"><Icon n="brief" s={26} /></span><span><b>{t('Ish qidiryapman', 'Ищу работу')}</b><small>{t('Bugungi smenalar va doimiy ish', 'Смены на сегодня и постоянная работа')}</small></span><Icon n="right" /></button>
      <button className="door panel" onClick={() => go('xodim')}><span className="d-ic"><Icon n="users" s={26} /></span><span><b>{t('Xodim kerak', 'Нужны сотрудники')}</b><small>{t('Vakansiya, davomat va maosh daftari', 'Вакансии, явка и зарплатная тетрадь')}</small></span><Icon n="right" /></button>
      <button className="door toy" onClick={() => go('toy')}><span className="d-ic"><Icon n="rings" s={26} /></span><span><b>{t('To‘yxona qidiryapman', 'Ищу тойхану')}</b><small>{t('Sana bo‘yicha bo‘sh zallar', 'Свободные залы на вашу дату')}</small></span><Icon n="right" /></button>
    </section>

    <section>
      <h2>{t('Hozir Bandla’da', 'Сейчас в Bandla')}</h2>
      <div className="hscroll">
        {s.vacs.slice(0, 3).map(v => { const b = s.bizs.find(x => x.id === v.bizId)!; return <div key={v.id} className="mini">
          <span className="pay">{money(v.pay, s.lang)}<small> / {t(v.per, v.per === 'oy' ? 'мес' : 'смена')}</small></span>
          <b>{L(v.title, s.lang)}</b><span className="muted">{b.name}</span>{b.verified && <Trust>Tekshirilgan</Trust>}
        </div> })}
      </div>
      <div className="hscroll">
        {s.venues.slice(0, 3).map(v => <div key={v.id} className="mini venue"><VenueArt v={v} h={96} /><b>{v.name}</b><span className="muted">{t('dan', 'от')} {money(v.from, s.lang)} · {Math.max(...v.halls.map(h => h.cap))} {t('mehmon', 'гостей')}</span></div>)}
      </div>
      <p className="note">{t('Telefon raqamlari kirgandan keyin ochiladi.', 'Телефоны открываются после входа.')}</p>
    </section>

    <section>
      <h2>{t('Qanday ishlaydi', 'Как это работает')}</h2>
      <Seg value={how} onChange={setHow} options={[['ish', t('Ishchi', 'Работник')], ['xodim', t('Biznes', 'Бизнес')], ['toy', t('Oila', 'Семья')]]} />
      <ol className={`steps ${how}`}>{HOW[how].map(([a, b], i) => <li key={i}><i>{i + 1}</i><div><b>{a}</b><span>{b}</span></div></li>)}</ol>
    </section>

    <section>
      <h2>{t('Nega Bandla', 'Почему Bandla')}</h2>
      <div className="why">{WHY.map(([ic, a, b]) => <div key={a}><Icon n={ic} /><b>{a}</b><span>{b}</span></div>)}</div>
    </section>

    <section>
      <h2>{t('Savollar', 'Вопросы')}</h2>
      <div className="faq">{FAQ.map(([q, a]) => <details key={q}><summary>{q}<Icon n="right" s={18} /></summary><p>{a}</p></details>)}</div>
    </section>

    <div className="bottom"><Btn block icon="send" onClick={() => go(null)}>{t('Telegram orqali kirish', 'Войти через Telegram')}</Btn></div>
  </div>
}
