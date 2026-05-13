import { useReducer, useEffect, useRef, Reducer, Dispatch } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const usePersistedReducer = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  key: string,
): [S, Dispatch<A>] => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isHydratedRef = useRef(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(key);
        if (savedState) {
          const parsedState = JSON.parse(savedState) as S;
          dispatch({ type: 'LOAD_PERSISTED_STATE', payload: parsedState } as any);
        }
      } catch (error) {
        console.error('Failed to load state from AsyncStorage', error);
      } finally {
        isHydratedRef.current = true;
      }
    };

    loadState();
  }, [key]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save state to AsyncStorage', error);
      }
    };

    saveState();
  }, [state, key]);

  return [state, dispatch];
};
