//связь между socket.io-client с портом 3000 и socket.io-server с портом 3003

import io from "socket.io-client";

const socket = io("http://localhost:4024");

export default socket;
