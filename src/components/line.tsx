import React, { useEffect } from 'react';
import { Line, LineOptions } from '@antv/g2plot';

type XLineProps = {
  attributes: LineOptions;
  className?: string;
};

const XLine: React.FC<XLineProps> = props => {
  const { attributes, className } = props;

  const container = React.useRef<HTMLDivElement>();
  const lineRef = React.useRef<Line>();

  useEffect(() => {
    if (lineRef?.current) {
      lineRef?.current.destroy();
      lineRef.current = null;
    }
    const line = new Line(container.current, {
      autoFit: true,
      color: [
        '#9270CA',
        '#269A99',
        '#5AD8A6',
        '#F6BD16',
        '#6DC8EC',
        '#FF9D4D',
        '#FF99C3',
        '#BDD2FD',
        '#BEDED1',
        '#C2C8D5',
        '#EFE0B5',
        '#F6C3B7',
        '#B5D7E5',
        '#D3C6EA',
        '#F4DBC6',
        '#AAD8D8',
        '#F2CADA',
      ],
      xField: '',
      yField: '',
      data: [],
      ...attributes,
    });
    line.render();
    lineRef.current = line;
  }, []);

  useEffect(() => {
    if (lineRef.current) {
      const line = lineRef.current;
      line.update(attributes);
    }
  }, [attributes]);

  useEffect(() => {
    if (lineRef.current) {
      const line = lineRef.current;
      line.changeData(attributes.data);
    }
  }, [attributes.data]);

  return <div data-type="line" ref={container} className={className} />;
};

export default XLine;
