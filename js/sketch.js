import { radians, degrees, clamp } from "./components/utilities.js";
import {
  rotateGroup,
  dragGroup,
  hideCompetencies,
  tweenOpacity,
  visibleFalse,
} from "./components/paperUtilities.js";
import { makeCircle, dashedCircle } from "./components/planets.js";
import { TextElement, CloseButton, LevelGroup } from "./components/elements.js";
import { competencies } from "./data.js";
import { buildMenu } from "./components/createHtml.js";

// extend paper Base class
// https://gist.github.com/lehni/1139726

let width, height, maxDim, minDim;
let prevWidth, prevHeight;
let dragAngle;
let levelOneAngle;
let levelOne;
let levelTwo;
let levelThree;
let background;

let everythingScale = 0.8;

let levelOneRadius;
let levelTwoRadius;
let levelThreeRadius;
let levelOneBodyRadius = 16;
let levelTwoBodyRadius = 50;
let levelThreeBodyRadius = 60;

let levelOneMaxFontSize = 18;
let levelTwoMaxFontSize = 15;
let levelOneMinFontSize = 15;
let levelTwoMinFontSize = 20;

let subBodies = [];
let bodies = [];
let planets = [];
let moons = [];
let openUi = [];
let planetCount = 0;
let moonCount = 0;
let rotationSpeed = 0.03;

let scaleObjects;

let textInfo;

paper.install(window);
window.onload = function () {
  //paper setup
  paper.setup("paperCanvas");
  prevWidth = width = paper.view.size.width;
  prevHeight = height = paper.view.size.height;

  setup();

  buildMenu(competencies, "competencies-menu");

  // textInfo = new PointText({
  //   position: [10, 40],
  //   content: "info",
  //   fontSize: 10,
  //   fontFamily: "Poppins",
  //   justification: "left",
  //   fillColor: "black",
  // });

  view.onFrame = function (event) {
    // if (!levelOne.dragging) {
    //   // rotateGroup(levelOne.rotation + rotationSpeed, levelOne, planets);
    // }
    // textInfo.content = `rotation: ${levelOne.rotation}`;
  };

  view.onResize = function (event) {
    setup();
  };

  function setup() {
    width = paper.view.size.width;
    height = paper.view.size.height;
    maxDim = Math.max(width, height);
    minDim = Math.min(width, height);

    prevWidth = paper.view.size.width;
    prevHeight = paper.view.size.height;

    paper.project.activeLayer.removeChildren();
    makeSystem();
  }

  function makeSystem() {
    levelOneRadius = maxDim / 7.8;
    levelTwoRadius = maxDim / 4;
    levelThreeRadius = maxDim / 2.7;

    let everything = LevelGroup(0, 0, "everything");
    background = new Path.Rectangle({
      center: view.bounds.center,
      size: [width * 10, height * 10],
      fillColor: "#F5F5F5",
      parent: everything,
    });
    let containerGroup = LevelGroup(0, 0, "containerGroup", everything);

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

    // the order below is important.
    // first make level one - then add the background for dragging, then the rest
    levelOne = LevelGroup(0, 0, "levelOne", containerGroup);

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

    levelTwo = LevelGroup(0, 0, "levelTwo", levelOne);
    levelThree = LevelGroup(0, 0, "levelThree", levelOne);
    levelThree.visible = false;

    levelThree.opacity = 0;

    scaleObjects = [dash1, dash2, dash3, levelOne, background];

    levelOne.position = view.bounds.center;

    let arrowSize = clamp((minDim / levelTwoBodyRadius) * 0.7, 10, 200);
    let close = new CloseButton(
      clamp(width - width / 10, width - 20, width - 40),
      clamp(width / 10, 20, 40),
      arrowSize,
      arrowSize,
      everything
    );
    close.onMouseUp = function (e) {
      hideCompetencies(levelOne);
    };
    openUi.push(close);
    close.opacity = 0;

    let activateText = new TextElement(
      width / 2,
      clamp(width / 10, 20, 40),
      "Click and drag to explore",
      levelOneMinFontSize,
      "center",
      everything
    );

    levelOneBackground.onMouseDown = function (e) {
      tweenOpacity(0, 500, activateText, () => {
        visibleFalse(activateText);
      });
      // console.log("oi");
    };

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
      let rectBg = new Color(1, 1, 1, 0);

      const rotationAngle = 360 - degrees(angle);

      let radius = maxDim / 27;
      let labelSpacing = radius * 1.4;

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
        // console.log(child.title, rotationAngle, degrees(angle));

        let r = levelTwoRadius;
        let x = r * Math.cos(angle);
        let y = r * Math.sin(angle);

        let rectBg = new Color(1, 0, 1, 0);

        let radius = maxDim / 40;
        let labelSpacing = radius * 1.4;

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

          // let fudge = 0;
          // if (competency.title === "Awareness") {
          let margin = radians(
            360 /
              competencies.length /
              competency.children.length /
              child.children.length /
              2
          );
          // } else if (competency.title === "Being") {
          //   fudge = 0.12;
          // }

          let angleMargin =
            radians(360 / competencies.length) -
            radians(
              360 /
                competencies.length /
                competency.children.length /
                child.children.length
            ) *
              k;
          let angle =
            margin +
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
            radians(48) +
            angleMargin / 8;
          let r = levelThreeRadius;
          let x = r * Math.cos(angle);
          let y = r * Math.sin(angle);

          let rectBg = new Color(1, 0, 1, 0);

          let radius = maxDim / 60;
          let labelSpacing = radius * 1.4;

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
            { sun: i, planet: j, moon: k },
            grandChild.url
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
    levelOne.ui = {
      open: openUi,
    };
    levelOne.settings = {
      rotationTime: 2000,
      container: containerGroup,
    };
    levelOne.state = {
      open: false,
      currentBody: null,
    };

    // everything.scale(everythingScale);
  }
};
