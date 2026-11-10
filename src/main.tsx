import { createRoot } from 'react-dom/client'
import './styles.css'
import { myBiz, myVenue, useNav, useStore, useT } from './store'
import { TabBar } from './ui'
import { Landing } from './screens/Landing'
import { Onboarding } from './screens/Onboarding'
import { IshFeed, Mine, VacPage } from './screens/Ish'
import { ToySearch, VenuePage } from './screens/Toylar'
import { BToy, Bugun, Cands, KassaPage, More, NewVac, StaffTab, Tarif, Vacs } from './screens/Panel'
import { BizPage, Profil } from './screens/Profil'

function App() {
  const s = useStore(); const stack = useNav(); const t = useT()
  const top = stack[stack.length - 1]
  if (!s.user) return <div className="app">{top.n === 'onb' ? <Onboarding /> : <Landing />}</div>

  if (top.n === 'onb') return <div className="app"><Onboarding /></div>
  const biz = s.mode === 'biz' && !!myBiz(s)
  const meTabs = [{ id: 'ish', icon: 'brief', label: 'Ish' }, { id: 'toy', icon: 'rings', label: 'To‘ylar' }, { id: 'mine', icon: 'list', label: t('Mening', 'Мои'), badge: s.apps.filter(a => a.status === 'came' || a.status === 'invited').length + s.reqs.filter(r => r.status === 'free').length }, { id: 'profil', icon: 'user', label: 'Men' }]
  const bizTabs = [{ id: 'bugun', icon: 'home', label: 'Bugun' }, { id: 'vacs', icon: 'brief', label: t('Vakansiya', 'Вакансии'), badge: s.cands.filter(c => c.status === 'new').length }, { id: 'staff', icon: 'users', label: 'Xodimlar' }, ...(myVenue(s) ? [{ id: 'btoy', icon: 'rings', label: 'To‘yxona', badge: s.inReqs.filter(r => r.status === 'new').length }] : []), { id: 'more', icon: 'more', label: t('Yana', 'Ещё') }]
  const tabs = biz ? bizTabs : meTabs
  const root = stack[0].n
  const cur = tabs.some(x => x.id === root) ? root : tabs[0].id
  const n = stack.length === 1 && !tabs.some(x => x.id === top.n) ? tabs[0].id : top.n

  const view = (() => {
    switch (n) {
      case 'ish': return <IshFeed />
      case 'toy': return <ToySearch />
      case 'mine': return <Mine />
      case 'profil': return <Profil />
      case 'vac': return <VacPage id={top.p} />
      case 'venue': return <VenuePage id={top.p} />
      case 'bizpage': return <BizPage id={top.p} />
      case 'bugun': return <Bugun />
      case 'vacs': return <Vacs />
      case 'newvac': return <NewVac />
      case 'cands': return <Cands id={top.p} />
      case 'staff': return <StaffTab />
      case 'btoy': return <BToy />
      case 'more': return <More />
      case 'kassa': return <KassaPage />
      case 'tarif': return <Tarif />
      default: return biz ? <Bugun /> : <IshFeed />
    }
  })()
  return <div className={`app has-tabs ${biz ? 'm-biz' : 'm-me'}`}>{view}<TabBar tabs={tabs} cur={cur} /></div>
}

createRoot(document.getElementById('root')!).render(<App />)
