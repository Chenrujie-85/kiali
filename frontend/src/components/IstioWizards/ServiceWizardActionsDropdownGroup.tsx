import * as React from 'react';
import { Divider, DropdownGroup, DropdownItem, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { serverConfig } from 'config';
import { DestinationRule, getWizardUpdateLabel, K8sHTTPRoute, VirtualService } from 'types/IstioObjects';
import { canDelete, ResourcePermissions } from 'types/Permissions';
import {
  SERVICE_WIZARD_ACTIONS,
  WIZARD_K8S_REQUEST_ROUTING,
  WIZARD_EDIT_ANNOTATIONS,
  WIZARD_TITLES,
  WizardAction,
  WizardMode
} from './WizardActions';
import { hasServiceDetailsTrafficRouting } from '../../types/ServiceInfo';
import { groupMenuStyle } from 'styles/DropdownStyles';
import { kialiStyle } from 'styles/StyleUtils';

export const DELETE_TRAFFIC_ROUTING = 'delete_traffic_routing';

type Props = {
  annotations?: { [key: string]: string };
  destinationRules: DestinationRule[];
  isDisabled?: boolean;
  istioPermissions: ResourcePermissions;
  k8sHTTPRoutes: K8sHTTPRoute[];
  onAction?: (key: WizardAction, mode: WizardMode) => void;
  onDelete?: (key: string) => void;
  virtualServices: VirtualService[];
};

const optionDisabledStyle = kialiStyle({
  cursor: 'not-allowed',
  $nest: {
    '& button': {
      pointerEvents: 'none'
    }
  }
});

const dividerStyle = kialiStyle({
  paddingTop: '0.5rem'
});

export const ServiceWizardActionsDropdownGroup: React.FunctionComponent<Props> = (props: Props) => {
  const updateLabel = getWizardUpdateLabel(props.virtualServices, props.k8sHTTPRoutes);

  const hasTrafficRouting = () => {
    return hasServiceDetailsTrafficRouting(props.virtualServices, props.destinationRules, props.k8sHTTPRoutes);
  };

  const handleActionClick = (eventKey: string) => {
    if (props.onAction) {
      props.onAction(eventKey as WizardAction, updateLabel.length === 0 ? 'create' : 'update');
    }
  };

  const getDropdownItemTooltipMessage = (isGatewayAPI: boolean): string => {
    if (serverConfig.deployment.viewOnlyMode) {
      return '用户没有权限';
    } else if (hasTrafficRouting()) {
      return '此服务已存在流量路由规则';
    } else if (isGatewayAPI) {
      return 'K8s Gateway API不可用';
    } else {
      return "该服务的流量路由规则不存在";
    }
  };

  const actionItems = SERVICE_WIZARD_ACTIONS.map(eventKey => {
    const isGatewayAPIEnabled = eventKey === WIZARD_K8S_REQUEST_ROUTING ? serverConfig.gatewayAPIEnabled : true;

    const enabledItem =
      isGatewayAPIEnabled &&
      !props.isDisabled &&
      (!hasTrafficRouting() || (hasTrafficRouting() && updateLabel === eventKey));

    const wizardItem = (
      <DropdownItem
        key={eventKey}
        component="button"
        isDisabled={!enabledItem}
        onClick={() => handleActionClick(eventKey)}
        data-test={eventKey}
      >
        {WIZARD_TITLES[eventKey]}
      </DropdownItem>
    );

    // An Item is rendered under two conditions:
    // a) No traffic -> Wizard can create new one
    // b) Existing traffic generated by the traffic -> Wizard can update that scenario
    // Otherwise, the item should be disabled
    if (!enabledItem) {
      return (
        <Tooltip
          key={'tooltip_' + eventKey}
          position={TooltipPosition.left}
          content={<>{getDropdownItemTooltipMessage(!isGatewayAPIEnabled)}</>}
        >
          <div className={optionDisabledStyle}>{wizardItem}</div>
        </Tooltip>
      );
    } else {
      return wizardItem;
    }
  });

  // Annotations
  if (props.annotations) {
    actionItems.push(
      <DropdownItem
        key={WIZARD_EDIT_ANNOTATIONS}
        component="button"
        onClick={() => handleActionClick(WIZARD_EDIT_ANNOTATIONS)}
        data-test={WIZARD_EDIT_ANNOTATIONS}
      >
        {serverConfig.kialiFeatureFlags.istioAnnotationAction && !serverConfig.deployment.viewOnlyMode
          ? '编辑 Annotations'
          : '查看 Annotations'}
      </DropdownItem>
    );
  }

  actionItems.push(<Divider className={dividerStyle} key="actions_separator" />);

  const deleteDisabled = !canDelete(props.istioPermissions) || !hasTrafficRouting() || props.isDisabled;

  let deleteDropdownItem = (
    <DropdownItem
      key={DELETE_TRAFFIC_ROUTING}
      component="button"
      onClick={() => {
        if (props.onDelete) {
          props.onDelete(DELETE_TRAFFIC_ROUTING);
        }
      }}
      isDisabled={deleteDisabled}
      data-test={DELETE_TRAFFIC_ROUTING}
    >
      删除流量路由规则
    </DropdownItem>
  );

  if (deleteDisabled) {
    deleteDropdownItem = (
      <Tooltip
        key={'tooltip_' + DELETE_TRAFFIC_ROUTING}
        position={TooltipPosition.left}
        content={<>{getDropdownItemTooltipMessage(false)}</>}
      >
        <div style={{ display: 'inline-block', cursor: 'not-allowed' }}>{deleteDropdownItem}</div>
      </Tooltip>
    );
  }

  actionItems.push(deleteDropdownItem);

  const label = updateLabel === '' ? '创建' : '更新';

  return <DropdownGroup key={`group_${label}`} label={label} className={groupMenuStyle} children={actionItems} />;
};
