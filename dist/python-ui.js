let worker;
let pending;
let nextId = 0;

function getWorker() {
  if (worker) return worker;
  const current = new Worker(new URL('./python-worker.js', import.meta.url), { type: 'module' });
  current.addEventListener('message', ({ data }) => {
    if (current !== worker || data.id !== pending?.id) return;
    if (data.type === 'status') {
      pending.status(data.message);
      return;
    }
    const { resolve, reject } = pending;
    pending = undefined;
    if (data.type === 'error') reject(new Error(data.message));
    else resolve(data);
  });
  current.addEventListener('error', event => {
    if (current !== worker) return;
    stopWorker(event.message || 'Python could not start.');
  });
  worker = current;
  return worker;
}

function stopWorker(reason) {
  worker?.terminate();
  worker = undefined;
  pending?.reject(new Error(reason));
  pending = undefined;
}

function run(code, packages, status) {
  return new Promise((resolve, reject) => {
    const current = getWorker();
    const id = ++nextId;
    pending = { id, resolve, reject, status };
    current.postMessage({ id, code, packages });
  });
}

export function mountPython(container, example, storage) {
  const query = selector => container.querySelector(selector);
  const editor = query('#python-code');
  const button = query('#python-run');
  const stop = query('#python-stop');
  const reset = query('#python-reset');
  const status = query('#python-status');
  const output = query('#python-output');
  const figures = query('#python-figures');
  let active = true;
  let running = false;
  const figureUrls = [];
  editor.value = storage.read();
  function report(message) {
    status.hidden = false;
    status.textContent = message;
  }
  function clearResults() {
    output.hidden = true;
    figures.replaceChildren();
    figureUrls.splice(0).forEach(url => URL.revokeObjectURL(url));
  }
  editor.addEventListener('input', () => {
    storage.write(editor.value);
    status.classList.remove('error');
    if (!output.hidden || figures.children.length) {
      clearResults();
      report('Click Run Python to see results for your edits.');
    }
  });
  reset.addEventListener('click', () => {
    editor.value = example.code;
    storage.write(editor.value);
    editor.focus();
    clearResults();
    status.classList.remove('error');
    report('Example restored. Click Run Python to see its results.');
  });
  stop.addEventListener('click', () => stopWorker('Run stopped.'));
  button.addEventListener('click', async () => {
    if (running) return;
    running = true;
    button.disabled = true;
    reset.disabled = true;
    editor.readOnly = true;
    stop.hidden = false;
    clearResults();
    status.classList.remove('error');
    report('Starting Python…');
    try {
      const result = await run(editor.value, example.packages, report);
      if (!active) return;
      output.textContent = result.output;
      output.hidden = !result.output;
      result.figures.forEach((bytes, i) => {
        const img = document.createElement('img');
        const url = URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
        figureUrls.push(url);
        img.src = url;
        img.alt = i === 0 ? example.figure : 'Additional figure from the Python experiment';
        figures.append(img);
      });
      report(result.output || result.figures.length ? 'Run complete.' : 'Run complete. This code produced no text or figures.');
    } catch (error) {
      if (!active) return;
      if (error.message === 'Run stopped.') {
        report('Run stopped. You can edit the code and run it again.');
        return;
      }
      status.classList.add('error');
      report('Python could not finish. See the error below.');
      output.textContent = error.message;
      output.hidden = false;
    } finally {
      if (active) {
        button.disabled = false;
        reset.disabled = false;
        editor.readOnly = false;
        stop.hidden = true;
        running = false;
      }
    }
  });
  return () => {
    active = false;
    clearResults();
    if (running) stopWorker('Lesson changed.');
  };
}
