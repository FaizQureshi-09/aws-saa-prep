import { domains } from '../../../data/domainsData';
import './DomainWeightBars.css';

/**
 * Horizontal bars showing each exam domain's weighting (percentage of
 * scored content) and the approximate number of the 50 scored questions
 * it represents (weight x 50 - an estimate, not an AWS-published count).
 */
export function DomainWeightBars() {
  return (
    <ul className="domain-bars">
      {domains.map((domain) => (
        <li key={domain.id} className="domain-bars__item">
          <div className="domain-bars__label">
            <span>
              <strong>Domain {domain.id}</strong> {domain.name}
            </span>
            <span className="domain-bars__figures">
              <strong>{domain.weight}%</strong> · about {domain.approxQuestions} of 50 scored questions
            </span>
          </div>
          <div
            className="domain-bars__track"
            role="img"
            aria-label={`Domain ${domain.id} is ${domain.weight} percent of scored content`}
          >
            <span className={`domain-bars__fill domain-bars__fill--${domain.id}`} style={{ width: `${domain.weight * 2.5}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
