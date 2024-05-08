import React, { useState } from 'react';
import './index.css';

const PlayerDeck = ({ playerId, roomId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const drawCards = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:3000/draw-card',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId, roomId })
            });
            if (!response.ok){
                const data = await response.json();
                throw new Error(data.error);
            }
            alert('Cards drawn successfully!');
        } catch (error) {
            console.error('Error drawing cards:', error.message);
            setError('Failed to draw cards: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="player-deck-container">
            <img 
                src="/Player Deck.png" 
                alt="Player Deck"
                onClick={drawCards} 
                className={`player-deck ${loading ? 'loading' : ''}`} 
                title="Click to draw cards"
            />
            {error && <p className="error-message">{error}</p>}
            {loading && <p>Drawing...</p>}
        </div>
    );
};

export default PlayerDeck;
