import { useMemo } from 'react';

const formatHours = (value) => `${Number.isInteger(value) ? value : value.toFixed(2).replace(/\.?0+$/, '')} h`;
const formatPercent = (value) => `${value.toFixed(1)}%`;

/** Whole days from today until `isoDate` (negative if in the past), or null when unset. */
function daysUntil(isoDate) {
  if (!isoDate) return null;
  const target = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

/**
 * Dynamic dashboard under the tracker table. Every figure is derived from
 * the rows, so it updates immediately as statuses and hours change.
 *
 * @param {object} props
 * @param {ReturnType<import('../../hooks/useProgressTracker').computeSummary>} props.summary
 * @param {string} props.targetDate - exam date (YYYY-MM-DD) or ''
 */
export function TrackerSummary({ summary, targetDate }) {
  const daysLeft = useMemo(() => daysUntil(targetDate), [targetDate]);
  const hoursPerDay =
    daysLeft !== null && daysLeft > 0 ? summary.remainingHours / daysLeft : null;

  const cards = [
    { label: 'Total estimated hours', value: formatHours(summary.estimatedHours), hint: `${summary.totalRows} rows in your table` },
    { label: 'Actual hours spent', value: formatHours(summary.actualHours), hint: `${formatHours(summary.estimatedHours - summary.actualHours)} vs estimate (total)` },
    { label: 'Estimated hours remaining', value: formatHours(summary.remainingHours), hint: 'Estimate of rows not yet Done' },
    {
      label: 'Study pace',
      value: summary.paceRatio === null ? 'n/a' : `${summary.paceRatio.toFixed(2)}x`,
      hint:
        summary.paceRatio === null
          ? 'Appears after you finish a row with hours logged'
          : summary.paceRatio >= 1
            ? 'Finishing rows faster than estimated'
            : 'Finishing rows slower than estimated',
    },
  ];

  return (
    <section className="tracker-summary" aria-label="Progress summary">
      <div className="tracker-summary__cards">
        {cards.map((card) => (
          <div className="tracker-card" key={card.label}>
            <span className="tracker-card__label">{card.label}</span>
            <strong className="tracker-card__value">{card.value}</strong>
            <span className="tracker-card__hint">{card.hint}</span>
          </div>
        ))}
      </div>

      <div className="tracker-progress">
        <div className="tracker-progress__row">
          <span>Completion by hours</span>
          <strong>{formatPercent(summary.hoursCompletion)}</strong>
        </div>
        <div
          className="tracker-progress__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(summary.hoursCompletion)}
          aria-label="Completion by estimated hours"
        >
          <span style={{ width: `${summary.hoursCompletion}%` }} />
        </div>

        <div className="tracker-progress__row">
          <span>
            Completion by rows ({summary.done} of {summary.totalRows} Done)
          </span>
          <strong>{formatPercent(summary.rowCompletion)}</strong>
        </div>
        <div
          className="tracker-progress__bar tracker-progress__bar--alt"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(summary.rowCompletion)}
          aria-label="Completion by number of rows"
        >
          <span style={{ width: `${summary.rowCompletion}%` }} />
        </div>

        <ul className="tracker-statuses">
          <li className="tracker-statuses__item tracker-statuses__item--todo">To Do <strong>{summary.todo}</strong></li>
          <li className="tracker-statuses__item tracker-statuses__item--progress">In Progress <strong>{summary.inProgress}</strong></li>
          <li className="tracker-statuses__item tracker-statuses__item--done">Done <strong>{summary.done}</strong></li>
          <li className="tracker-statuses__item tracker-statuses__item--blocked">Blocked <strong>{summary.blocked}</strong></li>
        </ul>

        {daysLeft !== null ? (
          <p className="tracker-progress__deadline">
            {daysLeft > 0
              ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} until your exam - about ${hoursPerDay.toFixed(1)} h/day needed for the remaining estimate.`
              : daysLeft === 0
                ? 'Your exam is today. Good luck!'
                : 'The target date has passed - update it if you rescheduled.'}
          </p>
        ) : null}
      </div>
    </section>
  );
}
