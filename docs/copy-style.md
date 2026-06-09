# Copy Style (Personal)

Patrick's personal authorial voice for this talk. This is a personal style preference, distinct from the Ingage brand rules in [`ingage-brand.md`](ingage-brand.md). Brand rules (no em dashes, banned words, fonts) live there and apply on top of this; the points below are personal taste, not brand.

## Voice

- **Contractions, conversational.** "What's" not "What is", plus "It's", "I've", and similar. Write the way you would say it.

## Typography (rendered copy)

- **Curly apostrophes and quotes, never straight.** In anything the audience sees on a slide, use the typographic right single quote `’` for apostrophes (Don’t, It’s, you’re) and curly `“ ”` for pull quotes. Straight `'` / `"` read as code on a projected screen. This applies to rendered copy (`src/slides/SlideShow.jsx`, `src/data/steps.js`, visible strings in `src/App.jsx`), not to these Markdown docs or to code. Audit with `grep -rnE "[A-Za-z]'[A-Za-z]" src` (should be empty).

- **Quote attributions read as statements, not footnotes.** The `.sl-cite` attribution under a hero quote (e.g. "– every senior dev, eventually") carries the credibility of the quote. Size it at body scale (~2.8vmin), Heebo italic, weight 500 – large enough to be read deliberately, not skimmed past as a byline.

## Section labels

- **Question-form labels keep a question mark.** "What's the Problem?", "What's Spec-Driven Development?", "What's Spec Kit?", "Why Should I Care?", "What Am I Still Figuring Out?", "What's Next?", "What's The Flow?".
- **Statement or imperative labels take no terminal punctuation.** "Backup".

When writing or editing slide and section-label copy, prefer contractions and keep the "?" on interrogative labels.
