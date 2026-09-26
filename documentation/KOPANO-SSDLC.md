# Kopano Secure Software Development Life Cycle (SSDLC)

**Document status:** Working security baseline  
**Applies to:** Kopano web application, future backend services, opportunity-ingestion services, document storage, matching services and shared solution profiles  
**Review cycle:** At every major release, before a pilot, and after any material security incident or architecture change

## Purpose and context

Kopano helps innovators organise multiple solutions, discover public-sector opportunities that may match those solutions, understand what supporting evidence is missing, and create a controlled profile that a reviewer can assess. This makes trust central to the product. Innovators may place unpublished ideas, research, implementation plans, personal information and commercially sensitive documents on the platform. Reviewers must be able to trust that the profile they receive is authentic and that Kopano's readiness and matching results have not been manipulated.

The current frontend is a testable prototype. It stores solution information and document metadata in the user's browser and uses mock opportunity data. It does not yet provide real authentication, server-side document storage, live CPSI integration or externally accessible secure profile links. The controls in this document become release requirements as those capabilities are introduced.

Kopano's security objective is not simply to prevent a breach. It is to preserve five forms of trust:

- An innovator can see and manage only the solutions they are authorised to access.
- Private solution material remains private until the innovator deliberately shares it.
- A reviewer sees only the material selected for the shared profile.
- Opportunity information, match explanations and readiness results retain their source and integrity.
- Important actions can be investigated without exposing sensitive document content in logs.

## Security roles and ownership

- **Product owner:** decides what information Kopano needs and ensures the platform does not collect data merely because it might be useful later.
- **Engineering lead:** owns secure architecture, technical controls and remediation work.
- **Security reviewer:** challenges the design, reviews material changes and approves security release gates.
- **Privacy owner:** maintains the data inventory, lawful-processing basis, retention rules and data-subject procedures.
- **Operations owner:** manages environments, secrets, monitoring, backups and incident response.
- **Feature owner:** provides security acceptance criteria and evidence for the feature being released.

No developer may approve their own high-risk security exception. Exceptions must identify the risk, affected data, compensating control, accountable owner and expiry date.

---

## Security Requirements (Risk Assessment)

Security requirements are defined from how Kopano works, the sensitivity of its information and the harm that could follow misuse.

### Information handled by Kopano

| Information | Examples in Kopano | Classification | Required treatment |
|---|---|---|---|
| Account and team information | Name, email address, organisation, role and team membership | Personal / confidential | Collect only what is needed; encrypt in transit and at rest; restrict by role |
| Solution information | Problem statement, description, user journey, architecture and business model | Confidential; potentially intellectual property | Private by default; solution-level authorisation; full access history |
| Evidence documents | Pilot reports, testing evidence, policies, spreadsheets, images and videos | Confidential; may contain personal or special personal information | Private object storage; malware scanning; explicit sharing; retention controls |
| Public opportunities | Problem statements obtained from CPSI and other public platforms | Public but externally sourced | Preserve source, retrieval date and original link; treat imported content as untrusted |
| Match and readiness information | Match percentage, requirement gaps and explanations | Derived / sensitive business information | Reproducible calculation; versioned rules; clearly labelled as a Kopano assessment |
| Shared profile data | Selected solution details and approved evidence | Controlled external disclosure | Revocable, time-limited access; no access to unselected documents |
| Security and audit records | Sign-ins, failed access, sharing, deletion and administrative actions | Restricted | Tamper-resistant storage; limited access; no document bodies or unnecessary personal data |

### Core security requirements

1. **Identity and session security**
   - Every innovator, team member, reviewer and administrator must use an individual identity.
   - Passwords, if Kopano manages them, must be hashed with an approved adaptive algorithm. Multi-factor authentication must be available and required for administrators.
   - Production sessions must use secure, HTTP-only and SameSite cookies. Authentication tokens must not be stored in `localStorage`.
   - Session expiry, logout, password reset and account-recovery flows must invalidate affected sessions.

2. **Solution-level access control**
   - Every request for a solution, document, match, score or shared profile must be authorised on the server. Hiding a control in the browser is not authorisation.
   - Team access must follow least privilege: owner, editor and viewer permissions must be explicit.
   - Changing an identifier in a URL or API request must never expose another innovator's solution.
   - Deleting a solution or changing team access must require recent authentication or a clear confirmation step and must create an audit event.

3. **Evidence-document protection**
   - Uploaded files must be private by default and stored outside the public web root.
   - Kopano must validate file size, extension, MIME type and file signature; rename stored objects with generated identifiers; and scan uploads for malware before making them available.
   - Active content must not execute in Kopano's origin. Risky formats must be downloaded safely or displayed through an isolated preview service.
   - Download links must be short-lived and authorised for the requesting user or shared-profile scope.

4. **Safe opportunity ingestion**
   - External opportunity pages are untrusted even when they come from a known public body.
   - The ingestion service must use an approved source allow-list, strict timeouts, response-size limits and blocked private-network address ranges to prevent server-side request forgery.
   - Imported HTML, scripts and instructions must never be rendered or executed directly. Kopano stores sanitised text plus source URL, source organisation and retrieval date.
   - If AI-assisted extraction or matching is introduced, scraped text must be treated as data rather than instructions. It must not gain access to secrets, private solution documents or unrestricted tools.

5. **Matching and readiness integrity**
   - Match scores must be explainable in terms that an innovator and reviewer can understand.
   - Scoring rules, requirement sets and model versions must be versioned so a previous result can be reconstructed.
   - CPSI or another opportunity owner must never be presented as having endorsed a Kopano score unless that organisation has explicitly done so.
   - Users must not be able to raise a readiness score merely by uploading arbitrary files; evidence type, relevance and review status must be considered.

6. **Privacy and controlled sharing**
   - A profile must remain private until the innovator deliberately creates a share link.
   - Before sharing, Kopano must show exactly which profile fields and documents the reviewer will receive.
   - Share links must use cryptographically random tokens, store only a hash of the token, support expiry and revocation, and avoid predictable solution identifiers.
   - Search engines must not index private shared profiles. Revoked or expired links must stop working immediately.
   - Kopano must provide retention, export, correction and deletion processes appropriate to POPIA and the platform's contractual obligations.

7. **Platform and operational security**
   - All production traffic must use TLS. Production data must be encrypted at rest, including databases, object storage and backups.
   - Development, test and production environments must be separated. Production information must not be copied into development environments unless it has been properly anonymised.
   - Secrets must be kept in managed secret storage, never in JavaScript, source control, screenshots, logs or shared documents.
   - Administrative access must use least-privilege roles and must be logged.
   - Backups must be encrypted, access-controlled and tested through scheduled restoration exercises.

### Product-specific risk register

| Risk scenario | Likely harm | Required control | Release evidence |
|---|---|---|---|
| An attacker accesses another innovator's solution by changing an ID | Intellectual-property and privacy breach | Server-side object-level authorisation on every request | Automated cross-account access tests |
| A malicious or infected document is uploaded | Malware delivery or compromise of reviewers | Type/signature validation, malware scanning, isolated preview and safe download headers | Upload-security test report |
| A share link is guessed, forwarded or retained indefinitely | Unauthorised external disclosure | High-entropy hashed token, expiry, revocation and access logging | Share-link design and abuse tests |
| Scraped content contains scripts, false markup or malicious instructions | Cross-site scripting, poisoned matching or AI prompt injection | Allow-listed fetcher, text extraction, sanitisation and strict separation from private data/tools | Ingestion and adversarial-content tests |
| A user manipulates document metadata to increase readiness | Misleading assessment presented to a reviewer | Server-calculated scores, evidence validation and scoring-rule versioning | Score integrity tests and rule documentation |
| Object storage or backups are accidentally made public | Bulk evidence-document exposure | Private-by-default buckets, blocked public access, encryption and configuration monitoring | Infrastructure configuration review |
| An administrator misuses broad access | Insider disclosure or undetected alteration | Role separation, just-in-time access where possible and tamper-resistant audit logs | Privileged-access review |
| Excessive uploads, scraping or matching jobs exhaust resources | Service interruption and unexpected cost | Quotas, rate limits, file-size limits, job queues and cost alerts | Load and abuse test results |
| Third-party or open-source code is compromised | Application or data compromise | Dependency pinning, software-composition analysis and rapid patch process | Dependency and SBOM report |
| Sensitive content appears in logs or analytics | Secondary privacy breach | Structured logging with redaction and an approved event schema | Log-sampling review |

Risk assessment begins during discovery and is updated whenever Kopano adds a new data type, external source, integration, user role or sharing method.

---

## Threat Modelling & Design Review

Threat modelling takes place before a feature is approved for development. The review starts with the actual Kopano journey rather than an abstract checklist.

### Primary trust boundaries

1. **Innovator browser to Kopano API:** solution details, account actions and document metadata cross an untrusted network.
2. **Kopano API to database and document storage:** the application translates a user's permissions into access to private records and files.
3. **Opportunity-ingestion worker to external public platforms:** Kopano retrieves content it does not control.
4. **Matching service to solution and opportunity records:** private innovator information is compared with public problem statements.
5. **Public reviewer to shared-profile service:** an unauthenticated or lightly authenticated person receives deliberately limited information.
6. **Administrator to operational systems:** privileged access can affect every solution and must be more strongly controlled.

### STRIDE review for Kopano

- **Spoofing:** Could someone impersonate an innovator, reviewer or administrator? Review authentication, recovery, invitation and shared-link token design.
- **Tampering:** Could someone alter a solution, replace evidence, change an opportunity source or manipulate a score? Review integrity checks, audit history and server-side calculations.
- **Repudiation:** Could a user deny sharing a profile, removing evidence or deleting a solution? Record the actor, action, target, outcome and time without logging document content.
- **Information disclosure:** Could private evidence be exposed through predictable URLs, browser storage, search indexing, analytics, error messages or backups? Trace every copy of the data.
- **Denial of service:** Could large uploads, repeated matching, automated scraping or expensive document processing make Kopano unavailable? Define quotas, queues, rate limits and graceful failure.
- **Elevation of privilege:** Could a viewer become an editor, a solution owner access another workspace, or an ingestion worker reach administrative services? Enforce roles at every service boundary.

### Design-review questions

Every new feature must answer:

- What Kopano information does it read, create, change, share or delete?
- Who is allowed to perform each action, and where is that decision enforced?
- Does the feature make previously private information visible to a reviewer or third party?
- What happens if imported content, a filename, a solution description or a profile field is malicious?
- How can the action be reversed or investigated?
- What is the safe failure state if CPSI, another external source, storage or matching is unavailable?
- What information must be retained, and when must it be deleted?
- Does the change alter the meaning of a match or readiness score?

### Required design artefacts

High-risk features—authentication, uploads, opportunity ingestion, matching, external sharing and administration—require a lightweight data-flow diagram, updated risk register, privacy review, abuse cases and security acceptance criteria. A material design change cannot move into development until an independent reviewer has resolved or formally accepted its high-risk findings.

---

## Development (Secure coding practices)

Secure development turns the design decisions above into repeatable engineering behaviour.

### General engineering controls

- All changes are made through version control and reviewed by another developer.
- Security-sensitive changes include tests for the failure and abuse paths, not only the successful journey.
- Automated checks include secret detection, static analysis, dependency scanning and vulnerable-package alerts.
- Dependencies are kept minimal, pinned through a lockfile where applicable and updated through a controlled process.
- Production configuration is separate from source code. Debug modes and verbose errors are disabled in production.

### Frontend practices

- Treat solution names, descriptions, filenames, opportunity text and reviewer-visible content as untrusted.
- Prefer safe DOM APIs. Where HTML templates are used, every dynamic value must be contextually encoded before insertion.
- Use a restrictive Content Security Policy and avoid inline scripts when the application is deployed.
- Do not place credentials, private document content, production tokens or security decisions in browser storage.
- The current prototype's `localStorage` is acceptable only for mock, device-local demonstration data. It must not become the production store for accounts, real evidence or access tokens.
- Do not reveal whether an unauthorised solution or document exists through different error messages.

### Backend and API practices

- Validate every request against an explicit schema and reject unexpected fields.
- Use parameterised database queries and an established data-access layer.
- Authorise access after authentication and before every read, update, delete, download or score calculation.
- Use generated identifiers, but never treat an unguessable identifier as permission.
- Apply CSRF protection where cookie-based sessions can trigger state-changing requests.
- Rate-limit authentication, invitations, sharing, uploads, matching and ingestion endpoints.
- Return generic client errors while preserving a correlation identifier for investigation.

### File-handling practices

- Upload to quarantine first; validate, scan and classify before moving a file into private evidence storage.
- Enforce per-file and per-solution storage limits.
- Store the original filename as metadata only; never use it as the storage path.
- Set safe download headers, including an explicit content type and `Content-Disposition` where appropriate.
- Remove embedded metadata when previews do not require it, especially location and author information in images or office documents.

### Ingestion and matching practices

- Fetch only approved schemes and hosts, resolve addresses safely and block loopback, link-local and private-network destinations.
- Keep raw retrieval separate from sanitised opportunity records.
- Record source attribution and prevent a scraped update from silently overwriting a manually verified record.
- Keep private solution content out of third-party model or analytics providers unless a documented agreement and user-facing disclosure permit it.
- Match explanations must reference the solution attributes and opportunity requirements that influenced the result.

### Secrets, logging and privacy

- Use managed secrets and short-lived service credentials.
- Log security-relevant events, not document bodies, passwords, tokens or complete personal records.
- Redact sensitive request fields before errors or telemetry leave the application.
- Use synthetic data for local development and automated tests.
- New personal information fields require a stated purpose, retention period and access rule before implementation.

---

## Security Testing

Security testing follows Kopano's highest-risk journeys and is part of delivery rather than a final activity added after development.

### Automated testing on every change

- Unit tests for permission rules, score calculations, token expiry and input validation.
- Integration tests covering account boundaries, team roles, document access and shared-profile scope.
- Static application security testing and secret scanning.
- Software-composition analysis for vulnerable dependencies and generation of a software bill of materials for releases.
- Infrastructure and configuration scanning when deployment configuration is introduced.

### Feature-focused security tests

**Accounts and solution isolation**

- Attempt to read, edit, delete or share a solution belonging to another account.
- Test expired sessions, revoked invitations, removed team members and changed roles.
- Test brute-force protection and account-recovery abuse.

**Evidence uploads**

- Test double extensions, incorrect MIME types, oversized files, archive bombs, malicious office files and files containing active HTML or scripts.
- Confirm that unscanned files cannot be downloaded and that storage paths cannot be traversed.
- Confirm that one profile cannot reference another solution's document identifier.

**Shared profiles**

- Test token guessing, expiry, revocation, reuse, search indexing and access after the source document is removed.
- Confirm that the shared page exposes only explicitly selected fields and evidence.
- Confirm that browser caches and referrer headers do not leak the share token unnecessarily.

**Opportunity ingestion and matching**

- Test redirects, private IP addresses, malformed pages, hostile HTML, script payloads, extreme document sizes and deliberately misleading content.
- If AI is used, test prompt-injection attempts that request secrets, private solution data, tool execution or changes to scoring rules.
- Verify that score results are reproducible for a recorded rule or model version and remain labelled as Kopano assessments.

**Platform resilience**

- Test upload, API, ingestion and matching rate limits.
- Test dependency failure, storage unavailability and interrupted processing without corrupting solution records.
- Perform backup restoration and verify both data integrity and access controls after restoration.

### Manual assurance

- Conduct a security design review for every high-risk feature.
- Conduct an independent penetration test before the first real public-sector pilot and after significant authentication, sharing, upload or architecture changes.
- Perform privacy and access-control reviews using realistic user journeys: innovator, team member, external reviewer and administrator.
- Review a sample of production-like logs to confirm that sensitive content is not being captured.

### Release thresholds

- No open Critical or High severity issue may enter production.
- Medium issues require an accountable owner, remediation date and documented interim control.
- Fixed findings must be retested.
- Security tests must run against the build and configuration intended for release, not only a developer's local environment.

---

## Assessment & Secure Integration

This phase determines whether a completed Kopano change is safe to combine with the rest of the platform and safe to place in front of innovators or reviewers.

### Secure integration review

Before integration, the feature owner provides:

- Approved security and privacy requirements.
- Resolved threat-model findings.
- Code-review and automated-test results.
- Dependency and secret-scan results.
- Evidence that access control was tested across different accounts and solutions.
- Updated data inventory, retention rule and incident-response notes where applicable.
- Rollback instructions and monitoring signals.

### Integration-specific requirements

**CPSI and other opportunity sources**

- Prefer an authorised API, feed or documented integration when one is available.
- Where public-page ingestion is used, follow the source's legal and technical terms, retrieve only necessary public information and preserve attribution.
- A failed or changed source must not silently produce an apparently authoritative match.
- CPSI branding or opportunity content must not imply that CPSI has endorsed Kopano or its score.

**Storage and document services**

- Object storage must block public access by default and use separate service permissions for upload scanning, application access and backup.
- The database stores ownership and sharing policy; the object store must not become an alternative authorisation system.
- Deletion must cover the active record, stored object, generated previews and scheduled backup-expiry process.

**Identity and communication services**

- Identity, email and notification providers must undergo supplier and privacy review.
- Callback URLs, redirect URLs and webhook signatures must be allow-listed and validated.
- Email messages must not attach private evidence or expose full share tokens in analytics links.

**Analytics and monitoring**

- Product analytics must avoid solution text, filenames, document content and share tokens.
- Security monitoring should detect unusual sign-ins, repeated denied access, bulk downloads, upload abuse, unexpected administrative actions and ingestion failures.

### Pilot readiness assessment

Before Kopano handles real innovator documents in a pilot, the release decision must confirm:

- Authentication and solution isolation are operating in the backend.
- Uploaded files are stored privately, scanned and accessed through authorised short-lived links.
- Sharing is explicit, scoped, expiring and revocable.
- Opportunity sources and match calculations are traceable.
- Privacy notices, consent where required, retention and deletion processes are ready.
- Monitoring, incident response, backups and recovery have been tested.
- A named team can receive and respond to security reports during the pilot.

The pilot should begin with the minimum data and smallest user group needed to validate the service. Expansion follows evidence that controls work under real operating conditions.

### Production approval and continued assurance

The product owner, engineering lead, security reviewer and privacy owner jointly make the go/no-go decision for a high-risk release. Approval records the version, environment, known residual risks and responsible owners.

After release, Kopano continues to review access, vulnerabilities, dependencies, unusual activity, expired shared profiles, retention jobs and security incidents. Findings feed back into the risk assessment and the next design review. The SSDLC is therefore a continuous part of how Kopano grows—not a document produced once for an application and then forgotten.

