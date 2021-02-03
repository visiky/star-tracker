import React, { useMemo, useState, useEffect } from 'react';
import { Select, Radio, DatePicker } from 'antd';
import _ from 'lodash';
import Waterfall from './waterfall';
import { isAfter } from '../utils/date';

const { RangePicker } = DatePicker;
const { Option } = Select;

type Props = {
  repos: string[];
  sourceData?: Record<string, { date: string; starNum: number }[]>;
};

function filterData(data, range) {
  return data.filter(d => {
    const [start, end] = range;
    return (!start || isAfter(d.date, start)) && (!end || isAfter(end, d.date));
  });
}

const Detail: React.FC<Props> = ({ repos, sourceData }) => {
  /** 日期范围 */
  const [dateRange, setDateRange] = useState<string[]>([]);

  /** 当前选中的仓库名，use for waterfall */
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  /** 时间粒度 */
  const [granularity, setGranularity] = useState('month');

  useEffect(() => {
    setSelectedRepo(repos[0]);
  }, [repos]);

  const waterfallData = useMemo(() => {
    const datas = sourceData[selectedRepo];
    if (datas?.length) {
      return filterData(
        _.map(
          _.groupBy(datas, item =>
            _.slice(item.date, 0, granularity === 'year' ? 4 : 7).join('')
          ),
          (v, k) => {
            return {
              date: k,
              starNum: _.reduce(v, (a, b) => a + b.starNum, 0),
            };
          }
        ),
        dateRange
      );
    }
    return [];
  }, [selectedRepo, granularity, sourceData, dateRange]);

  const onGranularityChange = e => {
    setGranularity(e.target.value);
  };

  return (
    <React.Fragment>
      <div className="toolbar">
        <Select
          style={{ width: '220px' }}
          value={selectedRepo}
          size="middle"
          placeholder="Please select a repo"
          onChange={v => setSelectedRepo(v as string)}
        >
          {repos.map(opt => {
            return (
              <Option value={opt} key={opt}>
                {opt}
              </Option>
            );
          })}
        </Select>
        <div>
          <span className="component-label">Granularity</span>
          <Radio.Group
            options={['year', 'month']}
            value={granularity}
            onChange={onGranularityChange}
            optionType="button"
            size="middle"
          />
        </div>
        <div style={{ position: 'absolute', right: 0 }}>
          <RangePicker
            format="YYYY-MM-DD"
            allowEmpty={[true, true]}
            onChange={(moments, dateStrings) => setDateRange(dateStrings)}
          />
        </div>
      </div>
      <div className="result-wrapper">
        {waterfallData.length ? (
          <Waterfall
            className="full"
            attributes={{
              data: waterfallData,
              xField: 'date',
              yField: 'starNum',
              appendPadding: [24, 0, 0, 0],
              legend: false,
            }}
          />
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default Detail;
