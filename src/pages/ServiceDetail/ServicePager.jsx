import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { serviceCatalog } from '../../data/serviceCatalog';
import { dayByServiceId } from '../../data/studyPlanData';

/** Catalog in study-plan order, used for previous / next navigation. */
const orderedServices = [...serviceCatalog].sort(
  (a, b) => (dayByServiceId[a.id] ?? 99) - (dayByServiceId[b.id] ?? 99)
);

/**
 * Previous / next links following the 30-day study-plan order.
 * @param {{ serviceId: string }} props
 */
export function ServicePager({ serviceId }) {
  const index = orderedServices.findIndex((service) => service.id === serviceId);
  const previous = index > 0 ? orderedServices[index - 1] : null;
  const next = index >= 0 && index < orderedServices.length - 1 ? orderedServices[index + 1] : null;

  return (
    <nav className="service-pager no-print" aria-label="Study plan navigation">
      {previous ? (
        <Link to={`/services/${previous.id}`} className="service-pager__link">
          <FaArrowLeft aria-hidden="true" />
          <span>
            <small>Previous in plan</small>
            {previous.name}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={`/services/${next.id}`} className="service-pager__link service-pager__link--next">
          <span>
            <small>Next in plan</small>
            {next.name}
          </span>
          <FaArrowRight aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}
