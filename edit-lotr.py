import pandas as pd

# Load the data
data = pd.read_csv('/Users/shawnpana/Documents/GitHub/rpg-sentiment-analysis/lord-of-the-rings/lotr_scripts.csv')


# rename the columns
data['movie'] = data['movie'].str.strip()
data['dialogue'] = data['dialogue'].str.strip()
print(data)

data.to_csv('/Users/shawnpana/Documents/GitHub/rpg-sentiment-analysis/lord-of-the-rings/lotr_scripts.csv', index=False)


