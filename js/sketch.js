import { radians, degrees, clamp } from "./components/utilities.js";
import {
  rotateGroup,
  levelGroup,
  dragGroup,
} from "./components/paperUtilities.js";
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
let levelThree;
let background;

let levelOneRadius;
let levelTwoRadius;
let levelThreeRadius;

let levelOneMaxFontSize = 18;
let levelTwoMaxFontSize = 13;
let levelOneMinFontSize = 12;
let levelTwoMinFontSize = 20;

let subBodies = [];
let bodies = [];
let planets = [];
let moons = [];
let planetCount = 0;
let moonCount = 0;
let rotationSpeed = 0.03;

let scaleObjects;

let textInfo;

paper.install(window);
window.onload = function () {
  //paper setup
  paper.setup("paperCanvas");
  // console.log(paper);
  prevWidth = width = paper.view.size.width;
  prevHeight = height = paper.view.size.height;

  makeSystem();

  // textInfo = new PointText({
  //   position: [10, 40],
  //   content: "info",
  //   fontSize: 10,
  //   fontFamily: "Poppins",
  //   justification: "left",
  //   fillColor: "black",
  // });

  view.onFrame = function (event) {
    if (!levelOne.dragging) {
      // rotateGroup(levelOne.rotation + rotationSpeed, levelOne, planets);
    }
    // textInfo.content = `rotation: ${levelOne.rotation}`;
  };

  view.onResize = function (event) {
    width = paper.view.size.width;
    height = paper.view.size.height;
    // scaleObjects.forEach((object) => {
    //   object.scale(width / prevWidth);
    //   object.position = view.bounds.center;
    // });

    prevWidth = paper.view.size.width;
    prevHeight = paper.view.size.height;

    paper.project.activeLayer.removeChildren();

    // levelOne.removeChildren();
    // levelTwo.removeChildren();
    // levelOne.addChild(levelTwo);
    makeSystem();
  };

  levelOne.onMouseUp = function (e) {
    levelOne.dragging = false;
  };

  function makeSystem() {
    levelOneRadius = width / 7.8;
    levelTwoRadius = width / 4;
    levelThreeRadius = width / 2.7;

    background = new Path.Rectangle({
      center: view.bounds.center,
      size: [width * 10, height * 10],
      fillColor: "#F5F5F5",
    });

    let levelOneBackground = new Path.Rectangle({
      center: view.bounds.center,
      size: [width * 10, height * 10],
      fillColor: "#F5F5F5",
      opacity: 0,
      parent: levelOne,
    });

    levelOneBackground.onMouseDrag = function (e) {
      dragGroup(e, levelOne, subBodies);
    };
    levelOneBackground.onMouseUp = function (e) {
      levelOne.dragging = false;
    };
    levelOneBackground.onMouseEnter = function (event) {
      document.getElementById("paperCanvas").style.cursor = "grab";
    };
    levelOneBackground.onMouseLeave = function (event) {
      document.getElementById("paperCanvas").style.cursor = "default";
    };

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

    let dash3 = dashedCircle(
      view.bounds.center,
      levelThreeRadius,
      "#9B96F4",
      1,
      "round",
      [10, 12],
      containerGroup
    );

    levelOne = levelGroup(0, 0, "levelOne", containerGroup);
    levelTwo = levelGroup(0, 0, "levelTwo", levelOne);
    levelThree = levelGroup(0, 0, "levelThree", levelOne);
    levelThree.opacity = 0;

    scaleObjects = [dash1, dash2, dash3, levelOne, background];

    levelOne.position = view.bounds.center;

    // count moons
    competencies.forEach((competency, i) => {
      competency.children?.forEach((child, j) => {
        planetCount++;
        child.children?.forEach((grandChild, k) => {
          moonCount++;
        });
      });
    });

    //make system
    competencies.forEach((competency, i) => {
      let angle = radians(360 / competencies.length) * i;
      let r = levelOneRadius;
      let x = r * Math.cos(angle);
      let y = r * Math.sin(angle);
      let rectBg = new Color(1, 1, 1, 0.8);

      const rotationAngle = 360 - degrees(angle);

      let radius = width / 27;
      let labelSpacing = radius * 1.8;

      let sun = makeCircle(
        competency.title,
        x,
        y,
        radius,
        "center",
        labelSpacing,
        levelOneMinFontSize,
        competency.color,
        rectBg,
        levelOne,
        subBodies,
        levelOne,
        containerGroup,
        rotationAngle,
        { sun: i }
      );
      sun.systemType = "sun";

      subBodies.push(sun);

      bodies.push({
        sun: sun,
        planets: [],
      });

      competency.children?.forEach((child, j) => {
        if (!child) return;

        // const rotationAngle =
        //   360 - degrees(radians(360 / competencies.length) * i);

        let angle =
          radians(360 / competencies.length) * i +
          radians(360 / competencies.length / competency.children.length) * j -
          radians(24);

        const rotationAngle = 360 - degrees(angle);

        let r = levelTwoRadius;
        let x = r * Math.cos(angle);
        let y = r * Math.sin(angle);

        let rectBg = new Color(1, 0, 1, 0);

        let radius = width / 50;
        let labelSpacing = radius * 1.8;

        // if (child.title) {
        let planet = makeCircle(
          child.title,
          x,
          y,
          radius,
          "center",
          labelSpacing,
          levelTwoMaxFontSize,
          child.color,
          rectBg,
          levelTwo,
          subBodies,
          levelOne,
          containerGroup,
          rotationAngle,
          { sun: i, planet: j }
        );
        planet.systemType = "planet";
        subBodies.push(planet);
        planets.push(planet);

        bodies[i].planets.push({
          planet: planet,
          moons: [],
        });
        // }

        child.children?.forEach((grandChild, k) => {
          if (!grandChild) return;
          const rotationAngle =
            360 - degrees(radians(360 / competencies.length) * i);

          let angle =
            radians(360 / competencies.length) * i +
            radians(360 / competencies.length / competency.children.length) *
              j +
            radians(
              360 /
                competencies.length /
                competency.children.length /
                child.children.length
            ) *
              k -
            radians(33);
          let r = levelThreeRadius;
          let x = r * Math.cos(angle);
          let y = r * Math.sin(angle);

          let rectBg = new Color(1, 0, 1, 0);

          let radius = width / 100;
          let labelSpacing = radius * 1.8;

          let moon = makeCircle(
            grandChild.title,
            x,
            y,
            radius,
            "left",
            labelSpacing,
            levelTwoMaxFontSize,
            grandChild.color,
            rectBg,
            levelThree,
            subBodies,
            levelOne,
            containerGroup,
            rotationAngle,
            { sun: i, planet: j, moon: k }
          );
          moon.systemType = "moon";
          moons.push(moon);
          subBodies.push(moon);

          bodies[i].planets[j].moons.push(moon);
        });
      });
    }); // made system
    levelOne.subBodies = subBodies;
    levelOne.planets = planets;
    levelOne.moons = moons;
    levelOne.bodies = bodies;
  }
};
