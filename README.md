# rpg-sentiment-analysis

## Abstract
We intend to develop an unsupervised sentiment analysis model with output classes corresponding to novel and fantastical sentiments that align with a fantasy text role-playing game world, for use in-game with non-playable character dialogue. Specifically, we intend on classifying user text input with the following classes: joy, sadness, disgust, fear, anger, surprise, calmness, confusion, anxiety, and lust. Instead of using general datasets that contain contemporary human text (e.g. the popular Twitter Sentiment Analysis dataset), we intend to use datasets containing fictional movie scripts catered specifically to the roleplay environment we want to enforce in our game. We believe that limiting our dataset in this way could enforce linguistic habits and principles within the game world, thereby increasing the player's immersion. Upon the player entering in text to address the non-playable character, the model will analyze the text for its sentiment and, based on this sentiment, select responses from a set of pre-written dialogue options.

Candidate datasets, ranked in order of most to least promising:

1. https://www.kaggle.com/datasets/xvivancos/star-wars-movie-scripts
2. https://www.kaggle.com/datasets/paultimothymooney/lord-of-the-rings-data
3. https://www.kaggle.com/datasets/amidala/twin-peaks-transcripts

The dataset contains the scripts for Star Wars episodes 4-6, with 'character' and 'dialogue' columns, where each observation is a line delivered by a character in one of the films. The dataset is unlabeled for sentiment analysis. 

## Data Exploration
Sentiment Analysis Pipeline:
- Pre-processing
  - convert the dialogue to lowercase
  - pass the dialogue into a tokenizer to get an array of "tokens", which are the individual strings present in the dialogue
  - lemmatize each token, standardizing the tense and plurality of the token (i.e. "feet" -> "foot" and "killed" -> "kill")
  - remove "stop words", which are common words that add no meaning to sentiment (i.e. "and", "but", "is")
  - convert raw text into numerical information via feature extraction (using feature extraction techinques such as "bag of words" and "TF-IDF")
    - in our case, we would be using TF-IDF. TF-IDF weighs the importance of a given word relative to the body of text.
  - So, we would be training our model with our X_train and X_test being the outputs of the TF-IDF vectorizer, and our y_train and y_test are the respective values for the 10 emotions.
