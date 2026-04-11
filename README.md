# random number generator

A premium, monotone dark-mode web application for generating random grids and mapping numbers to musical scales.

## Features
- **Grid Generation**: Generate random numbers in customizable grids (e.g., 4x4).
- **Music Scale Engine**: Support for all Major and Minor scales.
- **Note Mapping**: Automatically translates generated numbers into scale degrees (e.g., `6123` in C Major becomes `A C D E`).
- **Literal Dark Mode**: A sleek, monochrome aesthetic designed for high focus.
- **GitHub Pages Ready**: Pure HTML/CSS/JS with no dependencies.

## How to use
1. **RNG Settings**: Set your Min/Max range and Grid dimensions (Rows/Cols).
2. **Music Scale**:
   - The app randomizes the scale by default unless **Lock Scale** is checked.
   - The translated notes appear immediately below the number grid.
   - Click "Randomize Scale" to manually swap the current key.
3. **Controls**:
   - Click **Generate** or press **Spacebar** to run the generator.
   - Press **Enter** inside any input field to generate.

## Deployment (GitHub Pages)
1. Push this repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Select the `main` branch and `/root` folder.
4. Click **Save**. Your app will be live at `https://<username>.github.io/<repository>/`.

---
*Looking for the legacy terminal version? Check the commit history.*
