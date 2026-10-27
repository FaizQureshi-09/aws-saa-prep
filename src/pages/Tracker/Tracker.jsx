import { useMemo, useState } from 'react';
import { FaDownload, FaPlus, FaUndo } from 'react-icons/fa';
import { STATUSES, useProgressTracker } from '../../hooks/useProgressTracker';
import { usePageTitle } from '../../hooks/usePageTitle';
import { PageHeader } from '../../components/common/PageHeader/PageHeader';
import { Callout } from '../../components/common/Callout/Callout';
import { TrackerRow } from './TrackerRow';
import { TrackerSummary } from './TrackerSummary';
import './Tracker.css';

/** Escapes a value for a CSV cell. */
const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;

/**
 * Progress tracker: an editable table (S.no, service, estimated hours,
 * actual hours, status, notes) with a live dashboard underneath showing
 * total estimated vs actual hours and percentage complete. All data stays
 * in this browser (localStorage).
 */
export function Tracker() {
  usePageTitle('Progress tracker');
  const { rows, summary, updateRow, addRow, deleteRow, resetRows, targetDate, setTargetDate } = useProgressTracker();
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');

  const visibleRows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => (statusFilter === 'all' ? true : row.status === statusFilter))
      .filter(({ row }) => (needle ? `${row.name} ${row.notes}`.toLowerCase().includes(needle) : true));
  }, [rows, statusFilter, query]);

  const exportCsv = () => {
    const header = ['S.no', 'Service name', 'Estimated hours', 'Actual hours', 'Status', 'Notes'];
    const lines = rows.map((row, index) =>
      [index + 1, row.name, row.estimatedHours, row.actualHours, row.status, row.notes].map(csvCell).join(',')
    );
    const blob = new Blob([[header.map(csvCell).join(','), ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'saa-c03-progress.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const confirmReset = () => {
    if (window.confirm('Reset the table to the default plan? Your hours, statuses and notes will be lost.')) {
      resetRows();
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Progress tracker"
        title="Track every service, hour by hour"
        description="Edit status, actual hours and notes inline. Totals and completion percentages below the table update instantly."
      />

      <section className="section">
        <div className="container tracker">
          <Callout variant="info" title="Your data stays on this device">
            The table is saved in your browser's local storage - there is no account or server. Clearing
            site data or switching browsers starts you from the default plan; use "Export CSV" to keep a
            copy. Estimated hours are this site's recommendation, so edit them to fit your own pace.
          </Callout>

          <div className="tracker-toolbar no-print">
            <label className="tracker-toolbar__field">
              <span>Search</span>
              <input
                type="search"
                placeholder="Service or note"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label className="tracker-toolbar__field">
              <span>Status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All</option>
                {STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="tracker-toolbar__field">
              <span>Exam date (optional)</span>
              <input type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
            </label>
            <div className="tracker-toolbar__actions">
              <button type="button" className="btn btn--primary btn--small" onClick={addRow}>
                <FaPlus aria-hidden="true" /> Add row
              </button>
              <button type="button" className="btn btn--ghost btn--small" onClick={exportCsv}>
                <FaDownload aria-hidden="true" /> Export CSV
              </button>
              <button type="button" className="btn btn--ghost btn--small" onClick={confirmReset}>
                <FaUndo aria-hidden="true" /> Reset
              </button>
            </div>
          </div>

          <div className="tracker-table-wrap">
            <table className="tracker-table">
              <thead>
                <tr>
                  <th scope="col">S.no</th>
                  <th scope="col">Service name</th>
                  <th scope="col">Estimated hours</th>
                  <th scope="col">Actual hours</th>
                  <th scope="col">Status</th>
                  <th scope="col">Notes</th>
                  <th scope="col" className="no-print">
                    <span className="visually-hidden">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map(({ row, index }) => (
                  <TrackerRow
                    key={row.id}
                    index={index}
                    row={row}
                    onChange={(patch) => updateRow(row.id, patch)}
                    onDelete={() => deleteRow(row.id)}
                  />
                ))}
                {visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="tracker-table__empty">
                      No rows match the current filter.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <TrackerSummary summary={summary} targetDate={targetDate} />
        </div>
      </section>
    </>
  );
}
