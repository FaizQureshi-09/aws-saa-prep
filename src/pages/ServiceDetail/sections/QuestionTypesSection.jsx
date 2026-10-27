import { ServiceSection } from '../ServiceSection';

/**
 * Section 8: the kinds of exam questions this service typically appears in.
 * @param {{ questionTypes: { pattern: string, hint: string }[] }} props
 */
export function QuestionTypesSection({ questionTypes }) {
  return (
    <ServiceSection id="question-types" number={8} title="What kind of questions to expect">
      <dl className="qtype-list">
        {questionTypes.map((item) => (
          <div className="qtype-item" key={item.pattern}>
            <dt>{item.pattern}</dt>
            <dd>{item.hint}</dd>
          </div>
        ))}
      </dl>
    </ServiceSection>
  );
}
