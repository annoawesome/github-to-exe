import React from "react";

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
  return (
    <div id="chat-window">
      <ChatLogs />
      <input
        type="text"
        name="input-github-url"
        id="input-github-url"
        placeholder="GitHub URL..."
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
