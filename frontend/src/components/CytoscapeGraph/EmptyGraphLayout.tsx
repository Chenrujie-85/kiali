import * as React from 'react';
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateHeader,
  EmptyStateFooter
} from '@patternfly/react-core';
import { kialiStyle } from 'styles/StyleUtils';
import * as _ from 'lodash';
import { Namespace } from '../../types/Namespace';
import { KialiIcon } from '../../config/KialiIcon';
import { DecoratedGraphElements } from '../../types/Graph';

type EmptyGraphLayoutProps = {
  action?: any;
  elements?: DecoratedGraphElements;
  namespaces: Namespace[];
  isLoading?: boolean;
  isError: boolean;
  isMiniGraph: boolean;
  error?: string;
  showIdleNodes: boolean;
  toggleIdleNodes: () => void;
};

const emptyStateStyle = kialiStyle({
  height: '98%',
  marginRight: 'auto',
  marginLeft: 'auto',
  marginBottom: 10,
  marginTop: 10
});

type EmptyGraphLayoutState = {};

export class EmptyGraphLayout extends React.Component<EmptyGraphLayoutProps, EmptyGraphLayoutState> {
  shouldComponentUpdate(nextProps: EmptyGraphLayoutProps) {
    const currentIsEmpty = this.props.elements === undefined || _.isEmpty(this.props.elements.nodes);
    const nextIsEmpty = nextProps.elements === undefined || _.isEmpty(nextProps.elements.nodes);

    // Update if we have elements and we are not loading
    if (!nextProps.isLoading && !nextIsEmpty) {
      return true;
    }

    // Update if we are going from having no elements to having elements or vice versa
    if (currentIsEmpty !== nextIsEmpty) {
      return true;
    }
    // Do not update if we have elements and the namespace didn't change, as this means we are refreshing
    return !(!nextIsEmpty && _.isEqual(this.props.namespaces, nextProps.namespaces));
  }

  namespacesText() {
    if (this.props.namespaces && this.props.namespaces.length > 0) {
      if (this.props.namespaces.length === 1) {
        return (
          <>
            namespace <b>{this.props.namespaces[0].name}</b>
          </>
        );
      } else {
        const namespacesString =
          this.props.namespaces
            .slice(0, -1)
            .map(namespace => namespace.name)
            .join(',') +
          ' and ' +
          this.props.namespaces[this.props.namespaces.length - 1].name;
        return (
          <>
            namespaces <b>{namespacesString}</b>
          </>
        );
      }
    }
    return null;
  }

  render() {
    if (this.props.isError) {
      return (
        <EmptyState id="empty-graph-error" variant={EmptyStateVariant.lg} className={emptyStateStyle}>
          <EmptyStateHeader
            titleText="Error loading Graph"
            icon={<EmptyStateIcon icon={KialiIcon.Error} />}
            headingLevel="h5"
          />
          <EmptyStateBody>{this.props.error}</EmptyStateBody>
        </EmptyState>
      );
    }
    if (this.props.isLoading) {
      return (
        <EmptyState id="empty-graph-is-loading" variant={EmptyStateVariant.lg} className={emptyStateStyle}>
          <EmptyStateHeader titleText="Loading Graph" headingLevel="h5" />
        </EmptyState>
      );
    }

    if (this.props.namespaces.length === 0) {
      return (
        <EmptyState id="empty-graph-no-namespace" variant={EmptyStateVariant.lg} className={emptyStateStyle}>
          <EmptyStateHeader titleText="No namespace is selected" headingLevel="h5" />
          <EmptyStateBody>
            There is currently no namespace selected, please select one using the Namespace selector.
          </EmptyStateBody>
        </EmptyState>
      );
    }

    const isGraphEmpty = !this.props.elements || !this.props.elements.nodes || this.props.elements.nodes.length < 1;

    if (isGraphEmpty && !this.props.isMiniGraph) {
      return (
        <EmptyState id="empty-graph" variant={EmptyStateVariant.lg} className={emptyStateStyle}>
          <EmptyStateHeader titleText="空视图" headingLevel="h5" />
          <EmptyStateBody>
            当前命名空间 {this.namespacesText()} 没有可展示的流量视图. 这可能意味着 {this.props.namespaces.length === 1 ? '这个命名空间' : '这些命名空间'} 没有可用的服务网格
            或者服务网格尚未看到请求流量.
            {this.props.showIdleNodes && (
              <> 您当前已启用“空闲节点”，向服务网格发送请求并点击“刷新”</>
            )}
            {!this.props.showIdleNodes && (
              <> 您可以启用“空闲节点”以显示尚未看到任何请求流量的服务网格节点</>
            )}
          </EmptyStateBody>
          <EmptyStateFooter>
            <Button
              onClick={this.props.showIdleNodes ? this.props.action : this.props.toggleIdleNodes}
              variant={ButtonVariant.primary}
            >
              {(this.props.showIdleNodes && <>Refresh</>) || <>展示空闲节点</>}
            </Button>
          </EmptyStateFooter>
        </EmptyState>
      );
    }

    if (isGraphEmpty && this.props.isMiniGraph) {
      return (
        <EmptyState id="empty-mini-graph" variant={EmptyStateVariant.lg} className={emptyStateStyle}>
          <EmptyStateHeader titleText="空视图" headingLevel="h5" />
          <EmptyStateBody>该时间周期内不存在流量视图</EmptyStateBody>
        </EmptyState>
      );
    }

    return this.props.children;
  }
}
