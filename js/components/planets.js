import {
  dragGroup,
  tweenRotation,
  tweenElement,
  tweenPosition,
  tweenOpacity,
  tweenBodies,
  showCompetencies,
  hideCompetencies,
} from "./paperUtilities.js";
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
  data = {}
) {
  let circleGroup = new Group();
  circleGroup.name = title;
  circleGroup.parent = parent;
  circleGroup.pivot = [x, y];
  circleGroup.applyMatrix = false;

  if (title) {
    let rectangleGroup = new Group();
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
      center: [x, y],
      radius: r + 4,
      strokeColor: color,
      strokeWidth: 2,
      parent: circleGroup,
      opacity: 0,
      parent: circleGroup,
    });
    var text = new PointText({
      position: [rectX, rectY + 6],
      parent: rectangleGroup,
      content: title,
      fontSize: fontSize,
      fontFamily: "Poppins",
      justification: align,
      fillColor: "black",
    });

    rect.bounds.width = text.bounds.width + 20;
    rect.position = text.position;

    circleGroup.onMouseUp = function (e) {
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
      system.dragging = false;
    };
    circleGroup.onMouseEnter = function (e) {
      console.log("state", system.state.open);
      if (data.moon === undefined || system.state.open === true) {
        document.getElementById("paperCanvas").style.cursor = "pointer";

        circleGroup.children[2].opacity = 1;
      }
    };
    circleGroup.onMouseLeave = function (e) {
      if (data.moon === undefined || system.state.open === true) {
        document.getElementById("paperCanvas").style.cursor = "default";
        circleGroup.children[2].opacity = 0;
      }
    };

    // rectangleGroup.onMouseEnter = function (event) {
    //   document.getElementById("paperCanvas").style.cursor = "grab";
    // };
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
