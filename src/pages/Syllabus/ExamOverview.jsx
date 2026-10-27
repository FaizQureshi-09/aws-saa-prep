import { FaExternalLinkAlt } from 'react-icons/fa';
import {
  examFacts,
  examSources,
  officialPractice,
  policyFacts,
  questionFormats,
  scoringRules,
} from '../../data/examData';
import { SectionHeading } from '../../components/common/SectionHeading/SectionHeading';

/** Small "source" link that points a fact to the AWS page it came from. */
function SourceLink({ sourceId }) {
  const source = examSources[sourceId];
  if (!source) return null;
  return (
    <a className="fact-source" href={source.url} target="_blank" rel="noopener noreferrer" title={source.title}>
      Source <FaExternalLinkAlt aria-hidden="true" />
    </a>
  );
}

/**
 * "The exam at a glance": headline facts, question formats, scoring rules,
 * registration policies and official practice material - every fact linked
 * to the AWS page it was taken from.
 */
export function ExamOverview() {
  return (
    <section className="section" id="overview">
      <div className="container">
        <SectionHeading
          eyebrow="1 · The exam"
          title="SAA-C03 at a glance"
          subtitle="The AWS Certified Solutions Architect - Associate validates your ability to design secure, resilient, high-performing and cost-optimized solutions on AWS."
        />

        <div className="fact-grid">
          {examFacts.map((fact) => (
            <article className="fact-card" key={fact.id}>
              <span className="fact-card__label">{fact.label}</span>
              <strong className="fact-card__value">{fact.value}</strong>
              <p className="fact-card__detail">{fact.detail}</p>
              <SourceLink sourceId={fact.sourceId} />
            </article>
          ))}
        </div>

        <div className="two-column">
          <div className="card">
            <h3 className="card__title">Question formats</h3>
            <ul className="format-list">
              {questionFormats.map((format) => (
                <li key={format.id}>
                  <strong>{format.name}</strong>
                  <p>{format.description}</p>
                </li>
              ))}
            </ul>
            <p className="card__note">
              Questions are scenario-based: you read a short business situation and pick the design
              that best meets the stated requirements. <SourceLink sourceId="examGuide" />
            </p>
          </div>

          <div className="card">
            <h3 className="card__title">How scoring works</h3>
            <ul className="prose-list">
              {scoringRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <SourceLink sourceId="examGuide" />
          </div>
        </div>

        <h3 className="subsection-title">Registration and policies</h3>
        <dl className="policy-list">
          {policyFacts.map((policy) => (
            <div className="policy-item" key={policy.label}>
              <dt>{policy.label}</dt>
              <dd>
                {policy.value} <SourceLink sourceId={policy.sourceId} />
              </dd>
            </div>
          ))}
        </dl>

        <h3 className="subsection-title">Official practice material</h3>
        <ul className="practice-list">
          {officialPractice.map((item) => (
            <li key={item.name}>
              <strong>{item.name}</strong> - {item.detail}
            </li>
          ))}
        </ul>
        <p className="card__note">
          Source: <SourceLink sourceId="certPrep" /> - availability and pricing of Skill Builder
          content can change, so confirm on the page.
        </p>
      </div>
    </section>
  );
}
