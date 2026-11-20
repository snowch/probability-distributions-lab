import { countExperiments } from './count-experiments.js';
import { continuousExperiments } from './continuous-experiments.js';
import { modellingExperiments } from './modelling-experiments.js';
import { decisionExperiments } from './decision-experiments.js';

export const experiments = { ...countExperiments, ...continuousExperiments, ...modellingExperiments, ...decisionExperiments };
