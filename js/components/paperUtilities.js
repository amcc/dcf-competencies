export function dragGroup(e, group, planets) {
  //only do this when you start to drag
  if (!group.dragging) {
    group.dragging = true;
    group.storeAngle = e.point.subtract(group.position).angle - group.rotation;
  }
  // find the angle between drag point and group centre
  let delta = e.point.subtract(group.position);
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
  console.log("start", group.rotation, "end", rotation);
  let tween = group.tween(
    { rotation: group.rotation },
    { rotation: rotation },
    { duration: time, easing: "easeInOutQuad" }
  );
  if (planets) {
    planets.forEach((planet, i) => {
      if (planet.rotation < 0)
        Math.abs((planet.rotation = 360 + planet.rotation));

      if (i === 0)
        console.log(
          "planet-start",
          planet.rotation,
          "planet-end",
          rotation - group.rotation
        );

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

export function levelGroup(x, y, name, parent) {
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
