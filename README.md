https://justinsteinmetz.github.io/WhoAreYouReally/

# Who Are You, Really

**An identity instrument for Grades 11–12.**

Not a personality quiz. A structured sequence of questions that moves from concrete behaviour to moral confrontation, removing places to hide at each phase. The result is an AI-generated portrait, a headline, and a single question returned unanswered.

---

## What it does

Students work through 15 questions across 6 phases. They answer alone. The result is theirs. They choose what, if anything, enters the room.

At the end, the model produces:

- **A portrait** — 220–300 words, behavioural and specific, grounded entirely in their answers. Arrives unframed.
- **A headline** — 3–6 words. Names the central structural gap or pattern. Not a personality type.
- **The unanswered question** — the single question the model identifies as most conspicuously evaded, deflected, or answered with the least honesty relative to its weight. Returned to them without commentary. No answer invited.

The result does not resolve. The student leaves carrying the returned question.

---

## Phase structure

| Phase | Questions | What it removes |
|---|---|---|
| Behaviour | What you actually did. What you do alone. | The gap between self-image and routine |
| Values | What you believe. What you've done about it. | The comfort of stated principles |
| Performance | How you shift across contexts. Whether that's adaptation. | The alibi of context |
| Origin | Where three things you care about came from. An unexamined inherited belief. | The fiction of independent self-formation |
| Conformity | When you went along. Why you resist. How individual your individuality is. | The performance of resistance |
| Confrontation | A quietly unkind moment. What you avoid acting on. What your ideal self would notice first. | Everything that remains |

---

## The first question

*"What did you do last Saturday — in order, from when you woke up?"*

This is the instrument's strongest question because it asks for behaviour without announcing itself as psychological. Routine reveals priorities. What someone does with unstructured time is more honest than anything they say about themselves. The model is instructed to treat this answer as primary data.

---

## The unanswered question

The model identifies the question answered with the least honesty relative to its weight. This is not necessarily the one left blank — it may be a question answered quickly, minimally, or with a deflection that performed honesty without delivering it.

The question is returned exactly as written. No commentary. No follow-up. It sits on screen after the portrait and headline, without a response field. Students leave with it.

---

## The AI prompt

The model operates under strict constraints:

- Every claim must be directly traceable to something the student said, avoided, or answered minimally
- Absence is signal — `[empty]`, `[deflection]`, and `[minimal]` tags on confrontation questions are treated as primary data, not gaps to work around
- The portrait begins with the single most concrete thing the student revealed without knowing it
- Contradictions are stated without resolution
- No psychological jargon: not 'authentic', not 'journey', not 'growth', not 'resilience'
- No moralising, no reassurance, no softening

The portrait does not end on a note of resolution or hope.

---

## Classroom use

**Time:** 20–30 minutes for the questionnaire. Discussion duration is the teacher's choice.

**The result is private by default.** Students choose what to share. This is stated on the intro screen and repeated in the result footer.

**Discussion entry points:**
- "Is the portrait accurate? Where is it wrong — and why might it be wrong in that specific way?"
- "Which question did you find hardest to answer honestly?"
- "What does it mean that the model identified that question as the unanswered one?"
- "Where do you recognise the gap between what you said you believe and what you've actually done?"

**The phase labels are visible** to students as they move through the questionnaire (Behaviour / Values / Performance / Origin / Conformity / Confrontation). This is intentional — students should know the instrument is structured, even if they cannot fully pre-empt it.

**Back navigation is locked after Phase 6 begins** (question 13). This is also intentional.

---

## Abitur Themenfeld relevance

| Themenfeld | Angle |
|---|---|
| The Individual & Society | Identity formation, conformity vs. individualism, the social construction of the self |
| Politics, Culture & Society — UK/USA | Values vs. action gap; inherited assumptions; resistance and compliance |
| Science & Technology | Optional extension: how algorithmic systems construct identity profiles from behavioural data |

---

## Technical architecture

The instrument uses a **Cloudflare Worker** as a server-side proxy to the Anthropic API. The API key is stored as a Cloudflare environment secret and never exposed in the browser.

### Files

| File | Purpose |
|---|---|
| `index.html` | The instrument — questionnaire, result display, all logic |
| `worker.js` | Cloudflare Worker — API proxy |

### Deploying the Worker

1. Cloudflare dashboard → Workers & Pages → Create a Worker
2. Paste the contents of `worker.js`
3. Settings → Variables → Add a secret variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key
4. Deploy — the Worker will be available at `anthropic-proxy.justin-steinmetz.workers.dev`

The Worker is CORS-locked to `https://justinsteinmetz.github.io`. To allow additional origins (e.g. local development), add them to the `ALLOWED_ORIGINS` array in `worker.js`.

### Deploying the HTML

The Worker URL is hardcoded in `index.html` as the `PROXY` constant at the top of the script block. If your Worker URL differs, update it there.

Rename `who-are-you-v2.html` to `index.html` and push to a GitHub Pages repository. No other dependencies — no frameworks, no build step.

---

## Design

Warm paper palette (`#f2efe9`), DM Serif Display for questions and headline, DM Mono for the instrument's procedural voice. The aesthetic is deliberately document-like rather than application-like. The result screen is sparse — portrait, rule, headline, returned question, footer. No decorative elements on the result.

The portrait arrives without framing. The headline arrives 1.9 seconds later as system interpretation. The returned question arrives last, after a further pause, without explanation.
