

UXOTI TESTING  Product Requirements Document

## UXOTI TESTING

## Product Requirements Document




UX Evaluation Platform for Researchers & Designers


## Version

## 1.0 — Initial Release

## Date

## March 2026

## Status

## Draft

## Audience

## Product, Design, Engineering


Confidential — v1.0    Page 1

UXOTI TESTING  Product Requirements Document

Table of Contents



Confidential — v1.0    Page 2

UXOTI TESTING  Product Requirements Document

## 1. Executive Summary
UXOTI Testing is a web-based UX evaluation platform purpose-built for UX researchers and
designers. It digitalizes the structured UX Analysis Kit methodology — originally a multi-sheet
Excel workbook — into a guided, collaborative workflow that outputs professional reports
without any spreadsheet expertise required.


The platform supports two industry-standard evaluation frameworks: Nielsen Heuristic
Evaluation (10 heuristics) and 7-Dimension UX Findings, paired with an automatic severity
scoring engine, a visual severity heatmap, an effort-vs-impact prioritization chart, evidence
attachment per finding, a contextual heuristic reference guide, and a shareable read-only report
link.


UXOTI Testing eliminates the gap between a rigorous UX evaluation and a deliverable that
stakeholders and engineering teams can act on.


## Problem
UX evaluations live in Excel templates that are
hard to navigate, produce no visual outputs, and
require manual effort to turn into reports.

## Solution
A guided web app that walks evaluators through
every step, auto-calculates scores, visualizes
findings, and produces a shareable report in one
click.



Confidential — v1.0    Page 3

UXOTI TESTING  Product Requirements Document

## 2. Product Overview
## 2.1 Product Name & Positioning
## Field

## Value

## Product Name

UXOTI Testing

## Tagline

Evaluate smarter. Report faster.

## Category

UX Research & Analysis Tool

## Primary Users

UX Researchers, UX Designers

## Deployment

Web application (browser-based)

## Auth Model

Account-based with persistent cloud storage


## 2.2 Core Value Propositions
- Guided workflow — step-by-step evaluation flow that mirrors expert methodology
- Auto-scoring engine — eliminates manual formula work, calculates severity
automatically

- Visual outputs — heatmap and effort/impact chart generated live from findings data
- Evidence-linked findings — screenshot attachments anchored to each issue
- One-click sharing — read-only report URL for stakeholders and developers
- No spreadsheet required — full methodology available without opening Excel

## 2.3 Target Users
Primary persona: UX Researcher / Designer

## Attribute

## Description

## Role

UX Researcher, UX Designer, Product Designer

## Experience

Entry-level to senior practitioners

## Context

Agency, in-house product team, freelance, academic

## Goal

Evaluate a digital product and produce a prioritized report for
stakeholders

## Pain Point

Excel templates are time-consuming to fill, don't produce visual
outputs, and are hard to share

## Tech Comfort

Moderate — comfortable with SaaS tools, no coding expected



Confidential — v1.0    Page 4

UXOTI TESTING  Product Requirements Document

## 3. User Flows
## 3.1 Authentication Flow
UXOTI Testing uses account-based authentication to ensure projects are persistent across
sessions and devices.


- User visits app URL
- User chooses Sign Up (new) or Sign In (returning)
- Sign Up: enter name, email, password — email verification sent
- Sign In: enter email and password — redirect to project dashboard
- Forgot password: email reset link flow
- All projects tied to user account, accessible on any device

## 3.2 Main Evaluation Flow
## Step

## Action

## Screen

## Output

## 1

Create project

Project setup form

Project record created

## 2

Fill journey map

Journey map builder

Stages, needs, feelings,
barriers

## 3

Choose evaluation method

Method selector

Heuristic or 7 Dimensions
path

## 4

Add findings

Findings table

Issues logged with
evidence

## 5

Review auto scores

Scoring dashboard

Severity scores +
categories

## 6

Review visualizations

Heatmap + chart view

Visual priority map

## 7

Export / share

Report page

PDF download +
shareable URL



Confidential — v1.0    Page 5

UXOTI TESTING  Product Requirements Document

## 4. Feature Specifications
## 4.1 Authentication & Account Management
## Feature

## Requirement

## Sign Up

Email + password registration. Email verification required before
first login.

## Sign In

Email + password. Session persists across browser closes
(remember me default on).

## Password Reset

Email-based reset link, expires in 1 hour.

## Profile

Name, email, profile photo (optional). Edit from account settings.

## Session

JWT-based auth. Auto-refresh tokens. 30-day session duration.

## Data Isolation

Users can only access their own projects. No shared workspace in
v1.


## 4.2 Project Management
Each project maps to one evaluation session of one product/app.

## Field

## Details

## Project Name

Required. Free text. Max 80 characters.

## App / Product

The name of the app being evaluated. Required.

## Evaluator

Pre-filled from account name. Editable.

## Date

Auto-set to creation date. Editable.

## Platform

## Dropdown: Mobile / Web / Desktop / Cross-platform.

## Scope / Flow

Free text. Example: Checkout flow, Onboarding. Max 120
characters.

## Status

In Progress / Completed. Auto-set, manually editable.


Project dashboard shows all projects as cards with: name, app, date, evaluation method, status
badge, and last modified timestamp. Projects can be duplicated, archived, or deleted.


## 4.3 Journey Map Builder
The journey map captures the user experience across up to 5 stages before evaluation begins.
It serves two purposes: framing the scope of the evaluation, and feeding the Journey Zone
Multiplier in the scoring engine.


Confidential — v1.0    Page 6

UXOTI TESTING  Product Requirements Document

## Row

## Description

## Stages

Up to 5 named stages. Stage names become column headers
across the map.

## Objectives

What the user is trying to accomplish in each stage.

## Needs

What the user needs from the product in this stage.

## Feelings

Expected emotional state of the user in this stage.

## Barriers

Potential friction points or blockers the user may face.


The stage names defined here appear as column options when the evaluator assigns a Journey
Zone to each finding in the scoring step. This feeds the Journey Zone Multiplier formula.


## 4.4 Evaluation Methods
## 4.4.1 Heuristic Evaluation
Based on Nielsen's 10 Usability Heuristics. Each finding is tied to one heuristic.

## Code

## Heuristic

## Description

## H1

Visibility of System
## Status

The system should always keep users informed about what is
going on, through appropriate feedback within reasonable time.

## H2

## Match: System &
## Real World

The system should speak the users' language, with words and
concepts familiar to the user.

## H3

## User Control &
## Freedom

Users often choose system functions by mistake and need
clearly marked emergency exits.

## H4

## Consistency &
## Standards

Users should not have to wonder whether different words,
situations, or actions mean the same thing.

## H5

## Error Prevention

Even better than good error messages is a careful design which
prevents a problem from occurring.

## H6

Recognition over
## Recall

Minimize the user's memory load by making objects, actions,
and options visible.

## H7

## Flexibility &
## Efficiency

Accelerators may speed up interaction for expert users, while
remaining invisible to novice users.

## H8

## Aesthetic &
## Minimalist Design

Dialogues should not contain irrelevant or rarely needed
information.

## H9

## Error Recovery

Error messages should be expressed in plain language,
precisely indicate the problem, and constructively suggest a
solution.

## H10

## Help &
## Documentation

Even though it is better if the system can be used without
documentation, it may be necessary to provide help.


Confidential — v1.0    Page 7

UXOTI TESTING  Product Requirements Document

Findings fields per row: Heuristic (dropdown H1–H10), Issue Description, User Impact, Severity
0–4 (dropdown), Recommendation, Effort (Low/Medium/High), Priority (auto-calculated), Status
(Open/In Progress/Resolved), Evidence (screenshot attachment).


4.4.2 Seven-Dimension Findings
A broader evaluation framework that goes beyond heuristics. Used independently or as a
complement to heuristic evaluation.


## Dimension

## Focus Area

## Detection Method

## Heuristic

Nielsen 10 heuristics violations

Direct inspection of H1–H10 per
flow step

## Business & Conversion

Dark patterns, CTA clarity,
conversion friction

Conversion funnel analysis, drop-off
points

## Information Architecture

Navigation structure, mental model
alignment

Card sorting, tree testing, findability
rate

## Visual Hierarchy

Layout, contrast, focal point,
attention flow

F/Z-pattern analysis, first-click test

## Emotional Design

Microcopy tone, trust signals, anxiety
points

Microcopy audit, error message
review

## Accessibility

WCAG 2.1 compliance, contrast, tap
targets

WCAG AA checklist, contrast ratio
checker

## Content & Clarity

Label ambiguity, instruction clarity,
terminology

Cloze test, comprehension test,
label audit


Findings fields per row: Problem/Issue, Category (dropdown of 7 dimensions), Sub-type /
Heuristic reference, User Impact, Recommendation, Severity (auto-calculated from scorer),
Effort, Action, Evidence attachment.



Confidential — v1.0    Page 8

UXOTI TESTING  Product Requirements Document

## 4.5 Heuristic Reference Guide
A contextual side panel available on any screen where the evaluation form is open. Eliminates
the need to leave the app to look up methodology definitions.


## Behavior

## Specification

## Trigger

Persistent 'Reference' button in the evaluation form sidebar.
Keyboard shortcut: R.

Heuristic tab

Shows H1–H10 with full definition, 2–3 example violations, and
severity indicators.

7 Dimensions tab

Shows all 7 dimension definitions, detection method, and example
evidence types.

## Search

Filter definitions by keyword in real time.

Context highlight

When a heuristic is selected in the finding row, the guide
auto-scrolls to that entry.

## Dismissible

Can be collapsed to icon-only mode to maximize form space.


## 4.6 Evidence Attachments
Each finding row supports one or more screenshot attachments. Evidence is stored with the
finding and surfaced in the heatmap tooltip and exported report.


## Capability

## Specification

## Upload

Drag-and-drop or file picker. Accepted formats: PNG, JPG, WebP.
Max 5MB per file.

## Annotation

In-app rectangle highlight tool. Draw one or more highlight boxes
over the screenshot to mark the exact UI element with the issue.

Multiple per finding

Up to 3 screenshots per finding row.

Thumbnail preview

Thumbnail shown inline in the findings table. Click to expand full
view.

Report inclusion

Screenshots and annotations are included in the PDF export and
the shareable read-only link.

Heatmap tooltip

Hovering a heatmap cell shows a preview of evidence images for
findings in that cell.



Confidential — v1.0    Page 9

UXOTI TESTING  Product Requirements Document

- Auto-Scoring Engine
The scoring engine is the analytical core of UXOTI Testing. It implements the exact formula logic
from the UX Analysis Kit spreadsheet and removes all manual calculation from the evaluator's
workflow.


## 5.1 Severity Rating Scale
Every finding is assigned a raw severity rating (0–4) during evaluation:

## Rating

## Label

## Definition

## 0

Not a usability problem

No usability impact detected.

## 1

## Cosmetic

Fix only if time permits. Aesthetic issue with no functional
impact.

## 2

## Minor

Low priority. Causes friction but user can complete the
task.

## 3

## Major

Important to fix. Significant friction, workarounds needed.

## 4

## Catastrophe

Must fix immediately. Blocks task completion or causes
data loss.


## 5.2 Severity Score Formula
The raw severity score is calculated from three input dimensions, each rated 1–3:

## Dimension

## Scale

## Frequency

## 1 = Rare  |  2 = Occasional  |  3 = Frequent

## Impact

## 1 = Low  |  2 = Moderate  |  3 = High

## Persistence

## 1 = One-time  |  2 = Sometimes  |  3 = Always


Severity Score  =  Frequency  x  Impact  x  Persistence

Range: 1 (minimum) to 27 (maximum)

## 5.3 Category Classification
The raw Severity Score maps to a category as follows:

## Score Range

## Category

## Action Required

Confidential — v1.0    Page 10

UXOTI TESTING  Product Requirements Document

## 18 – 27

## Critical

Must fix immediately. Blocks core task or causes
data/financial harm.

## 9 – 17

## Major

High priority. Causes significant friction; fix in next
sprint.

## 1 – 8

## Minor

Low priority. Address when capacity allows.



Confidential — v1.0    Page 11

UXOTI TESTING  Product Requirements Document

## 5.4 Journey Zone Multiplier
The Journey Zone Multiplier adjusts the raw Severity Score based on where in the user flow the
issue occurs. Issues in high-traffic, critical-path zones are weighted more heavily than those in
edge cases.


## Journey Zone

## Multiplier

## Rationale

## Entry / Onboarding / Login

x 1.5

All users are affected — first impression critical

Core Task (checkout, transfer,
booking)

x 2.0

Directly tied to conversion — highest business
impact

## Recovery / Error State

x 1.5

User already frustrated — errors compound
quickly

## Secondary Feature

x 1.0

Affects subset of users — standard weight

## Edge Case / Advanced Feature

x 0.5

Only power users affected — deprioritized


Adjusted Score  =  Severity Score  x  Journey Zone Multiplier

The Adjusted Score is used for all visualizations, prioritization, and final report rankings.

## 5.5 Decision Matrix Validation
After the Adjusted Score is calculated, a Decision Matrix checklist validates the category. This
prevents edge cases where a numeric score might under- or over-classify a finding based on
qualitative context.


Critical conditions (any one triggers Critical):
- Task cannot be completed at all
- Causes real-world harm (data loss, incorrect transaction)
- Occurs in core flow AND affects majority of users
- System crash or complete flow blocker
- Heuristic violation at H1, H3, or H5 in a critical journey point

Major conditions (2 or more triggers Major):
- Task completable but requires significant effort or workaround
- User requires more than 2 attempts to proceed
- Repeated confusion on the same flow
- Occurs in core or entry flow
- Clear and consistent heuristic violation
- More than 30% of users likely affected

Confidential — v1.0    Page 12

UXOTI TESTING  Product Requirements Document

The system displays the checklist alongside the score. Evaluator confirms or overrides the
auto-calculated category before finalizing.



Confidential — v1.0    Page 13

UXOTI TESTING  Product Requirements Document

## 6. Visualization Features
## 6.1 Visual Severity Heatmap
A grid visualization automatically generated from all findings and their Journey Zone
assignments. Gives evaluators and stakeholders an instant overview of where the most critical
problems cluster in the user journey.


## Attribute

## Specification

## Axes

## X-axis: Journey Stages (from Journey Map). Y-axis: Issue
Categories (7 dimensions).

Cell color

Gray = no issues. Green = minor only. Amber = major present. Red
= critical present.

Cell value

Number of issues in that stage/category intersection.

## Interaction

Click a cell to expand a list of all findings in that intersection, with
evidence thumbnails.

## Auto-update

Heatmap updates in real time as findings are added or severity
scores change.

## Export

Included in PDF export and shareable read-only link as a static
image.


6.2 Effort vs. Impact Chart
A 2x2 quadrant chart that plots every finding as a dot, using Effort (X-axis) and Impact (Y-axis).
Visually surfaces Quick Wins — high impact, low effort — from the full findings dataset.


## Attribute

## Specification

## X-axis

Effort: Low / Medium / High (from finding input).

## Y-axis

Impact: Low / Medium / High (from finding input).

Dot color

Red = Critical. Orange = Major. Yellow = Minor. Gray = cosmetic.

Dot label

Finding number (#1, #2...). Hover tooltip shows issue description
and heuristic/dimension.

Quadrant labels

## Top-left = Quick Wins. Top-right = Major Projects. Bottom-left =
## Fill-ins. Bottom-right = Thankless.

## Filter

Filter by category (heuristic, business, IA, etc.) to focus the chart.

## Export

Included in PDF and shareable link as a static image.



Confidential — v1.0    Page 14

UXOTI TESTING  Product Requirements Document

## 7. Reporting & Sharing
7.1 PDF Report Export
A professionally formatted PDF export of the full evaluation. Designed for stakeholder
presentations and developer handoff.


Report contents:
- Cover page: project name, app, evaluator, date, platform, scope
- Executive summary: total findings count, breakdown by category (Critical / Major / Minor)
- Journey map overview
- Visual severity heatmap (static image)
- Effort vs. impact chart (static image)
- Full findings table: all issues with severity, category, recommendation, effort, priority, and
evidence thumbnails

- Summary tables: per-heuristic scores (Heuristic path) or per-dimension totals (7D path)
- Quick wins section: top 5 high-impact, low-effort recommendations

7.2 Shareable Read-Only Link
Generates a permanent URL that renders a live, non-editable view of the evaluation report. No
account or login required to view.


## Attribute

## Specification

URL format

uxoti.app/share/[unique-token]

## Contents

Journey map, heatmap, effort/impact chart, full findings table with
evidence.

Access control

Public by default. Evaluator can revoke the link at any time.

## Expiry

No expiry in v1. Future: optional expiry date setting.

## Permissions

View only. No editing, commenting, or downloading from the shared
view.

Auth required

None for viewing. Generating the link requires a logged-in account.



Confidential — v1.0    Page 15

UXOTI TESTING  Product Requirements Document

## 8. Technical Requirements
## 8.1 Architecture Overview
## Layer

## Technology Recommendation

## Frontend

React (component-based SPA). State management via Zustand or
## Redux.

## Backend

Node.js / Express or Next.js API routes.

## Database

PostgreSQL for project/finding data. Object storage
(S3-compatible) for evidence images.

## Auth

JWT-based authentication. bcrypt password hashing. Email via
SendGrid or Resend.

PDF Export

Puppeteer (headless Chrome) or React-PDF for server-side
rendering.

## Hosting

Vercel (frontend + API) or Railway/Render (backend). Cloudflare
## CDN.


## 8.2 Performance Requirements
## Metric

## Target

Page load (initial)

< 2 seconds on 4G connection

Heatmap render

< 300ms after last finding saved

Score calculation

Real-time (< 50ms) on input change

PDF generation

< 10 seconds for full report

Image upload

< 3 seconds for 5MB file

Share link generation

< 1 second


## 8.3 Security Requirements
- All data transmitted over HTTPS (TLS 1.2+)
- Passwords hashed with bcrypt (min 12 rounds)
- JWT tokens expire after 30 days; refresh token rotation on each use
- Evidence images stored in private buckets; served via signed URLs
- Share links use cryptographically random tokens (128-bit entropy)
- Rate limiting on auth endpoints: max 10 attempts per minute per IP
- Input sanitization on all user-provided text fields to prevent XSS


Confidential — v1.0    Page 16

UXOTI TESTING  Product Requirements Document

- Non-Functional Requirements
## Category

## Requirement

## Browser Support

Chrome 110+, Firefox 115+, Safari 16+, Edge 110+. Mobile: iOS
## Safari, Android Chrome.

## Responsiveness

Full functionality on desktop (1280px+). Tablet (768px+) supported.
Mobile view is read-only for complex tables.

## Accessibility

WCAG 2.1 AA compliance. Keyboard navigable. Screen reader
compatible.

## Localization

English in v1. Architecture supports i18n for future Bahasa
Indonesia rollout.

## Data Export

All project data exportable as JSON. Users own their data.

## Uptime

99.5% monthly uptime SLA target.

## Auto-save

All form inputs auto-saved every 5 seconds. No manual save
required.


## 10. Release Milestones
## Phase

## Milestone

## Scope

## Target

## M1

Core scaffold

Auth, project CRUD,
journey map builder

## Week 2

## M2

Evaluation forms

Heuristic + 7D findings
tables, reference guide

## Week 4

## M3

Scoring engine

Full formula engine,
decision matrix, score
display

## Week 6

## M4

## Visualizations

Heatmap + effort/impact
chart, evidence
attachments

## Week 8

## M5

## Reports

PDF export, shareable
read-only link

## Week 10

## M6

Beta launch

QA, performance testing,
accessibility audit, bug
fixes

## Week 12



Confidential — v1.0    Page 17

UXOTI TESTING  Product Requirements Document

- Out of Scope for v1
The following features are explicitly deferred to future versions to keep v1 scope focused:

- Multi-evaluator collaboration on the same project
- Comments and discussion threads on findings
- Team workspaces and organization accounts
- XLSX export (original template format)
- Bahasa Indonesia localization
- Comparison view across two project versions (before/after redesign)
- AI-assisted finding suggestions
- Mobile-optimized evaluation entry
- Public templates library

## 12. Success Metrics
## Metric

Target (3 months post-launch)

## Measurement Method

Registered users

## 500+

User database count

Projects created

## 300+

Project record count

Projects completed

> 40% completion rate

## Status = Completed

PDF exports generated

## > 200

Export event log

Shareable links generated

## > 150

Link generation log

7-day retention

## > 30%

Return login within 7 days

NPS score

## > 40

In-app survey after first export



UXOTI Testing — PRD v1.0

This document is the single source of truth for the v1 product scope. All feature additions or scope changes require
an updated version.

Confidential — v1.0    Page 18