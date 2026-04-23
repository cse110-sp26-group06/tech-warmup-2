## Process
We established a "baton pass" approach for this project by dividing the group into five pairs, each specializing in researching and implementing a particular category: app features, visual theme, jargon, users, and gamification and engagement patterns. A group's final version of their app is passed to the next pair for integration of their part.  


## App features - Kevin & Sean
  We first used a prompt given from the warmup-1 and generated a simple 3 row slot machine. For second trial, we implemented the main features like 5x3 grid, division of high-pay and low-pay symbols, and the special effect for high reward, which were all well implemented. In the further entries, we used a detailed prompt for designing the symbols, adding convienience features like auto spin, and privacy pop up table which requests sharing location data and agreement on terms. Through discussion, we agreed that defining a fixed and related symbols with a reasonable reward is crucial for slot machine experience. So we concentrated our prompts on establishing detailed multiline reward logic, setting consistent symbols and placing them into high-pay and low-pay groups with distinguished reward effect.

### Notable features/Observations of the final model before handoff:
- The final model has a solid, basic gameplay foundation. It includes the core slot loop, adjustable
   wager, auto-spin queue, payline legend, winner breakdown, separate paytable page, and a
  privacy/location gate.
- The main added feature is the app's structural clarity: the game logic is configurable through game-
  data.js, and the tests verify deterministic spin-grid generation and payline/payout
  configuration.
  
## Visual Themes - Stephanie & Dishita 
For visual themes integration, we iterated on the color palettes and the typography. We added a dual-theme system with a light mode (brown/gold) and a dark mode (blue/black/silver color theme) while also refining font styles to improve readability and maintaining the slot-machine theme. We used prompts to standardize color and text roles, and this led to a more cohesive and flexible design without changing core functionality.

### Notable features/Observations of the final model before handoff:
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

## Jargon - Maxime & Aidan
Our implementation was quite strightforward, we needed to integrate slot machine jargon in our website. After a single prompt, the website looked more professional and tailored to slot machines. We then created some prompts to fix the layout of the website to remove unecessary space and make the text fit better together. We also used a prompt to update our README to improve readability. Throughout our portion, we used short prompts to not use tokens however after our meeting with the TA, we learned that it would have been better practice to use longer and more specific prompts.

### Notable features/Observations of the final model before handoff:
- Included a spin-history panel and a more explicit winner-breakdown table, which makes results easier to understand after each spin. This is useful because the game only pays the single highest qualifying payline, so showing
    paid vs. merely qualified outcomes reduces confusion.
- The app now keeps the theme/consent flow and overall polished UI from later iterations, so it feels more complete than a bare mechanics prototype.
- One shortcoming is that the spin history is short-lived and limited. It only keeps a small
  recent list and does not persist it across reloads, so it is more of a session aid than a real


## Users - Arpita & Ethan
We used our research in player motivations and the different kinds of users that use a slot machine app (Casual Escapists, Dedicated Regulars, Social Connectors, VIPs, Former real-money gamblers) to add features to the app. We started with a daily bonus and a play timer for more responsible playing, then we added a profile page, and icons that you could buy. We also made it higher stakes for advanced user segments. 

### Notable features/Observations of the final model before handoff:
- Added a profile page, local player-name persistence, unlockable/equippable icons, a shared wallet across pages, daily bonus/streak logic, play-time tracking, refill countdowns, and invite/share behavior.
- Shifted from “slot machine demo” toward a lightweight retention system. It introduces personalization and recurring-return mechanics instead of only spin mechanics.
- Player names are sanitized before saving, icon purchases update the shared wallet, and the daily reward/streak system is persisted locally.
- Shortcomings: this version has many interdependent local states, so it is more fragile and harder to reason about than earlier trials.
- Entirely client-side. Wallet balance, purchases, and streaks all live in localStorage, which means they are easy to reset or manipulate and do not represent durable user accounts.

## Gamification & Engagement Patterns - Zayn & Nicholas
Our research led us to the discovery of multiple individual features that could help improve engagement in our slot machine. Among them were variable rewards, bonuses, modifiers, and near misses, all of which have impact on behavior and conditioning. To implement these main features, we dedicated one prompt/trial for each one. First prompt implemented variable rewards, second prompt implemented bonuses/modifiers, and the third prompt implemented near misses. The slot machine in its final state contains all of these features to drive the highest engagement and keep player retention. 

## Testing
Specific unit tests were written for each group's final iteration/model: Trial 4, Trial 10, Trial 15, Trial 19, and Trial 24, respectively. Each test file corresponds to the specific app model and contains tests that verify the functionality and features implemented in that trial. Each test file was designed to test for specific features each group implemented in their trials. For the app features group(Sean and Kevin), tests were designed to check that the game is set up correctly and behaves predictably when randomness is controlled. For the visual themes group(Stephanie and Dishita), the designed test checks that saved user preferences are applied on load, and that the app remembers and applies the user’s dark mode settings. For the jargons group(Maxime and Aidan), the tests check both UI default state and game config integrity. For the users group(Arpita and Ethan), the test covers user data cleaning, purchases, and shared state updates. Finally for the gamification and engagement group(Zayn and Nicholas), we tested overall features, mainly: the core spin lifecycle, payout UI, insufficient-balance guard, and button-disable behavior.

## Results
Our final app, titled Prompt Drop Casino, is a play-for-fun browser slot game built with plain HTML, CSS, and JavaScript. It renders a 5x3 reel board, evaluates 10 fixed paylines, supports adjustable high-limit wager and auto-play controls, includes a separate user profile page for saving a name and buying profile icons with credits, shows live session play time, awards a once-per-day login bonus with a popup, tracks consecutive daily play streaks, warns when credits are too low for the wager, starts an automatic refill countdown when credits are too low to spin, offers an invite friends button, persists theme/consent/reward/profile/wallet state in localStorage, and includes a separate paytable view. The main game now also includes a classroom-only variable-ratio reward schedule. It can award an extra hidden bonus after an undisclosed number of completed spins while keeping the original payline logic intact.


The main factor in this experiment, producing a significantly more comprehensive and engaging slot machine app than the previous warm-up, was the research we conducted beforehand. Prior research involved exploring existing slot machine apps and their features, game mechanics, jargon, and suitable visual themes, as well as user research to create user personas. By having a better understanding of the kind of slot machine app we wanted to make and the types of users we wanted to cater to specifically, we were able to develop more targeted and detailed prompts for Codex, which in turn was able to output an app closer to what we had in mind. 


In addition to improving the client side of the app, we conducted both end-to-end and unit testing across each group’s final model before handoff to ensure correctness and consistency of features. These tests helped validate deterministic behavior under controlled randomness, confirm UI state changes, and catch integration issues between features introduced in different iterations. To further improve code quality and maintainability, we linted and properly documented the code with clear comments explaining key functions, game logic, and state management decisions. This documentation makes the project easier to understand and debug for future development.


Overall, the final product represents a significant improvement from the previous warmup to a feature-rich, user-aware application. The app successfully demonstrates how more structured prompting, iterative development, and targeted research can produce a cohesive and engaging software system.
