import React, { useState, useMemo, useRef } from 'react';
import { Select, Spin, Tabs, Popover, InputNumber } from 'antd';
import * as _ from 'lodash';
import axios, { CancelTokenSource } from 'axios';
import Layout from '../layouts/layout';
import Line from '../components/line';
import Detail from '../components/detail-page';
import { TokenModal } from '../components/token-modal';
import { useToken } from '../hooks/use-token';
import { useFetchData } from '../hooks/use-fetch-data';
import { useReposity } from '../hooks/use-reposity';

import './index.less';

const { Option } = Select;

type Datum = { date: string; starNum: number; repo: string };

const Page = () => {
  /**
   * 获取 token
   */
  const [localToken, saveToken, copyToken] = useToken();

  /**
   * 获取数据
   */
  const [fetchData] = useFetchData();

  /**
   * token 编辑弹窗
   */
  const [tokenModalVisible, setTokenModalVisible] = useState(false);

  /**
   * 获取仓库可选项
   */
  const [REPOSITIES, addRepo, removeRepo] = useReposity();

  const queryToken = useRef<CancelTokenSource>();

  /** 仓库名 */
  const [repos, setRepos] = useState([]);
  /** 数据 */
  const [data, setData] = useState<Datum[]>([]);
  /** 元数据 */
  const [metaData, setMetaData] = useState<Record<string, Datum[]>>({});
  /** loading */
  const [loading, setLoading] = useState(false);
  /** 抽样数量 */
  const [sampleNum, setSampleNum] = useState(500);

  /** 发起 repo stars 的请求 */
  const handleChange = value => {
    const r = _.filter(value, v => repos.indexOf(v) === -1);

    if (r[0]) {
      const repo = r[0];
      setLoading(true);
      addRepo(repo);

      const source = axios.CancelToken.source();
      queryToken.current = source;

      fetchData(repo, localToken, sampleNum, source.token)
        .then(({ dailyStarHistory, starHistory }) => {
          const newData: Datum[] = data.concat(
            starHistory.map(d => ({ ...d, repo }))
          );
          newData.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setData(newData);
          setMetaData({
            ...metaData,
            [repo]: dailyStarHistory,
          });
        })
        .finally(() => {
          setLoading(false);
          queryToken.current = null;
        });
      setRepos(value);
    }
  };

  /** 取消展示 */
  const handleDeselect = repo => {
    setRepos(repos.filter(r => r !== repo));
    setData(data.filter(d => d.repo !== repo));
  };

  /** 保存 toekn */
  const handleSaveToken = (v: string) => {
    saveToken(v);
  };

  const lineData = useMemo(() => {
    return data;
  }, [data]);

  return (
    <Layout>
      <Tabs
        type="card"
        className="full"
        tabBarExtraContent={{
          right: (
            <div
              onClick={() => setTokenModalVisible(true)}
              style={{ cursor: 'pointer' }}
            >
              Edit access token
            </div>
          ),
        }}
      >
        <Tabs.TabPane
          forceRender={true}
          tab={
            <span>
              Trend with line
              <Popover
                title={
                  <div>
                    Tips:{' '}
                    <a href="https://docs.github.com/en/rest/reference/rate-limit">
                      Rate limit for github API
                    </a>
                  </div>
                }
                content={
                  <ul className="small-tips" onClick={e => e.stopPropagation()}>
                    <li>
                      1. The maximum number of query requests is limited to 500
                      by default (When the total number of stars exceeds 30 *
                      500, sampling will be performed to obtain data)
                    </li>
                    <li>
                      👉 Custom limit number:
                      <InputNumber
                        value={sampleNum}
                        onChange={v =>
                          setSampleNum(_.isNumber(Number(v)) ? Number(v) : 500)
                        }
                        max={1333}
                      />
                    </li>
                    <li>
                      2. Data would be cached. Press the 'reload' button on your
                      web browser to refresh the site and get the latest data.
                    </li>
                  </ul>
                }
                overlayStyle={{ maxWidth: '360px' }}
                placement="right"
              >
                <span style={{ paddingLeft: '8px' }}>💡</span>
              </Popover>
            </span>
          }
          key="1"
        >
          <div className="toolbar">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              onChange={handleChange}
              onDeselect={handleDeselect}
              // 加载中不让选择
              disabled={loading}
              size="middle"
              optionLabelProp="label"
            >
              {_.map([...REPOSITIES], opt => {
                return (
                  <Option value={opt} key={opt}>
                    <div>
                      {opt}
                      <span
                        className="append-action"
                        onClick={e => {
                          e.stopPropagation();
                          removeRepo(opt);
                        }}
                      >
                        remove
                      </span>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </div>
          <Spin
            spinning={loading}
            className="full"
            // @ts-ignore
            tip={
              <div>
                <div>
                  <span>Loading data</span>
                  <span style={{ padding: '0 8px' }}>|</span>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      queryToken.current?.cancel();
                      setLoading(false);
                    }}
                  >
                    Cancel query
                  </span>
                </div>
                <div style={{ fontSize: '12px' }}>
                  <span style={{ color: 'rgba(0,0,0,0.65)' }}>
                    first time will take a little time...
                  </span>
                </div>
              </div>
            }
          >
            <div className="result-wrapper">
              {lineData.length ? (
                <Line
                  className="full"
                  attributes={{
                    data: lineData,
                    xField: 'date',
                    yField: 'starNum',
                    seriesField: 'repo',
                    smooth: true,
                    tooltip: {
                      shared: true,
                    },
                  }}
                />
              ) : null}
            </div>
          </Spin>
        </Tabs.TabPane>
        <Tabs.TabPane
          forceRender={true}
          tab={
            <span>
              Details with waterfall
              <Popover
                title="What is waterfall?"
                content={
                  <span
                    className="small-tips"
                    onClick={e => e.stopPropagation()}
                  >
                    Waterfall chart is a form of data visualization that helps
                    in understanding the cumulative effect of sequentially
                    introduced positive or negative values.
                  </span>
                }
                overlayStyle={{ maxWidth: '320px' }}
                placement="right"
              >
                <span style={{ paddingLeft: '8px' }}>💡</span>
              </Popover>
            </span>
          }
          key="2"
        >
          <Detail
            repos={repos}
            sourceData={metaData}
            className="detail-result"
          />
        </Tabs.TabPane>
      </Tabs>
      <TokenModal
        visible={tokenModalVisible}
        onCancel={() => setTokenModalVisible(false)}
        onEditOk={v => {
          handleSaveToken(v);
          setTokenModalVisible(false);
        }}
      />
    </Layout>
  );
};

export default Page;
