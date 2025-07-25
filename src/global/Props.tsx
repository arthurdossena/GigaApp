export interface AuthContextType {
    routineList:Array<PropCard>,
    onOpen: void,
    handleEdit: Function,
    handleDelete: Function,
    filter: (text:string) => void,
    userEmail: string | null,
    handleSaveWorkoutSession: (workoutData: { routineId: number; date: Date; weightLifted: number; email: string; }) => Promise<void>,
    workoutHistory: Array<{ routineId: number; title: String; date: Date; weightLifted: number; email: string; }>,
    getWorkoutHistory: () => Promise<void>
}

export type PropCard = {
    id: number,
    title: string,
    description: string,
    exercises: Array<{ name: string; sets: number; }>
}