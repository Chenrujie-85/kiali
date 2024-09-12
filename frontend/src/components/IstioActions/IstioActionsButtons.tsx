import * as React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { triggerRefresh } from '../../hooks/refresh';

type Props = {
  canUpdate: boolean;
  objectName: string;
  onCancel: () => void;
  onOverview: () => void;
  onRefresh: () => void;
  onUpdate: () => void;
  overview: boolean;
  readOnly: boolean;
  showOverview: boolean;
};

export const IstioActionButtons: React.FC<Props> = (props: Props) => {
  const handleRefresh = () => {
    props.onRefresh();
    triggerRefresh();
  };

  return (
    <>
      <span style={{ float: 'left', padding: '0.5rem' }}>
        {!props.readOnly && (
          <span style={{ paddingRight: '0.25rem' }}>
            <Button variant={ButtonVariant.primary} isDisabled={!props.canUpdate} onClick={props.onUpdate}>
              保存
            </Button>
          </span>
        )}

        <span style={{ paddingRight: '0.25rem' }}>
          <Button variant={ButtonVariant.secondary} onClick={handleRefresh}>
            重新加载
          </Button>
        </span>

        <span style={{ paddingRight: '0.25rem' }}>
          <Button variant={ButtonVariant.secondary} onClick={props.onCancel}>
            {props.readOnly ? '关闭' : '取消'}
          </Button>
        </span>
      </span>

      {props.showOverview && (
        <span style={{ float: 'right', padding: '0.5rem' }}>
          <span style={{ paddingLeft: '0.25rem' }}>
            <Button variant={ButtonVariant.link} onClick={props.onOverview}>
              {props.overview ? '关闭总览' : '显示总览'}
            </Button>
          </span>
        </span>
      )}
    </>
  );
};
