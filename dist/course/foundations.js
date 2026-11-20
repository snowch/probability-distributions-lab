export const foundations = [
  {
    title: 'Build a distribution from an experiment',
    summary: 'Define a trial, count outcomes, and compare what you observe with what probability predicts.',
    lessons: [
      {
        slug: 'one-trial', title: 'What does one trial produce?', model: 'trial',
        intro: 'A coin toss can give you a yes or no. A ten-toss round gives you a head count. The same coin can answer different questions depending on what you record.',
        idea: 'A random variable assigns a number to each outcome of a specified experiment. In a round of ten tosses, 0 through 10 are possible values of the head count. Each round contributes exactly one value.',
        predict: 'What numbers could you record if one round contains three flips? Which result would count as a single observation?',
        explore: 'Switch between a coin toss, a dice roll, and a round of coin flips. Run each experiment and read the chart’s horizontal axis.',
        answer: 'The experiment determines the possible values. Three flips give counts 0, 1, 2, and 3. The result of the entire round, such as two heads, is one observation.',
        transfer: 'Describe one trial and one random variable for checking whether a bus arrives on time.'
      },
      {
        slug: 'two-dice', title: 'Why do some totals appear more often?', model: 'dice',
        intro: 'Two ordinary dice can give a total anywhere from 2 to 12. Your first task is to explain why some totals are easier to roll.',
        idea: 'The 36 ordered pairs are equally likely when both dice are fair and independent. Multiple pairs can map to the same total. For example, (1, 6) and (6, 1) both give seven.',
        predict: 'Which is more likely, a total of seven or a total of twelve? How many pairs give each?',
        explore: 'Move the target between 7 and 12. Check the matching pairs in the readout, then test your count at other totals.',
        answer: 'Six pairs give seven, so its probability is 6/36. A single pair gives twelve, so its probability is 1/36. Equal probabilities for pairs can produce unequal probabilities for totals.',
        transfer: 'Suppose one die has four sides and the other has six. How would you construct the distribution of their sum?'
      },
      {
        slug: 'probability-mass', title: 'What does a distribution show?', model: 'mass',
        intro: 'Imagine three coin flips and a question about whether you get exactly two heads. A distribution gives that probability alongside every other possible count.',
        idea: 'For a discrete random variable, the probability mass function (PMF) gives the probability at each possible value. Every probability is nonnegative, and all the probabilities sum to one.',
        predict: 'With three fair flips, do you expect exactly two heads and all three heads to be equally likely?',
        explore: 'At 50% and three flips, highlight each possible count. Then introduce a bias and check where the probability moves.',
        answer: 'Exactly two heads can occur in three orders, for a probability of 3/8. Three heads can occur in one order, for 1/8. Changing the bias redistributes the probability mass.',
        transfer: 'Draw a PMF for whether a snack machine accepts a coin when it succeeds 9 times out of 10.'
      },
      {
        slug: 'sample-wobble', title: 'How much does a small sample wobble?', model: 'binomial',
        intro: 'If you repeat the same experiment twice, you will usually get different observed frequencies. Those fluctuations can obscure the shape you are trying to learn.',
        idea: 'Relative frequency is the fraction of observed rounds with a given result. A probability is the model’s prediction for that result. Increasing the number of independent rounds generally reduces sampling noise.',
        predict: 'Which will reproduce the model shape more closely, 20 ten-flip rounds or 2,000?',
        explore: 'Keep the coin and round size fixed. Resample at 20 rounds several times, then repeat at 2,000. Compare both with the model marks.',
        answer: 'Larger samples usually produce bars closer to the model. One small sample can look unusually good, and successive samples need not improve monotonically.',
        transfer: 'Explain why increasing the number of rounds differs from increasing the number of flips within each round.',
        python: 'coin'
      },
      {
        slug: 'build-a-cdf', title: 'Where does the cumulative probability come from?', model: 'discrete-cdf',
        intro: 'Suppose you need a count of at most five heads. You can add the probabilities for counts zero through five, or read the answer directly from a cumulative curve.',
        idea: 'A cumulative distribution function (CDF) gives P(X ≤ x). It never decreases, since higher thresholds include every outcome that lower thresholds did. A discrete CDF jumps at each value with positive probability.',
        predict: 'Does “at most five” include exactly five? For ten fair flips, do you expect the result to be above or below 50%?',
        explore: 'Move the threshold from 4 to 5 and then to 6. Watch the marked point and compare the size of each jump.',
        answer: 'At most five includes five. For ten fair flips the probability is about 62.3%. By symmetry, the probability below five is about 37.7%, and the mass at five is about 24.6%.',
        transfer: 'Use a CDF to express the chance of getting at least six heads.'
      },
      {
        slug: 'biased-coin', title: 'How much evidence would convince you a coin is biased?', model: 'coin-evidence',
        intro: 'Someone flips a coin ten times and gets seven heads. They claim the coin favors heads. How unusual is that result under a fair-coin model?',
        idea: 'To assess unusually high counts, compare the observed count and everything above it under a specified model. To compare fair and biased coins, keep the number of flips and the event definition the same.',
        predict: 'Would seven or more heads in ten flips make you confident the coin is biased?',
        explore: 'Set ten flips, a 70% heads threshold, and a fair coin. Compare the upper-tail chance to the curve for a biased coin. Increase the flip count while keeping the threshold percentage fixed.',
        answer: 'A fair coin produces at least seven heads in ten flips about 17.2% of the time. At least 70 heads in 100 flips is much rarer. A tail probability measures how unusual an outcome is under a model.',
        transfer: 'If you would also suspect a coin that produces very few heads, which additional outcomes should your comparison include?',
        python: 'coin-evidence'
      }
    ]
  },
  {
    title: 'Model counts and trials',
    summary: 'Recognize which experiment produces each common discrete distribution.',
    lessons: [
      {
        slug: 'bernoulli', title: 'Bernoulli · Does one event happen?', model: 'bernoulli',
        intro: 'A parcel either arrives by its deadline or it does not. A single recorded attempt has just two values.',
        idea: 'Code a success as 1 and a failure as 0. If the chance of success is p, the respective probabilities are p and 1 − p. The mean is p because it is the long-run fraction of ones.',
        predict: 'What happens to both bars if the chance of arriving on time rises from 60% to 95%?',
        explore: 'Adjust the success probability. Read the change in each bar and the expected value.',
        answer: 'Probability shifts from zero to one. At 95% success, the mass at one is 0.95, the mass at zero is 0.05, and the average is 0.95.',
        transfer: 'Define a Bernoulli variable for whether a machine part passes inspection.'
      },
      {
        slug: 'binomial', title: 'Binomial · How many succeed out of a fixed number?', model: 'binomial',
        intro: 'An inspector tests ten parts. If every test has the same success probability and the outcomes are independent, the success count has a binomial distribution.',
        idea: 'The parameters n and p give the number of attempts and the chance of success in each. The expected count is n × p. The model includes every possible count from zero through n.',
        predict: 'Where will the center move if the chance of heads in ten flips rises from 50% to 70%?',
        explore: 'Try both probabilities with ten flips per round. Run a large simulation and compare the bars to the exact model.',
        answer: 'The mean moves from five heads to seven, and high counts become more common. Changing p can also make the shape asymmetric.',
        transfer: 'Name a shared cause that could make defect indicators dependent and weaken a binomial model.',
        python: 'coin'
      },
      {
        slug: 'geometric', title: 'Geometric · How many attempts until the first success?', model: 'geometric',
        intro: 'You keep calling until someone answers. Each call has the same independent chance of being answered in this model. The number of calls is the result.',
        idea: 'For the convention used here, the first possible value is one. A first success on attempt k requires k − 1 failures followed by one success. Succeeding by attempt k includes all earlier successes.',
        predict: 'If the success rate per attempt is 20%, which is more likely: a first success on attempt five or a first success by attempt five?',
        explore: 'Set 20% and attempt five. Compare the one highlighted bar with the readout for success by that attempt.',
        answer: 'The probability of a first success on attempt five is about 8.2%. The probability of a first success by then is about 67.2%.',
        transfer: 'Describe a situation where the chance of success changes after every failure.',
        python: 'geometric'
      },
      {
        slug: 'hypergeometric', title: 'Hypergeometric · What changes when you sample without replacement?', model: 'hypergeometric',
        intro: 'A box has 20 parts, four of them faulty. You draw eight parts without putting any back. What does the count of faulty parts look like?',
        idea: 'After each draw, a smaller set remains. Drawing a faulty part reduces the number of faulty parts still available. The hypergeometric distribution accounts for this dependence.',
        predict: 'Can you find five faulty parts? Would a binomial model with a 20% fault probability assign that outcome any mass?',
        explore: 'Compare the probabilities with and without replacement. Increase the sample size until you inspect the whole box.',
        answer: 'Without replacement, the faulty count cannot exceed four. At a full inspection it is exactly four. A binomial model leaves room for counts the finite box cannot produce.',
        transfer: 'When might the binomial approximation be good enough for sampling parts from a finite batch?'
      },
      {
        slug: 'poisson', title: 'Poisson · How many events arrive in a fixed interval?', model: 'poisson',
        intro: 'A support desk needs to plan for the number of chats in the next hour. Four chats per hour is a starting assumption.',
        idea: 'A Poisson model applies when events arrive independently at a constant rate over the interval. Its parameter λ is the expected count for that interval. Under the model, the variance also equals λ.',
        predict: 'What happens to the chance of getting at least eight chats when the mean rises from four to six?',
        explore: 'Keep the busy-hour threshold at eight and move the average arrival count. Read the highlighted tail probability.',
        answer: 'The upper tail becomes larger. Four expected chats gives about a 5.1% chance of at least eight. Six expected chats gives about 25.6%.',
        transfer: 'How could a morning rush violate the constant-rate assumption?',
        python: 'poisson'
      },
      {
        slug: 'choose-count-model', title: 'Investigation · Which model fits the count?', model: 'counts',
        intro: 'You are given four integer-valued questions. To choose a distribution, reconstruct how the outcome was generated.',
        idea: 'A fixed number of independent attempts favors binomial. Sampling a known lot without replacement favors hypergeometric. Waiting for the first success favors geometric. Independent arrivals at a constant rate favor Poisson.',
        predict: 'Match the four scenarios in the control with those four models before revealing the evidence in the chart.',
        explore: 'Select each scenario and compare its possible values with the others. Use the readout to check your selection.',
        answer: 'Ten independent orders give a binomial count, eight parts from a lot give a hypergeometric count, calls to first answer give a geometric count, and tickets per hour give a Poisson count under the stated assumptions.',
        transfer: 'Rewrite the ticket scenario so that the Poisson assumptions no longer fit, and describe what you would check in the data.'
      }
    ]
  }
];
