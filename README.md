# random number generator

a web application for generating random grids and mapping numbers to musical scales.

## features
- **grid generation**: generate random numbers in customizable grids (e.g., 4x4).
- **music scale engine**: support for all major and minor scales.
- **note mapping**: automatically translates generated numbers into scale degrees (e.g., `6123` in c major becomes `a c d e`).
- **literal dark mode**: a sleek, monochrome aesthetic designed for high focus.
- **github pages ready**: pure html/css/js with no dependencies.

## how to use
1. **rng settings**: set your min/max range and grid dimensions (rows/cols).
2. **music scale**:
   - the app randomizes the scale by default unless **lock scale** is checked.
   - the translated notes appear immediately below the number grid.
   - click "randomize scale" to manually swap the current key.
3. **controls**:
   - click **generate** or press **spacebar** to run the generator.
   - press **enter** inside any input field to generate.
