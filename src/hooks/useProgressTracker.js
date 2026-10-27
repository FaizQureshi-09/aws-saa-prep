import { useCallback, useEffect, useMemo, useState } from 'react';
import { serviceCatalog } from '../data/serviceCatalog';
import { allPlanDays, dayByServiceId } from '../data/studyPlanData';
import { readJson, writeJson } from '../utils/safeStorage';

const STORAGE_KEY = 'saa-prep-tracker-v1';
const TARGET_DATE_KEY = 'saa-prep-target-date';

export const STATUSES = ['To Do', 'In Progress', 'Done', 'Blocked'];

/** Builds the default table: every catalog service in study-plan order, then the practice tasks. */
function buildDefaultRows() {
  const serviceRows = [...serviceCatalog]
    .sort((a, b) => (dayByServiceId[a.id] ?? 99) - (dayByServiceId[b.id] ?? 99))
    .map((service) => ({
      id: `svc-${service.id}`,
      serviceId: service.id,
      name: service.name,
      estimatedHours: service.hours,
      actualHours: 0,
      status: 'To Do',
      notes: '',
    }));

  const taskRows = allPlanDays
    .filter((day) => day.task)
    .map((day) => ({
      id: `task-day-${day.day}`,
      serviceId: null,
      name: `Day ${day.day}: ${day.task}`,
      estimatedHours: day.taskHours ?? 0,
      actualHours: 0,
      status: 'To Do',
      notes: '',
    }));

  return [...serviceRows, ...taskRows];
}

/** Coerces unknown stored rows into valid row objects. */
function sanitizeRows(rows) {
  if (!Array.isArray(rows)) return null;
  return rows
    .filter((row) => row && typeof row.id === 'string')
    .map((row) => ({
      id: row.id,
      serviceId: row.serviceId ?? null,
      name: String(row.name ?? ''),
      estimatedHours: Number.isFinite(Number(row.estimatedHours)) ? Number(row.estimatedHours) : 0,
      actualHours: Number.isFinite(Number(row.actualHours)) ? Number(row.actualHours) : 0,
      status: STATUSES.includes(row.status) ? row.status : 'To Do',
      notes: String(row.notes ?? ''),
    }));
}

/** Derives all dashboard figures from the rows. */
export function computeSummary(rows) {
  const sum = (items, key) => items.reduce((total, item) => total + (Number(item[key]) || 0), 0);
  const done = rows.filter((row) => row.status === 'Done');
  const estimatedHours = sum(rows, 'estimatedHours');
  const actualHours = sum(rows, 'actualHours');
  const doneEstimated = sum(done, 'estimatedHours');
  const doneActual = sum(done, 'actualHours');
  const count = (status) => rows.filter((row) => row.status === status).length;

  return {
    totalRows: rows.length,
    done: done.length,
    inProgress: count('In Progress'),
    blocked: count('Blocked'),
    todo: count('To Do'),
    estimatedHours,
    actualHours,
    remainingHours: estimatedHours - doneEstimated,
    rowCompletion: rows.length ? (done.length / rows.length) * 100 : 0,
    hoursCompletion: estimatedHours ? (doneEstimated / estimatedHours) * 100 : 0,
    paceRatio: doneActual > 0 ? doneEstimated / doneActual : null,
  };
}

/**
 * Persistent study-progress table. Rows are seeded from the service
 * catalog and study plan, then fully user-editable (add, edit, delete).
 * Everything is stored in localStorage on this device only.
 */
export function useProgressTracker() {
  const [rows, setRows] = useState(() => sanitizeRows(readJson(STORAGE_KEY, null)) ?? buildDefaultRows());
  const [targetDate, setTargetDate] = useState(() => readJson(TARGET_DATE_KEY, ''));

  useEffect(() => {
    writeJson(STORAGE_KEY, rows);
  }, [rows]);

  useEffect(() => {
    writeJson(TARGET_DATE_KEY, targetDate);
  }, [targetDate]);

  const updateRow = useCallback((rowId, patch) => {
    setRows((previous) => previous.map((row) => (row.id === rowId ? { ...row, ...patch } : row)));
  }, []);

  const addRow = useCallback(() => {
    setRows((previous) => [
      ...previous,
      {
        id: `custom-${Date.now()}`,
        serviceId: null,
        name: 'New topic',
        estimatedHours: 1,
        actualHours: 0,
        status: 'To Do',
        notes: '',
      },
    ]);
  }, []);

  const deleteRow = useCallback((rowId) => {
    setRows((previous) => previous.filter((row) => row.id !== rowId));
  }, []);

  const resetRows = useCallback(() => {
    setRows(buildDefaultRows());
  }, []);

  const rowByServiceId = useMemo(
    () => Object.fromEntries(rows.filter((row) => row.serviceId).map((row) => [row.serviceId, row])),
    [rows]
  );

  const summary = useMemo(() => computeSummary(rows), [rows]);

  return { rows, summary, rowByServiceId, updateRow, addRow, deleteRow, resetRows, targetDate, setTargetDate };
}
