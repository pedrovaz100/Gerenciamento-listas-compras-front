import { FormEvent, useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Feedback } from '../components/Feedback';
import { PageHeader } from '../components/PageHeader';
import { api } from '../services/api';
import type { Mercado, MercadoRequest } from '../types/api';

const initialForm: MercadoRequest = { nome: '', endereco: '' };

export function Mercados() {
  const [mercados, setMercados] = useState<Mercado[]>([]);
  const [form, setForm] = useState<MercadoRequest>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    const data = await api.listarMercados();
    setMercados(data.content);
  }

  useEffect(() => { load().catch((err) => setError(err.message)); }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      setLoading(true); setError(null); setSuccess(null);
      if (editingId) {
        await api.atualizarMercado(editingId, form);
        setSuccess('Mercado atualizado com sucesso.');
      } else {
        await api.criarMercado(form);
        setSuccess('Mercado cadastrado com sucesso.');
      }
      setForm(initialForm); setEditingId(null); await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao salvar mercado.'); }
    finally { setLoading(false); }
  }

  async function remove(id: number) {
    if (!confirm('Deseja deletar este mercado?')) return;
    try { await api.deletarMercado(id); await load(); setSuccess('Mercado deletado.'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Erro ao deletar mercado.'); }
  }

  function edit(mercado: Mercado) {
    setEditingId(mercado.id);
    setForm({ nome: mercado.nome, endereco: mercado.endereco });
  }

  return (
    <>
      <PageHeader title="Mercados" description="Cadastre, edite, liste e exclua mercados da API." />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h3 className="text-xl font-black text-slate-900">{editingId ? 'Editar mercado' : 'Novo mercado'}</h3>
          <input className="input" placeholder="Nome do mercado" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          <input className="input" placeholder="Endereço" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} required />
          <button className="btn-primary w-full" disabled={loading}>{editingId ? 'Salvar alterações' : 'Cadastrar mercado'}</button>
          {editingId && <button type="button" className="btn-secondary w-full" onClick={() => { setEditingId(null); setForm(initialForm); }}>Cancelar edição</button>}
          <Feedback loading={loading} error={error} success={success} />
        </form>

        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50"><tr><th className="table-th">ID</th><th className="table-th">Nome</th><th className="table-th">Endereço</th><th className="table-th">Ações</th></tr></thead>
              <tbody>{mercados.map((m) => <tr key={m.id}><td className="table-td">#{m.id}</td><td className="table-td font-semibold">{m.nome}</td><td className="table-td">{m.endereco}</td><td className="table-td"><div className="flex gap-2"><button className="btn-secondary !px-3 !py-2" onClick={() => edit(m)}><Pencil size={16} /></button><button className="btn-danger" onClick={() => remove(m.id)}><Trash2 size={16} /></button></div></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
