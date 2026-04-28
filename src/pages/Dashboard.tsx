import { useEffect, useState } from 'react';
import { Activity, ClipboardList, Package, Store } from 'lucide-react';
import { Feedback } from '../components/Feedback';
import { PageHeader } from '../components/PageHeader';
import { api } from '../services/api';
import type { HealthResponse } from '../types/api';

export function Dashboard() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [counts, setCounts] = useState({ mercados: 0, listas: 0, itens: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [healthData, mercados, listas, itens] = await Promise.all([
          api.health(),
          api.listarMercados(),
          api.listarListas(),
          api.listarItens()
        ]);
        setHealth(healthData);
        setCounts({ mercados: mercados.totalElements, listas: listas.totalElements, itens: itens.totalElements });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao conectar na API.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    { label: 'Mercados', value: counts.mercados, icon: Store },
    { label: 'Listas', value: counts.listas, icon: ClipboardList },
    { label: 'Itens', value: counts.itens, icon: Package }
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Acompanhe o status da API e os principais cadastros do sistema." />
      <div className="mb-6"><Feedback loading={loading} error={error} /></div>

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <strong className="mt-2 block text-4xl font-black text-slate-900">{value}</strong>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 text-blue-700"><Icon size={28} /></div>
            </div>
          </div>
        ))}
      </section>

      <section className="card mt-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700"><Activity /></div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Status da API</h3>
            <p className="text-sm text-slate-500">{health ? `${health.status} - ${health.message}` : 'Aguardando conexão...'}</p>
          </div>
        </div>
      </section>
    </>
  );
}
