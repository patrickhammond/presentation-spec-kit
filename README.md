# Understanding Spec Kit

**Live demo:** https://presentation-spec-kit.patrick-hammond.workers.dev

**Source:** https://github.com/patrickhammond/presentation-spec-kit

A conference talk deck and interactive diagram about Spec-Driven Development (SDD) with Spec Kit. Delivered as multiple variants from one codebase: a ~40 min GDG Cincinnati community talk and a 7-8 min Ingage lightning talk.

## What's in here

The app is both a slide deck and an interactive React Flow diagram walking through the eight Spec Kit commands (`/constitution` through `/implement`) across four tiers of the development lifecycle. Attendees can explore the flow themselves via the shared link.

## Running locally

```
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # static bundle to dist/
npm run preview    # build + serve via wrangler
npm run lint
npm test
```

Add `?variant=gdg` for the full GDG Cincinnati talk or `?variant=ingage` for the lightning talk. No param shows the variant picker.

## Deploying

```
npm run deploy     # build + wrangler deploy to Cloudflare Workers
```

## Stack

React 19 + Vite 8, plain JSX. `@xyflow/react` v12 for the node graph. Deployed to Cloudflare Workers via `@cloudflare/vite-plugin`. See [`docs/tech-stack.md`](docs/tech-stack.md) for full detail.
