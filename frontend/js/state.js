import { loadStoredState, saveStoredState } from './storage.js';

const documentRequirements = [
  { id: 'problem-statement', name: 'Problem Statement', detail: 'Clearly define the public-service problem', status: 'Missing' },
  { id: 'prototype', name: 'Prototype', detail: 'Add a prototype, demo or walkthrough', status: 'Missing' },
  { id: 'testing-evidence', name: 'Testing Evidence', detail: 'Show quality, performance and reliability results', status: 'Missing' },
  { id: 'solution-overview', name: 'Solution Overview', detail: 'Explain how the solution works and who it serves', status: 'Missing' },
  { id: 'user-journey', name: 'User Journey', detail: 'Show the user experience from need to outcome', status: 'Missing' },
  { id: 'business-model-canvas', name: 'Business Model Canvas', detail: 'Describe value, partners, resources, costs and sustainability', status: 'Missing' }
];

const legacyNames = {
  'problem-statement': ['problem statement'],
  prototype: ['working prototype', 'prototype walkthrough', 'prototype'],
  'testing-evidence': ['testing evidence', 'user-testing evidence', 'pilot summary'],
  'solution-overview': ['solution overview'],
  'user-journey': ['user journey'],
  'business-model-canvas': ['business model canvas']
};

function requiredDocuments(provided = {}) {
  return documentRequirements.map(requirement => ({
    ...requirement,
    ...(provided[requirement.id] || {}),
    id: requirement.id,
    name: requirement.name
  }));
}

function normaliseDocuments(solution) {
  const existing = Array.isArray(solution.documents) ? solution.documents : [];
  solution.documents = documentRequirements.map(requirement => {
    const match = existing.find(item => item.id === requirement.id) || existing.find(item => {
      const name = String(item.name || '').toLowerCase();
      return legacyNames[requirement.id].some(alias => name.includes(alias));
    });
    if (!match) return { ...requirement };
    const provided = match.status !== 'Missing';
    return {
      ...requirement,
      detail: provided ? match.detail : requirement.detail,
      status: provided ? 'Provided' : 'Missing',
      ...(match.fileName ? { fileName: match.fileName } : {})
    };
  });
}

const seedSolutions = [
  {
    id: 'municipal-faults',
    name: 'Municipal fault reporting platform',
    stage: 'Working prototype',
    problem: 'Residents struggle to report water leaks, potholes and electrical faults, while municipal teams lack a shared view of unresolved incidents.',
    description: 'A mobile-friendly reporting platform that captures incident details and location, routes them to the appropriate municipal team and gives residents progress updates.',
    pilot: 'One local municipality, 90 days',
    measure: 'Reduction in average resolution time',
    baseScore: 64,
    matchShift: 0,
    documents: requiredDocuments({ prototype: { detail: 'Demo link added', status: 'Provided' } })
  },
  {
    id: 'meal-stock',
    name: 'School meal stock tracker',
    stage: 'Pilot tested',
    problem: 'School nutrition teams often discover ingredient shortages too late, interrupting meal preparation and reporting.',
    description: 'A simple stock and delivery tracker that flags shortages early and gives district coordinators a shared view of school meal supplies.',
    pilot: 'Ten public schools, one term',
    measure: 'Fewer interrupted meal-service days',
    baseScore: 59,
    matchShift: -8,
    documents: requiredDocuments({ 'testing-evidence': { detail: 'Pilot summary.pdf · 940 KB', status: 'Provided' } })
  },
  {
    id: 'clinic-queue',
    name: 'Clinic queue assistant',
    stage: 'Working prototype',
    problem: 'Patients have little visibility into clinic waiting times, while staff cannot easily anticipate busy periods.',
    description: 'A lightweight check-in and queue visibility tool that helps patients plan their visit and helps clinic teams manage daily demand.',
    pilot: 'Two community clinics, 60 days',
    measure: 'Reduction in average waiting time',
    baseScore: 62,
    matchShift: -4,
    documents: requiredDocuments({ prototype: { detail: 'Prototype walkthrough · Video', status: 'Provided' } })
  }
];

const stored = loadStoredState();
const state = stored || {
  activeSolutionId: seedSolutions[0].id,
  selectedOpportunityId: 'municipal-services',
  solutions: seedSolutions
};

state.solutions.forEach(normaliseDocuments);
if (stored) saveStoredState(state);

const listeners = new Set();

function commit(message = '') {
  saveStoredState(state);
  listeners.forEach(listener => listener(state, message));
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState() { return state; }
export function getCurrentSolution() { return state.solutions.find(item => item.id === state.activeSolutionId) || state.solutions[0]; }

export function selectSolution(id) {
  if (!state.solutions.some(item => item.id === id)) return;
  state.activeSolutionId = id;
  commit('Solution selected');
}

export function addSolution() {
  const id = `solution-${Date.now()}`;
  state.solutions.push({
    id,
    name: 'Untitled solution',
    stage: 'Idea',
    problem: '',
    description: '',
    pilot: 'Not added yet',
    measure: 'Not added yet',
    baseScore: 44,
    matchShift: -14,
    documents: requiredDocuments()
  });
  state.activeSolutionId = id;
  commit('New solution created');
  return id;
}

export function renameSolution(id, name) {
  const solution = state.solutions.find(item => item.id === id);
  const nextName = name.trim();
  if (!solution || !nextName) return false;
  solution.name = nextName;
  commit(`Renamed to ${nextName}`);
  return true;
}

export function deleteSolution(id) {
  if (state.solutions.length === 1) return false;
  const index = state.solutions.findIndex(item => item.id === id);
  if (index < 0) return false;
  const [deleted] = state.solutions.splice(index, 1);
  if (state.activeSolutionId === id) state.activeSolutionId = state.solutions[Math.min(index, state.solutions.length - 1)].id;
  commit(`${deleted.name} deleted`);
  return true;
}

export function addRequiredDocument(requirementId, file) {
  const solution = getCurrentSolution();
  const requirement = solution.documents.find(item => item.id === requirementId);
  if (!requirement || !file) return false;
  const size = file.size >= 1024 * 1024
    ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(file.size / 1024))} KB`;
  requirement.detail = `${file.name} · ${size}`;
  requirement.fileName = file.name;
  requirement.status = 'Provided';
  commit(`${requirement.name} uploaded`);
  return true;
}

export function readinessScore(solution = getCurrentSolution()) {
  const provided = solution.documents.filter(item => item.status !== 'Missing').length;
  return Math.min(92, solution.baseScore + provided * 4);
}
