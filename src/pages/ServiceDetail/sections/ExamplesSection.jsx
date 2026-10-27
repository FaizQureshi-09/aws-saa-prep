import { CodeBlock } from '../../../components/common/CodeBlock/CodeBlock';
import { ServiceSection } from '../ServiceSection';

/**
 * Section 6: worked scenarios with step lists and optional config/code.
 * @param {{ examples: { title: string, scenario: string, steps?: string[], code?: { language: string, code: string } }[] }} props
 */
export function ExamplesSection({ examples }) {
  return (
    <ServiceSection id="examples" number={6} title="Examples">
      <div className="example-list">
        {examples.map((example) => (
          <article className="example-card" key={example.title}>
            <h3>{example.title}</h3>
            <p className="example-card__scenario">{example.scenario}</p>
            {example.steps?.length ? (
              <ol className="example-card__steps">
                {example.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            ) : null}
            {example.code ? <CodeBlock code={example.code.code} language={example.code.language} /> : null}
          </article>
        ))}
      </div>
    </ServiceSection>
  );
}
