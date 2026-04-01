export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <section className="status-card error-card" role="alert">
      <h2>Algo falhou</h2>
      <p>{message}</p>
      {onRetry ? (
        <button className="button button-secondary" onClick={onRetry} type="button">
          Tentar novamente
        </button>
      ) : null}
    </section>
  );
}
