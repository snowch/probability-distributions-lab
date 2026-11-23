# Probability Distributions Lab

[Start the browser course](https://snowch.github.io/probability-distributions-lab/) · [Labs & Courses](https://snowch.github.io/labs/)

A hands-on course in reading, choosing, and checking probability distributions.
It assumes basic probability and includes a short refresher. The 48 core lessons
run through browser controls, and selected investigations include editable Python.

| Unit | What you'll do |
| --- | --- |
| Build a distribution from an experiment | Define trials, count possible outcomes, and compare samples with exact probabilities. |
| Model counts and trials | Choose between Bernoulli, binomial, geometric, hypergeometric, and Poisson models. |
| Read continuous distributions | Read density, cumulative probability, and percentiles and interpret histogram normalization. |
| Explore shapes and choose candidate models | Connect uniform, normal, exponential, gamma, lognormal, and beta models to the process under study. |
| Check a model against data | Fit parameters, inspect a Q–Q plot, compare tail probabilities, and defend a candidate model. |
| Combine uncertain quantities | Explore sums, dependence, conditional distributions, mixtures, and extremes. |
| Understand sampling and simulation | Compare sampling distributions, standard errors, bootstraps, and Monte Carlo precision. |
| Use distributions to make decisions | Work through inventory and staffing examples and export a capstone investigation. |

## Run locally

Use Node.js 22 or newer for tests and Python 3 for the static development server.

```sh
python3 tools/vendor-python.py
npm test
python3 -m http.server 8000 --directory dist
```

Open [localhost:8000](http://localhost:8000). The `dist/` directory is the
source for the buildless site. Lesson copy lives in `dist/course/`. Experiment
modules implement the interactive calculations and `dist/python-examples.js`
contains the editable Python examples.

The build bundles checksum-pinned Pyodide 0.27.7 and every package used by the
examples, including NumPy, SciPy, Matplotlib, pandas and Seaborn 0.13.2. The first
Python run loads these files from this lab in a Web Worker; there is no runtime CDN
or PyPI fallback. Fonts and their OFL notices are bundled in `dist/fonts/`.
Python package licence files remain inside the original wheels; the Pyodide
licence is in `dist/vendor/pyodide/PYODIDE-LICENSE`. The browser experiments work
without starting Python. Progress, Python edits, and the capstone draft are stored in your
browser. The capstone can also be downloaded as Markdown.

The distributions and data are teaching examples. The browser exhibits use
seeded simulation or model probabilities. They include simplifying assumptions
for delivery, inventory, and staffing decisions.
