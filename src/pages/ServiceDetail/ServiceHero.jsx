import { Link } from 'react-router-dom';
import { FaPrint } from 'react-icons/fa';
import { categoryById } from '../../data/categoriesData';
import { dayByServiceId } from '../../data/studyPlanData';
import { STATUSES, useProgressTracker } from '../../hooks/useProgressTracker';
import { PageHeader } from '../../components/common/PageHeader/PageHeader';
import { TierBadge } from '../../components/common/Badge/TierBadge';
import { DomainBadge } from '../../components/common/Badge/DomainBadge';
import { resolveIcon } from '../../utils/iconMap';

/**
 * Heading block of a service page (section 0): name, tagline, estimated
 * learning time, priority tier, relevant exam domains, plus quick progress
 * controls wired to the shared progress tracker.
 *
 * @param {object} props
 * @param {import('../../data/serviceCatalog').ServiceMeta} props.service
 * @param {string} props.tagline
 */
export function ServiceHero({ service, tagline }) {
  const { rowByServiceId, updateRow } = useProgressTracker();
  const row = rowByServiceId[service.id];
  const category = categoryById[service.category];
  const CategoryIcon = resolveIcon(category?.iconKey);
  const planDay = dayByServiceId[service.id];

  return (
    <PageHeader eyebrow={category?.label ?? 'Service'} title={service.name} description={tagline}>
      <span className="service-hero__chip">
        <CategoryIcon aria-hidden="true" /> {category?.label}
      </span>
      <span className="service-hero__chip service-hero__chip--time">
        Estimated learning time: <strong>{service.hours} h</strong>
      </span>
      {planDay ? (
        <span className="service-hero__chip">
          Study plan: <strong>Day {planDay}</strong>
        </span>
      ) : null}
      <TierBadge tier={service.tier} />
      {service.domains.map((domain) => (
        <DomainBadge key={domain} domain={domain} />
      ))}

      <div className="service-hero__controls no-print">
        {row ? (
          <>
            <label className="service-hero__field">
              Status
              <select
                value={row.status}
                onChange={(event) => updateRow(row.id, { status: event.target.value })}
              >
                {STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="service-hero__field">
              Hours spent
              <input
                type="number"
                min="0"
                step="0.25"
                value={row.actualHours}
                onChange={(event) =>
                  updateRow(row.id, { actualHours: Math.max(0, Number(event.target.value) || 0) })
                }
              />
            </label>
          </>
        ) : (
          <Link className="btn btn--ghost btn--small" to="/tracker">
            Not in your tracker - open Tracker
          </Link>
        )}
        <button type="button" className="btn btn--primary btn--small" onClick={() => window.print()}>
          <FaPrint aria-hidden="true" /> Print / Save as PDF
        </button>
      </div>
    </PageHeader>
  );
}
