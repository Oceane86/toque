// app/profil/page.jsx

"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Profile() {
  const { data: session } = useSession();
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    if (session) {
      fetch("/api/users/history", {
        headers: {
          Authorization: `Bearer ${session.user.email}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setChallenges(data.challenges));
    }
  }, [session]);

  if (!session) {
    return <p>You need to be signed in to view your profile.</p>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <h2>Your Challenge History:</h2>
      <ul>
        {challenges.map((challenge) => (
          <li key={challenge._id}>{challenge.title}</li>
        ))}
      </ul>
    </div>
  );
}
