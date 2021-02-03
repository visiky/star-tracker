import { notification } from 'antd';
import { useRef } from 'react';
import * as _ from 'lodash';
import { getStarHistory } from '../utils/getStarHistory';

type Data = {
  dailyStarHistory: any[];
  starHistory: any[];
  sampleNum?: number;
};

/**
 * Get data from specific repository, get from cache firstly.
 */
export const useFetchData = (): [
  (
    repo: string,
    token: string,
    sampleNum?: number,
    cancelToken?: any
  ) => Promise<Data>
] => {
  const cacheMap = useRef(new Map());

  const fetchData = (repo: string, token: string, sampleNum, cancelToken) => {
    const cache = cacheMap.current.get(repo);
    if (cache && cache.sampleNum === sampleNum) {
      return Promise.resolve(cache);
    }

    return getStarHistory(repo, token, sampleNum, cancelToken)
      .then(({ dailyStarHistory, starHistory }) => {
        cacheMap.current.set(repo, { dailyStarHistory, starHistory });
        return { dailyStarHistory, starHistory, sampleNum };
      })
      .catch(e => {
        if (_.endsWith(e.message, 'status code 401')) {
          notification.error({
            message: 'Please enter your access token',
          });
        } else {
          notification.error({
            message: e.message,
          });
        }
      });
  };

  return [fetchData];
};
