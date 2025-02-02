#!/usr/bin/env bash

# script.sh
# Reorganize src directory to match the new structure

set -e  # Exit immediately if a command exits with a non-zero status.
set -u  # Treat unset variables as an error.

# 1. Make sure we're running this script from the project root directory
#    (where the "src" folder is located).
#    You can remove this check if you do not want to enforce script location.
if [ ! -d "src" ]; then
  echo "Error: No 'src' directory found in the current location."
  echo "Please run this script from your project's root directory."
  exit 1
fi

##################################
# 2. Create 'components' folders #
##################################

# Each of these lines ensures the "components" subfolder exists
mkdir -p src/features/Desktop/components
mkdir -p src/features/Dock/components
mkdir -p src/features/Finder/components
mkdir -p src/features/PDFViewer/components
mkdir -p src/features/Terminal/components
mkdir -p src/features/Topbar/components
mkdir -p src/features/Window/components

############################################
# 3. Move each Feature's main .tsx into its
#    corresponding 'components' directory  #
############################################

# Desktop.tsx
if [ -f src/features/Desktop/Desktop.tsx ]; then
  mv src/features/Desktop/Desktop.tsx src/features/Desktop/components/Desktop.tsx
fi

# Dock.tsx
if [ -f src/features/Dock/Dock.tsx ]; then
  mv src/features/Dock/Dock.tsx src/features/Dock/components/Dock.tsx
fi

# Finder.tsx
if [ -f src/features/Finder/Finder.tsx ]; then
  mv src/features/Finder/Finder.tsx src/features/Finder/components/Finder.tsx
fi

# PDFViewer.tsx
if [ -f src/features/PDFViewer/PDFViewer.tsx ]; then
  mv src/features/PDFViewer/PDFViewer.tsx src/features/PDFViewer/components/PDFViewer.tsx
fi

# Terminal.tsx
if [ -f src/features/Terminal/Terminal.tsx ]; then
  mv src/features/Terminal/Terminal.tsx src/features/Terminal/components/Terminal.tsx
fi

# Topbar.tsx
if [ -f src/features/Topbar/Topbar.tsx ]; then
  mv src/features/Topbar/Topbar.tsx src/features/Topbar/components/Topbar.tsx
fi

# Window.tsx
if [ -f src/features/Window/Window.tsx ]; then
  mv src/features/Window/Window.tsx src/features/Window/components/Window.tsx
fi

#################################################
# 4. Remove src/constants.ts if no longer needed #
#################################################
if [ -f src/constants.ts ]; then
  rm src/constants.ts
fi

echo "Reorganization of src/ directory complete."
