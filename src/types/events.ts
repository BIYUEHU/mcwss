import { obj } from '@kotori-bot/tools';
import Tsu from 'tsukiko';
import { EventDataBase, EventsList } from '../utils/events';
import { BlockObject, ItemObject, EntityObject, Position } from './minecraft';
import { Client } from '../utils/client';
import { ALL_EVENTS } from '../const';

export type MinecraftEvents<T = typeof ALL_EVENTS> = T[keyof T];

export const eventDataMinecraftBaseSchema = Tsu.Object({
  body: Tsu.Object({}),
  header: Tsu.Object({
    eventName: Tsu.Custom<(typeof ALL_EVENTS)[keyof typeof ALL_EVENTS]>(
      (val) => typeof val === 'string' && ALL_EVENTS.includes(val)
    ),
    messagePurpose: Tsu.String(),
    version: Tsu.Number()
  })
});

interface EventDataMinecraftBase<T extends keyof EventsList, C extends object> extends EventDataBase<T> {
  body: C;
  header: {
    eventName: T extends 'unknown_minecraft_event'
      ? string
      : T extends `${infer P}_${infer M}_${infer S}`
        ? `${Capitalize<P>}${Capitalize<M>}${Capitalize<S>}`
        : T extends `${infer P}_${infer S}`
          ? `${Capitalize<P>}${Capitalize<S>}`
          : never;
    messagePurpose: string;
    version: number;
  };
  client: Client;
}

interface EventDataBlockBroken
  extends EventDataMinecraftBase<
    'block_broken',
    {
      block: BlockObject;
      count: number;
      destructionMethod: number;
      player: EntityObject;
      tool: ItemObject;
      variant: number;
    }
  > {}

interface EventDataBlockPlaced
  extends EventDataMinecraftBase<
    'block_placed',
    {
      block: BlockObject;
      count: number;
      placedUnderWater: boolean;
      placementMethod: number;
      player: EntityObject;
      tool: ItemObject;
    }
  > {}

interface EventDataEndOfDay
  extends EventDataMinecraftBase<
    'end_of_day',
    {
      player: EntityObject;
    }
  > {}

interface EventDataEntitySpawned
  extends EventDataMinecraftBase<
    'entity_spawned',
    {
      mob: { type: number };
      player: EntityObject;
      spawnType: number;
    }
  > {}

interface EventDataItemAcquired
  extends EventDataMinecraftBase<
    'item_acquired',
    {
      acquisitionMethodId: number;
      count: number;
      item: BlockObject;
      player: EntityObject;
    }
  > {}

interface EventDataItemCrafted
  extends EventDataMinecraftBase<
    'item_crafted',
    {
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
    }
  > {}

interface EventDataItemDestroyed
  extends EventDataMinecraftBase<
    'item_destroyed',
    {
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
    }
  > {}

interface EventDataItemSmelted
  extends EventDataMinecraftBase<
    'item_smelted',
    {
      fuelSource: BlockObject;
      item: BlockObject;
      player: EntityObject;
    }
  > {}

interface EventDataItemUsed
  extends EventDataMinecraftBase<
    'item_used',
    {
      count: number;
      item: BlockObject;
      player: EntityObject;
      useMethod: number;
    }
  > {}

interface EventDataJukeboxUsed
  extends EventDataMinecraftBase<
    'jukebox_used',
    {
      count: number;
      item: BlockObject;
      player: EntityObject;
      useMethod: number;
    }
  > {}

interface EventDataMobInteracted
  extends EventDataMinecraftBase<
    'mob_interacted',
    {
      interactionType: number;
      mob: { color: number; type: number; variant: number };
      player: EntityObject;
    }
  > {}

interface EventDataMobKilled
  extends EventDataMinecraftBase<
    'mob_killed',
    {
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
    }
  > {}

interface EventDataPlayerBounced
  extends EventDataMinecraftBase<
    'player_bounced',
    {
      block: BlockObject;
      bounceHeight: number;
      player: EntityObject;
    }
  > {}

interface EventDataPlayerDied
  extends EventDataMinecraftBase<
    'player_died',
    {
      cause: number;
      inRaid: boolean;
      killer: { color: number; id: number; type: number; variant: number };
      player: EntityObject;
    }
  > {}

interface EventDataPlayerMessage
  extends EventDataMinecraftBase<
    'player_message',
    { message: string; receiver: string; sender: string; type: 'chat' | 'say' | 'title' | 'tell' }
  > {}

interface EventDataPlayerTeleported
  extends EventDataMinecraftBase<
    'player_teleported',
    {
      cause: number;
      itemType: number;
      metersTravelled: number;
      player: EntityObject;
    }
  > {}

interface EventDataPlayerTransform
  extends EventDataMinecraftBase<
    'player_transform',
    {
      player: EntityObject;
    }
  > {}

interface EventDataPlayerTravelled
  extends EventDataMinecraftBase<
    'player_travelled',
    {
      isUnderwater: boolean;
      metersTravelled: number;
      newBiome: number;
      player: EntityObject;
      travelMethod: number;
    }
  > {}

interface EventDataUnknownMinecraftEvent extends EventDataMinecraftBase<'unknown_minecraft_event', obj> {}

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
  export interface EventsList {
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
