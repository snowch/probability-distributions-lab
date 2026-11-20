export const modelling = [
  {
    title: 'Check a model against data',
    summary: 'Decide what a model must capture and inspect where candidates disagree with the data.',
    lessons: [
      {
        slug: 'possible-values', title: 'Which values are possible in your scenario?', model: 'support',
        intro: 'Before fitting a nice-looking curve, ask which numbers the process can physically produce.',
        idea: 'A distribution’s support is the set of values where it can place probability. Counts are whole numbers, elapsed time is nonnegative, and fractions are bounded by zero and one. Match the support to the quantity and to the question.',
        predict: 'Which of the candidate models could give negative delivery times or fractions larger than one?',
        explore: 'Choose a data type and a model. Compare the allowable range and the displayed out-of-range probability.',
        answer: 'A normal model can produce negative times and out-of-range fractions. Lognormal values stay positive, and a beta model stays between zero and one. An approximation may still be useful when its impossible outcomes have negligible probability for your purpose.',
        transfer: 'What additional feature would you need to model a delay that is exactly zero in half of all cases?'
      },
      {
        slug: 'same-mean-and-spread', title: 'What can averages hide?', model: 'moments',
        intro: 'Two suppliers quote the same mean and standard deviation for delivery times. You care about late deliveries.',
        idea: 'The mean summarizes center and the standard deviation summarizes spread. Neither specifies the shape. A symmetric model and a right-skewed model can have the same mean and standard deviation and still give different tail probabilities.',
        predict: 'Will both suppliers have the same chance of delivering later than 50 minutes?',
        explore: 'Compare the two curves with mean 30 and standard deviation 10. Move the deadline to find places where their tail probabilities diverge or cross.',
        answer: 'Equal summaries do not determine the tails. For a sufficiently high deadline, the right-skewed lognormal model can put substantially more probability beyond it than the matched normal model.',
        transfer: 'Which additional statistic would you request if missed deliveries dominate the decision?'
      },
      {
        slug: 'fit-parameters', title: 'How do you estimate a model’s parameters?', model: 'fit',
        intro: 'You have a sample of measurements and want to fit a normal model. Another sample from the same process would give slightly different fitted values.',
        idea: 'For a normal model, the fitted mean is the sample average. The maximum-likelihood fit for its standard deviation uses squared deviations divided by n before taking the square root. Parameters describe the population; estimates are calculated from data.',
        predict: 'Would the fitted mean move more from run to run with 20 observations or with 200?',
        explore: 'Resample at both sizes. Compare the fitted curve, fitted mean, and fitted spread against the model that generated the data.',
        answer: 'The smaller sample usually produces more variable estimates. A good fit to one sample does not eliminate uncertainty about the fitted parameters.',
        transfer: 'Suppose your measurements come from one afternoon. What could make a well-fitted model misrepresent the whole week?',
        python: 'fit'
      },
      {
        slug: 'qq-plot', title: 'How can you see where a model misses?', model: 'qq',
        intro: 'A Q–Q plot compares observed quantiles with quantiles predicted by a candidate distribution.',
        idea: 'Points near the identity line indicate agreement. Systematic bends indicate shape differences, and excursions near the ends reveal where the model and sample disagree about extreme values.',
        predict: 'If you fit a normal model to strongly right-skewed data, will the observations in the upper tail tend to be larger or smaller than its predictions?',
        explore: 'Keep the seed fixed. Change the source from symmetric to skewed and inspect the upper-right points. Resample to see how much the pattern varies.',
        answer: 'In the skewed sample, high observed quantiles can exceed the normal model’s predictions. Look for a pattern across points because extreme quantiles can be noisy.',
        transfer: 'If only the upper tail misses, what practical question could still make that model unsuitable?',
        python: 'qq'
      },
      {
        slug: 'scarce-tail-data', title: 'What if you barely observed the tail?', model: 'tail',
        intro: 'Ordinary delivery times can look similar under several plausible models. A very late-delivery promise depends on a part of the curve you have rarely observed.',
        idea: 'Tail estimates can depend strongly on your choice of distribution. A small sample may contain no values above a high threshold even when the underlying probability is positive.',
        predict: 'What happens to agreement between the models as you move the deadline farther into the right tail?',
        explore: 'Increase the deadline. Compare both model tail probabilities with the expected count above that deadline in your chosen sample size.',
        answer: 'At sufficiently high deadlines the normal tail shrinks faster than the matched lognormal tail. When both predict few examples in a sample, the data can offer little leverage for picking between them in that region.',
        transfer: 'What additional observations could help you learn about rare late deliveries?'
      },
      {
        slug: 'delivery-model', title: 'Investigation · Which model would you use for delivery times?', model: 'delivery',
        intro: 'Your team must estimate late deliveries from a synthetic sample. Customers pay attention to misses, so inspect the part of the model that drives the promise.',
        idea: 'Fit both a normal and a lognormal model. Compare their estimates to the observed exceedance rate and consider how plausible each model is for positive, potentially skewed times.',
        predict: 'Which candidate do you expect to predict more misses at a very late deadline?',
        explore: 'Run both fits for the same data. Move the promise from near the center to the upper tail and record how each prediction compares with the sample.',
        answer: 'The candidates may perform similarly near the center. In these skewed data, the lognormal fit often gives a more plausible high tail. Small tail counts leave room for uncertainty even when one fit looks better.',
        transfer: 'Write two sentences explaining your chosen model and one piece of evidence that could change the recommendation.',
        python: 'delivery'
      }
    ]
  },
  {
    title: 'Combine uncertain quantities',
    summary: 'Use sums, shared causes, conditional distributions, mixtures, and extremes to model real processes.',
    lessons: [
      {
        slug: 'add-uncertainty', title: 'What happens when you add uncertain quantities?', model: 'sum',
        intro: 'A journey has several legs. The total time is the sum of the individual times.',
        idea: 'Means add whether the legs are independent or dependent. For independent legs, variances add. With identically distributed independent legs, doubling their number doubles expected time and multiplies the standard deviation by the square root of two.',
        predict: 'If you go from one leg to four independent legs, how do the mean and standard deviation change?',
        explore: 'Compare the simulated totals with one, two, and four legs. Check the predicted mean and standard deviation.',
        answer: 'Four legs multiply the mean by four and the standard deviation by two. The total stays uncertain even as its spread becomes smaller relative to its mean.',
        transfer: 'How would you find the distribution of the average time per leg from the total-time distribution?',
        python: 'sum'
      },
      {
        slug: 'shared-cause', title: 'What happens when you share a cause?', model: 'dependence',
        intro: 'Rain can slow several legs of a trip at once. A model that treats each leg as unrelated can miss unusually long journeys.',
        idea: 'Positive covariance makes the sum more variable. This simulation holds each leg’s marginal distribution fixed and changes only how strongly the legs share a driver.',
        predict: 'If the legs become more positively associated, what happens to the total’s mean and chance of exceeding a far-right deadline?',
        explore: 'Hold the deadline and the marginal distributions fixed. Raise the shared correlation and compare the total spread and deadline risk.',
        answer: 'The mean stays fixed. Positive correlation increases the total spread, which raises the exceedance probability for a deadline above the mean in this model.',
        transfer: 'Give an example of a shared cause that increases risk in a project schedule.',
        python: 'dependence'
      },
      {
        slug: 'conditioning', title: 'What can you learn by conditioning on new information?', model: 'condition',
        intro: 'You planned for a mixture of dry and rainy days. The trip begins and you learn that it is raining.',
        idea: 'A conditional distribution describes outcomes for a specified condition. The all-weather distribution is a weighted mixture of the dry and rainy distributions. Once the weather is known, you can use the corresponding component.',
        predict: 'If the rainy-day trips are typically longer, which distribution would you use to plan today’s journey once you know it is raining?',
        explore: 'Switch between all days, dry days, and rainy days. Change the fraction of rainy days and see which curves respond.',
        answer: 'Use the rainy-day distribution for today. Changing the chance of rain changes the all-days mixture, while the two conditional distributions in this model stay fixed.',
        transfer: 'What could you do if the only information available were a forecast saying “70% chance of rain”?'
      },
      {
        slug: 'mixture', title: 'When does one population contain several groups?', model: 'mixture',
        intro: 'Weekday and weekend orders come from different schedules. Pooling them can produce a peak, a shoulder, or two peaks.',
        idea: 'A mixture samples a group first and a value from that group second. The resulting density is the weighted sum of the group densities. Changing the group weights can change the overall distribution even while neither group changes.',
        predict: 'Will adding more weekend observations always produce a distinct second peak?',
        explore: 'Move the weekend share and the gap between the two group means. Compare the pooled curve with its components.',
        answer: 'Separate peaks require enough separation and weight in both groups. Overlap can leave one main peak or a shoulder.',
        transfer: 'What groups would you check before fitting one waiting-time distribution to pooled help-desk data?',
        python: 'mixture'
      },
      {
        slug: 'extremes', title: 'Why do minimums and maximums matter?', model: 'extremes',
        intro: 'A device can stop when its first component fails. A set of parallel tasks finishes when its last task completes.',
        idea: 'The first failure is a minimum, and the last completion is a maximum. If n times are independent with the same CDF F, the chance that their maximum is at most t is F(t) raised to n.',
        predict: 'As you add parts or tasks, which shifts earlier: the first failure or the last completion?',
        explore: 'Compare the two cumulative curves at a deadline. Raise the number of components and watch how their probabilities separate.',
        answer: 'The minimum shifts earlier and the maximum shifts later. Their behavior differs from that of the average or the sum.',
        transfer: 'Give one system where the first component to succeed matters and one where the last component to finish matters.'
      },
      {
        slug: 'project-deadline', title: 'Investigation · How likely is a project to miss its deadline?', model: 'deadline',
        intro: 'Your project has two workstreams behind a common kickoff. You can run the workstreams sequentially or in parallel.',
        idea: 'Sequential durations add, while the time to finish two parallel workstreams depends on their maximum. Shared disruption can lengthen both workstreams in the same run.',
        predict: 'Which schedule will miss a fixed deadline less often? Could shared disruption still make the safer schedule miss?',
        explore: 'Keep the seed fixed so both schedules see the same simulated tasks. Compare the miss rates and change the chance of disruption.',
        answer: 'In this model the parallel schedule finishes no later in each run. It can still miss, and shared disruption can change the size of the scheduling advantage.',
        transfer: 'What assumption would you revisit if the two streams compete for the same person?',
        python: 'deadline'
      }
    ]
  }
];
