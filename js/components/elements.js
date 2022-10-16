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
