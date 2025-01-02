import { ref } from 'vue'

export const showNodeInput = ref(false)
export const showNodeEdit = ref(false)

function setShowingNodeInput(value: boolean) {
    showNodeInput.value = value
}
function getShowingNodeInput() {
    return showNodeInput.value
}
function getShowingNodeEdit() {
    return showNodeEdit.value
}
function setShowingNodeEdit(value: boolean) {
    showNodeEdit.value = value
}

// Returns true if either the node input or node edit field is shown
function checkInputFieldShown() {
    return showNodeInput.value || showNodeEdit.value
}

export {
    setShowingNodeInput,
    getShowingNodeInput,
    getShowingNodeEdit,
    setShowingNodeEdit,
    checkInputFieldShown
}