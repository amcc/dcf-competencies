import { radians, degrees, clamp } from "./components/utilities.js";
import { rotateGroup, levelGroup } from "./components/paperUtilities.js";
import { makeCircle, dashedCircle } from "./components/planets.js";
import { competencies } from "./data.js";

// extend paper Base class
// https://gist.github.com/lehni/1139726

let width, height;
let prevWidth, prevHeight;
let dragAngle;
let levelOneAngle;
let levelOne;
let levelTwo;
let background;

let levelOneRadius;
let levelTwoRadius;

let leveOneMaxFontSize = 18;
let levelTwoMaxFontSize = 13;
let levelOneMinFontSize = 12;
let levelTwoMinFontSize = 8;

let planets = [];
let rotationSpeed = 0.03;

let scaleObjects;

let textInfo;

paper.install(window);
window.onload = function () {
  //paper setup
  paper.setup("paperCanvas");
  console.log(paper);
  prevWidth = width = paper.view.size.width;
  prevHeight = height = paper.view.size.height;

  levelOneRadius = width / 7;
  levelTwoRadius = width / 3;

  background = new Path.Rectangle({
    center: view.bounds.center,
    size: [width * 10, height * 10],
    fillColor: "#F5F5F5",
  });

  let containerGroup = levelGroup(0, 0, "containerGroup");

  let dash1 = dashedCircle(
    view.bounds.center,
    levelOneRadius,
    "#9B96F4",
    1,
    "round",
    [10, 12],
    containerGroup
  );

  let dash2 = dashedCircle(
    view.bounds.center,
    levelTwoRadius,
    "#9B96F4",
    1,
    "round",
    [10, 12],
    containerGroup
  );

  levelOne = levelGroup(0, 0, "levelOne", containerGroup);
  levelTwo = levelGroup(0, 0, "levelTwo", levelOne);

  scaleObjects = [dash1, dash2, levelOne, background];

  competencies.forEach((competency, a) => {
    let angle = radians(360 / competencies.length) * a;
    let r = levelOneRadius;
    let x = r * Math.cos(angle);
    let y = r * Math.sin(angle);
    let rectBg = new Color(1, 1, 1, 0.8);

    const rotationAngle = 360 - degrees(angle);

    let circle = makeCircle(
      competency.title,
      x,
      y,
      40,
      68,
      clamp(width / 80, levelOneMinFontSize, levelTwoMaxFontSize),
      competency.color,
      rectBg,
      levelOne,
      planets,
      levelOne,
      containerGroup,
      rotationAngle
    );

    planets.push(circle);
  });

  competencies.forEach((competency, i) => {
    competency.children?.forEach((child, j) => {
      if (!child) return;

      const rotationAngle =
        360 - degrees(radians(360 / competencies.length) * i);

      let angle =
        radians(360 / competencies.length) * i +
        radians(360 / competencies.length / competency.children.length) * j;
      let r = levelTwoRadius;
      let x = r * Math.cos(angle);
      let y = r * Math.sin(angle);

      let rectBg = new Color(1, 0, 1, 0);
      let circle = makeCircle(
        child.title,
        x,
        y,
        20,
        40,
        clamp(width / 80, levelTwoMinFontSize, levelTwoMaxFontSize),
        child.color,
        rectBg,
        levelTwo,
        planets,
        levelOne,
        containerGroup,
        rotationAngle
      );

      planets.push(circle);
    });
  });

  levelOne.position = view.bounds.center;

  textInfo = new PointText({
    position: [10, 40],
    content: "info",
    fontSize: 10,
    fontFamily: "Poppins",
    justification: "left",
    fillColor: "black",
  });

  view.onFrame = function (event) {
    if (!levelOne.dragging) {
      // rotateGroup(levelOne.rotation + rotationSpeed, levelOne, planets);
    }
    textInfo.content = `rotation: ${levelOne.rotation}`;
  };

  view.onResize = function (event) {
    width = paper.view.size.width;
    height = paper.view.size.height;
    scaleObjects.forEach((object) => {
      object.scale(width / prevWidth);
      object.position = view.bounds.center;
    });

    prevWidth = paper.view.size.width;
    prevHeight = paper.view.size.height;
  };

  levelOne.onMouseUp = function (e) {
    levelOne.dragging = false;
  };
};
