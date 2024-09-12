import React from 'react';
import { Chip } from '@patternfly/react-core';

interface Shortcut {
  shortcut: string;
  description: string;
}

const shortcuts: Shortcut[] = [
  { shortcut: '鼠标滚轮', description: '缩放' },
  { shortcut: '单击 + 拖动', description: '平移' },
  { shortcut: 'Shift + 拖动', description: '选中一块区域' },
  { shortcut: '鼠标右键', description: '节点的上下文菜单' },
  { shortcut: '单击', description: '侧面板中边和节点的详细信息' },
  { shortcut: '双击', description: '深入查看节点详细信息图' }
];

const makeShortcut = (shortcut: Shortcut): JSX.Element => {
  return (
    <div style={{ display: 'flex', marginBottom: '10px' }}>
      <div style={{ flex: '40%' }}>
        <Chip isReadOnly>{shortcut.shortcut}</Chip>
      </div>
      <div style={{ flex: '60%' }}>{shortcut.description}</div>
    </div>
  );
};

export const GraphShortcuts = (): JSX.Element => (
  <>
    {shortcuts.map(
      (s: Shortcut): JSX.Element => {
        return makeShortcut(s);
      }
    )}
  </>
);
