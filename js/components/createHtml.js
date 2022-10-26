export const buildMenu = (competencies, id) => {
  const element = document.getElementById(id);
  const topMenu = createElement("ul");
  //   topMenu.classList.add("collapsible");
  element.appendChild(topMenu);

  competencies.forEach((competency, i) => {
    //   competency.title,
    const li = createElement("li", competency.title);
    li.classList.add("collapsible");
    topMenu.appendChild(li);

    if (competency.children?.length > 0) {
      const secondLevel = createElement("ul");
      //   secondLevel.classList.add("collapsible");
      topMenu.appendChild(secondLevel);

      competency.children.forEach((child, j) => {
        if (child.title) {
          const li = createElement("li", child.title);
          li.classList.add("collapsible");
          secondLevel.appendChild(li);
        }

        if (child.children?.length > 0) {
          const thirdLevel = createElement("ul");
          secondLevel.appendChild(thirdLevel);

          child.children.forEach((grandChild, k) => {
            thirdLevel.appendChild(createElement("li", grandChild.title));
          });
        }
      });
    }
  });
};

const createElement = (el, text = null) => {
  const El = document.createElement(el);
  if (text) {
    const node = document.createTextNode(text);
    El.appendChild(node);
  }
  return El;
};
