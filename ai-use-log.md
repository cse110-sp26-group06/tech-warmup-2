# Ai Use Log

## Features - Sean & Kevin 
 1. Create a slot machine app that uses vanilla web technology like HTML, CSS, JavaScript, and platform APIs. The slot machine should make fun of AI, as in you are winning tokens and spending tokens.
 2.  Generate a slot machine app with grid 3x5. The slot allows multiway awards, and the award is given starting from the match of 3. Each symbol has different awards, and it is distributed to two groups: high award group which appears less frequently on reels and has award higher than 1000 for the match of 3, and low award group which appears 6 times more frequently on reels and has award lower than 200 for the match of 3. The award gets doubled when the number of match increases. There needs to be an button that opens up the seperate information page that contains the paytable. For a reward higher than 1000, there needs to be special effect of raining coins.
 3. while maintaining all the features, add a feature which user can modify the amount of cost. Add an auto spin button feature which let user to set number of spins and cost per spin. when the user first enter the webpage, the website should open a pop-up window that says "We care about your privacy" and user can continue when he press accept button next to "checked the privacy polices and agree with terms". 

## Modified Prompt 
 Create a slot machine app that uses vanilla web technology like HTML, CSS, JavaScript, and platform APIs. The slot machine should make fun of AI, as in you are winning tokens and spending tokens. Use a 5x3 reel system. Symbols of star, diamond, gold, silver, bronze. Include paylines of 3 horizontal rows: top, middle, bottom. 5 vertical: columns 1-5. 2 main diagonals: top left to bottom right & bottom left to top right. Determine payout by matching at least 3 symbols in straight line. Implement the following payout. Star: 3 in a Row = 15x; 4 in a Row = 30x; 5 in a Row = 60x. Diamond: 3 in a Row = 8x; 4 in a Row = 16x; 5 in a Row = 32x. Gold: 3 in a Row = 4x; 4 in a Row = 8x; 5 in a Row = 16x. Silver: 3 in a Row = 2x; 4 in a Row = 4x; 5 in a Row = 8x. Bronze: 3 in a Row = 1x; 4 in a Row = 2x; 5 in a Row = 4x. Only pay highest paying multiway award. Each app organizes payout table in organized manner. Create special mechanics or effects for high awards such as raining coin, sparkles in background. Provide auto spin button and ability to set number of spins and cost per spin via slider. Create pop up privacy term to accept privacy policy and terms of services. Ask use share of location as legitimacy of gambling differs by states.

## Visual Themes - Stephanie & Dishita
### Phase 1: Typography
- Replace all typography in my slot machine app with the following font system. First, import the following fonts: Abril Fatface, Barlow, Public Sans. Then, systematically update every text element according to these rules:
**For all TITLE text and major announcements:**
- Change font to: Abril Fatface
- Size: 64px with 72px line-height
- This is a bold, dramatic serif that commands attention
- Example usage: Main page title, jackpot amounts, win celebration headers

**For all H1 and H2 headings (like section headers, game mode names, feature titles):**
- Change font to: Barlow
- H1: 44px / 58px line-height, font-weight: 600 (semibold)
- H2: 36px / 42px line-height, font-weight: 600 (semibold)
- This is a modern, geometric sans-serif

**For all BODY TEXT, labels, and UI elements (like bet amounts, balance displays, button labels, captions):**
- Change font to: Public Sans
- Subtitle: 28px / 36px line-height, font-weight: 400 (regular)
- Body 1: 24px / 28px line-height, font-weight: 400 or 700 (bold for emphasis)
- Body 2: 18px / 24px line-height, font-weight: 400 or 700
- Caption: 16px / 24px line-height, font-weight: 400
- This is a clean, readable sans-serif optimized for screens

Go through EVERY component in the app and update the typography. Pay special attention to: slot machine displays, balance and bet amount displays, win amount announcements, button text.

Make sure you preserve any existing styling (colors, spacing, etc.) - ONLY change the fonts, sizes, and line-heights as specified above. After completion, verify that no text is still using old fonts.

### Phase 2: Color Palette
