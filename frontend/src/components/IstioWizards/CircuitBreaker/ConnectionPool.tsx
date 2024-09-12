import * as React from 'react';
import { FormGroup, FormHelperText, HelperText, HelperTextItem, Switch, TextInput } from '@patternfly/react-core';
import { ConnectionPoolSettings } from '../../../types/IstioObjects';
import { CONNECTION_POOL_TOOLTIP, wizardTooltip } from '../WizardHelp';

type Props = {
  isConnectionPool: boolean;
  connectionPool: ConnectionPoolSettings;
  onConnectionPool: (isConnectionPool: boolean, connectionPool: ConnectionPoolSettings) => void;
};

export class ConnectionPool extends React.Component<Props> {
  render() {
    return (
      <>
        <FormGroup label="添加连接池" fieldId="cpSwitch">
          <Switch
            id="cpSwitch"
            label={' '}
            labelOff={' '}
            isChecked={this.props.isConnectionPool}
            onChange={() => this.props.onConnectionPool(!this.props.isConnectionPool, this.props.connectionPool)}
          />
          <span>{wizardTooltip(CONNECTION_POOL_TOOLTIP)}</span>
        </FormGroup>
        {this.props.isConnectionPool && (
          <FormGroup label="最大连接数" fieldId="maxConnections">
            <TextInput
              value={this.props.connectionPool.tcp?.maxConnections}
              id="maxConnections"
              name="maxConnections"
              onChange={(_event, value) => {
                let newValue = Number(value || 0);
                newValue = Number.isNaN(newValue) ? 0 : newValue;
                const cp = this.props.connectionPool;
                if (!cp.tcp) {
                  cp.tcp = {};
                }
                cp.tcp.maxConnections = newValue;
                this.props.onConnectionPool(this.props.isConnectionPool, cp);
              }}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>向目标主机建立的最大HTTP1/TCP连接数</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        )}
        {this.props.isConnectionPool && (
          <FormGroup label="HTTP1最大请求挂起数" fieldId="http1MaxPendingRequests">
            <TextInput
              value={this.props.connectionPool.http?.http1MaxPendingRequests}
              id="http1MaxPendingRequests"
              name="http1MaxPendingRequests"
              onChange={(_event, value) => {
                let newValue = Number(value || 0);
                newValue = Number.isNaN(newValue) ? 0 : newValue;
                const cp = this.props.connectionPool;
                if (!cp.http) {
                  cp.http = {};
                }
                cp.http.http1MaxPendingRequests = newValue;
                this.props.onConnectionPool(this.props.isConnectionPool, cp);
              }}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>向目标主机发送的被挂起的HTTP1请求的最大数量</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        )}
      </>
    );
  }
}
