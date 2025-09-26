import React, { useState } from "react";
import { getRepoHomepage, isValidGitHubRepoUrl } from "./github-octo.js";
import {
  appendMessage,
  CHAT_STATE_NAMES,
  CHAT_STATES,
  newChatLog,
  SENDERS,
  sendMessage,
} from "./chat.js";

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

type UserInputArgs = {
  placeholder: string;
  selectableOptions: string[];
  onInput: (userInput: string) => void;
};
function UserInput({ placeholder, selectableOptions, onInput }: UserInputArgs) {
  if (selectableOptions.length === 0) {
    return (
      <input
        type="text"
        name="input-custom-text"
        id="input-custom-text"
        placeholder={placeholder}
        onKeyDown={(input) => {
          if (input.key === "Enter") {
            onInput(input.currentTarget.value);
          }
        }}
      />
    );
  } else {
    const optionList = selectableOptions.map((option, index) => {
      return (
        <button key={index} className="input-selectable-option">
          {option}
        </button>
      );
    });

    return <div id="selectable-options">{optionList}</div>;
  }
}

function ChatLogs({ chatLogs }: { chatLogs: ChatMessage[] }) {
  const chatMessages = chatLogs.map((msg, index) => {
    const floatToRight = msg.context.from_user ? "flex-right" : "";

    return (
      <div className={"app-response " + floatToRight} key={index}>
        <p className="app-response-sender">{msg.sender}</p>
        <p className="app-response-text">
          {msg.action ? (
            <>
              <i>{msg.action}</i>
              <br />
            </>
          ) : (
            ""
          )}
          {msg.response}
        </p>
      </div>
    );
  });

  return <div id="chat-logs">{chatMessages}</div>;
}

function ChatWindow() {
  const [chatLogs, setChatLogs] = useState(newChatLog());
  const [chatState, setChatState] = useState(
    CHAT_STATES[CHAT_STATE_NAMES.ASK_FOR_URL],
  );

  return (
    <div id="chat-window">
      <ChatLogs chatLogs={chatLogs} />
      <UserInput
        placeholder={chatState.placeholder}
        selectableOptions={chatState.options}
        onInput={(url) => {
          if (!isValidGitHubRepoUrl(url)) {
            return;
          }

          getRepoHomepage(url).then((homepage) => {
            if (homepage) {
              setChatLogs(
                appendMessage(
                  chatLogs,
                  sendMessage(
                    SENDERS.APP,
                    `I found a website within the description that possibly has a download: ${homepage}`,
                  ),
                ),
              );
              setChatState(CHAT_STATES[CHAT_STATE_NAMES.RESTART]);
            }
          });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ChatWindow />
    </>
  );
}
