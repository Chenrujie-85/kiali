import { Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import * as React from 'react';
import { HelpMessage } from 'types/IstioObjects';

interface IstioConfigHelpProps {
  helpMessages?: HelpMessage[];
  selectedLine?: string;
}

export class IstioConfigHelp extends React.Component<IstioConfigHelpProps> {
  render() {
    const helpMessage = this.props.helpMessages?.find(helpMessage =>
      this.props.selectedLine?.includes(helpMessage.objectField.substring(helpMessage.objectField.lastIndexOf('.') + 1))
    );

    return (
      <Stack>
        <StackItem>
          <Title headingLevel="h4" size={TitleSizes.lg} style={{ paddingBottom: '10px' }}>
            帮助
          </Title>
        </StackItem>

        {helpMessage && (
          <>
            <StackItem>
              <Title headingLevel="h5" size={TitleSizes.md}>
                {helpMessage.objectField}
              </Title>
            </StackItem>
            <StackItem style={{ marginTop: '10px' }}>
              <p>{helpMessage.message}</p>
            </StackItem>
          </>
        )}
        {!helpMessage && (
          <StackItem>
            <p>编辑此配置的重要字段时，将显示帮助信息</p>
          </StackItem>
        )}
      </Stack>
    );
  }
}
