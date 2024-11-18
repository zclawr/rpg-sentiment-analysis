# rpg-sentiment-analysis

## Abstract
We intend to develop an unsupervised sentiment analysis model with output classes corresponding to novel and fantastical sentiments that align with a fantasy text role-playing game world, for use in-game with non-playable character dialogue. Specifically, we intend on classifying user text input with the following classes: joy, sadness, disgust, fear, anger, surprise, calmness, confusion, anxiety, and lust. Instead of using general datasets that contain contemporary human text (e.g. the popular Twitter Sentiment Analysis dataset), we intend to use datasets containing fictional movie scripts catered specifically to the roleplay environment we want to enforce in our game. We believe that limiting our dataset in this way could enforce linguistic habits and principles within the game world, thereby increasing the player's immersion. Upon the player entering in text to address the non-playable character, the model will analyze the text for its sentiment and, based on this sentiment, select responses from a set of pre-written dialogue options.

Candidate datasets, ranked in order of most to least promising:

1. https://www.kaggle.com/datasets/xvivancos/star-wars-movie-scripts
2. https://www.kaggle.com/datasets/paultimothymooney/lord-of-the-rings-data
3. https://www.kaggle.com/datasets/amidala/twin-peaks-transcripts

The dataset contains the scripts for Star Wars episodes 4-6, with 'character' and 'dialogue' columns, where each observation is a line delivered by a character in one of the films. The dataset is unlabeled for sentiment analysis. 

## Data Exploration
Note that the data we are using in our Jupyter notebook and in the following exploration comes from [combined-labels.csv](combined_labels.csv), which can be found in the root folder of this repo.
Our labeled data consists of 586 observations. In terms of missing data, please note that we have roughly 5000 lines of unlabeled dialogue, of which we are working through hand-labeling. Thus, the 586 observations we are exploring here is simply a subset of our data. Of these labeled observations, each observation has a valid integer from 0-10 for each of the 10 emotion categories, and therefore there is no missing data within these 586 observations. The word cloud below illustrates the frequency of words from the labeled observations, with common stop words removed as well as proper nouns that relate to Star Wars-specific lingo and characters. 
![word_cloud](https://github.com/user-attachments/assets/e9e8929a-cbb0-4c2d-affd-db70ee151d46)

It is worth noting that the vocabulary prevalent, including words like emperor, princess, admiral, fighters, etc. correspond well to the vocabulary of the science fiction / fantasy RPG game world which the model will be used for. 

In terms of scale, each of the emotion categories contain integer values from 0 to 10 inclusive, and the columns are as follows from left to right:

For a given observation, which is associated to a unique line of dialogue, the columns describe the following:
## Line:
Denotes the line number of the associated dialogue when it is spoken in its respective movie

## Movie:
Denotes the movie of origin of the associated spoken dialogue

## Character:
Denotes the character that delivered the associated line of dialogue

## Dialogue:
Contains the actual raw text of the dialogue delivered

The following 10 columns represent the emotional intensity of the dialogue in terms of the following emotions: Joy, Sadness, Disgust, Fear, Anger, Surprise, Calmness, Confusion, Anxiety, and Lust. The emotional intensity is represented by an integer ranging from 0 (not intense at all) to 10 (extremely intense). The following bar graph illustrates the distribution of emotions across all observed dialogue by summing the intensity ratings for all dialogues:

![emotion_sums](https://github.com/user-attachments/assets/0763326a-6d35-4814-9e99-94872c111aef)

From this bar graph we can gather that our data is biased towards calm dialogue, which makes sense in the context of any large body of text; most dialogue will not be explosively emotional and will instead be calm. Furthermore, we notice a prevalence of anxiety, surprise, and fear, which may correlate to the prevalence of intense action and battle scenes in the Star Wars films surveyed in our dataset. It is worth noting that this seems ideal for the science fiction / fantasy RPG world which the model will be used for, as a similar tension will pervade the game atmosphere. The following polar plot illustrates the distribution and intensity of each observation for the emotion categories:

![emotion_polar](https://github.com/user-attachments/assets/d06f7c89-6966-4e07-96cc-6eb03b6af36f)

In the plot, a line represents an observation. We notice from the plot that calmness and confusion have a great amount of cross-over, as do surprise and confusion, which is to say that many observations have high intensities in both surprise and confusion, as well as calmness and confusion. 

In terms of pre-processing, we plan the carry out the following pipeline for our sentiment analysis:

[Open the Jupyter Notebook](Milestone2.ipynb)

Sentiment Analysis Pipeline:
- Pre-processing
  - convert the dialogue to lowercase
  - pass the dialogue into a tokenizer to get an array of "tokens", which are the individual strings present in the dialogue
  - lemmatize each token, standardizing the tense and plurality of the token (i.e. "feet" -> "foot" and "killed" -> "kill")
  - remove "stop words", which are common words that add no meaning to sentiment (i.e. "and", "but", "is")
  - convert raw text into numerical information via feature extraction (using feature extraction techinques such as "bag of words" and "TF-IDF")
    - in our case, we would be using TF-IDF. TF-IDF weighs the importance of a given word relative to the body of text.
  - So, we would be training our model with our X_train and X_test being the outputs of the TF-IDF vectorizer, and our y_train and y_test are the respective values for the 10 emotions.
  - apply min-max normalization to each feature so that our output is a confidence level between 0 and 1.

## Preprocessing, Training, and Testing our First Model
We previously tried to use Naive Bayes as our first model. Because our data is sparse, has multiple output classes, and a large range of scores, we decided to treat the data as a regression problem instead of a classification problem since we sought to see the strength of an emotion in a sentence (i.e. a confidence level) rather than a binary true or false output.

After preprocessing and training our first model, we compared evaluated our model by performing k-fold cross validation, comparing training and testing mses, and creating a fitting graph for each emotion.

<img width="508" alt="k-fold cross validation and training/testing mse" src="https://github.com/user-attachments/assets/dc025e67-90ce-4b76-9bba-c6a6f161b7e4">

![joy](https://github.com/user-attachments/assets/8c341efd-e669-4c05-8c7d-858270e3ac95)
![sadness](https://github.com/user-attachments/assets/b386ec29-c218-4751-a66a-dae8b9488575)
![disgust](https://github.com/user-attachments/assets/19639c56-1d8a-46e8-9011-47fd0c7c9a22)
![fear](https://github.com/user-attachments/assets/48ef9086-827f-4a8c-805c-6548339d491b)
![anger](https://github.com/user-attachments/assets/a3bf2b7e-367b-4746-8e6e-964f57cd0864)
![surprise](https://github.com/user-attachments/assets/e0ca025c-d96c-499c-ac77-4b2e594b7ee7)
![calmness](https://github.com/user-attachments/assets/087963ce-dde6-42f4-baa9-9188902675e1)
![confusion](https://github.com/user-attachments/assets/c26fff43-da71-48dd-ac26-9a6d68c6f17b)
![anxiety](https://github.com/user-attachments/assets/d91dfdfa-8f7c-4961-8eda-02b62d3b5d0a)
![lust](https://github.com/user-attachments/assets/f966ed35-7943-4f7c-bb94-7b84a25ad963)

The model seems to underperform for the majority of the emotions, with there being some minor successes with anger, surprise, and anxiety. For our next models, we plan on exploring more regression models, but we do believe that using Random Forest Regression is a great decision since it yields the desired output.

Conclusion of our first model: Our first model underperforms, but this was expected since we have a sparse dataset that we are expanding as we move forward and our high scoring range for each emotion. We plan on performing further optimizations/enchancements such as oversampling and fine-tuning the Random Forest Regression parameters (i.e. max depth and dimensionality). We are considering looking into dimensional reduction with PCA, but we plan on doing so after learning it in class.
