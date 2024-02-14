import type { EnumCommentMap, EnumMap } from "@compose/api-types";

export enum RuleTyping {
    EXCLUDE = 0,
    INCLUDE = 1,
    FIXED = 2,
}

export const RuleTypingComment: EnumCommentMap<typeof RuleTyping> = {
    [RuleTyping.EXCLUDE]: "拒绝",
    [RuleTyping.INCLUDE]: "接受",
    [RuleTyping.FIXED]: "固定",
};

export const RuleTypingMap: EnumMap<typeof RuleTyping> = {
    [RuleTyping.EXCLUDE]: 0,
    [RuleTyping.INCLUDE]: 1,
    [RuleTyping.FIXED]: 2,
};

export const RuleTypingReverseMap: EnumMap<typeof RuleTyping> = {
    [0]: RuleTyping.EXCLUDE,
    [1]: RuleTyping.INCLUDE,
    [2]: RuleTyping.FIXED,
};
