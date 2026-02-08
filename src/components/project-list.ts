import Component from "./base-components.js";
import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { projectState } from "../state/project-state.js";
import { Autobind } from "../decorators/autobind.js";
import { ProjectItem } from "./project-item.js";

// ProjectList Class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: 'to-do' | 'in-progress' | 'review' | 'completed') {
        super('project-list', 'app-section', false, `${type}-projects`);
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    @Autobind
    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer?.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
    }

    @Autobind
    dropHandler(event: DragEvent): void {
        const projectId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(projectId, this.type === 'to-do' ? ProjectStatus.ToDo : this.type === 'in-progress' ? ProjectStatus.InProgress : this.type === 'review' ? ProjectStatus.Review : ProjectStatus.Completed);
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    @Autobind
    dragLeaveHandler(_: DragEvent): void {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('drop', this.dropHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);

        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(proj => {
                if (this.type === 'to-do') {
                    return proj.status === ProjectStatus.ToDo
                }
                else if (this.type === 'in-progress') {
                    return proj.status === ProjectStatus.InProgress
                }
                else if (this.type === 'review') {
                    return proj.status === ProjectStatus.Review
                }
                return proj.status === ProjectStatus.Completed
            })
            this.assignedProjects = relevantProjects;
            this.renderContent();
            this.renderProjects();
        });
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        const projectCount = this.assignedProjects.length;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = `${this.type} (${projectCount})`;
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for (const projItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, projItem);
        }
    }
}