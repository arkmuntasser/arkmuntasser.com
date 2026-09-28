---
title: Stop Tokenmaxxing And Build Some Tools, Dammit!
date: "2026-09-28"
excerpt: Burning tokens isn't a strategy, it's a bill, and if you want AI to actually move the needle for your team, stop obsessing over spend and start building the tools that make the work faster, better, or just gone entirely.
author:
 - amir
category:
 - ai
 - development
 - efficiency
 - tokenmaxxing
featured: true
weeknotes: false
---

We need to build 10 widgets for a client's site. On average, a dev spends 1.5 hours per widget, that’s 15 hours. 2 days. But instead of a dev picking up those tickets, an agent does.

The agent dispatches a subagent to understand the designs in Figma, another understands our platform, another puts the 2 together and builds the widgets, and a final one verifies the work via Dev Tools. 3 hours later each widget is complete, AI reviewed, and sitting in their own branch on the repo awaiting a human dev to review and push the code live.

These are real, measurable efficiency gains from AI.

How did we do it?

## Tokenmaxxing ain’t it

Tokenmaxxing or the idea that spend on AI is a meaningful stand-in measurement for productivity or gain when leveraging AI has become pretty popular. [Jensen Huang, CEO of Nvidia, recently said the he would be “deeply alarmed” if an engineer didn’t consume at least half their salary in tokens.](https://www.businessinsider.com/jensen-huang-500k-engineers-250k-ai-tokens-nvidia-compute-2026-3) But what does spend tell us other than whether or not AI is being used? Nothing. You cannot determine the quality of the work just by looking at the spend no more than you can determine the validity or quality of a PR from the line additions and removals alone. And you might be tempted to think that it can map to speed of delivery, but, once again, the only thing you know is AI is being used and not how well it’s being used. Someone inefficiently prompting and re-prompting on a few tickets will rack up a significant bill same as a power user crafting excellent prompts that enables them to knock out dozens of tickets at the same time.

It’s a useless metric outside of measuring for adoption.

If you want to measure the benefit of AI adoption within your organization you have to tie it directly to problems being solved or opportunities being created.

## Tools, tools, tools

I didn’t get all my devs Cursor for them to burn tokens. I did it to unlock our ability to build tools we’ve always wanted, but didn’t have either the time or expertise to build. And to explore the potential for new tools we could never have dreamed of prior to AI. Tools that we can use everyday that meaningfully transform our work by either obviating the work altogether or providing us a new ability to provide a superior service to our clients. And sometimes those tools, once built, never involve AI again. In those cases, the token spend becomes a one time cost incursion, but the benefit is ongoing.

## Examples

Let’s go over 3 examples of tools my team has built  since March this year when we got access to Cursor. A couple things to note is that the majority of **my devs have a $1000/month spending limit** which they are never close to hitting and a select few devs have higher limits with the highest limit being at $2500 which was only ever that high for a single month. All of which to say is that you can have significant gains without significant spend.

### An accessibility skill

We care about accessibility and as anyone who does will tell you it can be difficult to remember everything you need to account for during build.

To help us make sure we’re meeting the accessibility standards expected of us we’ve built a Cursor skill that leverages the MCP for Axe (axe-core) in order to not only run a series of tests against our builds, but to automate the implementation of fixes where possible, and to finally present a report on what issues were found, what was fixed, and what remains to be addressed manually.

In practice, we’ve found few instances where additional manual effort was required after running this skill. This has been a tremendous timesaver. It used to be a dev, even using Axe, would be required to audit a build, create a report breaking down the issues, and potentially spin up tickets for items that needed to be fixed which in turn would then need to be knocked out as well. That’s potentially several hours worth of work that’s been reduced to a mere hour and a half of running a skill in the background.

### A GTM audit tool

As our clients are marketers, you can imagine they have loaded up their Google Tag Manager (GTM) containers with every tracker under the sun and it’s been a dumping ground for every random pixel and script for years. They get heavy and can have a significant impact on the loading performance of a site.

Auditing the contents of a GTM container and which items are valid, which are misconfigured, and which are impacting performance and by how much is a laborious task that can take 60+ hours of dev’s time.

The tool we built does the following:

- Determines if the items in the container are valid by checking if they 404 or otherwise error when loading and records it.
- Groups and categorizes items within the container as often clients don’t know what all is in there and for what reason.
- Systematically runs through every permutation of disabling items and groups of items within the container and running speed tests to determine which items are the worst offenders for loading performance.
- Provides a health score for the GTM container.
- Provides actionable feedback based on the data.
- Provides a full report and breakdown of everything as both a web page and an excel file.

It does all this in a handful of hours and it does it better than any of our devs can. Anyone doing all this would be burned out by it and make a mistake somewhere and incorrectly record something or fail to make the end report as clear as it could be. It’s a mundane, mind-numbing repetitive task that was ripe for automation and in the end it delivers a superior result in the form of the health score and the easy to read web-based report with which clients can make informed decisions on what to do with their containers.

### A Figma-to-build Cursor plugin

The last 2 examples were of tools and automations that tackled a narrow scope of work, but this next one was born out of the idea of revolutionizing our entire delivery pipeline.

We built a Figma-to-build plugin for Cursor. This plugin spins up an agent to communicate with Figma via MCP to consume and understand a design, another agent that is an expert in using our bespoke component library, an agent to implement the design using the components in our CMS, an agent that double checks the work of the implementation agent using Chrome’s Dev Tools MCP, and an agent to coordinate and facilitate it all.

The result is a system that can handle an entire website build project by itself. We keep a dev in the loop with this tool to validate its output and ensure quality standards are met.

In early testing **dev time spent on a website build dropped from an average of 120 hours to an average of 45 hours** which is a reduction of over 60%. Once deployed at scale this means we can fit more builds in the project pipeline which is great for the company and it’s a faster time-to-value for the client. That speed also enables the company to be more competitive in going after bids because we can deliver work faster than before.

## Works in progress

There are other tools we’re exploring that have been harder to get working, but we’re optimistic about the direction of their development. For example we’re working on a migration tool that would enable us to automate moving content from any CMS into our CMS.

We’ve created various migration scripts before, but the problem with them is that every client’s site can be pretty unique in their setup so each migration script becomes pretty locked to the client it was written for. We wanted to see if we could leverage the inherent fuzziness of AI to create a migration system that could migrate anything into our CMS. Results have been positive, but inconsistent. We’re seeing enough movement in the right direction that we’re continuing with the project. The issues with this system and why it’s not an instant win like with the 3 examples I noted above is that migrating content between systems is subjective. We’re not merely copying a page's HTML into our CMS, we’re looking at how the source CMS is structuring content and trying to smartly map itself to how our CMS is structuring content.

Different CMSes have different philosophies about how to represent some data and translating between those philosophies is more of an art and less of a science.

## Keep it simple

If you want to get a benefit out of AI quickly then you need to **avoid trying to build tools that live in the subjective realm** like the migration tool I noted above. Focus on tools where the scope is narrow and the outcome is binary.

With the accessibility tool we built, running axe-core is a simple pass or fail test. And then the code it writes to fix those items are within the wheelhouse of the AI as is writing the report at the end.

The GTM audit tool was written with AI, but mostly doesn’t itself leverage AI aside from report generation and summarization which is, once again, right in the wheelhouse of the AI.

These won’t always be the highest impact items at first, but savings add up and smaller tools build up the skills to build bigger tools within the team.

And the team should want to build the tools.

## Getting devs onboard

One of the benefits of this approach is that it isn’t boring. Just pointing an AI at a ticket and waiting for it to write something sucks! Exploring the limits of a tool like AI isn’t boring. It’s a lot of fun! My devs get a kick out of exploring what MCPs exist and what ideas that triggers for them. Most of the tools we’ve built or are building were not the result of some top-down analysis and directive, they were ground-up initiatives.

That doesn’t mean they had free rein to build whatever they wanted. My senior managers and I would review the ideas, provide guidance on directions to take, check in regularly on development of these tools. This way we didn’t waste time (or money) on something that was novel, but not meaningful to our business.

Even with the oversight, my **devs are excited to explore and push the limits of their creativity with what tools they can string together**. I haven’t seen them this excited in a long time.

## The results

What does this all add up to? With everything altogether, including several tools not noted in this blog post as well as AI workflows adopted by other teams we coordinate with, we've been able to see a roughly **20% efficiency gain from contract to delivery**. This is based on total hours per project spent across dev, design, PM, and content.

That’s real, that’s tangible, that’s significant.

**That directly maps to more projects built in a year, more RevRec, real dollars and cents**.

Tools, not tokens.

