import type { PageableEntity } from "@compose/api-types";

export const PagedWrapper = {
    DEFAULT_MAX: {
        offset: 0,
        pageSize: 42,
    } as PageableEntity,
};

/**
 * ## PagedWrapper 的简写形式
 */
export const Pw = PagedWrapper;
