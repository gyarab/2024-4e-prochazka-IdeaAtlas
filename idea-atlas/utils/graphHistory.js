// This file contians the functions that are used to manage the history of the graph data structure
class HistoryManager {
    constructor() {
        this.history = [];

        this.currentIndex = 0;
        this.maxHistory = 10; // Maximum number of saved states
    }


    // I guess In Js we do not declare function with function keyword in class - strange
    addToHistory(data) {
        
        this.history[this.currentIndex] = data;
        this.currentIndex++;
        // If currentIndex is greater than maxHistory, remove the first element
        // And shift all elements to the left
        if (this.currentIndex > this.maxHistory) {
            this.history.shift();
            this.currentIndex--;
        }
        console.log(this.history);
    }
    // Increment the currentIndex by 1
    // If currentIndex is greater than the length of history, set currentIndex to the length of history -
    moveForward() {
        this.currentIndex++;
        // Checks if currentIndex is greater than the length of history
        if (this.currentIndex >= this.history.length) {
            this.currentIndex = this.history.length - 1;
        }
    }
    // Decrement the currentIndex by 1
    // If currentIndex is less than 0, set currentIndex to 0
    moveBackward() {
        this.currentIndex--;
        // Checks if currentIndex is less than 0
        if (this.currentIndex < 0) {
            this.currentIndex = 0;
        }
    }
    // Returns the current data
    getCurrentData() {
        return this.history[this.currentIndex];
    }

}
export const historyManager = new HistoryManager();