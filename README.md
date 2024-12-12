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
- This will include the results from the methods listed above (C). You will have figures here about your results as well. No exploration of results is done here. This is mainly just a summary of your results. The sub-sections will be the same as the sections in your methods section.

#### Model 1 Results:

After preprocessing and training our first model, we evaluated our model by performing k-fold cross validation, comparing training and testing MSEs, and creating a fitting graph for each emotion. Note that we misunderstood how to generate a fitting graph at this milestone, which we discuss in the Discussion section below. For clarity and to help explain our train of thinking, they are displayed below nonetheless.

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

#### Model 2 Results:

Below are our second model's training and testing MSEs, and the fitting graphs for each emotion.

<img width="470" alt="Screenshot 2024-12-01 at 8 06 31 PM" src="https://github.com/user-attachments/assets/220e8c16-7809-4c35-9abb-8a7e25231e00">

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
![dist2](https://github.com/user-attachments/assets/a040ffbb-5e89-4fb6-a0e8-129013a1543a)


The following are the classification reports for each emotion generated after training each emotion's XGBClassifier with the best hyperparameters found during tuning. Below the classification reports are the loss curves for each classifier generated during training.

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
![loss_curves](https://github.com/user-attachments/assets/1b0b8c37-c93f-4c3f-9501-630092a2398a)


### Discussion Section
- This is where you will discuss the why, and your interpretation and your thoughy process from beginning to end. This will mimic the sections you have created in your methods section as well as new sections you feel you need to create. You can also discuss how believable your results are at each step. You can discuss any short comings. It's ok to criticize as this shows your intellectual merit, as to how you are thinking about things scientifically and how you are able to correctly scrutinize things and find short comings. In science we never really find the perfect solution, especially since we know something will probably come up int he future (i.e. donkeys) and mess everything up. If you do it's probably a unicorn or the data and model you chose are just perfect for each other!

For our second model, we used XGBoost for its efficiency and hyperparameter tuning capabilities in an effort to combat overfitting. The sparseness of our dataset was the main motivator for our hyperparameter values. To emphasize accuracy rather than speed, we used an "exact" tree method. Additionally, we specified a max_depth of 1, introduced an L2 regularization of 100, and reduced the learning rate from default 0.3 to 0.01 in order to mitigate overfitting.

### Conclusion
- This is where you do a mind dump on your opinions and possible future directions. Basically what you wish you could have done differently. Here you close with final thoughts.

### Statement of Collaboration
- This is a statement of contribution by each member. This will be taken into consideration when making the final grade for each member in the group. Did you work as a team? was there a team leader? project manager? coding? writer? etc. Please be truthful about this as this will determine individual grades in participation. There is no job that is better than the other. If you did no code but did the entire write up and gave feedback during the steps and collaborated then you would still get full credit. If you only coded but gave feedback on the write up and other things, then you still get full credit. If you managed everyone and the deadlines and setup meetings and communicated with teaching staff only then you get full credit. Every role is important as long as you collaborated and were integral to the completion of the project. If the person did nothing. they risk getting a big fat 0. Just like in any job, if you did nothing, you have the risk of getting fired. Teamwork is one of the most important qualities in industry and academia!

- Format: Start with Name: Title: Contribution. If the person contributed nothing then just put in writing: Did not participate in the project.
