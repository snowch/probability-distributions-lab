const base = 'import numpy as np\nimport matplotlib.pyplot as plt\n';
const statistical = 'from scipy import stats\n';
const visual = 'import seaborn as sns\n\nsns.set_theme(style="whitegrid")\n';
const seed = 'rng = np.random.default_rng(426)\n';
function example(prompt, chart, body, { scipy = false, seaborn = false, simulated = true } = {}) {
  const code = base + (scipy ? statistical : '') + (seaborn ? visual : '') + '\n' + (simulated ? seed : '') + body.trim() + '\n';
  return { prompt, figure: chart, code, packages: ['numpy', ...(scipy ? ['scipy'] : []), ...(seaborn ? ['pandas'] : [])] };
}

export const pythonExamples = {
  coin: example('In Python code, change chance from 0.50 to 0.70. Compare Observed mean and Model mean after both runs. At the 0.70 setting, try rounds = 20 and rounds = 2000. Which set of Observed bars is closer to the Model marks?', 'Observed head counts and exact binomial probabilities', `
n_flips = 10
chance = 0.50
rounds = 200
heads = rng.binomial(n_flips, chance, size=rounds)
possible = np.arange(n_flips + 1)
model = stats.binom.pmf(possible, n_flips, chance)

ax = sns.histplot(x=heads, discrete=True, binrange=(0, n_flips),
                  stat="probability", color="#318978", label="Observed")
ax.plot(possible, model, "_", markersize=13, color="#873b21", label="Model")
ax.set(xlabel="Heads in one round", ylabel="Probability")
ax.legend()
print(f"Observed mean: {heads.mean():.2f} · Model mean: {n_flips * chance:.2f}")
`, { scipy: true, seaborn: true }),

  'coin-evidence': example('In Python code, change n from 10 to 100. Leave both coin probabilities and the 70% threshold as written. Compare the two Fair results. How does increasing the number of flips change the chance that a fair coin reaches 70% heads?', 'Probability of reaching the head-count threshold under fair and biased models', `
n = 10
threshold = int(np.ceil(0.70 * n))
x = np.arange(n + 1)
fig, ax = plt.subplots()
for p, label in [(0.50, "Fair"), (0.70, "Biased")]:
    ax.plot(x, stats.binom.pmf(x, n, p), "o-", label=label)
    print(f"{label}, chance of {threshold} or more: {stats.binom.sf(threshold - 1, n, p):.2%}")
ax.axvline(threshold, color="#777777", linestyle="--", label="Threshold")
ax.set(xlabel="Heads", ylabel="Probability")
ax.legend()
`, { scipy: true, simulated: false }),

  geometric: example('In Python code, change attempt from 5 to 10. For each run, compare the printed lines beginning On attempt and By attempt. What extra outcomes does By attempt include?', 'Geometric probabilities by attempt number', `
p = 0.20
attempt = 5
x = np.arange(1, 26)
model = stats.geom(p)
fig, ax = plt.subplots()
ax.bar(x, model.pmf(x), color=np.where(x == attempt, "#a74e25", "#318978"))
ax.set(xlabel="Attempt of first success", ylabel="Probability")
print(f"On attempt {attempt}: {model.pmf(attempt):.2%}")
print(f"By attempt {attempt}: {model.cdf(attempt):.2%}")
`, { scipy: true, simulated: false }),

  poisson: example('In Python code, change rate from 4 to 6 and keep busy = 8. Compare At least 8 chats and the highlighted bars. How does the higher rate change the chance of a busy hour?', 'Poisson probabilities with the busy-hour tail highlighted', `
rate = 4
busy = 8
x = np.arange(26)
model = stats.poisson(rate)
fig, ax = plt.subplots()
ax.bar(x, model.pmf(x), color=np.where(x >= busy, "#a74e25", "#318978"))
ax.set(xlabel="Chats in one hour", ylabel="Probability")
print(f"At least {busy} chats: {model.sf(busy - 1):.2%}")
`, { scipy: true, simulated: false }),

  histogram: example('In Python code, change bins from 12 to 6, then to 24. Compare the shape of the bars. Leave bins at 24 and change stat = "probability" to stat = "density". Compare the vertical-axis labels and bar heights. The seed, the number passed to default_rng, keeps the same simulated waits across runs.', 'Histogram of the same waiting-time sample at the selected binning and scale', `
waits = rng.exponential(scale=5, size=150)
bins = 12
stat = "probability"
ax = sns.histplot(x=waits, bins=bins, stat=stat, color="#318978")
ax.set(xlabel="Observed wait (minutes)")
print(f"Sample size: {len(waits)} · Vertical scale: {stat}")
`, { seaborn: true }),

  quantile: example('In Python code, change goal from 0.90 to 0.50 and 0.95 in turn. Compare Threshold and Exceedance for the three runs. Which goal produces the longest promised time?', 'Normal delivery-time density shaded to the chosen percentile', `
goal = 0.90
model = stats.norm(loc=30, scale=6)
threshold = model.ppf(goal)
time = np.linspace(0, 60, 400)
fig, ax = plt.subplots()
ax.plot(time, model.pdf(time), color="#137f72")
ax.fill_between(time, model.pdf(time), where=time <= threshold, interpolate=True, alpha=0.25)
ax.axvline(threshold, linestyle="--", color="#873b21")
ax.set(xlabel="Delivery time (minutes)", ylabel="Density")
print(f"Threshold: {threshold:.2f} minutes · Exceedance: {1-goal:.1%}")
`, { scipy: true, simulated: false }),

  'three-views': example('In Python code, change low, high = 3, 8 to low, high = 3, 10. Compare Observed share with Model CDF difference before and after the change. How does widening the interval affect both values?', 'Empirical and model cumulative curves for waiting time', `
low, high = 3, 8
model = stats.expon(scale=5)
waits = model.rvs(size=300, random_state=rng)
observed = np.mean((waits >= low) & (waits <= high))
print(f"Observed share: {observed:.2%}")
print(f"Model CDF difference: {model.cdf(high) - model.cdf(low):.2%}")
x = np.linspace(0, 30, 350)
ax = sns.ecdfplot(x=waits, label="Observed", color="#318978")
ax.plot(x, model.cdf(x), "--", label="Model", color="#a74e25")
ax.axvspan(low, high, alpha=0.12)
ax.set(xlabel="Wait (minutes)", ylabel="Cumulative probability", xlim=(0, 30))
ax.legend()
`, { scipy: true, seaborn: true }),

  normal: example('In Python code, change the spread in center, spread = 30, 6 from 6 to 12. Leave threshold at 38. Compare the shaded area and Chance of exceeding 38 min. How does more spread affect the chance of a late delivery?', 'Normal density with the area above the late threshold highlighted', `
center, spread = 30, 6
threshold = 38
model = stats.norm(center, spread)
x = np.linspace(-10, 75, 450)
fig, ax = plt.subplots()
ax.plot(x, model.pdf(x), color="#137f72")
ax.fill_between(x, model.pdf(x), where=x >= threshold, interpolate=True, alpha=0.25)
ax.set(xlabel="Delivery time (minutes)", ylabel="Density")
print(f"Chance of exceeding {threshold} min: {model.sf(threshold):.2%}")
`, { scipy: true, simulated: false }),

  gamma: example('In Python code, change arrivals in arrivals, rate = 5, 0.20 from 5 to 1, then to 8. Keep the rate at 0.20. Compare Observed mean and Model mean for each run to see how the number of arrivals changes the wait.', 'Histogram of summed exponential waits with gamma density overlaid', `
arrivals, rate = 5, 0.20
gaps = rng.exponential(scale=1/rate, size=(2000, arrivals))
waits = gaps.sum(axis=1)
model = stats.gamma(a=arrivals, scale=1/rate)
x = np.linspace(0, max(waits), 350)
ax = sns.histplot(x=waits, stat="density", color="#318978")
ax.plot(x, model.pdf(x), color="#a74e25")
ax.set(xlabel="Total wait (minutes)", ylabel="Density")
print(f"Observed mean: {waits.mean():.2f} min · Model mean: {model.mean():.2f} min")
`, { scipy: true, seaborn: true }),

  lognormal: example('In Python code, change spread from 0.4 to 0.8. Compare the two histograms and the printed median and 90th percentile on the original scale. Which percentile moves farther?', 'Side-by-side distributions of original and logged lead times', `
spread = 0.4
logs = rng.normal(np.log(20), spread, 1500)
time = np.exp(logs)
fig, axes = plt.subplots(1, 2, figsize=(8, 3.4), layout="constrained")
sns.histplot(x=time, ax=axes[0], color="#318978")
sns.histplot(x=logs, ax=axes[1], color="#a74e25")
axes[0].set(xlabel="Lead time in days")
axes[1].set(xlabel="Log lead time")
print("Original-scale median and 90th percentile:", np.round(np.quantile(time, [0.5, 0.9]), 2))
`, { seaborn: true }),

  fit: example('In Python code, keep n at 20 and change the number in default_rng(426) to 427 to draw a fresh sample. Record Fitted mean and Fitted spread after each run. Repeat with n = 200 using both seeds, 426 and 427. At which size do the estimates move less in these runs?', 'Observed histogram with fitted and generating normal densities', `
n = 20
values = rng.normal(30, 6, size=n)
center, spread = stats.norm.fit(values)
x = np.linspace(0, 60, 300)
ax = sns.histplot(x=values, stat="density", color="#318978")
ax.plot(x, stats.norm.pdf(x, center, spread), color="#873b21", label="Fit")
ax.plot(x, stats.norm.pdf(x, 30, 6), "--", color="#42587e", label="Truth")
ax.set(xlabel="Measurement", ylabel="Density")
ax.legend()
print(f"Fitted mean: {center:.2f} · Fitted spread: {spread:.2f}")
`, { scipy: true, seaborn: true }),

  qq: example('In Python code, change skewed from True to False. Compare Largest observed with Matching model quantile for both runs. In which run do the highest points land farther from the diagonal?', 'Observed quantiles compared with a fitted normal, with an identity line', `
skewed = True
z = rng.standard_normal(100)
data = np.exp(3.3 + 0.55 * z) if skewed else 30 + 6 * z
observed = np.sort(data)
center, spread = stats.norm.fit(data)
probabilities = (np.arange(len(data)) + 0.5) / len(data)
expected = stats.norm.ppf(probabilities, loc=center, scale=spread)
limits = [min(expected.min(), observed.min()), max(expected.max(), observed.max())]
ax = sns.scatterplot(x=expected, y=observed, color="#137f72")
ax.plot(limits, limits, "--", color="#5a6983")
ax.set(xlabel="Fitted normal quantile", ylabel="Observed quantile")
print(f"Largest observed: {observed[-1]:.2f} · Matching model quantile: {expected[-1]:.2f}")
`, { scipy: true, seaborn: true }),

  delivery: example('In Python code, change deadline from 55 to 45, then to 80. Compare Observed late with each Estimated late fraction. Divide the observed late count by the total count to compare on the same scale. At which deadline do you have less observed evidence about the late fraction?', 'Delivery-time observations with fitted normal and lognormal densities', `
deadline = 55
values = rng.lognormal(mean=3.35, sigma=0.48, size=100)
models = {"Normal": stats.norm(*stats.norm.fit(values)),
          "Lognormal": stats.lognorm(*stats.lognorm.fit(values, floc=0))}
ax = sns.histplot(x=values, stat="density", color="#318978", label="Observed")
x = np.linspace(0, max(values.max(), deadline + 10), 350)
for name, model in models.items():
    ax.plot(x, model.pdf(x), label=name)
    print(f"Estimated late fraction ({name}): {model.sf(deadline):.2%}")
print(f"Observed late: {sum(values > deadline)} out of {len(values)}")
ax.axvline(deadline, linestyle="--", color="#333333")
ax.set(xlabel="Delivery time (minutes)", ylabel="Density")
ax.legend()
`, { scipy: true, seaborn: true }),

  sum: example('In Python code, change legs from 4 to 1. Compare Mean, SD (standard deviation), and Expected SD in the two runs. How do the mean and spread change when the number of legs is four times as large?', 'Histogram of the total time across independent legs', `
legs = 4
total = rng.exponential(scale=8, size=(2000, legs)).sum(axis=1)
ax = sns.histplot(x=total, stat="density", color="#318978")
ax.axvline(8 * legs, linestyle="--", color="#873b21", label="Expected mean")
ax.set(xlabel="Total journey time (minutes)", ylabel="Density")
ax.legend()
print(f"Mean: {total.mean():.2f} min · SD: {total.std():.2f} min")
print(f"Expected SD: {8 * np.sqrt(legs):.2f} min")
`, { seaborn: true }),

  dependence: example('In Python code, set correlation to 0, then 0.70. Leave deadline at 46. Compare Late, Mean, and SD (standard deviation). Which outputs change most when the legs are more likely to be slow together?', 'Simulated total journey times with a deadline marker', `
correlation = 0.60
deadline = 46
shared = rng.standard_normal((4000, 1))
separate = rng.standard_normal((4000, 3))
legs = 12 + 4 * (np.sqrt(correlation) * shared + np.sqrt(1-correlation) * separate)
total = legs.sum(axis=1)
ax = sns.histplot(x=total, stat="density", color="#318978")
ax.axvline(deadline, linestyle="--", color="#873b21")
ax.set(xlabel="Total journey time (minutes)", ylabel="Density")
print(f"Late: {np.mean(total > deadline):.2%} · Mean: {total.mean():.2f} min · SD: {total.std():.2f} min")
`, { seaborn: true }),

  mixture: example('In Python code, set weekend_share, mean_gap to 0.50, 20. Then change just weekend_share to 0.10. Compare the dark pooled curve and Observed weekend share. What happens to the weekend peak as weekend orders become less common?', 'Weekday and weekend time distributions and their pooled density', `
import pandas as pd

weekend_share, mean_gap = 0.30, 12
weekend = rng.random(1800) < weekend_share
time = rng.normal(24 + weekend * mean_gap, 4)
data = pd.DataFrame({"time": time, "group": np.where(weekend, "Weekend", "Weekday")})
ax = sns.histplot(data=data, x="time", hue="group", stat="density",
                  common_norm=False, element="step", fill=False)
sns.kdeplot(x=time, color="#25364a", ax=ax, label="Pooled density")
ax.set(xlabel="Processing time (minutes)", ylabel="Density")
# Label the pooled line directly so the group legend stays visible.
ax.text(0.98, 0.91, "Dark curve: pooled", transform=ax.transAxes, ha="right")
print(f"Observed weekend share: {weekend.mean():.1%}")
`, { seaborn: true }),

  deadline: example('In Python code, change disruption_risk from 0.2 to 0.4 and leave deadline at 25. Compare Parallel miss rate and Sequential miss rate at both settings. The two schedules always use the same simulated task times within a run.', 'Empirical completion-time distributions for parallel and sequential schedules', `
disruption_risk = 0.2
deadline = 25
delay = 6 * (rng.random(2500) < disruption_risk)
kickoff = 3 + rng.exponential(2.5, 2500)
first = 4 + rng.exponential(1/0.28, 2500) + delay
second = 3 + rng.exponential(1/0.24, 2500) + delay
parallel = kickoff + np.maximum(first, second)
sequential = kickoff + first + second
ax = sns.ecdfplot(x=parallel, label="Parallel")
sns.ecdfplot(x=sequential, label="Sequential", ax=ax)
ax.axvline(deadline, linestyle="--", color="#873b21")
ax.set(xlabel="Project duration (days)", ylabel="Cumulative probability")
ax.legend()
print(f"Parallel miss rate: {np.mean(parallel > deadline):.2%}")
print(f"Sequential miss rate: {np.mean(sequential > deadline):.2%}")
`, { seaborn: true }),

  averages: example('In Python code, change n from 12 to 4 and 40 in turn. Compare Single-wait SD and Average SD for each run. What happens to the spread of the averages as more waits go into each one?', 'Single waiting times and sample averages on a common scale', `
n = 12
waits = rng.exponential(5, size=(1800, n))
single = waits[:, 0]
average = waits.mean(axis=1)
ax = sns.histplot(x=single, bins=np.linspace(0, 45, 35), stat="density", alpha=.35, label="One wait")
sns.histplot(x=average, bins=np.linspace(0, 45, 35), stat="density", element="step", fill=False, ax=ax, label="Average")
ax.set(xlabel="Wait or average wait (minutes)", ylabel="Density")
ax.legend()
print(f"Single-wait SD: {single.std():.2f} · Average SD: {average.std():.2f}")
`, { seaborn: true }),

  clt: example('In Python code, change n from 4 to 1 and 40 in turn. Compare the histogram with the Standard normal line. Which sample size makes the right-hand skew hardest to see?', 'Standardized sample means compared with the standard normal density', `
n = 4
data = rng.exponential(scale=1, size=(4000, n))
standardized = (data.mean(axis=1) - 1) * np.sqrt(n)
x = np.linspace(-4, max(4, standardized.max()), 400)
ax = sns.histplot(x=standardized, stat="density", color="#318978")
ax.plot(x, stats.norm.pdf(x), color="#873b21", label="Standard normal")
ax.set(xlabel="Standardized sample mean", ylabel="Density")
ax.legend()
print(f"Mean: {standardized.mean():.3f} · SD: {standardized.std():.3f}")
`, { scipy: true, seaborn: true }),

  bootstrap: example('In Python code, change percentile from 0.50 to 0.90 with the rest of the example as written. Compare Middle 90% of bootstrap estimates between runs. Which statistic has a wider interval for this sample?', 'Bootstrap distribution of the selected statistic', `
percentile = 0.50
data = rng.lognormal(3.35, 0.53, size=35)
resamples = rng.choice(data, size=(2000, len(data)), replace=True)
estimates = np.quantile(resamples, percentile, axis=1)
low, high = np.quantile(estimates, [0.05, 0.95])
ax = sns.histplot(x=estimates, color="#318978")
ax.axvspan(low, high, color="#1c876f", alpha=0.15)
ax.set(xlabel="Resampled time statistic (minutes)", ylabel="Resamples")
print(f"Observed: {np.quantile(data, percentile):.2f} minutes")
print(f"Middle 90% of bootstrap estimates: {low:.2f} to {high:.2f}")
`, { seaborn: true }),

  mc: example('In Python code, change budget in p, budget = 0.001, 1000 from 1000 to 4000. Compare Model standard error and Observed standard deviation across repeats. Leave budget at 4000 and reduce p to 0.0001. What happens to Expected hits?', 'Distribution of simulated probability estimates at the selected budget', `
p, budget = 0.001, 1000
hits = rng.binomial(budget, p, size=1800)
estimates = hits / budget
error = np.sqrt(p * (1-p) / budget)
ax = sns.histplot(x=hits, discrete=True, stat="probability", color="#318978")
ax.set(xlabel="Event hits in one run", ylabel="Probability")
print(f"Expected hits: {budget*p:g} · Model standard error: {error:.5f}")
print(f"Observed standard deviation across repeats: {estimates.std():.5f}")
`, { seaborn: true }),

  zero: example('In Python code, change tests from 20 to 2000 while keeping proposed_rate = 0.01. Compare Chance of no failures at 1.0% and One-sided 95% upper confidence limit. In which case would a 1% rate be harder to reconcile with no failures?', 'Probability of observing zero failures as a function of failure rate', `
tests = 20
proposed_rate = 0.01
x = np.linspace(0, 0.16, 600)
upper = 1 - 0.05 ** (1/tests)
fig, ax = plt.subplots()
ax.plot(x, (1-x)**tests, color="#137f72")
ax.axhline(0.05, linestyle="--", color="#637589")
ax.axvline(upper, linestyle="--", color="#873b21")
ax.set(xlabel="True failure rate", ylabel="Probability of zero observed failures")
print(f"Chance of no failures at {proposed_rate:.1%}: {(1-proposed_rate)**tests:.6g}")
print(f"One-sided 95% upper confidence limit: {upper:.3%}")
`, { simulated: false }),

  inventory: example('In Python code, change short_cost in demand_mean, short_cost, left_cost = 26, 5, 2 from 5 to 10. Leave the mean demand and leftover cost as written. Compare Lowest-loss stock level and Stockout risk at that level for the two runs.', 'Expected loss by inventory level with the minimizing level marked', `
demand_mean, short_cost, left_cost = 26, 5, 2
demand_values = np.arange(146)
probability = stats.poisson.pmf(demand_values, demand_mean)
stock_levels = np.arange(71)
difference = demand_values[None, :] - stock_levels[:, None]
losses = (short_cost * np.maximum(difference, 0) +
          left_cost * np.maximum(-difference, 0)) @ probability
best = stock_levels[losses.argmin()]
fig, ax = plt.subplots()
ax.plot(stock_levels, losses, color="#137f72")
ax.axvline(best, linestyle="--", color="#873b21")
ax.set(xlabel="Units of stock", ylabel="Expected loss (credits)")
print(f"Lowest-loss stock level: {best} · Stockout risk at that level: {stats.poisson.sf(best, demand_mean):.2%}")
`, { scipy: true, simulated: false }),

  staffing: example('The example compares two and three staff on the same simulated hours. In Python code, change mean_service in arrivals_per_hour, mean_service = 16, 9 from 9 to 11. Compare the overload estimates for two and three staff before and after the change.', 'Staff workload distribution with both tested capacity thresholds', `
arrivals_per_hour, mean_service = 16, 9
counts = rng.poisson(arrivals_per_hour, size=3000)
# The sum of k exponential service times follows a gamma law.
workload = rng.gamma(shape=counts, scale=mean_service)
ax = sns.histplot(x=workload, stat="density", color="#318978")
for staff in [2, 3]:
    capacity = 60 * staff
    ax.axvline(capacity, linestyle="--", label=f"{staff} staff")
    print(f"{staff} staff, overload estimate: {np.mean(workload > capacity):.2%}")
ax.set(xlabel="Staff-minutes required per hour", ylabel="Density")
ax.legend()
`, { seaborn: true }),

  stress: example('In Python code, set shape, chosen_deadline, late_penalty = "normal", 45, 40. Compare the costs printed for Standard and Expedited. Change only shape to "lognormal" and check which action now costs less.', 'Expected delivery costs by deadline for two actions', `
shape, chosen_deadline, late_penalty = "normal", 51, 70
times = np.linspace(32, 75, 200)
fig, ax = plt.subplots()
for label, mean_time, fixed_cost in [("Standard", 34, 0), ("Expedited", 29, 3)]:
    if shape == "normal":
        model = stats.norm(mean_time, 10)
    else:
        sigma = np.sqrt(np.log1p((10 / mean_time)**2))
        mu = np.log(mean_time) - sigma**2 / 2
        model = stats.lognorm(s=sigma, scale=np.exp(mu))
    cost = fixed_cost + late_penalty * model.sf(times)
    ax.plot(times, cost, label=label)
    print(f"{label}: {fixed_cost + late_penalty * model.sf(chosen_deadline):.2f} credits")
ax.axvline(chosen_deadline, linestyle="--", color="#777777")
ax.set(xlabel="Deadline (minutes)", ylabel="Expected cost (credits)")
ax.legend()
`, { scipy: true, simulated: false }),

  capstone: example('The example compares stock levels of 26 and 32 using the same demand draws. In Python code, change levels from [26, 32] to [29, 35]. Compare the mean cost and stockout rate printed for each stock level. Record the decision and the criterion you used in Your investigation.', 'Simulated cost distributions for the two capstone stock levels', `
demand = rng.poisson(lam=26, size=3000)
levels = [26, 32]
shortage_cost, leftover_cost = 5, 2
fig, ax = plt.subplots()
for stock in levels:
    cost = shortage_cost * np.maximum(demand-stock, 0) + leftover_cost * np.maximum(stock-demand, 0)
    sns.ecdfplot(x=cost, ax=ax, label=f"Stock {stock}")
    print(f"Stock {stock}: mean cost {cost.mean():.2f}, stockout rate {np.mean(demand > stock):.1%}")
ax.set(xlabel="Cost (credits)", ylabel="Cumulative probability")
ax.legend()
`, { seaborn: true })
};
