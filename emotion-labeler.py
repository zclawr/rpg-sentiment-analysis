import csv
from typing import List, Dict
import os

def load_movie_data(filename: str) -> List[List[str]]:
    """Load movie dialogue data from CSV file."""
    with open(filename, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        next(reader)  # Skip header row
        return list(reader)

def load_existing_labels(filename: str) -> tuple[List[List], set]:
    """Load existing labels and return them along with set of labeled line numbers."""
    if not os.path.exists(filename):
        return [], set()
        
    labels = []
    labeled_lines = set()
    
    with open(filename, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        header = next(reader)  # Skip header row
        for row in reader:
            labels.append(row)
            # Store the line number (first column) as already labeled
            labeled_lines.add(row[0])
    
    return labels, labeled_lines

def find_line_index(data: List[List[str]], line_number: str) -> int:
    """Find the index of a specific line number in the data."""
    for idx, line in enumerate(data):
        if line[0] == line_number:
            return idx
    return -1

def save_labels(filename: str, labels: List[List], append: bool = True) -> None:
    """Save emotion labels to CSV file, either appending or overwriting."""
    header = ['Line', 'Movie', 'Character', 'Dialogue', 'Joy', 'Sadness', 'Disgust', 
              'Fear', 'Anger', 'Surprise', 'Calmness', 'Confusion', 'Anxiety', 'Lust']
    
    mode = 'a' if append and os.path.exists(filename) else 'w'
    
    with open(filename, mode, newline='', encoding='utf-8') as file:  # Changed 'a' to mode variable
        writer = csv.writer(file)
        if mode == 'w':  # Only write header if creating new file
            writer.writerow(header)
        writer.writerows(labels)

def filter_movie_data(data: List[List[str]], movie: str) -> List[List[str]]:
    """Filter data to only include lines from the specified movie."""
    return [line for line in data if line[1] == movie]

def find_next_unlabeled_index(data: List[List[str]], labeled_lines: set) -> int:
    """Find the index of the next unlabeled line in the data."""
    for idx, line in enumerate(data):
        if line[0] not in labeled_lines:
            return idx
    return len(data)  # Return length of data if all lines are labeled

def main():
    # Constants
    EMOTIONS = ['Joy', 'Sadness', 'Disgust', 'Fear', 'Anger', 
                'Surprise', 'Calmness', 'Confusion', 'Anxiety', 'Lust']
    MOVIES = ['The Return of the King', 'The Two Towers', 'The Fellowship of the Ring',
              'SW_EpisodeVI', 'SW_EpisodeV', 'SW_EpisodeIV']
    
    OUTPUT_FILE = './combined_labels.csv'
    
    # Load data
    try:
        all_data = load_movie_data('./movie_script_data.csv')
    except FileNotFoundError:
        print("Error: movie_script_data.csv not found!")
        return

    # Load existing labels
    existing_labels, labeled_lines = load_existing_labels(OUTPUT_FILE)
    labels = existing_labels
    
    current_movie = MOVIES[0]
    # Filter data for current movie
    current_data = filter_movie_data(all_data, current_movie)
    current_index = find_next_unlabeled_index(current_data, labeled_lines)

    print("\nEmotion Labeling Tool")
    print("--------------------")
    print(f"Found {len(labeled_lines)} previously labeled lines")
    print(f"Currently labeling: {current_movie}")
    print(f"Lines in current movie: {len(current_data)}")
    unlabeled_count = sum(1 for line in current_data if line[0] not in labeled_lines)
    print(f"Remaining unlabeled lines: {unlabeled_count}")
    print("\nEnter rating 0-10 for each emotion, or:")
    print("'q' to quit and save")
    print("'s' to skip current line")
    print("'m' to change movie")
    print("'j' to jump to specific line\n")

    while True:
        # Display current line
        if current_index < len(current_data):
            line = current_data[current_index]
            
            # Skip if already labeled
            if line[0] in labeled_lines:
                current_index = find_next_unlabeled_index(current_data[current_index:], labeled_lines) + current_index
                continue
                
            unlabeled_remaining = sum(1 for l in current_data[current_index:] if l[0] not in labeled_lines)
            print(f"\nLine {current_index + 1} of {len(current_data)} ({unlabeled_remaining} unlabeled lines remaining)")
            print(f"Movie: {line[1]}")
            print(f"Character: {line[2]}")
            print(f"Dialogue: {line[3]}\n")

            # Get emotion ratings
            ratings = []
            for emotion in EMOTIONS:
                while True:
                    rating = input(f"{emotion} (0-10): ").lower()
                    
                    if rating == 'q':
                        # Save and quit
                        if len(ratings) == len(EMOTIONS):  # If we have complete ratings, save them
                            label_row = line + [str(r) for r in ratings]
                            labels.append(label_row)
                            labeled_lines.add(line[0])
                            save_labels(OUTPUT_FILE, [label_row], append=True)
                        return  # Just return, don't save again
                    elif rating == 's':
                        break
                    elif rating == 'm':
                        # Change movie
                        print("\nAvailable movies:")
                        for idx, movie in enumerate(MOVIES):
                            movie_data = filter_movie_data(all_data, movie)
                            movie_lines = len(movie_data)
                            labeled_movie_lines = len([l for l in labels if l[1] == movie])
                            unlabeled = sum(1 for line in movie_data if line[0] not in labeled_lines)
                            print(f"{idx + 1}: {movie}")
                            print(f"   Progress: {labeled_movie_lines}/{movie_lines} lines labeled ({unlabeled} remaining)")
                        
                        movie_choice = input("\nSelect movie number: ")
                        try:
                            movie_idx = int(movie_choice) - 1
                            if 0 <= movie_idx < len(MOVIES):
                                current_movie = MOVIES[movie_idx]
                                # Update current data with new movie
                                current_data = filter_movie_data(all_data, current_movie)
                                # Find next unlabeled line in new movie
                                current_index = find_next_unlabeled_index(current_data, labeled_lines)
                                print(f"\nSwitched to {current_movie}")
                                unlabeled_count = sum(1 for line in current_data if line[0] not in labeled_lines)
                                print(f"Lines in current movie: {len(current_data)} ({unlabeled_count} unlabeled)")
                                break
                        except ValueError:
                            print("Invalid choice. Please try again.")
                    elif rating == 'j':
                        # Display available lines for current movie
                        print(f"\nAvailable lines in {current_movie}:")
                        for idx, line in enumerate(current_data):
                            labeled_status = "✓" if line[0] in labeled_lines else " "
                            print(f"Line {line[0]} [{labeled_status}]: {line[2]}: {line[3][:50]}...")
                        
                        try:
                            jump_line = input("\nEnter line number to jump to: ")
                            new_index = find_line_index(current_data, jump_line)
                            if new_index != -1:
                                current_index = new_index
                                break
                            else:
                                print(f"Line number {jump_line} not found in {current_movie}")
                        except ValueError:
                            print("Invalid line number. Please try again.")
                    else:
                        try:
                            rating_num = int(rating)
                            if 0 <= rating_num <= 10:
                                ratings.append(rating_num)
                                break
                            else:
                                print("Please enter a number between 0 and 10")
                        except ValueError:
                            print("Invalid input. Please try again.")
                
                if rating in ['s', 'm', 'j']:
                    break

            if len(ratings) == len(EMOTIONS):
                # Save complete label set
                label_row = line + [str(r) for r in ratings]
                labels.append(label_row)
                labeled_lines.add(line[0])
                # Save after each complete label set
                save_labels(OUTPUT_FILE, [label_row], append=True)

            current_index = find_next_unlabeled_index(current_data[current_index:], labeled_lines) + current_index
        else:
            print(f"\nNo more lines to label in {current_movie}!")
            print("Please select another movie ('m') or quit ('q')")
            choice = input("Enter choice: ").lower()
            if choice == 'q':
                save_labels(OUTPUT_FILE, labels)
                return
            elif choice == 'm':
                continue
            else:
                print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()