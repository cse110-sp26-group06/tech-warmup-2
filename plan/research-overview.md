# Overview

In order to achieve a good amount of breadth and depth in research, the team decided to split into pairs and have each pair tackle a research topic. The research topics were:

- App Features (Sean, Kevin)
- Visual Themes (Stephanie, Dishita)
- Jargon Used (Maxime, Aidan)
- Types of Users (Arpita, Ethan)
- Gamification & Engagement Patterns (Nicholas, Zayn)
  

## App Features

## Visual Themes(Stephanie and Dishita)
Visual style guide that defines the text font, sizes for different headings, and a casino-themed color palette
1. Typography
    - Abril Fatface to add dramatic flair for headings and titles, referencing "casino" style
    - Barlow to provide a cleaner and modern look for body text to ensure readability and balance overall design
2. Color Palette
    - Rich brown to evoke feeling of a traditional casino environment(luxurious)
    - Gold to reference idea of winning and wealth
    - Reds to evoke energy and excitement 

### Wireframes(Stephanie and Dishita)
- Includes three core app states - Main Game, Win State, and Leaderboard
- Main game: has slot reels, balance display, spin button, history
- Win state: payout, celebratory graphics/animations
- Leaderboard(optional if we have time): shows top players and their winnings

## Jargon Used

## Types of Users

### Primary user segments

Five behavioral segments account for most slot app users.

1. **Casual Escapists** Play in short bursts for stress relief, commute fill, bedtime wind-down. Rarely spend; tolerant of ads in exchange for free chips. Churn easily.
2. **Dedicated Regulars** Log in daily for bonuses, complete events, care about progression. Occasional spenders ($5–$50/month). The retention backbone.
3. **Social Connectors** Motivated by friends, clubs, leaderboards, team events. Often older-skewing women, who market reports flag as especially responsive to seasonal themed events.
4. **VIPs / "Whales"** Heavy spenders ($500–$10,000+/month). Emotionally invested. Expect concierge treatment, exclusive machines, high-stakes rooms.

5. **Former real-money gamblers** Play socially-branded slots as a substitute — due to self-exclusion, state/country regulation, budget, age, or a decision to step back from real-money play. High session intensity.

**Secondary cut — the 50+ demographic** is growing fastest. Grand View and Deep Market Insights both flag bingo and classic-slot apps as driving this. They skew toward Social Connector and Dedicated Regular behaviors rather than Escapist or VIP.

---

### Core motivations (why people actually play)

The academic and industry literature converges on a consistent list:

- **Variable-ratio reward.** The Skinner-box dynamic — unpredictable payouts produce stronger engagement than predictable ones. Near-misses extend play because the brain reads them as "almost."
- **Flow / "dark flow."** Players describe a time-dissolving absorption state. Csikszentmihalyi's flow applied to slots by Natasha Schüll (MIT). Pleasurable; also the main mechanism behind overspend and session creep.
- **Escape and stress relief.** The #1 self-reported reason across surveys. Slots require zero cognitive load, which is the point.
- **Social belonging.** Clubs, gifting, team events. Especially strong for the Social Connector segment.
- **Status and progression.** VIP tiers, level-ups, collectibles, leaderboards. Drives both Regulars and VIPs.
- **FOMO on limited events.** Seasonal/themed events produce the biggest engagement and spend spikes. Huuuge Games reported ~52% lift in promotional-game participation during Q1 2024 seasonal campaigns.
- **Nostalgia and theme affinity.** Licensed slots (Vegas-branded, IP tie-ins) pull players who associate the theme with a real casino trip or a favorite franchise.

**Responsible-design note:** the same mechanics that drive engagement overlap with problem-gambling risk factors. Any product plan should include session-aware nudges, deposit/spend limits, and self-exclusion hooks — both because regulators increasingly expect it and because churn-through-burnout is a real retention cost.

---

### Personas

#### Persona A — Linda, the Casual Escapist

**Snapshot**
- 38, administrative assistant, suburban Ohio
- Married, two school-age kids
- Android, mid-range phone, data plan metered
- Household income ~$70K

**Context**
Plays Cashman Casino and Lightning Link on her lunch break and for 15 minutes before bed. Started after seeing a Facebook ad during the 2020 lockdowns. Never been to a physical casino; has no interest in real-money gambling.

**Goals**
- Unwind for 10–20 minutes without having to think
- Collect the daily bonus so her chip stack doesn't reset
- Occasionally feel a satisfying "big win" moment

**Frustrations**
- Video ads that can't be skipped kill her short sessions
- When she runs out of chips mid-session and the game pushes a purchase wall
- Complicated events with rules she has to learn
- Slow loading on her older phone

**Behaviors**
- 4–5 sessions/day, avg 4 minutes each
- Watches rewarded ads to refill chips; has never spent real money
- Doesn't use social features; doesn't know anyone else who plays

**Product implications**
- Fast app launch and instant-play matter disproportionately
- Rewarded-ad flows are her primary monetization surface, not IAP
- Over-aggressive paywalls will churn her before she ever spends
- Daily-bonus loop is the retention lever

---

#### Persona B — Anthony James, the VIP

**Snapshot**
- 35, Financial Analyst, Phoenix AZ
- Divorced

**Context**
 He grew up enjoying games like Backgammon and Poker with his friends. A 21 birthday trip to Vegas quickly hooked him onto the slot machines. Due to his busy schedule as a financial analyst he doesn't have time to travel to Vegas these days but if he could play the slots from his home he would have his 2 favorite things, an episode of breaking bad and the slots together. 

**Goals**
- Access exclusive high-stakes machines and early releases
- Maintain his VIP tier and leaderboard position
- Chase genuine "life-moment" wins (even if virtual)

**Frustrations**
- When a competing app offers a better welcome package to lure him away
- Maintenance windows during his prime play time (8–11 PM)
- Feature releases that don't include a high-stakes version
- Customer service tickets that get a generic reply

**Behaviors**
- 2–3 hours/day, one long evening session
- Spends $800–$2,000/month; occasional $5K+ during tentpole events
- Plays two apps in parallel for cross-promotion bonuses
- Very active in the app's VIP Facebook group

**Product implications**
- Tentpole events need a high-stakes lane — otherwise Anthony feels the event "isn't for him"
- Churn risk is not product quality; it's a competitor poaching him with a targeted offer

---



### User stories

Written in standard Agile form (`As a [persona], I want [capability] so that [outcome]`), with acceptance criteria kept to the product-decision level rather than implementation detail.

#### Story 1 — Fast-session entry for Casual Escapists
**As Linda (Casual Escapist), I want to resume playing in under 3 seconds from tapping the app icon, so that I can squeeze a session into my lunch break.**
- App cold-start to spinnable reels < 3s on mid-range Android (P75)
- No interstitial ad on the first launch of a session
- Last-played machine auto-loaded; no menu navigation required

#### Story 2 — Daily-bonus habit loop
**As a Dedicated Regular, I want to collect a daily login bonus that visibly escalates across a streak, so that I feel rewarded for consistent play and don't want to break the streak.**
- Bonus visible on app open, no more than two taps to claim
- Streak counter with clearly communicated reset rules
- Day 7 / day 30 milestone bonuses materially larger than daily (at least 5x)
- Push notification 30 minutes before streak expiry (respecting quiet hours)



#### Story 3 — VIP recognition and host program
**As Anthony (VIP), I want a dedicated host who knows my play history and reaches out with personalized offers, so that I feel recognized as a long-term high-value customer.**
- VIP tier assignment based on 90-day rolling spend and engagement
- Named host with a direct message channel and <24h SLA
- Monthly personalized offer based on preferred machines and event types
- Early access (48–72h) to new slot releases

#### Story 4 — New-user onboarding with meaningful free play
**As a first-time user, I want to experience a "big win" within my first 3 minutes, so that I understand why this app is fun and want to come back.**
- Starter chip grant sized for ~10 spins at default bet
- First-session win rate tuned above steady-state (scripted, not random)
- At least one bonus-round trigger in the first 5 spins
- No IAP prompt in session 1; first offer no earlier than session 3

#### Story 5 — Responsible-play controls
**As any player, I want to be able to see my time and spend and set limits, so that my play stays within what I can afford and actually enjoy.**
- Running session-time indicator visible in settings
- Monthly spend summary accessible in two taps
- Self-imposed deposit and time limits; hard-gated cooldown once reached
- One-tap self-exclusion with clear re-entry window
- Support link to problem-gambling resources (NCPG, GamCare) in settings

*Sources: Global Growth Insights (Social Casino Market Report 2025), Grand View Research (Social Casino Market Report 2030), Statista (Social Casino Gaming Statistics & Facts), Deep Market Insights, adjoe, and academic literature on slot machine psychology (Dixon et al. on dark flow; Schüll, MIT; Skinner's variable-ratio foundation).*

## Gamification & Engagement Patterns

### Zayn

- Variable Ratio Reinforcement capitalizes on unpredictability to drive user engagement
- Losses can be disguised as wins via visuals and audio
- Bonuses can give players a feeling of agency, even though everything is predetermined
- Visible progress bars give players a sense of motivation to completing a goal (Goal-Gradient Effect)
### Nick 
- RTP (return to player): Expected amount of deposited money that is returned to the player. Most casinos run low to mid 90s
- Wins should come sporadically, but can't have pattern or take too long (pity timers for small prizes)
- Near-misses are more stimulating than total misses. Makes players want to keep playing (almost won)
- Bonus minigames are long, almost always pay out something (usually less than the cost of the bonus) or gives consolidation prize if nothing
- Paylines should show on screen and result lines should be quick enough to require attention from the user (keeps them locked in on screen)



## Summary

Slot machines may seem simple on the surface, but in truth, they are a part of a massive industry. Every detail is purposely made to optimize user retention and keep them hooked while making a profit.
