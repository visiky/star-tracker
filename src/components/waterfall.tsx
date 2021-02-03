import React, { useEffect } from 'react';
import { Waterfall, WaterfallOptions } from '@antv/g2plot';

type XWaterfallProps = {
  attributes: WaterfallOptions;
  className?: string;
};

const XWaterfall: React.FC<XWaterfallProps> = props => {
  const { attributes, className } = props;

  const container = React.useRef<HTMLDivElement>();
  const waterfallRef = React.useRef<Waterfall>();

  useEffect(() => {
    if (waterfallRef?.current) {
      waterfallRef?.current.destroy();
      waterfallRef.current = null;
    }

    const waterfall = new Waterfall(container.current, {
      autoFit: true,
      xField: '',
      yField: '',
      data: [],
      label: {
        style: { fill: 'rgba(0,0,0,0.45)' },
      },
      tooltip: {
        customContent: (title, items) => {
          const item = items?.[0];
          return `<div class="g2-tooltip-title">${title}</div>
            <ul class="g2-tooltip-list">
              <li class="g2-tooltip-list-item">
                <span class="g2-tooltip-marker" style="background:${item?.color}"></span>
                <span class="g2-tooltip-name">${item?.name}</span>
                <span class="g2-tooltip-value">${item?.data?.['$$absoluteField$$']}</span>
              </li>
            </ul>`;
        },
      },
      ...attributes,
    });
    waterfall.render();
    waterfallRef.current = waterfall;
  }, []);

  useEffect(() => {
    if (waterfallRef.current) {
      const waterfall = waterfallRef.current;
      waterfall.update(attributes);
    }
  }, [attributes]);

  return (
    <div
      data-type="waterfall"
      ref={container}
      className={className}
    />
  );
};

export default XWaterfall;
