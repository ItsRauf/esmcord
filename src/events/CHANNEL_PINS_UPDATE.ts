import { GatewayChannelPinsUpdateDispatch } from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';
import { Client } from '../Client';

export default async function (
  $: Client,
  data: GatewayChannelPinsUpdateDispatch
): Promise<void> {
  if (data.d.guild_id) {
    const guild = $.guilds.get(data.d.guild_id);
    console.log('ChannelPinsUpdate: guild check', guild?.unavailable);
    if (guild instanceof Guild) {
      const chan = guild.channels.get(data.d.channel_id);
      if (chan) {
        chan.last_pin_timestamp =
          data.d.last_pin_timestamp ?? chan?.last_pin_timestamp;
        const originalPins = chan.pins.array();
        await chan.pins.fetchAll();
        const newPins = chan.pins.array();
        if (newPins.length > originalPins.length) {
          $.emit('MessagePinned', newPins[newPins.length - 1]);
        } else if (newPins.length < originalPins.length) {
          $.emit('MessageUnpinned', originalPins[originalPins.length - 1]);
        }
      }
    }
  } else {
    const dm = $.directMessages.get(data.d.channel_id);
    if (dm) {
      dm.last_pin_timestamp =
        data.d.last_pin_timestamp ?? dm.last_pin_timestamp;
      const originalPins = dm.pins.array();
      await dm.pins.fetchAll();
      const newPins = dm.pins.array();
      if (newPins.length > originalPins.length) {
        $.emit('DirectMessagePinned', newPins[newPins.length - 1]);
      } else if (newPins.length < originalPins.length) {
        $.emit('DirectMessageUnpinned', originalPins[originalPins.length - 1]);
      }
    }
  }
}
