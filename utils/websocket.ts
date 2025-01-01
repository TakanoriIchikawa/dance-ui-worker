import Echo from 'laravel-echo'
import io from 'socket.io-client'

export const connectWebSocket = (): void => {
  // const { backendUrl } = useRuntimeConfig().public
  const backendUrl = "http://worker.api.dance.localhost";

  window.io = io
  window.echo = new Echo({
    broadcaster: 'socket.io',
    host: backendUrl + ':6001'
  })

  window.echo.connector.socket.on("connect", () => {
    console.log("WebSocket connection completed");
    listenChatMessageBroadcastEvent();
  });
}

const listenChatMessageBroadcastEvent = () => {
  const route = useRoute();
  const { auth } = useAuth();
  const { fetch } = useChat();
  const { find } = useChatMessage();
  const { showSnackbar } = useSnackbar();
  window.echo.channel(`laravel_database_worker-chat-message-broadcast-event-${auth.value?.id}`).listen("Worker.ChatMessageBroadcastEvent", async (event: { chatId: string, chatMessageId: string }) => {
    if (route.name === "chat") {
      await fetch({ ...route.query, is_group: (route.query.hasOwnProperty("is_group") ? route.query.is_group : true) });
    } 
    if (route.name === "chat-id" && route.params.id === event.chatId) {
      await find(event.chatMessageId, true)
    }
    showSnackbar("メッセージを受信しました", "success", "top right");
  });
}
