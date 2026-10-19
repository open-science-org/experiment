// Where things live in the repository. Every relative path in configuration is relative to ROOT.
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const CONFIG_DIR = join(ROOT, 'config');
export const EXPERIMENTS_DIR = join(CONFIG_DIR, 'experiments');
export const SPACES_DIR = join(ROOT, 'spaces');
export const RESULTS_DIR = join(ROOT, 'results');
export const REPORTS_DIR = join(ROOT, 'reports');
/** Folders whose changes make a run's code "dirty" in logs and reports. */
export const CODE_PATHS = ['src', 'config', 'worlds', 'vendor', 'package.json'];
