/**
 * Serializes a diagram spec into an uncompressed draw.io (diagrams.net)
 * `.drawio` XML document that opens and edits natively in draw.io.
 * Geometry comes from layoutDiagram() so the file matches the on-site SVG.
 */

import { layoutDiagram, kindColor } from './diagram.js';

/** Escapes text for safe use inside an XML attribute value. */
function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Builds the draw.io XML string for a diagram.
 * @param {import('./diagram.js').DiagramSpec} spec
 * @param {string} diagramId - stable id used for the diagram page
 * @returns {string} complete .drawio file contents
 */
export function toDrawioXml(spec, diagramId) {
  const layout = layoutDiagram(spec);
  const cells = [];
  let cellCounter = 2;
  const nextId = () => `c${cellCounter++}`;

  layout.groups.forEach((group) => {
    cells.push(
      `<mxCell id="${nextId()}" value="${escapeXml(group.label)}" style="rounded=1;arcSize=3;dashed=1;dashPattern=6 4;fillColor=none;strokeColor=#879596;strokeWidth=2;verticalAlign=top;align=left;spacingLeft=12;spacingTop=4;fontStyle=1;fontSize=13;fontColor=#545b64;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="${group.x}" y="${group.y}" width="${group.w}" height="${group.h}" as="geometry"/></mxCell>`
    );
  });

  const vertexIdByNode = {};
  layout.nodes.forEach((node) => {
    const id = nextId();
    vertexIdByNode[node.id] = id;
    const color = kindColor(node.kind);
    cells.push(
      `<mxCell id="${id}" value="${escapeXml(node.label)}" style="rounded=1;arcSize=12;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=${color};strokeWidth=3;fontColor=#232f3e;fontStyle=1;fontSize=12;shadow=0;" vertex="1" parent="1"><mxGeometry x="${node.x}" y="${node.y}" width="${node.w}" height="${node.h}" as="geometry"/></mxCell>`
    );
  });

  layout.edges.forEach((edge) => {
    const dash = edge.dashed ? 'dashed=1;dashPattern=6 4;' : '';
    cells.push(
      `<mxCell id="${nextId()}" value="${escapeXml(edge.label)}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;html=1;endArrow=block;endFill=1;strokeColor=#545b64;strokeWidth=2;fontSize=11;fontColor=#232f3e;labelBackgroundColor=#ffffff;${dash}" edge="1" parent="1" source="${vertexIdByNode[edge.from]}" target="${vertexIdByNode[edge.to]}"><mxGeometry relative="1" as="geometry"/></mxCell>`
    );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" agent="aws-saa-prep" version="24.0.0" type="device">
  <diagram id="${escapeXml(diagramId)}" name="${escapeXml(spec.title)}">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${Math.ceil(layout.width)}" pageHeight="${Math.ceil(layout.height)}" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        ${cells.join('\n        ')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
`;
}
