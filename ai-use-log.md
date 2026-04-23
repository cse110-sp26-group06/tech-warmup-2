# Ai Use Log

Table of Contents
- [Features - Sean & Kevin](#features---sean--kevin)
- [Visual Themes - Stephanie & Dishita](#visual-themes---stephanie--dishita)
- [Jargon Used - Maxime & Aidan](#jargon-used---maxime--aidan)
- [Users - Arpita & Ethan](#users---arpita--ethan)
- [Gamification & Engagement Patterns - Zayn & Nicholas](#gamification----engagement-patterns---zayn--nicholas)
- [Unit Testing with Playwright](#unit-testing-with-playwright)

## Features - Sean & Kevin 
### Trial 1
  Create a slot machine app that uses vanilla web technology like HTML, CSS, JavaScript, and platform APIs. The slot machine should make fun of AI, as in you are winning tokens and spending tokens.
### What we learned: 
  AI generated the traditional 3x1 grid slot machine which has some convinience functions like cost modification and log history. It has a nice structure for incremental development, but it is just enough to be called as the slot machine as we used the simple possible prompt. Domain knowlege seems to be necessary for manual implementation of modern online slot machines features.

 ### Trial 2
  Generate a slot machine app with grid 3x5. The slot allows multiway awards, and the award is given starting from the match of 3. Each symbol has different awards, and it is distributed to two groups: high award group which appears less frequently on reels and has award higher than 1000 for the match of 3, and low award group which appears 6 times more frequently on reels and has award lower than 200 for the match of 3. The award gets doubled when the number of match increases. There needs to be an button that opens up the seperate information page that contains the paytable. For a reward higher than 1000, there needs to be special effect of raining coins.
 ### What we learned: 
  The slot machine software now adopts 3x5 grid with multiway paylines. We could not check the special effect for high reward as it depend on the luck, but all features we asked for seems to be working. It was surprising how well the AI defined the amount of rewards as planned, and we believe it is because we set exact numeric standards for setting an award. We decided to add extra features like privacy pop-up window or auto spin for enhanced convienience and wider options for the user.

 ### Trial 3
  while maintaining all the features, add a feature which user can modify the amount of cost. Add an auto spin button feature which let user to set number of spins and cost per spin. when the user first enter the webpage, the website should open a pop-up window that says "We care about your privacy" and user can continue when he press accept button next to "checked the privacy polices and agree with terms". 
  ### What we learned: 
  Now there is a privacy pop-up window that initially asks the user for agreement, and have well functioning auto spin button. As the payline logic might be less familar and intuitive for the users compared to the traditional one, we decided to concentrate our prompt on setting fixed symbols and payline logic. Since our team agreed on lowering the reasoning settings to high for optimized token usage, we decided to use relatively longer prompt this time while making sure all the features are in place before passing down to the next team.

### Trial 4
 Create a slot machine app that uses vanilla web technology like HTML, CSS, JavaScript, and platform APIs. The slot machine should make fun of AI, as in you are winning tokens and spending tokens. Use a 5x3 reel system. Symbols of star, diamond, gold, silver, bronze. Include paylines of 3 horizontal rows: top, middle, bottom. 5 vertical: columns 1-5. 2 main diagonals: top left to bottom right & bottom left to top right. Determine payout by matching at least 3 symbols in straight line. Implement the following payout. Star: 3 in a Row = 15x; 4 in a Row = 30x; 5 in a Row = 60x. Diamond: 3 in a Row = 8x; 4 in a Row = 16x; 5 in a Row = 32x. Gold: 3 in a Row = 4x; 4 in a Row = 8x; 5 in a Row = 16x. Silver: 3 in a Row = 2x; 4 in a Row = 4x; 5 in a Row = 8x. Bronze: 3 in a Row = 1x; 4 in a Row = 2x; 5 in a Row = 4x. Only pay highest paying multiway award. Each app organizes payout table in organized manner. Create special mechanics or effects for high awards such as raining coin, sparkles in background. Provide auto spin button and ability to set number of spins and cost per spin via slider. Create pop up privacy term to accept privacy policy and terms of services. Ask use share of location as legitimacy of gambling differs by states.

### Observations of the final model before handoff:
- The final model has a solid, basic gameplay foundation. It includes the core slot loop, adjustable
   wager, auto-spin queue, payline legend, winner breakdown, separate paytable page, and a
  privacy/location gate.
- The main added feature is the app's structural clarity: the game logic is configurable through game-
  data.js, and the tests verify deterministic spin-grid generation and payline/payout
  configuration.

## Visual Themes - Stephanie & Dishita
### Phase 1: Typography
- Replace all typography in my slot machine app with the following font system. First, import the following fonts: Abril Fatface, Barlow, Public Sans. Then, systematically update every text element to these rules. For all title text, change font to Abril Fatface for a bold, dramatic serif that commands attention. For all major headings, change font to Barlow for a modern, geometric sans-serif. For body text, labels, and captions, change font to Public Sans for a clean, readable sans-serif. Make sure you preserve any existing styling (colors, spacing, etc.). Only change the fonts, sizes, and line-heights as specified above. After completion, verify that no text is still using old fonts.
- **Changes/observations**: app's typography has now been completely updated to the specified font system, while preserving existing colors and other styling. styles.css is now around 100 lines longer and includes new font imports and font-family rules. None of the old fonts remain in the app. Only styles.css has been modified.

### Phase 2: Color Palette
- Transform the entire color scheme of the slot machine app to use this casino color palette. Replace every color systematically according to these rules. For primary colors, use rich brown `#3D1800` to replace all primary background colors, main container backgrounds, and dark structural elements with this color. This should be the dominant background color throughout the app. Use gold yellow `#FFD166` to replace all primary accent colors, call-to-action highlights, and "win" related elements with this color. Use black `#000000` for all primary text that appears on light backgrounds. For secondary colors, use vibrant red `#FF5F5F` for secondary call-to-action buttons, "Spin" or action buttons, alert/urgent elements, and special feature highlights. Use dark gold `#C8860A` for button borders, secondary accents, gradient endpoints, and hover states on gold elements. For accent colors, use warm orange `#FF9E8A` for tertiary accents, hover states, and friendly UI elements. Use light yellow `#FFEAA0` for background cards, soft highlights, and subtle accents. Use light orange `#FFA9A3` as an additional accent for variety in multi-element displays. Replace solid backgrounds with gradients where appropriate: use `#3D1800, #C8860A` for headers and hero sections; use `#FFD166, #FFEAA0` for win displays and celebration; use `#FF5F5F, #FF9E8A, #FFA9A3` for energy elements and special features. After completion, verify that no old colors remain in any component.  
- **Changes/observations**: the app's color scheme has been completely transformed to match the specified casino palette. All primary backgrounds are now rich brown, accents and highlights are in gold yellow, and secondary/action elements are in vibrant red and dark gold. Accent colors have been applied to various UI elements as specified. Gradients have been added to headers and win displays. The app now has a cohesive, warm casino aesthetic. None of the old colors remain in the app, and everything else like typography and layout has been preserved. Only styles.css has been modified, and it's around 50 lines longer.

### Phase 3: Special Visual Effects
- Add these special visual effects to the slot machine app to create a more immersive, premium casino experience. 
 1. Create a raining coins effect that triggers during jackpot wins and major payouts. The color should be gold and the coins should fall from the top of the screen to the bottom, creating a celebratory atmosphere. Loop continuously while celebrating.

 2. Create an ambient sparkle effect that continuously twinkles in the background during gameplay. The animation should be subtle and elegant, using small white or gold sparkles that randomly appear and fade out across the background. Should not interfere with gameplay or readability, and stays faint in the background.

 3. Add glowing box shadows to all important interactive elements.

 4. Create a particle burst effect that fires when the user wins or clicks important buttons.

 5. Add a pulsing effect to the jackpot display and other critical elements. Apply to the jackpot amount display, special feature icons, "SPIN" button when ready

Implement all five effects. Make sure animations perform smoothly. Position effect layers correctly so they don't interfere with interactive elements. Run tests to ensure all effects trigger correctly and don't cause performance issues.

**Changes/observations**:ambient sparkle effect continuously twinkles in the background with small white and gold sparkles. Glowing box shadows have been added to all important interactive elements. A particle burst effect fires when the user wins or clicks important buttons. The jackpot display and critical elements now have a pulsing effect. All animations perform smoothly without causing performance issues, and the effects are layered correctly to avoid interfering with gameplay. Only styles.css and script.js were modified to implement these effects, and they are around 300 lines longer combined.

### Phase 4: Animations
- Implement these animations:
1. Slot Reel Spin Animation
    - When spin button is clicked, each reel should animate vertically
    - Final symbol should "snap" into place with slight bounce

2. Bounce Effect: add bouncing animation to coins, win displays, and celebration elements:

3. Button Hover Animations: add responsive hover animations to all interactive buttons

4. Fade-In Transitions: add smooth fade-in effects for content appearing on screen

5. Number Count-Up: when balance or winnings change, animate the numbers counting up

Run tests to ensure all animations are smooth and don't cause performance issues.

- **Changes/observations**: major issue with slot reel spin animation because it makes a "wave" animation that moves the symbols out of the reel container, which is completely unrealistic. Other effects have been implemented well. Only styles.css and script.js were modified, and they are around 300 lines longer combined. New file, motion.js, under the folder vendor was added for handling motion-based animations. No other additional changes to code.

### Phase 4: Fix Slot Reel Spin Animation
- The current slot reel spin animation moves the symbols out of the reel container. Fix the animation so that the slots spin within the reel container, just like the old animation in trial 7.

- **Changes/Observations**: quick follow-up prompt to fix the slot reel spin animation. Animation now keeps reel spin within the reel container. This is the only change made, and only modifies styles.css and script.js, and deleted 300 lines of code related to the old animation.

### Phase 5: Added Dark mode and light mode option
- Refactor the UI to support both light mode and dark mode using a theme system (CSS variables or Tailwind config).

Requirements:
 - Do not change layout, structure, or game logic.
 - Only modify styling.
 - Implement theme switching using a data-theme="light" and data-theme="dark" attribute on the root element (or Tailwind dark: class).
 - Light Mode (default) — Warm Casino Theme
- Ensure accessible contrast in both modes

Tile colors:
 - Bronze → #B87333
 - Silver → #C0C0C0
 - Gold → #D4A017
 - Diamond → #7DD3FC (slightly cool for contrast)
 - Dark Mode — Cool Blue / Tech Theme
 - Background: #0B0F1A → #121A2B
 - Panels: #111827
 - Cards: #1F2937
 - Primary accent: #3B82F6
 - Secondary accent: #60A5FA
 - Text: #E5E7EB
 
Tile colors:
 - Bronze → #B87333 (keep for recognition)
 - Silver → #9CA3AF
 - Gold → #E5E7EB (neutral metallic, NOT yellow)
 - Diamond → #22D3EE (bright, glowing blue)
 - Effects
  - Add subtle glow to winning tiles:
  - Light mode: soft gold glow
  - Dark mode: blue glow
  - Use soft borders: rgba(0,0,0,0.1) (light) and rgba(255,255,255,0.08) (dark)

- Toggle
  - Add a simple theme toggle (button or switch)
  - Persist preference in localStorage
  - Only update styling and theme logic. Keep everything else unchanged.

### Observations of the final model before handoff:
- The main contribution here is polish and presentation. The final model, trial 10, adds persistent light/dark
  theming, richer visual tokens, ambient sparkles, glow effects, and
  motion-based animation.
- It improves the perceived quality of the product a lot. The theme hydration happens early in
  page load, which helps avoid a flash of the wrong theme.
- It also shows some accessibility awareness through reduced-motion handling and theme
    persistence.
- The main shortcoming is that most of the improvement is cosmetic rather than mechanical. The
  slot system is more attractive, but the underlying gameplay depth is not significantly
  expanded.
- It also introduces more rendering complexity and dependency on animated effects, which can
  increase maintenance cost and make the interface feel visually busy.

## Jargon Used - Maxime & Aidan
### Prompt 1: Introducing the non-intrusive jargon
- Reformat the text to match professional slot machine jargon. Do not implement new features. Examples include: Betting Limits, Fixed Jackpot, Bet/Wager, Buy-In/Add-on
- **Changes/observations**: the app's text has been reformatted to match the jargon. The paytable and winner breakdown have also been updated to use more formal language. No new features have been implemented, and the layout and styling remain unchanged. Only index.html and paytable.html were modified for this prompt.

### Prompt 2: Remove payline map and layout change
- Keep the playtable, however in index.html, remove the playline map since it is redundant. Replace with a spin history that remembers the last 3 spins. Incorporate the breakdown list text into the winner breakdown table. Swap the buttons and the sliders so the buttons are closer to the slots. Make the spin button more attractive and prominent by making it larger and in the middle
- **Changes/observations**: the payline map has been removed and replaced with a spin history panel that shows the last 3 spins. The breakdown list text has been incorporated into the winner breakdown table for a more streamlined presentation. The buttons have been swapped with the sliders, placing them closer to the slots for better accessibility. The spin button has been made larger and positioned in the middle to make it more attractive and prominent. Only index.html, styles.css, and script.js were modified for this prompt.

## Prompt 3: Update spin button
- Fix the bug that when you win, the game does not allow you to spin again. Make a spinning border around the spin button to draw attention. Modified the row of buttons under the reels in the following order, first row: 'start auto spin', 'SPIN', 'stop auto spin' and on the second row: 'refill tokens', 'open paytable'
- **Changes/observations**: bug has now been fixed, and other specifications have been added. Only index.html, styles.css, and script.js were modified for this prompt. No changes to code quality or documentation. 

## Prompt 4: Fixing the button bar
- Remove the spinning feature from the spin button. Instead, make the spin button pulsing, the pulsing stops while the slots are running. Have the auto spin, stop auto spin, refill tokens, open paytable button the same width (enough to fit text). Have the Spin button be 50% larger
- **Changes/observations**: the spinning feature has been removed from the spin button and replaced with a pulsing effect. The pulsing stops while the slots are running. The auto spin, stop auto spin, refill tokens, and open paytable buttons now have the same width, which is enough to fit their text. The Spin button has been made 50% larger than the other buttons to make it more prominent. Only index.html, styles.css, and script.js were modified for this prompt. No changes to code quality or documentation.

## Prompt 5: Update README
- Based on the code, update the README.md to contain: a concise overview, installation/setup, usage examples, configuration
- **Change/observations**: new readme.md file to help next group understand current state of the app

### Observations of the final model before handoff:
- Trial 15’s clearest addition is interpretability. It adds a spin-history panel and a more
    explicit winner-breakdown table, which makes results easier to understand after each spin.
- This is useful because the game only pays the single highest qualifying payline, so showing
    paid vs. merely qualified outcomes reduces confusion.
- It also keeps the theme/consent flow and overall polished UI from later iterations, so it feels
    more complete than a bare mechanics prototype.
- One shortcoming is that the spin history is short-lived and limited. It only keeps a small
  recent list and does not persist it across reloads, so it is more of a session aid than a real
  history feature.

## Users - Arpita & Ethan

### Prompt 1: Daily bonus and Responsible Playing Timer
Update slot machine app so that it gives you a time check of how long you've been playing. Give a daily bonus when you first open the app for the day. Add a streak system for how many days in a row you've played the game, update bonus to increase for more days spent on the app. 
- **Changes/observations**: the app now includes a live playtime tracker that shows how long the user has been playing in the current session. A daily bonus system has been implemented, which gives users a bonus when they first open the app each day. Only index.html, styles.css, and script.js were modified for this prompt. No changes to code quality or documentation.

### Prompt 2: Token refill countdown and Invite Friends
Remove the daily bonus claimed box. Add a pop up for the daily bonus. When you run out of tokens, give a countdown for when tokens will be refilled. Have an invite friends button to send the game to friends. 
- **Changes/observations**: daily bonus is now a pop-up, which is the first thing users see when they enter the app. Only index.html, styles.css, and script.js were modified for this prompt. No changes to code quality or documentation.

### Prompt 3: User Profile Personalization and Higher Stakes
Allow the user to input their name for further personalization. Allow them to purchase emoji/icon for their user by using credits. Allow higher betting limits and higher wins, but don't make it easy to win. 
- **Changes/observations**: user data stored in localStorage, allowing for persistence of player name and "purchase" icons. Very simple user profile page in a small container on home page. Only index.html, styles.css, and script.js were modified for this prompt. No changes to code quality or documentation. Minor UI issues with profile section with text not fitting in the container. 

### Prompt 4: Fixing UI for Profile Page 
Make the user profile a seperate page, put the button for user profile at the top left of the page. Also have a pop up to let the user know when they don't have enough credits for the wager. 

### Observations of the final model before handoff:
- Adds a profile page, local player-name persistence, unlockable/equippable icons, a shared wallet across pages, daily bonus/streak logic, play-time tracking, refill countdowns, and invite/share behavior.
- Shifts from “slot machine demo” toward a lightweight retention system. It introduces personalization and recurring-return mechanics instead of only spin mechanics.
- Player names are sanitized before saving, icon purchases update the shared wallet, and the daily reward/streak system is persisted locally.
- Shortcomings: this version has many interdependent local states, so it is more fragile and harder to reason about than earlier trials.
- Entirely client-side. Wallet balance, purchases, and streaks all live in localStorage, which means they are easy to reset or manipulate and do not represent durable user accounts.

## Gamification & Engagement Patterns - Zayn & Nicholas

### Prompt 1: Variable Ratio Reinforcement
This is a slot machine application created with basic web technology. I want you to add a feature: Variable Ratio Reinforcement. The idea is to deliver rewards to the player unpredictably after an unknown number of plays. The end goal is to drive the highest engagement and persistence. Again, these rewards should appear UNPREDICTABLY. I do not want you to modify previous features except to integrate this new reward pattern. Implement this modularly, integrate it with existing logic without breaking previous features, provide comments, include unit tests that simulate multiple spins and confirm Virtual Ratio Reinforcement behavior. Follow clean code principles of small functions, meaningful names, and modularity. Provide JSDoc comments for all new functions. 

#### Side Note
Codex initially refused to carry out this prompt due to its emphasis on exploiting features that lead to addiction. Was able to bypass this by telling Codex this was for a classroom experiment

### Prompt 2: Bonus Implementation/Style Fix
You are a senior software engineer who formerly worked at DraftKings on their online casinos. You are given a slot machine webapp that runs entirely on vanilla HTML, CSS, and JavaScript. Allow players to purchase a bonus multiplier on their next spin, allow 2x,5x, and 10x multipliers, increasing the cost proportionally but not linearly for each one, ensure return to player for bonuses average 95% across a large amount of uses. Each bonus should cause extra visuals/audio to appear when spinning with the bonus active, increasing in flashiness with how much money they spend. Only modify the underlying odds and implement the bonus button/menu/visuals. Do NOT delete any visuals that already exist. Document all code to enterprise standard, and create additional unit tests to verify both the bonus and visual changes function properly.

#### Follow Up Prompt 1:
Remove "Purchased multipliers use separate RTP-controlled reel odds, do not stack with the hidden classroom reward, and apply only to the next completed spin" from the bonus menu. Also, ensure house rules text is the same color as the rest of the app

#### Follow Up Prompt 2:
Thanks for the text removal, the color is still wrong though. match it to "Standard payline and award conditions apply"

### Prompt 3: Near-Miss Visuals
You are a senior software engineer who formerly worked at DraftKings on their online casinos. You are given a slot machine webapp that runs entirely on vanilla HTML, CSS, and JavaScript. Implement a near-
miss feature that shows paylines that are only missing one symbol to have won. Connect the individual slot symbols with lines in the same palette as the rest of the app. These lines should only be visible
until the next spin button is pressed. Document all code to enterprise standard, and create additional unit tests to verify the visuals do not conflict with any existing assets.

#### Follow Up Prompt 1:
make the lines more translucent, they should blend into the slots, not be overlaid

#### Follow Up Prompt 2:
little bit higher opacity please

#### Follow Up Prompt 3:
in dark mode, the lines vary in opacity as they are between slot sections. Make sure they're consistent, and heighten the contrast to account for darker background colors

### Prompt 4: Code documentation and cleanliness
This is a slot machine web app that runs on vanilla web technology. However, we need to ensure that it meets basic software engineering standards. The code must be linted, documented, tested, and clean. Your job is the following. Make sure all source code is appropriately documented. JavaScript should use JSDocs with type annotations. Also, make sure that the code is clean. What this means is meaningful names for variables, small functions and classes, avoiding duplicate code, handling errors, modularity, and being easy to update. Testing will be done separately so don't worry about it for now. For linting, just try to address syntactic errors. Don't touch the existing logic and features except to make things cleaner and to document them.

### Prompt 5: HTML and CSS Comments
This is a slot machine web app that runs on vanilla web technology. I want you to simply go through and leave comments. The purpose of these comments is to make the code more readable for future developers. The JavaScript is mostly commented, but the HTML and CSS files aren't. Leave comments on the HTML and CSS files.

## Unit Testing with Playwright
- Specific unit tests were written for each group's final iteration/model: Trial 4, Trial 10, Trial 15, Trial 19, and Trial 24. These tests are located under a `tests` folder in each trial's folder, as well as the `tests` directory in the project. Each test file corresponds to a specific trial and contains tests that verify the functionality and features implemented in that trial. Each test file was designed to test for specific features each group implemented in their trials. These were the prompts use to write tests for each group's final iteration/model:
- Trial 4: Write a unit test that exposes the expected paytable and payline configuration checks the core slot config: 3
  rows, 5 reels, 10 paylines, the exact Top Row cell layout, presence of California in the state list, the star 5-match payout, and that unknown symbols pay 0. The test should build a deterministic 5x3 spin grid from the weighted symbol picker replaces crypto.getRandomValues with a queued deterministic source, runs createSpinGrid(), and
  verifies the exact symbol grid returned.
- Trial 10: Write a unit test that applies a stored dark theme during initialization seeds localStorage with the saved   theme and consent, loads index.html in an iframe, and verifies the page bootstraps with data-theme="dark".
- Trial 15: Write a unit test that renders the spin-history empty state on initial load loads the page fresh and checks that the spin-history panel starts with No spins recorded yet. Ensure the app keeps the expected paytable ordering in game configuration verifies the symbol order, Bronze weight, the star 5-match payout, and that Trial 15 still exposes 10 paylines.
- Trial 19: Write a unit test that sanitizes and persists the saved player name on the profile page enters a messy name, saves it, and checks the UI and localStorage both contain the cleaned Ada Lovelace value. Ensures the app purchases and equips an icon while updating the shared wallet preloads a wallet/profile state, buys Bot Buddy, and verifies the token count drops to 650, and both wallet/profile persistence are updated.
- Trial 24(final iteration tests): tests the following cases
  - Spin changes the displayed result grid: verifies a spin changes the visible symbols and that the deterministic winning grid includes gold in expected positions
  - Balance updates correctly after a winning spin: confirms the spin completes and the UI updates to 3,300 tokens with a 360 last award.
  - Win condition displays after a winning spin: Checks the win message, winMeta, and breakdown list all describe the expected Top Row gold win and 360 credit payout.
  - Cannot spin with 0 balance: Sets credits to zero, expects the spin button to be disabled, and verifies calling spin() does nothing except show an insufficient-credits message (tests/final-iteration-tests.ts:292).
  - Spin button disables during an active spin: Starts a spin and checks that the app marks itself as spinning and disables the spin button until the spin finishes
- The results have been documented as screenshots under each trial's respective `test-results` folder. 

