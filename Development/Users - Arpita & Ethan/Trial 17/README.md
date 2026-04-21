# Prompt Drop Casino

Prompt Drop Casino is a play-for-fun browser slot game built with plain HTML, CSS, and JavaScript. It renders a 5x3 reel board, evaluates 10 fixed paylines, supports adjustable wager and auto-play controls, shows live session play time, awards a once-per-day login bonus with a popup, tracks consecutive daily play streaks, starts an automatic refill countdown when credits are too low to spin, offers an invite friends button, persists theme/consent/reward state in `localStorage`, and includes a separate paytable view.

## Installation / Setup

No package install or build step is required. The project is fully static and already includes its animation dependency at `vendor/motion.js`.

1. From the project root, start a local static server:

```powershell
python -m http.server 8000
```

2. Open the app in a browser:

```text
http://localhost:8000/index.html
```

3. Open the paytable page when needed:

```text
http://localhost:8000/paytable.html
```

Serving over `localhost` is the recommended setup because the game requests browser geolocation during the consent flow, and that feature is typically blocked when opening `index.html` directly from disk.

## Usage Examples

Start a manual spin:

1. Open `index.html`.
2. Accept the privacy policy and terms.
3. Share device location or choose a state manually.
4. Set the bet with the wager slider.
5. Click `SPIN`.

Run auto-play:

1. Set `Auto-Play Count`.
2. Click `start auto spin`.
3. Click `stop auto spin` to halt the queue early.

Check daily rewards:

1. Open `index.html` once per day to receive the daily credit bonus.
2. Return on consecutive local calendar days to increase the streak.
3. Use the daily bonus popup and check-in panel to review the awarded bonus, current streak, and next bonus.

Recover tokens and invite friends:

1. When credits are below the selected wager, the `Token Refill` HUD card counts down to the automatic refill.
2. Click `refill tokens` to refill manually before the countdown completes.
3. Click `invite friends` to share the game through the browser share sheet or copy the invite link.

Review rules and payouts:

1. Click `open paytable` in the main game.
2. Inspect symbol weights, payout multipliers, and the 10-payline gallery in `paytable.html`.

## Configuration

Primary game configuration lives in `game-data.js`:

- `startingTokens`: initial credit balance, currently `3000`
- `defaultSpinCost`: default wager, currently `40`
- `minSpinCost` / `maxSpinCost`: wager bounds, currently `10` to `120`
- `autoSpinRange`: auto-play bounds and default, currently `1` to `30` with default `10`
- `symbols`: symbol labels, weights, and payout multipliers
- `paylines`: the 10 fixed winning line definitions
- `states`: manual state-selection options shown in the consent modal
- `complianceReminder`: location disclaimer text reused across the game and paytable

Browser persistence keys are defined in `script.js` and `paytable.js`:

- `prompt-drop-consent-v1`: stores consent acceptance and location acknowledgement
- `prompt-drop-theme-v1`: stores the selected light/dark theme
- `prompt-drop-daily-reward-v1`: stores the latest rewarded local date, streak count, and bonus amount

If you want to rebalance gameplay or change defaults, update `game-data.js`. If you want to change storage behavior or consent/theme handling, update `script.js` and `paytable.js`.
