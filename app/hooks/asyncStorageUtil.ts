import AsyncStorage from '@react-native-async-storage/async-storage';

type AsyncStorageUtil = {
    saveData: (key: string, value: any) => Promise<void>;
    getData: <T>(key: string) => Promise<T | null>;
    removeData: (key: string) => Promise<void>;
    clearAllData: () => Promise<void>;
    mergeData: (key: string, value: any) => Promise<void>;
};

export const asyncStorageUtil: AsyncStorageUtil = {
    /**
     * Save data to AsyncStorage.
     * @param {string} key - The key under which the data is stored.
     * @param {any} value - The value to store.
     * @returns {Promise<void>}
     */
    saveData: async (key: string, value: any): Promise<void> => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
            console.log('Data successfully saved');
        } catch (error) {
            console.error('Error saving data', error);
        }
    },

    /**
     * Retrieve data from AsyncStorage.
     * @param {string} key - The key to retrieve the data from.
     * @returns {Promise<any|null>} - The retrieved data or null if not found.
     */
    getData: async <T>(key: string): Promise<T | null> => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('Error retrieving data', error);
            return null;
        }
    },

    /**
     * Remove data from AsyncStorage.
     * @param {string} key - The key to remove the data from.
     * @returns {Promise<void>}
     */
    removeData: async (key: string): Promise<void> => {
        try {
            await AsyncStorage.removeItem(key);
            console.log('Data successfully removed');
        } catch (error) {
            console.error('Error removing data', error);
        }
    },

    /**
     * Clear all data from AsyncStorage.
     * @returns {Promise<void>}
     */
    clearAllData: async (): Promise<void> => {
        try {
            await AsyncStorage.clear();
            console.log('All data cleared');
        } catch (error) {
            console.error('Error clearing data', error);
        }
    },

    /**
     * Merge data with existing value in AsyncStorage.
     * @param {string} key - The key to merge the data with.
     * @param {any} value - The value to merge.
     * @returns {Promise<void>}
     */
    mergeData: async (key: string, value: any): Promise<void> => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.mergeItem(key, jsonValue);
            console.log('Data successfully merged');
        } catch (error) {
            console.error('Error merging data', error);
        }
    }
};
