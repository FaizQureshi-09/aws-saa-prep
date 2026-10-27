import { FaExclamationTriangle, FaInfoCircle, FaLightbulb } from 'react-icons/fa';
import './Callout.css';

const VARIANT_ICONS = {
  info: FaInfoCircle,
  warning: FaExclamationTriangle,
  tip: FaLightbulb,
};

/**
 * Highlighted notice box for exam-relevant warnings, tips and context.
 *
 * @param {object} props
 * @param {'info'|'warning'|'tip'} [props.variant]
 * @param {string} [props.title]
 * @param {React.ReactNode} props.children
 */
export function Callout({ variant = 'info', title, children }) {
  const Icon = VARIANT_ICONS[variant] ?? FaInfoCircle;

  return (
    <aside className={`callout callout--${variant}`}>
      <Icon aria-hidden="true" className="callout__icon" />
      <div className="callout__content">
        {title ? <strong className="callout__title">{title}</strong> : null}
        <div className="callout__body">{children}</div>
      </div>
    </aside>
  );
}
