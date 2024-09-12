import * as React from 'react';
import { FormGroup, FormHelperText, HelperText, HelperTextItem, Switch, TextInput } from '@patternfly/react-core';
import { OutlierDetection as OutlierDetectionProps } from '../../../types/IstioObjects';
import { OUTLIER_DETECTION_TOOLTIP, wizardTooltip } from '../WizardHelp';

type Props = {
  isOutlierDetection: boolean;
  outlierDetection: OutlierDetectionProps;
  onOutlierDetection: (isOutlierDetection: boolean, outlierDetection: OutlierDetectionProps) => void;
};

export class OutlierDetection extends React.Component<Props> {
  render() {
    return (
      <>
        <FormGroup label="添加异常检测" fieldId="odSwitch">
          <Switch
            id="odSwitch"
            label={' '}
            labelOff={' '}
            isChecked={this.props.isOutlierDetection}
            onChange={() => this.props.onOutlierDetection(!this.props.isOutlierDetection, this.props.outlierDetection)}
          />
          <span>{wizardTooltip(OUTLIER_DETECTION_TOOLTIP)}</span>
        </FormGroup>
        {this.props.isOutlierDetection && (
          <FormGroup label="连续错误数" fieldId="consecutiveErrors">
            <TextInput
              value={this.props.outlierDetection.consecutiveErrors}
              id="consecutiveErrors"
              name="consecutiveErrors"
              onChange={(_event, value) => {
                let newValue = Number(value || 0);
                newValue = Number.isNaN(newValue) ? 0 : newValue;
                const od = this.props.outlierDetection;
                od.consecutiveErrors = newValue;
                this.props.onOutlierDetection(this.props.isOutlierDetection, od);
              }}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>连接从连接池中被驱逐前最大的连续错误数</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        )}
      </>
    );
  }
}
