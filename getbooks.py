import os
import pandas as pd
import pickle

# Pathway to pkl files
dir = r'/absolute/path/to/directory'  # CHANGE THIS!

rows = []

for filename in os.listdir(dir):
    if filename.endswith('.pkl'):
        try:
            book_id = int(filename.split('_')[0])
        except:
            print(f"Could not find ID number in: {filename}")
            continue

        if book_id > 10000:
            continue

        file_path = os.path.join(dir, filename)

        try:
            with open(file_path, 'rb') as f:
                data = pickle.load(f)
        except Exception as e:
            print(f"Could not read {filename}: {e}")
            continue

        # Get text
        text = data.get('text') if isinstance(data, dict) else str(data)

        # Create url to gutenberg
        url = f"https://www.gutenberg.org/ebooks/{book_id}"

        rows.append({
            'book_id': book_id,
            'url': url,
            'text': text
        })

df = pd.DataFrame(rows)

# Sort just in case
df = df.sort_values('book_id').reset_index(drop=True)

# Save as CSV
df.to_csv('books.csv', index=False, encoding='utf-8')

print(f"Done! {len(df)} saved to 'books.csv'")
