import React, { useState } from "react";
import "./index.css";
let token = localStorage.getItem("token");

const PlayerDeck = ({ playerId, roomId, setSuccess, setError }) => {
    const [loading, setLoading] = useState(false);
    const drawCards = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:3000/draw-card", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ playerId, roomId }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }
            setSuccess("Cards successfully drawn.");
        } catch (error) {
            console.error("Error drawing cards:", error.message);
            setError("Failed to draw cards: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="player-deck-container">
            <img 
                src="/Player Deck.png" 
                alt="Player Deck"
                onClick={!loading ? drawCards : undefined}
                className={`player-deck rounded-lg transition-transform duration-200 ease-in-out ${loading ? "loading opacity-50 cursor-not-allowed" : "hover:scale-105"} w-20 h-30`} // Adjust w-32 and h-48 as needed
                title="Click to draw cards"
            />
        </div>
    );
};

export default PlayerDeck;
