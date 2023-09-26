#!/bin/bash

DIRECTORY="C:/Users/djway/Desktop/svelte/9takes/static/blogsz/"

for file in $(find "$DIRECTORY" -type f)
do
  echo "Processing $file"
 filename=$(basename "$file")
  echo "Processing $filename"
  # Put your command here. For example:
  cwebp -sns 70 -f 50 -size 20000 "${file}" -o "C:/Users/djway/Desktop/svelte/9takes/static/blogsz/s-${filename}"
  echo "$file"
done


read -p "Press Enter to continue"


# cwebp -q 50 -lossless cyberpunk-apartment-building1.webp -o cyberpunk-apartment-building1-bbb.webp