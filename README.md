# rpg-sentiment-analysis

Abstract:

We intend to develop an unsupervised sentiment analysis model with output classes corresponding to novel and fantastical sentiments that align with a fantasy text role-playing game world, for use in-game with non-playable character dialogue. Specifically, we intend on classifying user text input with the following classes: joy, sadness, disgust, fear, anger, surprise, calmness, confusion, anxiety, and lust. Instead of using general datasets that contain contemporary human text (e.g. the popular Twitter Sentiment Analysis dataset), we intend to use datasets containing fictional movie scripts catered specifically to the roleplay environment we want to enforce in our game. We believe that limiting our dataset in this way could enforce linguistic habits and principles within the game world, thereby increasing the player's immersion. 

Candidate datasets, ranked in order of most to least promising:

1. https://www.kaggle.com/datasets/xvivancos/star-wars-movie-scripts
2. https://www.kaggle.com/datasets/paultimothymooney/lord-of-the-rings-data
3. https://www.kaggle.com/datasets/amidala/twin-peaks-transcripts

The dataset contains the scripts for Star Wars episodes 4-6, with 'character' and 'dialogue' columns, where each observation is a line delivered by a character in one of the films. The dataset is unlabeled for sentiment analysis. 


