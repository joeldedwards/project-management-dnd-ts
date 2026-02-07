import { ProjectInput } from "./components/project-input.js";
import { ProjectList } from "./components/project-list.js";

new ProjectInput();
new ProjectList('to-do');
new ProjectList('in-progress');
new ProjectList('review');
new ProjectList('completed');