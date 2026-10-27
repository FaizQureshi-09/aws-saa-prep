import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { STATUSES } from '../../hooks/useProgressTracker';

const STATUS_CLASS = {
  'To Do': 'todo',
  'In Progress': 'progress',
  Done: 'done',
  Blocked: 'blocked',
};

/** Clamps user input to a non-negative number, defaulting to 0 for blanks. */
const toHours = (rawValue) => Math.max(0, Number(rawValue) || 0);

/**
 * One editable row of the tracker table. Every cell writes straight
 * through to the persisted tracker via `onChange`.
 *
 * @param {object} props
 * @param {number} props.index - 0-based position, shown as the S.no
 * @param {object} props.row
 * @param {(patch: object) => void} props.onChange
 * @param {() => void} props.onDelete
 */
export function TrackerRow({ index, row, onChange, onDelete }) {
  return (
    <tr className={`tracker-row tracker-row--${STATUS_CLASS[row.status]}`}>
      <td className="tracker-row__sno">{index + 1}</td>
      <td className="tracker-row__name">
        {row.serviceId ? (
          <Link to={`/services/${row.serviceId}`}>{row.name}</Link>
        ) : (
          <input
            type="text"
            aria-label={`Name for row ${index + 1}`}
            value={row.name}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        )}
      </td>
      <td>
        <input
          type="number"
          min="0"
          step="0.25"
          aria-label={`Estimated hours for ${row.name}`}
          value={row.estimatedHours}
          onChange={(event) => onChange({ estimatedHours: toHours(event.target.value) })}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          step="0.25"
          aria-label={`Actual hours for ${row.name}`}
          value={row.actualHours}
          onChange={(event) => onChange({ actualHours: toHours(event.target.value) })}
        />
      </td>
      <td>
        <select
          aria-label={`Status for ${row.name}`}
          value={row.status}
          className={`tracker-status tracker-status--${STATUS_CLASS[row.status]}`}
          onChange={(event) => onChange({ status: event.target.value })}
        >
          {STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="text"
          aria-label={`Notes for ${row.name}`}
          placeholder="Add notes"
          value={row.notes}
          onChange={(event) => onChange({ notes: event.target.value })}
        />
      </td>
      <td>
        <button type="button" className="tracker-row__delete no-print" aria-label={`Delete ${row.name}`} onClick={onDelete}>
          <FaTrash aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}
