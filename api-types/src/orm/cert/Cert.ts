import type { AuditTyping, CertContentTyping, CertPointTyping, CertTyping } from "@compose/api-model";

import type { IEntity } from "@/orm";
import type { RefId } from "@/orm";
import type { LocalDateTime } from "@/datetime";
import type { bigtext, serialcode } from "@/typescripts";

export interface Cert extends IEntity {
    userId?: RefId;
    userInfoId?: RefId;
    wmAttId?: RefId;
    wmCode?: serialcode;
    attId?: RefId;
    createUserId?: RefId;
    createDeviceId?: RefId;
    createIp?: serialcode;
    createDatetime?: LocalDateTime;
    remark?: bigtext;
    doc?: bigtext;
    name?: string;
    poType?: CertPointTyping;
    coType?: CertContentTyping;
    doType?: CertTyping;
    auditStatus?: AuditTyping;
}
