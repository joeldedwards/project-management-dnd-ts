import { Draggable } from "../models/drag-drop.js";
import Component from "./base-components.js";
import { Project } from "../models/project.js";
import { Autobind } from "../decorators/autobind.js";

// ProjectItem Class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    get personsAssigned() {
        return `${this.project.people}`;
    }

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    @Autobind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    @Autobind
    dragEndHandler(_: DragEvent): void {
    }

    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('p')!.textContent = this.project.description;
        this.element.querySelector('h6 span')!.textContent = this.personsAssigned;
        this.element.querySelector('h5')!.classList.add(this.project.priority);
        this.element.querySelector('h5')!.textContent = this.project.priority;
    }
}