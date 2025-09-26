import React, { useEffect } from "react";
import { getRepoHomepage } from "./github-octo.js";

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

type UserInputArgs = { placeholder: string; selectableOptions: string[] };
function UserInput({ placeholder, selectableOptions }: UserInputArgs) {
  if (selectableOptions.length === 0) {
    return (
      <input
        type="text"
        name="input-custom-text"
        id="input-custom-text"
        placeholder={placeholder}
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

function ChatLogs() {
  const chatLogs: ChatMessage[] = [
    {
      sender: "User",
      response: "|github url|",
      context: {
        from_user: true,
      },
    },
    {
      sender: "GitHub to Exe",
      action: "Searching for .exe file",
      response:
        "Hmm, there doesn't seem to be a releases page. Let's try checking if there is a website.",
      context: { from_user: false },
    },
    {
      sender: "User",
      response: "Can you find a website instead?",
      context: {
        from_user: true,
      },
    },
    {
      sender: "GitHub to Exe",
      action: "Searching for website...",
      response:
        "I found a website within the description that possibly has a download link. |website url|",
      context: { from_user: false },
    },
  ];

  useEffect(() => {
    console.log("Should run twice!");
    // I use arch btw 🤓
    getRepoHomepage("https://github.com/basecamp/omarchy").then((homepage) => {
      if (homepage) {
        console.log(homepage);
      }
    });
  }, []);

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
  const placeholder = "GitHub Link or URL";
  const selectableOptions = [
    "My CPU architecture is amd64",
    "My CPU architecture is arm",
  ];

  return (
    <div id="chat-window">
      <ChatLogs />
      <UserInput placeholder={placeholder} selectableOptions={[]} />
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
