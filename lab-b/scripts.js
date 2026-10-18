class Todo {
  constructor() {
    const saved = localStorage.getItem("tasks");
    this.tasks = saved ? JSON.parse(saved) : [
      { id: 1, name: "Zrobić zakupy spożywcze", date: "2026-10-20T12:00" },
      { id: 2, name: "Przygotować sprawozdanie", date: "2026-10-25T18:00" },
      { id: 3, name: "Umyć samochód", date: "" }
    ];

    this.term = "";
    this.initEvents();
    this.draw();
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  getFilteredTasks() {
    if (this.term.length < 2) {
      return this.tasks;
    }
    return this.tasks.filter(t => t.name.toLowerCase().includes(this.term.toLowerCase()));
  }

  draw() {
    const container = document.querySelector("#tasksContainer");
    container.innerHTML = "";

    const filtered = this.getFilteredTasks();

    filtered.forEach(task => {
      const div = document.createElement("div");
      div.className = "task-item";

      let displayName = task.name;
      if (this.term.length >= 2) {
        const regex = new RegExp(`(${this.term})`, "gi");
        displayName = displayName.replace(regex, "<mark>$1</mark>");
      }

      const formattedDate = task.date ? task.date.replace("T", " ") : "";

      div.innerHTML = `
                <span class="task-text">${displayName}</span>
                <span class="task-date">${formattedDate}</span>
                <button class="delete-btn">Usuń</button>
            `;

      div.querySelector(".task-text").addEventListener("click", () => {
        this.enableEdit(div, task);
      });

      div.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteTask(task.id);
      });

      container.appendChild(div);
    });
  }

  enableEdit(div, task) {
    div.innerHTML = `
            <input type="text" class="edit-name" value="${task.name}">
            <input type="datetime-local" class="edit-date" value="${task.date || ''}">
            <button class="save-edit-btn">Zapisz</button>
        `;

    const nameInput = div.querySelector(".edit-name");
    const dateInput = div.querySelector(".edit-date");
    const saveBtn = div.querySelector(".save-edit-btn");

    const saveChanges = () => {
      const newName = nameInput.value.trim();
      const newDate = dateInput.value;

      if (newName.length < 3 || newName.length > 255) {
        alert("Nazwa zadania musi mieć od 3 do 255 znaków!");
        this.draw();
        return;
      }

      task.name = newName;
      task.date = newDate;
      this.save();
      this.draw();
    };

    saveBtn.addEventListener("click", saveChanges);

    nameInput.addEventListener("blur", (e) => {
      if (!div.contains(e.relatedTarget)) {
        saveChanges();
      }
    });
  }
  add(name, date) {
    if (name.length < 3 || name.length > 255) {
      alert("Nazwa zadania musi zawierać od 3 do 255 znaków!");
      return;
    }
    if (date) {
      const selectedDate = new Date(date);
      const now = new Date();
      if (selectedDate <= now) {
        alert("Data musi być pusta albo w przyszłości!");
        return;
      }
    }

    const newTask = {
      id: Date.now(),
      name: name,
      date: date
    };

    this.tasks.push(newTask);
    this.save();
    this.draw();
  }
  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
    this.draw();
  }
  initEvents() {
    const searchInput = document.querySelector("#searchInput");
    searchInput.addEventListener("input", (e) => {
      this.term = e.target.value.trim();
      this.draw();
    });

    const addBtn = document.querySelector("#addBtn");
    const taskInput = document.querySelector("#taskInput");
    const dateInput = document.querySelector("#dateInput");

    addBtn.addEventListener("click", () => {
      this.add(taskInput.value.trim(), dateInput.value);
      taskInput.value = "";
      dateInput.value = "";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.todo = new Todo();
});
