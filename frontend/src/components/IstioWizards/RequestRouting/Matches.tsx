import * as React from 'react';
import { Chip } from '@patternfly/react-core';
import { kialiStyle } from 'styles/StyleUtils';
import { MATCHING_SELECTED_TOOLTIP, wizardTooltip } from '../WizardHelp';

type Props = {
  matches: string[];
  onRemoveMatch: (match: string) => void;
};

const labelContainerStyle = kialiStyle({
  marginTop: 20,
  height: 40
});

const remove = kialiStyle({
  cursor: 'not-allowed'
});

export class Matches extends React.Component<Props> {
  render() {
    const matches: any[] = this.props.matches.map((match, index) => (
      <span key={match + '-' + index} data-test={match} className={remove}>
        <Chip onClick={() => this.props.onRemoveMatch(match)} isOverflowChip={true}>
          {match}
        </Chip>{' '}
      </span>
    ));
    return (
      <div className={labelContainerStyle}>
        <span
          style={{
            marginRight: '32px'
          }}
        >
          已选择的匹配规则
          {wizardTooltip(MATCHING_SELECTED_TOOLTIP)}
        </span>
        {matches.length > 0 ? matches : <b>匹配所有请求</b>}
      </div>
    );
  }
}
