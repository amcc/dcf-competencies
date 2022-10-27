import { competencies } from "../data.js";

export function showCompetencies(system) {
  let newpos = [-view.bounds.width / 2.1, 0];
  // system.pivot = newpos;
  tweenPosition(
    newpos,
    system.settings.rotationTime,
    system.settings.container
  );

  system.children.levelThree.visible = true;

  tweenOpacity(1, system.settings.rotationTime, system.children.levelThree);

  // turn on competencies ui
  system.ui.open.forEach((element) => {
    tweenOpacity(1, 1000, element);
  });

  system.state.open = true;
}

export function hideCompetencies(system) {
  system.showCompetencies = false;
  let newpos = [0, 0];
  // system.pivot = newpos;
  tweenPosition(
    newpos,
    system.settings.rotationTime,
    system.settings.container
  );
  tweenOpacity(
    0,
    system.settings.rotationTime,
    system.children.levelThree,
    () => (system.children.levelThree.visible = false)
  );

  // turn on competencies ui
  system.ui.open.forEach((element) => {
    tweenOpacity(0, 1000, element);
  });

  // turn all planets on
  system.planets.forEach((planet) => {
    tweenOpacity(1, 1000, planet);
  });

  // change state
  system.state.open = false;
  // system.state.currentBody = data;
}

export function dragGroup(e, group, planets) {
  // group position is determined by looking at its parent (the container too)
  const groupPos = group.position.add(group.parent.position);
  //only do this when you start to drag
  if (!group.dragging) {
    group.dragging = true;
    group.storeAngle = e.point.subtract(groupPos).angle - group.rotation;
  }
  // find the angle between drag point and group centre
  let delta = e.point.subtract(groupPos);
  let rotation = delta.angle - group.storeAngle;
  rotateGroup(rotation, group, planets);
}

export function rotateGroup(rotation, group, planets) {
  group.rotation = rotation;
  // counter rotate the children
  //   group.children.forEach((child) => {
  //     child.rotation = -rotation;
  //   });
  if (planets) {
    planets.forEach((planet) => {
      planet.rotation = -rotation;
    });
  }
}

export function tweenRotation(rotation, time, group, planets) {
  if (
    (group.rotation === 0 || group.rotation === 360) &&
    (rotation === 360 || rotation === 0)
  )
    return;

  // if (rotation > 360) rotation = rotation - 360;
  const r1 = 360 - rotation + group.rotation;
  const r2 = group.rotation - rotation;
  // rotation = r1 < r2 ? r1 : r2;

  console.log("current rotation", group.rotation);
  console.log("rotate to", rotation);
  // if (group.rotation < 0) Math.abs((group.rotation = 360 + group.rotation));
  let tween = group.tween(
    { rotation: group.rotation },
    { rotation: rotation },
    { duration: time, easing: "easeInOutQuad" }
  );
  if (planets) {
    planets.forEach((planet, i) => {
      // if (planet.rotation < 0)
      // Math.abs((planet.rotation = 360 + planet.rotation));
      let planetTween = planet.tween(
        { rotation: planet.rotation },
        { rotation: planet.rotation - (rotation - group.rotation) },
        { duration: time, easing: "easeInOutQuad" }
      );
    });
  }
}

export function tweenElement(
  time,
  group,
  planets,
  rotation = null,
  position = null
) {
  const diff = rotation - group.rotation;
  // if (group.rotation < 0) {
  //   rotation = rotation - group.rotation;
  // }
  group.tween(
    { rotation: group.rotation, position: group.position },
    { rotation: rotation, position: position },
    { duration: time, easing: "easeInOutQuad" }
  );
  if (planets) {
    planets.forEach((planet, i) => {
      planet.tween(
        { rotation: planet.rotation },
        { rotation: -rotation },
        { duration: time, easing: "easeInOutQuad" }
      );
    });
  }
}

export function tweenPosition(position, time, group, thenFunction = null) {
  let tween = group.tween(
    { position: group.position },
    { position: position },
    { duration: time, easing: "easeInOutQuad" }
  );
  if (thenFunction) {
    tween.then(thenFunction);
  }
}

export function tweenOpacity(opacity, time, group, thenFunction = null) {
  let tween = group.tween(
    { opacity: group.opacity },
    { opacity: opacity },
    { duration: time, easing: "easeInOutQuad" }
  );
  if (thenFunction) {
    tween.then(thenFunction);
  }
}

// understand which planet is clicked on and tween its moons
// data shows the body that has been clicked on with info about its sun, planet, moons
export function tweenBodies(data, system, target, thenFunction = null) {
  const bodies = system.bodies;
  let sun = data.sun;
  let planet = data.planet;
  let moon = data.moon;

  let body;
  if (sun !== undefined) body = bodies[sun];
  if (planet !== undefined) body = bodies[sun].planets[planet];
  if (moon !== undefined) body = bodies[sun].planets[planet].moons[moon];

  // turn on planets
  if (body.sun || (!body.sun && !body.planet)) {
    system.planets.forEach((planet) => {
      tweenOpacity(1, 1000, planet);
      resetBody(planet);
    });
  }
  if (body.planet) {
    // dim planets
    system.planets.forEach((planet) => {
      resetBody(planet);
    });
    target.children.circleRing.opacity = 1;
    target.active = true;
  }

  if (body.moons?.length > 0) {
  }
  system.moons.forEach((moon) => {
    tweenOpacity(0.5, 1000, moon);
    moon.children.rectangleGroup.visible = false;
  });

  body.moons?.forEach((moon) => {
    tweenOpacity(1, 1000, moon);
    moon.children.rectangleGroup.visible = true;
  });

  // special cases for awareness and being
  if (body.sun?.name == "Awareness" || body.sun?.name == "Being") {
    body.planets[0].moons.forEach((moon) => {
      tweenOpacity(1, 1000, moon);
      moon.children.rectangleGroup.visible = true;
    });
  }

  if (body.systemType === "moon") {
    let planet = findParent(body, system);
    tweenBodies(planet.data, system, planet);
    tweenOpacity(1, 1000, body);
    body.children.rectangleGroup.visible = true;
  }
}

const resetSystem = (system) => {
  // system.forEach((body) => {
  //   resetBody(body);
  //   body.forEach((body) => {
  //     resetBody(body);
  //     body.forEach((body) => {
  //       resetBody(body);
  //     });
  //   });
  // });
};

const resetBody = (body) => {
  if (body.children.circleRing) body.children.circleRing.opacity = 0;
  body.active = false;
};

const findParent = (body, system) => {
  let parentBody = null;
  system.bodies.forEach((sun) => {
    sun.planets.forEach((planet) => {
      planet.moons.forEach((moon) => {
        if (moon.name == body.name) {
          // return body;
          if (planet.planet.name) {
            parentBody = planet.planet;
          } else {
            parentBody = sun.sun;
          }

          // if (currentPlanet) return currentPlanet;
        }
      });
    });
  });
  return parentBody;
};
