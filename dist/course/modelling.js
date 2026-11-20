export const modelling = [
  {
    title: 'Check a model against data',
    summary: 'Decide what a model must capture and inspect where candidates disagree with the data.',
    lessons: [
      {
        slug: 'possible-values', title: 'Which values are possible in your scenario?', model: 'support',
        intro: 'A candidate model can assign probability to values your quantity cannot take. For example, a normal curve for elapsed time can extend below zero.',
        idea: 'A distribution’s support is the set of outcomes it allows. A time can be positive or zero, a fraction stays between 0 and 1, and a signed measurement error can be positive or negative.',
        predict: 'Which of the candidate models could give negative delivery times or fractions larger than one?',
        explore: 'Set Quantity to Fraction between 0 and 1. In Candidate model, try Normal, Lognormal, and Beta. Compare Values the model allows and Probability outside bounds. Which model stays within both bounds?',
        answer: 'The normal can give values below 0 and above 1. The lognormal removes the negative values but still allows values above 1. The beta model stays within the bounds. If a model gives impossible values negligible probability, it can still be useful for a particular calculation.',
        transfer: 'Suppose half of all deliveries have exactly zero delay. Why would you need a model that gives the single value zero a positive probability?'
      },
      {
        slug: 'same-mean-and-spread', title: 'What can averages hide?', model: 'moments',
        intro: 'Two suppliers quote the same mean and standard deviation for delivery times. You care about late deliveries.',
        idea: 'The mean gives the average, and the standard deviation measures spread. Two curves with the same average and spread can still put different amounts of probability beyond a deadline.',
        predict: 'Will both suppliers have the same chance of delivering later than 50 minutes?',
        explore: 'Set Deadline to 50 min and compare Normal above deadline with Lognormal above deadline. Repeat at 40 and 65 min. Does the same model give the higher risk at every deadline?',
        answer: 'The two models can give different late probabilities. At 50 and 65 minutes the lognormal model puts more probability beyond the deadline. At 40 minutes the normal model puts more probability there. The deadline determines which differences in shape matter.',
        transfer: 'Which additional statistic would you request if missed deliveries dominate the decision?'
      },
      {
        slug: 'fit-parameters', title: 'How do you estimate a model’s parameters?', model: 'fit',
        intro: 'You have a sample of measurements and want to fit a normal model. Another sample from the same process would give slightly different fitted values.',
        idea: 'Fitting a model means estimating its parameters from data. The page fits the normal model’s mean using the sample average. It estimates spread by taking the square root of the average squared distance from that fitted mean.',
        predict: 'Would the fitted mean move more from run to run with 20 observations or with 200?',
        explore: 'The page simulates measurements from a model with mean 30 and standard deviation 6. Set Sample size to 20 and click New sample three times. Note Fitted mean and Fitted standard deviation each time. Repeat at 200. At which size do the estimates usually move less?',
        answer: 'At 200 observations the estimates usually change less from one sample to the next. Even a curve that fits one sample well can give estimates that differ from the known mean and spread.',
        transfer: 'Suppose your measurements come from one afternoon. What could make a well-fitted model misrepresent the whole week?',
        python: 'fit'
      },
      {
        slug: 'qq-plot', title: 'How can you see where a model misses?', model: 'qq',
        intro: 'A Q–Q plot compares observed quantiles with quantiles predicted by a candidate distribution.',
        idea: 'A quantile is a value at a chosen position in a distribution, such as the 90th-percentile value. A Q–Q plot pairs observed quantiles with quantiles from a fitted model. The diagonal marks where the two values are equal. A point above it means the sample value is larger than the corresponding model value.',
        predict: 'If you fit a normal model to strongly right-skewed data, will the observations in the upper tail tend to be larger or smaller than its predictions?',
        explore: 'Keep Sample size at 60. In Data source, switch from Symmetric normal to Right-skewed lognormal. Check the upper-right points against the Perfect agreement line. Compare Highest observed value with Matching model quantile. Click New sample to see whether the same pattern remains.',
        answer: 'In a sample from the skewed model, high observed quantiles can exceed the values predicted by the fitted normal. A pattern across several points is stronger evidence of a mismatch than one extreme observation.',
        transfer: 'If only the upper tail misses, what practical question could still make that model unsuitable?',
        python: 'qq'
      },
      {
        slug: 'scarce-tail-data', title: 'What if you barely observed the tail?', model: 'tail',
        intro: 'Ordinary delivery times can look similar under several plausible models. A very late-delivery promise depends on a part of the curve you have rarely observed.',
        idea: 'A tail gives the probability of outcomes beyond a threshold, such as an unusually late delivery. Different models can agree about typical times while giving different tail probabilities. A small sample might contain no late deliveries even when the chance of one is positive.',
        predict: 'What happens to agreement between the models as you move the deadline farther into the right tail?',
        explore: 'Keep Observations collected at 100. Move Deadline from 55 to 75 min. Compare Normal above deadline and Lognormal above deadline. Read Expected late observations for both models. At which deadline would a sample of 100 give you less evidence to tell the models apart?',
        answer: 'At 75 minutes, each model predicts well under one late delivery on average in 100 observations. The expected count for the normal model is so small that it rounds to zero. Seeing zero misses in a sample of 100 would be compatible with both models.',
        transfer: 'What additional observations could help you learn about rare late deliveries?'
      },
      {
        slug: 'delivery-model', title: 'Investigation · Which model would you use for delivery times?', model: 'delivery',
        intro: 'The page generates illustrative delivery times from a right-skewed model. Use the sample to compare two models for the chance of missing a delivery promise.',
        idea: 'The page fits a normal and a lognormal model to the same times. Compare each model’s predicted probability of missing the promise with the share of sampled deliveries that missed it. The lognormal model allows only positive delivery times.',
        predict: 'Which candidate do you expect to predict more misses at a very late deadline?',
        explore: 'Keep Sample size at 100. Set Promise time to 45 min, then 80 min. At each time, compare Observed above promise, Normal prediction, and Lognormal prediction. Which prediction is closer to the observed share? At 80 min, how many of the 100 deliveries were late?',
        answer: 'The two fits can give similar predictions near the middle and differ at later times. The lognormal is a plausible candidate for these positive, right-skewed times. Even if one model is closer to the observed share at 80 minutes, a few late results cannot establish the true chance of a miss.',
        transfer: 'Which model would you use to estimate misses for a 55-minute promise, and what new data could change your choice?',
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
        idea: 'A journey’s expected total time is the sum of the legs’ mean times. If the legs are independent, their variances add as well. Variance is standard deviation squared. Four identical independent legs therefore have four times the mean and twice the standard deviation of one leg.',
        predict: 'If you go from one leg to four independent legs, how do the mean and standard deviation change?',
        explore: 'Set Independent journey legs to 1, then 2, then 4. At each setting, read Expected mean, Expected standard deviation, and Simulated standard deviation. Which number grows with the number of legs, and which grows with its square root?',
        answer: 'Four legs multiply the mean by four and the standard deviation by two. The total stays uncertain even as its spread becomes smaller relative to its mean.',
        transfer: 'How would you find the distribution of the average time per leg from the total-time distribution?',
        python: 'sum'
      },
      {
        slug: 'shared-cause', title: 'What happens when you share a cause?', model: 'dependence',
        intro: 'Rain can slow several legs of a trip at once. A model that treats each leg as unrelated can miss unusually long journeys.',
        idea: 'Correlation measures how strongly two quantities tend to move together. Here a positive correlation makes slow legs more likely to occur in the same trip. The model keeps the mean and spread of each individual leg fixed.',
        predict: 'If the legs become more likely to slow down together, how will the trip’s average time and chance of exceeding a 46-minute deadline change?',
        explore: 'Keep Deadline at 46 min. Raise Correlation between legs from 0% to 70%. Compare Chance of missing deadline with Independent reference, the risk when the legs are independent. Check Total standard deviation to see how the spread changed.',
        answer: 'The total mean stays at 36 minutes. Positive correlation increases the total standard deviation. With a deadline above the mean, the wider normal curve puts more probability past the deadline.',
        transfer: 'Give an example of a shared cause that increases risk in a project schedule.',
        python: 'dependence'
      },
      {
        slug: 'conditioning', title: 'What can you learn by conditioning on new information?', model: 'condition',
        intro: 'You planned for a mixture of dry and rainy days. The trip begins and you learn that it is raining.',
        idea: 'A conditional distribution describes outcomes for a group you know you are in. Here the outcome is trip time, and knowing the weather tells you which group to use.',
        predict: 'If the rainy-day trips are typically longer, which distribution would you use to plan today’s journey once you know it is raining?',
        explore: 'Keep Chance of rain at 30%. In What you know, select Weather unknown, Dry day, then Rainy day. Follow the branches in the diagram and compare Chance above 35 min. Raise Chance of rain to 70% and repeat. Which result changes when the forecast changes?',
        answer: 'Use the rainy-day distribution for today. Changing the chance of rain changes the all-days mixture, while the two conditional distributions in this model stay fixed.',
        transfer: 'What could you do if the only information available were a forecast saying “70% chance of rain”?'
      },
      {
        slug: 'mixture', title: 'When does one population contain several groups?', model: 'mixture',
        intro: 'Weekday and weekend orders come from different schedules. Pooling them can produce a peak, a shoulder, or two peaks.',
        idea: 'A mixture describes two steps. First choose the group according to its share of orders. Then draw a time from that group’s distribution. The pooled curve combines the weekday and weekend curves using their shares.',
        predict: 'Will adding more weekend observations always produce a distinct second peak?',
        explore: 'Set Weekend share to 50%. Move Difference in means from 0 to 20 min and check when the Pooled distribution develops a second peak. Leave the gap at 20 min and lower Weekend share to 10%. What happens to the weekend peak in the pooled curve?',
        answer: 'Separate peaks require enough separation and weight in both groups. Overlap can leave one main peak or a shoulder.',
        transfer: 'What groups would you check before fitting one waiting-time distribution to pooled help-desk data?',
        python: 'mixture'
      },
      {
        slug: 'extremes', title: 'How do first and last completion times change?', model: 'extremes',
        intro: 'A device can stop when its first component fails. A set of parallel tasks finishes when its last task completes.',
        idea: 'The earliest time is the minimum. The latest time is the maximum. All n independent tasks must finish by time t for the last one to finish by t. If each has probability F(t) of meeting that threshold, the chance that all meet it is F(t) raised to n.',
        predict: 'As you add parts or tasks, which shifts earlier: the first failure or the last completion?',
        explore: 'Keep Threshold at 15 min. Change Independent times from 1 to 4. Compare First completion by threshold with Last completion by threshold. Which event becomes easier to achieve when you add tasks?',
        answer: 'The minimum shifts earlier and the maximum shifts later. Their behavior differs from that of the average or the sum.',
        transfer: 'Describe a system that can start as soon as its first component is ready. Then describe a system that has to wait for all components to be ready.'
      },
      {
        slug: 'project-deadline', title: 'Investigation · How likely is a project to miss its deadline?', model: 'deadline',
        intro: 'Your project has two workstreams behind a common kickoff. You can run the workstreams sequentially or in parallel.',
        idea: 'The parallel schedule assumes both tasks can start together after kickoff. On a disrupted run, the experiment adds six days to each task under both schedules.',
        predict: 'Which schedule will miss a fixed deadline less often? Could shared disruption still make the safer schedule miss?',
        explore: 'Keep Project deadline at 25 days and use the sample already shown. Set Chance of shared disruption to 0%, then 40%. At each setting, the two schedules use the same simulated task durations. Compare Parallel miss rate and Sequential miss rate. How much does disruption change the gap?',
        answer: 'The parallel schedule uses the longer of the two workstream durations and finishes no later than the sequential schedule in each run. Both can miss. Their miss rates and the gap between them can change when disruptions become more common.',
        transfer: 'What assumption would you revisit if the two streams compete for the same person?',
        python: 'deadline'
      }
    ]
  }
];
