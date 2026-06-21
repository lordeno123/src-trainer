type Props = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: Props) {
  const normalized = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-wrap">
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <strong>{Math.round(normalized)} %</strong>
        </div>
      )}
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(normalized)}
      >
        <span style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}
