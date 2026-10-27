import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import './NotFound.css';

/**
 * Fallback page for unknown routes or unknown service ids.
 * @param {{ message?: string }} props
 */
export function NotFound({ message = 'The page you were looking for does not exist.' }) {
  usePageTitle('Page not found');

  return (
    <section className="container not-found">
      <span className="not-found__code">404</span>
      <h1>Page not found</h1>
      <p>{message}</p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn--primary">
          Back to home
        </Link>
        <Link to="/services" className="btn btn--ghost">
          Browse services
        </Link>
      </div>
    </section>
  );
}
