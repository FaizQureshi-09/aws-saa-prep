import { useId } from 'react';
import { themedKindColor } from './themedKindColor';

const NODE_LINE_HEIGHT = 15;
const LABEL_LINE_HEIGHT = 13;

/**
 * Pure SVG drawing of a laid-out diagram (groups, edges, nodes, labels).
 * Colors come from CSS variables, so it follows the light/dark theme.
 *
 * @param {object} props
 * @param {ReturnType<import('../../../utils/diagram').layoutDiagram>} props.layout
 * @param {string} props.title - accessible name
 * @param {number} [props.minWidth] - minimum rendered width in px (enables horizontal scroll below it)
 * @param {boolean} [props.natural] - render at natural pixel size instead of fitting the container
 */
export function DiagramSvg({ layout, title, minWidth, natural = false }) {
  const markerId = useId();

  return (
    <svg
      className="flow-diagram"
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      style={natural ? { width: layout.width } : { width: '100%', minWidth }}
      role="img"
      aria-label={`Flow diagram: ${title}`}
    >
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="flow-diagram__arrow" />
        </marker>
      </defs>

      {layout.groups.map((group) => (
        <g key={group.label}>
          <rect x={group.x} y={group.y} width={group.w} height={group.h} rx="12" className="flow-diagram__group" />
          <text x={group.x + 14} y={group.y + 22} className="flow-diagram__group-label">
            {group.label}
          </text>
        </g>
      ))}

      {layout.edges.map((edge) => (
        <path
          key={`${edge.from}-${edge.to}-${edge.label}`}
          d={edge.points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x},${y}`).join(' ')}
          className={`flow-diagram__edge ${edge.dashed ? 'flow-diagram__edge--dashed' : ''}`}
          markerEnd={`url(#${markerId})`}
        />
      ))}

      {layout.nodes.map((node) => {
        const color = themedKindColor(node.kind);
        const startY = node.y + node.h / 2 - ((node.lines.length - 1) * NODE_LINE_HEIGHT) / 2 + 4;
        return (
          <g key={node.id}>
            <rect x={node.x} y={node.y} width={node.w} height={node.h} rx="9" className="flow-diagram__node" style={{ stroke: color }} />
            <rect x={node.x} y={node.y} width="7" height={node.h} rx="3" style={{ fill: color }} />
            {node.lines.map((line, index) => (
              <text key={line} x={node.x + node.w / 2 + 3} y={startY + index * NODE_LINE_HEIGHT} className="flow-diagram__node-label">
                {line}
              </text>
            ))}
          </g>
        );
      })}

      {layout.edges
        .filter((edge) => edge.labelLines.length > 0)
        .map((edge) => (
          <g key={`label-${edge.from}-${edge.to}-${edge.label}`}>
            <rect
              x={edge.labelBox.x}
              y={edge.labelBox.y}
              width={edge.labelBox.w}
              height={edge.labelBox.h}
              rx="8"
              className="flow-diagram__label-bg"
            />
            {edge.labelLines.map((line, index) => (
              <text
                key={line}
                x={edge.labelBox.x + edge.labelBox.w / 2}
                y={edge.labelBox.y + 13 + index * LABEL_LINE_HEIGHT - 1}
                className="flow-diagram__edge-label"
              >
                {line}
              </text>
            ))}
          </g>
        ))}
    </svg>
  );
}
