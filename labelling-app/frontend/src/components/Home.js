import React, { useCallback, useEffect, useState } from 'react';
import { GoogleSpreadsheet } from 'google-spreadsheet';

const EmotionRating = ({ emotion, idx, onChange }) => (
  <div style={{ textAlign: 'right' }}>
    <p>
      {emotion}:
          <input
            id={'emotion' + idx}
            type="number"
            name={emotion}
            onChange={onChange}
          />
    </p>
  </div>
);

export default function Home() {
  const [observationRatings, setObservationRatings] = useState({
    joy: '', 
    sadness: '', 
    disgust: '',
    fear: '',
    anger: '',
    surprise: '',
    calmness: '',
    confusion: '',
    anxiety: '',
    lust: ''
  });

  const [selected, setSelected] = useState(1)

  const handleChange = (e) => {
    setObservationRatings({ ...observationRatings, [e.target.name]: e.target.value });
    console.log(selected)
    if(selected === 10){
      handleSubmit(e)
      setSelected(1)
      return
    }
    else{
      setSelected(selected + 1)
      document.getElementById('emotion' + selected).focus()
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(observationRatings),
      });

      if (response.ok) {
        alert('Ratings saved successfully!');
        // Resetting the state after successful submission
        setObservationRatings({
          joy: '', 
          sadness: '', 
          disgust: '',
          fear: '',
          anger: '',
          surprise: '',
          calmness: '',
          confusion: '',
          anxiety: '',
          lust: ''
        });
      } else {
        alert('Error saving user ratings');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving user ratings');
    }
  };

  const emotions = ['Joy', 'Sadness', 'Disgust', 'Fear', 'Anger', 'Surprise', 'Calmness', 'Confusion', 'Anxiety', 'Lust'];

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {emotions.map((emotion, idx) => (
          <EmotionRating key={emotion} idx={idx} emotion={emotion.toLowerCase()} onChange={handleChange} />
        ))}
        <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    </div>
  );
}
