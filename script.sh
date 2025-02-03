#!/bin/bash

# Define the output file
output_file="output.txt"
# Remove all content in the output file if it exists
> "$output_file"
# Find all .ts and .tsx files in the src directory, excluding the node_modules directory and .sh files, and concatenate them into the output file
find ./src -type d -name "node_modules" -prune -o -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "*.sh" -print0 | while IFS= read -r -d '' file; do
    echo -e "\nFile: $file\n" >> "$output_file"
    cat "$file" >> "$output_file"
done

# Append the output of the tree command to the output file
echo -e "\n\nDirectory structure of src excluding node_modules:\n" >> "$output_file"
tree ./src -I node_modules >> "$output_file"

echo "All TypeScript files in src have been concatenated into $output_file"
echo "Directory structure of src has been appended to $output_file"