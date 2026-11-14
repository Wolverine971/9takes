# scripts/findMissingPurpose.py
import os

def find_files_missing_blogpurpose(directory):
    files_missing_blogpurpose = []

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if 'published: true' in content and '<BlogPurpose/>' not in content:
                        files_missing_blogpurpose.append(file_path)

    return files_missing_blogpurpose

# Directory to search in
directory = './src/blog/people'  # Update this to your actual directory path

print("Starting the search process...")
try:
    files_missing_blogpurpose = find_files_missing_blogpurpose(directory)
    
    if files_missing_blogpurpose:
        print("\nThe following files contain 'published: true' but do not contain <BlogPurpose/>:")
        for file in files_missing_blogpurpose:
            print(file)
        print(f"\nTotal files meeting criteria: {len(files_missing_blogpurpose)}")
    else:
        print("All published files contain <BlogPurpose/>")

    print("Process completed.")
except Exception as e:
    print(f"An error occurred: {str(e)}")
    import traceback
    print(traceback.format_exc())