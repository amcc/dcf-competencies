import { competencies } from "../data.js";

export function showCompetencies(system) {
  let newpos = [-view.bounds.width / 3, 0];
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
    console.log(element);
    tweenOpacity(0, 1000, element);
  });

  // turn all planets on
  system.planets.forEach((planet) => {
    tweenOpacity(1, 1000, planet);
  });

  // change state
  system.state.open = false;
  system.state.currentBody = data;
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

  if (group.rotation < 0) Math.abs((group.rotation = 360 + group.rotation));
  // console.log("start", group.rotation, "end", rotation);
  let tween = group.tween(
    { rotation: group.rotation },
    { rotation: rotation },
    { duration: time, easing: "easeInOutQuad" }
  );
  if (planets) {
    planets.forEach((planet, i) => {
      if (planet.rotation < 0)
        Math.abs((planet.rotation = 360 + planet.rotation));

      // if (i === 0)
      // console.log(
      //   "planet-start",
      //   planet.rotation,
      //   "planet-end",
      //   rotation - group.rotation
      // );

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
  // console.log(group);
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
    });
    // show current planet
  }
  if (body.planet) {
    console.log("planet click!");
    // dim planets
    system.planets.forEach((planet) => {
      tweenOpacity(0.3, 1000, planet);
    });
    tweenOpacity(1, 1000, body.planet);
    // show current planet
  }

  if (body.moons?.length > 0) {
    console.log("moons!");
  }
  system.moons.forEach((moon) => {
    tweenOpacity(0.05, 1000, moon);
  });

  body.moons?.forEach((moon) => {
    tweenOpacity(1, 1000, moon);
  });

  // special cases for awareness and being
  if (body.sun?.name == "Awareness" || body.sun?.name == "Being") {
    body.planets[0].moons.forEach((moon) => {
      tweenOpacity(1, 1000, moon);
    });
  }
}
