// TodoItem class
class TodoItem {
  constructor(title, description, dueDate, priority, notes, checklist) {
    this.id = Math.random().toString(36).substr(2, 9); // Generate unique ID
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes || "";
    this.checklist = checklist || [];
  }

  // Method to update the properties of the todo item
  update(title, description, dueDate, priority, notes, checklist) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes || "";
    this.checklist = checklist || [];
  }
}

// Project class
class Project {
  constructor(name) {
    this.id = Math.random().toString(36).substr(2, 9); // Generate unique ID
    this.name = name;
    this.todos = [];
  }
}

// CRUD operations for todos and projects
const todoApp = {
  projects: [],

  // Add a todo item to a project
  addTodoToProject(todo, projectId) {
    const project = this.projects.find((proj) => proj.id === projectId);
    if (project) {
      project.todos.push(todo);
    }
  },

  // Delete a todo item from a project
  deleteTodoFromProject(todoId, projectId) {
    const project = this.projects.find((proj) => proj.id === projectId);
    if (project) {
      project.todos = project.todos.filter((todo) => todo.id !== todoId);
      // You might want to save the changes to localStorage here if needed
      todoApp.saveToLocalStorage();
      // Update the UI
      displayProjectsAndTodos();
    }
  },

  // Update a todo item in a project
  updateTodoInProject(todoId, projectId, updatedTodo) {
    const project = this.projects.find((proj) => proj.id === projectId);
    if (project) {
      const todoIndex = project.todos.findIndex((todo) => todo.id === todoId);
      if (todoIndex !== -1) {
        project.todos[todoIndex].update(
          updatedTodo.title,
          updatedTodo.description,
          updatedTodo.dueDate,
          updatedTodo.priority,
          updatedTodo.notes,
          updatedTodo.checklist
        );
      }
    }
  },

  // Other CRUD operations...

  // Persistence using localStorage
  saveToLocalStorage() {
    localStorage.setItem("todoApp", JSON.stringify(this.projects));
  },

  loadFromLocalStorage() {
    const data = localStorage.getItem("todoApp");
    if (data) {
      this.projects = JSON.parse(data);
    }
  },
};

// Function to display projects and todos
function displayProjectsAndTodos() {
  const projectContainer = document.getElementById("projectContainer");
  projectContainer.innerHTML = "";

  todoApp.projects.forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.innerHTML = `<h2>${project.name}</h2>`;

    if (project.todos.length > 0) {
      const todoList = document.createElement("ul");
      project.todos.forEach((todo) => {
        const todoItem = document.createElement("li");
        todoItem.textContent = `${todo.title} - Due: ${todo.dueDate} - Priority: ${todo.priority}`;
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
          // Implement edit functionality
          editTodoItem(project.id, todo.id);
        });
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          // Implement delete functionality
          deleteTodoItem(project.id, todo.id);
        });
        todoItem.appendChild(editButton);
        todoItem.appendChild(deleteButton);
        todoList.appendChild(todoItem);
      });
      projectElement.appendChild(todoList);
    } else {
      projectElement.innerHTML += "<p>No todos found.</p>";
    }

    projectContainer.appendChild(projectElement);
  });
}

// Function to edit a todo item
function editTodoItem(projectId, todoId) {
  const project = todoApp.projects.find((proj) => proj.id === projectId);
  if (project) {
    const todo = project.todos.find((todo) => todo.id === todoId);
    if (todo) {
      // Populate modal with todo item's details
      const editTitleInput = document.getElementById("editTitle");
      if (editTitleInput) editTitleInput.value = todo.title;

      const editDescriptionInput = document.getElementById("editDescription");
      if (editDescriptionInput) editDescriptionInput.value = todo.description;

      const editDueDateInput = document.getElementById("editDueDate");
      if (editDueDateInput) editDueDateInput.value = todo.dueDate;

      const editNotesInput = document.getElementById("editNotes");
      if (editNotesInput) editNotesInput.value = todo.notes;

      const editHighPriorityInput = document.getElementById("editHighPriority");
      if (editHighPriorityInput)
        editHighPriorityInput.checked = todo.priority === "High";

      const editMediumPriorityInput =
        document.getElementById("editMediumPriority");
      if (editMediumPriorityInput)
        editMediumPriorityInput.checked = todo.priority === "Medium";

      const editLowPriorityInput = document.getElementById("editLowPriority");
      if (editLowPriorityInput)
        editLowPriorityInput.checked = todo.priority === "Low";

      // Show modal
      const editModal = document.getElementById("editModal");
      editModal.style.display = "block";

      // Handle closing the modal
      const closeEditButton = document.querySelector(".closeEdit");
      if (closeEditButton)
        closeEditButton.addEventListener("click", () => {
          closeEditModal();
        });

      // Handle saving changes
      const saveChangesButton = document.getElementById("saveChangesButton");
      if (saveChangesButton)
        saveChangesButton.onclick = function () {
          // Retrieve updated values from the modal
          const updatedTitle = document.getElementById("editTitle").value;
          const updatedDescription =
            document.getElementById("editDescription").value;
          const updatedDueDate = document.getElementById("editDueDate").value;
          const updatedNotes = document.getElementById("editNotes").value;
          const updatedPriorityInput = document.querySelector(
            'input[name="editPriority"]:checked'
          );
          const updatedPriority = updatedPriorityInput
            ? updatedPriorityInput.value
            : "Unset";

          // Update the todo item
          todo.update(
            updatedTitle,
            updatedDescription,
            updatedDueDate,
            updatedPriority,
            updatedNotes
          );

          // Close the modal
          closeEditModal();

          // Update the user interface
          displayProjectsAndTodos();
        };
    }
  }
}

// Function to close the edit modal
function closeEditModal() {
  const editModal = document.getElementById("editModal");
  if (editModal) editModal.style.display = "none";
}

// Function to delete a todo item
function deleteTodoItem(projectId, todoId) {
  const project = todoApp.projects.find((proj) => proj.id === projectId);
  if (project) {
    project.todos = project.todos.filter((todo) => todo.id !== todoId);
    // You might want to save the changes to localStorage here if needed
    todoApp.saveToLocalStorage();
    // Update the UI
    displayProjectsAndTodos();
  }
}

// Function to close the form modal
function closeFormModal() {
  const formModal = document.getElementById("formModal");
  if (formModal) formModal.style.display = "none";
}

// Function to show the add todo form modal
function showAddTodoForm() {
  // Show the todo form modal
  const todoFormModal = document.getElementById("formModal");
  if (todoFormModal) todoFormModal.style.display = "block";
}

// Event listener for the "Add New Todo Item" button
document.getElementById("addTodoButton").addEventListener("click", () => {
  showAddTodoForm();
  closeEditModal(); // Close edit modal if open
});

// Event listener for closing the form modal
document.querySelector(".closeForm").addEventListener("click", closeFormModal);

// Event listener for todo form submission
document
  .getElementById("formModal")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;
    const notes = document.getElementById("notes").value;
    const priorityElement = document.querySelector(
      'input[name="priority"]:checked'
    );
    const priority = priorityElement ? priorityElement.value : "";

    // Create a new todo item
    const newTodo = new TodoItem(title, description, dueDate, priority, notes);

    // Check if there are any projects
    if (todoApp.projects.length === 0) {
      // If there are no projects, create a default project
      const defaultProject = new Project("Default Project");
      // Add the default project to the todoApp
      todoApp.projects.push(defaultProject);
      // Add the todo item to the default project
      todoApp.addTodoToProject(newTodo, defaultProject.id);
    } else {
      // If there are projects available, add the todo item to the first project
      todoApp.addTodoToProject(newTodo, todoApp.projects[0].id);
    }

    // Display updated projects and todos
    displayProjectsAndTodos();

    // Clear the form
    document.getElementById("formModal").reset();

    // Close the form modal
    closeFormModal();
  });

// Load data from localStorage and display projects and todos
todoApp.loadFromLocalStorage();
displayProjectsAndTodos();
