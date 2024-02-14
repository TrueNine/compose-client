import type { IEntity } from "./Entities";
import type { ReferenceId } from "./Utils";

import type { datetime } from "@/datetime";
import type { bigtext, bool, serialcode } from "@/typescripts";

export interface Usr extends IEntity {
    readonly band?: bool;
    readonly createUserId?: ReferenceId;
    account?: serialcode;
    nickName?: string;
    doc?: bigtext;
    pwdEnc?: bigtext;
    lastLoginTime?: datetime;
    banTime?: datetime;
}
