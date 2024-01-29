export interface Position {
    x: number;
    y: number;
    z: number;
}
type EntityId = `minecraft:${string}`;
interface Enchantment {
    level: number;
    name: string;
    type: number;
}
export interface EntityObject {
    color: string;
    dimension: number;
    id: EntityId;
    name: string;
    position: Position;
    type: string;
    variant: number;
    yRot: number;
}
export interface ItemObject {
    aux: number;
    enchantments: Enchantment[];
    freeStackSize: number;
    id: string;
    maxStackSize: number;
    namespace: number;
    stackSize: number;
}
export interface BlockObject {
    aux: number;
    id: string;
    namespace: string;
}
export {};
