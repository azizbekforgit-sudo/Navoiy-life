import { ReactNode, useEffect } from 'react'
import { nav, set, useStore } from './store'

const PATHS: Record<string, string> = {
  brief: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  users: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M16 11a3 3 0 1 0 0-6M17 15c3 0 5 2 5 5',
  rings: 'M9 21a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM15 21a6 6 0 1 0 0-12M12 9l-2-4h4z',
  home: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  plus: 'M12 5v14M5 12h14',
  back: 'M15 5l-7 7 7 7',
  check: 'M5 12l5 5 9-10',
  mic: 'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zM6 11a6 6 0 0 0 12 0M12 17v4',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM18 14h2M14 18v2',
  phone: 'M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2z',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  wallet: 'M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l12-3v3M16 13h2',
  store: 'M4 9l1-5h14l1 5M4 9v11h16V9M4 9a3 3 0 0 0 5.3 0 3 3 0 0 0 5.4 0A3 3 0 0 0 20 9M10 20v-5h4v5',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  pin: 'M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  bolt: 'M13 3L5 13h6l-1 8 8-10h-6z',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  right: 'M9 5l7 7-7 7',
  x: 'M6 6l12 12M18 6L6 18',
  send: 'M21 4L3 11l7 2 2 7z',
}
export function Icon({ n, s = 22 }: { n: string; s?: number }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={PATHS[n] || ''} /></svg>
}

export function Btn({ children, kind = 'primary', sm, block, onClick, disabled, icon }: { children: ReactNode; kind?: 'primary' | 'ghost' | 'soft' | 'danger' | 'ok'; sm?: boolean; block?: boolean; onClick?: () => void; disabled?: boolean; icon?: string }) {
  return <button className={`btn ${kind}${sm ? ' sm' : ''}${block ? ' block' : ''}`} onClick={onClick} disabled={disabled}>{icon && <Icon n={icon} s={sm ? 16 : 20} />}<span>{children}</span></button>
}
export function Chip({ children, on, onClick }: { children: ReactNode; on?: boolean; onClick?: () => void }) {
  return <button className={`chip${on ? ' on' : ''}`} aria-pressed={!!on} onClick={onClick}>{children}</button>
}
export function Seg({ value, options, onChange }: { value: string; options: [string, string][]; onChange: (v: any) => void }) {
  return <div className="seg" role="tablist">{options.map(([v, l]) => <button key={v} role="tab" aria-selected={v === value} className={v === value ? 'on' : ''} onClick={() => onChange(v)}>{l}</button>)}</div>
}
export function Trust({ children }: { children: ReactNode }) { return <span className="trust"><Icon n="shield" s={14} />{children}</span> }
export function Tag({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'ok' | 'warn' | 'bad' | 'toy' | 'accent' }) { return <span className={`tag ${tone}`}>{children}</span> }
export function Empty({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return <div className="empty"><div className="cloud" /><b>{title}</b>{text && <p>{text}</p>}{children}</div>
}
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => { const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', h); return () => removeEventListener('keydown', h) }, [onClose])
  return <div className="scrim" onClick={onClose}>
    <div className="sheet" role="dialog" aria-label={title} onClick={e => e.stopPropagation()}>
      <div className="grab" /><div className="sheet-h"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Yopish"><Icon n="x" /></button></div>
      {children}
    </div>
  </div>
}

export function LangSwitch() {
  const s = useStore()
  return <button className="lang" onClick={() => set(x => { x.lang = x.lang === 'uz' ? 'ru' : 'uz' })} aria-label="Til / Язык">{s.lang === 'uz' ? 'RU' : 'UZ'}</button>
}

export function Screen({ title, sub, back, right, children, bottom, accent }: { title?: ReactNode; sub?: string; back?: boolean; right?: ReactNode; children: ReactNode; bottom?: ReactNode; accent?: string }) {
  return <div className={`screen ${accent || ''}`}>
    {(title || back) && <header className="hdr">
      {back && <button className="icon-btn" onClick={nav.back} aria-label="Orqaga"><Icon n="back" /></button>}
      <div className="hdr-t"><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
      {right}
    </header>}
    <main className="body">{children}</main>
    {bottom && <div className="bottom">{bottom}</div>}
  </div>
}

export function TabBar({ tabs, cur }: { tabs: { id: string; icon: string; label: string; badge?: number }[]; cur: string }) {
  return <nav className="tabbar">{tabs.map(t => <button key={t.id} className={t.id === cur ? 'on' : ''} aria-current={t.id === cur} onClick={() => nav.reset(t.id)}>
    <span className="ti"><Icon n={t.icon} />{!!t.badge && <i>{t.badge}</i>}</span><span>{t.label}</span>
  </button>)}</nav>
}
