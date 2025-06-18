export interface AuthContextType {
    routineList:Array<PropCard>,
    onOpen: void,
    handleEdit: Function,
    handleDelete: Function,
}

export type PropCard = {
    id: number,
    title: string,
    description: string,
    exercises: string[],
}