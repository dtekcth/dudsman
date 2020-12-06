import _ from 'lodash';
import React from 'react';
import { css } from 'twin.macro';
import Player from '../../../server/player';
import { ClientModels } from '../../models';
import animations from '../../utils/animations';
import Avatar from '../Avatar';
import Circular from '../Circular';
import Heading from '../Heading';
import TwoDice from '../TwoDice';
import 'twin.macro';

const HostView: React.FC<
  {
    onKickPlayer?: (ply: Player) => void;
    onGiveTurn?: (ply: Player) => void;
  } & ClientModels.RoomViewProps
> = ({ state, dieRef1, dieRef2, onKickPlayer, onGiveTurn }) => {
  const room = state.room;

  const players = _.chain(room.data.players)
    .sortBy((p) => p.name)
    .map((p) => (
      <div
        key={p.id}
        css={{
          backgroundColor: room.data.turn === p.id && 'rgba(0, 0, 0, 0.1)'
        }}
        tw="rounded-full p-2 transition duration-200">
        <Avatar
          key={p.name}
          type={p.avatar}
          name={p.name}
          score={p.score}
          onKick={() => onKickPlayer(p)}
          onGiveTurn={() => onGiveTurn(p)}
        />
      </div>
    ))
    .value();

  players.unshift(
    <div>
      <div tw="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Star
          alternative
          color="rgba(255, 255, 200, 0.3)"
          size="200"
          css={css`
            animation: ${animations.hostStar} 20s infinite;
            animation-timing-function: linear;
          `}
        />
      </div>

      <div tw="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div css={{ transform: 'rotate(30deg)' }}>
          <Star
            color="rgba(255, 255, 200, 0.3)"
            size="180"
            css={css`
              animation: ${animations.hostStar} 20s infinite reverse;
              animation-timing-function: linear;
            `}
          />
        </div>
      </div>

      <Avatar key={0} size={140} type="whiskey" name="Dödsman" />
    </div>
  );

  return (
    <div tw="bg-dtek h-screen relative">
      <div tw="absolute top-0 inset-x-0 p-2">
        <Heading size="2xl" tw="text-center text-white tracking-widest uppercase">
          Dödsman
        </Heading>
      </div>

      <div
        tw="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        css={{ width: 200 }}>
        <Heading size="xl" tw="text-center text-white tracking-widest uppercase">
          Room code
        </Heading>

        <Heading size="3xl" tw="text-center text-white tracking-widest uppercase">
          {room.data.code}
        </Heading>

        <TwoDice ref1={dieRef1} ref2={dieRef2} tw="mt-2" num1={state.num1} num2={state.num2} />
      </div>

      <div
        tw="absolute left-1/2 top-1/2"
        css={{ width: 500, height: 500, transform: 'translate(-50%, calc(-50% + 30px))' }}>
        <Circular>{players}</Circular>
      </div>
    </div>
  );
};

export default HostView;
