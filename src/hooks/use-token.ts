import { message } from 'antd';
import { useEffect, useState } from 'react';
import { copyToClipboard } from '../utils/copy-to-board';

const KEY = 'personal_github_token';

export const useToken = (): [string, (k: string) => void, () => void] => {
  const [localToken, setLocalToken] = useState<string>();

  useEffect(() => {
    const token = localStorage.getItem(KEY);
    if (localStorage && token) {
      setLocalToken(token);
    } else {
      if (!token && typeof window !== `undefined`) {
        // Go: https://github.com/settings/tokens
        const result = window.prompt(
          'Edit access token, go: https://github.com/settings/tokens'
        );
        saveToken(result);
      }
    }
  }, []);

  /**
   * 获取 token, 并且复制到剪贴板 📋
   */
  const copyToken = () => {
    if (localToken) {
      copyToClipboard(localToken);
      message.info('Token has been copy to clipboard');
    } else {
      message.error(
        'Something unexpected happened when copy token to clipboard'
      );
    }
  };

  /**
   * 保存 token
   * @param token
   */
  const saveToken = (t: string) => {
    if (t) {
      setLocalToken(t);
      localStorage && localStorage.setItem(KEY, t);
      message.info('Token has been saved');
    }
  };

  return [localToken, saveToken, copyToken];
};
