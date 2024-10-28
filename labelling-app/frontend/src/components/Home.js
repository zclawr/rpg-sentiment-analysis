import React, { useEffect, useState, useRef } from 'react';
import * as Papa from 'papaparse';
import {CSVLink, CSVDownload} from 'react-csv';
import Dropdown from 'react-dropdown';

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
  const emotions = ['Joy', 'Sadness', 'Disgust', 'Fear', 'Anger', 'Surprise', 'Calmness', 'Confusion', 'Anxiety', 'Lust'];
  const movies = ['The Return of the King', 'The Two Towers', 'The Fellowship of the Ring', 'SW_EpisodeVI', 'SW_EpisodeV', 'SW_EpisodeIV']

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
  const [movieFilter, setMovieFilter] = useState(movies[4])
  const [movieIdx, setMovieIdx] = useState(0)

  const csvRef = useRef(undefined)
  const output = useRef(undefined)

  useEffect(() => {
    Papa.parse("http://localhost:3000/star-wars.csv", {
      download: true,
      complete: function(results) {
        csvRef.current = results
        output.current = [['Line', 'Movie', 'Character', 'Dialogue', 'Joy', 'Sadness', 'Disgust', 'Fear', 'Anger', 'Surprise', 'Calmness', 'Confusion', 'Lust']]
        setMovieIdx(0)
        loadLine()
      }
    });
  }, [])

  const loadLine = (jump, filter) => {
    var temp = movieIdx + 1
    if(jump !== undefined)
      temp = jump
    var tempFilter = movieFilter
    if(filter !== undefined)
        tempFilter = filter
    while(csvRef.current.data[temp][1] !== tempFilter){
      temp++
    }
    setMovieIdx(temp)
  }

  const handleChange = (e) => {
    setObservationRatings({ ...observationRatings, [e.target.name]: e.target.value });
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

  const handleLastLineChange = (e) => {
    e.preventDefault()
    const newLine = document.getElementById('lastLineTextbox').value
    setMovieIdx(newLine)
    loadLine(newLine)
  }

  const handleMovieChange = (e) => {
    setMovieFilter(e.value)
    setMovieIdx(1)
    loadLine(1, e.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newObs = [
      csvRef.current.data[movieIdx][0],
      csvRef.current.data[movieIdx][1],
      csvRef.current.data[movieIdx][2],
      csvRef.current.data[movieIdx][3],
      observationRatings.joy,
      observationRatings.sadness,
      observationRatings.disgust,
      observationRatings.fear,
      observationRatings.anger,
      observationRatings.surprise,
      observationRatings.calmness,
      observationRatings.confusion,
      observationRatings.lust
    ]
    output.current.push(newObs)
    loadLine()
    for(var i = 0; i < 10; i++){
      document.getElementById('emotion' + i).value = ''
    }
    document.getElementById('emotion0').focus()
  }

  const DialogueLine = () => {
    if(csvRef.current !== undefined){
      console.log(csvRef.current.data[movieIdx][2] + ": " + csvRef.current.data[movieIdx][3])
      return(
        <p>{csvRef.current.data[movieIdx][2] + ": " + csvRef.current.data[movieIdx][3]}</p>
      )
    }
    else{
      return(
        <></>
      )
    }
  }

  const DownloadButton = () => {
    if(output.current !== undefined){
      return(
        <CSVLink data={output.current} >Download me</CSVLink>
      )
    }
    else{
      return(
        <></>
      )
    }
  }
  return (
    <div style={{ maxWidth: '400px', margin: '20px auto' }}>
      <Dropdown options={movies} onChange={handleMovieChange} value={movies[0]} placeholder="Select movie to filter" />;
      <input
            id={'lastLineTextbox'}
            type="number"
      />
      <button onClick={handleLastLineChange}>
        Jump to Line
      </button>
      <p>{'Current Line:' + movieIdx}</p>
      <DialogueLine></DialogueLine>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {emotions.map((emotion, idx) => (
          <EmotionRating key={emotion} idx={idx} emotion={emotion.toLowerCase()} onChange={handleChange} />
        ))}
        <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Submit
        </button>
        <></>
      </form>
      <DownloadButton></DownloadButton>
    </div>
  );
}
