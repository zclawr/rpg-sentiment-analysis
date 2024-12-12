# rpg-sentiment-analysis
## Needs for Final Milestone:
- A complete introduction
- A complete submission including all prior submissions
- All code uploaded in the form of jupyter notebooks that can be easily followed along to your GitHub Repository. 
- A written report
- Your final model should be included in every section of your write up. i.e. Methods, Results, Discussion
- Your GitHub repo must be made public by the morning of the next day of the submission deadline.

## Written Report Guidelines:
### Introduction to Your Project
- Why was it chosen? Why is it cool? Discuss the general/broader impact of having a good predictive mode. i.e. why is this important?

We intend to develop an unsupervised sentiment analysis model with output classes corresponding to novel and fantastical sentiments that align with a fantasy text role-playing game world, for use in-game with non-playable character dialogue. Specifically, we intend on classifying user text input with the following classes: joy, sadness, disgust, fear, anger, surprise, calmness, confusion, anxiety, and lust. Instead of using general datasets that contain contemporary human text (e.g. the popular Twitter Sentiment Analysis dataset), we intend to use datasets containing fictional movie scripts catered specifically to the roleplay environment we want to enforce in our game. We believe that limiting our dataset in this way could enforce linguistic habits and principles within the game world, thereby increasing the player's immersion. Upon the player entering in text to address the non-playable character, the model will analyze the text for its sentiment and, based on this sentiment, select responses from a set of pre-written dialogue options.

### Methods Section
- This section will include the exploration results, preprocessing steps, models chosen in the order they were executed. You should also describe the parameters chosen. Please make sub-sections for every step. i.e Data Exploration, Preprocessing, Model 1, Model 2, additional models are optional. Please note that models can be the same i.e. DNN but different versions of it if they are distinct enough. Changes can not be incremental. You can put links here to notebooks and/or code blocks using three ` in markup for displaying code. so it would look like this: ``` MY CODE BLOCK ```

Note: A methods section does not include any why. the reason why will be in the discussion section. This is just a summary of your methods

#### Data Exploration:
The word cloud below illustrates the frequency of words from the labeled observations, with common stop words removed as well as proper nouns that relate to Star Wars-specific lingo and characters (i.e. 'Luke', 'Solo', 'Jabba', 'Yoda', 'Han', 'Wookiee', 'Skywalker', 'Chewie', 'Dagobah', 'Hutt', 'Artoo', 'Threepio', 'Vader', 'Lando', 'Leia', 'Jedi', 'Ben', 'Rouge', 'droid', 'Dack'). 
![wordcloud](https://github.com/user-attachments/assets/b413220a-8a45-4331-9240-f61b47f81eda)

The following 10 columns represent the emotional intensity of the dialogue in terms of the following emotions: Joy, Sadness, Disgust, Fear, Anger, Surprise, Calmness, Confusion, Anxiety, and Lust. The emotional intensity is represented by an integer ranging from 0 (not intense at all) to 10 (extremely intense). The following bar graph illustrates the distribution of emotions across all observed dialogue by summing the intensity ratings for all dialogues:

![dist1](https://github.com/user-attachments/assets/d4859a44-62cf-4042-ad6c-53ce9fdebe38)

From this bar graph we can gather that our data is biased towards calm dialogue, which makes sense in the context of any large body of text; most dialogue will not be explosively emotional and will instead be calm. Furthermore, we notice a prevalence of anxiety, surprise, and fear, which may correlate to the prevalence of intense action and battle scenes in the Star Wars films surveyed in our dataset. It is worth noting that this seems ideal for the science fiction / fantasy RPG world which the model will be used for, as a similar tension will pervade the game atmosphere. The following polar plot illustrates the distribution and intensity of each observation for the emotion categories:

![polar](https://github.com/user-attachments/assets/e31e4c1c-3d84-490c-8380-afdb744e7b8a)

In the plot, a line represents an observation. We notice from the plot that calmness and confusion have a great amount of cross-over, as do surprise and confusion, which is to say that many observations have high intensities in both surprise and confusion, as well as calmness and confusion. 

#### Preprocessing:
The following preprocessing pipeline is used for all 3 models:
- convert the dialogue to lowercase
- pass the dialogue into a tokenizer to get an array of "tokens", which are the individual strings present in the dialogue
- lemmatize each token, standardizing the tense and plurality of the token (i.e. "feet" -> "foot" and "killed" -> "kill")
- remove "stop words", which are common words that add no meaning to sentiment (i.e. "and", "but", "is")
- convert raw text into numerical information via feature extraction (using feature extraction techinques such as "bag of words" and "TF-IDF")
  - in our case, we would be using TF-IDF. TF-IDF weighs the importance of a given word relative to the body of text.
- So, we would be training our model with our X_train and X_test being the outputs of the TF-IDF vectorizer, and our y_train and y_test are the respective values for the 10 emotions.
- apply min-max normalization to each feature so that our output is a confidence level between 0 and 1.

For models 1 and 2, this is the complete proprocessing pipeline. However, we add one more preprocessing step for model 3:
- Transform the values of the emotion rates
  - For each row and for each emotion in some row, if the value of an emotion's rating is greater than 0, set the value equal to 1. Otherwise, set the value equal to 0.
- After splitting the dataframe into X_train, X_test, y_train, y_test, apply oversampling to X_train, y_train using SMOTE (to mitigate data imbalance)

#### Model 1:

[Open the Jupyter Notebook](Milestone3.ipynb)

We initally decided to treat the data as a regression problem instead of a classification problem. We sought to output the strength of an emotion in a sentence (i.e. a confidence level) rather than a binary true or false output, so we opted for a random forest regressor to predict each emotion. We trained out model on a train-test split of 0.2 and we did not tune any hyperparameters.

#### Model 2:

[Open the Jupyter Notebook](Milestone4.ipynb)

For our second model, we used XGBoost for its efficiency and hyperparameter tuning capabilities in an effort to combat overfitting. The sparseness of our dataset was the main motivator for our hyperparameter values. To emphasize accuracy rather than speed, we used an "exact" tree method. Additionally, we specified a max_depth of 1, introduced an L2 regularization of 100, and reduced the learning rate from default 0.3 to 0.01 in order to mitigate overfitting.

#### Model 3:

[Open the Jupyter Notebook](Milestone5.ipynb)



### Results Section
- This will include the results from the methods listed above (C). You will have figures here about your results as well. No exploration of results is done here. This is mainly just a summary of your results. The sub-sections will be the same as the sections in your methods section.



![dist2](https://github.com/user-attachments/assets/a040ffbb-5e89-4fb6-a0e8-129013a1543a)

![loss_curves](https://github.com/user-attachments/assets/1b0b8c37-c93f-4c3f-9501-630092a2398a)

### Discussion Section
- This is where you will discuss the why, and your interpretation and your thoughy process from beginning to end. This will mimic the sections you have created in your methods section as well as new sections you feel you need to create. You can also discuss how believable your results are at each step. You can discuss any short comings. It's ok to criticize as this shows your intellectual merit, as to how you are thinking about things scientifically and how you are able to correctly scrutinize things and find short comings. In science we never really find the perfect solution, especially since we know something will probably come up int he future (i.e. donkeys) and mess everything up. If you do it's probably a unicorn or the data and model you chose are just perfect for each other!

### Conclusion
- This is where you do a mind dump on your opinions and possible future directions. Basically what you wish you could have done differently. Here you close with final thoughts.

### Statement of Collaboration
- This is a statement of contribution by each member. This will be taken into consideration when making the final grade for each member in the group. Did you work as a team? was there a team leader? project manager? coding? writer? etc. Please be truthful about this as this will determine individual grades in participation. There is no job that is better than the other. If you did no code but did the entire write up and gave feedback during the steps and collaborated then you would still get full credit. If you only coded but gave feedback on the write up and other things, then you still get full credit. If you managed everyone and the deadlines and setup meetings and communicated with teaching staff only then you get full credit. Every role is important as long as you collaborated and were integral to the completion of the project. If the person did nothing. they risk getting a big fat 0. Just like in any job, if you did nothing, you have the risk of getting fired. Teamwork is one of the most important qualities in industry and academia!

- Format: Start with Name: Title: Contribution. If the person contributed nothing then just put in writing: Did not participate in the project.
