import { Link } from 'react-router-dom';
import { navigationLinks } from '../../../data/navigationData';
import { officialResources } from '../../../data/resourcesData';
import './Footer.css';

/**
 * Site footer: navigation shortcuts, official AWS resources, and the
 * disclaimer that this is an independent study aid, not an AWS product.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__column">
          <h2 className="footer__title">AWS SAA-C03 Prep Suite</h2>
          <p className="footer__text">
            Syllabus, a 30-day plan, service-by-service study guides with diagrams, practice
            questions and a progress tracker for the AWS Certified Solutions Architect - Associate
            exam.
          </p>
        </div>

        <div className="footer__column">
          <h2 className="footer__title">Navigate</h2>
          <ul className="footer__list">
            {navigationLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__column">
          <h2 className="footer__title">Official AWS resources</h2>
          <ul className="footer__list">
            {officialResources.slice(0, 5).map((resource) => (
              <li key={resource.url}>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__legal">
        <div className="container">
          <p>
            Independent study aid - not affiliated with or endorsed by Amazon Web Services. AWS and
            related marks are trademarks of Amazon.com, Inc. Exam facts were checked against AWS
            pages on 27 October 2026; always confirm price, policy and exam-guide changes on
            aws.amazon.com before you book. Practice questions are original or AWS-published samples
            and are not real exam content.
          </p>
        </div>
      </div>
    </footer>
  );
}
