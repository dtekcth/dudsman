export const roomUpdate = (err: Error, room: any, joined: boolean, ready: boolean) => {
  return {
    type: 'ROOM_UPDATE',
    error: err,
    data: room,
    joined,
    ready
  };
};

export const roomReset = () => {
  return {
    type: 'ROOM_RESET'
  };
};

export const roomHost = (host: boolean) => {
  return {
    type: 'ROOM_HOST',
    host
  };
};

export const playerUpdateId = (id: string) => {
  return {
    type: 'PLAYER_ID',
    id
  };
};

export const socketUpdate = (err: Error, data: any) => {
  return {
    type: 'SOCKET_UPDATE',
    error: err,
    ...data
  };
};
