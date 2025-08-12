import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock message data generator
const generateMockMessages = (count = 20) => {
  const messages = [];
  const aiResponses = [
    "I'm analyzing your question...",
    "That's an interesting point!",
    "Based on my knowledge...",
    "Here's what I found...",
    "Let me think about that...",
    "The answer to that is...",
    "I'd be happy to help with that!",
    "That's a great question!",
  ];

  for (let i = 0; i < count; i++) {
    const isUser = Math.random() > 0.5;
    const hoursAgo = Math.floor(Math.random() * 24);
    messages.push({
      id: Date.now() - i * 100000,
      content: isUser 
        ? `User message ${i + 1}` 
        : aiResponses[Math.floor(Math.random() * aiResponses.length)],
      isUser,
      timestamp: new Date(Date.now() - hoursAgo * 3600000),
    });
  }

  return messages.sort((a, b) => a.timestamp - b.timestamp);
};

export const useChatStore = create(
  persist(
    (set, get) => ({
      chatrooms: [
        { id: '1', title: 'General Chat', createdAt: new Date() },
        { id: '2', title: 'Tech Support', createdAt: new Date(Date.now() - 3600000) },
      ],
      currentChatId: null,
      messages: {},
      isTyping: false,
      hasMore: true,
      page: 0,
      pageSize: 20,
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // Chatroom actions
      createChatroom: (title) => {
        const newChatroom = { 
          id: Date.now().toString(), 
          title, 
          createdAt: new Date() 
        };
        set((state) => ({ 
          chatrooms: [...state.chatrooms, newChatroom],
          currentChatId: newChatroom.id,
          messages: {
            ...state.messages,
            [newChatroom.id]: []
          }
        }));
        return newChatroom;
      },

      deleteChatroom: (id) => {
        set((state) => {
          const newMessages = { ...state.messages };
          delete newMessages[id];
          return {
            chatrooms: state.chatrooms.filter(chat => chat.id !== id),
            messages: newMessages,
            currentChatId: state.currentChatId === id ? null : state.currentChatId
          };
        });
      },

      setCurrentChat: (id) => {
        set({ currentChatId: id });
        if (!get().messages[id]) {
          set((state) => ({
            messages: {
              ...state.messages,
              [id]: generateMockMessages(10)
            },
            page: 0,
            hasMore: true
          }));
        }
      },

      // Message actions
      sendMessage: (content) => {
        if (!get().currentChatId) return;
        
        const newMessage = {
          id: Date.now(),
          content,
          isUser: true,
          timestamp: new Date()
        };

        set((state) => ({
          messages: {
            ...state.messages,
            [state.currentChatId]: [
              ...(state.messages[state.currentChatId] || []),
              newMessage
            ]
          },
          isTyping: true
        }));

        // Simulate AI response after delay
        setTimeout(() => {
          get().simulateAIResponse();
        }, 1000 + Math.random() * 2000);
      },

      simulateAIResponse: () => {
        const currentChatId = get().currentChatId;
        if (!currentChatId) return;

        const aiResponses = [
          "I'm analyzing your question...",
          "That's an interesting point!",
          "Based on my knowledge...",
          "Here's what I found...",
        ];
        const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];

        set((state) => ({
          isTyping: true
        }));

        setTimeout(() => {
          set((state) => ({
            isTyping: false,
            messages: {
              ...state.messages,
              [currentChatId]: [
                ...(state.messages[currentChatId] || []),
                {
                  id: Date.now(),
                  content: response,
                  isUser: false,
                  timestamp: new Date()
                }
              ]
            }
          }));
        }, 1500 + Math.random() * 2000);
      },

      // Pagination
      loadMoreMessages: () => {
        const { currentChatId, page, pageSize } = get();
        if (!currentChatId || !get().hasMore) return;

        set({ isTyping: true });
        
        // Simulate API delay
        setTimeout(() => {
          set((state) => {
            const newMessages = generateMockMessages(pageSize);
            return {
              messages: {
                ...state.messages,
                [currentChatId]: [
                  ...newMessages,
                  ...(state.messages[currentChatId] || [])
                ]
              },
              page: state.page + 1,
              hasMore: state.page < 3, // Load 3 pages max for demo
              isTyping: false
            };
          });
        }, 800);
      },

      // Image upload
      uploadImage: (file) => {
        const currentChatId = get().currentChatId;
        if (!currentChatId) return;

        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageMessage = {
              id: Date.now(),
              content: e.target.result,
              isUser: true,
              isImage: true,
              timestamp: new Date()
            };

            set((state) => ({
              messages: {
                ...state.messages,
                [currentChatId]: [
                  ...(state.messages[currentChatId] || []),
                  imageMessage
                ]
              }
            }));

            resolve(imageMessage);
          };
          reader.readAsDataURL(file);
        });
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ 
        chatrooms: state.chatrooms,
        messages: state.messages,
        darkMode: state.darkMode 
      }),
    }
  )
);