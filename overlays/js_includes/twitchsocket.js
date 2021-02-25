const initTwitchSocket = (notifsElem, subTextElem, subMsgElem) => {
  console.log({notifsElem, subTextElem, subMsgElem});
  const twitchPubSub = "wss://pubsub-edge.twitch.tv";
  const CHANNEL_ID = "125370158";
  const AUTH_TOKEN = "r7gr2fahaqtjsm3umc6buzjdmmhl23";

  let pingFlag = false;

  const listenRequest = {
    type: "LISTEN",
    data: {
      topics: [`channel-subscribe-events-v1.${CHANNEL_ID}`],
      auth_token: AUTH_TOKEN
    }
  };

  let twitchSocket = new WebSocket(twitchPubSub);

  const newSocket = () => {
    // ref: https://dev.twitch.tv/docs/pubsub/#connection-management
    twitchSocket.onerror = (error) => console.log(`Websocket error: ${error}`);
    twitchSocket.onopen = () => {
      const PING_TIMER = 4.5 * 100 * 60; // 4.5 minutes

      twitchSocket.send(listenRequest);

      const pingTimer = setInterval(() => {
        twitchSocket.send({ type: "PING" });
        pingFlag = true;
        const PONG_TIMER = 10 * 100; // 10 seconds
        const pongTimer = setTimeout(() => {
          if (pingFlag === true) {
            // close everything
            twitchSocket.close();
            clearTimeout(pingTimer);
            clearTimeout(pongTimer);

            // restart everything
            twitchSocket = new WebSocket(twitchPubSub);
            newSocket();
          }
        }, PONG_TIMER);
      }, PING_TIMER);
    }
  };

  const handleAlert = (text, msg) => {
    subTextElem.innerHtml = text;
    subMsgElem.innerHtml = `${msg}`;
    notifsElem.className = "visible";
    setTimeout(() => notifsElem.className = "hidden", 8*100);
  };

  const handleMsg = (msg) => {
    if (msg.type === "RECONNECT") {
      newSocket();
      return;
    } else if (msg.type === "PONG") {
      pingFlag = false;
    } else if (msg.type === "MESSAGE") {
      try {
        const data = JSON.parse(msg.data);
      } catch (e) {
        console.log(`JSON parser error: ${e}`);
        return;
      }

      const info = data.message;
      const user = info.display_name;
      const subMsg = info.sub_message.message;
      // TODO deal with emojis

      if (info.context === "subgift") {
        const recipient = info.recipient_display_name;
        handleAlert(`${user} gave ${recipient} a sub!`, subMsg);
      } else if (info.context === "sub") {
        handleAlert(`${user} just subbed!`, subMsg);
      } else if (info.content === "resub") {
        handleAlert(`${user} just resubbed!`, subMsg);
      }
    }
  };

  newSocket();

  twitchSocket.onmessage = (msg) => {
    console.log(msg);
    handleMsg(msg);
  };
};