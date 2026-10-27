import './PageHeader.css';

/**
 * Dark Squid-Ink banner at the top of every top-level page: an eyebrow,
 * the page title, an optional description and optional action slot.
 *
 * @param {object} props
 * @param {string} props.eyebrow
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {React.ReactNode} [props.children] - extra content (chips, buttons) under the description
 */
export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="page-header">
      <div className="container page-header__inner">
        <span className="page-header__eyebrow">{eyebrow}</span>
        <h1 className="page-header__title">{title}</h1>
        {description ? <p className="page-header__description">{description}</p> : null}
        {children ? <div className="page-header__extra">{children}</div> : null}
      </div>
    </header>
  );
}
