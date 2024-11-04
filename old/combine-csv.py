import csv
import os
import pandas as pd

lotr = '/Users/shawnpana/Documents/GitHub/rpg-sentiment-analysis/lotr.csv'
star_wars = '/Users/shawnpana/Documents/GitHub/rpg-sentiment-analysis/star-wars.csv'

lotr_data = pd.read_csv(lotr)
star_wars_data = pd.read_csv(star_wars)

combined_data = pd.concat([lotr_data, star_wars_data])
combined_data.to_csv('/Users/shawnpana/Documents/GitHub/rpg-sentiment-analysis/movie_script_data.csv', index=False)

