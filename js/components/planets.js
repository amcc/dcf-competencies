import {
  dragGroup,
  tweenRotation,
  tweenElement,
  tweenPosition,
  tweenOpacity,
} from "./paperUtilities.js";
import { grabHandle } from "./elements.js";

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
  planets,
  system = parent,
  containerGroup,
  rotationAngle = 0
) {
  let circleGroup = new Group();
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

    circle.onMouseUp = function (e) {
      // console.log("at", system.rotation, "goto", rotationAngle);
      tweenRotation(rotationAngle, rotationTime, system, planets);
      // if (!system.offset) {
      // }
      if (
        parent.name == "levelTwo" ||
        title === "Being" ||
        title === "Awareness"
      ) {
        let newpos = [-view.bounds.width / 3, 0];
        // system.pivot = newpos;
        tweenPosition(newpos, rotationTime, containerGroup);
        tweenOpacity(1, rotationTime, system.children.levelThree);
        console.log("clicked", e.target);
      } else {
        let newpos = [0, 0];
        // system.pivot = newpos;
        tweenPosition(newpos, rotationTime, containerGroup);
        tweenOpacity(0, rotationTime, system.children.levelThree);
      }
      system.dragging = false;
    };
    circle.onMouseEnter = function (e) {
      document.getElementById("paperCanvas").style.cursor = "pointer";
      circle.fillColor = "grey";
    };
    circle.onMouseLeave = function (e) {
      document.getElementById("paperCanvas").style.cursor = "default";
      circle.fillColor = color;
    };

    rectangleGroup.onMouseEnter = function (event) {
      document.getElementById("paperCanvas").style.cursor = "grab";
    };
    rectangleGroup.onMouseLeave = function (event) {
      document.getElementById("paperCanvas").style.cursor = "default";
    };

    // circle.onMouseDrag = function (e) {
    //   dragGroup(e, system, planets);
    // };
    rectangleGroup.onMouseDrag = function (e) {
      dragGroup(e, system, planets);
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
