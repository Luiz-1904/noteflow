import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { LoadingSpinner } from '../components/LoadingSpinner';
import { AppLayout } from './AppLayout';

const NotesListPage = lazy(() => import('../pages/NotesListPage'));
const NoteCreatePage = lazy(() => import('../pages/NoteCreatePage'));
const NoteDetailPage = lazy(() => import('../pages/NoteDetailPage'));
const NoteEditPage = lazy(() => import('../pages/NoteEditPage'));

function RouteFallback() {
  return (
    <div className="panel">
      <LoadingSpinner label="Loading page..." />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <NotesListPage />
          </Suspense>
        ),
      },
      {
        path: 'notes/new',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <NoteCreatePage />
          </Suspense>
        ),
      },
      {
        path: 'notes/:id',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <NoteDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'notes/:id/edit',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <NoteEditPage />
          </Suspense>
        ),
      },
    ],
  },
]);
