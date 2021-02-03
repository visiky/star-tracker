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
