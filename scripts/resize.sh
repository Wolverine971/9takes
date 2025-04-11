
#!/bin/bash

DIRECTORY="C:/Users/djway/Downloads/newbies52"

find "$DIRECTORY" -type f -print0 | while IFS= read -r -d '' file
do
  filename=$(basename "$file")
  newname=$(echo "$filename" | tr ' ' '-')
  base="${newname%.*}"
  
  cwebp "$file" -o "$DIRECTORY/$base.webp"
  cwebp -sns 70 -f 50 -size 20000 "$DIRECTORY/$base.webp" -o "$DIRECTORY/s-$base.webp"
done

read -p "Press Enter to continue"
```

Added `base` variable to handle the filename without extension, and split the cwebp commands into two steps as requested.


# cwebp -q 50 -lossless cyberpunk-apartment-building1.webp -o cyberpunk-apartment-building1-bbb.webp

# cwebp "Steve Jobs.png" -o "Steve-Jobs.webp"
# cwebp -sns 70 -f 50 -size 20000 "Steve-Jobs.webp" -o "./s-Steve-Jobs.webp"