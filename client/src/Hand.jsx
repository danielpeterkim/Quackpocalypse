import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.css'; 

const Hand = ({ roomId, playerName, onClick}) => {
    const [roomData, setRoomData] = useState({});
    const [playerHand, setPlayerHand] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);
    let refreshInterval = 5000;

    useEffect(() => {
      const fetchRoomData = async () => {
          try {
              const response = await fetch('http://localhost:3000/room-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomId })
              });

              if (response.ok) {
                const data = await response.json();
                setRoomData(data);
                const newHand = await fetchPlayerHand(data.players);
                if (JSON.stringify(newHand) !== JSON.stringify(playerHand)) { 
                    setPlayerHand(newHand);
                }
              } else {
                throw new Error('Failed to fetch room data');
              }
          } catch (error) {
              console.error('Error fetching room data:', error);
          } finally {
              setLoading(false); 
          }
      };

      if (roomId) {
        fetchRoomData();
        // const intervalId = setInterval(fetchRoomData, refreshInterval);
        // return () => clearInterval(intervalId); //cleans up and prevents memory leaks
      }
    }, [roomId, playerHand]); 

    const fetchCardDetails = async (cardId) => {
        try {
          const response = await fetch(`http://localhost:3000/get-card?deckType=player&cardId=${cardId}`);
          if (response.ok) {
            return await response.json(); 
          } else {
            throw new Error('Failed to fetch card data');
          }
        } catch (error) {
          console.error('Error fetching card data:', error);
          return null; 
        }
    };
    
    const fetchPlayerHand = async (players) => {
        if (!players) return [];
        const player = Object.values(players).find(p => p.name === playerName);
        if (!player || !player.hand) return [];
        
        const detailedHand = await Promise.all(player.hand.map(fetchCardDetails));
        return detailedHand.filter(card => card !== null);
    };

    const renderCard = (card) => {
        const imagePath = `/Cards/${card.color}/${card.location}.png`;
        return (
          <div 
              key={card.id} 
              className={`card ${selectedCard === card.id ? 'selected' : ''}`} 
              onClick={() => onClick(card)}
          >
              <img src={imagePath} alt={card.location} />
          </div>
      );
    };

    return (
        <div className="flex justify-center items-center gap-4">
            {loading ? <p>Loading...</p> : playerHand.length > 0 ? playerHand.map(renderCard) : <p>No cards in hand.</p>}
        </div>
    );
};

export default Hand;
