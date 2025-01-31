#!/bin/bash

# Define the output file
output_file="output.txt"

# Find all .ts and .tsx files, excluding the node_modules directory, and concatenate them into the output file
find . -type d -name "node_modules" -prune -o -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 cat > "$output_file"

echo "All TypeScript files have been concatenated into $output_file"