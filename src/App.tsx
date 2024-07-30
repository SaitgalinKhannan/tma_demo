import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
  Button,
  DialogActions,
} from "@mui/material";
import NavigationBar from "./components/NavigationBar.tsx";
import {
  isPhotoMessage,
  isTextMessage,
  Message,
  MessageStatus,
  TextMessage,
} from "./model/Message.ts";
import Command from "./model/Command.ts";
import CommandBar from "./components/CommandBar.tsx";
import CustomAlert from "./utils/CustomAlert.tsx";
import { getImage } from "./data.ts";

const generateMessages = (): TextMessage[] => {
  const messages: TextMessage[] = [];
  const now = Date.now();
  const chatId = "chat_1";
  const sessionId = "session_1";
  const user1 = "0";
  const user2 = "1";

  for (let i = 0; i < 20; i++) {
    const isUser1Sender = i % 2 === 0;
    messages.push({
      id: `msg_${i + 1}`,
      chatId: chatId,
      sessionId: sessionId,
      sender: isUser1Sender ? user1 : user2,
      receiver: isUser1Sender ? user2 : user1,
      timestamp: now - (20 - i) * 60000,
      senderStatus: MessageStatus.SENT,
      receiverStatus:
        i < 15
          ? MessageStatus.READ
          : i < 18
          ? MessageStatus.DELIVERED
          : MessageStatus.SENT,
      type: "TextMessage",
      textMessage: `Сообщение ${i + 1} от ${isUser1Sender ? user1 : user2}`,
    });
  }

  return messages;
};

function ChatPage() {
  const id = 0;
  const [messages, setMessages] = useState<Message[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showPhotoSendDialog, setShowPhotoSendDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showCommands, setShowCommands] = useState(false);
  const commands: Command[] = [
    {
      command: "hi",
      description: "Приветствую",
    },
  ];
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMessages(generateMessages());
  }, []);

  const handleClickToImage = (url: string) => {
    setImageUrl(url);
    toggleFullScreen();
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleFileSendDialogClose = () => {
    setShowPhotoSendDialog(false);
    setFile(null);
  };

  const handleFileSendDialogSubmit = () => {
    if (file) {
      setShowPhotoSendDialog(false);
      handleSendPhotoMessage(file);
      setFile(null);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Выбранный файл:", file);
      setFile(file);
    }
  };

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setShowPhotoSendDialog(true);
      // Очистка URL при размонтировании компонента
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleSendTextMessage = (message: string | null) => {
    handleSendMessage(message, null);
    textareaRef.current?.blur();
  };

  const handleSendPhotoMessage = (file: File | null) => {
    handleSendMessage(null, file);
  };

  const handleSendMessage = (message: string | null, file: File | null) => {
    const textMessage = message ? message.trim() : null;
    if (textMessage || file) {
      const messageToSend = textMessage || file;
      if (messageToSend) {
        // Для теста
        if (typeof messageToSend === "string") {
          const newMessage: Message = {
            id: `msg_${Date.now()}`,
            chatId: "chat_1", // Предполагаем, что это текущий чат
            sessionId: "session_1", // Предполагаем, что это текущая сессия
            sender: "0", // Предполагаем, что отправитель - user1
            receiver: "1", // Предполагаем, что получатель - user2
            timestamp: Date.now(),
            senderStatus: MessageStatus.DELIVERED,
            receiverStatus: MessageStatus.READ,
            type: "TextMessage",
            textMessage: `Сообщение от 0 юзеру 1`,
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }

        const res = "success"; //sendMessage(messageToSend);
        if (res === "success") {
          if (textMessage) {
            setNewMessage("");
            setShowSuccessAlert(true);
          }
        } else if (res === "error") {
          setErrorText("Не удалось отправить сообщение");
          setShowErrorAlert(true);
        } else if (res === "no connected") {
          setErrorText("Нет соединения");
          setShowErrorAlert(true);
        }
      }
    }
  };

  useEffect(() => {
    if (showSuccessAlert) {
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 1000);
    }

    if (showErrorAlert) {
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 1000);
    }
  }, [showSuccessAlert, showErrorAlert]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputMessage = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setNewMessage(value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px"; // Начальная высота
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 96)}px`;
    }
  }, [newMessage]);

  const preventCollapse = () => {
    const num = 9999;
    document.documentElement.style.marginTop = `${num}px`;
    document.documentElement.style.height = `${window.innerHeight + num}px`;
    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, num);
  };

  const allowCollapse = () => {
    document.documentElement.style.marginTop = "auto";
    document.documentElement.style.height = "auto";
    document.documentElement.style.overflow = "auto";
  };

  const handleTouchStart = () => {
    if (
      messageContainerRef.current &&
      messageContainerRef.current.scrollTop !== 0
    ) {
      preventCollapse();
    }
  };

  const handleTouchEnd = () => {
    allowCollapse();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
        textareaRef.current.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Box display="flex" flexDirection="column" flexGrow={1} height="100%">
        <NavigationBar navigateTo={"/"} text={"Fixed nav bar"} />

        {/*<div className="status">Collapse: Released</div>*/}

        <div
          ref={messageContainerRef}
          className="scrollable"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                justifyContent:
                  message.sender === id.toString() ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  borderRadius: "0.9375rem",
                  padding: "10px",
                  maxWidth: "70%",
                  backgroundColor:
                    message.sender === id?.toString() ? "#e3f2fd" : "#f5f5f5",
                }}
              >
                {isTextMessage(message) && (
                  <Typography
                    variant="body1"
                    sx={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                      margin: 0,
                    }}
                  >
                    {(message as TextMessage).textMessage}
                  </Typography>
                )}

                {isPhotoMessage(message) && (
                  <img
                    src={getImage(message.photoUrl)}
                    alt="image"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      display: "block",
                    }}
                    onClick={() =>
                      handleClickToImage(getImage(message.photoUrl))
                    }
                  />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1,
                    textAlign: "right",
                    fontSmooth: "auto",
                  }}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Paper>
            </div>
          ))}
        </div>

        {/*<Box
                        ref={messageContainerRef}
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto', // Добавляет скролл для списка сообщений
                            paddingX: "8px",
                        }}
                    >
                        <List dense={true}>
                            {messages.map((message) => (
                                <ListItem
                                    key={message.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: message.sender === tgId?.toString() ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            padding: "10px",
                                            maxWidth: '70%',
                                            backgroundColor: message.sender === tgId?.toString() ? '#e3f2fd' : '#f5f5f5',
                                        }}
                                    >
                                        {
                                            (isTextMessage(message) && <Typography
                                                variant="body1">{(message as TextMessage).textMessage}</Typography>)
                                        }

                                        {
                                            (isPhotoMessage(message) && <img
                                                src={getImage(message.photoUrl)}
                                                alt="image"
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    display: 'block'
                                                }}
                                            />)
                                        }
                                        <Typography variant="caption"
                                                    sx={{display: 'block', mt: 1, textAlign: 'right'}}>
                                            {new Date(message.timestamp).toLocaleTimeString()}
                                        </Typography>
                                    </Paper>
                                </ListItem>
                            ))}
                        </List>
                    </Box>*/}

        {/*<div className="input-container">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Введите сообщение..."
                        className="custom-input"
                    />
                    <button className="attach-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20"
                             height="20">
                            <path
                                d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
                        </svg>
                    </button>
                    <button className="send-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24"
                             height="24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>*/}

        <Box marginX="8px">
          <div className="input-container">
            <button
              className="chat-attach-button"
              onClick={() => {
                setShowCommands(true);
              }}
            >
              <svg width="24px" height="24px" viewBox="0 0 24 24">
                <rect width="24" height="24" rx="6" fill={"#8774e1"} />
                <path
                  d="M7 8h10M7 12h10M7 16h10"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleInputMessage}
              placeholder="Введите сообщение..."
              className="custom-input"
            />
            <button className="chat-attach-button" onClick={handleFileClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          <button
            ref={buttonRef}
            className="send-button" /*style={{bottom: `${buttonBottom}px`}}*/
            onClick={() => handleSendTextMessage(newMessage)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </Box>
      </Box>

      <CommandBar
        commands={commands}
        showCommands={showCommands}
        setShowCommands={setShowCommands}
        sendMessage={handleSendTextMessage}
      />

      {previewUrl && (
        <Dialog open={showPhotoSendDialog} onClose={handleFileSendDialogClose}>
          <DialogTitle>Отправить изображение?</DialogTitle>
          <DialogContent>
            <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%" }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFileSendDialogClose}>Отмена</Button>
            <Button onClick={handleFileSendDialogSubmit}>Отправить</Button>
          </DialogActions>
        </Dialog>
      )}

      {isFullScreen && imageUrl && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={toggleFullScreen}
        >
          <img
            src={imageUrl}
            alt="fullscreen image"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {showSuccessAlert && <CustomAlert severity="success" message="Успешно" />}

      {showErrorAlert && <CustomAlert severity="error" message={errorText} />}
    </>
  );
}

export default ChatPage;
