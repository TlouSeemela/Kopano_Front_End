# Kopano

Kopano is a web-based innovation workspace that helps innovators prepare stronger, evidence-backed solutions and discover public-service problems their solutions may address.

The platform is intentionally not limited to hackathon winners. Any innovator can add a solution, improve its supporting evidence, compare it with published opportunities and prepare a controlled solution profile for review by CPSI or another organisation.

> **Current status:** testable frontend prototype. There is no backend, authentication, database, real file storage, live opportunity ingestion or official CPSI integration yet.

## Contents

1. [Product purpose](#product-purpose)
2. [Product principles](#product-principles)
3. [Current frontend scope](#current-frontend-scope)
4. [Functional requirements](#functional-requirements)
5. [Required solution evidence](#required-solution-evidence)
6. [Frontend architecture](#frontend-architecture)
7. [Application state and persistence](#application-state-and-persistence)
8. [Readiness and opportunity matching](#readiness-and-opportunity-matching)
9. [Design system and responsive behaviour](#design-system-and-responsive-behaviour)
10. [Running the frontend](#running-the-frontend)
11. [Development conventions](#development-conventions)
12. [Testing checklist](#testing-checklist)
13. [Known limitations](#known-limitations)
14. [Future backend requirements](#future-backend-requirements)

## Product purpose

Innovators often have promising solutions but do not know:

- Which public-service problem statements are relevant to their work.
- What evidence an organisation will expect before considering a solution.
- Whether their solution profile is complete enough to share.
- How to package the problem, prototype, testing results, user journey and business case in one place.

Kopano addresses this by providing one workspace in which an innovator can:

1. Maintain multiple solutions.
2. See an at-a-glance readiness assessment for each solution.
3. Review potential opportunity matches from CPSI and other public platforms.
4. Understand which evidence is missing and what each requirement must contain.
5. Upload evidence against the correct requirement.
6. Preview and eventually share a reviewer-facing solution profile.

## Product principles

### Inclusive access

The platform must not require a person to have won a hackathon. A solution can be incomplete and still be added, assessed and improved.

### CPSI is an opportunity source, not a system dependency

Kopano should use publicly available CPSI problem statements and requirements, alongside other legitimate sources. CPSI does not need to adopt or operate Kopano for innovators to prepare their material. Any future ingestion must comply with the source's technical and legal terms.

### Matches are recommendations

A match score indicates possible alignment between a solution and an opportunity. It is not an endorsement, approval or official score from CPSI or any other organisation.

### Evidence should drive readiness

Readiness must be connected to meaningful evidence, not whether a solution won a competition. The production system must verify evidence relevance rather than rewarding arbitrary file uploads.

### Innovators control sharing

Solution information and evidence remain private until the innovator deliberately shares a profile. Production sharing must be scoped, revocable and secure.

## Current frontend scope

The current implementation uses only:

- Semantic HTML5.
- Modular CSS.
- Plain JavaScript ES modules.
- Browser `localStorage` for prototype state.
- Mock opportunity data for demonstration.
- The Inter font family.

No framework, package manager, build system or frontend library is required.

```text
Browser
  │
  ├── index.html                 Page structure and dialogs
  ├── css/*.css                  Design tokens, layout and components
  └── js/app.js                  Event coordination and rendering
        ├── state.js             Solution state and readiness
        ├── storage.js           localStorage adapter
        ├── solutions.js         Sidebar and overview rendering
        ├── opportunities.js     Mock opportunities and match rendering
        ├── documents.js         Required evidence and guidance
        ├── profile.js           Reviewer-facing profile preview
        └── ui.js                Navigation, drawer, dialogs and toasts
```

## Functional requirements

### FR-01: Multiple solutions

- An innovator can maintain more than one solution in the same workspace.
- Solutions are listed in the left sidebar.
- Selecting a solution changes the content shown by Overview, Opportunities, Documents and Solution profile.
- The active solution is clearly highlighted.
- The top bar displays the active solution name.
- Solution stage labels are not displayed in the sidebar.

### FR-02: Add a solution

- **Add solution** is positioned at the bottom of the solution sidebar.
- Adding creates an `Untitled solution` with its own independent evidence list and readiness values.
- The newly created solution becomes active immediately.

### FR-03: Rename and delete a solution

- Every solution has a vertical three-dot options button.
- The menu provides **Rename solution** and **Delete solution**.
- Renaming requires a non-empty name and limits it to 80 characters.
- Deleting requires a confirmation step.
- The final remaining solution cannot be deleted.
- Deleting a solution removes its locally stored prototype information.

### FR-04: Per-solution navigation

The top navigation belongs to the currently selected solution and contains:

- **Overview**
- **Opportunities**
- **Documents**
- **Solution profile**

Changing the selected solution must update all four views.

### FR-05: Overview

The Overview must show:

- The current solution's name.
- A readiness percentage and status label.
- A visual progress indicator.
- The next three evidence requirements and their completion state.
- The strongest mock opportunity matches.
- Shortcuts to the full Opportunities, Documents and Solution profile views.

### FR-06: Opportunities

The Opportunities view must:

- Display potential matches as recommendations, not endorsements.
- Show the opportunity owner, title, description, category and number of requirements.
- Show a potential match percentage for the active solution.
- Provide a route from an opportunity to the Documents view.
- Support future opportunities from CPSI, public-sector bodies and innovation organisations without hard-coding the product to one institution.

The current prototype uses three mock opportunities. Live discovery, scraping, source verification and automated semantic matching are future backend services.

### FR-07: Documents and evidence

- The page contains the six universal evidence requirements defined below.
- There is no generic page-level drop area.
- Every requirement has its own **Upload file** or **Replace file** action.
- A selected file is associated only with that requirement and the active solution.
- Each requirement has an accessible expandable dropdown explaining what to include.
- The dropdown arrow rotates to reflect its expanded state.
- The status is shown as **Missing** or **Provided**.
- The current frontend stores only the selected filename and size, not the file contents.

### FR-08: Solution profile

The Solution profile is a preview of what an external reviewer may eventually see. It includes:

- Solution name and description.
- Public-service problem and approach.
- Potential opportunity alignment.
- Available evidence names.
- Kopano readiness assessment.
- Pilot outline and success measure.

The current share button produces a demonstration URL only. It does not publish the profile or grant external access.

### FR-09: Responsive behaviour

- On wide screens, the solution list remains in a fixed sidebar and the solution navigation remains at the top.
- Below 920 px, the sidebar becomes a hamburger-controlled drawer.
- On smaller screens, the main navigation moves to a fixed bottom bar.
- Multi-column cards collapse into one column when space is limited.
- Document actions remain usable without horizontal scrolling.

### FR-10: Persistence

- The active solution, all solutions, evidence metadata and selected opportunity are saved to `localStorage`.
- Refreshing the browser restores the saved prototype state.
- Stored older document structures are migrated into the six current requirements.

## Required solution evidence

These six requirements apply to every solution, regardless of sector or opportunity.

### 1. Problem Statement

Purpose: clearly establish the public-service need.

The uploaded material should include:

- The problem, the people affected and where it occurs.
- Evidence of scale or urgency, such as observations, interviews or service data.
- The measurable public outcome that the solution should improve.

### 2. Prototype

Purpose: demonstrate that the proposed experience or technology can be understood and tested.

The uploaded material should include:

- A working prototype, demo link, video walkthrough or clear product screens.
- The main user flow showing how the solution addresses the problem.
- Current maturity, known limitations and the work still required.

### 3. Testing Evidence

Purpose: demonstrate quality, performance and reliability.

The uploaded material should include:

- Who tested the solution, where testing happened and which scenarios were covered.
- Measured results for quality, performance and reliability.
- Problems found, feedback received and improvements made after testing.

### 4. Solution Overview

Purpose: give a reviewer a concise but complete understanding of the solution.

The uploaded material should include:

- What the solution does, who it serves and why it is useful.
- Core features, information flow and required integrations.
- How it can be introduced and operated in a public-service environment.

### 5. User Journey

Purpose: show how a person experiences the service from need to outcome.

The uploaded material should include:

- The primary user or persona and the situation that begins the journey.
- Each step and touchpoint from identifying the need to receiving an outcome.
- Pain points, decisions and moments improved by the solution.

### 6. Business Model Canvas

Purpose: show that the solution can be delivered and sustained.

The uploaded material should include:

- Value propositions, user or customer segments and channels.
- Key partners, activities and resources.
- Major costs, potential funding or revenue sources and the sustainability model.

## Frontend architecture

### Folder structure

```text
Kopano/
├── README.md
├── documentation/
│   └── KOPANO-SSDLC.md
└── frontend/
    ├── index.html
    ├── css/
    │   ├── variables.css
    │   ├── base.css
    │   ├── layout.css
    │   ├── components.css
    │   └── responsive.css
    └── js/
        ├── app.js
        ├── state.js
        ├── storage.js
        ├── solutions.js
        ├── opportunities.js
        ├── documents.js
        ├── profile.js
        └── ui.js
```

### HTML responsibilities

`frontend/index.html` provides:

- The persistent sidebar and top navigation.
- Containers for each application view.
- Rename, delete and share dialogs.
- One hidden file input used by the selected requirement.
- Accessibility landmarks, labels and a skip link.

Most repeated cards and solution-specific content are rendered by JavaScript rather than duplicated in the HTML.

### CSS responsibilities

| File | Responsibility |
|---|---|
| `variables.css` | Colours, radii, shadows and sidebar width |
| `base.css` | Reset, typography and global element rules |
| `layout.css` | Page shell, sidebar, top bar and major grids |
| `components.css` | Buttons, cards, requirements, documents, profile and dialogs |
| `responsive.css` | Tablet and mobile breakpoints |

### JavaScript responsibilities

| File | Responsibility |
|---|---|
| `app.js` | Starts the application, listens for UI events and coordinates re-rendering |
| `state.js` | Owns solution data, mutations, migration and prototype readiness calculation |
| `storage.js` | Reads and writes the single localStorage record |
| `solutions.js` | Renders the solution sidebar, overview and next requirements |
| `opportunities.js` | Contains mock opportunity data and renders match cards |
| `documents.js` | Renders the six evidence requirements, dropdown guidance and selected-match metrics |
| `profile.js` | Builds the reviewer-facing profile preview and demonstration link |
| `ui.js` | Handles view navigation, sidebar drawer, dialogs and toast messages |

### Rendering flow

1. `app.js` reads the active solution from `state.js`.
2. It calls each view's rendering function.
3. User actions call a state mutation such as `selectSolution`, `addSolution` or `addRequiredDocument`.
4. The mutation saves the new state and notifies subscribers.
5. `app.js` re-renders the interface and shows a confirmation toast.

Dynamic user-controlled text is passed through `escapeHtml` before it is inserted into HTML templates.

## Application state and persistence

The prototype stores one object under the key:

```text
kopano-frontend-v1
```

The conceptual shape is:

```js
{
  activeSolutionId: 'municipal-faults',
  selectedOpportunityId: 'municipal-services',
  solutions: [
    {
      id: 'municipal-faults',
      name: 'Municipal fault reporting platform',
      problem: '...',
      description: '...',
      pilot: '...',
      measure: '...',
      baseScore: 64,
      matchShift: 0,
      documents: [
        {
          id: 'problem-statement',
          name: 'Problem Statement',
          detail: 'Clearly define the public-service problem',
          status: 'Missing'
        }
      ]
    }
  ]
}
```

Important prototype behaviour:

- Files are not stored. Only filename, calculated size and completion status are saved.
- Browser storage belongs to that browser and device.
- Clearing site data removes the prototype state.
- `localStorage` is not suitable for production identities, confidential evidence or authentication tokens.

## Readiness and opportunity matching

### Prototype readiness

The current frontend calculation is deliberately simple:

```text
readiness = minimum of 92 and (solution base score + 4 × provided document count)
```

Labels are:

- 80 or above: **Submission ready**
- 70–79: **Good foundation**
- Below 70: **Needs attention**

This is demonstration logic, not an official assessment. Production readiness should use versioned criteria, evidence relevance and transparent explanations.

### Prototype opportunity matching

Each mock opportunity has a base match value. A per-solution shift is applied, then the displayed result is constrained to 45–96 percent.

This is not semantic matching. The future matching service must compare the problem statement, users, capabilities, evidence and eligibility requirements and explain why the result was produced.

## Design system and responsive behaviour

The visual theme takes cues from LinkedIn while retaining Kopano's own product structure.

### Core tokens

| Token | Value | Use |
|---|---:|---|
| Brand | `#0a66c2` | Primary actions and links |
| Brand dark | `#004182` | Active and hover states |
| Brand soft | `#e8f3ff` | Selected backgrounds and guidance panels |
| Text | `#191919` | Primary copy |
| Muted | `#666666` | Supporting copy |
| Page background | `#f4f2ee` | Workspace canvas |
| Surface | `#ffffff` | Cards, navigation and dialogs |
| Success | `#057642` | Provided evidence |
| Warning | `#915907` | Missing evidence |

Controls use an 8 px radius, cards use 12 px and larger containers use 16 px. Shadows are intentionally subtle.

### Breakpoints

- `1100px`: overview and document grids become single-column.
- `920px`: sidebar becomes a drawer and navigation moves to the bottom.
- `680px`: cards, profile and document actions stack for mobile.
- `440px`: navigation and current-solution text become more compact.

### Accessibility expectations

- Use semantic buttons for all actions.
- Keep visible keyboard focus styles.
- Maintain `aria-expanded` on expandable controls and the mobile menu.
- Associate dropdown controls with their content using `aria-controls`.
- Preserve the skip link and meaningful navigation labels.
- Do not communicate state using colour alone; statuses include text.
- Maintain a minimum 44 px target height for primary interactive controls.

## Running the frontend

ES modules require the project to be served through HTTP. Do not open `index.html` directly with a `file://` URL.

### Option A: Python

From the project root:

```powershell
python -m http.server 4189 --directory frontend
```

Then open:

```text
http://127.0.0.1:4189/
```

### Option B: Node.js

If a static server is already available:

```powershell
npx serve frontend
```

Open the local address printed by the command.

### Stop the server

Return to the terminal running the server and press `Ctrl+C`.

## Development conventions

### Adding or changing a view

1. Add the semantic view container in `index.html`.
2. Keep repeated content in a dedicated renderer under `frontend/js`.
3. Add navigation through a `data-view` attribute so `ui.js` can control visibility.
4. Put layout rules in `layout.css`, reusable component rules in `components.css` and breakpoint overrides in `responsive.css`.
5. Test every change with at least one existing and one newly created solution.

### Changing required documents

1. Update `documentRequirements` in `state.js`.
2. Add or update the matching guidance in `documents.js`.
3. Add a legacy name mapping in `state.js` when renaming an existing requirement.
4. Confirm that stored solutions migrate without losing existing evidence metadata.
5. Confirm Overview and Solution profile display the updated evidence correctly.

### Adding opportunity data

For the prototype, update the `opportunities` array in `opportunities.js`. Each item needs:

```js
{
  id,
  organisation,
  title,
  description,
  type,
  requirements,
  match
}
```

Do not represent a mock entry as a live or endorsed opportunity.

### Code quality rules

- Keep files focused on one responsibility.
- Use `const` by default and `let` only when reassignment is needed.
- Escape all user-controlled or externally sourced text before HTML insertion.
- Use event delegation for repeated dynamic controls.
- Avoid inline styling except for genuinely data-driven values such as progress width.
- Do not add framework dependencies without a team decision.
- Preserve existing responsive and accessible behaviour.

## Testing checklist

### Solutions

- [ ] Existing solutions render in the sidebar.
- [ ] Selecting a solution updates all four views.
- [ ] Adding a solution creates and selects an independent workspace.
- [ ] Renaming updates the sidebar and current-solution heading.
- [ ] Deleting requires confirmation.
- [ ] The final solution cannot be deleted.
- [ ] A refresh retains the current state.

### Overview and opportunities

- [ ] The readiness percentage matches the active solution's evidence state.
- [ ] The next three requirements show the correct status.
- [ ] Opportunity match values change with the active solution.
- [ ] Review links navigate to Documents.
- [ ] Recommendation and non-endorsement wording remains visible.

### Documents

- [ ] All six universal requirements are present.
- [ ] Each requirement expands and collapses independently.
- [ ] Expanded guidance matches the selected requirement.
- [ ] `aria-expanded` changes with the visual state.
- [ ] Upload opens the file picker for the correct requirement.
- [ ] Selecting a file changes only that requirement to Provided.
- [ ] Replace file updates the saved filename and size.
- [ ] Evidence remains attached to the correct active solution.

### Solution profile

- [ ] The preview reflects the active solution.
- [ ] Only provided evidence names appear.
- [ ] The readiness value matches the Overview.
- [ ] The share dialog clearly states that its link is a demonstration.

### Responsive and accessibility

- [ ] Desktop sidebar remains visible.
- [ ] Hamburger drawer opens and closes below 920 px.
- [ ] Bottom navigation remains usable without covering content.
- [ ] Document rows stack cleanly on narrow screens.
- [ ] All actions are reachable by keyboard.
- [ ] Focus remains visible.
- [ ] No JavaScript errors appear in the browser console.

## Known limitations

The current frontend does **not** provide:

- User accounts, teams, roles or authentication.
- A database or cross-device synchronisation.
- Real document storage, downloads, malware scanning or file previews.
- Real CPSI or third-party opportunity ingestion.
- Automated semantic matching.
- Official scoring or endorsement.
- Reviewer accounts or assessment workflows.
- Secure, externally accessible profile links.
- Notifications, audit logs or version history.
- Production privacy, retention and deletion controls.

These limitations must remain visible during demonstrations so the prototype is not mistaken for a production service.

## Future backend requirements

The root of the repository is intentionally available for a future backend. The frontend modules should eventually call APIs instead of reading mock arrays and `localStorage` directly.

### Required backend capabilities

1. **Identity and teams**
   - Registration, sign-in, recovery and optional multi-factor authentication.
   - Innovator, collaborator, reviewer and administrator roles.
   - Solution-level access control.

2. **Solution management API**
   - Create, read, update, archive and delete solutions.
   - Version important solution fields and evidence changes.
   - Preserve ownership and team permissions.

3. **Evidence service**
   - Direct uploads to private object storage.
   - File type, size and signature validation.
   - Malware scanning and quarantining.
   - Requirement-specific attachment records.
   - Authorised, short-lived download links.

4. **Opportunity ingestion**
   - Approved APIs or feeds where available.
   - Controlled public-page ingestion where legally and technically permitted.
   - Source URL, source owner, publication date and retrieval date.
   - Change detection, deduplication and human verification.

5. **Matching and assessment**
   - Compare the solution profile with opportunity problems, requirements and eligibility.
   - Produce an explainable result rather than only a percentage.
   - Version scoring rules or model versions.
   - Keep Kopano assessments distinct from official organisation decisions.

6. **Secure solution profiles**
   - Explicit evidence selection before sharing.
   - Random, expiring and revocable share links.
   - Optional reviewer verification or passcode.
   - Access history and immediate revocation.

7. **Operations and privacy**
   - Structured audit events and security monitoring.
   - Backups and tested restoration.
   - Data export, correction, retention and deletion workflows.
   - POPIA-aligned privacy controls and notices.

Detailed security requirements are documented in [KOPANO-SSDLC.md](documentation/KOPANO-SSDLC.md).

## Definition of frontend completion

The frontend phase is complete when:

- Every functional requirement above works for multiple independent solutions.
- All six document requirements provide clear guidance and requirement-specific upload actions.
- State persists correctly after refresh without mixing solution data.
- Desktop, tablet and mobile layouts remain usable.
- Keyboard navigation and visible focus work across the application.
- No console errors occur during the test checklist.
- Prototype-only behaviour is clearly labelled.
- The code remains plain, modular HTML, CSS and JavaScript and is ready to connect to backend APIs.

