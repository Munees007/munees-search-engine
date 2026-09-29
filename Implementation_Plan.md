

I am building a mini search engine project for an MCA seminar using **Next.js 15, TypeScript, Tailwind CSS and App Router**.

IMPORTANT:

Do NOT redesign my application.

Keep the same visual style and vibe as my current homepage:

```text
Dark background (#000000 / #001d3d tones)
Minimal UI
Centered search bar
Rounded borders
Thin white outlines
Very little text
No dashboard look
No admin panel look
No analytics cards
No excessive colors
```

Think:

```text
Google
Arc Search
Kagi
Linear
```

not

```text
Admin Dashboard
Analytics Dashboard
Bootstrap Template
```

The application should feel like a real search engine.

---

## Project Goal

The purpose is to explain:

```text
Crawling
Indexing
Ranking
Searching
```

using real websites.

The user should be able to:

```text
Enter a URL
Crawl the URL
Extract content
Store in index
Search indexed websites
View ranking score
```

This is NOT a fake SEO simulator.

This is a simplified real search engine prototype.

---

## Architecture

Create a simple architecture.

```text
Frontend (Next.js)

Home Page
Search Results
Crawler Page
Indexing Page
Ranking Page

Backend API Routes

Crawler
Indexer
Search Engine
Ranking Engine
```

---

## Requirements

### Home Page

Keep my current design.

Features:

```text
Search Bar
Search Button
Add Website Button
```

No large cards.

No dashboard widgets.

No statistics.

Minimal.

---

### Crawl Website

User enters:

```text
https://nextjs.org
```

Click:

```text
Crawl
```

The application should:

```text
Fetch HTML
Extract Title
Extract Meta Description
Extract Headings
Extract Main Text
Extract Links
```

Use:

```bash
cheerio
```

for parsing.

---

### Indexing

Store crawled pages in memory or JSON.

Example:

```ts
{
 title: "Next.js",
 url: "https://nextjs.org",
 description: "...",
 content: "...",
 keywords: [...]
}
```

Create a simple indexing algorithm.

Explain in code comments how indexing works.

---

### Search Engine

When user searches:

```text
nextjs
```

Search through:

```text
title
description
keywords
content
```

Return matching results.

Display results similar to Google.

Example:

```text
Next.js

https://nextjs.org

The React Framework for Production
```

---

### Ranking Engine

Create a simple ranking formula.

Example:

```ts
Title Match × 5

Keyword Match × 3

Description Match × 2

Content Match × 1
```

Sort results by score.

Show ranking score.

Explain every step clearly.

---

### Crawler Visualization

Create a simple page.

Keep UI minimal.

Show:

```text
URL
↓
Fetch HTML
↓
Extract Content
↓
Create Index
↓
Ready For Search
```

Use subtle animations.

No complicated charts.

---

### Indexing Visualization

Show:

```text
Page
Keywords
Content
Stored Index
```

Simple and easy to explain during a seminar.

---

### Ranking Visualization

Show:

```text
Search Query
↓
Scoring
↓
Sorted Results
```

Display how scores are calculated.

---

### Code Quality

Requirements:

```text
TypeScript Strict Mode
Reusable Components
Clean Folder Structure
Simple Architecture
Well Commented Code
Easy To Explain During Presentation
```

---

### Most Important Requirement

Do NOT create a complex project.

The project should be:

```text
Easy to explain
Easy to demo
Easy to understand
Looks like a real search engine
Uses real URLs
Shows crawling, indexing and ranking visually
```

Maintain the same dark minimal aesthetic already used on the homepage. Do not change the visual identity. Generate the folder structure and implementation plan before generating code.

---

