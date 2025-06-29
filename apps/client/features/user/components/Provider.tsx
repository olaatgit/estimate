import React from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type State = {
  user: User | null;
};

export type Action =
  | {
      type: 'SET_USER';
      payload: { user: User };
    }
  | {
      type: 'UNSET_USER';
      payload: never;
    }
  | {
      type: 'UPDATE_USER';
      payload: { user: Partial<User> };
    };

type UserContext = State & {
  setUser: React.ActionDispatch<[Action]>;
};

export const userContext = React.createContext<UserContext | null>(null);

export const useUser = () => {
  const context = React.useContext(userContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const userReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        ...action.payload,
      };
    case 'UNSET_USER':
      return {
        ...state,
        user: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        } as User,
      };
    default:
      return state;
  }
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(userReducer, {
    user: null,
  });

  return (
    <userContext.Provider value={{ ...state, setUser: dispatch }}>
      {children}
    </userContext.Provider>
  );
};
