import { AuditTyping } from "@compose/api-model";

import type { IEntity } from "./Entities";
import type { RefId, TypeInt } from "./Utils";

import type { datetime } from "@/datetime";
import type { bigtext, serialcode } from "@/typescripts";

export interface Audit extends IEntity {
    auditDeviceId?: serialcode;
    auditIp?: string;
    refType?: TypeInt;
    refId?: RefId;
    remark?: bigtext;
    createDatetime?: datetime;
    state?: AuditTyping;
}
export interface AuditAttachment extends IEntity {
    status?: AuditTyping;
    auditId?: RefId;
    attId?: RefId;
}
