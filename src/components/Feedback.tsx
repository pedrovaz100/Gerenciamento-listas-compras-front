type Props = {
  loading?: boolean;
  error?: string | null;
  success?: string | null;
};

export function Feedback({ loading, error, success }: Props) {
  if (loading) return <div className="rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">Carregando...</div>;
  if (error) return <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>;
  if (success) return <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{success}</div>;
  return null;
}
