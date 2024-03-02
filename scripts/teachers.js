document.addEventListener("DOMContentLoaded", (event) => {
  // const urlAPI = "https://teachers-api-ad8e708cac4e.herokuapp.com";
  const urlAPI = "https://teachers-express-api.onrender.com";

  // заполнение учителей
  const teachersContainer = document.querySelector(".teachers-container");
  const addTeacherButton = document.querySelector("#add-teacher-button");
  const teacherModal = document.querySelector("#teacher-modal");
  const closeModalButton = document.querySelector("#close-modal-button");
  const cancelButton = document.querySelector("#cancel-button");
  const teacherForm = document.querySelector("#add-teacher-form");
  const langSelect = document.querySelector("#lang");

  showTeachers(langSelect.value);

  langSelect.addEventListener("change", (e) => {
    const lang = e.target.value;
    showTeachers(lang);
  });

  // Открытие модального окна
  addTeacherButton.addEventListener("click", () => {
    console.log("click");
    openModal("Добавление нового учителя", "Добавить");
  });

  // Закрытие модального окна
  closeModalButton.addEventListener("click", () => {
    teacherModal.style.display = "none";
  });

  // Закрытие модального окна по кнопке "Отмена"
  cancelButton.addEventListener("click", () => {
    teacherModal.style.display = "none";
  });

  teacherForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const lang = langSelect.value;

    console.log(lang);

    let photoUrl;

    const formData = new FormData(teacherForm);

    // Формирование объекта с данными формы
    const dataTeacher = {
      name: formData.get("name"),
      description: formData.get("description"),
      lang: lang,
    };

    const file = formData.get("photo");

    console.log(`File`, file);

    const teacherId = teacherModal.getAttribute("data-teacher-id");

    if (teacherId) {
      if (file.name) {
        dataTeacher.photo = await uploadPhoto(file);
      }
      updateTeacher(teacherId, dataTeacher);
    } else {
      dataTeacher.photo = await uploadPhoto(file);
      addTeacher(dataTeacher);
    }

    // Закрытие модального окна
    teacherModal.style.display = "none";
  });

  teachersContainer.addEventListener("click", function (event) {
    // Проверяем, является ли элемент, по которому кликнули, иконкой изменения
    if (event.target.matches(".icon-svg.edit")) {
      const teacherCard = event.target.closest(".teacher");
      const teacherId = teacherCard.getAttribute("data-teacher-id");
      console.log("Изменение учителя:", teacherId);
      const textName = teacherCard.querySelector("h3").textContent;
      const textDescription = teacherCard.querySelector("p").textContent;

      openModal(
        "Изменение данных учителя",
        "Изменить",
        textName,
        textDescription,
        teacherId
      );
    }

    // Проверяем, является ли элемент, по которому кликнули, иконкой удаления
    if (event.target.matches(".icon-svg.delete")) {
      const isConfirmed = confirm("Вы уверены, что хотите удалить?");
      if (isConfirmed) {
        const teacherCard = event.target.closest(".teacher");
        const teacherId = teacherCard.getAttribute("data-teacher-id");
        console.log("Удаление учителя:", teacherId);
        deleteTeacher(teacherId);
      }
    }
  });

  async function addTeacher(data) {
    // URL-адрес API для добавления нового учителя
    const url = `${urlAPI}/teachers`;

    // Параметры запроса
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    // Отправка запроса на API
    const response = await fetch(url, options);

    // Обработка ответа от API
    if (response.ok) {
      // Новый учитель успешно добавлен
      const teacher = await response.json();
      console.log("Новый учитель успешно добавлен:", teacher);
      showTeachers(langSelect.value);
    } else {
      // Ошибка при добавлении нового учителя
      const error = await response.json();
      console.error("Ошибка при добавлении нового учителя:", error);
    }
  }

  async function deleteTeacher(id) {
    // URL-адрес API
    const url = `${urlAPI}/teachers/${id}`;

    // Отправка запроса на API
    const response = await fetch(url, {
      method: "DELETE",
    });

    // Обработка ответа от API
    if (response.ok) {
      console.log("Teacher deleted successfully");
      showTeachers(langSelect.value);
    } else {
      console.error("Error deleting teacher");
      console.log(response);
    }
  }

  async function updateTeacher(id, data) {
    // URL-адрес API для обновления данных учителя
    const url = `${urlAPI}/teachers/${id}`;

    // Параметры запроса
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    // Отправка запроса на API
    const response = await fetch(url, options);

    // Обработка ответа от API
    if (response.ok) {
      // Данные учителя успешно обновлены
      console.log("Данные учителя успешно обновлены");
      showTeachers(langSelect.value);
    } else {
      // Ошибка при обновлении данных учителя
      const error = await response.json();
      console.error("Ошибка при обновлении данных учителя:", error);
    }
  }

  async function showTeachers(language) {
    const teachersCards = document.querySelectorAll(".teacher");

    for (const teacherCard of teachersCards) {
      teacherCard.parentNode.removeChild(teacherCard);
    }

    try {
      const response = await fetch(`${urlAPI}/teachers?lang=${language}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const teachers = await response.json();

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

        // teachersContainer.appendChild(teacherElement);
        teachersContainer.insertBefore(
          teacherElement,
          teachersContainer.lastElementChild
        );
      });
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  }

  function openModal(
    textHeader,
    textButtonConform,
    textName = "",
    textDescription = "",
    teacherId = ""
  ) {
    teacherModal.style.display = "block";

    const modalTitle = document.querySelector(".modal-title");
    const teacherName = document.querySelector("#teacher-name");
    const teacherDescription = document.querySelector("#teacher-description");
    const buttonSubmit = document.querySelector(`button[type="submit"]`);
    const inputFile = document.querySelector(`input[type="file"]`);

    modalTitle.textContent = textHeader;
    teacherName.value = textName;
    teacherDescription.value = textDescription;
    buttonSubmit.textContent = textButtonConform;
    teacherModal.setAttribute("data-teacher-id", teacherId);

    inputFile.value = "";
    inputFile.required = teacherId ? false : true;
  }

  async function uploadPhoto(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "shuttle_school");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/daebcq7e1/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.url;
    } else {
      const error = await response.json();
      console.error("Error uploading photo:", error);
      return null;
    }
  }
});
