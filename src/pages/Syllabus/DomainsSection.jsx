import { Link } from 'react-router-dom';
import { domains } from '../../data/domainsData';
import { serviceById } from '../../data/serviceCatalog';
import { SectionHeading } from '../../components/common/SectionHeading/SectionHeading';
import { DomainWeightBars } from '../../components/common/DomainWeightBars/DomainWeightBars';
import { Callout } from '../../components/common/Callout/Callout';

/**
 * Section 2: the four content domains with weightings, plus every task
 * statement's knowledge and skills (verbatim from the exam guide) and the
 * study pages that cover each task.
 */
export function DomainsSection() {
  return (
    <section className="section section-alt" id="domains">
      <div className="container">
        <SectionHeading
          eyebrow="2 · Syllabus"
          title="Four domains, twelve task statements"
          subtitle="Domain weightings are the percentage of scored content. Expand a domain to see exactly what the exam guide says you must know and be able to do."
        />

        <div className="card">
          <DomainWeightBars />
          <p className="card__note">
            "About N of 50" is simply the weighting multiplied by the 50 scored questions - an estimate.
            The 15 unscored questions are spread across the exam and are not identified.
          </p>
        </div>

        <div className="domain-list">
          {domains.map((domain) => (
            <details className="domain-card" key={domain.id} open={domain.id === 1}>
              <summary className="domain-card__summary">
                <span className={`domain-card__number domain-card__number--${domain.id}`}>D{domain.id}</span>
                <span className="domain-card__heading">
                  <strong>{domain.name}</strong>
                  <small>{domain.summary}</small>
                </span>
                <span className="domain-card__weight">{domain.weight}%</span>
              </summary>

              <div className="domain-card__body">
                {domain.tasks.map((task) => (
                  <article className="task" key={task.id}>
                    <h4 className="task__title">
                      <span>Task {task.id}</span> {task.title}
                    </h4>
                    <div className="task__columns">
                      <div>
                        <h5>Knowledge of</h5>
                        <ul className="prose-list">
                          {task.knowledge.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5>Skills in</h5>
                        <ul className="prose-list">
                          {task.skills.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="task__services">
                      <span>Study pages:</span>
                      {task.services
                        .filter((id) => serviceById[id])
                        .map((id) => (
                          <Link key={id} to={`/services/${id}`} className="related-chip related-chip--compact">
                            {serviceById[id].name}
                          </Link>
                        ))}
                    </div>
                  </article>
                ))}
              </div>
            </details>
          ))}
        </div>

        <Callout variant="info" title="Compensatory scoring">
          You do not need to pass each domain - only the overall exam (720/1000). Use domain weights to
          decide where to spend time, not to skip a domain entirely.
        </Callout>
      </div>
    </section>
  );
}
