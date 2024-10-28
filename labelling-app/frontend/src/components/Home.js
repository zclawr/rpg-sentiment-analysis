// import React, { useState } from 'react';

// const EmotionRating = ({ emotion, onChange }) => (
//   <p>
//     {emotion}:
//     {Array.from({ length: 5 }, (_, index) => (
//       <label key={index}>
//         <input
//           type="radio"
//           name={emotion}
//           value={index + 1}
//           onChange={onChange} // Link to the change handler
//         />
//         {index + 1}
//       </label>
//     ))}
//   </p>
// );

// export default function Home() {
//   const [observationRatings, setObservationRatings] = useState({
//     joy: '', 
//     sadness: '', 
//     disgust: '',
//     fear: '',
//     anger: '',
//     surprise: '',
//     calmness: '',
//     confusion: '',
//     anxiety: '',
//     lust: ''
//   });

//   const handleChange = (e) => {
//     setObservationRatings({ ...observationRatings, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://127.0.0.1:5000/data', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         mode: 'cors',
//         body: JSON.stringify(observationRatings),
//       });

//       if (response.ok) {
//         alert('Ratings saved successfully!');
//         setObservationRatings({
//           joy: '', 
//           sadness: '', 
//           disgust: '',
//           fear: '',
//           anger: '',
//           surprise: '',
//           calmness: '',
//           confusion: '',
//           anxiety: '',
//           lust: ''
//         });
//       } else {
//         alert('Error saving user ratings');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Error saving user ratings');
//     }
//   };

//   const emotions = ['Joy', 'Sadness', 'Disgust', 'Fear', 'Anger', 'Surprise', 'Calmness', 'Confusion', 'Anxiety', 'Lust'];

//   return (
//     <div style={{ maxWidth: '400px', margin: '20px auto' }}>
//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//         {emotions.map((emotion) => (
//           <EmotionRating key={emotion} emotion={emotion.toLowerCase()} onChange={handleChange} />
//         ))}
//         <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// }

import React, { useState } from 'react';

const EmotionRating = ({ emotion, onChange }) => (
  <div style={{ textAlign: 'right' }}>
    <p>
      {emotion}:
      {Array.from({ length: 5 }, (_, index) => (
        <label key={index} style={{ marginRight: '10px' }}>
          <input
            type="radio"
            name={emotion}
            value={index + 1}
            onChange={onChange}
          />
          {index + 1}
        </label>
      ))}
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

  const handleChange = (e) => {
    setObservationRatings({ ...observationRatings, [e.target.name]: e.target.value });
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
        {emotions.map((emotion) => (
          <EmotionRating key={emotion} emotion={emotion.toLowerCase()} onChange={handleChange} />
        ))}
        <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    </div>
  );
}
