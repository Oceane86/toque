// app/challenge/page.jsx


"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import challengesData from "../data/challenges.json";

export default function ChallengePage() {
  const { data: session, status } = useSession();
  const [challenges, setChallenges] = useState({
    upcomingChallenges: [],
    ongoingChallenges: [],
    pastChallenges: []
  });
  const router = useRouter();

  // Charger les données locales depuis le fichier JSON
  useEffect(() => {
    if (challengesData) {
      setChallenges(challengesData);
    }
  }, []);

  // Helper function to get date range for next week
  const getNextWeekDateRange = () => {
    const currentDate = new Date();
    const nextWeekStartDate = new Date(currentDate);
    nextWeekStartDate.setDate(currentDate.getDate() + 7);

    const nextWeekEndDate = new Date(currentDate);
    nextWeekEndDate.setDate(currentDate.getDate() + 13);

    return { nextWeekStartDate, nextWeekEndDate };
  };

  // Filtrer les défis à venir pour la semaine prochaine
  const getUpcomingChallengeNextWeek = () => {
    const { nextWeekStartDate, nextWeekEndDate } = getNextWeekDateRange();

    const upcomingNextWeek = challenges.upcomingChallenges.filter((challenge) => {
      const challengeDate = new Date(challenge.deadline);
      return challengeDate >= nextWeekStartDate && challengeDate <= nextWeekEndDate;
    });

    return upcomingNextWeek;
  };

  // Helper function to get date range for this week
  const getThisWeekDateRange = () => {
    const currentDate = new Date();
    const weekStartDate = new Date(currentDate);
    weekStartDate.setDate(currentDate.getDate() - currentDate.getDay()); // Lundi de cette semaine

    const weekEndDate = new Date(currentDate);
    weekEndDate.setDate(currentDate.getDate() + (6 - currentDate.getDay())); // Dimanche de cette semaine

    return { weekStartDate, weekEndDate };
  };

  // Filtrer les défis en cours cette semaine
  const getOngoingChallengesThisWeek = () => {
    const { weekStartDate, weekEndDate } = getThisWeekDateRange();

    const ongoingThisWeek = challenges.ongoingChallenges.filter((challenge) => {
      const challengeDate = new Date(challenge.deadline);
      return challengeDate >= weekStartDate && challengeDate <= weekEndDate;
    });

    return ongoingThisWeek;
  };

  // Handler de participation à un défi
  const handleParticipate = async (challengeId) => {
    if (!session?.user?.id) {
      alert("Vous devez être connecté pour participer.");
      return;
    }

    // Vérifier si l'utilisateur a déjà participé
    const challenge = challenges.ongoingChallenges.find((ch) => ch.id === challengeId);
    if (challenge?.participants?.includes(session.user.id)) {
      alert("Vous avez déjà participé à ce défi.");
      return;
    }

    try {
      // Mise à jour des participants localement
      const updatedChallenges = { ...challenges };
      updatedChallenges.ongoingChallenges = updatedChallenges.ongoingChallenges.map((ch) =>
        ch.id === challengeId
          ? { ...ch, participants: [...ch.participants, session.user.id] }
          : ch
      );
      setChallenges(updatedChallenges);

      // Envoyer l'email et le challenge à la base de données via une requête API
      const response = await fetch('/api/participation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email,
          challengeId: challengeId,
        }),
      });

      if (response.ok) {
        alert("Participation enregistrée !");
      } else {
        alert("Erreur lors de l'enregistrement de votre participation.");
      }
    } catch (error) {
      alert("Erreur : " + (error.response?.data?.error || "Une erreur inconnue est survenue."));
    }
  };

  // Vérifier le statut du défi
  const getChallengeStatus = (deadline) => {
    const currentDate = new Date();
    const challengeDate = new Date(deadline);

    if (challengeDate < currentDate) {
      return "Défi terminé";
    } else if (challengeDate - currentDate < 86400000) { // Moins de 1 jour
      return "Bientôt disponible";
    } else {
      return "Disponible";
    }
  };

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <p>Veuillez vous connecter pour voir les défis.</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Défis en cours cette semaine</h1>
      {getOngoingChallengesThisWeek().length > 0 ? (
        getOngoingChallengesThisWeek().map((challenge) => (
          <div key={challenge.id} className="border p-4 mb-4 bg-white shadow-sm rounded">
            <img
              src={challenge.image}
              alt={challenge.title}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold">{challenge.title}</h2>
            <p>{challenge.description}</p>
            <p className="text-gray-600 text-sm">
              Date limite : {new Date(challenge.deadline).toLocaleDateString()}
            </p>
            <p className="text-gray-600 text-sm">{getChallengeStatus(challenge.deadline)}</p>
            <button
              onClick={() => handleParticipate(challenge.id)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Participer
            </button>
          </div>
        ))
      ) : (
        <p>Aucun défi en cours cette semaine.</p>
      )}

      <h1 className="text-2xl font-bold mb-4 mt-8">Défi à venir la semaine prochaine</h1>
      {getUpcomingChallengeNextWeek().length > 0 ? (
        getUpcomingChallengeNextWeek().map((challenge) => (
          <div key={challenge.id} className="border p-4 mb-4 bg-white shadow-sm rounded">
            <img
              src={challenge.image}
              alt={challenge.title}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold">{challenge.title}</h2>
            <p>{challenge.description}</p>
            <p className="text-gray-600 text-sm">
              Date limite : {new Date(challenge.deadline).toLocaleDateString()}
            </p>
            <p className="text-gray-600 text-sm">{getChallengeStatus(challenge.deadline)}</p>
            <button
              onClick={() => handleParticipate(challenge.id)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Participer
            </button>
          </div>
        ))
      ) : (
        <p>Aucun défi à venir la semaine prochaine.</p>
      )}

      <h1 className="text-2xl font-bold mb-4 mt-8">Défis passés</h1>
      {challenges.pastChallenges.length > 0 ? (
        challenges.pastChallenges.map((challenge) => (
          <div key={challenge.id} className="border p-4 mb-4 bg-white shadow-sm rounded">
            <img
              src={challenge.image}
              alt={challenge.title}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold">{challenge.title}</h2>
            <p>{challenge.description}</p>
            <p className="text-gray-600 text-sm">
              Date limite : {new Date(challenge.deadline).toLocaleDateString()}
            </p>
            <p className="text-gray-600 text-sm">{getChallengeStatus(challenge.deadline)}</p>
          </div>
        ))
      ) : (
        <p>Aucun défi passé pour le moment.</p>
      )}
    </div>
  );
}
