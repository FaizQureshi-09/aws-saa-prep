/**
 * Diagram layout engine shared by the React SVG renderer and the draw.io
 * exporter, so a flow diagram is authored ONCE in a service's data file and
 * stays identical on the website and in the downloadable .drawio file.
 *
 * Authoring format (compact tuples, positions on a column/row grid):
 *   nodes:  [id, label, kind, col, row]
 *   edges:  [fromId, toId, label?, 'dashed'?]
 *   groups: [label, col1, row1, col2, row2]   (box around that grid span)
 *
 * Authoring rules (enforced by validateDiagram):
 *   - keep edge labels short (<= 32 characters; they wrap to two lines)
 *   - route edges between neighbouring cells; an edge must not pass through
 *     a third node, and its label must not overlap any node
 *
 * @typedef {[string, string, string, number, number]} NodeTuple
 * @typedef {[string, string, string?, string?]} EdgeTuple
 * @typedef {[string, number, number, number, number]} GroupTuple
 * @typedef {object} DiagramSpec
 * @property {string} title
 * @property {NodeTuple[]} nodes
 * @property {EdgeTuple[]} edges
 * @property {GroupTuple[]} [groups]
 * @property {string[]} [steps] - numbered walk-through shown under the diagram
 */

export const NODE_W = 148;
export const NODE_H = 60;
const COL_PITCH = 266;
const ROW_PITCH = 118;
const PAD = 52;
const PORT_GAP = 16;
const TRUNK_GAP = 12;
const GROUP_MARGIN_X = 22;
const GROUP_MARGIN_TOP = 34;
const GROUP_MARGIN_BOTTOM = 22;
const LABEL_CHARS_PER_LINE = 16;
const LABEL_MAX_LENGTH = 32;

/** Stroke / accent color per node kind (AWS Architecture Icon category palette). */
export const DIAGRAM_KINDS = {
  actor: { color: '#232f3e', label: 'User / client' },
  external: { color: '#687078', label: 'Internet / on-premises' },
  compute: { color: '#ed7100', label: 'Compute' },
  storage: { color: '#7aa116', label: 'Storage' },
  database: { color: '#c925d1', label: 'Database' },
  network: { color: '#8c4fff', label: 'Networking' },
  security: { color: '#dd344c', label: 'Security' },
  integration: { color: '#e7157b', label: 'Integration / management' },
  management: { color: '#e7157b', label: 'Management & governance' },
  analytics: { color: '#8c4fff', label: 'Analytics' },
  ml: { color: '#01a88d', label: 'ML / migration' },
  generic: { color: '#545b64', label: 'Other' },
};

/** Returns the stroke color for a node kind, defaulting to "generic". */
export function kindColor(kind) {
  return (DIAGRAM_KINDS[kind] ?? DIAGRAM_KINDS.generic).color;
}

/**
 * Splits a label into at most `maxLines` lines of roughly `maxChars`
 * characters, breaking on spaces, so it fits inside a box.
 */
export function wrapLabel(label, maxChars = 19, maxLines = 3) {
  const words = String(label).split(' ');
  const lines = [];
  let current = '';
  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1]}...`;
    return kept;
  }
  return lines;
}

const centerX = (node) => node.x + node.w / 2;
const centerY = (node) => node.y + node.h / 2;
const isHorizontalSide = (side) => side === 'left' || side === 'right';

/** Picks the exit side on `from` and entry side on `to` from their relative position. */
function chooseSides(from, to) {
  const dx = centerX(to) - centerX(from);
  const dy = centerY(to) - centerY(from);
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? ['right', 'left'] : ['left', 'right'];
  }
  return dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom'];
}

/** Point on a node's border for `side`, shifted `offset` px along that side. */
function portPoint(node, side, offset) {
  if (side === 'right') return [node.x + node.w, centerY(node) + offset];
  if (side === 'left') return [node.x, centerY(node) + offset];
  if (side === 'bottom') return [centerX(node) + offset, node.y + node.h];
  return [centerX(node) + offset, node.y];
}

/**
 * Assigns each edge end a slot along its node side so several edges that
 * touch the same side fan out instead of drawing on top of each other.
 * Returns, per edge, the start/end offset and the trunk stagger index.
 */
function assignPorts(edges, nodeById, sides) {
  const groups = new Map();
  edges.forEach((edge, index) => {
    const [startSide, endSide] = sides[index];
    const from = nodeById[edge.from];
    const to = nodeById[edge.to];
    const startKey = `${edge.from}:${startSide}`;
    const endKey = `${edge.to}:${endSide}`;
    const startSort = isHorizontalSide(startSide) ? centerY(to) : centerX(to);
    const endSort = isHorizontalSide(endSide) ? centerY(from) : centerX(from);
    groups.set(startKey, [...(groups.get(startKey) ?? []), { index, end: 'start', sort: startSort }]);
    groups.set(endKey, [...(groups.get(endKey) ?? []), { index, end: 'end', sort: endSort }]);
  });

  const ports = edges.map(() => ({ startOffset: 0, endOffset: 0, trunk: 0 }));
  groups.forEach((members) => {
    members.sort((a, b) => a.sort - b.sort);
    members.forEach((member, slot) => {
      const centered = slot - (members.length - 1) / 2;
      if (member.end === 'start') {
        ports[member.index].startOffset = centered * PORT_GAP;
        ports[member.index].trunk = centered * TRUNK_GAP;
      } else {
        ports[member.index].endOffset = centered * PORT_GAP;
      }
    });
  });
  return ports;
}

/** Builds the orthogonal polyline for one edge. */
function buildPath(from, to, sides, port) {
  const [startSide, endSide] = sides;
  const start = portPoint(from, startSide, port.startOffset);
  const end = portPoint(to, endSide, port.endOffset);

  if (isHorizontalSide(startSide)) {
    if (Math.abs(start[1] - end[1]) < 1) return [start, end];
    const midX = (start[0] + end[0]) / 2 + port.trunk;
    return [start, [midX, start[1]], [midX, end[1]], end];
  }
  if (Math.abs(start[0] - end[0]) < 1) return [start, end];
  const midY = (start[1] + end[1]) / 2 + port.trunk;
  return [start, [start[0], midY], [end[0], midY], end];
}

/** Center of the longest segment of a polyline - the best place for a label. */
function longestSegmentMidpoint(points) {
  let best = { length: -1, x: points[0][0], y: points[0][1] };
  for (let index = 0; index < points.length - 1; index += 1) {
    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1];
    const length = Math.hypot(x2 - x1, y2 - y1);
    if (length > best.length) best = { length, x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  }
  return { x: best.x, y: best.y };
}

/**
 * Converts an authored DiagramSpec into pixel geometry.
 * @param {DiagramSpec} spec
 */
export function layoutDiagram(spec) {
  const nodes = spec.nodes.map(([id, label, kind, col, row]) => ({
    id,
    label,
    kind,
    lines: wrapLabel(label, 19, 3),
    x: PAD + col * COL_PITCH,
    y: PAD + row * ROW_PITCH,
    w: NODE_W,
    h: NODE_H,
  }));
  const nodeById = Object.fromEntries(nodes.map((node) => [node.id, node]));

  const validEdges = spec.edges
    .filter(([from, to]) => nodeById[from] && nodeById[to])
    .map(([from, to, label, style]) => ({ from, to, label: label ?? '', dashed: style === 'dashed' }));
  const sides = validEdges.map((edge) => chooseSides(nodeById[edge.from], nodeById[edge.to]));
  const ports = assignPorts(validEdges, nodeById, sides);

  const edges = validEdges.map((edge, index) => {
    const points = buildPath(nodeById[edge.from], nodeById[edge.to], sides[index], ports[index]);
    const labelLines = edge.label ? wrapLabel(edge.label, LABEL_CHARS_PER_LINE, 2) : [];
    const center = longestSegmentMidpoint(points);
    const width = labelLines.length ? Math.max(...labelLines.map((line) => line.length)) * 5.9 + 14 : 0;
    const height = labelLines.length * 13 + 9;
    return {
      ...edge,
      points,
      labelLines,
      labelBox: { x: center.x - width / 2, y: center.y - height / 2, w: width, h: height },
    };
  });

  const groups = (spec.groups ?? []).map(([label, col1, row1, col2, row2]) => {
    const x = PAD + col1 * COL_PITCH - GROUP_MARGIN_X;
    const y = PAD + row1 * ROW_PITCH - GROUP_MARGIN_TOP;
    const right = PAD + col2 * COL_PITCH + NODE_W + GROUP_MARGIN_X;
    const bottom = PAD + row2 * ROW_PITCH + NODE_H + GROUP_MARGIN_BOTTOM;
    return { label, x, y, w: right - x, h: bottom - y };
  });

  const maxX = Math.max(...nodes.map((node) => node.x + node.w), ...groups.map((group) => group.x + group.w));
  const maxY = Math.max(...nodes.map((node) => node.y + node.h), ...groups.map((group) => group.y + group.h));

  return { width: maxX + PAD / 2, height: maxY + PAD / 2, nodes, edges, groups };
}

/** True when the axis-aligned segment crosses the rectangle (expanded by `margin`). */
function segmentHitsRect([x1, y1], [x2, y2], rect, margin) {
  const left = rect.x - margin;
  const right = rect.x + rect.w + margin;
  const top = rect.y - margin;
  const bottom = rect.y + rect.h + margin;
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  return maxX >= left && minX <= right && maxY >= top && minY <= bottom;
}

/** True when two rectangles overlap. */
function rectsOverlap(a, b, margin = 0) {
  return a.x < b.x + b.w + margin && a.x + a.w > b.x - margin && a.y < b.y + b.h + margin && a.y + a.h > b.y - margin;
}

/** Validates a spec and returns human-readable problems (empty = OK). */
export function validateDiagram(spec) {
  const problems = [];
  if (!spec || !Array.isArray(spec.nodes) || spec.nodes.length === 0) {
    return ['diagram has no nodes'];
  }
  const ids = new Set();
  const occupied = new Set();
  spec.nodes.forEach((node) => {
    if (ids.has(node[0])) problems.push(`duplicate node id "${node[0]}"`);
    ids.add(node[0]);
    if (!DIAGRAM_KINDS[node[2]]) problems.push(`node "${node[0]}" has unknown kind "${node[2]}"`);
    const slot = `${node[3]},${node[4]}`;
    if (occupied.has(slot)) problems.push(`two nodes share grid cell ${slot}`);
    occupied.add(slot);
  });
  (spec.edges ?? []).forEach(([from, to, label]) => {
    if (!ids.has(from)) problems.push(`edge references missing node "${from}"`);
    if (!ids.has(to)) problems.push(`edge references missing node "${to}"`);
    if (label && label.length > LABEL_MAX_LENGTH) problems.push(`edge label too long (${label.length} > ${LABEL_MAX_LENGTH}): "${label}"`);
    if (label && wrapLabel(label, LABEL_CHARS_PER_LINE, 2).some((line) => line.endsWith('...'))) {
      problems.push(`edge label does not fit on two lines: "${label}"`);
    }
  });
  if (problems.length > 0) return problems;

  const layout = layoutDiagram(spec);
  layout.edges.forEach((edge) => {
    const name = `edge ${edge.from} -> ${edge.to}`;
    layout.nodes
      .filter((node) => node.id !== edge.from && node.id !== edge.to)
      .forEach((node) => {
        for (let index = 0; index < edge.points.length - 1; index += 1) {
          if (segmentHitsRect(edge.points[index], edge.points[index + 1], node, 3)) {
            problems.push(`${name} passes through node "${node.id}"`);
            break;
          }
        }
        if (edge.labelLines.length && rectsOverlap(edge.labelBox, node, 2)) {
          problems.push(`label of ${name} overlaps node "${node.id}"`);
        }
      });
    if (edge.labelLines.length) {
      [layout.nodes.find((node) => node.id === edge.from), layout.nodes.find((node) => node.id === edge.to)].forEach((node) => {
        if (rectsOverlap(edge.labelBox, node, 1)) problems.push(`label of ${name} overlaps its own node "${node.id}"`);
      });
    }
  });

  // Labels must not overlap each other.
  const labelled = layout.edges.filter((edge) => edge.labelLines.length);
  for (let i = 0; i < labelled.length; i += 1) {
    for (let j = i + 1; j < labelled.length; j += 1) {
      if (rectsOverlap(labelled[i].labelBox, labelled[j].labelBox, 1)) {
        problems.push(`labels of edge ${labelled[i].from}->${labelled[i].to} and ${labelled[j].from}->${labelled[j].to} overlap`);
      }
    }
  }
  return problems;
}
