import { FaPrint } from 'react-icons/fa';
import { usePageTitle } from '../../hooks/usePageTitle';
import { PageHeader } from '../../components/common/PageHeader/PageHeader';
import { ExamUpdateBanner } from './ExamUpdateBanner';
import { ExamOverview } from './ExamOverview';
import { DomainsSection } from './DomainsSection';
import { PrioritySection } from './PrioritySection';
import { ScopeSection } from './ScopeSection';
import { StudyTimeline } from './StudyTimeline';
import { StrategySection } from './StrategySection';
import './Syllabus.css';

const sectionLinks = [
  { id: 'overview', label: 'Exam facts' },
  { id: 'domains', label: 'Domains' },
  { id: 'priority', label: 'Priorities' },
  { id: 'scope', label: 'Scope' },
  { id: 'timeline', label: '30-day plan' },
  { id: 'strategy', label: 'Strategy' },
];

/**
 * Complete syllabus page: exam facts, domains and task statements,
 * service priorities, in/out of scope, the 30-day timeline and strategy.
 */
export function Syllabus() {
  usePageTitle('Syllabus');

  return (
    <>
      <PageHeader
        eyebrow="Syllabus"
        title="Everything about the AWS Solutions Architect Associate exam"
        description="Exam format, scoring, cost in USD and INR, the four domains with every task statement, which services matter most, and a 30-day plan."
      >
        <button type="button" className="btn btn--primary btn--small no-print" onClick={() => window.print()}>
          <FaPrint aria-hidden="true" /> Print / Save as PDF
        </button>
      </PageHeader>

      <nav className="syllabus-nav no-print" aria-label="Syllabus sections">
        <div className="container syllabus-nav__inner">
          {sectionLinks.map((link) => (
            <button
              type="button"
              key={link.id}
              className="syllabus-nav__link"
              onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              {link.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="container syllabus-banner">
        <ExamUpdateBanner />
      </div>

      <ExamOverview />
      <DomainsSection />
      <PrioritySection />
      <ScopeSection />
      <StudyTimeline />
      <StrategySection />
    </>
  );
}
