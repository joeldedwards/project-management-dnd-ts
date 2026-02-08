import { ProjectInput } from "./components/project-input.js";
import { ProjectList } from "./components/project-list.js";

const projInput = new ProjectInput();
const addBtn = document.getElementById('open-form-btn')!;
addBtn.addEventListener('click', projInput.openModal);
new ProjectList('to-do');
new ProjectList('in-progress');
new ProjectList('review');
new ProjectList('completed');