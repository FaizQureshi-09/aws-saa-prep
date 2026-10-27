import { Link } from 'react-router-dom';
import { tiers } from '../../data/categoriesData';
import { serviceCatalog } from '../../data/serviceCatalog';
import { SectionHeading } from '../../components/common/SectionHeading/SectionHeading';
import { TierBadge } from '../../components/common/Badge/TierBadge';
import { Callout } from '../../components/common/Callout/Callout';

/**
 * Section 3: which services matter most. Services are grouped by tier with
 * their total recommended hours so students can see where time goes.
 */
export function PrioritySection() {
  return (
    <section className="section" id="priority">
      <div className="container">
        <SectionHeading
          eyebrow="3 · Priorities"
          title="Which services matter most"
          subtitle="From a solutions-architect's point of view: master the Critical tier first, then High; use the Low tier only to eliminate wrong answers."
        />

        <Callout variant="warning" title="How the tiers were decided (be aware)">
          AWS does not publish how many questions each service gets. These tiers are an editorial
          judgement based on how many task statements and domains reference a service in the exam guide,
          and how often it is the backbone of multi-service scenarios. Treat them as a study-time
          allocation guide, not a guarantee.
        </Callout>

        <div className="tier-list">
          {tiers.map((tier) => {
            const services = serviceCatalog.filter((service) => service.tier === tier.id);
            const hours = services.reduce((sum, service) => sum + service.hours, 0);
            return (
              <article className={`tier-card tier-card--${tier.id}`} key={tier.id}>
                <header className="tier-card__header">
                  <TierBadge tier={tier.id} />
                  <span className="tier-card__stats">
                    {services.length} pages · {hours.toFixed(1)} h recommended
                  </span>
                </header>
                <p className="tier-card__description">{tier.description}</p>
                <div className="tier-card__chips">
                  {services.map((service) => (
                    <Link key={service.id} to={`/services/${service.id}`} className="related-chip related-chip--compact">
                      {service.name}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
