// Project Type
export enum ProjectStatus {
    ToDo,
    InProgress,
    Review,
    Completed
}

export class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus,
        public priority: string
    ) { }
}