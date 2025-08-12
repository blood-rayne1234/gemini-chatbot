import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChatStore } from '../stores/chatStore';
import { toast } from 'react-hot-toast';
import { FiPaperclip, FiSend } from 'react-icons/fi';

const Chat = () => {
  const { id } = useParams();
  const {
    messages,
    isTyping,
    sendMessage,
    uploadImage,
    loadMoreMessages,
    setCurrentChat
  } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Set current chat on mount
  useEffect(() => {
    setCurrentChat(id);
  }, [id, setCurrentChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, id]);

  // Load more messages on scroll up
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0) {
        loadMoreMessages();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadMoreMessages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        await uploadImage(file);
        toast.success('Image uploaded');
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  const currentMessages = messages[id] || [];

  return (
    <div className="chat-container">
      <div className="messages" ref={messagesContainerRef}>
        {currentMessages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.isUser ? 'user' : 'ai'}`}
          >
            {msg.isImage ? (
              <img 
                src={msg.content} 
                alt="Uploaded content" 
                className="message-image"
              />
            ) : (
              <p>{msg.content}</p>
            )}
            <small>
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </small>
          </div>
        ))}
        {isTyping && (
          <div className="message ai typing">
            <p>Gemini is typing...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <label htmlFor="image-upload" className="upload-btn">
          <FiPaperclip />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} disabled={!input.trim()}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default Chat;