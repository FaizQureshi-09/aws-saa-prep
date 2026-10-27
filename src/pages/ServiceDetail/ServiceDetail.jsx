import { Link, useParams } from 'react-router-dom';
import { serviceById } from '../../data/serviceCatalog';
import { useServiceContent } from '../../hooks/useServiceContent';
import { usePageTitle } from '../../hooks/usePageTitle';
import { FlowDiagram } from '../../components/diagram/FlowDiagram/FlowDiagram';
import { SourceList } from '../../components/common/SourceList/SourceList';
import { Callout } from '../../components/common/Callout/Callout';
import { NotFound } from '../NotFound/NotFound';
import { ServiceHero } from './ServiceHero';
import { ServiceSection } from './ServiceSection';
import { ServiceToc } from './ServiceToc';
import { ServicePager } from './ServicePager';
import { IntroSection } from './sections/IntroSection';
import { UseCasesSection } from './sections/UseCasesSection';
import { ImportanceSection } from './sections/ImportanceSection';
import { CliSection } from './sections/CliSection';
import { SdkSection } from './sections/SdkSection';
import { ExamplesSection } from './sections/ExamplesSection';
import { QuestionTypesSection } from './sections/QuestionTypesSection';
import { QuestionsSection } from './sections/QuestionsSection';
import { CheatSheetSection } from './sections/CheatSheetSection';
import { AnswerKeySection } from './sections/AnswerKeySection';
import './ServiceDetail.css';

/**
 * Full study page for one AWS service/topic. Follows the structure:
 * 0 heading + time, 1 introduction, 2 use cases, 3 importance, 4 CLI,
 * 5 SDK, 6 examples, 7 flow diagram, 8 question types, 9 practice
 * questions, then cheat sheet, related services, sources and answer key.
 */
export function ServiceDetail() {
  const { serviceId } = useParams();
  const service = serviceById[serviceId];
  const { content, status } = useServiceContent(service ? serviceId : undefined);
  usePageTitle(service?.name);

  if (!service) {
    return <NotFound message="That service or topic does not exist in the catalog." />;
  }

  if (status === 'loading') {
    return (
      <div className="container service-detail__state">
        <p>Loading {service.name}...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container service-detail__state">
        <h1>{service.name}</h1>
        <p>The study page for this topic has not been written yet.</p>
        <Link to="/services" className="btn btn--ghost">
          Back to all services
        </Link>
      </div>
    );
  }

  const relatedServices = (content.related ?? []).map((id) => serviceById[id]).filter(Boolean);

  return (
    <>
      <ServiceHero service={service} tagline={content.tagline} />

      <div className="container service-detail">
        <ServiceToc contentKey={serviceId} />

        <div className="service-detail__main">
          <IntroSection points={content.intro} notice={content.notice} />
          <UseCasesSection useCases={content.useCases} />
          <ImportanceSection service={service} points={content.importance.points} />
          <CliSection commands={content.cli} />
          <SdkSection sdk={content.sdk} />
          <ExamplesSection examples={content.examples} />

          <ServiceSection id="flow-diagram" number={7} title="Flow diagram">
            <FlowDiagram diagramId={serviceId} spec={content.diagram} />
            <Callout variant="tip" title="Edit it in draw.io">
              Use "Download .drawio", then open the file at{' '}
              <a href="https://app.diagrams.net/" target="_blank" rel="noopener noreferrer">
                app.diagrams.net
              </a>{' '}
              (File &gt; Open from &gt; Device) to edit or export it as PNG, SVG or PDF.
            </Callout>
          </ServiceSection>

          <QuestionTypesSection questionTypes={content.questionTypes} />
          <QuestionsSection questions={content.questions} />
          <CheatSheetSection keyFacts={content.keyFacts} traps={content.traps} />

          <ServiceSection id="related" number={11} title="Related services">
            <div className="related-list">
              {relatedServices.map((related) => (
                <Link key={related.id} to={`/services/${related.id}`} className="related-chip">
                  {related.name}
                </Link>
              ))}
            </div>
          </ServiceSection>

          <ServiceSection id="sources" number={12} title="Sources">
            <p className="service-section__note">
              Every fact on this page was taken from or checked against the official AWS pages below.
            </p>
            <SourceList sources={content.sources} />
          </ServiceSection>

          <AnswerKeySection questions={content.questions} />
          <ServicePager serviceId={serviceId} />
        </div>
      </div>
    </>
  );
}
