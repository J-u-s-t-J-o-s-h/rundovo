# Rundovo Stack + Execution Prompt

Use this prompt to keep all future AI outputs aligned to the actual toolchain, constraints, and execution order for Rundovo.

---

## Prompt

You are helping plan and build **Rundovo**, a rental operations SaaS platform.

Use the following stack and execution assumptions as the source of truth unless explicitly overridden.

### Working Brand
- **Product name:** Rundovo
- **Domain:** rundovo.com

### Core Development Stack
- **IDE:** Local-first development using **Cursor** and/or **Antigravity**
- **Version control:** **GitHub**
- **Hosting / deployment:** **Vercel**
- **Frontend framework:** **Next.js + TypeScript**
- **UI system:** **Tailwind CSS + shadcn/ui**
- **Backend:** **Supabase**
- **Primary payments:** **Stripe**
- **Possible later integration:** **Square**
- **Contracts / e-signature:** **DocuSign**
- **File storage for contracts, asset photos, and condition evidence:** **Supabase Storage**

### Why This Stack Is the Default
Use this stack because it is the best-fit path for a fast, modern, customizable, and scalable web app.

- **Next.js** is a maintained React framework for full-stack web apps, and Vercel is its native deployment platform. ([nextjs.org](https://nextjs.org/docs), [vercel.com](https://vercel.com/docs/frameworks/full-stack/nextjs))
- **Supabase** provides Postgres, Auth, Storage, Realtime, and APIs in one platform, which fits a multi-tenant rental system with inventory, orders, contracts, and media evidence. ([supabase.com](https://supabase.com/docs/guides/getting-started/architecture), [supabase.com](https://supabase.com/docs/guides/getting-started/features))
- **Stripe** is the default payment stack for subscriptions and future platform-style billing, while **Stripe Connect** can support platform/connected-account flows later if Rundovo needs to manage money movement for client businesses. ([docs.stripe.com](https://docs.stripe.com/billing/subscriptions/overview), [docs.stripe.com](https://docs.stripe.com/connect))
- **Square** should be treated as a later integration path for storefront/POS-heavy customers, especially because Square supports payment, order, and webhook event flows. ([developer.squareup.com](https://developer.squareup.com/docs/webhooks/overview), [developer.squareup.com](https://developer.squareup.com/reference/square/orders-api/webhooks))
- **DocuSign** is the default contract-signing solution because it supports embedded signing/UI flows inside an application. ([developers.docusign.com](https://developers.docusign.com/docs/esign-rest-api/how-to/embed-ui/), [developers.docusign.com](https://developers.docusign.com/docs/esign-rest-api/how-to/request-signature-focused-view/))
- **shadcn/ui + Tailwind CSS** should be used because they are highly customizable and suited for building an internal design system rather than locking the product into a rigid component library. ([ui.shadcn.com](https://ui.shadcn.com/docs), [tailwindcss.com](https://tailwindcss.com/))

### Product Architecture Assumptions
Rundovo is a multi-tenant rental operations system with both staff-facing and customer-facing workflows.

It must support:
- inventory and availability
- reservations and bookings
- quotes, invoices, and contracts
- payments, deposits, and refunds
- customer management
- before/after rental condition photos
- hosted booking pages
- embeddable live inventory / booking data for client websites
- role-based permissions
- multi-location growth over time

### Data / Embed Assumptions
Treat **Supabase/Postgres** as the system of record.

That means:
- all inventory, bookings, contracts, media, and customer metadata originate in Rundovo
- any embed/widget/API output for client websites must reflect canonical Rundovo data
- embeds should expose only tenant-safe, approved public-facing data
- live inventory or booking status can later be powered through Supabase APIs and/or Realtime patterns when needed. ([supabase.com](https://supabase.com/docs/guides/api), [supabase.com](https://supabase.com/docs/guides/realtime), [supabase.com](https://supabase.com/docs/guides/realtime/authorization))

### Contract / Condition Evidence Assumptions
Contracts and condition evidence are first-class product objects, not random file uploads.

Rundovo must support:
- contract templates
- generated agreements tied to bookings/orders
- signed vs unsigned status tracking
- embedded signing workflow
- signed artifact retention
- before-rental and after-rental condition photo capture
- photo metadata linked to asset, order, timestamp, and uploader
- secure access controls for all files and records. ([developers.docusign.com](https://developers.docusign.com/docs/esign-rest-api/how-to/embedded-sending/), [supabase.com](https://supabase.com/docs/guides/storage))

### GitHub Workflow Assumptions
Use GitHub as the source of truth for:
- repository hosting
- issues
- pull requests
- project tracking
- templates for work intake and change review

GitHub Issues and Projects should be used to break down work and track progress, and pull requests should be used as the standard review gate before merging changes. ([docs.github.com](https://docs.github.com/articles/about-issues), [docs.github.com](https://docs.github.com/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects), [docs.github.com](https://docs.github.com/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests))

### Hard Constraints
- Do not propose a different stack unless there is a strong technical reason.
- Do not introduce unnecessary infrastructure early.
- Do not assume both Stripe and Square must be deeply implemented in V1.
- Do not treat contracts or condition photos as afterthoughts.
- Do not treat embeds as a separate disconnected product; they must reflect Rundovo’s source-of-truth data.
- Do not use the name of any competitor in final deliverables.

### Output Standard
When generating plans, PRDs, architecture, or implementation guidance:
- distinguish what the AI can do vs what the founder must do
- separate build steps into chronological order
- identify blockers and dependencies
- label claims as **[Verified]**, **[Inference]**, or **[Assumption]**
- keep recommendations commercially realistic and technically grounded

---

# Zoomed-Out Tool Breakdown

## Tools You Will Use Directly
- **Cursor / Antigravity** for coding locally
- **GitHub** for repo, issues, PRs, and task tracking
- **Vercel** for deployments, preview environments, and production hosting
- **Supabase** for database, auth, storage, realtime, and APIs
- **Stripe** for SaaS billing first
- **DocuSign** for contract workflows
- **Square** later only if POS/storefront integrations become necessary

## What Each Tool Is Responsible For

### Cursor / Antigravity
Used for:
- generating and editing code
- scaffolding features
- iterating locally
- refactoring
- drafting docs and tests

### GitHub
Used for:
- repo hosting
- issue tracking
- PR-based review workflow
- project management and milestone planning. ([docs.github.com](https://docs.github.com/articles/about-issues), [docs.github.com](https://docs.github.com/pull-requests), [docs.github.com](https://docs.github.com/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects))

### Vercel
Used for:
- deploying the Next.js app
- managing environments
- production and preview deploys
- linking local project to hosted deployment flows. ([vercel.com](https://vercel.com/docs/deployments), [vercel.com](https://vercel.com/docs/frameworks/full-stack/nextjs))

### Next.js
Used for:
- app routing
- frontend UI
- server actions / server-side logic
- rendering strategies for the web app. ([nextjs.org](https://nextjs.org/docs))

### Tailwind CSS + shadcn/ui
Used for:
- design system foundation
- dashboard UI
- forms
- tables
- dialogs
- customizable app components. ([ui.shadcn.com](https://ui.shadcn.com/docs), [ui.shadcn.com](https://ui.shadcn.com/docs/installation/manual))

### Supabase
Used for:
- Postgres database
- auth and tenant access
- file/media storage
- APIs
- realtime updates
- role-aware data access controls. ([supabase.com](https://supabase.com/docs/guides/getting-started/architecture), [supabase.com](https://supabase.com/docs/guides/auth/architecture), [supabase.com](https://supabase.com/docs/guides/storage))

### Stripe
Used for:
- Rundovo subscription billing
- trials/plans
- invoices and recurring payments
- later possible connected-account/platform billing if needed. ([docs.stripe.com](https://docs.stripe.com/billing), [docs.stripe.com](https://docs.stripe.com/billing/subscriptions/build-subscriptions), [docs.stripe.com](https://docs.stripe.com/connect))

### Square
Used later for:
- integrations with customers already using Square
- order/payment syncing
- webhook-triggered updates. ([developer.squareup.com](https://developer.squareup.com/reference/square/webhooks), [developer.squareup.com](https://developer.squareup.com/docs/payments-api/webhooks))

### DocuSign
Used for:
- embedded signing
- contract request flows
- signed/unsigned tracking integrations. ([developers.docusign.com](https://developers.docusign.com/docs/esign-rest-api/how-to/embed-ui/), [developers.docusign.com](https://developers.docusign.com/docs/esign-rest-api/how-to/request-signature-focused-view/))

---

# Chronological Execution Plan

## Phase 0 — Founder Setup and Account Creation
### You
- Buy and secure **rundovo.com**
- Create or organize the GitHub account/org and repo
- Create Vercel account/project
- Create Supabase project
- Create Stripe account
- Create DocuSign developer/business account
- Decide whether Square is postponed for V1
- Secure any required business/legal basics for running a SaaS

### AI
- Draft the repo structure
- Draft setup checklist
- Draft env var checklist
- Draft architecture assumptions
- Draft product scope and MVP recommendations

---

## Phase 1 — Product Definition and System Design
### You
- Approve the stack
- Approve MVP scope
- Decide what is in V1 vs later
- Decide whether contracts are mandatory before item pickup in V1
- Decide whether embedded inventory is in MVP or post-MVP

### AI
- Produce the PRD
- Produce the system architecture doc
- Produce the database/entity model
- Produce the auth/tenant model
- Produce the roadmap and milestone breakdown
- Produce GitHub issue breakdown from the roadmap

---

## Phase 2 — Local Project Bootstrap
### You
- Initialize the local project in Cursor/Antigravity
- Create GitHub repo and push initial code
- Link repo to Vercel
- Configure local dev environment
- Add environment secrets locally and in Vercel/Supabase/Stripe

### AI
- Generate the initial Next.js + TypeScript scaffold
- Generate Tailwind + shadcn/ui setup guidance
- Generate initial file structure
- Generate coding standards, README, and contribution workflow
- Generate `.env.example` and setup docs

---

## Phase 3 — Core Data Layer
### You
- Create the Supabase project and obtain keys
- Run migrations or apply schema
- Configure auth providers/settings
- Create storage buckets
- Add secrets and access settings

### AI
- Design the Postgres schema
- Draft migration files
- Define tables for:
  - tenants
  - users
  - roles
  - customers
  - inventory/assets
  - bookings/orders
  - contracts
  - signatures
  - inspections
  - photos/media
  - locations
  - pricing rules
- Draft RLS policy strategy
- Draft API/data access conventions

---

## Phase 4 — App Shell and Auth
### You
- Test signup/login locally
- Verify tenant isolation
- Verify deployment on Vercel
- Confirm secrets are wired correctly

### AI
- Build auth flows
- Build app shell/navigation
- Build role-aware layout logic
- Build protected routes/pages
- Build tenant context logic
- Build dashboard placeholders

---

## Phase 5 — Inventory and Booking Core
### You
- Test whether the inventory model matches real rental workflows
- Pressure-test booking edge cases
- Decide what availability rules are acceptable for V1

### AI
- Build inventory CRUD
- Build asset/media support
- Build availability engine
- Build booking/quote/order lifecycle
- Build pricing-rule foundation
- Build location support if included in MVP
- Build audit trail basics

---

## Phase 6 — Contracts and Condition Evidence
### You
- Configure DocuSign account/app credentials
- Decide contract template fields and legal review path
- Decide required photo capture points in workflow

### AI
- Build contract objects and statuses
- Build contract management UI
- Build DocuSign integration scaffolding
- Build before/after inspection flows
- Build image upload + metadata capture
- Link contracts and photos to bookings/assets/customers

---

## Phase 7 — Billing and SaaS Monetization
### You
- Set up Stripe products/prices
- Configure billing portal / tax/business settings
- Decide free trial and plan structure

### AI
- Build Stripe subscription flows
- Build plan gating logic
- Build webhook handling guidance
- Build billing/account pages
- Build subscription-aware access control

---

## Phase 8 — Client-Facing Embed / Public Inventory Layer
### You
- Decide whether this is MVP or V1.5
- Decide what public data can be exposed
- Decide whether booking starts inside the embed or links out

### AI
- Design embed architecture
- Build public-safe inventory projection model
- Build embeddable widget/API approach
- Build update/sync model
- Draft client installation instructions

---

## Phase 9 — QA, Hardening, and Launch Prep
### You
- Test critical workflows end-to-end
- Verify contract signing
- Verify condition-photo evidence trails
- Verify billing and account lifecycle
- Verify production environment variables
- Decide launch readiness

### AI
- Generate test plans
- Generate seed/demo data
- Generate bug triage checklist
- Generate release checklist
- Generate incident/risk checklist
- Generate onboarding docs and help copy

---

## Phase 10 — Launch and Early Customer Ops
### You
- Launch production
- Onboard first users
- Gather real workflow feedback
- Handle legal/business/customer conversations AI cannot actually execute for you

### AI
- Draft onboarding docs
- Draft support macros
- Draft release notes
- Draft customer interview scripts
- Draft post-launch improvement backlog

---

# AI Tasks vs Your Tasks

## Best Tasks for AI
- PRD and planning docs
- architecture proposals
- schema design
- migration drafting
- file/folder structure
- component generation
- CRUD/page generation
- API route scaffolding
- integration scaffolding
- test case generation
- README/docs/checklists
- issue breakdowns
- launch checklists

## Tasks You Must Do Yourself
- buy the domain
- create and fund vendor accounts
- verify pricing/plans in third-party tools
- configure real secrets and production credentials
- approve legal/business decisions
- choose contract language and get legal review if needed
- accept platform terms and compliance obligations
- test whether the workflows actually match customer reality
- talk to customers
- decide launch readiness
- handle any trademark/legal clearance steps

## Shared Tasks
- product scope decisions
- schema reviews
- UX refinement
- integration testing
- bug triage
- roadmap tradeoffs

---

# Order of Operations Summary

1. Secure domain and accounts  
2. Finalize stack and MVP scope  
3. Generate PRD and architecture  
4. Bootstrap repo and deployment  
5. Build data model and auth  
6. Build inventory + booking core  
7. Build contracts + condition evidence  
8. Build SaaS billing  
9. Build public/embed layer  
10. Test, harden, launch

---

# Constraints for Future AI Outputs
Whenever you generate plans for Rundovo:
- show **chronological order**
- separate **AI tasks** from **founder tasks**
- call out blockers
- do not over-engineer V1
- treat contracts and condition photos as core workflows
- treat embeds as source-of-truth projections from Rundovo data
- keep Stripe first and Square later unless explicitly changed
- keep Supabase as the default backend unless there is a strong, specific reason not to
