export const buildMenu = (competencies, id) => {
  const element = document.getElementById(id);
  const topMenu = createElement("ul");
  topMenu.classList.add("tree");
  element.appendChild(topMenu);

  competencies.forEach((competency, i) => {
    //   competency.title,
    const li = createElement("li");
    const details = createElement("details");
    const summary = createElement("summary", competency.title);
    const color = competency.color;
    summary.style.setProperty("--tree-color", color);
    li.appendChild(details);
    details.appendChild(summary);
    topMenu.appendChild(li);

    if (competency.children?.length > 0) {
      const secondLevel = createElement("ul");
      secondLevel.classList.add("content");
      //   secondLevel.classList.add("collapsible");
      details.appendChild(secondLevel);

      competency.children.forEach((child, j) => {
        if (child.title) {
          const li = createElement("li");
          const details = createElement("details");
          const summary = createElement("summary", child.title);
          summary.style.setProperty("--tree-color", color);
          details.appendChild(summary);
          li.appendChild(details);
          li.classList.add("collapsible");
          secondLevel.appendChild(li);

          if (child.children?.length > 0) {
            const thirdLevel = createElement("ul");
            thirdLevel.classList.add("content");
            details.appendChild(thirdLevel);

            child.children.forEach((grandChild, k) => {
              const li = createElement("li", grandChild.title);
              li.style.setProperty("--tree-color", color);
              thirdLevel.appendChild(li);
            });
          }
        } else {
          child.children.forEach((grandChild, k) => {
            const li = createElement("li", grandChild.title);
            li.style.setProperty("--tree-color", color);
            secondLevel.appendChild(li);
          });
        }
      });
    }
  });

  //   makeCollapsible("collapsible");
};

const createElement = (el, text = null) => {
  const El = document.createElement(el);
  if (text) {
    const node = document.createTextNode(text);
    El.appendChild(node);
  }
  return El;
};

const makeCollapsible = (className) => {
  const coll = document.getElementsByClassName(className);

  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = "1000px";
      }
    });
  }
};
