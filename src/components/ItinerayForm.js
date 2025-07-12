// components/ItineraryForm.js
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase";

const tripTypes = ["Adventure", "Leisure", "Work"];

export default function ItineraryForm() {
  const [title, setTitle] = useState("");
  const [destinations, setDestinations] = useState("");
  const [activities, setActivities] = useState("");
  const [tripType, setTripType] = useState("Adventure");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert("User not logged in");

    try {
      await addDoc(collection(db, "itineraries"), {
        title,
        destinations: destinations.split(",").map(d => d.trim()),
        activities: activities.split(",").map(a => a.trim()),
        tripType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: serverTimestamp(),
        userId: user.uid,
      });
      alert("Itinerary added!");
      setTitle(""); setDestinations(""); setActivities(""); setStartDate(""); setEndDate("");
    } catch (err) {
      console.error(err);
      alert("Error adding itinerary");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New Itinerary</h3>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Trip Title" required /><br />
      <input value={destinations} onChange={e => setDestinations(e.target.value)} placeholder="Destinations" required /><br />
      <input value={activities} onChange={e => setActivities(e.target.value)} placeholder="Activities" required /><br />
      <select value={tripType} onChange={e => setTripType(e.target.value)}>
        {tripTypes.map(type => <option key={type}>{type}</option>)}
      </select><br />
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required /><br />
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required /><br />
      <button type="submit">Add Itinerary</button>
    </form>
  );
}
