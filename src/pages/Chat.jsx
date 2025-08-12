import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChatStore } from '../stores/chatStore';
import { toast } from 'react-hot-toast';
import { FiPaperclip, FiSend, FiCopy } from 'react-icons/fi';
import { MessageSkeleton } from '../components/common/MessageSkeleton';

const Chat = () => {
  const { id } = useParams();
  const {
    messages,
    isTyping,
    sendMessage,
    uploadImage,
    loadMoreMessages,
    setCurrentChat,
    currentChatId // Added this missing destructured value
  } = useChatStore();
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Set current chat on mount
  useEffect(() => {
    setCurrentChat(id);
    // Simulate loading messages
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [id, setCurrentChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, id]); // Changed from currentChatId to id since we're using the URL param

  // Rest of your component remains the same...
  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendImage = () => {
    if (imagePreview) {
      uploadImage(imagePreview);
      setImagePreview(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };

  const currentMessages = messages[id] || []; // Using id instead of currentChatId

  return (
    <div className="chat-container">
      <div className="messages" ref={messagesContainerRef}>
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <MessageSkeleton key={i} isUser={i % 2 === 0} />
          ))
        ) : (
          currentMessages.map((msg) => (
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
              {!msg.isUser && !msg.isImage && (
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(msg.content)}
                >
                  <FiCopy size={14} />
                </button>
              )}
            </div>
          ))
        )}
        {isTyping && (
          <div className="message ai typing">
            <p>Gemini is typing...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button onClick={() => setImagePreview(null)}>×</button>
          </div>
        )}
        <label className="upload-btn">
          <FiPaperclip />
          <input
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
          onKeyPress={(e) => e.key === 'Enter' && (imagePreview ? handleSendImage() : handleSend())}
          placeholder="Type a message..."
        />
        <button 
          onClick={imagePreview ? handleSendImage : handleSend}
          disabled={!input.trim() && !imagePreview}
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default Chat;