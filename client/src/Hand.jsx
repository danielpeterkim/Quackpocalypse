import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
let token = localStorage.getItem("token");

const Hand = ({ roomId, playerName, onClick, selectedCardId, selectedLocation }) => {
    const [roomData, setRoomData] = useState({});
    const [playerHand, setPlayerHand] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);
    let refreshInterval = 1000;

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await fetch("http://localhost:3000/room-data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ roomId }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setRoomData(data);
                    const newHand = await fetchPlayerHand(data.players);
                    if (JSON.stringify(newHand) !== JSON.stringify(playerHand)) {
                        setPlayerHand(newHand);
                    }
                } else {
                    throw new Error("Failed to fetch room data");
                }
            } catch (error) {
                console.error("Error fetching room data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (roomId) {
            fetchRoomData();
            const intervalId = setInterval(fetchRoomData, refreshInterval);
            return () => clearInterval(intervalId);
        }
    }, [roomId]);

    useEffect(() => {
        setSelectedCard(selectedCardId);
    }, [selectedCardId]);

    const fetchCardDetails = async (cardId) => {
        try {
            const response = await fetch(`http://localhost:3000/get-card?deckType=player&cardId=${cardId}`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error("Failed to fetch card data");
            }
        } catch (error) {
            console.error("Error fetching card data:", error);
            return null;
        }
    };

    const fetchPlayerHand = async (players) => {
        if (!players) return [];
        const player = Object.values(players).find((p) => p.name === playerName);
        if (!player || !player.hand) return [];

        const detailedHand = await Promise.all(player.hand.map(fetchCardDetails));
        return detailedHand.filter((card) => card !== null);
    };

    const handleCardClick = (card) => {
        if (selectedCard && selectedCard.id === card.id) {
            setSelectedCard(null);
        } else {
            setSelectedCard(card);
        }
    };

    const renderCard = (card) => {
        let imagePath = "";
        if (card.name === "Epidemic") {
            imagePath = "/Epidemic.png";
        } else {
            imagePath = `/Cards/${card.color}/${card.location}.png`;
        }
        const isSelected = selectedCard && selectedCard.id === card.id;
        let cardStyle;
        if (isSelected) {
            cardStyle = { transform: "scale(1.4)", boxShadow: "0 0 10px gold", border: "2px solid gold" };
        } else if (card.location === selectedLocation) {
            cardStyle = { boxShadow: "0 0 10px green", border: "2px green" };
        } else {
            cardStyle = {};
        }
        return (
            <div key={card.id} className={`card rounded-lg overflow-hidden ${isSelected ? "selected" : ""}`} onClick={() => onClick(card)} style={cardStyle}>
                <img src={imagePath} alt={card.location} className="w-full h-full object-cover" />
            </div>
        );
    };

    return <div className="flex justify-center items-center gap-4">{loading ? <p>Loading...</p> : playerHand.length > 0 ? playerHand.map(renderCard) : <p>No cards in hand.</p>}</div>;
};

export default Hand;
