import type { GenderTyping } from "@compose/api-model";

import type { IEntity } from "@/orm";
import type { timestamp } from "@/datetime";
import type { RefId } from "@/orm";
import type { bigserial, int, serialcode } from "@/typescripts";

export interface DisCert2 extends IEntity {
    userId?: RefId;
    userInfoId?: RefId;
    birthday?: timestamp;
    addressDetailsId?: RefId;
    guardianPhone?: string;
    guardian?: string;
    expireDate?: timestamp;
    issueDate?: timestamp;
    level?: bigserial;
    type?: int;
    gender?: GenderTyping;
    code: serialcode;
    name: string;
    disabilityCode: serialcode;
}
