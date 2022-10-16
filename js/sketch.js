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
let leveOneMinFontSize = 12;
let levelTwoMinFontSize = 8;

let planets = [];
let rotationSpeed = 0.03;

let scaleObjects;

paper.install(window);
window.onload = function () {
  //paper setup
  paper.setup("paperCanvas");
  console.log(paper);
  prevWidth = width = paper.view.size.width;
  prevHeight = height = paper.view.size.height;

  levelOneRadius = width / 7;
  levelTwoRadius = width / 4;

  background = new Path.Rectangle({
    center: view.bounds.center,
    size: [width * 10, height * 10],
    fillColor: "#F5F5F5",
  });

  // level one

  let dash1 = dashedCircle(
    view.bounds.center,
    levelOneRadius,
    "#9B96F4",
    1,
    "round",
    [10, 12]
  );

  // level two
  let dash2 = dashedCircle(
    view.bounds.center,
    levelTwoRadius,
    "#9B96F4",
    1,
    "round",
    [10, 12]
  );

  levelOne = levelGroup(0, 0);
  levelTwo = levelGroup(0, 0, levelOne);

  scaleObjects = [dash1, dash2, levelOne, background];

  competencies.forEach((competency, a) => {
    let angle = radians(360 / competencies.length) * a;
    let r = levelOneRadius;
    let x = r * Math.cos(angle);
    let y = r * Math.sin(angle);
    let rectBg = new Color(1, 1, 1, 0.8);

    const rotationAngle = a > 0 ? 360 - degrees(angle) : 0;

    let circle = makeCircle(
      competency.title,
      x,
      y,
      40,
      80,
      clamp(width / 80, levelTwoMinFontSize, levelTwoMaxFontSize),
      competency.color,
      rectBg,
      levelOne,
      planets,
      levelOne,
      rotationAngle
    );

    planets.push(circle);
  });

  competencies.forEach((competency, i) => {
    competency.children?.forEach((child, j) => {
      if (!child) return;

      console.log(
        child.title,
        360 - degrees(radians(360 / competencies.length) * i)
      );

      const rotationAngle =
        i > 0 ? 360 - degrees(radians(360 / competencies.length) * i) : 0;

      let angle =
        radians(360 / competencies.length) * i +
        radians(360 / competencies.length / competency.children.length) * j;
      let r = levelTwoRadius;
      let x = r * Math.cos(angle);
      let y = r * Math.sin(angle);

      let rectBg = new Color(1, 1, 1, 0.01);
      let circle = makeCircle(
        child.title,
        x,
        y,
        20,
        40,
        13,
        child.color,
        rectBg,
        levelTwo,
        planets,
        levelOne,
        rotationAngle
      );

      planets.push(circle);
    });
  });

  levelOne.position = view.bounds.center;

  view.onFrame = function (event) {
    if (!levelOne.dragging) {
      // rotateGroup(levelOne.rotation + rotationSpeed, levelOne, planets);
    }
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
