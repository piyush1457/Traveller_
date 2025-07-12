import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ItineraryList() {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchItineraries = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, "itineraries"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      setItineraries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchItineraries();
  }, []);

  return (
    <div>
      <h3>Your Itineraries</h3>
      <ul>
        {itineraries.map(itinerary => (
          <li key={itinerary.id}>
            <strong>{itinerary.title}</strong> - {itinerary.tripType}<br />
            Destinations: {itinerary.destinations.join(", ")}<br />
            Activities: {itinerary.activities.join(", ")}<br />
            From: {new Date(itinerary.startDate.seconds * 1000).toDateString()}<br />
            To: {new Date(itinerary.endDate.seconds * 1000).toDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
