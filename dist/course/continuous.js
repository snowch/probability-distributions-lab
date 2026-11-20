export const continuous = [
  {
    title: 'Read continuous distributions',
    summary: 'Use histograms, densities, cumulative curves, and percentiles to answer questions about measurements.',
    lessons: [
      {
        slug: 'measure-time', title: 'What changes when you measure time?', model: 'measure',
        intro: 'You usually get whole numbers when you count arrivals. The time until an arrival can fall anywhere within an interval.',
        idea: 'A continuous model allows waits such as 3.52 or 4.487 minutes. An individual exact time has probability zero in that model. A reported time rounded to the nearest minute stands for an interval of possible waits.',
        predict: 'What range of actual waits would be recorded as four minutes when you round to the nearest minute?',
        explore: 'Keep Reported wait at 4 min. Change Rounding interval from 1 minute to 0.1 minutes. Compare Actual interval and Probability of that reading. Why does a more precise reading cover a smaller share of waits?',
        answer: 'A four-minute reading rounded to the nearest minute represents waits between 3.5 and 4.5 minutes, with an endpoint convention for ties. The interval has positive probability.',
        transfer: 'What interval would a kitchen scale reading of 250 g represent if it rounds to the nearest 10 g?'
      },
      {
        slug: 'density-area', title: 'Why does area give probability?', model: 'density',
        intro: 'The curve is tallest around the most common delivery times. How do you use that curve to compare two intervals of equal width?',
        idea: 'The height of the curve is probability density, measured here per minute. The area under the curve over an interval gives the probability of landing in that interval. The area under the whole curve is one.',
        predict: 'Which four-minute interval has more probability if times cluster around 30 minutes, 28–32 or 38–42?',
        explore: 'Keep Interval width at 4 min. Move Interval center from 30 to 40 min and compare Shaded area for the two intervals. Then return the center to 30 min and set the width to 8 min. How does widening the interval differ from moving it?',
        answer: 'The interval from 28 to 32 covers the taller part of this curve and has more area. A wider interval around the same center also captures more area.',
        transfer: 'One delivery model has a higher density at 30 minutes than another. What area would you compare to decide which model gives a higher chance of delivery between 28 and 32 minutes?'
      },
      {
        slug: 'histogram-bins', title: 'How do histogram bins change what you see?', model: 'histogram',
        intro: 'You have one sample of waiting times. A histogram with four bins and a histogram with twenty bins tell the same data story at different resolutions.',
        idea: 'A histogram puts observations into bins, or adjacent intervals. With probability per bin, the height is each bin’s share of the sample. With probability density, the area of each bar gives its share. Density equals the share divided by the bin width.',
        predict: 'Will doubling the number of bins necessarily reveal more meaningful detail?',
        explore: 'The page uses the same 150 waits throughout. With Vertical scale set to Probability per bin, set Number of bins to 5, then 20. Compare Bin width and the shape of the bars. Keep 20 bins and switch to Probability density. Which total is now 1?',
        answer: 'At 20 bins, each bin is one fourth as wide as at 5 bins. Narrower bins can reveal structure or exaggerate noise. With Probability density, the total bar area is 1. With Probability per bin, the sum of bar heights is 1.',
        transfer: 'If you overlay a theoretical density on your histogram, which vertical scale should you use?',
        python: 'histogram'
      },
      {
        slug: 'continuous-cdf', title: 'How do you read a cumulative curve?', model: 'cdf',
        intro: 'A manager asks what fraction of deliveries arrive by 35 minutes, and what fraction take between 25 and 35 minutes. One cumulative curve answers both.',
        idea: 'The cumulative distribution function, written F(t), gives the chance of delivery by time t. The chance of taking longer is 1 − F(t). Subtract the cumulative values at two times to get the chance of landing between them.',
        predict: 'Which is bigger for a normal model centered at 30 minutes, the chance of arriving by 30 or the chance of arriving by 35?',
        explore: 'Set Endpoint A to 25 min and move Endpoint B from 30 to 35 min. Compare the results labeled By, Above, and Between. As you allow more time, which probability goes down?',
        answer: 'By 35 min is larger than By 30 min. Above 35 min is smaller because fewer deliveries take that long. Between 25 and 35 min equals the vertical rise from F(25) to F(35).',
        transfer: 'If F(20) = 0.10 and F(40) = 0.92, what fraction of deliveries take between 20 and 40 minutes?'
      },
      {
        slug: 'percentiles', title: 'What does the 90th percentile mean?', model: 'quantile',
        intro: 'A team wants to promise a delivery time that about 90% of customers can expect to meet. The probability comes first, then the threshold.',
        idea: 'A percentile is a value on the measurement scale, here minutes. The 90th percentile is the time by which 90% of deliveries arrive under the model. The median is the 50th percentile.',
        predict: 'Will the 90th-percentile delivery time be higher or lower than the median?',
        explore: 'Move Percentile from 50% to 90%, then to 95%. Compare Time at the percentile and Later than that. What time would meet a 95% on-time promise under this model?',
        answer: 'The 90th percentile is higher. Under the model, 10% of deliveries exceed that time. The median is the 50th percentile.',
        transfer: 'Would a 95%-on-time promise give customers a shorter or longer quoted time?',
        python: 'quantile'
      },
      {
        slug: 'three-probability-views', title: 'Investigation · Can you read the same probability three ways?', model: 'three-views',
        intro: 'Estimate the chance that a wait lasts between 3 and 8 minutes. Compare the simulated observations with two ways of reading the model.',
        idea: 'The page generates a sample of 300 waits from one model. The observed share is the fraction of those waits between the endpoints. The model assigns the same probability to that interval whether you use the area under its density or subtract the cumulative probabilities at the two endpoints.',
        predict: 'Which two of the three results should agree exactly? Which can change if you take a fresh sample?',
        explore: 'Keep Endpoint A at 3 min and Endpoint B at 8 min. Use View to select Sample histogram, Model density, and Model cumulative curve in turn. Click New sample, then compare Observed share, Area under the density, and Difference in cumulative probability. Which result changed?',
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
        explore: 'Set Minutes between shuttles to 12 min and Wait threshold to 3 min. Read Wait at most 3 min. Change Minutes between shuttles to 6 min with the same threshold. What fraction of the interval does the shaded area cover now?',
        answer: 'The initial probability is 3/12, or 25%. With shuttles every six minutes it becomes 3/6, or 50%, assuming arrival is still uniform within the interval.',
        transfer: 'If passengers check the timetable before leaving home, why might their waits differ from a uniform model?'
      },
      {
        slug: 'normal', title: 'Normal · What do the mean and standard deviation control?', model: 'normal',
        intro: 'An instrument measures a fixed quantity with roughly symmetric errors. The normal model lets you examine typical errors and rare large deviations.',
        idea: 'The mean locates the center of the normal curve. The standard deviation measures spread in the same units as the data. Increasing the standard deviation makes the curve wider and lower so its total area stays one.',
        predict: 'What happens to the probability above a fixed threshold when you increase the standard deviation and the threshold is above the mean?',
        explore: 'Keep Mean at 30 min and Late threshold at 38 min. Raise Standard deviation from 6 to 12 min and compare Chance above threshold. Then leave the spread at 12 min and raise Mean to 35 min. How do the two changes affect the same risk?',
        answer: 'Widening the curve puts more area past a threshold above the mean. Moving the mean toward that threshold also increases the tail probability.',
        transfer: 'If you set a threshold precisely at the mean, what happens to the upper-tail probability as the standard deviation changes?',
        python: 'normal'
      },
      {
        slug: 'exponential', title: 'Exponential · How long until the next arrival?', model: 'exponential',
        intro: 'Chats arrive independently at an average rate of two every ten minutes. How long will you wait for the next one under a constant-rate model?',
        idea: 'The exponential model gives the time until the next event if arrivals follow a constant-rate Poisson process. The rate is the expected count per unit of time. For example, two arrivals per ten minutes gives a mean wait of five minutes.',
        predict: 'If the chat arrival rate doubles, what happens to the average wait and the chance of waiting more than ten minutes?',
        explore: 'Keep Wait threshold at 10 min. Raise Arrivals per 10 minutes from 2 to 4. Compare Mean wait and the two probability readouts. Why do Wait longer than threshold and Zero arrivals by threshold give the same value?',
        answer: 'The mean wait halves and the chance of a long wait decreases. Both routes give the same probability because “I’m still waiting” means no event has arrived.',
        transfer: 'If the desk is quiet overnight and busy at opening, what would you change about the rate assumption?'
      },
      {
        slug: 'gamma', title: 'Gamma · How long until several arrivals?', model: 'gamma',
        intro: 'A team needs the time until the fifth customer arrives. The gap between each pair of successive arrivals follows the same exponential model.',
        idea: 'The total wait to the kth arrival is the sum of k gaps. If those gaps are independent exponential waits with the same rate, the total has a gamma distribution. In this example, k is the shape parameter, and the mean total wait is k times the mean gap.',
        predict: 'When waiting for five events instead of one, where will most of the probability mass move?',
        explore: 'Keep Arrivals per 10 minutes at 2. Set Arrivals needed to 1, then 5. Read Mean total wait both times. At 5 arrivals, also compare the two chart curves. Increase Arrivals per 10 minutes to 4 and see how the mean changes.',
        answer: 'The total wait typically moves to the right as the target count rises. A faster rate shortens the individual waits and shifts the distribution back to the left.',
        transfer: 'What would break if the time between arrivals sped up after the first customer?',
        python: 'gamma'
      },
      {
        slug: 'lognormal', title: 'Lognormal · What happens when effects multiply?', model: 'lognormal',
        intro: 'A lead time can be multiplied by several independent factors. Their effects add on a log scale and may produce a long right tail on the original scale.',
        idea: 'A positive quantity follows a lognormal model if taking the logarithm of each value gives a normal distribution. In this experiment, the median stays at 20 days as you change the standard deviation of the logged values. The 90th percentile can still move.',
        predict: 'If the median stays fixed and log-scale spread grows, which moves more, the median or the 90th percentile?',
        explore: 'Leave Measurement on Original values and raise Log-scale spread from 0.5 to 0.8. Compare Median on original scale and 90th percentile on original scale. Switch Measurement to Log of each value to see how the plotted shape changes.',
        answer: 'The median stays fixed. The 90th percentile moves to the right, as do other high percentiles. The log values form a symmetric normal curve.',
        transfer: 'Would a lognormal model work for a variable that commonly takes the value zero?',
        python: 'lognormal'
      },
      {
        slug: 'beta', title: 'Beta · How can you model a value between zero and one?', model: 'beta',
        intro: 'You are uncertain about the defect rate of a process. A distribution over possible rates can give more weight to some values while keeping the entire range between zero and one.',
        idea: 'The beta model describes uncertainty about a rate between 0 and 1. Two positive shape parameters, α and β, set the curve. Mean defect rate gives the average across possible rates. A higher Concentration places more probability close to that average.',
        predict: 'If the mean defect rate stays at 20% but confidence increases, what should change about the distribution?',
        explore: 'Keep Mean defect rate at 20%. Raise Concentration from 20 to 60 and read Standard deviation. Then set Mean defect rate to 40% with Concentration at 60. Which change moves the average rate?',
        answer: 'Higher concentration reduces spread without changing the mean. The beta curve describes uncertainty about p. A Bernoulli model with a specified p describes the result of one inspection.',
        transfer: 'What evidence might let you narrow a distribution over a supplier’s defect rate?'
      }
    ]
  }
];
