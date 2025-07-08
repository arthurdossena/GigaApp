export interface AuthContextType {
    routineList:Array<PropCard>,
    onOpen: void,
    handleEdit: Function,
    handleDelete: Function,
    filter: (text:string) => void,
    // userEmail: string | null,
    // setUserEmail: (email:string | null) => void,
}

export type PropCard = {
    id: number,
    title: string,
    description: string,
    exercises: Array<{ name: string; sets: number; }>
}