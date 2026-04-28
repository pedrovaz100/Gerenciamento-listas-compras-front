import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Itens } from './pages/Itens';
import { Listas } from './pages/Listas';
import { Mercados } from './pages/Mercados';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mercados" element={<Mercados />} />
        <Route path="/listas" element={<Listas />} />
        <Route path="/itens" element={<Itens />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
