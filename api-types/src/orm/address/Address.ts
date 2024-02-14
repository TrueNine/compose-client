import type { ITreeEntity } from "@/orm";
import type { WGS84 } from "@/map";
import type { bigserial, bool, serialcode } from "@/typescripts";

export interface Address extends ITreeEntity {
    code: string;
    name: string;
    level: bigserial;
    yearVersion?: serialcode;
    center?: WGS84;
    leaf?: bool;
}
// TODO 确定其类型
export interface FullAddress extends Address {}
