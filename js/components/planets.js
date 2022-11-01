import {
  dragGroup,
  tweenRotation,
  tweenElement,
  tweenPosition,
  tweenOpacity,
  tweenBodies,
  showCompetencies,
  hideCompetencies,
  visibleFalse,
} from "./paperUtilities.js";
import { competencies } from "../data.js";

import { SystemBody } from "./elements.js";

let labelSpacing = 90;
let rotationTime = 2000;

export function makeCircle(
  title,
  x,
  y,
  r,
  align = "center",
  labelSpacing,
  fontSize,
  color,
  rectBg,
  parent,
  subBodies,
  system = parent,
  containerGroup,
  rotationAngle = 0,
  data = {},
  link = null
) {
  let circleGroup = new Group({
    name: "circleGroup",
  });
  circleGroup.name = title;
  circleGroup.parent = parent;
  circleGroup.pivot = [x, y];
  circleGroup.applyMatrix = false;

  if (title) {
    let rectangleGroup = new Group({
      name: "rectangleGroup",
    });
    rectangleGroup.parent = circleGroup;

    let rectY = y + labelSpacing;
    let rectX = x;
    if (align === "center") {
      rectY = y + labelSpacing;
      rectX = x;
    } else if (align === "left") {
      rectY = y;
      rectX = x + labelSpacing;
    }

    let rectWidth = title.length * fontSize * 0.8;

    let rect = new Path.Rectangle({
      center: [rectX, rectY],
      size: [200, fontSize * 3],
      fillColor: rectBg,
      parent: rectangleGroup,
    });

    //   let handle = grabHandle(x - rectWidth / 2 - 15, rectY);
    //   handle.parent = rectangleGroup;

    let circle = new Path.Circle({
      center: [x, y],
      radius: r,
      fillColor: color,
      parent: circleGroup,
    });
    let circleRing = new Path.Circle({
      name: "circleRing",
      center: [x, y],
      radius: r + 4,
      strokeColor: color,
      strokeWidth: 2,
      parent: circleGroup,
      opacity: 0,
      parent: circleGroup,
    });
    var text = new PointText({
      name: "text",
      position: [rectX, rectY + 6],
      parent: rectangleGroup,
      content: title,
      fontSize: fontSize,
      fontWeight: 500,
      fontFamily: "Poppins",
      justification: align,
      fillColor: "black",
    });
    if (data.moon !== undefined) {
      let line = new Path.Line({
        name: "line",
        from: [rectX, rectY + 8],
        to: [rectX + text.bounds.width, rectY + 8],
        strokeColor: "black",
        strokeWidth: 1,
        parent: rectangleGroup,
        opacity: 0,
      });
    }

    rect.bounds.width = text.bounds.width + 20;
    rect.position = text.position;

    circleGroup.onMouseUp = function (e) {
      if (circleGroup.currentSelection) {
        link && !system.dragging && window.open(link, "_parent");
      } else {
        tweenRotation(rotationAngle, rotationTime, system, subBodies);
        tweenBodies(data, system, e.target);
        system.state.currentBody = data;

        // if (
        //   (parent.name == "levelTwo" ||
        //     parent.name == "levelThree" ||
        //     title === "Being" ||
        //     title === "Awareness") &&
        //   !system.showCompetencies
        // ) {
        showCompetencies(system);
        system.showCompetencies = true;
        // }
      }

      // remove startmessage if it exists
      if (system.startMessage.visible) {
        tweenOpacity(0, 500, system.startMessage, () => {
          visibleFalse(system.startMessage);
        });
        system.state.clicked = true;
      }
      system.dragging = false;
    };
    circleGroup.onMouseEnter = function (e) {
      document.getElementById("paperCanvas").style.cursor = "pointer";
      circleGroup.children.circleRing.opacity = 1;
      if (circleGroup.children.rectangleGroup.children.line)
        circleGroup.children.rectangleGroup.children.line.opacity = 1;

      if (system.state.open === true) {
      }
    };
    circleGroup.onMouseLeave = function (e) {
      document.getElementById("paperCanvas").style.cursor = "default";
      if (!circleGroup.active) circleGroup.children.circleRing.opacity = 0;
      if (data.moon === undefined || system.state.open === true) {
      }

      if (circleGroup.children.rectangleGroup.children.line)
        circleGroup.children.rectangleGroup.children.line.opacity = 0;
    };

    rectangleGroup.onMouseUp = function (event) {
      link && !system.dragging && window.open(link, "_parent");
    };
    // rectangleGroup.onMouseLeave = function (event) {
    //   document.getElementById("paperCanvas").style.cursor = "default";
    // };

    // circle.onMouseDrag = function (e) {
    //   dragGroup(e, system, subBodies);
    // };
    rectangleGroup.onMouseDrag = function (e) {
      dragGroup(e, system, subBodies);
    };
  }

  circleGroup.data = data;
  return circleGroup;
}

export function dashedCircle(
  center,
  radius,
  strokeColor,
  strokeWidth,
  strokeCap,
  dashArray,
  parent
) {
  let circle = new Path.Circle({
    center: center,
    radius: radius,
    strokeColor: strokeColor,
    strokeWidth: strokeWidth,
    strokeCap: strokeCap,
    dashArray: dashArray,
  });
  if (parent) {
    circle.parent = parent;
  }
  return circle;
}
