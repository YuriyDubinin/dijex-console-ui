import { useLocation, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@shared/lib';
import { CoreTabs, type CoreTab } from './CoreTabs';
import { MainTab } from './tabs/MainTab';
import { CicdTab } from './tabs/CicdTab';

/** Соответствие таба → путь. Табы внутри Core — это URL-пути (переживают reload). */
const TAB_PATH: Record<CoreTab, string> = {
  main: '/core',
  cicd: '/core/cicd',
};

function tabFromPathname(pathname: string): CoreTab {
  return pathname.replace(/\/+$/, '').endsWith('/cicd') ? 'cicd' : 'main';
}

export function CorePage() {
  useDocumentTitle('Core');
  const location = useLocation();
  const navigate = useNavigate();
  const tab = tabFromPathname(location.pathname);

  return (
    <div className="space-y-4">
      <CoreTabs active={tab} onChange={(next) => navigate(TAB_PATH[next])} />
      <div role="tabpanel">{tab === 'main' ? <MainTab /> : <CicdTab />}</div>
    </div>
  );
}
