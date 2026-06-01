import type {Student} from "./student.ts";

export interface StudentFormProps {
    studentToEdit: Student | null;
    onSaveSuccess: () => void;
    onCancel: () => void;
}