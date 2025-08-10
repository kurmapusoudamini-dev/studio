# **App Name**: Starlight Serenade

## Core Features:

- Starfield: Display a calm starfield as the app's background, using Canvas to draw stars and animate their twinkle effect with requestAnimationFrame.
- Letter Path: Render letter paths forming glyphs with stars, highlight the current and next stars, and manage the guided tapping sequence. Handles 'which star is next' to light the correct path to follow.
- Quote Card: Show a starlight card at the bottom of the screen. Display accessible bottom sheets with quotes tied to each star that can be swiped away or tapped out of.
- Progress Ribbon: Indicate how much progress you've made with the constellation using the Progress Ribbon
- Wallpaper Export: Generate an offscreen canvas with the background gradient and full name constellation.
- Free Roam: Enable replaying quotes by tapping the completed letters' stars; this can happen freely after completing the full sequence once.
- Show contextual hint tool: Show relevant messages depending on the accuracy of the current step in the constellation construction using helper text boxes.

## Style Guidelines:

- Primary color: Warm rose (#FF5A8A) for the interactive elements.
- Background color: Deep navy (#191970) with an indigo (#4B0082) gradient for a dreamy night feel.
- Accent color: Cool white (#E0FFFF) with a soft glow for the stars and lines, to contrast with the dark background.
- Font: 'Inter', a grotesque-style sans-serif. Note: currently only Google Fonts are supported.
- Cards should be designed as blurred-glass bottom sheets with high contrast and large, rounded corners (16-20px), filling 90% of the width.
- Subtle and smooth transitions (opacity/transform) for a polished feel.
- Ensure twinkle and parallax effects adapt or are replaced with instant fade to accommodate users who prefer reduced motion; or implement a Next button to advance manually.