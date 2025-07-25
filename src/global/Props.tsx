export interface AuthContextType {
    routineList:Array<PropCard>,
    onOpen: void,
    handleEdit: Function,
    handleDelete: Function,
    filter: (text:string) => void,
    userEmail: string | null,
    handleSaveWorkoutSession: (workoutData: { routineId: number; date: Date; weightLifted: number; email: string; }) => Promise<void>,
    workoutHistory: Array<WorkoutSession>,
    getWorkoutHistory: () => Promise<void>,
    handleDeleteWorkoutHistory: (item: {id: number, routineId: number; title: String; date: Date; weightLifted: number; email: string;}) => Promise<void>,
}

export type PropCard = {
    id: number,
    title: string,
    description: string,
    exercises: Array<{ name: string; sets: number; }>
}

export type WorkoutSession = {
    id: number,
    routineId: number,
    title: string,
    date: Date,
    weightLifted: number,
    email: string,
}