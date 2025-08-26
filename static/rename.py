# static/rename.py
import os

# Set the directory path
dir_path = "/Users/djwayne/Desktop/9takes/src/blog/people"

# Loop through all files in the directory
for filename in os.listdir(dir_path):
    # Rename the file, replacing underscores with dashes
    new_filename = filename.replace("_", "-")
    os.rename(os.path.join(dir_path, filename), os.path.join(dir_path, new_filename))
 