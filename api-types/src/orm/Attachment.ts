import type { AttachmentTyping } from "@compose/api-model";

import type { IEntity } from "./Entities";
import type { Id, RefId } from "./Utils";

import type { bigserial } from "@/typescripts";

/**
 * ## 附件
 */
export interface Attachment extends IEntity {
    metaName?: string;
    saveName?: string;
    urlName?: string;
    urlDoc?: string;
    attType: AttachmentTyping;
    size?: bigserial;
    mimeType?: string;
    urlId?: RefId;
    baseUrl?: string;
}

/**
 * ## 可查询的轻量文件列表
 */
export interface LinkedAttachment extends IEntity {
    readonly id?: Id;
    readonly url?: string;
    readonly mimeType?: string;
    readonly metaName?: string;
    readonly saveName?: string;
    readonly attType?: AttachmentTyping;
}
