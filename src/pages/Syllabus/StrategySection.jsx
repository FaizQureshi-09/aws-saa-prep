import { examStrategy, questionPatterns } from '../../data/examData';
import { officialResources } from '../../data/resourcesData';
import { SectionHeading } from '../../components/common/SectionHeading/SectionHeading';
import { SourceList } from '../../components/common/SourceList/SourceList';

/**
 * Section 6: how to read exam questions, exam-day strategy and the
 * official AWS resources this site is built on.
 */
export function StrategySection() {
  return (
    <section className="section section-alt" id="strategy">
      <div className="container">
        <SectionHeading
          eyebrow="6 · Strategy"
          title="What the questions look like and how to approach them"
          subtitle="Key phrases tell you which Well-Architected pillar the question is really testing."
        />

        <div className="pattern-grid">
          {questionPatterns.map((pattern) => (
            <article className="pattern-card" key={pattern.keyword}>
              <h3>{pattern.keyword}</h3>
              <p>{pattern.meaning}</p>
            </article>
          ))}
        </div>

        <div className="two-column">
          <div className="card">
            <h3 className="card__title">Exam-day checklist</h3>
            <ul className="prose-list">
              {examStrategy.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3 className="card__title">Official resources used by this site</h3>
            <SourceList sources={officialResources.map((resource) => ({ title: `${resource.title} - ${resource.description}`, url: resource.url }))} />
          </div>
        </div>
      </div>
    </section>
  );
}
