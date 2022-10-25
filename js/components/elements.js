export function grabHandle(x, y) {
  let color = "#fff";
  let rectColor = "#e9e9e9";
  let strokeWidth = 2;
  let length = 13;
  let gap = 2;
  let spacing = 5;

  let handle = new Group();
  let grabRect = new Path.Rectangle({
    center: [x + gap * 4, y],
    size: [length + gap * 4, 50],
    fillColor: rectColor,
    parent: handle,
  });
  let line1 = new Path.Line({
    from: [x + length + gap, y - spacing],
    to: [x + gap, y - spacing],
    strokeColor: color,
    strokeWidth: strokeWidth,
    parent: handle,
  });
  let line2 = new Path.Line({
    from: [x + length + gap, y],
    to: [x + gap, y],
    strokeColor: color,
    strokeWidth: strokeWidth,
    parent: handle,
  });
  let line3 = new Path.Line({
    from: [x + length + gap, y + spacing],
    to: [x + gap, y + spacing],
    strokeColor: color,
    strokeWidth: strokeWidth,
    parent: handle,
  });
  return handle;
}

export function Arrow(x, y, width, height, parent) {
  let arrowPoint = new Point(x, y);
  let arrowWidth = width;
  let arrowHeight = height;

  let arrowGroup = new Group();
  if (parent) arrowGroup.parent = parent;

  let arrowCircle = new Path.Circle({
    center: arrowPoint,
    radius: arrowHeight * 2,
    fillColor: "white",
    parent: arrowGroup,
  });

  let arrowLine = new Path.Line({
    from: [arrowPoint.x - width, arrowPoint.y],
    to: [arrowPoint.x + width, arrowPoint.y],
    strokeColor: "black",
    strokeWidth: 3,
    parent: arrowGroup,
  });

  let arrowSegments = new Path({
    segments: [
      [arrowPoint.x, arrowPoint.y - arrowHeight],
      [arrowPoint.x + arrowWidth, arrowPoint.y],
      [arrowPoint.x, arrowPoint.y + arrowHeight],
    ],
    strokeColor: "black",
    strokeWidth: 3,
    parent: arrowGroup,
  });
  if (arrowGroup.opacity > 0) {
    arrowGroup.onMouseEnter = function (e) {
      document.getElementById("paperCanvas").style.cursor = "pointer";
      arrowCircle.fillColor = "grey";
    };
    arrowGroup.onMouseLeave = function (e) {
      document.getElementById("paperCanvas").style.cursor = "default";
      arrowCircle.fillColor = "white";
    };
  }

  return arrowGroup;
}

export function SystemBody(
  title,
  x,
  y,
  r,
  align = "center",
  labelSpacing,
  fontSize,
  color,
  rectBg,
  parent
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

    return circleGroup;
  }
}

export function LevelGroup(x, y, name, parent) {
  let levelGroup = new Group();
  levelGroup.name = name;
  levelGroup.pivot = [x, y];
  levelGroup.applyMatrix = false;
  levelGroup.dragging = false;
  levelGroup.offset = false;

  if (parent) {
    levelGroup.parent = parent;
  }

  return levelGroup;
}
