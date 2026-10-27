import { Link } from 'react-router-dom';
import { FaArrowRight, FaClipboardList, FaProjectDiagram, FaQuestionCircle, FaTasks } from 'react-icons/fa';
import { examFacts } from '../../data/examData';
import { serviceCatalog, totalCatalogHours } from '../../data/serviceCatalog';
import { totalPlannedHours } from '../../data/studyPlanData';
import { usePageTitle } from '../../hooks/usePageTitle';
import { AnimatedSection } from '../../components/common/AnimatedSection/AnimatedSection';
import { SectionHeading } from '../../components/common/SectionHeading/SectionHeading';
import { DomainWeightBars } from '../../components/common/DomainWeightBars/DomainWeightBars';
import { Callout } from '../../components/common/Callout/Callout';
import { TierBadge } from '../../components/common/Badge/TierBadge';
import './Home.css';

const heroFacts = ['questions', 'duration', 'passing', 'cost-usd', 'cost-inr'].map((id) =>
  examFacts.find((fact) => fact.id === id)
);

const features = [
  {
    icon: FaClipboardList,
    title: 'Complete syllabus',
    text: 'Exam format, scoring, price in USD and INR, every domain and task statement, scope lists and a 30-day plan.',
    to: '/syllabus',
  },
  {
    icon: FaProjectDiagram,
    title: 'One page per service',
    text: 'Introduction, use cases, CLI, SDK, examples, a flow diagram you can download as .drawio, cheat sheet and sources.',
    to: '/services',
  },
  {
    icon: FaQuestionCircle,
    title: 'Practice questions',
    text: 'Official AWS sample questions plus original scenario mocks, with instant feedback and explanations.',
    to: '/practice',
  },
  {
    icon: FaTasks,
    title: 'Progress tracker',
    text: 'Editable table with estimated vs actual hours, status, notes and live completion percentages.',
    to: '/tracker',
  },
];

/**
 * Landing page: the exam in numbers, how the content is organised,
 * domain weights and the critical-tier services to start with.
 */
export function Home() {
  usePageTitle();
  const criticalServices = serviceCatalog.filter((service) => service.tier === 'critical');

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero__inner">
          <AnimatedSection className="home-hero__copy">
            <span className="home-hero__eyebrow">AWS Certified Solutions Architect - Associate · SAA-C03</span>
            <h1>
              Pass the exam in <span className="gradient-text">30 days</span> with a plan, not guesswork.
            </h1>
            <p>
              A complete preparation suite: the verified syllabus, {serviceCatalog.length} service-by-service
              study guides with flow diagrams, practice questions and a progress tracker - every fact linked to
              the official AWS source.
            </p>
            <div className="home-hero__actions">
              <Link to="/syllabus" className="btn btn--primary">
                Start with the syllabus <FaArrowRight aria-hidden="true" />
              </Link>
              <Link to="/services" className="btn home-hero__ghost">
                Browse services
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection className="home-hero__facts" delay={0.1} direction="left">
            {heroFacts.map((fact) => (
              <div className="hero-fact" key={fact.id}>
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      <section className="section home-notice">
        <div className="container">
          <Callout variant="warning" title="The official exam guide was revised in 2026">
            This site follows AWS's current in-scope list (not the 2023 PDF many blogs still copy). See the{' '}
            <Link to="/syllabus">Syllabus</Link> for what changed.
          </Callout>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="What is inside"
            title="Everything for the exam, in one place"
            subtitle={`About ${totalCatalogHours.toFixed(0)} hours of service study inside a ${totalPlannedHours.toFixed(0)}-hour, 30-day plan including practice and review.`}
          />
          <div className="feature-grid">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.06}>
                <Link to={feature.to} className="feature-card">
                  <feature.icon aria-hidden="true" className="feature-card__icon" />
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <span className="feature-card__more">
                    Open <FaArrowRight aria-hidden="true" />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container home-split">
          <div>
            <SectionHeading
              eyebrow="Where the marks are"
              title="Domain weightings"
              subtitle="Percentage of scored content, from the official exam guide."
              align="left"
            />
            <DomainWeightBars />
          </div>
          <div>
            <SectionHeading
              eyebrow="Start here"
              title="Critical services"
              subtitle="Backbone services that appear across several domains. Master these first."
              align="left"
            />
            <ul className="critical-list">
              {criticalServices.map((service) => (
                <li key={service.id}>
                  <Link to={`/services/${service.id}`}>
                    <span>{service.name}</span>
                    <TierBadge tier={service.tier} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
