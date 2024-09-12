import React from 'react';
import { Button, ButtonVariant, Modal, ModalVariant } from '@patternfly/react-core';
import { DestinationRuleC, K8sHTTPRoute, VirtualService } from '../../types/IstioObjects';

type Props = {
  destinationRules: DestinationRuleC[];
  virtualServices: VirtualService[];
  k8sHTTPRoutes: K8sHTTPRoute[];
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ConfirmDeleteTrafficRoutingModal: React.FunctionComponent<Props> = props => {
  function hasAnyPeerAuthn(drs: DestinationRuleC[]): boolean {
    return drs.filter(dr => !!dr.hasPeerAuthentication()).length > 0;
  }

  function getDeleteMessage() {
    const deleteMessage = '确定删除 ?';
    const deleteItems: JSX.Element[] = [];

    let i = 0;
    let vsMessage =
      props.virtualServices.length > 0
        ? `VirtualService${props.virtualServices.length > 1 ? 's' : ''}: '${props.virtualServices.map(
            vs => vs.metadata.name
          )}'`
        : '';
    deleteItems.push(<div key={`delete_item_${++i}`}>{vsMessage}</div>);

    let drMessage =
      props.destinationRules.length > 0
        ? `DestinationRule${props.destinationRules.length > 1 ? 's' : ''}: '${props.destinationRules.map(
            dr => dr.metadata.name
          )}'`
        : '';
    deleteItems.push(<div key={`delete_item_${++i}`}>{drMessage}</div>);

    let paMessage =
      props.destinationRules.length > 0 && hasAnyPeerAuthn(props.destinationRules)
        ? `PeerAuthentication${props.destinationRules.length > 1 ? 's' : ''}: '${props.destinationRules.map(
            dr => dr.metadata.name
          )}'`
        : '';
    deleteItems.push(<div key={`delete_item_${++i}`}>{paMessage}</div>);

    let k8sHTTPRouteMessage =
      props.k8sHTTPRoutes.length > 0
        ? `K8s HTTPRoute${props.k8sHTTPRoutes.length > 1 ? 's' : ''}: '${props.k8sHTTPRoutes.map(
            k8sr => k8sr.metadata.name
          )}'`
        : '';
    deleteItems.push(<div key={`delete_item_${++i}`}>{k8sHTTPRouteMessage}</div>);

    return (
      <>
        <div key="delete_items" style={{ marginBottom: 5 }}>
          {deleteMessage}
        </div>
        {deleteItems}
      </>
    );
  }

  return (
    <Modal
      variant={ModalVariant.small}
      title="确认删除流量路由 ?"
      isOpen={props.isOpen}
      onClose={props.onCancel}
      data-test="delete-traffic-routing-modal"
      actions={[
        <Button key="confirm" variant={ButtonVariant.danger} onClick={props.onConfirm} data-test={'confirm-delete'}>
          删除
        </Button>,
        <Button key="cancel" variant={ButtonVariant.secondary} isInline onClick={props.onCancel}>
          取消
        </Button>
      ]}
    >
      {getDeleteMessage()}
    </Modal>
  );
};
