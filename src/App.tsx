import React, { useState } from "react";
import { CHAT_STATE_NAMES, CHAT_STATES, newChatLog, ON_INPUT } from "./chat.js";

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
    if (placeholder.length > 0) {
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
      return (
        <p className="secondary-text" id="waiting-text">
          Waiting for response...
        </p>
      );
    }
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
  const [chatStateName, setChatStateName] = useState(
    CHAT_STATE_NAMES.ASK_FOR_URL,
  );

  const chatState = CHAT_STATES[chatStateName];

  return (
    <div id="chat-window">
      <ChatLogs chatLogs={chatLogs} />
      <UserInput
        placeholder={chatState.placeholder}
        selectableOptions={chatState.options}
        onInput={(text) => {
          ON_INPUT[chatStateName](text, {
            chatLogs: chatLogs,
            chatStateName: chatStateName,
            setChatLogs: setChatLogs,
            setChatStateName: setChatStateName,
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
