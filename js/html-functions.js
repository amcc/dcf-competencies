function displayToggle() {
  // Get the checkbox
  var checkBox = document.getElementById("display-competencies");
  // Get the output text
  const diagram = document.getElementById("competencies-diagram");
  const textMenu = document.getElementById("competencies-menu");

  // If the checkbox is checked, display the output text
  //   if (checkBox.checked == true) {
  //     diagram.style.display = "block";
  //     textMenu.style.display = "none";
  //   } else {
  //     diagram.style.display = "none";
  //     textMenu.style.display = "block";
  //   }

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true) {
    diagram.classList.remove("visually-hidden");
    textMenu.classList.add("visually-hidden");
  } else {
    textMenu.classList.remove("visually-hidden");
    diagram.classList.add("visually-hidden");
  }
}
