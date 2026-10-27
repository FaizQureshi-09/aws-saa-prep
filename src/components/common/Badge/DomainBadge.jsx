import { domainById } from '../../../data/domainsData';
import './Badge.css';

/**
 * Colored pill identifying an exam domain, e.g. "D1 Secure".
 *
 * @param {object} props
 * @param {1|2|3|4} props.domain - exam domain number
 * @param {boolean} [props.long] - show the full domain name instead of a short label
 */
const SHORT_NAMES = { 1: 'Secure', 2: 'Resilient', 3: 'High-Performing', 4: 'Cost-Optimized' };

export function DomainBadge({ domain, long = false }) {
  const meta = domainById[domain];
  const label = long && meta ? `Domain ${domain}: ${meta.name}` : `D${domain} ${SHORT_NAMES[domain] ?? ''}`;
  return <span className={`badge badge--domain-${domain}`}>{label}</span>;
}
