# MRT Midpoint Finder

Not sure where to meet your friends next time? Input in everyone's MRT stop and this web application tries to find the best midpoint based on MRT travelling time.

Made with React.

## Description

Given a list of MRT stations $ x_1, x_2, \dots, x_n $, the app tries to find  station $y$ that each minimises one of the following objective functions:
1. $f(x) = \sum_{i=1}^{n} t(x_i, y) $,
2. $f(x) = \sum_{i=1}^{n} t(x_i, y) + \lambda \sum_{i=1}^{n} (t(x_i, y) - \overline t)^2$

where 
$t(a,b)$ is the time taken to travel from station $a$ to $b$, 
$\overline t = \frac 1 n \sum_{i=1}^{n} t(x_i, y) $,
$\lambda$ is a tuning parameter penalising variance in the time taken.

The first function seeks to minimise the sum of the time taken , while the second function adds a penalty to large variances in time taken, ensuring no one person has to spend alot more time travelling than someone else.

The app also lets you choose a custom destination as a third option to compare with the above two options.

## Getting Started

1. Clone the repo
```bash
git clone https://github.com/hwh1771/mrt-midpoint-finder.git
```

2. Install packages
```bash
npm install
```

3. Run.
```
npm run dev
```

## Roadmap

[ ] Add a network map showing all starting points and the suggested midpoint.

[ ] Add LRTs.

[ ] Add slider to let user adjust tuning parameter $\lambda$ themselves.

## Acknowledgments

* [Time between stations from this reddit post.](https://www.reddit.com/r/singapore/comments/kmsbl4/challenge_accepted_122_mrt_stations_rta/)
