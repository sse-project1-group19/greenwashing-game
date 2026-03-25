import { Navigate, Route, Routes } from 'react-router-dom';
import GamePage from './pages/GamePage';
import DebugPage from './pages/DebugPage';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<GamePage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/debug" element={<DebugPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Router;


