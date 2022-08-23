/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const linkElement = (graph: any) => {
  const linkEnter = graph
    .append("path")
    .attr("class", "topo-call")
    .attr("marker-end", "url(#arrow)")
    .attr("stroke", "#97B0F8")
    .attr("d", (d: any) => {
      const controlPos = computeControlPoint(
        [d.source.x, d.source.y - 5],
        [d.target.x, d.target.y - 5],
        0.5
      );
      return (
        "M" +
        d.source.x +
        " " +
        (d.source.y - 5) +
        " " +
        "Q" +
        controlPos[0] +
        " " +
        controlPos[1] +
        " " +
        d.target.x +
        " " +
        (d.target.y - 5)
      );
    });
  return linkEnter;
};
export const anchorElement = (graph: any, funcs: any, tip: any) => {
  const linkEnter = graph
    .append("circle")
    .attr("class", "topo-line-anchor")
    .attr("r", 5)
    .attr("fill", "#97B0F8")
    .attr("transform", (d: any) => {
      const controlPos = computeControlPoint(
        [d.source.x, d.source.y - 5],
        [d.target.x, d.target.y - 5],
        0.5
      );
      const p = quadraticBezier(
        0.5,
        { x: d.source.x, y: d.source.y - 5 },
        { x: controlPos[0], y: controlPos[1] },
        { x: d.target.x, y: d.target.y - 5 }
      );
      return `translate(${p[0]}, ${p[1]})`;
    })
    .on("mouseover", function (event: unknown, d: unknown) {
      tip.html(funcs.tipHtml).show(d, this);
    })
    .on("mouseout", function () {
      tip.hide(this);
    })
    .on("click", (event: unknown, d: unknown) => {
      funcs.handleLinkClick(event, d);
    });
  return linkEnter;
};
export const arrowMarker = (graph: any) => {
  const defs = graph.append("defs");
  const arrow = defs
    .append("marker")
    .attr("id", "arrow")
    .attr("class", "topo-line-arrow")
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", "8")
    .attr("markerHeight", "8")
    .attr("viewBox", "0 0 12 12")
    .attr("refX", "10")
    .attr("refY", "6")
    .attr("orient", "auto");
  const arrowPath = "M2,2 L10,6 L2,10 L6,6 L2,2";

  arrow.append("path").attr("d", arrowPath).attr("fill", "#97B0F8");
  return arrow;
};
// Control Point coordinates of quadratic Bezier curve
function computeControlPoint(ps: number[], pe: number[], arc = 0.5) {
  const deltaX = pe[0] - ps[0];
  const deltaY = pe[1] - ps[1];
  const theta = Math.atan(deltaY / deltaX);
  const len = (Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 2) * arc;
  const newTheta = theta - Math.PI / 2;
  return [
    (ps[0] + pe[0]) / 2 + len * Math.cos(newTheta),
    (ps[1] + pe[1]) / 2 + len * Math.sin(newTheta),
  ];
}
// Point coordinates of quadratic Bezier curve
/**
 * @param t [0, 1]
 * @param ps start position
 * @param pc control position
 * @param pe end position
 * @returns a position in the line
 */
function quadraticBezier(
  t: number,
  ps: { x: number; y: number },
  pc: { x: number; y: number },
  pe: { x: number; y: number }
) {
  const x = (1 - t) * (1 - t) * ps.x + 2 * t * (1 - t) * pc.x + t * t * pe.x;
  const y = (1 - t) * (1 - t) * ps.y + 2 * t * (1 - t) * pc.y + t * t * pe.y;
  return [x, y];
}