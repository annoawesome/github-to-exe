type ChatMessageContext = {
  from_user: boolean;
  action_id?: string | undefined;
};

type ChatMessage = {
  sender: string;
  action?: string;
  response: string;
  context: ChatMessageContext;
};

type ChatState = {
  options: string[];
  placeholder?: string;
};

export const CHAT_STATE_NAMES = {
  ASK_FOR_URL: "AskForUrl",
  RESTART: "Restart",
};

export const CHAT_STATES: Record<string, ChatState> = {
  [CHAT_STATE_NAMES.ASK_FOR_URL]: {
    options: [],
    placeholder: "GitHub Link or URL",
  },
  [CHAT_STATE_NAMES.RESTART]: {
    options: ["Restart App"],
    placeholder: "",
  },
};

export const SENDERS = {
  USER: "User",
  APP: "GitHub to Exe",
  AI: "AI",
};

export function newChatLog(): ChatMessage[] {
  return [];
}

export function sendMessage(
  sender: string,
  response: string,
  action: string | void,
): ChatMessage {
  const chatMessage: ChatMessage = {
    sender: sender,
    response: response,
    context: {
      from_user: sender === SENDERS.USER,
    },
  };

  if (action) {
    chatMessage.action = action;
  }

  return chatMessage;
}

export function appendMessage(chatLog: ChatMessage[], message: ChatMessage) {
  return [...chatLog, message];
}
