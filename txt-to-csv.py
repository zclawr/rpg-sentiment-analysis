import csv
import os

path = '/Users/shawnpana/Documents/GitHub/rpg-sentiment-analysis/star-wars'
output = '/Users/shawnpana/Documents/GitHub/rpg-sentiment-analysis/star-wars.csv'

with open(output, mode='w') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(['Line', 'Movie', 'Character', 'Dialogue'])

    for filename in os.listdir(path):
        if filename.endswith(".txt"):
            with open(os.path.join(path, filename), mode='r') as txt_file:
                text = txt_file.read().split("\n")
                for line in text:
                    if line == "":
                        continue
                    number = line.split("\" \"")[0]
                    number = number[1:]
                    character = line.split("\" \"")[1]
                    if len(line.split("\" \"")) != 3:
                        continue
                    dialogue = line.split("\" \"")[2]
                    dialogue = dialogue[:-1]
                    dialogue = dialogue.replace("\"", "")
                    dialogue = dialogue.replace("  ", " ")
                    csv_writer.writerow([number, filename.replace(".txt", ""), character, dialogue])

