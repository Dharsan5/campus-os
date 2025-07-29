document.addEventListener("DOMContentLoaded", function() {
    const noteForm = document.getElementById("note-form");
    const noteInput = document.getElementById("note-input");
    const noteList = document.getElementById("note-list");

    noteForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const noteText = noteInput.value.trim();
        if (noteText) {
            addNote(noteText);
            noteInput.value = "";
        }
    });

    function addNote(text) {
        const noteItem = document.createElement("li");
        noteItem.textContent = text;
        noteList.appendChild(noteItem);
    }
});
// This script handles the functionality of adding notes to a list
// when the form is submitted. It listens for the form submission, prevents the default behavior,
// retrieves the note text from the input field, and adds it to the list if it's not empty.