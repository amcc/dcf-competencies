export function dragGroup(e, group, planets) {
  //only do this when you start to drag
  if (!group.dragging) {
    group.dragging = true;
    group.storeAngle = e.point.subtract(group.position).angle - group.rotation;
  }
  // find the angle between drag point and group centre
  let delta = e.point.subtract(group.position);
  let rotation = delta.angle - group.storeAngle;
  rotateGroup(group, rotation, planets);
}

export function rotateGroup(group, rotation, planets) {
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

export function levelGroup(x, y, parent) {
  let levelGroup = new Group();
  levelGroup.pivot = [x, y];
  levelGroup.applyMatrix = false;
  levelGroup.dragging = false;

  if (parent) {
    levelGroup.parent = parent;
  }

  return levelGroup;
}
