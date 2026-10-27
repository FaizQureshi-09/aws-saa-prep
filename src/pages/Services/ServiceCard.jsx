import { Link } from 'react-router-dom';
import { FaCheckCircle, FaClock } from 'react-icons/fa';
import { categoryById } from '../../data/categoriesData';
import { dayByServiceId } from '../../data/studyPlanData';
import { TierBadge } from '../../components/common/Badge/TierBadge';
import { DomainBadge } from '../../components/common/Badge/DomainBadge';
import { resolveIcon } from '../../utils/iconMap';

/**
 * Catalog card linking to a service's study page, showing priority,
 * domains, estimated time and the learner's current status.
 *
 * @param {object} props
 * @param {import('../../data/serviceCatalog').ServiceMeta} props.service
 * @param {string} [props.status] - tracker status for this service
 */
export function ServiceCard({ service, status }) {
  const category = categoryById[service.category];
  const Icon = resolveIcon(category?.iconKey);

  return (
    <Link to={`/services/${service.id}`} className="service-card" style={{ '--card-accent': category?.color }}>
      <div className="service-card__top">
        <span className="service-card__icon">
          <Icon aria-hidden="true" />
        </span>
        <TierBadge tier={service.tier} />
      </div>
      <h3 className="service-card__name">{service.name}</h3>
      <p className="service-card__summary">{service.summary}</p>
      <div className="service-card__domains">
        {service.domains.map((domain) => (
          <DomainBadge key={domain} domain={domain} />
        ))}
      </div>
      <div className="service-card__footer">
        <span>
          <FaClock aria-hidden="true" /> {service.hours} h
          {dayByServiceId[service.id] ? ` · Day ${dayByServiceId[service.id]}` : ''}
        </span>
        {status === 'Done' ? (
          <span className="service-card__done">
            <FaCheckCircle aria-hidden="true" /> Done
          </span>
        ) : status && status !== 'To Do' ? (
          <span className="service-card__status">{status}</span>
        ) : null}
      </div>
    </Link>
  );
}
