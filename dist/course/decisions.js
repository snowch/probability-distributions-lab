export const decisions = [
  {
    title: 'Understand sampling and simulation',
    summary: 'Distinguish uncertainty in individual outcomes, data-based estimates, and simulated estimates.',
    lessons: [
      {
        slug: 'distribution-of-averages', title: 'What changes when you average a sample?', model: 'averages',
        intro: 'Individual waits can vary widely. Compare those waits with the averages you would get from repeating the same measurement study.',
        idea: 'A sampling distribution describes a statistic across repeated samples of the same size from a population. One observation and one sample average have different distributions even when they have the same expected value.',
        predict: 'Which varies more, one wait time or the average of 12 independent waits?',
        explore: 'Increase the number of observations per sample. Compare the individual and average distributions while resampling whole studies.',
        answer: 'The averages are more concentrated. As the sample size increases, very high and very low averages become less common.',
        transfer: 'Which distribution would you use to answer a question about an individual customer’s wait?',
        python: 'averages'
      },
      {
        slug: 'central-limit-theorem', title: 'Why do sample averages often look bell-shaped?', model: 'clt',
        intro: 'A single exponential wait is right-skewed. The average of many such independent waits can have a nearly symmetric shape.',
        idea: 'For independent, identically distributed observations with finite, nonzero variance, the standardized mean approaches a normal distribution as the sample size increases. The required sample size for a good approximation depends on the population and the question.',
        predict: 'Would a strongly skewed population or a symmetric population produce more visibly skewed averages at a small sample size?',
        explore: 'Switch between exponential and uniform populations. Increase the sample size and compare standardized averages with a standard normal curve.',
        answer: 'Small averages from the exponential population remain more visibly skewed. Both examples approach the normal curve as sample size grows, and extreme-tail agreement may take longer.',
        transfer: 'Why would the theorem not justify saying that individual waits become normal when you collect more of them?',
        python: 'clt'
      },
      {
        slug: 'standard-error', title: 'What does standard error measure?', model: 'se',
        intro: 'If readings from one machine have a standard deviation of 10 units, how variable is the average of n independent readings?',
        idea: 'Standard error is the standard deviation of an estimator’s sampling distribution. For an independent sample mean, it equals the population standard deviation divided by the square root of the sample size.',
        predict: 'What must you do to the sample size to cut the standard error in half?',
        explore: 'Compare n = 10 and n = 40. Then vary the population spread to see what happens when measurement noise rises.',
        answer: 'You need four times as many independent readings. Larger population spread increases the standard error at a fixed sample size.',
        transfer: 'Why could averaging repeated readings taken in the same room reduce uncertainty less than this formula predicts?'
      },
      {
        slug: 'bootstrap', title: 'How can you estimate uncertainty by resampling?', model: 'bootstrap',
        intro: 'You have one sample of delivery times and want a sense of how stable its median or high percentile is.',
        idea: 'A nonparametric bootstrap samples with replacement from the observed data and recomputes the statistic. Each resample has the original sample size. The resulting distribution approximates sampling variability under the sampling assumptions.',
        predict: 'Which will be more sensitive to which observations are resampled, the median or a high percentile?',
        explore: 'Keep the underlying data fixed while switching the statistic. Change the original sample size and compare the resulting intervals.',
        answer: 'The high percentile is often more sensitive in skewed, small samples. Resampling cannot supply information about times beyond all the values you observed.',
        transfer: 'If delays are correlated within each day, what could you resample together?',
        python: 'bootstrap'
      },
      {
        slug: 'simulation-budget', title: 'How many simulation runs are enough?', model: 'mc',
        intro: 'A simulation can estimate a mean or a rare-event probability. Both estimates fluctuate when you rerun the simulation.',
        idea: 'Monte Carlo standard error describes numerical noise across repeated runs under a fixed model. For an estimated event probability p, its standard error is approximately the square root of p(1−p)/n. Relative error is large when you expect very few events.',
        predict: 'What happens to the numerical error if you quadruple the number of runs? What if you choose an event ten times rarer?',
        explore: 'Switch between estimating a mean and an event probability. Change the run budget, and for the event compare expected hits with the model-based relative standard error.',
        answer: 'Quadrupling the budget halves the standard error. Rarer events usually have a larger relative error at the same budget, even when the absolute error is small.',
        transfer: 'Explain how using more simulations differs from collecting more real measurements.',
        python: 'mc'
      },
      {
        slug: 'zero-failures', title: 'Investigation · What does zero observed failures tell you?', model: 'zero',
        intro: 'A part passed every test. Compare what that statement tells you after 20 tests and after 2,000.',
        idea: 'If the true independent failure rate is p, the probability of observing zero failures in n tests is (1 − p) raised to n. Solving for the rate where this probability is 5% gives the exact one-sided 95% upper confidence limit when zero failures occur.',
        predict: 'Would a genuine 1% failure rate plausibly produce zero failures in 20 tests? What about 2,000?',
        explore: 'Change the test count and mark a proposed failure rate. Compare the probability of no failures and the 95% upper confidence limit.',
        answer: 'A 1% rate can easily produce zero failures in 20 tests, with probability about 81.8%. Under the same assumptions it is extremely unlikely after 2,000 tests. With zero failures in 2,000 tests the one-sided upper limit is about 0.15%.',
        transfer: 'What might make 2,000 tests under the same easy operating condition less informative about real-world risk?',
        python: 'zero'
      }
    ]
  },
  {
    title: 'Use distributions to make decisions',
    summary: 'Connect probability to cost, service targets, and assumptions you can defend.',
    lessons: [
      {
        slug: 'frame-a-decision', title: 'What decision are you trying to make?', model: 'decision',
        intro: 'A team is choosing when to end a delivery window. A longer window makes late deliveries less common and makes the promise less attractive.',
        idea: 'Define the outcome, the threshold, and what makes a result acceptable before choosing a model. A service goal can be expressed as a required probability of meeting the threshold.',
        predict: 'How would you phrase a requirement that at most one customer in ten experiences a delay?',
        explore: 'Change the proposed window and the service goal. Compare the achieved probability with the goal and inspect the implied threshold.',
        answer: 'Require P(delivery time ≤ promised window) to be at least 90%. Under the model the shortest qualifying window is its 90th percentile.',
        transfer: 'Write a success criterion for a situation where smaller values are undesirable, such as too little available stock.'
      },
      {
        slug: 'inventory', title: 'How much stock should you carry?', model: 'inventory',
        intro: 'You buy stock before seeing demand. Too little stock costs sales and too much leaves unsold units.',
        idea: 'A decision depends on both the demand distribution and the costs attached to shortages and leftovers. This simulation uses an integer-valued demand model and compares expected loss at different inventory levels.',
        predict: 'If a shortage becomes more expensive and the leftover cost stays fixed, should the cost-minimizing stock level rise or fall?',
        explore: 'Move stock and compare the current stockout probability and expected loss. Raise the shortage cost and look for the new minimum.',
        answer: 'When shortages become more expensive, carrying at least as much stock becomes preferable. The best stock level is tied to a percentile of demand, and asymmetric costs determine which percentile.',
        transfer: 'What data would you need to estimate demand if sales are capped by how much you stocked?',
        python: 'inventory'
      },
      {
        slug: 'staffing', title: 'How many people should you schedule?', model: 'staffing',
        intro: 'You need just enough capacity for an hour of support work. Requests arrive randomly and take different amounts of staff time.',
        idea: 'Total workload is the sum of random service times for a random number of arrivals. Compare staff-minutes required with staff-minutes available. This simplified capacity check measures workload coverage over an hour.',
        predict: 'Which affects overload risk more at the initial settings, adding one person or making each request take two minutes longer?',
        explore: 'Change staffing, arrivals, and average service time using the same stream of scenario seeds. Compare the estimated probability of more work than capacity.',
        answer: 'More staffing increases capacity and longer service increases required minutes. A workload target is one planning signal. Response times also depend on when requests arrive and how they queue during the hour.',
        transfer: 'What would you measure in order to promise a response within five minutes?',
        python: 'staffing'
      },
      {
        slug: 'stress-test', title: 'What happens when a plausible assumption changes?', model: 'stress',
        intro: 'A standard and an expedited delivery plan are both plausible. You estimate a delay risk and want to know whether a different tail assumption would change the decision.',
        idea: 'Sensitivity analysis varies plausible model assumptions and checks whether a conclusion survives. Here the objective compares an action’s cost with its expected late penalty.',
        predict: 'Could a strong upper tail make expedited delivery worthwhile even when the mean times have not changed?',
        explore: 'Keep the two mean delivery times fixed. Try the normal and lognormal assumptions, then vary the deadline and late penalty. Look for a change in the preferred action.',
        answer: 'An action can become worthwhile when a heavier tail changes the estimated risk difference enough to justify its cost. Whether the preference changes depends on the deadline and costs you specify.',
        transfer: 'What evidence would reduce uncertainty about the tail, and what decision would it help resolve?',
        python: 'stress'
      },
      {
        slug: 'build-a-model', title: 'Capstone · Build your own model', model: 'capstone',
        intro: 'Choose an uncertain decision from work or daily life. You can start with the delivery, inventory, or staffing sandbox and adapt its assumptions.',
        idea: 'Define the outcome and the unit of observation. Choose a distribution based on the process, its possible values, and the data you have. Compare two feasible actions under the same assumptions.',
        predict: 'Which action do you expect to prefer, and what could change your mind?',
        explore: 'Choose a sandbox, record your starting assumptions, and use its controls to compare two actions. If you are using your own scenario, adapt one of the Python examples or enter your analysis in the capstone draft.',
        answer: 'A defensible draft contains a measurable outcome, two action options, plausible assumptions, and a numerical comparison. Keep enough detail that another person could rerun it.',
        transfer: 'Record one limitation and one useful observation you could collect next.',
        python: 'capstone'
      },
      {
        slug: 'defend-a-model', title: 'Capstone · Defend your recommendation', model: 'capstone',
        intro: 'Turn your investigation into a short recommendation. Show the assumptions and evidence a decision maker would need to inspect.',
        idea: 'A good recommendation names the preferred action, the decision criterion, and the conditions that would change the preference. The strongest limitation is usually the one that affects the decision most.',
        predict: 'Which of your assumptions is most likely to change the recommendation?',
        explore: 'Reopen your saved capstone draft. Change that assumption for both actions, record the new results, and explain whether the recommendation survives.',
        answer: 'A complete defense gives results under a baseline and a plausible alternative. If the decision changes, explain where it changes and which missing evidence would help resolve the choice.',
        transfer: 'Export your draft and ask whether someone new to the problem could identify the decision, assumptions, evidence, and next measurement.'
      }
    ]
  }
];
