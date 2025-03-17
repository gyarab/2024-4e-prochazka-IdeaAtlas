// This file contians the functions that are used to manage the history of the graph data structure
class HistoryManager {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
        this.maxHistory = 10; // Maximum number of saved states
    }


    // I guess In Js we do not declare function with function keyword in class - strange
    addToHistory(data) {
        // Create deep copy using structuredClone
        const dataCopy = {
            nodes: JSON.parse(JSON.stringify(data.nodes)),
            edges: JSON.parse(JSON.stringify(data.edges)),
            layouts: JSON.parse(JSON.stringify(data.layouts))
        };
        
        // Remove any future history entries
        this.history = this.history.slice(0, this.currentIndex + 1);

        this.currentIndex++;
        this.history[this.currentIndex] = dataCopy;
        // If currentIndex is greater than maxHistory, remove the first element
        // And shift all elements to the left
        if (this.currentIndex > this.maxHistory) {
            this.history.shift();
            this.currentIndex--;
        }
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
// Export the HistoryManager class
// Different scripts can import this class and use it
// Will use the same instance of the class
export const historyManager = new HistoryManager();