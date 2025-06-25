export interface AuthContextType {
    routineList:Array<PropCard>,
    onOpen: void,
    handleEdit: Function,
    handleDelete: Function,
    filter: (text:string) => void,
}

export type PropCard = {
    id: number,
    title: string,
    description: string,
    exercises: string[],
}