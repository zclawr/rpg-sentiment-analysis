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

### Figures
- Your report should include relevant figures of your choosing to help with the narration of your story, including legends (similar to a scientific paper). For reference you search machine learning and your model in google scholar for reference examples.

The word cloud below illustrates the frequency of words from the labeled observations, with common stop words removed as well as proper nouns that relate to Star Wars-specific lingo and characters. 
![word_cloud](https://github.com/user-attachments/assets/e9e8929a-cbb0-4c2d-affd-db70ee151d46)

The following 10 columns represent the emotional intensity of the dialogue in terms of the following emotions: Joy, Sadness, Disgust, Fear, Anger, Surprise, Calmness, Confusion, Anxiety, and Lust. The emotional intensity is represented by an integer ranging from 0 (not intense at all) to 10 (extremely intense). The following bar graph illustrates the distribution of emotions across all observed dialogue by summing the intensity ratings for all dialogues:

![emotion_sums](https://github.com/user-attachments/assets/0763326a-6d35-4814-9e99-94872c111aef)

From this bar graph we can gather that our data is biased towards calm dialogue, which makes sense in the context of any large body of text; most dialogue will not be explosively emotional and will instead be calm. Furthermore, we notice a prevalence of anxiety, surprise, and fear, which may correlate to the prevalence of intense action and battle scenes in the Star Wars films surveyed in our dataset. It is worth noting that this seems ideal for the science fiction / fantasy RPG world which the model will be used for, as a similar tension will pervade the game atmosphere. The following polar plot illustrates the distribution and intensity of each observation for the emotion categories:

![emotion_polar](https://github.com/user-attachments/assets/d06f7c89-6966-4e07-96cc-6eb03b6af36f)

In the plot, a line represents an observation. We notice from the plot that calmness and confusion have a great amount of cross-over, as do surprise and confusion, which is to say that many observations have high intensities in both surprise and confusion, as well as calmness and confusion. 

### Methods Section
- This section will include the exploration results, preprocessing steps, models chosen in the order they were executed. You should also describe the parameters chosen. Please make sub-sections for every step. i.e Data Exploration, Preprocessing, Model 1, Model 2, additional models are optional. Please note that models can be the same i.e. DNN but different versions of it if they are distinct enough. Changes can not be incremental. You can put links here to notebooks and/or code blocks using three ` in markup for displaying code. so it would look like this: ``` MY CODE BLOCK ```

Note: A methods section does not include any why. the reason why will be in the discussion section. This is just a summary of your methods

#### Data Exploration:
#### Preprocessing:
#### Model 1:
#### Model 2:

### Results Section
- This will include the results from the methods listed above (C). You will have figures here about your results as well. No exploration of results is done here. This is mainly just a summary of your results. The sub-sections will be the same as the sections in your methods section.

### Discussion Section
- This is where you will discuss the why, and your interpretation and your thoughy process from beginning to end. This will mimic the sections you have created in your methods section as well as new sections you feel you need to create. You can also discuss how believable your results are at each step. You can discuss any short comings. It's ok to criticize as this shows your intellectual merit, as to how you are thinking about things scientifically and how you are able to correctly scrutinize things and find short comings. In science we never really find the perfect solution, especially since we know something will probably come up int he future (i.e. donkeys) and mess everything up. If you do it's probably a unicorn or the data and model you chose are just perfect for each other!

### Conclusion
- This is where you do a mind dump on your opinions and possible future directions. Basically what you wish you could have done differently. Here you close with final thoughts.

### Statement of Collaboration
- This is a statement of contribution by each member. This will be taken into consideration when making the final grade for each member in the group. Did you work as a team? was there a team leader? project manager? coding? writer? etc. Please be truthful about this as this will determine individual grades in participation. There is no job that is better than the other. If you did no code but did the entire write up and gave feedback during the steps and collaborated then you would still get full credit. If you only coded but gave feedback on the write up and other things, then you still get full credit. If you managed everyone and the deadlines and setup meetings and communicated with teaching staff only then you get full credit. Every role is important as long as you collaborated and were integral to the completion of the project. If the person did nothing. they risk getting a big fat 0. Just like in any job, if you did nothing, you have the risk of getting fired. Teamwork is one of the most important qualities in industry and academia!

- Format: Start with Name: Title: Contribution. If the person contributed nothing then just put in writing: Did not participate in the project.
