export default {

   async saveItem(item, selectedValue) {
        try {
          await AsyncStorage.removeItem(item);
          await AsyncStorage.setItem(item, selectedValue);
        } catch (error) {
          console.warn('AsyncStorage error: ' + error.message);
        }
      }

} 