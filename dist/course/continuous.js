export const continuous = [
  {
    title: 'Read continuous distributions',
    summary: 'Use histograms, densities, cumulative curves, and percentiles to answer questions about measurements.',
    lessons: [
      {
        slug: 'measure-time', title: 'What changes when you measure time?', model: 'measure',
        intro: 'You usually get whole numbers when you count arrivals. The time until an arrival can fall anywhere within an interval.',
        idea: 'Under a continuous model, probabilities come from intervals. Any one exact value has probability zero. A rounded measurement, such as “4 minutes” recorded to the nearest minute, represents a whole interval of possible times.',
        predict: 'What range of actual waits would be recorded as four minutes when you round to the nearest minute?',
        explore: 'Set the reported time to four minutes and change the rounding width. Watch the shaded interval and its probability shrink.',
        answer: 'A four-minute reading rounded to the nearest minute represents waits between 3.5 and 4.5 minutes, with an endpoint convention for ties. The interval has positive probability.',
        transfer: 'What interval would a kitchen scale reading of 250 g represent if it rounds to the nearest 10 g?'
      },
      {
        slug: 'density-area', title: 'Why does area give probability?', model: 'density',
        intro: 'A delivery-time curve is tall around the most typical time. How much of the distribution falls within a four-minute interval?',
        idea: 'Height is probability density, measured here per minute. Area under the density curve gives probability. The area over the entire range is one.',
        predict: 'Which four-minute interval has more probability if times cluster around 30 minutes, 28–32 or 38–42?',
        explore: 'Keep the interval width fixed and move its center. Then change the width while holding the center at 30.',
        answer: 'The interval from 28 to 32 covers the taller part of this curve and has more area. A wider interval around the same center also captures more area.',
        transfer: 'Explain why a density taller than 1 per minute is possible for sufficiently concentrated times.'
      },
      {
        slug: 'histogram-bins', title: 'How do histogram bins change what you see?', model: 'histogram',
        intro: 'You have one sample of waiting times. A histogram with four bins and a histogram with twenty bins tell the same data story at different resolutions.',
        idea: 'A bin gathers the observations in an interval. In a probability histogram, the bar heights sum to one. In a density histogram, multiply each height by the bin width to get its probability share.',
        predict: 'Will doubling the number of bins necessarily reveal more meaningful detail?',
        explore: 'Change the bin count while keeping the sample and seed fixed. Switch from probability to density and inspect the reported totals.',
        answer: 'Fewer bins can hide structure, and more can emphasize noise. With density scaling, narrower bins can become taller even if they contain fewer points. Their areas still represent the observed shares.',
        transfer: 'If you overlay a theoretical density on your histogram, which vertical scale should you use?',
        python: 'histogram'
      },
      {
        slug: 'continuous-cdf', title: 'How do you read a cumulative curve?', model: 'cdf',
        intro: 'A manager asks what fraction of deliveries arrive by 35 minutes, and what fraction take between 25 and 35 minutes. One cumulative curve answers both.',
        idea: 'If F(t) is P(X ≤ t), the chance of going above t is 1 − F(t). The probability between a and b is F(b) − F(a) when a ≤ b. Continuous endpoints have zero probability.',
        predict: 'Which is bigger for a normal model centered at 30 minutes, the chance of arriving by 30 or the chance of arriving by 35?',
        explore: 'Set the lower threshold to 25 and the upper to 35. Read the chances below the upper threshold, above it, and between the thresholds.',
        answer: 'The CDF is larger at 35. The chance between the thresholds is the vertical rise from F(25) to F(35). A steep part of the CDF corresponds to greater density.',
        transfer: 'If F(20) = 0.10 and F(40) = 0.92, what fraction of deliveries take between 20 and 40 minutes?'
      },
      {
        slug: 'percentiles', title: 'What does the 90th percentile mean?', model: 'quantile',
        intro: 'A team wants to promise a delivery time that about 90% of customers can expect to meet. The probability comes first, then the threshold.',
        idea: 'A percentile is a value on the measurement scale. For a continuous increasing CDF, the 90th percentile is the time where the CDF reaches 0.90. A larger percentile generally means a larger threshold.',
        predict: 'Will the 90th-percentile delivery time be higher or lower than the median?',
        explore: 'Move from the 50th to the 90th percentile. Read the new time and the fraction of deliveries that would still be late.',
        answer: 'The 90th percentile is higher. Under the model, 10% of deliveries exceed that time. The median is the 50th percentile.',
        transfer: 'Would a 95%-on-time promise give customers a shorter or longer quoted time?',
        python: 'quantile'
      },
      {
        slug: 'three-probability-views', title: 'Investigation · Can you read the same probability three ways?', model: 'three-views',
        intro: 'You want the fraction of waits between 3 and 8 minutes. You have observations and a proposed model for the time between arrivals.',
        idea: 'The observed fraction depends on the sample. The model interval has two equivalent exact views: area under its density, and the difference between the CDF at the endpoints.',
        predict: 'Which two of the three results should agree exactly? Which can change if you take a fresh sample?',
        explore: 'Use the view control to switch between sample, density, and cumulative curve. Resample while keeping the endpoints fixed.',
        answer: 'The model area and CDF difference agree. The observed fraction fluctuates around the model probability when the data are sampled from that model.',
        transfer: 'If the observed fraction remains systematically different in large samples, what might you question about the model?',
        python: 'three-views'
      }
    ]
  },
  {
    title: 'Explore shapes and choose candidate models',
    summary: 'Connect six continuous distributions to the processes and assumptions that produce their shapes.',
    lessons: [
      {
        slug: 'uniform', title: 'Uniform · What does an even spread imply?', model: 'uniform',
        intro: 'Imagine arriving at a regular shuttle stop at a random point in the schedule. Your wait could be anywhere from zero to one full interval.',
        idea: 'On a uniform interval, equal-width subintervals have equal probability. The density is constant, and the share below a threshold is its distance from the lower bound divided by the total width.',
        predict: 'If shuttles come every 12 minutes, what is the chance of waiting at most 3 minutes?',
        explore: 'Set a 12-minute interval and move the threshold. Then cut the interval in half while keeping the threshold at three.',
        answer: 'The initial probability is 3/12, or 25%. With shuttles every six minutes it becomes 3/6, or 50%, assuming arrival is still uniform within the interval.',
        transfer: 'If passengers check the timetable before leaving home, why might their waits differ from a uniform model?'
      },
      {
        slug: 'normal', title: 'Normal · What do the mean and standard deviation control?', model: 'normal',
        intro: 'An instrument measures a fixed quantity with roughly symmetric errors. The normal model lets you examine typical errors and rare large deviations.',
        idea: 'The mean locates the center. The standard deviation sets the scale. Raising the scale spreads probability farther from the center and lowers the peak so the total area stays one.',
        predict: 'What happens to the probability above a fixed threshold when you increase the standard deviation and the threshold is above the mean?',
        explore: 'Hold the mean and threshold fixed. Change the standard deviation, then hold it fixed and shift the mean.',
        answer: 'Widening the curve puts more area past a threshold above the mean. Moving the mean toward that threshold also increases the tail probability.',
        transfer: 'If you set a threshold precisely at the mean, what happens to the upper-tail probability as the standard deviation changes?',
        python: 'normal'
      },
      {
        slug: 'exponential', title: 'Exponential · How long until the next arrival?', model: 'exponential',
        intro: 'Chats arrive independently at an average rate of two every ten minutes. How long will you wait for the next one under a constant-rate model?',
        idea: 'For exponential waits with rate λ per minute, the mean wait is 1/λ. The chance that a wait exceeds t equals the chance of zero Poisson arrivals in t minutes.',
        predict: 'If the chat arrival rate doubles, what happens to the average wait and the chance of waiting more than ten minutes?',
        explore: 'Increase the arrivals per ten minutes and watch the mean and shaded upper tail. Compare the wait probability with the zero-arrival calculation.',
        answer: 'The mean wait halves and the chance of a long wait decreases. Both routes give the same probability because “I’m still waiting” means no event has arrived.',
        transfer: 'If the desk is quiet overnight and busy at opening, what would you change about the rate assumption?'
      },
      {
        slug: 'gamma', title: 'Gamma · How long until several arrivals?', model: 'gamma',
        intro: 'A team needs the time until the fifth customer arrives. The gap between each pair of successive arrivals follows the same exponential model.',
        idea: 'Adding k independent exponential waits with the same rate gives a gamma distribution with shape k. For the whole-number shapes here, the expected total wait is k divided by the rate.',
        predict: 'When waiting for five events instead of one, where will most of the probability mass move?',
        explore: 'Change the number of arrivals needed, first with rate held fixed, then with a higher rate.',
        answer: 'The total wait typically moves to the right as the target count rises. A faster rate shortens the individual waits and shifts the distribution back to the left.',
        transfer: 'What would break if the time between arrivals sped up after the first customer?',
        python: 'gamma'
      },
      {
        slug: 'lognormal', title: 'Lognormal · What happens when effects multiply?', model: 'lognormal',
        intro: 'A lead time can be multiplied by several independent factors. Their effects add on a log scale and may produce a long right tail on the original scale.',
        idea: 'A positive quantity is lognormal when its logarithm is normal. Its median is the exponential of the log mean. Increasing log-scale spread can greatly increase the upper percentiles while keeping the median fixed.',
        predict: 'If the median stays fixed and log-scale spread grows, which moves more, the median or the 90th percentile?',
        explore: 'Adjust spread and switch to log scale. Compare the median and 90th percentile reported on the original scale.',
        answer: 'The median stays fixed. The 90th percentile moves to the right, as do other high percentiles. The log values form a symmetric normal curve.',
        transfer: 'Would a lognormal model work for a variable that commonly takes the value zero?',
        python: 'lognormal'
      },
      {
        slug: 'beta', title: 'Beta · How can you model a value between zero and one?', model: 'beta',
        intro: 'You are uncertain about the defect rate of a process. A distribution over possible rates can give more weight to some values while keeping the entire range between zero and one.',
        idea: 'A beta distribution has two positive shape parameters. In this lab you set the mean rate and a concentration, which determine those parameters. Higher concentration concentrates density around the given mean.',
        predict: 'If the mean defect rate stays at 20% but confidence increases, what should change about the distribution?',
        explore: 'Keep the mean fixed while raising the concentration. Then change the mean and see where density moves.',
        answer: 'Higher concentration reduces spread without changing the mean. The beta curve describes uncertainty about p. A Bernoulli model with a specified p describes the result of one inspection.',
        transfer: 'What evidence might let you narrow a distribution over a supplier’s defect rate?'
      }
    ]
  }
];
