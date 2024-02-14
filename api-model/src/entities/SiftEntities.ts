import type { IEntity } from "@compose/api-types";

/**
 * 品牌
 */
export interface Brand extends IEntity {
    ordered: number;
    logoImgId?: string;
    title: string;
    doc?: string;
}

/**
 * 分类
 */
export interface Category extends IEntity {
    ordered: number;
    title: string;
    doc?: string;
}

/**
 * 所有级联品牌
 */
export interface FullCategory extends Category {
    children?: FullCategory[];
}
