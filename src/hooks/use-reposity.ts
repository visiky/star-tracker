import { useEffect, useRef, useState } from 'react';
import * as _ from 'lodash';

const KEY = 'STAR_REPOSITY';

const updateLocalStorage = set => {
  const repos = [...set.values()];
  if (localStorage) {
    localStorage.setItem(KEY, repos.length ? JSON.stringify(repos) : null);
  }
};

/**
 * 获取缓存搜索过的仓库
 */
export const useReposity = (): [
  string[],
  (r: string) => void,
  (r: string) => void
] => {
  const set = useRef(new Set<string>());
  const [reposities, setReposities] = useState([]);

  /**
   * 初始化
   */
  useEffect(() => {
    let repos = null;
    if (localStorage) {
      repos = localStorage.getItem(KEY);
    }
    repos = repos || '["antvis/g2plot","antvis/g2","antvis/g6","antvis/x6"]';
    try {
      repos = JSON.parse(repos);
      _.forEach(repos, r => set.current.add(r));
      setReposities([...set.current.values()]);
    } catch (e) {
      console.error('parse', repos, 'error');
    }
  }, []);

  /**
   * 添加可选项
   * @param r
   */
  const addOptions = (r: string) => {
    const setRef = set.current;

    setRef.add(r);
    setReposities([...setRef.values()]);
    updateLocalStorage(setRef);
  };

  /**
   * 移除可选项
   */
  const removeOptions = (r: string) => {
    const setRef = set.current;

    setRef.delete(r);
    setReposities([...setRef.values()]);
    updateLocalStorage(setRef);
  };

  return [reposities, addOptions, removeOptions];
};
