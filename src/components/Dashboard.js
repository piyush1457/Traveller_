// components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ItineraryForm from './ItinerayForm'; 
import './Dashboard.css';


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (currUser) => {
      if (!currUser) return navigate('/');
      setUser(currUser);

      // Load notes
      const noteQuery = query(collection(db, 'notes'), where('userId', '==', currUser.uid));
      const noteSnapshot = await getDocs(noteQuery);
      setNotes(noteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Load itineraries
      const itinQuery = query(collection(db, 'itineraries'), where('userId', '==', currUser.uid));
      const itinSnapshot = await getDocs(itinQuery);
      setItineraries(itinSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const addNote = async () => {
    if (!note.trim()) return;
    const noteData = {
      text: note,
      userId: user.uid,
      createdAt: new Date()
    };
    const newNote = await addDoc(collection(db, 'notes'), noteData);
    setNotes([...notes, { id: newNote.id, ...noteData }]);
    setNote('');
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, 'notes', id));
    setNotes(notes.filter(n => n.id !== id));
  };
  const deleteItinerary = async (id) => {
  try {
    await deleteDoc(doc(db, "itineraries", id));
    setItineraries(itineraries.filter(i => i.id !== id));
  } catch (err) {
    console.error("Error deleting itinerary:", err);
    alert("Failed to delete itinerary");
  }
};
  const logout = () => {
    signOut(auth);
    navigate('/');
  };

  return (
  <div className="dashboard-background">
    <div className="dashboard-container">
      <h2>Welcome {user?.email}</h2>
      <button onClick={logout}>Logout</button>

      {/* Notes Section */}
      <div className="section">
        <h3>Your Notes</h3>
        <input
          className="note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write a note..."
        />
        <button onClick={addNote}>Add Note</button>
        <ul className="note-list">
          {notes.map(n => (
            <li key={n.id}>
              {n.text} <button onClick={() => deleteNote(n.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <hr />

      {/* Itinerary Form */}
      <div className="section">
        <ItineraryForm />
      </div>

      {/* Itinerary List */}
      <div className="section">
        <h3>Your Itineraries</h3>
        <ul className="itinerary-list">
          {itineraries.map(i => (
            <li key={i.id}>
              <strong>{i.title}</strong> — {i.tripType}<br />
              Destinations: {i.destinations?.join(', ')}<br />
              Activities: {i.activities?.join(', ')}<br />
              Dates: {i.startDate ? new Date(i.startDate.seconds * 1000).toDateString() : "N/A"} → {i.endDate ? new Date(i.endDate.seconds * 1000).toDateString() : "N/A"}
              <br />
              <button onClick={() => deleteItinerary(i.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
};

export default Dashboard;
