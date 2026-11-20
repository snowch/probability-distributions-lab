export const decisions = [
  {
    title: 'Understand sampling and simulation',
    summary: 'Distinguish uncertainty in individual outcomes, data-based estimates, and simulated estimates.',
    lessons: [
      {
        slug: 'distribution-of-averages', title: 'What changes when you average a sample?', model: 'averages',
        intro: 'Individual waits can vary widely. Compare those waits with the averages you would get from repeating the same measurement study.',
        idea: 'A statistic is a summary of a sample, such as its average. A sampling distribution shows the values that statistic could take across repeated samples of the same size. The average wait and an individual wait have the same expected value here, but different spreads.',
        predict: 'Which varies more, one wait time or the average of 12 independent waits?',
        explore: 'Set Observations per sample to 1, then 12. Compare Spread of individual waits and Spread of sample averages. At 12, click New sample to repeat the simulated studies. Is the difference in spread still visible?',
        answer: 'With one observation, its average is the observation itself. With 12 independent observations per average, the averages usually stay closer to 5 minutes than individual waits do.',
        transfer: 'Which distribution would you use to answer a question about an individual customer’s wait?',
        python: 'averages'
      },
      {
        slug: 'central-limit-theorem', title: 'Why do sample averages often look bell-shaped?', model: 'clt',
        intro: 'A single exponential wait is right-skewed. The average of many such independent waits can have a nearly symmetric shape.',
        idea: 'Standardize an average by subtracting its expected value and dividing by its standard error, the spread of repeated averages. The central limit theorem says the shape approaches a standard normal curve as the sample size grows if the observations are independent, come from the same distribution, and have finite, nonzero variance.',
        predict: 'Would a strongly skewed population or a symmetric population produce more visibly skewed averages at a small sample size?',
        explore: 'Set Observations per sample to 4. Switch Population shape between Skewed exponential and Symmetric uniform. In each case, look at how the Simulated averages bars line up with the Standard normal curve. Repeat at 40. At the larger size, how visible is the original skew in the averages?',
        answer: 'Small averages from the exponential population remain more visibly skewed. Both examples approach the normal curve as sample size grows, and extreme-tail agreement may take longer.',
        transfer: 'Why would the theorem not justify saying that individual waits become normal when you collect more of them?',
        python: 'clt'
      },
      {
        slug: 'standard-error', title: 'What does standard error measure?', model: 'se',
        intro: 'If readings from one machine have a standard deviation of 10 units, how variable is the average of n independent readings?',
        idea: 'The standard error is the standard deviation of an estimate across repeated samples. For an average of independent readings from the same population, divide the population standard deviation by the square root of the number of readings.',
        predict: 'What must you do to the sample size to cut the standard error in half?',
        explore: 'Keep Population standard deviation at 10. Set Independent readings to 10, then 40. Read Standard error at each sample size. How big is the second error compared with the first?',
        answer: 'You need four times as many independent readings. Larger population spread increases the standard error at a fixed sample size.',
        transfer: 'Why could averaging repeated readings taken in the same room reduce uncertainty less than this formula predicts?'
      },
      {
        slug: 'bootstrap', title: 'How can you estimate uncertainty by resampling?', model: 'bootstrap',
        intro: 'You have one sample of delivery times and want a sense of how stable its median or high percentile is.',
        idea: 'The page simulates an original set of delivery times. For each bootstrap resample it draws from that set with replacement, so a time can appear more than once. It draws as many times as there were deliveries in the original set and recalculates the chosen statistic.',
        predict: 'Which estimate will change more as you draw different times from the original sample, the median or the 90th percentile?',
        explore: 'Keep Observed deliveries at 25 and use the sample already shown. In Statistic, switch Median to 90th percentile. Compare the width of Middle 90% of bootstrap estimates for the two choices. Then set Observed deliveries to 50 and check whether the interval for the 90th percentile narrows.',
        answer: 'In a small, skewed sample, a high percentile can depend on a few long delivery times. Its estimates often spread over a wider interval. Resampling from the existing deliveries cannot add any deliveries longer than the ones already observed.',
        transfer: 'If deliveries on the same day have related delays, what would you resample as a group instead of drawing one delivery at a time?',
        python: 'bootstrap'
      },
      {
        slug: 'simulation-budget', title: 'How many simulation runs are enough?', model: 'mc',
        intro: 'A simulation can estimate a mean or a rare-event probability. Both estimates fluctuate when you rerun the simulation.',
        idea: 'Monte Carlo standard error measures how much an estimate varies across repeated simulations under the same model. For an event with probability p and n independent runs, it is the square root of p(1 − p)/n. Relative standard error compares this amount with p itself.',
        predict: 'What happens to the numerical error if you quadruple the number of runs? What if you choose an event ten times rarer?',
        explore: 'Choose Event probability in Quantity to estimate and set True event probability to 0.1%. In Runs per estimate, compare 1,000 and 4,000 runs. Read Standard error and Expected hits. Then keep 4,000 runs and reduce the probability to 0.01%. How does Relative standard error change? Choose Average outcome to compare the run budgets for an average.',
        answer: 'Four times as many runs gives half the standard error under the same model. At a fixed budget, a rarer event generally gives fewer expected hits and a larger standard error relative to its probability.',
        transfer: 'Explain how using more simulations differs from collecting more real measurements.',
        python: 'mc'
      },
      {
        slug: 'zero-failures', title: 'Investigation · What does zero observed failures tell you?', model: 'zero',
        intro: 'A part passed every test. Compare what that statement tells you after 20 tests and after 2,000.',
        idea: 'If each of n independent tests has the same failure probability p, the chance of zero failures is (1 − p) raised to n. With zero observed failures, the one-sided 95% upper confidence limit is the value of p for which zero failures would occur in only 5% of repeated sets of n tests.',
        predict: 'Would a genuine 1% failure rate plausibly produce zero failures in 20 tests? What about 2,000?',
        explore: 'Keep Proposed failure rate at 1%. In Independent tests, compare 20 and 2,000. Read Chance of zero failures at proposed rate and 95% upper confidence limit. Which test count gives stronger evidence against a 1% failure rate?',
        answer: 'With a true rate of 1%, a 20-test sample has about an 81.8% chance of zero failures. A 2,000-test sample almost never does. When all 2,000 tests pass, the upper limit is about 0.15%, assuming the tests are independent and have the same failure probability.',
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
        idea: 'Name the outcome in measurable units, then define success. In this example the outcome is delivery time in minutes and a delivery is on time if it arrives by the promised window. The goal is the share of deliveries that must meet that window.',
        predict: 'How would you phrase a requirement that at most one customer in ten experiences a delay?',
        explore: 'Set On-time service goal to 90% and Proposed delivery window to 35 min. Compare On-time probability and Minimum qualifying window. Raise the window in one-minute steps until Service goal says Met. What is the first whole-minute window that qualifies?',
        answer: 'The model’s 90th percentile is about 37.69 minutes, so the first whole-minute promise that meets the 90% goal is 38 minutes.',
        transfer: 'Write a success criterion for a situation where smaller values are undesirable, such as too little available stock.'
      },
      {
        slug: 'inventory', title: 'How much stock should you carry?', model: 'inventory',
        intro: 'You buy stock before seeing demand. Too little stock costs sales and too much leaves unsold units.',
        idea: 'The expected loss is the average shortage and leftover cost over all possible demand counts under the model. The page charges for every unit that falls short and for every unit left over, then weights each total cost by its demand probability.',
        predict: 'If a shortage becomes more expensive and the leftover cost stays fixed, should the cost-minimizing stock level rise or fall?',
        explore: 'Keep Expected demand at 26. At Cost per unit short of 5 credits, read Lowest-loss stock level. Raise the shortage cost to 10 credits, read the new level, and enter it under Units in stock. Compare Stockout risk at your stock level and Expected loss at your stock level for the old and new stock levels while the shortage cost stays at 10 credits.',
        answer: 'At a higher shortage cost, the lowest-loss stock level stays the same or rises. Extra stock reduces stockout risk but can increase leftover costs. Compare losses at the same shortage cost to evaluate alternative stock levels.',
        transfer: 'What data would you need to estimate demand if sales are capped by how much you stocked?',
        python: 'inventory'
      },
      {
        slug: 'staffing', title: 'How many people should you schedule?', model: 'staffing',
        intro: 'You need just enough capacity for an hour of support work. Requests arrive randomly and take different amounts of staff time.',
        idea: 'The page simulates the total staff-minutes required for the requests that arrive in an hour. One staff member provides 60 staff-minutes. The share of simulated hours when work exceeds that capacity estimates workload risk.',
        predict: 'Which affects overload risk more at the initial settings, adding one person or making each request take two minutes longer?',
        explore: 'Keep Expected requests per hour at 16 and use the sample already shown. Set Staff on shift to 3, then 4, with Mean service time at 9 min. Return to 3 staff and raise Mean service time to 11 min. Which change moves Work exceeds available time farther from the starting result?',
        answer: 'With the starting sample, adding one person lowers workload risk by about 18 percentage points. Adding two minutes to mean service time raises it by about 21 points. This comparison covers total work over an hour. Customer response times also depend on when requests arrive and how long they queue.',
        transfer: 'What would you measure in order to promise a response within five minutes?',
        python: 'staffing'
      },
      {
        slug: 'stress-test', title: 'What happens when a plausible assumption changes?', model: 'stress',
        intro: 'A standard and an expedited delivery plan are both plausible. You estimate a delay risk and want to know whether a different tail assumption would change the decision.',
        idea: 'To test how much a recommendation depends on a model assumption, change that assumption while keeping other inputs fixed. Here the expected cost is the fixed charge for the chosen service plus the late penalty multiplied by the chance of being late.',
        predict: 'Can choosing a normal or lognormal curve reverse which delivery option costs less, even when each option’s mean and spread stay fixed?',
        explore: 'Set Delivery deadline to 45 min and Penalty for a late delivery to 40 credits. Switch Assumed shape from Normal to Lognormal. Compare Standard expected cost, Expedited expected cost, and Lower expected cost. Does the recommended delivery option change?',
        answer: 'At those settings, the normal model favors expedited delivery, at 5.19 credits versus 5.43. The lognormal favors standard delivery, at 5.28 credits versus 5.79. The two shapes assign different late probabilities to the same deadline.',
        transfer: 'What delivery-time data would help you choose between the two models and decide whether expedited service is worth its fixed charge?',
        python: 'stress'
      },
      {
        slug: 'build-a-model', title: 'Capstone · Build your own model', model: 'capstone',
        intro: 'Choose a decision from work or daily life, or use the example of choosing standard or expedited delivery.',
        idea: 'Specify what each trial measures, how you judge the two actions, and why your model fits the process. Use the same assumptions when testing both actions so the comparison shows the effect of the decision.',
        predict: 'Which action do you expect to prefer, and what could change your mind?',
        explore: 'Choose A delivery promise in Starting scenario. Set Assumed shape to Normal, Delivery deadline to 45 min, and Penalty for a late delivery to 40 credits. Under Baseline comparison in Your investigation, record both expected costs and Lower expected cost. For inventory, compare Expected loss at your stock level at 26 and 32 units. For staffing, compare Work exceeds available time with 2 and 3 staff.',
        answer: 'Someone reading your draft should be able to identify the outcome and units, the two actions, the settings you used, and the results. The staffing experiment uses the same simulated draws in both capstone lessons.',
        transfer: 'In Your investigation, record one assumption you want to test and one measurement that would make the decision more reliable.',
        python: 'capstone'
      },
      {
        slug: 'defend-a-model', title: 'Capstone · Defend your recommendation', model: 'capstone',
        intro: 'If you entered a draft in the previous capstone lesson, it appears in Your investigation. The experiment controls start at their defaults.',
        idea: 'A useful recommendation names the action and the comparison that supports it. If changing a plausible assumption changes the recommendation, identify the assumption and the value you tested.',
        predict: 'Which of your assumptions is most likely to change the recommendation?',
        explore: 'Use Baseline comparison in Your investigation to restore the settings you tested. For the worked delivery example, keep the deadline at 45 min and penalty at 40 credits, then set Assumed shape to Lognormal. Record both expected costs and Lower expected cost under Sensitivity comparison. State whether you would change your recommendation.',
        answer: 'A defensible recommendation shows the results with the original and changed settings. If the preferred action changes, give both decisions and name the measurement that could help you choose between the models.',
        transfer: 'Click Download draft. In your copy, check that someone new to the problem can find your decision rule, the settings you tested, the results, and the next measurement you would collect.'
      }
    ]
  }
];
