const base = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
const seabornWheel = 'https://files.pythonhosted.org/packages/83/11/00d3c3dfc25ad54e731d91449895a79e4bf2384dc3ac01809010ba88f6d5/seaborn-0.13.2-py3-none-any.whl';
let runtime;
let seabornReady = false;

async function getRuntime() {
  if (runtime) return runtime;
  const { loadPyodide } = await import(base + 'pyodide.mjs');
  runtime = await loadPyodide({ indexURL: base });
  runtime.runPython('import os\nos.environ["MPLBACKEND"] = "Agg"');
  return runtime;
}

async function loadPackages(py, requested, code) {
  await py.loadPackage(['matplotlib', ...requested]);
  if (!seabornReady && (requested.includes('pandas') || /\b(?:from|import)\s+seaborn\b/.test(code))) {
    await py.loadPackage(['micropip', 'pandas']);
    await py.runPythonAsync('import micropip\nawait micropip.install("' + seabornWheel + '")');
    seabornReady = true;
  }
  await py.loadPackagesFromImports(code);
}

self.addEventListener('message', async ({ data }) => {
  const { id, code, packages } = data;
  const status = message => self.postMessage({ id, type: 'status', message });
  const output = [];
  const paths = [];
  let py;
  let namespace;
  try {
    if (!runtime) status('Loading the browser Python runtime…');
    py = await getRuntime();
    status('Preparing Python packages…');
    await loadPackages(py, packages, code);
    status('Running the experiment…');
    py.setStdout({ batched: line => output.push(line) });
    py.setStderr({ batched: line => output.push(line) });
    const dict = py.globals.get('dict');
    try {
      namespace = dict();
    } finally {
      dict.destroy();
    }
    namespace.set('__name__', '__main__');
    py.runPython(
      'import matplotlib.pyplot as plt\n' +
      'plt.close("all")\nplt.rcdefaults()\n',
      { globals: namespace }
    );
    await py.runPythonAsync(code, { globals: namespace });
    const rendered = py.runPython(
      'import matplotlib.pyplot as _lab_plt\n' +
      '_lab_figure_paths = []\n' +
      'for _lab_i, _lab_number in enumerate(_lab_plt.get_fignums()[:4]):\n' +
      '    _lab_path = f"/tmp/lab-{_lab_i}.png"\n' +
      '    _lab_plt.figure(_lab_number).savefig(_lab_path, dpi=115, bbox_inches="tight")\n' +
      '    _lab_figure_paths.append(_lab_path)\n' +
      '_lab_figure_paths',
      { globals: namespace }
    );
    try {
      paths.push(...rendered.toJs());
    } finally {
      rendered.destroy();
    }
    const figures = paths.map(path => py.FS.readFile(path));
    self.postMessage({ id, type: 'result', output: output.join('\n'), figures }, figures.map(figure => figure.buffer));
  } catch (error) {
    self.postMessage({ id, type: 'error', message: [...output, error.message || String(error)].join('\n') });
  } finally {
    if (py) {
      for (const path of paths) py.FS.unlink(path);
      namespace?.destroy();
    }
  }
});
