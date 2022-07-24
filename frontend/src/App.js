import React, { useState } from "react";
import axios from 'axios';
import './App.css';
import { SERVER_ADDRESS } from './constants';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)
  const [noteId, setNoteId] = useState(null);
  const params = new URLSearchParams(window.location.search);
  let noteQueryParam;
  if (!loading) {
    noteQueryParam = params.get('note');
  }

  const handleMessageChange = event => {
    setMessage(event.target.value);
  };

  const refreshPage = () => {
    window.location = '/';
  }

  if (noteQueryParam) {
    if (window.confirm('Read and destroy?\nYou\'re about to read and destroy the note with id' + noteQueryParam)) {
      setLoading(true);
      axios.get(`${SERVER_ADDRESS}notes/${noteQueryParam}`)
        .then(response => response.data)
        .then(data => {
          setMessage(data.text);
          axios.delete(`${SERVER_ADDRESS}notes/${noteQueryParam}`)
            .catch(_ => { })
        })
        .catch(err => {
          if (err.request.status === 404) {
            window.alert('Your message is not found!');
            refreshPage();
          }
        })
    } else {
      refreshPage();
    }
  }

  const createNote = async () => {
    axios.post(`${SERVER_ADDRESS}notes/add`, {
      text: message
    })
      .then(response => response.data)
      .then(data => {
        setNoteId(data.noteId);
      })
      .catch(err => {
        alert(err.message);
      });
  };
  const form = loading ? <>The message will be deleted on refresh</> : <button onClick={createNote}>Create Note</button>;
  const content = noteId ? <>
    <h4>Note link ready</h4>
    <a href={"http://localhost:3000/?note=" + noteId} >http://localhost:3000/?note={noteId}</a>
    <p>
      <i>The note will self-destruct after reading it.</i>
    </p>
  </> :
    <>
      <textarea disabled={loading} id="note" name="note" rows="4" placeholder="Write your note here..." value={message} onChange={handleMessageChange}></textarea>
      {form}
      <button onClick={refreshPage}>Reload</button>
    </>;

  return (
    <div className="App">
      {
        content
      }
    </div>
  );
}

export default App;
