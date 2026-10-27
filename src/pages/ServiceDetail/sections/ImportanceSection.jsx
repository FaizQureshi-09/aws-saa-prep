import { Link } from 'react-router-dom';
import { domainById } from '../../../data/domainsData';
import { tierById } from '../../../data/categoriesData';
import { TierBadge } from '../../../components/common/Badge/TierBadge';
import { DomainBadge } from '../../../components/common/Badge/DomainBadge';
import { Callout } from '../../../components/common/Callout/Callout';
import { ServiceSection } from '../ServiceSection';

/**
 * Section 3: why the service matters for the exam. Tier and domain mapping
 * come from the catalog; the reasoning bullets come from the service content.
 * Task statements that name the service are listed for traceability.
 *
 * @param {object} props
 * @param {import('../../../data/serviceCatalog').ServiceMeta} props.service
 * @param {string[]} props.points
 */
export function ImportanceSection({ service, points }) {
  const mentioningTasks = Object.values(domainById)
    .flatMap((domain) => domain.tasks.map((task) => ({ domain, task })))
    .filter(({ task }) => task.services.includes(service.id));

  return (
    <ServiceSection id="importance" number={3} title="Importance for the exam">
      <div className="importance__badges">
        <TierBadge tier={service.tier} />
        {service.domains.map((domain) => (
          <DomainBadge key={domain} domain={domain} long />
        ))}
      </div>
      <p className="importance__tier">{tierById[service.tier]?.description}</p>
      <ul className="prose-list">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      {mentioningTasks.length > 0 ? (
        <>
          <h3 className="service-subheading">Exam-guide task statements this service supports</h3>
          <ul className="importance__tasks">
            {mentioningTasks.map(({ domain, task }) => (
              <li key={task.id}>
                <span className={`importance__task-id importance__task-id--${domain.id}`}>{task.id}</span>
                {task.title}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <Callout variant="info" title="How priority is decided">
        Tier is an editorial study-priority based on how widely a service is referenced across the
        exam guide's task statements - AWS does not publish per-service weights. See the{' '}
        <Link to="/syllabus#priority">Syllabus</Link> for the full explanation.
      </Callout>
    </ServiceSection>
  );
}
