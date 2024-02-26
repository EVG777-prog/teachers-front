document.addEventListener("DOMContentLoaded", (event) => {
  // заполнение учителей
  const teachersContainer = document.querySelector(".teachers-container");
  const teachersSection = document.querySelector(".teachers");

  fetchTeachers().then((teachers) => showTeachers(teachers));

  const teachersCards = teachersContainer.querySelectorAll(".teacher");

  function showTeachers(teachers) {
    console.log("showTeachers - teachers", teachers);
    teachers.forEach((teacher) => {
      const teacherElement = document.createElement("div");
      teacherElement.classList.add("teacher");
      teacherElement.setAttribute("data-teacher-id", teacher._id);

      teacherElement.innerHTML = `
           <img
              src="${teacher.photo}"
              alt="Photo of ${teacher.name}"
              class="teacher-photo"
            />
            <div class="icon-delete">
              <img src="assets/icon-delete.svg" alt="Delete" title="Удалить" class="icon-svg delete">
            </div>
            <div class="icon-edit">
            <img src="assets/icon-edit.svg" alt="Edit" title="Изменить" class="icon-svg edit">
          </div>
            <h3>${teacher.name}</h3>
            <p>${teacher.description}</p>
          `;

      teachersContainer.appendChild(teacherElement);
    });
  }

  document
    .querySelector(".teachers-container")
    .addEventListener("click", function (event) {
      console.log("click");
      console.log(event);
      // Проверяем, является ли элемент, по которому кликнули, иконкой изменения
      if (event.target.matches(".icon-svg.edit")) {
        const teacherCard = event.target.closest(".teacher");
        const teacherId = teacherCard.getAttribute("data-teacher-id");
        console.log("Изменение учителя:", teacherId);
        // Добавьте здесь логику для изменения информации учителя
      }

      // Проверяем, является ли элемент, по которому кликнули, иконкой удаления
      if (event.target.matches(".icon-svg.delete")) {
        const teacherCard = event.target.closest(".teacher");
        const teacherId = teacherCard.getAttribute("data-teacher-id");
        console.log("Удаление учителя:", teacherId);
        // Добавьте здесь логику для удаления карточки учителя
      }
    });

  async function fetchTeachers() {
    try {
      const response = await fetch(
        "https://teachers-api-ad8e708cac4e.herokuapp.com/teachers"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const teachers = await response.json();
      console.log(teachers); // This will log the array of teachers to the console
      return teachers; // This returns the array of teachers
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  }
});
