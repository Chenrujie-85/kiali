import * as React from 'react';
import { FormGroup, FormHelperText, HelperText, HelperTextItem, Switch, TextInput } from '@patternfly/react-core';
import { Abort } from '../../../types/IstioObjects';
import { HTTP_ABORT_TOOLTIP, wizardTooltip } from '../WizardHelp';
import { isValid } from 'utils/Common';

type Props = {
  aborted: boolean;
  abort: Abort;
  isValid: boolean;
  onAbort: (aborted: boolean, abort: Abort) => void;
};

const httpStatusMsg = '用于中止HTTP请求的HTTP状态码';

export class AbortFault extends React.Component<Props> {
  render() {
    return (
      <>
        <FormGroup label="添加HTTP中止" fieldId="abortSwitch">
          <Switch
            id="abortSwitch"
            label={' '}
            labelOff={' '}
            isChecked={this.props.aborted}
            onChange={() => this.props.onAbort(!this.props.aborted, this.props.abort)}
          />
          <span>{wizardTooltip(HTTP_ABORT_TOOLTIP)}</span>
        </FormGroup>
        {this.props.aborted && (
          <FormGroup label="中止比例" fieldId="abort-percentage">
            <TextInput
              value={this.props.abort.percentage?.value}
              id="abort-percentage"
              name="abort-percentage"
              onChange={(_event, value) => {
                let newValue = Number(value || 0);
                newValue = Number.isNaN(newValue) ? 0 : newValue;
                newValue = newValue < 0 ? 0 : newValue > 100 ? 100 : newValue;
                this.props.onAbort(this.props.aborted, {
                  percentage: {
                    value: newValue
                  },
                  httpStatus: this.props.abort.httpStatus
                });
              }}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>中止并提供错误状态码的请求的比例</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        )}
        {this.props.aborted && (
          <FormGroup label="HTTP状态码" fieldId="abort-status-code">
            <TextInput
              value={this.props.abort.httpStatus}
              id="abort-status-code"
              name="abort-status-code"
              validated={isValid(this.props.isValid)}
              onChange={(_event, value) => {
                let newValue = Number(value || 0);
                newValue = Number.isNaN(newValue) ? 0 : newValue;
                this.props.onAbort(this.props.aborted, {
                  percentage: this.props.abort.percentage,
                  httpStatus: newValue
                });
              }}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>{isValid(this.props.isValid) ? httpStatusMsg : httpStatusMsg}</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        )}
      </>
    );
  }
}
