// extend paper Base class
// https://gist.github.com/lehni/1139726

let dragAngle;
let levelOneAngle;
let levelOne;
let levelTwo;
let levelThree;
let background;

let labelSpacing = 90;
let levelOneRadius = 200;

let competencies = [
  {
    title: "Thinking",
    color: "#009AFE",
  },

  {
    title: "Awareness",
    color: "#FE196B",
  },

  {
    title: "Creating",
    color: "#FCA500",
  },
  {
    title: "Managing",
    color: "#6622CC",
  },
  {
    title: "Being",
    color: "#A0EC32",
  },
];

paper.install(window);
window.onload = function () {
  // let height = paper.project.view.viewSize.height;

  //paper setup
  paper.setup("myCanvas");
  let width = paper.view.size.width;
  let height = paper.view.size.height;

  background = new Path.Rectangle({
    point: [0, 0],
    size: [width, height],
    fillColor: "#F5F5F5",
  });

  let pivotMarker = new Path.Circle({
    center: view.bounds.center,
    radius: levelOneRadius,
    strokeColor: "#9B96F4",
    strokeWidth: 1,
    strokeCap: "round",
    dashArray: [10, 12],
  });

  levelOne = new Group();
  levelTwo = new Group();
  levelThree = new Group();
  levelOne.applyMatrix = false;
  levelOne.pivot = view.bounds.center;
  levelOne.dragging = false;

  competencies.forEach((competency, a) => {
    let angle = Math.radians(360 / competencies.length) * a;
    let r = levelOneRadius;
    let x = r * Math.cos(angle);
    let y = r * Math.sin(angle);

    let circle = makeCircle(
      competency.title,
      width / 2 + x,
      height / 2 + y,
      50,
      competency.color,
      levelOne
    );
  });

  // for (let a = 0; a < Math.PI * 2; a += Math.radians(30)) {
  //   let r = 300;
  //   let x = r * Math.cos(a);
  //   let y = r * Math.sin(a);

  //   console.log(x, y);
  //   let circle = makeCircle(width / 2 + x, height / 2 + y, 50, "red", levelOne);
  // }

  levelOne.position = view.bounds.center;

  view.onFrame = function (event) {
    // let rot = 1;
    // levelOne.rotate(rot);
    // levelOne.children.forEach((child) => {
    //   child.rotate(-rot);
    // });
  };
  // if not doing animation then use this to draw
  //view.draw();

  levelOne.onMouseUp = function (e) {
    levelOne.dragging = false;
  };
};

function makeCircle(title, x, y, r, color, parent) {
  let circleGroup = new Group();
  circleGroup.parent = parent;
  circleGroup.pivot = [x, y];
  circleGroup.applyMatrix = false;

  let rectangleGroup = new Group();
  rectangleGroup.parent = circleGroup;

  let whiteRect = new Path.Rectangle({
    center: [x, y + labelSpacing],
    size: [title.length * 13 + 30, 50],
    fillColor: "white",
    parent: rectangleGroup,
  });
  let circle = new Path.Circle({
    center: [x, y],
    radius: r,
    fillColor: color,
    parent: circleGroup,
  });
  var text = new PointText({
    position: [x, y + labelSpacing + 6],
    parent: rectangleGroup,
    content: title,
    fontSize: 20,
    fontFamily: "Poppins",
    justification: "center",
    fillColor: "black",
  });

  circle.onMouseEnter = function (e) {
    circle.fillColor = "grey";
  };
  circle.onMouseLeave = function (e) {
    circle.fillColor = color;
  };

  rectangleGroup.onMouseDrag = function (e) {
    dragGroup(e, levelOne);
  };

  return circleGroup;
}

function dragGroup(e, group) {
  //only do this when you start to drag
  if (!group.dragging) {
    group.dragging = true;
    group.storeAngle = e.point.subtract(group.position).angle - group.rotation;
  }
  // find the angle between drag point and group centre
  let delta = e.point.subtract(group.position);
  let rotation = delta.angle - group.storeAngle;
  group.rotation = rotation;
  // counter rotate the children
  group.children.forEach((child) => {
    child.rotation = -rotation;
  });
}

// Helper functions for radians and degrees.
Math.radians = function (degrees) {
  return (degrees * Math.PI) / 180;
};

Math.degrees = function (radians) {
  return (radians * 180) / Math.PI;
};

// linearly maps value from the range (a..b) to (c..d)
function mapRange(value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}

function dist(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
