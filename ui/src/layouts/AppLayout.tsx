import { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';

export const AppLayout: Component<{ menu: RouteMenu }> = ({ menu }) => {
  const routeItems = useMemo(() => {
    const items: { path: string; element: React.ReactElement }[] = [];
    for (const menuItem of menu) {
      if (menuItem === 'divider' || menuItem.type === 'logout-btn') continue;
      if (menuItem.type === 'list') {
        for (const route of menuItem.routes) {
          items.push({ path: route.path, element: route.element });
        }
      } else {
        items.push({ path: menuItem.path, element: menuItem.element });
      }
    }

    return items;
  }, [menu]);

  return (
    <div className='flex flex-col h-screen sm:min-h-screen'>
      <div className='lg:p-4 flex-1 h-full'>
        <Routes>
          {routeItems.map((item) => (
            <Route path={item.path} element={item.element} key={item.path} />
          ))}
        </Routes>
      </div>
    </div>
  );
};