import { useEffect, useMemo, useState } from 'react';
import { FaCompressArrowsAlt, FaDownload, FaExpandArrowsAlt } from 'react-icons/fa';
import { DIAGRAM_KINDS, layoutDiagram } from '../../../utils/diagram';
import { themedKindColor } from './themedKindColor';
import { toDrawioXml } from '../../../utils/drawio';
import { DiagramSvg } from './DiagramSvg';
import './FlowDiagram.css';

/** The in-page diagram is never scaled below this fraction of its natural size. */
const MIN_READABLE_SCALE = 0.72;

/**
 * Renders a service flow diagram as responsive SVG from the same spec that
 * generates the downloadable draw.io file, with a full-screen viewer for
 * wide diagrams and a numbered walk-through underneath.
 *
 * @param {object} props
 * @param {string} props.diagramId - id used for the .drawio file name
 * @param {import('../../../utils/diagram').DiagramSpec} props.spec
 */
export function FlowDiagram({ diagramId, spec }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const layout = useMemo(() => layoutDiagram(spec), [spec]);

  const usedKinds = useMemo(
    () => [...new Set(spec.nodes.map((node) => node[2]))].filter((kind) => DIAGRAM_KINDS[kind]),
    [spec]
  );

  useEffect(() => {
    if (!isExpanded) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  const downloadDrawio = () => {
    const blob = new Blob([toDrawioXml(spec, diagramId)], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${diagramId}.drawio`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <figure className="diagram-figure">
      <div className="diagram-figure__toolbar no-print">
        <figcaption className="diagram-figure__caption">{spec.title}</figcaption>
        <div className="diagram-figure__buttons">
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setIsExpanded(true)}>
            <FaExpandArrowsAlt aria-hidden="true" />
            Full screen
          </button>
          <button type="button" className="btn btn--ghost btn--small" onClick={downloadDrawio}>
            <FaDownload aria-hidden="true" />
            Download .drawio
          </button>
        </div>
      </div>

      <div className="diagram-figure__canvas">
        <DiagramSvg layout={layout} title={spec.title} minWidth={Math.round(layout.width * MIN_READABLE_SCALE)} />
      </div>

      <ul className="diagram-figure__legend">
        {usedKinds.map((kind) => (
          <li key={kind}>
            <span className="diagram-figure__swatch" style={{ backgroundColor: themedKindColor(kind) }} />
            {DIAGRAM_KINDS[kind].label}
          </li>
        ))}
      </ul>

      {spec.steps?.length ? (
        <ol className="diagram-figure__steps">
          {spec.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}

      {isExpanded ? (
        <div className="diagram-modal" role="dialog" aria-modal="true" aria-label={spec.title}>
          <div className="diagram-modal__bar">
            <strong>{spec.title}</strong>
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setIsExpanded(false)}>
              <FaCompressArrowsAlt aria-hidden="true" />
              Close (Esc)
            </button>
          </div>
          <div className="diagram-modal__canvas">
            <DiagramSvg layout={layout} title={spec.title} natural />
          </div>
        </div>
      ) : null}
    </figure>
  );
}
