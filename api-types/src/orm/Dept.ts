import type { IEntity, ITreeEntity } from "./Entities";
import type { ReferenceId } from "./Utils";

export interface Dept extends ITreeEntity {
    name: string;
    doc?: string;
}

export interface UserDept extends IEntity {
    userId: ReferenceId;
    deptId: ReferenceId;
}
