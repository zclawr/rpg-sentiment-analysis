# rpg-sentiment-analysis
### Introduction

We intend to develop an unsupervised sentiment analysis model with output classes corresponding to novel and fantastical sentiments that align with a fantasy text role-playing game world, for use in-game with non-playable character dialogue. Specifically, we intend on classifying user text input with the following classes: joy, sadness, disgust, fear, anger, surprise, calmness, confusion, anxiety, and lust. Instead of using general datasets that contain contemporary human text (e.g. the popular Twitter Sentiment Analysis dataset), we intend to use datasets containing fictional movie scripts catered specifically to the roleplay environment we want to enforce in our game. We believe that limiting our dataset in this way could enforce linguistic habits and principles within the game world, thereby increasing the player's immersion. Upon the player entering in text to address the non-playable character, the model will analyze the text for its sentiment and, based on this sentiment, select responses from a set of pre-written dialogue options.

A demo for our sentiment analysis model ([organ trail](https://organregistry.org/organtrail)) is live on our website [organregistry.org](https://organregistry.org/)

![9dhzv4](https://github.com/user-attachments/assets/1069ae75-0c25-4eb9-9b9c-f4142651e4cb)

### Methods

#### Data Exploration:
The dialogue that comprises our dataset is sourced from the following:

https://www.kaggle.com/datasets/xvivancos/star-wars-movie-scripts

The dataset contains the scripts for Star Wars episodes 4-6, with 'character' and 'dialogue' columns, where each observation is a line delivered by a character in one of the films. The dataset is unlabeled for sentiment analysis.

Note that the data we are using in our Jupyter notebook and in the following exploration comes from ```manual-labels.csv```, which can be found in the root folder of this repo. Our labeled data consists of roughly 900 observations. In terms of missing data, please note that we have roughly 1400 lines of unlabeled dialogue remaining, of which we could not hand-label during the course of the project. Thus, the 900 observations we are exploring here is simply a subset of the datasets we are using. Of these labeled observations, each observation has a valid integer from 0-10 for each of the 10 emotion categories, and therefore there is no missing data within these 586 observations. The word cloud below illustrates the frequency of words from the labeled observations, with common stop words removed as well as proper nouns that relate to Star Wars-specific lingo and characters.

The word cloud below illustrates the frequency of words from the labeled observations, with common stop words removed as well as proper nouns that relate to Star Wars-specific lingo and characters (i.e. 'Luke', 'Solo', 'Jabba', 'Yoda', 'Han', 'Wookiee', 'Skywalker', 'Chewie', 'Dagobah', 'Hutt', 'Artoo', 'Threepio', 'Vader', 'Lando', 'Leia', 'Jedi', 'Ben', 'Rouge', 'droid', 'Dack'). 
![wordcloud](https://github.com/user-attachments/assets/b413220a-8a45-4331-9240-f61b47f81eda)

It is worth noting that the vocabulary prevalent, including words like emperor, princess, admiral, fighters, etc. correspond well to the vocabulary of the science fiction / fantasy RPG game world which the model will be used for. 

In terms of scale, each of the emotion categories contain integer values from 0 to 10 inclusive, and the columns are as follows from left to right:

For a given observation, which is associated to a unique line of dialogue, the columns describe the following:
##### Line:
Denotes the line number of the associated dialogue when it is spoken in its respective movie

##### Movie:
Denotes the movie of origin of the associated spoken dialogue

##### Character:
Denotes the character that delivered the associated line of dialogue

##### Dialogue:
Contains the actual raw text of the dialogue delivered

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

Our first model was a multi-output regressor with a random forest regressor to predict each emotion. We used a train-test split of 0.2 and did not tune any hyperparameters.

```
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf_model = MultiOutputRegressor(RandomForestRegressor(random_state=42))

rf_model.fit(X_train, y_train)
```

#### Model 2:

[Open the Jupyter Notebook](Milestone4.ipynb)

For our second model, we used XGBoost. We pass in an XGBRegressor into our multi-output regressor instead of a random forest regressor. We used an "exact" tree method, a max_depth of 1, an L2 regularization of 100, and reduced the learning rate from the defaulted 0.3 to 0.01. Additionally, we used a train-test split of 0.2.

```
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

xgb_model = MultiOutputRegressor(XGBRegressor(
  random_state=42,
  tree_method="exact",
  max_depth=1,
  reg_lambda=100,
  learning_rate=0.01
))
xgb_model.fit(X_train, y_train)
```

#### Model 3:

[Open the Jupyter Notebook](Milestone5.ipynb)

For our third model, we create an XGBClassifier model for each emotion. We tune the hyperparameters of each of these XGBClassifiers individually with an exhaustive Grid Search after some manual tuning to narrow down parameters of interest and notable value ranges. We tuned the hyperparameters with the following parameters and ranges: 

```
param_grid = {
        'learning_rate': [0.005, 0.01, 0.05],
        'reg_lambda': [1, 5, 10],
        'max_depth': [3,6,9]
    }

model = xgb.XGBClassifier(
        tree_method='hist',
        objective='binary:logistic',
        eval_metric='logloss',
        n_estimators=1000,
        early_stopping_rounds=10
    )

grid_search = GridSearchCV(model, param_grid, scoring='recall', cv=3, n_jobs=-1)  # Use 3-fold cross-validation
grid_search.fit(X_train_resampled, y_train_resampled, verbose=2, eval_set=[(X_train_resampled, y_train_resampled), (X_test, y_test)])
```

We also forced each XGBClassifier to be trained over a maximum of 1000 epochs by setting the ```n_estimators=1000``` parameter. Additionally, we enabled early stopping with ```early_stopping_rounds=10```, where after 10 epochs, if neither evaluation set sees a decrease in loss, we stop the training early. Our tree method is ```hist```, which is an approximate greedy algorithm that speeds up the tree fitting. We score the search by recall, and therefore our best hyperparameters will be those which maximize recall. We use 3-fold cross validation during the hyperparameter search. From here, we train a fresh batch of XGBClassifers, one for each emotion, using these optimized hyperparameters, which are searched for per emotion, and we train these on a maximum of 5000 epochs. We also use an evaluation set on these consisting of training and testing data which is used to generate a loss curve for each of the classifiers, for which the metric used is logloss. We use these loss curves, as well as classification reports, to evaluate each model.  

### Results Section

#### Model 1 Results:

After preprocessing and training our first model, we evaluated our model by performing k-fold cross validation, comparing training and testing MSEs, and creating a fitting graph for each emotion. Note that we misunderstood how to generate a fitting graph at this milestone, which we discuss in the Discussion section below. For clarity and to help explain our train of thinking, they are displayed below nonetheless.

Figure 1

<img width="508" alt="k-fold cross validation and training/testing mse" src="https://github.com/user-attachments/assets/dc025e67-90ce-4b76-9bba-c6a6f161b7e4">

Figure 2(a-j)

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

#### Model 2 Results:

Below are our second model's training and testing MSEs, and the fitting graphs for each emotion.

Figure 3

<img width="470" alt="Screenshot 2024-12-01 at 8 06 31 PM" src="https://github.com/user-attachments/assets/220e8c16-7809-4c35-9abb-8a7e25231e00">

Figure 4(a-j)

![plots](https://github.com/user-attachments/assets/756dbd4f-34f2-4494-898f-5ee17c3baf08)
![download (3)](https://github.com/user-attachments/assets/bdfeeffe-59d5-4ca3-a80d-84e1580f8ab6)
![download (4)](https://github.com/user-attachments/assets/075441d3-0086-489f-ba11-7c412af71379)
![download (5)](https://github.com/user-attachments/assets/8929f293-3c3c-40d6-ab5a-cf44b3684e22)
![download (6)](https://github.com/user-attachments/assets/98235c0f-a656-4270-80d3-15311cc87f26)
![download (7)](https://github.com/user-attachments/assets/a2d5dc1e-202c-49b3-84f5-fd018f2cbc4b)
![download (8)](https://github.com/user-attachments/assets/13bc2bfa-732d-45b4-a64f-2ef6a56b3598)
![download (9)](https://github.com/user-attachments/assets/84d4e4b9-af54-4e28-8e04-212c7017acca)
![download (10)](https://github.com/user-attachments/assets/605416e9-6aff-44b3-8d22-c24b82bba375)
![download (11)](https://github.com/user-attachments/assets/730b5168-78a9-411a-b5f9-bcce5e1b660b)

#### Model 3 Results:

After preprocessing our data by binning into 0 and 1 classes for each target, where the 1 class contains any observations where that target's value is greater than 0 in our initial dataset, we generated class distributions, which are shown below:

Figure 5

![dist2](https://github.com/user-attachments/assets/a040ffbb-5e89-4fb6-a0e8-129013a1543a)


The following are the classification reports for each emotion generated after training each emotion's XGBClassifier with the best hyperparameters found during tuning. Below the classification reports are the loss curves for each classifier generated during training.

Figure 6(a-j)

```
Classification Report for Joy:
              precision    recall  f1-score   support

         0.0       0.71      0.81      0.76       124
         1.0       0.29      0.20      0.24        50

    accuracy                           0.63       174
   macro avg       0.50      0.50      0.50       174
weighted avg       0.59      0.63      0.61       174

Classification Report for Sadness:
              precision    recall  f1-score   support

         0.0       0.80      0.91      0.86       139
         1.0       0.25      0.11      0.16        35

    accuracy                           0.75       174
   macro avg       0.53      0.51      0.51       174
weighted avg       0.69      0.75      0.71       174

Classification Report for Disgust:
              precision    recall  f1-score   support

         0.0       0.77      0.90      0.83       135
         1.0       0.13      0.05      0.07        39

    accuracy                           0.71       174
   macro avg       0.45      0.48      0.45       174
weighted avg       0.63      0.71      0.66       174

Classification Report for Fear:
              precision    recall  f1-score   support

         0.0       0.57      0.97      0.72        99
         1.0       0.50      0.04      0.07        75

    accuracy                           0.57       174
   macro avg       0.54      0.50      0.40       174
weighted avg       0.54      0.57      0.44       174

Classification Report for Anger:
              precision    recall  f1-score   support

         0.0       0.77      0.80      0.78       128
         1.0       0.37      0.33      0.34        46

    accuracy                           0.67       174
   macro avg       0.57      0.56      0.56       174
weighted avg       0.66      0.67      0.67       174

Classification Report for Surprise:
              precision    recall  f1-score   support

         0.0       0.59      0.48      0.53        86
         1.0       0.57      0.68      0.62        88

    accuracy                           0.58       174
   macro avg       0.58      0.58      0.58       174
weighted avg       0.58      0.58      0.58       174

Classification Report for Calmness:
              precision    recall  f1-score   support

         0.0       0.47      0.23      0.31        30
         1.0       0.86      0.94      0.90       144

    accuracy                           0.82       174
   macro avg       0.66      0.59      0.60       174
weighted avg       0.79      0.82      0.80       174

Classification Report for Confusion:
              precision    recall  f1-score   support

         0.0       0.68      0.88      0.77       112
         1.0       0.54      0.24      0.33        62

    accuracy                           0.66       174
   macro avg       0.61      0.56      0.55       174
weighted avg       0.63      0.66      0.61       174

Classification Report for Anxiety:
              precision    recall  f1-score   support

         0.0       0.46      0.50      0.48        64
         1.0       0.70      0.66      0.68       110

    accuracy                           0.60       174
   macro avg       0.58      0.58      0.58       174
weighted avg       0.61      0.60      0.61       174

Classification Report for Lust:
              precision    recall  f1-score   support

         0.0       0.95      0.95      0.95       164
         1.0       0.11      0.10      0.11        10

    accuracy                           0.90       174
   macro avg       0.53      0.53      0.53       174
weighted avg       0.90      0.90      0.90       174
```

Figure 7

![loss_curves](https://github.com/user-attachments/assets/1b0b8c37-c93f-4c3f-9501-630092a2398a)


### Discussion Section

Because our data is sparse, has multiple output classes, and a large range of scores, we decided to treat the data as a regression problem instead of a classification problem. So, we sought to see the strength of an emotion in a sentence (i.e. a confidence level) rather than a binary true or false output. The main goal of our first model was to output non-random predictive confidence levels for each emotion. According to the results of Figures 1 and 2(a-j), the model seemed to underperform for the majority of the emotions, with there being some minor successes with anger, surprise, and anxiety. This was expected since we have a sparse dataset with our high scoring range for each emotion and we did not perform any hyperparameter tuning. Our mistakes from this model informed our second model attempt.

The biggest problems with model 1 was that our random forest regressor took very long to train and was overfitting our sparse dataset. So, we used the XGBoost library for our second model for its efficiency and hyperparameter tuning capabilities. To emphasize accuracy rather than speed, we used an "exact" tree method. Additionally, we specified a max_depth of 1, introduced an L2 regularization of 100, and reduced the learning rate from default 0.3 to 0.01 in order to mitigate overfitting. The training and testing MSEs in Figure 3 show that we were able to not overfit for Joy, Sadness, Disgust, Surprise, and Anxiety. After careful analysis, we concluded that this was the case due to the nature of our dataset. These emotions were able to not overfit because they were the closest to an even distibution of ratings for each observation in the dataset. This informs our choices for model 3.

However, upon attempting more thorough hyperparameter tuning for the XGBRegressors we used in model 2, we realized that the model was barely learning, in the sense that for almost every emotion the RMSE of the training and testing sets only decrease by around 0.005 and ran few epochs. Additionally, for multiple emotions, the RMSE of the testing set was consistently lower than the RMSE of the training set throughout training. These results were, and still are, difficult to interpret. As far as we can tell, such behavior is the result of a relatively small and sparse dataset, as manipulating with the random seed controlling the shuffling of our training-testing split caused these emotions to behave as expected, with the testing RMSE beginning near or greater than the training RMSE in early epochs. This, we think, caused our KFold cross-validation to misrepresent our overfitting, as the general trend of the loss curves for the testing sets do not converge, even if they have consistently lower RMSE than the training set. In fact, we found that, after oversampling our regression data using SMOGN and changing our shuffling, we could not get any regression models to converge, after attempting to train an XGBRegressor, neural-network based MLPRegressor, and a RandomForestRegressor. This led us to consider simplifying our task to a binary decision one for each emotion in order to reduce class imbalance and mitigate the sparsity of our dataset. We justified this by also noting that, for the purposes of the text RPG that we're training the model for, we can change our outputs to binary classifications with a negligible gameplay impact. This led us then, to oversampling our now binary targets using SMOTE to reduce class imbalance. From here, after hyperparameter tuning, we were able to achieve the best results of any other models in terms of stable convergence and overfitting. It is worth noting that the metric we used for searching for our optimal hyperparameters was recall, which was chosen as we would like to reduce the false negative rate of the model, in the sense that we want it to be less conservative in classifying an emotion intensely. This is still not ideal, however, as around 7 of the 10 emotions do not satisfactorily converge, and we are unclear what the reason is. It seems to me us that that our observations may not contain dialogue that encodes particularly learnable sentiments, which is to say that, we may simply need to throw far more data and dialogue at this than we currently have in order for the model to learn from a greater variety of textual information. 

### Conclusion

We believe that unsupervised approaches would fit our goals way better than the supervised approach we have practiced throughout this project. Using a unsupervised approach opens up the possibility of having larger datasets since we would no longer have to hand-label dialogue. The reality is that as we encountered in labelling, it is hard to label sentiment and be agnostic towards context. It may be worthwhile to look at RNNs or transformer models, which are suited for learning sentiment contextually. In the context of in-game dialogue, this focus on contextual sentiment may be relevant and allow for the development of more interesting gameplay elements than what is currently allowed by a non-contextual sentiment analysis. 

On the other hand, if we're interested in continuing a supervised approach, it may be worthwhile to host a labeling tool and recruit other people to help label the data. It may even be interesting to use LLMs like ChatGPT to aid in labeling sentiment. Overall, there are interesting avenues worth exploring with both supervised and unsupervised approaches to this task, which can be formulated as both a classification or regression task. 


### Statement of Collaboration

- Shawn Pana: Preprocessing, data exploration, model training and evaluation for model 1, model training and hyperparameter tuning for model 2, assisted in hyperparameter tuning for model 3. 3D model scene for the in-game graphics. Some writing for each milestone's README.

- Zach Lawrence: Preprocessing, data exploration, model training and evaluation for model 1, evaluation for model 2, model training, evaluating hyperparameter tuning for model 3. Developed and hosted Flask-based backend that runs models, configured dialogue tree construction and logic, wrote in-game dialogue. Some writing for each milestone's README.

Overall, Shawn and I contributed to the project equally, and held each other accountable for getting work done on it throughout the quarter, which was made easier because we live together.
