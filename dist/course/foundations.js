export const foundations = [
  {
    title: 'Build a distribution from an experiment',
    summary: 'Define a trial, count outcomes, and compare what you observe with what probability predicts.',
    lessons: [
      {
        slug: 'one-trial', title: 'What does one trial produce?', model: 'trial',
        intro: 'A coin toss can give you a yes or no. A ten-toss round gives you a head count. The same coin can answer different questions depending on what you record.',
        idea: 'A random variable is the number you record from a trial. One trial is one complete round. For example, if a round has ten flips, the number of heads can be any whole number from 0 to 10. The horizontal axis lists the possible results.',
        predict: 'If one round contains three flips, which head counts are possible? How many counts does that round add to the chart?',
        explore: 'The page starts with 20 rounds of three flips. In One round, choose One coin toss, then One die roll. Read the horizontal axis after each change. Which numbers can one round produce?',
        answer: 'Three flips can give 0, 1, 2, or 3 heads. One round adds one count, such as 2. A single toss gives 0 or 1 heads, and a single die roll gives a face value from 1 to 6.',
        transfer: 'Choose what one bus trial would be. Give a number to record for each trial if your question is whether the bus arrived on time.'
      },
      {
        slug: 'two-dice', title: 'Why do some totals appear more often?', model: 'dice',
        intro: 'Two ordinary dice can give a total anywhere from 2 to 12. Your first task is to explain why some totals are easier to roll.',
        idea: 'If both dice are fair and one roll does not affect the other, the 36 ordered pairs of face values are equally likely. The pair (1, 6) means the first die shows 1 and the second shows 6. Both (1, 6) and (6, 1) contribute to the bar for 7.',
        predict: 'Which is more likely, a total of seven or a total of twelve? How many pairs give each?',
        explore: 'Set Target total to 7, then 12. Count the pairs listed below Matching pairs and compare the probability displayed for each total. How many times as likely is 7 as 12?',
        answer: 'Six pairs give seven, so its probability is 6/36. A single pair gives twelve, so its probability is 1/36. Equal probabilities for pairs can produce unequal probabilities for totals.',
        transfer: 'If one die has four sides and the other has six, how many face-value pairs would you count in total? Which pairs would contribute to a sum of 7?'
      },
      {
        slug: 'probability-mass', title: 'What does a distribution show?', model: 'mass',
        intro: 'Imagine flipping a coin three times. A probability distribution gives the chance of every possible head count.',
        idea: 'The probability mass function (PMF) lists the probability of each whole-number outcome here. Probability mass is the share assigned to one outcome. The shares across all outcomes sum to 1, or 100%.',
        predict: 'With three fair flips, do you expect exactly two heads and all three heads to be equally likely?',
        explore: 'Keep Flips in each round at 3 and Chance of heads per flip at 50%. Set Highlight a head count to 2, then 3. Compare the highlighted bar and the probability shown for each count. Raise the chance of heads to 70% and check which counts gain probability.',
        answer: 'Exactly two heads can occur in three orders, so the chance is 3/8. Three heads can occur in one order, so the chance is 1/8. Raising the chance of heads per flip to 70% makes the higher counts more likely in this example.',
        transfer: 'Draw a PMF for whether a snack machine accepts a coin when it succeeds 9 times out of 10.'
      },
      {
        slug: 'sample-wobble', title: 'How much does a small sample wobble?', model: 'binomial',
        intro: 'If you repeat the same experiment twice, you will usually get different observed frequencies. Those fluctuations can obscure the shape you are trying to learn.',
        idea: 'Relative frequency is the fraction of observed rounds that give a result. In the chart, bars show those fractions and marks show what the model predicts. Largest gap is the biggest distance between a bar and its model mark, measured in percentage points.',
        predict: 'Which will reproduce the model shape more closely, 20 ten-flip rounds or 2,000?',
        explore: 'Keep Flips in each round at 10 and Chance of heads per flip at 50%. Set Sample size to 20 rounds and click New sample three times. Read Largest gap after each click. Repeat with 2,000 rounds. At which sample size do the bars usually come closer to the model marks?',
        answer: 'The 2,000-round samples usually give smaller largest gaps. A single 20-round sample can still agree unusually well with the model. Compare several samples at each size to see the usual pattern.',
        transfer: 'Increasing the sample size gives you more head counts. What changes about the possible head counts if you increase the number of flips per round?',
        python: 'coin'
      },
      {
        slug: 'build-a-cdf', title: 'Where does the cumulative probability come from?', model: 'discrete-cdf',
        intro: 'Suppose you need a count of at most five heads. You can add the probabilities for counts zero through five, or read the answer directly from a cumulative curve.',
        idea: 'A cumulative distribution function (CDF) gives the total probability at or below a threshold. Moving the threshold from 4 to 5 heads adds the probability of exactly 5 heads. As you move to the right, the curve stays level or jumps up.',
        predict: 'Does “at most five” include exactly five? For ten fair flips, do you expect the result to be above or below 50%?',
        explore: 'Keep Chance of heads per flip at 50%. Set At most this many heads to 4 and read At most 4 heads. Move the slider to 5. By how much did the cumulative value rise? Compare that rise with Exactly 5 heads.',
        answer: 'At most five includes five. For ten fair flips the probability is about 62.3%. By symmetry, the probability below five is about 37.7%, and the mass at five is about 24.6%.',
        transfer: 'Use a CDF to express the chance of getting at least six heads.'
      },
      {
        slug: 'biased-coin', title: 'How much evidence would convince you a coin is biased?', model: 'coin-evidence',
        intro: 'A coin lands heads seven times in ten flips. To assess the claim that it favors heads, ask how often a fair coin would produce seven or more heads.',
        idea: 'An upper tail is the set of outcomes at or above the threshold in this experiment. Compare the fair and biased models at the same number of flips and the same threshold to see how much the model changes the chance of a high count.',
        predict: 'Would seven or more heads in ten flips make you confident the coin is biased?',
        explore: 'Set Number of flips to 10, Minimum share of heads to 70%, and Chance of heads for biased coin to 70%. Compare the fair-coin and biased-coin results for at least 7 heads. Then set Number of flips to 100. How does increasing the sample size change the fair-coin result for the same 70% threshold?',
        answer: 'A fair coin gives at least seven heads in ten flips about 17.2% of the time. At least 70 heads in 100 flips is much rarer under the fair model. These results give the chance of a high count assuming a fair coin. Estimating the chance that the coin is fair would require more assumptions.',
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
        idea: 'Record 1 for a success and 0 for a failure. If the chance of success is p, the chance of failure is 1 − p. The expected value is p, the fraction of ones you would approach over many independent attempts.',
        predict: 'What happens to both bars if the chance of arriving on time rises from 60% to 95%?',
        explore: 'Move Chance of success from 60% to 95%. Read Failure, Success, and Expected value. What does the expected value tell you about the fraction of on-time parcels?',
        answer: 'Probability shifts from zero to one. At 95% success, the mass at one is 0.95, the mass at zero is 0.05, and the average is 0.95.',
        transfer: 'Define a Bernoulli variable for whether a machine part passes inspection.'
      },
      {
        slug: 'binomial', title: 'Binomial · How many succeed out of a fixed number?', model: 'binomial',
        intro: 'An inspector tests ten parts. If every test has the same success probability and the outcomes are independent, the success count has a binomial distribution.',
        idea: 'A binomial distribution counts successes in a fixed number of independent attempts, each with the same chance of success. The parameters are n, the number of attempts, and p, the chance of success per attempt. The model’s mean is n × p.',
        predict: 'Where will the center move if the chance of heads in ten flips rises from 50% to 70%?',
        explore: 'Keep Flips in each round at 10 and set Sample size to 2,000 rounds. Change Chance of heads per flip from 50% to 70%. Read Model mean and use the bars and marks to see which counts become more likely.',
        answer: 'The mean moves from five heads to seven, and high counts become more common. Changing p can also make the shape asymmetric.',
        transfer: 'Name a shared cause that could make defect indicators dependent and weaken a binomial model.',
        python: 'coin'
      },
      {
        slug: 'geometric', title: 'Geometric · How many attempts until the first success?', model: 'geometric',
        intro: 'You keep calling until someone answers. Each call has the same independent chance of being answered in this model. The number of calls is the result.',
        idea: 'For the convention used here, the first possible value is one. A first success on attempt k requires k − 1 failures followed by one success. Succeeding by attempt k includes all earlier successes.',
        predict: 'If the success rate per attempt is 20%, which is more likely: a first success on attempt five or a first success by attempt five?',
        explore: 'Set Chance of success to 20% and Attempt to inspect to 5. Compare First success on attempt 5 with Success by attempt 5. Which earlier outcomes are included in the second result?',
        answer: 'The probability of a first success on attempt five is about 8.2%. The probability of a first success by then is about 67.2%.',
        transfer: 'Describe a situation where the chance of success changes after every failure.',
        python: 'geometric'
      },
      {
        slug: 'hypergeometric', title: 'Hypergeometric · What changes when you sample without replacement?', model: 'hypergeometric',
        intro: 'A box has 20 parts, four of them faulty. You draw eight parts without putting any back. What does the count of faulty parts look like?',
        idea: 'With replacement, you return each part to the box before the next draw. Without replacement, a part you draw stays out. A hypergeometric distribution accounts for how those removals change what can happen on the next draw.',
        predict: 'Can you find five faulty parts? Would a binomial model with a 20% fault probability assign that outcome any mass?',
        explore: 'At 8 for Parts inspected out of 20, set Faulty parts to compare to 5. Compare the probabilities for sampling with and without replacement. Then set Parts inspected out of 20 to 20 and Faulty parts to compare to 4. Why is one result now 100%?',
        answer: 'Without replacement, the faulty count cannot exceed four. At a full inspection it is exactly four. A binomial model leaves room for counts the finite box cannot produce.',
        transfer: 'When might the binomial approximation be good enough for sampling parts from a finite batch?'
      },
      {
        slug: 'poisson', title: 'Poisson · How many events arrive in a fixed interval?', model: 'poisson',
        intro: 'A support desk needs to plan for the number of chats in the next hour. Four chats per hour is a starting assumption.',
        idea: 'A Poisson model describes counts when arrivals are independent and the average rate is constant. Its parameter λ is the mean count in the chosen interval. The variance, the average squared distance from the mean, also equals λ in this model.',
        predict: 'What happens to the chance of getting at least eight chats when the mean rises from four to six?',
        explore: 'Keep Minimum chats for a busy hour at 8. Raise Expected chats per hour from 4 to 6 and read At least 8 chats after each change. How much does a busier average hour change the chance of hitting the same threshold?',
        answer: 'The upper tail becomes larger. Four expected chats gives about a 5.1% chance of at least eight. Six expected chats gives about 25.6%.',
        transfer: 'How could a morning rush violate the constant-rate assumption?',
        python: 'poisson'
      },
      {
        slug: 'choose-count-model', title: 'Investigation · Which model fits the count?', model: 'counts',
        intro: 'Four scenarios produce whole-number outcomes. Choose a model by identifying what starts and ends each experiment.',
        idea: 'A fixed number of independent attempts with the same success chance gives a binomial count. Sampling a known group without replacement gives a hypergeometric count. Counting attempts until the first success gives a geometric count if the attempts are independent and have the same success chance. Independent arrivals at a constant rate give a Poisson count over a fixed interval.',
        predict: 'For each option in Scenario, identify what you count and whether the experiment ends after a fixed number, at the first success, or after a fixed time. Use that choice to predict the model before selecting the option.',
        explore: 'Choose each option under Scenario. Read Candidate model, First possible count, and the reason below the chart. Which scenarios can produce zero, and which one starts at one?',
        answer: 'The binomial order count and the hypergeometric sample count can both be zero if there are no matches. The geometric count starts at one because it includes the first successful call. The Poisson ticket count can also be zero if no tickets arrive.',
        transfer: 'Imagine the desk receives more tickets just after opening than around noon. Which assumption in the Poisson scenario changes?'
      }
    ]
  }
];
