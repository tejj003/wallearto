# Specification: "The Temperamental Glass" - Interactive Webcam Art

## 1. Project Overview
"The Temperamental Glass" is a web-based interactive art piece that transforms the user's webcam feed into a chaotic, reactive digital painting. The "madness" of the artwork correlates directly with the user's physical activity. The goal is to create an experience that feels alive, temperamental, and visually aggressive.

## 2. Core Concept
The artwork acts as a mirror that rejects vanity. When the viewer is still, the image is somewhat clear but uneasy. When the viewer moves, the mirror "breaks" — fracturing the image, shifting colors, and creating digital noise.

## 3. Technical Architecture
*   **Platform:** Web Browser (Desktop/Mobile support)
*   **Languages:** HTML5, CSS3, JavaScript
*   **Libraries:** [p5.js](https://p5js.org/) (for robust webcam handling and pixel manipulation)

## 4. Visual Style & Aesthetics ("The Madness")
*   **Base Layer:** Thresholded high-contrast video feed.
*   **Glitch Effect:** RGB channel splitting (chromatic aberration) that widens with movement.
*   **Pixel Sorting:** Blocks of pixels will displace horizontally/vertically based on motion intensity.
*   **Color Palette:** Aggressive neon colors (Cyberpunk/Glitch aesthetic) against dark backgrounds.

## 5. Interaction Model
The system calculates a "Madness Factor" (0.0 to 1.0) based on frame-to-frame pixel differences (Motion Detection).

*   **State 1: Dormant (Madness < 0.2)**
    *   Image is gritty but stable.
    *   Slow, breathing pulsation of brightness.
    
*   **State 2: Irritated (Madness 0.2 - 0.6)**
    *   RGB layers start to separate.
    *   Occasional frame stuttering.
    *   Jittery displacement of image slices.

*   **State 3: Enraged (Madness > 0.6)**
    *   Full color inversion.
    *   Extreme pixelation.
    *   Screenshake effect.
    *   "Screaming" text or symbols flashing deeply in the background.

## 6. File Structure
*   `index.html`: Main container.
*   `style.css`: Minimal styling to keep focus on the canvas.
*   `sketch.js`: Logic for webcam capture, motion detection, and rendering effects.
