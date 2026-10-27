import { Callout } from '../../../components/common/Callout/Callout';
import { ServiceSection } from '../ServiceSection';

/**
 * Section 1: what the service is and why it is used, as 5-6 bullet points.
 * An optional notice (for example a service availability change) is shown above the list.
 * @param {{ points: string[], notice?: { title: string, text: string } }} props
 */
export function IntroSection({ points, notice }) {
  return (
    <ServiceSection id="introduction" number={1} title="Introduction">
      {notice ? (
        <Callout variant="warning" title={notice.title}>
          {notice.text}
        </Callout>
      ) : null}
      <ul className="prose-list">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </ServiceSection>
  );
}
