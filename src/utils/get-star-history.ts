import axios from 'axios';
import _ from 'lodash';
import { addDates, formatDate } from './date';

/**
 * 将 ‘2019-08-21T04:06:42Z’ 格式化为 `YYYY-MM-DD`
 */
function getDate(date?: string) {
  return (date ? new Date(date) : new Date()).toISOString().slice(0, 10);
}

/**
 * get star history
 * @param {String} repo - eg: 'timqian/jsCodeStructure'
 * @param {String} token - github access token
 * @return {Array} history - eg: [{date: 2015-3-1,starNum: 12}, ...]
 */
async function getStarHistory(
  repo: string,
  token: string,
  sampleNum = 500 /** number of sample requests to do */,
  cancelToken = null
) {
  const axiosGit = axios.create({
    headers: {
      Accept: 'application/vnd.github.v3.star+json',
      Authorization: token ? `token ${token}` : undefined,
    },
    cancelToken,
  });

  /**
   * generate Urls and pageNums
   * @param {sting} repo - eg: 'timqian/jsCodeStructure'
   * @return {object} {sampleUrls, pageIndexes} - urls to be fatched(length <=10) and page indexes
   */
  async function generateUrls(repo) {
    const initUrl = `https://api.github.com/repos/${repo}/stargazers`; // used to get star info

    try {
      const initRes = await axiosGit.get(initUrl);

      console.info('initRes', initRes);

      if (initRes.status !== 200) {
        throw new Error(JSON.stringify(initRes));
      }

      const link = initRes.headers.link;

      // total page number
      const pageNum = link
        ? Number(/next.*?page=(\d*).*?last/.exec(link)[1])
        : 1;

      // used to calculate total stars for this page
      let pageIndexes = [];
      if (pageNum <= sampleNum) {
        pageIndexes = _.range(1, pageNum);
      } else {
        // 前半部分抽样，后半部分 按照 step=1 请求
        const breakpoint = pageNum - sampleNum / 2;
        pageIndexes = _.range(
          1,
          breakpoint,
          Math.ceil((breakpoint / sampleNum) * 2)
        );
        pageIndexes.push(..._.range(breakpoint + 1, pageNum));
      }

      // store sampleUrls to be requested
      const sampleUrls = pageIndexes.map(
        pageIndex => `${initUrl}?page=${pageIndex}`
      );
      return { firstPage: initRes, sampleUrls, pageNum, pageIndexes };
    } catch (e) {
      throw new Error(e);
    }
  }

  const { sampleUrls, firstPage, pageIndexes } = await generateUrls(repo);

  // promises to request sampleUrls
  // @ts-ignore
  const getArray = [firstPage].concat(sampleUrls.map(url => axiosGit.get(url)));

  const resArray = await Promise.all(getArray);

  if (resArray[0].data === undefined || resArray[0].data.length == 0) {
    throw new Error('Repo has no star history');
  }

  const result = resArray
    .slice(1)
    .reduce((acc, r) => acc.concat(r.data), [])
    .map(d => ({ ...d, starred_at: getDate(d.starred_at) }));

  // we have every starredEvent: we can use them to generate 15 (sampleNum) precise points
  const starredEvents = [...result];

  if (result.length) {
    pageIndexes.reduce((a, b, idx) => {
      const diff = b - a - 1;
      if (idx !== 0 && diff > 0) {
        const item = result[idx * 30];
        starredEvents.push(...new Array(30 * diff).fill(item));
      }
      return b;
    }, 0);
  }

  const dailyStarHistory = _.map(
    _.groupBy(starredEvents, 'starred_at'),
    (d, date) => {
      return { date, starNum: d.length };
    }
  );

  const starHistory = [];
  _.reduce(
    dailyStarHistory,
    (a, b) => {
      const total = b?.starNum + a;
      starHistory.push({ ...b, starNum: total });
      return total;
    },
    0
  );

  // 由于 github rest API 限制，无法获取全量 > 40000
  // Better view for less star repos (#28) and for repos with too much stars (>40000)
  const resForStarNum = await axiosGit.get(
    `https://api.github.com/repos/${repo}`
  );

  const starNumToday = resForStarNum.data.stargazers_count;
  const today = getDate();

  const lastStarNum = _.last(starHistory).starNum;
  const lastStarDate = _.last(starHistory).date;

  if (lastStarNum < starNumToday) {
    dailyStarHistory.push({
      date: today,
      starNum: starNumToday - lastStarNum,
    });
    const diffDays =
      (new Date().getTime() - new Date(lastStarDate).getTime()) /
      (1000 * 60 * 60 * 24);

    const ratio = (starNumToday - lastStarNum) / diffDays;
    let d = new Date(lastStarDate);
    let starNum = lastStarNum;
    if (ratio >= 1) {
      for (let i = 0; i < diffDays; i++) {
        // 加上一天
        d = addDates(d);
        starNum += i % 2 ? Math.floor(ratio) : Math.ceil(ratio);
        starHistory.push({
          date: formatDate(d),
          starNum: Math.min(starNum, starNumToday),
        });
      }
    } else {
      for (let i = 0; i < starNumToday - lastStarNum; i++) {
        // 加上一天
        d = addDates(d, i % 2 ? Math.floor(1 / ratio) : Math.ceil(1 / ratio));
        starNum += 1;
        starHistory.push({
          date: formatDate(d),
          starNum: 1,
        });
      }
    }
    starHistory.push({
      date: today,
      starNum: starNumToday,
    });
  }

  return { starHistory, dailyStarHistory };
}

export { getStarHistory };
