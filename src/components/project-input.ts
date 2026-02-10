import Component from "./base-components";
import { Autobind } from "../decorators/autobind";
import * as Validation from "../util/validation";
import { projectState } from "../state/project-state";

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLDialogElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    dueDateInputElement: HTMLInputElement;
    priorityInputElement: HTMLSelectElement;
    private formElement: HTMLFormElement;

    constructor() {
        super('project-input', 'app-header', true, 'modal-container');
        this.formElement = this.element.querySelector('form') as HTMLFormElement;
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
        this.dueDateInputElement = this.element.querySelector('#due-date') as HTMLInputElement;
        this.priorityInputElement = this.element.querySelector('#priority') as HTMLSelectElement;

        this.configure();
    }

    configure() {
        this.formElement.addEventListener('submit', this.submitHandler);
        const cancelBtn = this.element.querySelector('#cancel-btn')!;
        cancelBtn.addEventListener('click', () => {
            this.element.close();
        });
    }

    renderContent() { };

    @Autobind
    openModal() {
        this.element.showModal();
    }

    private gatherUserInput(): [string, string, number, string, string] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const enteredPriority = this.priorityInputElement.value;
        const enteredDueDate = this.dueDateInputElement.value;

        const titleValidatable: Validation.Validatable = {
            value: enteredTitle,
            required: true
        };
        const descriptionValidatable: Validation.Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        const peopleValidatable: Validation.Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };
        const dueDateValidatable: Validation.Validatable = {
            value: enteredDueDate,
            required: true,
        };

        if (
            !Validation.validate(titleValidatable) ||
            !Validation.validate(descriptionValidatable) ||
            !Validation.validate(peopleValidatable) ||
            !Validation.validate(dueDateValidatable)
        ) {
            alert('Invalid input, please try again!');
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople, enteredPriority, enteredDueDate];
        }
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
        this.priorityInputElement.value = 'low';
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people, priority, dueDate] = userInput;
            projectState.addProject(title, desc, people, priority, dueDate);
            this.clearInputs();
            this.element.close();
        }
    }
}