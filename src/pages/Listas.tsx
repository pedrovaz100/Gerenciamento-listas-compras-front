import { FormEvent, useEffect, useState } from 'react';
import { Pencil, Search, Trash2 } from 'lucide-react';
import { Feedback } from '../components/Feedback';
import { PageHeader } from '../components/PageHeader';
import { api } from '../services/api';
import type { ListaCompra, ListaCompraRequest, Mercado } from '../types/api';
import { today } from '../utils/format';

const initialForm: ListaCompraRequest = { nome: '', dataCriacao: today(), mercadoId: 0 };

export function Listas() {
  const [listas, setListas] = useState<ListaCompra[]>([]);
  const [mercados, setMercados] = useState<Mercado[]>([]);
  const [form, setForm] = useState<ListaCompraRequest>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchName, setSearchName] = useState('');
  const [searchMercadoId, setSearchMercadoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    const [listasData, mercadosData] = await Promise.all([api.listarListas(), api.listarMercados()]);
    setListas(listasData.content);
    setMercados(mercadosData.content);
    if (!form.mercadoId && mercadosData.content[0]) setForm((prev) => ({ ...prev, mercadoId: mercadosData.content[0].id }));
  }

  useEffect(() => { load().catch((err) => setError(err.message)); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      setLoading(true); setError(null); setSuccess(null);
      if (editingId) { await api.atualizarLista(editingId, form); setSuccess('Lista atualizada com sucesso.'); }
      else { await api.criarLista(form); setSuccess('Lista cadastrada com sucesso.'); }
      setForm({ ...initialForm, mercadoId: mercados[0]?.id || 0 }); setEditingId(null); await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao salvar lista.'); }
    finally { setLoading(false); }
  }

  async function remove(id: number) {
    if (!confirm('Deseja deletar esta lista?')) return;
    try { await api.deletarLista(id); await load(); setSuccess('Lista deletada.'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Erro ao deletar lista.'); }
  }

  function edit(lista: ListaCompra) {
    setEditingId(lista.id);
    setForm({ nome: lista.nome, dataCriacao: lista.dataCriacao, mercadoId: lista.mercado.id });
  }

  async function searchByName() {
    if (!searchName.trim()) return load();
    try { const data = await api.buscarListasPorNome(searchName); setListas(data.content); }
    catch (err) { setError(err instanceof Error ? err.message : 'Erro na busca.'); }
  }

  async function searchByMarket() {
    if (!searchMercadoId) return load();
    try { const data = await api.buscarListasPorMercado(Number(searchMercadoId)); setListas(data.content); }
    catch (err) { setError(err instanceof Error ? err.message : 'Erro na busca.'); }
  }

  return (
    <>
      <PageHeader title="Listas de compras" description="Gerencie listas e vincule cada lista a um mercado cadastrado." />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="card space-y-4">
          <h3 className="text-xl font-black text-slate-900">{editingId ? 'Editar lista' : 'Nova lista'}</h3>
          <input className="input" placeholder="Nome da lista" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          <input className="input" type="date" value={form.dataCriacao} max={today()} onChange={(e) => setForm({ ...form, dataCriacao: e.target.value })} required />
          <select className="input" value={form.mercadoId} onChange={(e) => setForm({ ...form, mercadoId: Number(e.target.value) })} required>
            <option value={0}>Selecione um mercado</option>
            {mercados.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
          <button className="btn-primary w-full" disabled={loading || !form.mercadoId}>{editingId ? 'Salvar alterações' : 'Cadastrar lista'}</button>
          {editingId && <button type="button" className="btn-secondary w-full" onClick={() => { setEditingId(null); setForm({ ...initialForm, mercadoId: mercados[0]?.id || 0 }); }}>Cancelar edição</button>}
          <Feedback loading={loading} error={error} success={success} />
        </form>

        <section className="space-y-4">
          <div className="card grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_auto]">
            <input className="input" placeholder="Buscar por nome" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            <button className="btn-secondary" onClick={searchByName}><Search size={16} /></button>
            <select className="input" value={searchMercadoId} onChange={(e) => setSearchMercadoId(e.target.value)}>
              <option value="">Buscar por mercado</option>
              {mercados.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
            <button className="btn-secondary" onClick={searchByMarket}><Search size={16} /></button>
            <button className="btn-secondary" onClick={() => { setSearchName(''); setSearchMercadoId(''); load(); }}>Limpar</button>
          </div>

          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><th className="table-th">ID</th><th className="table-th">Nome</th><th className="table-th">Data</th><th className="table-th">Mercado</th><th className="table-th">Itens</th><th className="table-th">Ações</th></tr></thead>
                <tbody>{listas.map((l) => <tr key={l.id}><td className="table-td">#{l.id}</td><td className="table-td font-semibold">{l.nome}</td><td className="table-td">{l.dataCriacao}</td><td className="table-td">{l.mercado?.nome}</td><td className="table-td">{l.itens?.length || 0}</td><td className="table-td"><div className="flex gap-2"><button className="btn-secondary !px-3 !py-2" onClick={() => edit(l)}><Pencil size={16} /></button><button className="btn-danger" onClick={() => remove(l.id)}><Trash2 size={16} /></button></div></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
