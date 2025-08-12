export const MessageSkeleton = ({ isUser = false }) => (
  <div className={`skeleton-message ${isUser ? 'user' : 'ai'}`}>
    <div className="skeleton-content" />
  </div>
);