import React, { useState } from 'react';
import { Modal, Input } from 'antd';

type Props = {
  visible: boolean;
  onEditOk: (v: string) => void;
  onCancel: () => void;
};

/**
 * Token 编辑弹窗
 */
export const TokenModal: React.FC<Props> = props => {
  const [value, setValue] = useState<string>();

  return (
    <Modal
      title="Edit GitHub access token"
      onOk={() => props.onEditOk(value)}
      okText="保存"
      onCancel={props.onCancel}
      visible={props.visible}
      cancelButtonProps={{ style: { visibility: 'hidden' } }}
    >
      <p>
        Go{' '}
        <a href="https://github.com/settings/tokens" target="_blank">
          https://github.com/settings/tokens
        </a>{' '}
        to get personal token.
      </p>
      <p>
        <b>Token will be stored in your local storage</b>
      </p>
      <Input onChange={e => setValue(e.target.value)} />
    </Modal>
  );
};
