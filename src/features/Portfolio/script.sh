#!/bin/bash

# Define the output file
output_file="output.txt"

# Remove all content in the output file if it exists
> "$output_file"

# Add directory tree structure to output file
echo -e "\nDirectory structure of src excluding node_modules:\n" >> "$output_file"
tree ./src -I 'node_modules' >> "$output_file"
echo -e "\n" >> "$output_file"

# Find all .ts and .tsx files recursively in current directory and concatenate them into the output file
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | while IFS= read -r -d '' file; do
    echo -e "\nFile: $file\n" >> "$output_file"
    cat "$file" >> "$output_file"
done

echo "All TypeScript files have been concatenated into $output_file"