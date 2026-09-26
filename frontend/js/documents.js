import { getCurrentSolution, readinessScore } from './state.js';
import { opportunities } from './opportunities.js';
import { escapeHtml } from './solutions.js';

const requirementGuidance = {
  'problem-statement': [
    'The public-service problem, the people affected and where it occurs.',
    'Evidence that shows the scale or urgency of the problem, such as observations, interviews or service data.',
    'The measurable public outcome the solution should improve.'
  ],
  prototype: [
    'A working prototype, demo link, video walkthrough or clear set of product screens.',
    'The main user flow that shows how the solution addresses the stated problem.',
    'The prototype’s current maturity, known limitations and what still needs to be built.'
  ],
  'testing-evidence': [
    'Who tested the solution, where the test happened and which scenarios were covered.',
    'Results for quality, performance and reliability using clear measures.',
    'Problems found, user feedback received and improvements made after testing.'
  ],
  'solution-overview': [
    'A concise explanation of what the solution does, who it serves and why it is useful.',
    'The core features, information flow and any systems or services it needs to connect to.',
    'How it could be introduced into the public-service environment and operated in practice.'
  ],
  'user-journey': [
    'The primary user or persona and the situation that starts their journey.',
    'Each step and touchpoint from identifying the need to receiving the final outcome.',
    'Pain points, decisions and moments where the solution improves the current experience.'
  ],
  'business-model-canvas': [
    'Value propositions, users or customer segments and the channels used to reach them.',
    'Key partners, activities and resources needed to deliver the solution.',
    'Major costs, possible funding or revenue sources and how the solution remains sustainable.'
  ]
};

export function renderDocuments(listContainer, selectedMatchContainer) {
  const solution = getCurrentSolution();
  listContainer.innerHTML = solution.documents.map(item => {
    const guidanceId = `guidance-${item.id}`;
    const guidance = requirementGuidance[item.id] || [];
    return `
    <div class="document-row">
      <div class="document-row-main">
        <button class="document-toggle" type="button" data-document-toggle aria-expanded="false" aria-controls="${guidanceId}">
          <span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.detail)}</small></span>
          <span class="document-chevron" aria-hidden="true">⌄</span>
        </button>
        <span class="document-actions">
          <span class="status ${item.status === 'Missing' ? 'missing' : ''}">${escapeHtml(item.status)}</span>
          <button class="document-upload" type="button" data-upload-requirement="${escapeHtml(item.id)}">${item.status === 'Missing' ? 'Upload file' : 'Replace file'}</button>
        </span>
      </div>
      <div class="document-guidance" id="${guidanceId}" hidden>
        <strong>What to include</strong>
        <ul>${guidance.map(point => `<li>${escapeHtml(point)}</li>`).join('')}</ul>
      </div>
    </div>`;
  }).join('');
  const opportunity = opportunities[0];
  const score = readinessScore(solution);
  const metrics = [
    ['Problem alignment', Math.min(96, score + 20)],
    ['Solution maturity', Math.min(90, score + 8)],
    ['Evidence of impact', Math.max(30, score - 30)],
    ['Implementation readiness', Math.max(45, score - 6)]
  ];
  selectedMatchContainer.innerHTML = `<span class="overline">Selected match</span><h2>CPSI pathway</h2><p>${escapeHtml(opportunity.title)}</p>${metrics.map(([label, value]) => `<div class="metric"><div class="metric-header"><span>${label}</span><strong>${value}%</strong></div><div class="progress"><span style="width:${value}%"></span></div></div>`).join('')}`;
}
