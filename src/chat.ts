import React from "react";
import {
  getReleasesUrl,
  getRepoHomepage,
  isValidGitHubRepoUrl,
} from "./github-octo.js";

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

type OnInputArgs = {
  chatLogs: ChatMessage[];
  chatStateName: string;
  setChatLogs: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setChatStateName: React.Dispatch<React.SetStateAction<string>>;
};

export const CHAT_STATE_NAMES = {
  ASK_FOR_URL: "AskForUrl",
  WEBSITE_OBTAINED: "WebsiteObtained",
  RELEASES_OBTAINED: "ReleasesObtained",
  RESTART: "Restart",
  WAITING: "Waiting",
};

export const CHAT_STATES: Record<string, ChatState> = {
  [CHAT_STATE_NAMES.ASK_FOR_URL]: {
    options: [],
    placeholder: "GitHub Link or URL",
  },
  [CHAT_STATE_NAMES.WEBSITE_OBTAINED]: {
    options: ["There's no download listed."],
    placeholder: "",
  },
  [CHAT_STATE_NAMES.RELEASES_OBTAINED]: {
    options: ["This is too confusing."],
    placeholder: "",
  },
  [CHAT_STATE_NAMES.WAITING]: {
    options: [],
    placeholder: "",
  },
  [CHAT_STATE_NAMES.RESTART]: {
    options: ["Restart App"],
    placeholder: "",
  },
};

export const ON_INPUT = {
  [CHAT_STATE_NAMES.ASK_FOR_URL]: (url: string, onInputObject: OnInputArgs) => {
    if (!isValidGitHubRepoUrl(url)) {
      return;
    }

    onInputObject.setChatStateName(CHAT_STATE_NAMES.WAITING);

    onInputObject.setChatLogs(
      appendMessage(
        onInputObject.chatLogs,
        sendMessage(
          SENDERS.APP,
          "I am looking the project up. Just give me a moment.",
          "Looking for an associated website...",
        ),
      ),
    );

    getRepoHomepage(url).then((homepage) => {
      if (!homepage) {
        const newChatLogs = amendMessage(
          onInputObject.chatLogs,
          sendMessage(
            SENDERS.APP,
            "Sorry, but there's no homepage associated with that GitHub link",
            "Looking for an associated website...",
          ),
        );

        onInputObject.setChatLogs(
          appendMessage(
            newChatLogs,
            sendMessage(
              SENDERS.APP,
              "Let me check the Releases page.",
              "Looking for download page...",
            ),
          ),
        );

        getReleasesUrl(url).then((releasesUrl) => {
          if (!releasesUrl) {
            onInputObject.setChatLogs((prev) =>
              amendMessage(
                prev,
                sendMessage(
                  SENDERS.APP,
                  "I couldn't find anything. Sorry.",
                  "Looking for download page...",
                ),
              ),
            );

            onInputObject.setChatStateName(CHAT_STATE_NAMES.RESTART);
            return;
          }

          onInputObject.setChatLogs((prev) =>
            amendMessage(
              prev,
              sendMessage(
                SENDERS.APP,
                `I found a download page here: ${releasesUrl}`,
                "Looking for download page...",
              ),
            ),
          );

          onInputObject.setChatStateName(CHAT_STATE_NAMES.RELEASES_OBTAINED);
        });
        return;
      }

      onInputObject.setChatLogs(
        amendMessage(
          onInputObject.chatLogs,
          sendMessage(
            SENDERS.APP,
            `I found a website within the description that possibly has a download: ${homepage}`,
            "Looking for an associated website...",
          ),
        ),
      );

      onInputObject.setChatStateName(CHAT_STATE_NAMES.WEBSITE_OBTAINED);
    });
  },
  [CHAT_STATE_NAMES.RESTART]: (_, onInputObject: OnInputArgs) => {
    console.log(_);
    onInputObject.setChatLogs(newChatLog());
    onInputObject.setChatStateName(CHAT_STATE_NAMES.ASK_FOR_URL);
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

export function amendMessage(chatLog: ChatMessage[], newMessage: ChatMessage) {
  return [...chatLog.slice(0, -1), newMessage];
}
