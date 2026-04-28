import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Feedback } from '../components/Feedback';
import { PageHeader } from '../components/PageHeader';
import { api } from '../services/api';
import type { ItemCompra, ItemCompraRequest, ListaCompraResumo } from '../types/api';
import { money } from '../utils/format';

const initialForm: ItemCompraRequest = {
  nome: '',
  quantidade: 0,
  preco: 0,
  listaCompraId: 0,
};

export function Itens() {
  const [itens, setItens] = useState<ItemCompra[]>([]);
  const [listas, setListas] = useState<ListaCompraResumo[]>([]);
  const [form, setForm] = useState<ItemCompraRequest>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const total = useMemo(
    () => itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0),
    [itens]
  );

  async function load() {
    const [itensData, listasData] = await Promise.all([
      api.listarItens(),
      api.listarResumoListas(),
    ]);

    setItens(itensData.content);
    setListas(listasData.content);

    if (!form.listaCompraId && listasData.content[0]) {
      setForm((prev) => ({
        ...prev,
        listaCompraId: listasData.content[0].id,
      }));
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (editingId) {
        await api.atualizarItem(editingId, form);
        setSuccess('Item atualizado com sucesso.');
      } else {
        await api.criarItem(form);
        setSuccess('Item cadastrado com sucesso.');
      }

      setForm({ ...initialForm, listaCompraId: listas[0]?.id || 0 });
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar item.');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: number) {
    if (!confirm('Deseja deletar este item?')) return;

    try {
      await api.deletarItem(id);
      await load();
      setSuccess('Item deletado.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar item.');
    }
  }

  function edit(item: ItemCompra) {
    setEditingId(item.id);
    setForm({
      nome: item.nome,
      quantidade: item.quantidade,
      preco: item.preco,
      listaCompraId: item.listaCompraId,
    });
  }

  return (
    <>
      <PageHeader
        title="Itens"
        description="Cadastre produtos com preço e quantidade."
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="card space-y-4">
          <h3 className="text-xl font-black">
            {editingId ? 'Editar item' : 'Novo item'}
          </h3>

          <input
            className="input"
            placeholder="Nome do item"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />

          <input
            className="input"
            type="text"
            inputMode="numeric"
            placeholder="Quantidade do item"
            value={form.quantidade === 0 ? '' : form.quantidade}
            onChange={(e) =>
              setForm({
                ...form,
                quantidade: Number(e.target.value),
              })
            }
            required
          />

          <input
            className="input"
            type="text"
            inputMode="decimal"
            placeholder="Preço do item"
            value={form.preco === 0 ? '' : form.preco}
            onChange={(e) =>
              setForm({
                ...form,
                preco: Number(e.target.value.replace(',', '.')),
              })
            }
            required
          />

          <select
            className="input"
            value={form.listaCompraId}
            onChange={(e) =>
              setForm({ ...form, listaCompraId: Number(e.target.value) })
            }
            required
          >
            <option value={0}>Selecione uma lista</option>
            {listas.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nome}
              </option>
            ))}
          </select>

          <button
            className="btn-primary w-full"
            disabled={loading || !form.listaCompraId}
          >
            {editingId ? 'Salvar alterações' : 'Cadastrar'}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn-secondary w-full"
              onClick={() => {
                setEditingId(null);
                setForm({ ...initialForm, listaCompraId: listas[0]?.id || 0 });
              }}
            >
              Cancelar edição
            </button>
          )}

          <Feedback loading={loading} error={error} success={success} />
        </form>

        <section className="space-y-4">
          <div className="card flex justify-between">
            <span>Total dos itens</span>
            <strong className="text-2xl">{money(total)}</strong>
          </div>

          <div className="card overflow-hidden p-0">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="table-th">Item</th>
                  <th className="table-th">Quantidade</th>
                  <th className="table-th">Preço do item</th>
                  <th className="table-th">Total</th>
                  <th className="table-th">Ações</th>
                </tr>
              </thead>

              <tbody>
                {itens.map((i) => (
                  <tr key={i.id} className="border-t">
                    <td className="table-td font-bold">{i.nome}</td>

                    <td className="table-td">{i.quantidade}</td>

                    <td className="table-td font-bold text-green-600">
                      {money(i.preco)}
                    </td>

                    <td className="table-td font-bold">
                      {money(i.preco * i.quantidade)}
                    </td>

                    <td className="table-td">
                      <div className="flex gap-2">
                        <button
                          className="btn-secondary"
                          onClick={() => edit(i)}
                          type="button"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="btn-danger"
                          onClick={() => remove(i.id)}
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {itens.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="table-td text-center text-slate-500"
                    >
                      Nenhum item cadastrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}