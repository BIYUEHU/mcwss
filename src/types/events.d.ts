import { obj } from '@kotori-bot/tools';
import { EventDataBase, EventsList } from '../utils/events';
import { BlockObject, ItemObject, EntityObject, Position } from './minecraft';
import { Client } from '../utils/client';
import { ALL_EVENTS } from '../const';
export type MinecraftEvents<T = typeof ALL_EVENTS> = T[keyof T];
export declare const eventDataMinecraftBaseSchema: import("tsukiko").ObjectParser<{
    body: import("tsukiko").ObjectParser<{}>;
    header: import("tsukiko").ObjectParser<{
        eventName: import("tsukiko").CustomParser<string | number | (() => IterableIterator<string>) | {
            [x: number]: boolean | undefined;
            length?: boolean | undefined;
            toString?: boolean | undefined;
            toLocaleString?: boolean | undefined;
            pop?: boolean | undefined;
            push?: boolean | undefined;
            concat?: boolean | undefined;
            join?: boolean | undefined;
            reverse?: boolean | undefined;
            shift?: boolean | undefined;
            slice?: boolean | undefined;
            sort?: boolean | undefined;
            splice?: boolean | undefined;
            unshift?: boolean | undefined;
            indexOf?: boolean | undefined;
            lastIndexOf?: boolean | undefined;
            every?: boolean | undefined;
            some?: boolean | undefined;
            forEach?: boolean | undefined;
            map?: boolean | undefined;
            filter?: boolean | undefined;
            reduce?: boolean | undefined;
            reduceRight?: boolean | undefined;
            find?: boolean | undefined;
            findIndex?: boolean | undefined;
            fill?: boolean | undefined;
            copyWithin?: boolean | undefined;
            entries?: boolean | undefined;
            keys?: boolean | undefined;
            values?: boolean | undefined;
            includes?: boolean | undefined;
            flatMap?: boolean | undefined;
            flat?: boolean | undefined;
            at?: boolean | undefined;
            findLast?: boolean | undefined;
            findLastIndex?: boolean | undefined;
            [Symbol.iterator]?: boolean | undefined;
            readonly [Symbol.unscopables]?: boolean | undefined;
        } | (() => string) | ((start?: number | undefined, end?: number | undefined) => string[]) | (() => string[]) | ((value: string, start?: number | undefined, end?: number | undefined) => string[]) | ((searchElement: string, fromIndex?: number | undefined) => number) | ((searchElement: string, fromIndex?: number | undefined) => number) | ((searchElement: string, fromIndex?: number | undefined) => boolean) | ((target: number, start?: number | undefined, end?: number | undefined) => string[]) | {
            <S extends string>(predicate: (value: string, index: number, array: string[]) => value is S, thisArg?: any): this is S[];
            (predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): boolean;
        } | {
            <S_1 extends string>(predicate: (value: string, index: number, array: string[]) => value is S_1, thisArg?: any): S_1[];
            (predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): string[];
        } | {
            <S_2 extends string>(predicate: (value: string, index: number, obj: string[]) => value is S_2, thisArg?: any): S_2 | undefined;
            (predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): string | undefined;
        } | ((predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any) => number) | ((callbackfn: (value: string, index: number, array: string[]) => void, thisArg?: any) => void) | ((separator?: string | undefined) => string) | (<U>(callbackfn: (value: string, index: number, array: string[]) => U, thisArg?: any) => U[]) | {
            (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
            (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
            <U_1>(callbackfn: (previousValue: U_1, currentValue: string, currentIndex: number, array: string[]) => U_1, initialValue: U_1): U_1;
        } | {
            (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
            (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
            <U_2>(callbackfn: (previousValue: U_2, currentValue: string, currentIndex: number, array: string[]) => U_2, initialValue: U_2): U_2;
        } | ((predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => boolean) | ((compareFn?: ((a: string, b: string) => number) | undefined) => string[]) | (() => string) | (() => IterableIterator<[number, string]>) | (() => IterableIterator<number>) | (() => IterableIterator<string>) | ((index: number) => string | undefined) | {
            <S_3 extends string>(predicate: (value: string, index: number, array: string[]) => value is S_3, thisArg?: any): S_3 | undefined;
            (predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): string | undefined;
        } | ((predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => number) | ((...items: string[]) => number) | ((...items: string[]) => number) | (<U_3, This = undefined>(callback: (this: This, value: string, index: number, array: string[]) => U_3 | readonly U_3[], thisArg?: This | undefined) => U_3[]) | (() => string | undefined) | {
            (...items: ConcatArray<string>[]): string[];
            (...items: (string | ConcatArray<string>)[]): string[];
        } | (() => string | undefined) | {
            (start: number, deleteCount?: number | undefined): string[];
            (start: number, deleteCount: number, ...items: string[]): string[];
        } | (<A, D extends number = 1>(this: A, depth?: D | undefined) => FlatArray<A, D>[])>;
        messagePurpose: import("tsukiko").StringParser;
        version: import("tsukiko").NumberParser;
    }>;
}>;
interface EventDataMinecraftBase<T extends keyof EventsList, C extends object> extends EventDataBase<T> {
    body: C;
    header: {
        eventName: T extends 'unknown_minecraft_event' ? string : T extends `${infer P}_${infer M}_${infer S}` ? `${Capitalize<P>}${Capitalize<M>}${Capitalize<S>}` : T extends `${infer P}_${infer S}` ? `${Capitalize<P>}${Capitalize<S>}` : never;
        messagePurpose: string;
        version: number;
    };
    client: Client;
}
interface EventDataBlockBroken extends EventDataMinecraftBase<'block_broken', {
    block: BlockObject;
    count: number;
    destructionMethod: number;
    player: EntityObject;
    tool: ItemObject;
    variant: number;
}> {
}
interface EventDataBlockPlaced extends EventDataMinecraftBase<'block_placed', {
    block: BlockObject;
    count: number;
    placedUnderWater: boolean;
    placementMethod: number;
    player: EntityObject;
    tool: ItemObject;
}> {
}
interface EventDataEndOfDay extends EventDataMinecraftBase<'end_of_day', {
    player: EntityObject;
}> {
}
interface EventDataEntitySpawned extends EventDataMinecraftBase<'entity_spawned', {
    mob: {
        type: number;
    };
    player: EntityObject;
    spawnType: number;
}> {
}
interface EventDataItemAcquired extends EventDataMinecraftBase<'item_acquired', {
    acquisitionMethodId: number;
    count: number;
    item: BlockObject;
    player: EntityObject;
}> {
}
interface EventDataItemCrafted extends EventDataMinecraftBase<'item_crafted', {
    count: number;
    craftedAutomatically: boolean;
    endingTabId: number;
    hasCraftableFilterOn: boolean;
    item: ItemObject;
    numberOfTabsChanged: number;
    player: EntityObject;
    recipeBookShown: boolean;
    startingTabId: number;
    usedCraftingTable: boolean;
    usedSearchBar: boolean;
}> {
}
interface EventDataItemDestroyed extends EventDataMinecraftBase<'item_destroyed', {
    count: number;
    craftedAutomatically: boolean;
    endingTabId: number;
    hasCraftableFilterOn: boolean;
    item: ItemObject;
    numberOfTabsChanged: number;
    player: EntityObject;
    recipeBookShown: boolean;
    startingTabId: number;
    usedCraftingTable: boolean;
    usedSearchBar: boolean;
}> {
}
interface EventDataItemSmelted extends EventDataMinecraftBase<'item_smelted', {
    fuelSource: BlockObject;
    item: BlockObject;
    player: EntityObject;
}> {
}
interface EventDataItemUsed extends EventDataMinecraftBase<'item_used', {
    count: number;
    item: BlockObject;
    player: EntityObject;
    useMethod: number;
}> {
}
interface EventDataJukeboxUsed extends EventDataMinecraftBase<'jukebox_used', {
    count: number;
    item: BlockObject;
    player: EntityObject;
    useMethod: number;
}> {
}
interface EventDataMobInteracted extends EventDataMinecraftBase<'mob_interacted', {
    interactionType: number;
    mob: {
        color: number;
        type: number;
        variant: number;
    };
    player: EntityObject;
}> {
}
interface EventDataMobKilled extends EventDataMinecraftBase<'mob_killed', {
    armorFeet: ItemObject;
    armorHead: ItemObject;
    armorLegs: ItemObject;
    armorTorso: ItemObject;
    isMonster: boolean;
    killMethodType: number;
    player: EntityObject;
    playerIsHiddenFrom: boolean;
    victim: EntityObject;
    weapon: ItemObject;
}> {
}
interface EventDataPlayerBounced extends EventDataMinecraftBase<'player_bounced', {
    block: BlockObject;
    bounceHeight: number;
    player: EntityObject;
}> {
}
interface EventDataPlayerDied extends EventDataMinecraftBase<'player_died', {
    cause: number;
    inRaid: boolean;
    killer: {
        color: number;
        id: number;
        type: number;
        variant: number;
    };
    player: EntityObject;
}> {
}
interface EventDataPlayerMessage extends EventDataMinecraftBase<'player_message', {
    message: string;
    receiver: string;
    sender: string;
    type: 'chat' | 'say' | 'title' | 'tell';
}> {
}
interface EventDataPlayerTeleported extends EventDataMinecraftBase<'player_teleported', {
    cause: number;
    itemType: number;
    metersTravelled: number;
    player: EntityObject;
}> {
}
interface EventDataPlayerTransform extends EventDataMinecraftBase<'player_transform', {
    player: EntityObject;
}> {
}
interface EventDataPlayerTravelled extends EventDataMinecraftBase<'player_travelled', {
    isUnderwater: boolean;
    metersTravelled: number;
    newBiome: number;
    player: EntityObject;
    travelMethod: number;
}> {
}
interface EventDataUnknownMinecraftEvent extends EventDataMinecraftBase<'unknown_minecraft_event', obj> {
}
interface EventDataCommandResponse extends EventDataBase<'command_response'> {
    body: {
        statusCode: number;
        statusMessage?: string;
        destination?: Position;
        victim?: string[];
        currentPlayerCount?: number;
        maxPlayerCount?: number;
        players?: string;
        [propName: string]: string | number | boolean | string[] | number[] | obj | obj[] | undefined | null;
    };
    header: {
        messagePurpose: 'commandResponse';
        requestId: string;
        version: 1;
    };
    client: Client;
}
declare module '../utils/events' {
    interface EventsList {
        block_broken: EventDataBlockBroken;
        block_placed: EventDataBlockPlaced;
        end_of_day: EventDataEndOfDay;
        entity_spawned: EventDataEntitySpawned;
        item_acquired: EventDataItemAcquired;
        item_crafted: EventDataItemCrafted;
        item_destroyed: EventDataItemDestroyed;
        item_smelted: EventDataItemSmelted;
        item_used: EventDataItemUsed;
        jukebox_used: EventDataJukeboxUsed;
        mob_interacted: EventDataMobInteracted;
        mob_killed: EventDataMobKilled;
        player_bounced: EventDataPlayerBounced;
        player_died: EventDataPlayerDied;
        player_message: EventDataPlayerMessage;
        player_teleported: EventDataPlayerTeleported;
        player_transform: EventDataPlayerTransform;
        player_travelled: EventDataPlayerTravelled;
        unknown_minecraft_event: EventDataUnknownMinecraftEvent;
        command_response: EventDataCommandResponse;
    }
}
export {};
