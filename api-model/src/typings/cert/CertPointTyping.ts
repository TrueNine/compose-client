import type { EnumCommentMap, EnumMap } from "@compose/api-types";

export enum CertPointTyping {
    NONE = 0,
    HEADS = 1,
    TAILS = 2,
    DOUBLE = 3,
    ALL = 4,
    ALL_CONTENT = 5,
    INTACT = 6,
}

export const CertPointTypingComment: EnumCommentMap<typeof CertPointTyping> = {
    [CertPointTyping.NONE]: "无要求",
    [CertPointTyping.HEADS]: "正面",
    [CertPointTyping.TAILS]: "反面",
    [CertPointTyping.DOUBLE]: "双面",
    [CertPointTyping.ALL]: "所有",
    [CertPointTyping.ALL_CONTENT]: "所有内容",
    [CertPointTyping.INTACT]: "完整的",
};
export const CertPointTypingMap: EnumMap<typeof CertPointTyping> = {
    [CertPointTyping.NONE]: 0,
    [CertPointTyping.HEADS]: 1,
    [CertPointTyping.TAILS]: 2,
    [CertPointTyping.DOUBLE]: 3,
    [CertPointTyping.ALL]: 4,
    [CertPointTyping.ALL_CONTENT]: 5,
    [CertPointTyping.INTACT]: 6,
};
export const CertPointTypingReverseMap: EnumMap<typeof CertPointTyping> = {
    [0]: CertPointTyping.NONE,
    [1]: CertPointTyping.HEADS,
    [2]: CertPointTyping.TAILS,
    [3]: CertPointTyping.DOUBLE,
    [4]: CertPointTyping.ALL,
    [5]: CertPointTyping.ALL_CONTENT,
    [6]: CertPointTyping.INTACT,
};
