// We need to import useState, useEffect from react to use the state
import React, { useEffect, useState } from "react";

// Imported the Container, Row, Col components from react-bootstrap
import { Button, Col, Container, Row } from "react-bootstrap";

// We need to import the Note interface from the notes.ts file
// We are using an alias called NoteModel here because the Note type and the Note function have the same name
import { Note as NoteModel } from "./models/notes";
import Note from "./components/Note";

// We need to import the styles from the NotesPage.module.css file
import styles from "./styles/NotesPage.module.css";

// We need to import the styleUtils from the styles/utils.module.css file
import styleUtils from "./styles/utils.module.css";

// We are importing all the functions from the notesApi.ts file
import * as NotesApi from "./network/notesApi";

// Imported AddNoteDialog component from the AddNoteDialog.tsx file
import AddNoteDialog from "./components/AddNoteDialog";

function App() {
  // Here we want something to save the current state of the application
  // We need to notify react to reach out to UI to display the new values
  // We can create a state variable to store the current state of the application

  // notes is the state variable and setNotes is the function to update the state
  // Remember that the if the state variable's name is notes, the function to update the state should be setNotes (likewise for other variables)
  // Because we are importing the notes from the notes.ts file as an array , we are using a empty array as the initial value
  // We also need to define the type of the state variable as an array of Note objects (<Note[]>)
  const [notes, setNotes] = useState<NoteModel[]>([]);

  // We are creating another state to tell react whether to open the create note modal or not (AddNoteDialog component)
  // We are defining the showAddNoteDialog state variable is a boolean and it's default value is false
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

  // We only want to fetch the notes once when the component is mounted
  // It should happen automatically without us needing to click a button (do anything)
  // We can use the useEffect hook to do this
  // The function inside useEffect will be called when the component is mounted
  useEffect(() => {
    // We are using fetch to make a request to the backend
    // We need to create a async function to use the await keyword
    // So we can create a function inside useEffect and call it
    async function fetchNotes() {
      // fetch call can send an error id something goes wrong
      // We can use try catch to handle the error
      try {
        // This will pass the json body of the response to the notes variable
        // We are using the fetchNotes function from the notesApi.ts file to get the notes
        // We imported all the functions from the notesApi.ts file as NotesApi
        const notes = await NotesApi.fetchNotes();

        // Now we need to set the notes state variable to the data
        // When the status of the state variable (notes) changes by (setNotes), react will automatically update the UI
        setNotes(notes);
      } catch (error) {
        // For now wee can log the error to the console and send an alert (popup) to the user
        console.error(error);
        alert(error);
      }
    }
    // We need to call the fetchNotes function to make the request
    fetchNotes();
    // We need to add the empty array as the second argument to make sure the function is only called once
    // Otherwise the function will be called every time the component is rendered
    // We can also add other dependencies to the function
    // For example, we can add the notes array as a dependency to make sure the function is only called when the notes array changes
  }, []);

  // We need to create a function to delete a note that we are going to pass to the Note component
  async function deleteNote(note: NoteModel) {
    try {
      // We are using the deleteNote function from the notesApi.ts file to delete the note
      await NotesApi.deleteNote(note._id);

      // We need to update the state of the notes application by fetching the notes again
      // We are using the fetchNotes function from the notesApi.ts file to get the notes
      const notes = await NotesApi.fetchNotes();

      // We need to set the notes state variable to the new notes array
      // When the state of the notes variable changes, react will automatically update the UI
      setNotes(notes);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  // The return statement returns the actual UI element
  return (
    // Container is a bootstrap component. This will add some padding to the sides of the page
    <Container>
      {/* We need a Button to change the value of showAddDialog state variable so it can be visible conditionally */}
      {/* We are using a react component called a Button */}
      {/* We are using a onClick event listener here to pass a arrow function to call the setShowAddDialog state function */}
      {/* So, when the button is clicked, the setShowAddDialog state function will be called and set the value to true */}

      <Button
        onClick={() => setShowAddNoteDialog(true)}
        // mt-4 is a margin top utility class in bootstrap and this will add a margin top of 4px
        // We are using the blockCenter utility class to center the button horizontally
        // We are using battiks method to add multiple classes to the button
        className={`mt-4 ${styleUtils.blockCenter}`}
      >
        Add a new note
      </Button>

      {/* Row is a bootstrap component */}
      {/* We need to define how many columns per each row we should have in different different screen sizes when using the application*/}
      <Row xs={1} md={2} xl={3}>
        {/* Displaying the notes using the note card components we created  */}
        {/* Map allows us to get some specific data (like the array of notes here) and turn it into something different (like notes component)*/}
        {/* We can use the map function to loop over the notes array and return a Note component for each note */}

        {/* Looping thought notes array while calling the each note as note variable ( (note) => ) */}
        {notes.map((note) => (
          // Col is a bootstrap component
          // The key prop is required by react to keep track of the elements in the list
          // We can use the _id field of the note object of each iteration as the key because it is unique
          <Col key={note._id}>
            {/* This <Note /> component is the one we created in the Note.tsx file */}
            {/* We can pass the note object of each iteration as a prop to the Note component */}
            {/* We passed the .note and .note:hover classes to the Note component to add some styles */}
            {/* As we defined adding a className is optional here*/}
            <Note
              note={note}
              className={styles.note}
              // We need to add onDeleteNoteClicked callback function here
              // We can define the function here and pass it as a prop to the Note component
              // But because this function is a complex function, we can define it outside the return statement
              onDeleteNoteClicked={deleteNote}
            />
          </Col>
        ))}
      </Row>

      {/* There is a way to show react ui components conditionally in the screen */}
      {/* We are using the state variable and && operator. */}
      {/* Now only when the state variable is true, the component will be rendered */}
      {showAddNoteDialog && (
        <AddNoteDialog
          // We are passing setShowAddNoteDialog function as a prop to the AddNoteDialog component
          // Now, when onDismiss triggers, the setShowAddNoteDialog function will be called and the value will be set to false
          onDismiss={() => setShowAddNoteDialog(false)}
          // We need to pass the onNoteSaved callback function to the AddNoteDialog component
          // This callback function will be called when a note is saved successfully
          // We can define what we need to do when a note is saved in the App component here
          // First, we need to change the state of the notes application by fetching the notes again and setting the notes state variable
          // Then, we need to close the AddNoteDialog component by changing the ShowAddNoteDialog state variable to true.
          // We state changes react will automatically update the UI
          onNoteSaved={(newNote) => {
            // The [...notes, newNote] will create a new array and adds the newNote to the array
            // Then we are setting the notes state variable to the new array
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);
          }}
        />
      )}

      {/* There is another way to show the component conditionally in the screen */}
      {/* We can pass a boolean value to the component as a prop */}
      {/* Then we can use a 'show' property inside the component, so it will be rendered only when the boolean value is true */}
      {/* But in that way even we closed the modal, the data we typing on the form will be there */}
      {/* But when we are using this method the data will be automatically cleared */}
    </Container>
  );
}

export default App;
