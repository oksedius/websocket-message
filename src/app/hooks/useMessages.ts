import { useReducer, useCallback } from "react";
import type { Message, MessageFilter } from "../types/message";
import { sortMessagesByNewest, countUnread } from "../utils/sortMessages";

type Action =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "MARK_READ"; payload: { id: string } }
  | { type: "DELETE_MESSAGE"; payload: { id: string } }
  | { type: "SET_FILTER"; payload: MessageFilter };

type State = {
  messages: Message[];
  filter: MessageFilter;
};

const initialState: State = {
  messages: [],
  filter: "all",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_MESSAGE": {
      const alreadyExists = state.messages.some(
        (m) => m.id === action.payload.id
      );
      if (alreadyExists) return state;
      return {
        ...state,
        messages: [action.payload, ...state.messages],
      };
    }

    case "MARK_READ": {
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id ? { ...m, isRead: true } : m
        ),
      };
    }

    case "DELETE_MESSAGE": {
      return {
        ...state,
        messages: state.messages.filter((m) => m.id !== action.payload.id),
      };
    }

    case "SET_FILTER": {
      return { ...state, filter: action.payload };
    }

    default:
      return state;
  }
}

export function useMessages() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const filteredMessages = sortMessagesByNewest(
    state.messages.filter((m) => {
      if (state.filter === "unread") return !m.isRead && !m.isSystem;
      if (state.filter === "read") return m.isRead && !m.isSystem;
      return true; 
    })
  );

  const unreadCount = countUnread(
    state.messages.filter((m) => !m.isSystem)
  );

  const addMessage = useCallback((msg: Message) => {
    dispatch({ type: "ADD_MESSAGE", payload: msg });
  }, []);

  const markRead = useCallback((id: string) => {
    dispatch({ type: "MARK_READ", payload: { id } });
  }, []);

  const deleteMessage = useCallback((id: string) => {
    dispatch({ type: "DELETE_MESSAGE", payload: { id } });
  }, []);

  const setFilter = useCallback((filter: MessageFilter) => {
    dispatch({ type: "SET_FILTER", payload: filter });
  }, []);

  return {
    messages: filteredMessages,
    allMessages: state.messages,
    filter: state.filter,
    unreadCount,
    addMessage,
    markRead,
    deleteMessage,
    setFilter,
  };
}