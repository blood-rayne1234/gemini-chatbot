import { useChatStore } from '../stores/chatStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const Dashboard = () => {
  const { chatrooms, createChatroom, deleteChatroom, setCurrentChat } = useChatStore();
  const navigate = useNavigate();

  const handleCreateChat = () => {
    const title = prompt('Enter chatroom name');
    if (title && title.trim()) {
      const newChat = createChatroom(title);
      setCurrentChat(newChat.id);
      navigate(`/chat/${newChat.id}`);
      toast.success(`Created "${title}"`);
    }
  };

  const handleDeleteChat = (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      deleteChatroom(id);
      toast.success(`Deleted "${title}"`);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Your Chats</h2>
        <button onClick={handleCreateChat} className="create-btn">
          <FiPlus /> New Chat
        </button>
      </div>

      <div className="chatroom-list">
        {chatrooms.map(chat => (
          <div 
            key={chat.id} 
            className="chatroom-card"
            onClick={() => {
              setCurrentChat(chat.id);
              navigate(`/chat/${chat.id}`);
            }}
          >
            <div className="chatroom-info">
              <h3>{chat.title}</h3>
              <small>{new Date(chat.createdAt).toLocaleDateString()}</small>
            </div>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChat(chat.id, chat.title);
              }}
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;