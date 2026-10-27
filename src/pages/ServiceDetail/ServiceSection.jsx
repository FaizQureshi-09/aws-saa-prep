import { AnimatedSection } from '../../components/common/AnimatedSection/AnimatedSection';

/**
 * Numbered card wrapper shared by every section of a service page, giving
 * each one an anchor id (for the table of contents) and a consistent header.
 *
 * @param {object} props
 * @param {string} props.id - anchor id
 * @param {number|string} props.number - section number shown in the header
 * @param {string} props.title
 * @param {React.ReactNode} props.children
 */
export function ServiceSection({ id, number, title, children }) {
  return (
    <AnimatedSection as="section" className="service-section" id={id}>
      <h2 className="service-section__title">
        <span className="service-section__number">{number}</span>
        {title}
      </h2>
      <div className="service-section__body">{children}</div>
    </AnimatedSection>
  );
}
