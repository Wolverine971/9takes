# scripts/migrationUpdateSuggestions.py
import os
import yaml
import re

people_suggestions = {
    'Amber-Heard': ['Johnny Depp'],
    'Ellen-DeGeneres': ['Oprah Winfrey', 'Jimmy Fallon'],
    'Emily-Ratajkowski': ['Kim Kardashian', 'Margot Robbie', 'Sydney Sweeney'],
    'Jimmy-Fallon': ['Ellen DeGeneres', 'Jon Stewart', 'Joe Rogan'],
    'Jon-Stewart': ['Jimmy Fallon', 'Joe Rogan'],
    'Khloe-Kardashian': ['Kim Kardashian', 'Kylie Jenner', 'Kourtney Kardashian'],
    'Kim-Kardashian': ['Kylie Jenner', 'Paris Hilton', 'Khloe Kardashian', 'Kourtney Kardashian'],
    'Kourtney-Kardashian': ['Kim Kardashian', 'Khloe Kardashian', 'Kylie Jenner'],
    'Meryl-Streep': ['Oprah Winfrey', 'Leonardo DiCaprio'],
    'Mr-Rogers': ['Jimmy Carter', 'Oprah Winfrey'],
    'Oprah-Winfrey': ['Ellen DeGeneres', 'Michelle Obama', 'Meryl Streep'],
    'Paris-Hilton': ['Kim Kardashian', 'Kylie Jenner'],
    'Pete-Davidson': ['Ariana Grande', 'Kim Kardashian'],
    'Rooney-Mara': ['Timothee Chalamet', 'Johnny Depp'],
    'Sydney-Sweeney': ['Margot Robbie', 'Emily Ratajkowski'],
    'Alex-Cooper': ['Joe Rogan', 'Logan Paul', 'Dave Portnoy'],
    'Casey-Neistat': ['Mr Beast', 'Logan Paul', 'David Dobrik'],
    'Dave-Portnoy': ['Joe Rogan', 'Alex Cooper'],
    'David-Dobrik': ['Mr Beast', 'Logan Paul', 'Jake Paul'],
    'Jake-Paul': ['Logan Paul', 'Mr Beast'],
    'Joe-Rogan': ['Dave Portnoy', 'Alex Cooper', 'Lex Fridman', 'Jimmy Fallon', 'Jon Stewart'],
    'Logan-Paul': ['Jake Paul', 'Mr Beast', 'David Dobrik'],
    'Mr-Beast': ['Logan Paul', 'David Dobrik', 'Casey Neistat'],
    'Kylie-Jenner': ['Kim Kardashian', 'Kendall Jenner', 'Khloe Kardashian', 'Kourtney Kardashian'],
    'Arnold-Schwarzenegger': ['Dwayne Johnson', 'Donald Trump'],
    'Denzel-Washington': ['Morgan Freeman', 'Leonardo DiCaprio'],
    'Dwayne-Johnson': ['Arnold Schwarzenegger', 'Tom Cruise'],
    'Jennifer-Garner': [],
    'Johnny-Depp': ['Amber Heard', 'Leonardo DiCaprio'],
    'Keanu-Reeves': ['Tom Cruise', 'Leonardo DiCaprio'],
    'Leonardo-DiCaprio': ['Johnny Depp', 'Meryl Streep', 'Tom Cruise'],
    'Margot-Robbie': ['Emily Ratajkowski', 'Sydney Sweeney'],
    'Marilyn-Monroe': ['Jackie Kennedy'],
    'Morgan-Freeman': ['Denzel Washington'],
    'Timothee-Chalamet': ['Rooney Mara'],
    'Tom-Cruise': ['Dwayne Johnson', 'Leonardo DiCaprio', 'Keanu Reeves'],
    'Frida-Kahlo': ['Bob Dylan'],
    'Friedrich-Nietzsche': ['Robert Oppenheimer'],
    'Nikola-Tesla': ['Robert Oppenheimer'],
    'Robert-Oppenheimer': ['Nikola Tesla', 'Friedrich Nietzsche'],
    'Ariana-Grande': ['Taylor Swift', 'Billie Eilish', 'Pete Davidson'],
    'Beyonce-Knowles': ['Lady Gaga', 'Taylor Swift'],
    'Billie-Eilish': ['Ariana Grande', 'Taylor Swift', 'Lana Del Rey'],
    'Bob-Dylan': ['Frida Kahlo'],
    'Chappell-Roan': ['Billie Eilish', 'Halsey'],
    'Charlie-Puth': ['Justin Bieber'],
    'Demi-Lovato': ['Miley Cyrus'],
    'Dua-Lipa': ['Ariana Grande', 'Taylor Swift'],
    'Elton-John': ['Lady Gaga'],
    'Grimes': ['Lady Gaga', 'Kanye'],
    'Halsey': ['Billie Eilish', 'Chappell Roan'],
    'Justin-Bieber': ['Charlie Puth', 'Ariana Grande'],
    'Kanye': ['Taylor Swift', 'Beyonce', 'Grimes'],
    'Lady-Gaga': ['Beyonce', 'Taylor Swift', 'Elton John'],
    'Lana-Del-Rey': ['Taylor Swift', 'Billie Eilish'],
    'Miley-Cyrus': ['Demi Lovato', 'Ariana Grande'],
    'Sabrina-Carpenter': ['Billie Eilish'],
    'Taylor-Swift': ['Ariana Grande', 'Beyonce', 'Kanye', 'Lady Gaga', 'Billie Eilish'],
    'Alexandria-Ocasio-Cortez': ['Bernie Sanders', 'Kamala Harris'],
    'Barack-Obama': ['Joe Biden', 'Hillary Clinton', 'Donald Trump', 'Michelle Obama'],
    'Bernie-Sanders': ['Alexandria Ocasio-Cortez', 'Joe Biden'],
    'Donald-Trump': ['Joe Biden', 'Hillary Clinton', 'Barack Obama'],
    'George-H-W-Bush': ['Ronald Reagan', 'George W. Bush'],
    'George-W-Bush': ['Barack Obama', 'George H. W. Bush'],
    'Hillary-Clinton': ['Donald Trump', 'Barack Obama', 'Joe Biden'],
    'Jackie-Kennedy': ['John F. Kennedy', 'Marilyn Monroe'],
    'Jimmy-Carter': ['Ronald Reagan', 'Joe Biden'],
    'Joe-Biden': ['Donald Trump', 'Barack Obama', 'Kamala Harris'],
    'John-F-Kennedy': ['Jackie Kennedy', 'Ronald Reagan'],
    'Kamala-Harris': ['Joe Biden', 'Alexandria Ocasio-Cortez'],
    'Martin-Luther-King-Jr': ['Barack Obama', 'John F. Kennedy'],
    'Meghan-Markle': ['Prince Harry', 'Queen Elizabeth II'],
    'Michelle-Obama': ['Barack Obama', 'Hillary Clinton', 'Oprah Winfrey'],
    'Nancy-Pelosi': ['Joe Biden', 'Kamala Harris'],
    'Nancy-Reagan': ['Ronald Reagan'],
    'Prince-Harry': ['Meghan Markle', 'Queen Elizabeth II'],
    'Queen-Elizabeth-II': ['Prince Harry', 'Meghan Markle'],
    'Ronald-Reagan': ['George H. W. Bush', 'Jimmy Carter', 'Nancy Reagan'],
    'Ruth-Bader-Ginsburg': ['Hillary Clinton'],
    'Winston-Churchill': ['Martin Luther King Jr.'],
    'Bill-Gates': ['Steve Jobs', 'Elon Musk'],
    'Elon-Musk': ['Bill Gates', 'Steve Jobs', 'Jack Dorsey', 'Sam Altman'],
    'Jack-Dorsey': ['Elon Musk', 'Mark Zuckerberg'],
    'Jason-Calacanis': ['Elon Musk', 'Sam Altman'],
    'Lex-Fridman': ['Joe Rogan', 'Elon Musk', 'Sam Altman'],
    'Palmer-Luckey': ['Mark Zuckerberg', 'Elon Musk'],
    'Paul-Graham': ['Peter Thiel', 'Sam Altman'],
    'Peter-Thiel': ['Elon Musk', 'Paul Graham', 'Sam Altman'],
    'Sam-Altman': ['Paul Graham', 'Elon Musk', 'Peter Thiel', 'Jason Calacanis'],
    'Steve-Jobs': ['Bill Gates', 'Elon Musk']
}



def update_file(file_path, person, suggestions):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Create the new content string
        new_content = f"person: '{person}'\nsuggestions: {suggestions}"
        
        # Use regex to replace the existing content
        pattern = r"person: '[^']*'(\s*\n*suggestions: \[.*?\])?"
        updated_content = re.sub(pattern, new_content, content, flags=re.DOTALL)

        if updated_content != content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(updated_content)
            print(f"Updated {file_path}")
        else:
            print(f"No changes needed for {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")
        import traceback
        print(traceback.format_exc())

def search_and_update(directory):
    print(f"Searching in directory: {directory} and all its subdirectories")
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                print(f"Checking file: {file_path}")
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    for person, suggestions in people_suggestions.items():
                        if f"person: '{person}'" in content:
                            update_file(file_path, person, suggestions)
                            break  # Assuming one person per file
                except Exception as e:
                    print(f"Error reading {file_path}: {str(e)}")
                    import traceback
                    print(traceback.format_exc())

# Directory to search in
directory = './src/blog/people'

# Run the script
print("Starting the search and update process...")
try:
    search_and_update(directory)
    print("Process completed.")
except Exception as e:
    print(f"An error occurred: {str(e)}")
    print(traceback.format_exc())
# Directory to search in

