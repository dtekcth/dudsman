import React from 'react';
import 'twin.macro';

const messages = {
  kicked: 'You were kicked from the room'
};

const RoomError: React.FC<{ error: string }> = ({ error }) => (
  <>{messages[error] ? <div tw="text-dtek text-center font-bold">{messages[error]}</div> : null}</>
);

export default RoomError;
