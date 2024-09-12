import {
  Radio,
  Checkbox,
  Tooltip,
  TooltipPosition,
  Dropdown,
  DropdownList,
  MenuToggleElement,
  MenuToggle
} from '@patternfly/react-core';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HistoryManager, URLParam } from '../../../app/History';
import { GraphToolbarState, KialiAppState } from '../../../store/Store';
import { GraphToolbarActions } from '../../../actions/GraphToolbarActions';
import { GraphType, EdgeLabelMode, isResponseTimeMode, isThroughputMode, RankMode } from '../../../types/Graph';
import { startCase } from 'lodash-es';
import { edgeLabelsSelector } from 'store/Selectors';
import {
  BoundingClientAwareComponent,
  PropertyType
} from 'components/BoundingClientAwareComponent/BoundingClientAwareComponent';
import { KialiIcon } from 'config/KialiIcon';
import {
  containerStyle,
  infoStyle,
  itemStyleWithInfo,
  itemStyleWithoutInfo,
  menuStyle,
  menuEntryStyle,
  titleStyle
} from 'styles/DropdownStyles';
import { INITIAL_GRAPH_STATE } from 'reducers/GraphDataState';
import { KialiDispatch } from 'types/Redux';
import { KialiCrippledFeatures } from 'types/ServerConfig';
import { getCrippledFeatures } from 'services/Api';
import { serverConfig } from '../../../config';

type ReduxStateProps = {
  boxByCluster: boolean;
  boxByNamespace: boolean;
  edgeLabels: EdgeLabelMode[];
  rankBy: RankMode[];
  showIdleEdges: boolean;
  showIdleNodes: boolean;
  showOperationNodes: boolean;
  showOutOfMesh: boolean;
  showRank: boolean;
  showSecurity: boolean;
  showServiceNodes: boolean;
  showTrafficAnimation: boolean;
  showVirtualServices: boolean;
  showWaypoints: boolean;
};

type ReduxDispatchProps = {
  setEdgeLabels: (edgeLabels: EdgeLabelMode[]) => void;
  setRankBy: (rankBy: RankMode[]) => void;
  toggleBoxByCluster(): void;
  toggleBoxByNamespace(): void;
  toggleGraphMissingSidecars(): void;
  toggleGraphSecurity(): void;
  toggleGraphVirtualServices(): void;
  toggleIdleEdges(): void;
  toggleIdleNodes(): void;
  toggleOperationNodes(): void;
  toggleRank(): void;
  toggleServiceNodes(): void;
  toggleTrafficAnimation(): void;
  toggleWaypoints(): void;
};

type GraphSettingsProps = ReduxStateProps &
  ReduxDispatchProps &
  Omit<GraphToolbarState, 'findValue' | 'hideValue' | 'showLegend' | 'showFindHelp' | 'trafficRates'> & {
    disabled: boolean;
  };

type GraphSettingsState = { crippledFeatures?: KialiCrippledFeatures; isOpen: boolean };

interface DisplayOptionType {
  id: string;
  isChecked: boolean;
  isDisabled?: boolean;
  labelText: string;
  onChange?: () => void;
  tooltip?: React.ReactNode;
}

const marginBottom = 20;

class GraphSettingsComponent extends React.PureComponent<GraphSettingsProps, GraphSettingsState> {
  constructor(props: GraphSettingsProps) {
    super(props);

    this.state = {
      isOpen: false
    };

    // Let URL override current redux state at construction time. Update URL as needed.
    this.handleURLBool(
      URLParam.GRAPH_ANIMATION,
      INITIAL_GRAPH_STATE.toolbarState.showTrafficAnimation,
      props.showTrafficAnimation,
      props.toggleTrafficAnimation
    );

    this.handleURLBool(
      URLParam.GRAPH_BADGE_SECURITY,
      INITIAL_GRAPH_STATE.toolbarState.showSecurity,
      props.showSecurity,
      props.toggleGraphSecurity
    );

    this.handleURLBool(
      URLParam.GRAPH_BADGE_SIDECAR,
      INITIAL_GRAPH_STATE.toolbarState.showOutOfMesh,
      props.showOutOfMesh,
      props.toggleGraphMissingSidecars
    );

    this.handleURLBool(
      URLParam.GRAPH_BADGE_VS,
      INITIAL_GRAPH_STATE.toolbarState.showVirtualServices,
      props.showVirtualServices,
      props.toggleGraphVirtualServices
    );

    this.handleURLBool(
      URLParam.GRAPH_BOX_CLUSTER,
      INITIAL_GRAPH_STATE.toolbarState.boxByCluster,
      props.boxByCluster,
      props.toggleBoxByCluster
    );

    this.handleURLBool(
      URLParam.GRAPH_BOX_NAMESPACE,
      INITIAL_GRAPH_STATE.toolbarState.boxByNamespace,
      props.boxByNamespace,
      props.toggleBoxByNamespace
    );

    this.handleURLBool(
      URLParam.GRAPH_IDLE_EDGES,
      INITIAL_GRAPH_STATE.toolbarState.showIdleEdges,
      props.showIdleEdges,
      props.toggleIdleEdges
    );

    this.handleURLBool(
      URLParam.GRAPH_IDLE_NODES,
      INITIAL_GRAPH_STATE.toolbarState.showIdleNodes,
      props.showIdleNodes,
      props.toggleIdleNodes
    );

    this.handleURLBool(
      URLParam.GRAPH_OPERATION_NODES,
      INITIAL_GRAPH_STATE.toolbarState.showOperationNodes,
      props.showOperationNodes,
      props.toggleOperationNodes
    );

    this.handleURLBool(
      URLParam.GRAPH_RANK,
      INITIAL_GRAPH_STATE.toolbarState.showRank,
      props.showRank,
      props.toggleRank
    );

    this.handleURLBool(
      URLParam.GRAPH_SERVICE_NODES,
      INITIAL_GRAPH_STATE.toolbarState.showServiceNodes,
      props.showServiceNodes,
      props.toggleServiceNodes
    );

    this.handleURLBool(
      URLParam.GRAPH_WAYPOINTS,
      INITIAL_GRAPH_STATE.toolbarState.showWaypoints,
      props.showWaypoints,
      props.toggleWaypoints
    );
  }

  componentDidMount(): void {
    getCrippledFeatures().then(response => {
      const crippledFeatures = response.data;
      this.setState({ crippledFeatures: response.data });

      // strip away any invalid edge options from the url
      if (
        (crippledFeatures.responseTime || crippledFeatures.responseTimePercentiles) &&
        this.props.edgeLabels.some(l => isResponseTimeMode(l))
      ) {
        this.props.setEdgeLabels(this.props.edgeLabels.filter(l => !isResponseTimeMode(l)));
      }

      if (
        (crippledFeatures.requestSize && this.props.edgeLabels.includes(EdgeLabelMode.THROUGHPUT_REQUEST)) ||
        (crippledFeatures.responseSize && this.props.edgeLabels.includes(EdgeLabelMode.THROUGHPUT_RESPONSE))
      ) {
        this.props.setEdgeLabels(this.props.edgeLabels.filter(l => !isThroughputMode(l)));
      }
    });
  }

  componentDidUpdate(prev: GraphSettingsProps): void {
    // ensure redux state and URL are aligned
    this.alignURLBool(
      URLParam.GRAPH_ANIMATION,
      INITIAL_GRAPH_STATE.toolbarState.showTrafficAnimation,
      prev.showTrafficAnimation,
      this.props.showTrafficAnimation
    );

    this.alignURLBool(
      URLParam.GRAPH_BADGE_SECURITY,
      INITIAL_GRAPH_STATE.toolbarState.showSecurity,
      prev.showSecurity,
      this.props.showSecurity
    );

    this.alignURLBool(
      URLParam.GRAPH_BADGE_SIDECAR,
      INITIAL_GRAPH_STATE.toolbarState.showOutOfMesh,
      prev.showOutOfMesh,
      this.props.showOutOfMesh
    );

    this.alignURLBool(
      URLParam.GRAPH_BADGE_VS,
      INITIAL_GRAPH_STATE.toolbarState.showVirtualServices,
      prev.showVirtualServices,
      this.props.showVirtualServices
    );

    this.alignURLBool(
      URLParam.GRAPH_BOX_CLUSTER,
      INITIAL_GRAPH_STATE.toolbarState.boxByCluster,
      prev.boxByCluster,
      this.props.boxByCluster
    );

    this.alignURLBool(
      URLParam.GRAPH_BOX_NAMESPACE,
      INITIAL_GRAPH_STATE.toolbarState.boxByNamespace,
      prev.boxByNamespace,
      this.props.boxByNamespace
    );

    this.alignURLBool(
      URLParam.GRAPH_IDLE_EDGES,
      INITIAL_GRAPH_STATE.toolbarState.showIdleEdges,
      prev.showIdleEdges,
      this.props.showIdleEdges
    );

    this.alignURLBool(
      URLParam.GRAPH_IDLE_NODES,
      INITIAL_GRAPH_STATE.toolbarState.showIdleNodes,
      prev.showIdleNodes,
      this.props.showIdleNodes
    );

    this.alignURLBool(
      URLParam.GRAPH_OPERATION_NODES,
      INITIAL_GRAPH_STATE.toolbarState.showOperationNodes,
      prev.showOperationNodes,
      this.props.showOperationNodes
    );

    this.alignURLBool(
      URLParam.GRAPH_RANK,
      INITIAL_GRAPH_STATE.toolbarState.showRank,
      prev.showRank,
      this.props.showRank
    );

    this.alignURLBool(
      URLParam.GRAPH_SERVICE_NODES,
      INITIAL_GRAPH_STATE.toolbarState.showServiceNodes,
      prev.showServiceNodes,
      this.props.showServiceNodes
    );

    this.alignURLBool(
      URLParam.GRAPH_WAYPOINTS,
      INITIAL_GRAPH_STATE.toolbarState.showWaypoints,
      prev.showWaypoints,
      this.props.showWaypoints
    );
  }

  private handleURLBool = (
    param: URLParam,
    paramDefault: boolean,
    reduxValue: boolean,
    reduxToggle: () => void
  ): void => {
    const urlValue = HistoryManager.getBooleanParam(param);

    if (urlValue !== undefined) {
      if (urlValue !== reduxValue) {
        reduxToggle();
      }
    } else if (reduxValue !== paramDefault) {
      HistoryManager.setParam(param, String(reduxValue));
    }
  };

  private alignURLBool = (param: URLParam, paramDefault: boolean, prev: boolean, curr: boolean): void => {
    if (prev === curr) {
      return;
    }

    if (curr === paramDefault) {
      HistoryManager.deleteParam(param, true);
    } else {
      HistoryManager.setParam(param, String(curr));
    }
  };

  render(): React.ReactNode {
    return (
      <Dropdown
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            ref={toggleRef}
            id="display-settings"
            onClick={() => this.onToggle(!this.state.isOpen)}
            isExpanded={this.state.isOpen}
            isDisabled={this.props.disabled}
          >
            Display
          </MenuToggle>
        )}
        isOpen={this.state.isOpen}
        onOpenChange={(isOpen: boolean) => this.onToggle(isOpen)}
      >
        <DropdownList>{this.getMenuOptions()}</DropdownList>
      </Dropdown>
    );
  }

  private onToggle = (isOpen: boolean): void => {
    this.setState({
      isOpen
    });
  };

  private getMenuOptions = (): React.ReactNode => {
    // map our attributes from redux
    const {
      boxByCluster,
      boxByNamespace,
      edgeLabels,
      showRank: rank,
      rankBy: rankLabels,
      showIdleEdges,
      showIdleNodes,
      showOutOfMesh,
      showOperationNodes,
      showSecurity,
      showServiceNodes,
      showTrafficAnimation,
      showVirtualServices,
      showWaypoints
    } = this.props;

    // map our dispatchers for redux
    const {
      toggleBoxByCluster,
      toggleBoxByNamespace,
      toggleGraphMissingSidecars,
      toggleGraphSecurity,
      toggleGraphVirtualServices,
      toggleIdleEdges,
      toggleIdleNodes,
      toggleOperationNodes,
      toggleRank,
      toggleServiceNodes,
      toggleTrafficAnimation,
      toggleWaypoints
    } = this.props;

    const edgeLabelOptions: DisplayOptionType[] = [
      {
        id: EdgeLabelMode.RESPONSE_TIME_GROUP,
        isChecked: edgeLabels.includes(EdgeLabelMode.RESPONSE_TIME_GROUP),
        isDisabled:
          this.state.crippledFeatures?.responseTime ||
          (this.state.crippledFeatures?.responseTimeAverage && this.state.crippledFeatures?.responseTimePercentiles),
        labelText: startCase(EdgeLabelMode.RESPONSE_TIME_GROUP),
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            <div>
              显示请求的响应时间。当小于1000时，单位为毫秒（ms），否则为秒(s)。默认值：第95个百分位数
            </div>
            <div>
              响应时间仅适用于基于请求的流量（而不是TCP或gRPC消息传递）。此外，以下边不提供响应时间标签，但在选择边时，侧面板中提供了相关信息：
            </div>
            <div>- edges into service nodes</div>
            <div>- edges into or out of operation nodes.</div>
            <div>
              如果响应时间遥测不可用，此选项将被禁用。某些选项可能出于相同的原因而被禁用
            </div>
          </div>
        )
      },
      {
        id: EdgeLabelMode.THROUGHPUT_GROUP,
        isChecked: edgeLabels.includes(EdgeLabelMode.THROUGHPUT_GROUP),
        isDisabled: this.state.crippledFeatures?.requestSize && this.state.crippledFeatures?.responseSize,
        labelText: startCase(EdgeLabelMode.THROUGHPUT_GROUP),
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            <div>
              显示请求的HTTP吞吐量。当小于1024时，单位为字节每秒（bps），否则为千字节每秒(kps)。默认值：请求吞吐量
            </div>
            <div>
              吞吐量仅适用于基于请求的HTTP流量。此外，以下边不提供吞吐量标签：
            </div>
            <div>- edges into service nodes</div>
            <div>- edges into or out of operation nodes.</div>
            <div>
              如果吞吐量遥测不可用，此选项将被禁用。某些选项可能出于相同的原因而被禁用
            </div>
          </div>
        )
      },
      {
        id: EdgeLabelMode.TRAFFIC_DISTRIBUTION,
        isChecked: edgeLabels.includes(EdgeLabelMode.TRAFFIC_DISTRIBUTION),
        labelText: startCase(EdgeLabelMode.TRAFFIC_DISTRIBUTION),
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            HTTP和gRPC边显示该边的流量百分比，当低于100%时。对于源节点，给定四舍五入，出站边（每个协议）的和应该等于或接近100%。TCP边不包括在分布中，因为它们的速率反映了字节
          </div>
        )
      },
      {
        id: EdgeLabelMode.TRAFFIC_RATE,
        isChecked: edgeLabels.includes(EdgeLabelMode.TRAFFIC_RATE),
        labelText: startCase(EdgeLabelMode.TRAFFIC_RATE),
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            HTTP速率以每秒请求数（rps）为单位。gRPC速率可以以每秒请求数（rps）或每秒消息数（mps）为单位。对于请求速率，当为非零时，错误响应的百分比显示在速率的下方。TCP速率以字节为单位。当小于1024时，单位为字节每秒（bps），否则为千字节每秒(kps)。速率四舍五入至2位有效数字
          </div>
        )
      }
    ];

    const throughputOptions: DisplayOptionType[] = [
      {
        id: EdgeLabelMode.THROUGHPUT_REQUEST,
        isChecked: edgeLabels.includes(EdgeLabelMode.THROUGHPUT_REQUEST) && !this.state.crippledFeatures?.requestSize,
        isDisabled: this.state.crippledFeatures?.requestSize,
        labelText: '请求',
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            HTTP请求数据，以字节/秒（bps）或千字节/秒（kps）为单位
          </div>
        )
      },
      {
        id: EdgeLabelMode.THROUGHPUT_RESPONSE,
        isChecked: edgeLabels.includes(EdgeLabelMode.THROUGHPUT_RESPONSE) && !this.state.crippledFeatures?.responseSize,
        isDisabled: this.state.crippledFeatures?.responseSize,
        labelText: '响应',
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            HTTP响应数据（字节/秒(bps）或千字节/秒（kps）)
          </div>
        )
      }
    ];

    const responseTimeOptions: DisplayOptionType[] = [
      {
        id: EdgeLabelMode.RESPONSE_TIME_AVERAGE,
        labelText: '平均',
        isChecked: edgeLabels.includes(EdgeLabelMode.RESPONSE_TIME_AVERAGE),
        isDisabled: this.state.crippledFeatures?.responseTimeAverage,
        tooltip: <div style={{ textAlign: 'left' }}>平均请求响应时间</div>
      },
      {
        id: EdgeLabelMode.RESPONSE_TIME_P50,
        labelText: '中位数',
        isChecked: edgeLabels.includes(EdgeLabelMode.RESPONSE_TIME_P50),
        isDisabled: this.state.crippledFeatures?.responseTimePercentiles,
        tooltip: <div style={{ textAlign: 'left' }}>请求响应时间的中位数 (50th Percentile)</div>
      },
      {
        id: EdgeLabelMode.RESPONSE_TIME_P95,
        labelText: '95th Percentile',
        isChecked: edgeLabels.includes(EdgeLabelMode.RESPONSE_TIME_P95),
        isDisabled: this.state.crippledFeatures?.responseTimePercentiles,
        tooltip: <div style={{ textAlign: 'left' }}>95%请求的最大响应时间 (95th Percentile)</div>
      },
      {
        id: EdgeLabelMode.RESPONSE_TIME_P99,
        labelText: '99th Percentile',
        isChecked: edgeLabels.includes(EdgeLabelMode.RESPONSE_TIME_P99),
        isDisabled: this.state.crippledFeatures?.responseTimePercentiles,
        tooltip: <div style={{ textAlign: 'left' }}>99%请求的最大响应时间 (99th Percentile)</div>
      }
    ];

    const visibilityOptions: DisplayOptionType[] = [
      {
        id: 'boxByCluster',
        isChecked: boxByCluster,
        labelText: '集群框',
        onChange: toggleBoxByCluster,
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            当存在并启用多个集群时，图将框住同一集群中的节点。“未知”集群永远不会被框住
          </div>
        )
      },
      {
        id: 'boxByNamespace',
        isChecked: boxByNamespace,
        labelText: '命名空间框',
        onChange: toggleBoxByNamespace,
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            当存在并启用多个命名空间时，图将框住同一命名空间中的节点，在
            相同的集群。“未知”命名空间永远不会框住
          </div>
        )
      },
      {
        id: 'filterIdleEdges',
        isChecked: showIdleEdges,
        labelText: '空闲边',
        onChange: toggleIdleEdges,
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            空闲边在该时间段内没有请求流量。默认情况下禁用，以提供更干净的图。
            启用以帮助检测意外流量遗漏，或确认无流量的预期边(由于路由、镜像等)
          </div>
        )
      },
      {
        id: 'filterIdleNodes',
        isChecked: showIdleNodes,
        labelText: '空闲节点',
        onChange: toggleIdleNodes,
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            启用“空闲边缘”后，将显示”从未“接收到流量的已定义服务的节点。
            禁用“空闲边”选项将显示已定义服务的节点，这些节点在
            当前时间段。默认情况下禁用，以提供更干净的图。启用以帮助查找未使用、
            配置错误或过时的服务
          </div>
        )
      },
      {
        id: 'filterOperationNodes',
        isChecked: showOperationNodes,
        isDisabled: this.props.graphType === GraphType.SERVICE,
        labelText: '操作节点',
        onChange: toggleOperationNodes,
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            <div>
              当同时启用操作和服务节点时，操作将特定于其应用到的每个服务显示，因此对于不同的服务可能会重复。独立启用时，每个操作都将有一个节点代表该操作的总流量
            </div>
            <div>- Operations with no traffic are ignored.</div>
            <div>- This is not applicable to Service graphs.</div>
            <div>
              - 操作节点需要为所选命名空间中的工作负载进行额外的“请求分类”Istio配置。
            </div>
          </div>
        )
      },
      {
        id: 'rank',
        isChecked: rank,
        labelText: '排名',
        onChange: toggleRank,
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            根据可配置的标准（如“入站边数”）对图节点进行排序。这些排名可以
            用于图形查找/隐藏功能，以帮助突出显示最重要的工作负载、服务和
            应用程序。将排名归一化，以适合在1..100之间，并且节点可能在排名中彼此并列。
            排名靠前的节点的排名从1开始，因此当根据“入站边数”对节点进行排名时，
            具有最多入向边的节点将具有秩1。具有第二多的入向边的节点
            2级。每个选择的标准对节点的排名都有相同的贡献。虽然100个排名是可能的，
            仅分配所需的排名数量，从1开始
          </div>
        )
      },
      {
        id: 'filterServiceNodes',
        isChecked: showServiceNodes,
        isDisabled: this.props.graphType === GraphType.SERVICE,
        labelText: '服务节点',
        onChange: toggleServiceNodes,
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            通过将目标服务节点注入到图中来反映服务路由。这对于将相同服务的请求分组，但路由到不同工作负载非常有用。进入服务节点的边是逻辑聚合，不会显示响应时间标签，但如果选中，侧面板将提供响应时间图表
          </div>
        )
      },
      {
        id: 'filterTrafficAnimation',
        isChecked: showTrafficAnimation,
        labelText: '流量动画',
        onChange: toggleTrafficAnimation,
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            设置图形动画以反映流量。粒子密度和速度大致反映了一条边相对于其他边的请求负载。动画可以是CPU密集型的
          </div>
        )
      }
    ];

    if (serverConfig.ambientEnabled) {
      visibilityOptions.push({
        id: 'filterWaypoints',
        isChecked: showWaypoints,
        labelText: 'Waypoint Proxies',
        onChange: toggleWaypoints,
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            <div>Show waypoint proxies workloads.</div>
            <div>
              When enabled in an Ambient environment, include waypoint proxy telemetry in the graph. Waypoint nodes will
              show up only if the underlying telemetry is being reported.
            </div>
          </div>
        )
      });
    }

    const badgeOptions: DisplayOptionType[] = [
      {
        id: 'filterSidecars',
        isChecked: showOutOfMesh,
        labelText: 'Missing Sidecars',
        onChange: toggleGraphMissingSidecars
      },
      {
        id: 'filterSecurity',
        isChecked: showSecurity,
        labelText: '安全',
        onChange: toggleGraphSecurity,
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            <div>
              在具有mTLS流量的边显示锁图标。选择边时，可以在侧面板中看到mTLS流量的百分比。请注意，启用全局mTLS时，全局刊头将显示锁图标。侧面板还将显示源主体和目标主体（如果可用）。mTLS状态不为gRPC消息流量提供
            </div>
          </div>
        )
      },
      {
        id: 'filterVS',
        isChecked: showVirtualServices,
        labelText: '虚拟服务',
        onChange: toggleGraphVirtualServices,
        tooltip: (
          <div style={{ textAlign: 'left' }}>
            <div>
              显示虚拟服务相关图标。如果虚拟服务上存在熔断，或者虚拟服务是通过Kiali服务wizards之一创建的，则会显示其他图标。
            </div>
          </div>
        )
      }
    ];

    const scoringOptions: DisplayOptionType[] = [
      {
        id: RankMode.RANK_BY_INBOUND_EDGES,
        labelText: 'Inbound Edges',
        isChecked: rankLabels.includes(RankMode.RANK_BY_INBOUND_EDGES),
        onChange: () => {
          this.toggleRankByMode(RankMode.RANK_BY_INBOUND_EDGES);
        }
      },
      {
        id: RankMode.RANK_BY_OUTBOUND_EDGES,
        labelText: 'Outbound Edges',
        isChecked: rankLabels.includes(RankMode.RANK_BY_OUTBOUND_EDGES),
        onChange: () => {
          this.toggleRankByMode(RankMode.RANK_BY_OUTBOUND_EDGES);
        }
      }
    ];

    return (
      <BoundingClientAwareComponent
        className={containerStyle}
        maxHeight={{ type: PropertyType.VIEWPORT_HEIGHT_MINUS_TOP, margin: marginBottom }}
      >
        <div id="graph-display-menu" className={menuStyle} style={{ width: '15em' }}>
          <div style={{ marginTop: '0.5rem' }}>
            <span className={titleStyle} style={{ paddingRight: 0 }}>
              Show Edge Labels
            </span>

            <Tooltip
              key="tooltip_show_edge_labels"
              position={TooltipPosition.right}
              content={
                <div style={{ textAlign: 'left' }}>
                  <div>
                    Values for multiple label selections are stacked in the same order as the options below. Hover or
                    selection will always show units, an additionally show protocol.
                  </div>
                </div>
              }
            >
              <KialiIcon.Info className={infoStyle} />
            </Tooltip>
          </div>

          {edgeLabelOptions.map((edgeLabelOption: DisplayOptionType) => (
            <div key={edgeLabelOption.id} className={menuEntryStyle}>
              <label
                key={edgeLabelOption.id}
                className={!!edgeLabelOption.tooltip ? itemStyleWithInfo : itemStyleWithoutInfo}
              >
                <Checkbox
                  id={edgeLabelOption.id}
                  isChecked={edgeLabelOption.isChecked}
                  isDisabled={this.props.disabled || edgeLabelOption.isDisabled}
                  key={edgeLabelOption.id}
                  label={edgeLabelOption.labelText}
                  name="edgeLabelOptions"
                  onChange={(event: React.FormEvent, _checked: boolean) => this.toggleEdgeLabelMode(event)}
                  value={edgeLabelOption.id}
                />
              </label>

              {!!edgeLabelOption.tooltip && (
                <Tooltip
                  key={`tooltip_${edgeLabelOption.id}`}
                  position={TooltipPosition.right}
                  content={edgeLabelOption.tooltip}
                >
                  <KialiIcon.Info className={infoStyle} />
                </Tooltip>
              )}

              {edgeLabelOption.id === EdgeLabelMode.RESPONSE_TIME_GROUP && responseTimeOptions.some(o => o.isChecked) && (
                <div>
                  {responseTimeOptions.map((rtOption: DisplayOptionType) => (
                    <div key={rtOption.id} className={menuEntryStyle}>
                      <label
                        key={rtOption.id}
                        className={!!rtOption.tooltip ? itemStyleWithInfo : itemStyleWithoutInfo}
                        style={{ paddingLeft: '2rem' }}
                      >
                        <Radio
                          id={rtOption.id}
                          isChecked={rtOption.isChecked}
                          isDisabled={this.props.disabled || edgeLabelOption.isDisabled || rtOption.isDisabled}
                          label={rtOption.labelText}
                          name="rtOptions"
                          onChange={(event: React.FormEvent, _checked: boolean) =>
                            this.toggleEdgeLabelResponseTimeMode(event)
                          }
                          style={{ paddingLeft: '0.25rem' }}
                          value={rtOption.id}
                        />
                      </label>

                      {!!rtOption.tooltip && (
                        <Tooltip
                          key={`tooltip_${rtOption.id}`}
                          position={TooltipPosition.right}
                          content={rtOption.tooltip}
                        >
                          <KialiIcon.Info className={infoStyle} />
                        </Tooltip>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {edgeLabelOption.id === EdgeLabelMode.THROUGHPUT_GROUP && throughputOptions.some(o => o.isChecked) && (
                <div>
                  {throughputOptions.map((throughputOption: DisplayOptionType) => (
                    <div key={throughputOption.id} className={menuEntryStyle}>
                      <label
                        key={throughputOption.id}
                        className={!!throughputOption.tooltip ? itemStyleWithInfo : itemStyleWithoutInfo}
                        style={{ paddingLeft: '2rem' }}
                      >
                        <Radio
                          id={throughputOption.id}
                          isChecked={throughputOption.isChecked}
                          isDisabled={this.props.disabled || edgeLabelOption.isDisabled || throughputOption.isDisabled}
                          label={throughputOption.labelText}
                          name="throughputOptions"
                          onChange={(event: React.FormEvent, _checked: boolean) =>
                            this.toggleEdgeLabelThroughputMode(event)
                          }
                          style={{ paddingLeft: '0.5rem' }}
                          value={throughputOption.id}
                        />
                      </label>

                      {!!throughputOption.tooltip && (
                        <Tooltip
                          key={`tooltip_${throughputOption.id}`}
                          position={TooltipPosition.right}
                          content={throughputOption.tooltip}
                        >
                          <KialiIcon.Info className={infoStyle} />
                        </Tooltip>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className={titleStyle}>Show</div>

          {visibilityOptions.map((item: DisplayOptionType) => (
            <div key={item.id} className={menuEntryStyle}>
              <label key={item.id} className={!!item.tooltip ? itemStyleWithInfo : itemStyleWithoutInfo}>
                <Checkbox
                  id={item.id}
                  isChecked={item.isChecked}
                  isDisabled={this.props.disabled || item.isDisabled}
                  label={item.labelText}
                  onChange={item.onChange}
                />
              </label>

              {!!item.tooltip && (
                <Tooltip key={`tooltip_${item.id}`} position={TooltipPosition.right} content={item.tooltip}>
                  <KialiIcon.Info className={infoStyle} />
                </Tooltip>
              )}

              {item.id === 'rank' && rank && (
                <div>
                  {scoringOptions.map((scoringOption: DisplayOptionType) => (
                    <div key={scoringOption.id} className={menuEntryStyle}>
                      <label
                        key={scoringOption.id}
                        className={!!scoringOption.tooltip ? itemStyleWithInfo : itemStyleWithoutInfo}
                        style={{ paddingLeft: '2rem' }}
                      >
                        <Checkbox
                          id={scoringOption.id}
                          isChecked={scoringOption.isChecked}
                          isDisabled={this.props.disabled || item.isDisabled}
                          label={scoringOption.labelText}
                          name="scoringOptions"
                          onChange={scoringOption.onChange}
                          style={{ paddingLeft: '0.25rem' }}
                          value={scoringOption.id}
                        />
                      </label>

                      {!!scoringOption.tooltip && (
                        <Tooltip
                          key={`tooltip_${scoringOption.id}`}
                          position={TooltipPosition.right}
                          content={scoringOption.tooltip}
                        >
                          <KialiIcon.Info className={infoStyle} />
                        </Tooltip>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className={titleStyle}>Show Badges</div>

          {badgeOptions.map((item: DisplayOptionType) => (
            <div key={item.id} className={menuEntryStyle}>
              <label key={item.id} className={!!item.tooltip ? itemStyleWithInfo : itemStyleWithoutInfo}>
                <Checkbox
                  id={item.id}
                  isChecked={item.isChecked}
                  isDisabled={this.props.disabled || item.isDisabled}
                  label={item.labelText}
                  onChange={item.onChange}
                />
              </label>

              {!!item.tooltip && (
                <Tooltip key={`tooltip_${item.id}`} position={TooltipPosition.right} content={item.tooltip}>
                  <KialiIcon.Info className={infoStyle} />
                </Tooltip>
              )}
            </div>
          ))}
        </div>
      </BoundingClientAwareComponent>
    );
  };

  private toggleEdgeLabelMode = (event: React.FormEvent): void => {
    const mode = (event.target as HTMLInputElement).value as EdgeLabelMode;

    if (this.props.edgeLabels.includes(mode)) {
      let newEdgeLabels: EdgeLabelMode[];

      switch (mode) {
        case EdgeLabelMode.RESPONSE_TIME_GROUP:
          newEdgeLabels = this.props.edgeLabels.filter(l => !isResponseTimeMode(l));
          break;
        case EdgeLabelMode.THROUGHPUT_GROUP:
          newEdgeLabels = this.props.edgeLabels.filter(l => !isThroughputMode(l));
          break;
        default:
          newEdgeLabels = this.props.edgeLabels.filter(l => l !== mode);
      }

      this.props.setEdgeLabels(newEdgeLabels);
    } else {
      switch (mode) {
        case EdgeLabelMode.RESPONSE_TIME_GROUP:
          this.props.setEdgeLabels([
            ...this.props.edgeLabels,
            mode,
            this.state.crippledFeatures?.responseSizePercentiles
              ? EdgeLabelMode.RESPONSE_TIME_AVERAGE
              : EdgeLabelMode.RESPONSE_TIME_P95
          ]);
          break;
        case EdgeLabelMode.THROUGHPUT_GROUP:
          this.props.setEdgeLabels([
            ...this.props.edgeLabels,
            mode,
            this.state.crippledFeatures?.requestSize
              ? EdgeLabelMode.THROUGHPUT_RESPONSE
              : EdgeLabelMode.THROUGHPUT_REQUEST
          ]);
          break;
        default:
          this.props.setEdgeLabels([...this.props.edgeLabels, mode]);
      }
    }
  };

  private toggleEdgeLabelResponseTimeMode = (event: React.FormEvent): void => {
    const mode = (event.target as HTMLInputElement).value as EdgeLabelMode;
    const newEdgeLabels = this.props.edgeLabels.filter(l => !isResponseTimeMode(l));
    this.props.setEdgeLabels([...newEdgeLabels, EdgeLabelMode.RESPONSE_TIME_GROUP, mode]);
  };

  private toggleEdgeLabelThroughputMode = (event: React.FormEvent): void => {
    const mode = (event.target as HTMLInputElement).value as EdgeLabelMode;
    const newEdgeLabels = this.props.edgeLabels.filter(l => !isThroughputMode(l));
    this.props.setEdgeLabels([...newEdgeLabels, EdgeLabelMode.THROUGHPUT_GROUP, mode]);
  };

  private toggleRankByMode = (mode: RankMode): void => {
    if (this.props.rankBy.includes(mode)) {
      this.props.setRankBy(this.props.rankBy.filter(r => r !== mode));
    } else {
      this.props.setRankBy([...this.props.rankBy, mode]);
    }
  };
}

// Allow Redux to map sections of our global app state to our props
const mapStateToProps = (state: KialiAppState): ReduxStateProps => ({
  boxByCluster: state.graph.toolbarState.boxByCluster,
  boxByNamespace: state.graph.toolbarState.boxByNamespace,
  edgeLabels: edgeLabelsSelector(state),
  showIdleEdges: state.graph.toolbarState.showIdleEdges,
  showIdleNodes: state.graph.toolbarState.showIdleNodes,
  showOutOfMesh: state.graph.toolbarState.showOutOfMesh,
  showOperationNodes: state.graph.toolbarState.showOperationNodes,
  rankBy: state.graph.toolbarState.rankBy,
  showRank: state.graph.toolbarState.showRank,
  showSecurity: state.graph.toolbarState.showSecurity,
  showServiceNodes: state.graph.toolbarState.showServiceNodes,
  showTrafficAnimation: state.graph.toolbarState.showTrafficAnimation,
  showVirtualServices: state.graph.toolbarState.showVirtualServices,
  showWaypoints: state.graph.toolbarState.showWaypoints
});

// Map our actions to Redux
const mapDispatchToProps = (dispatch: KialiDispatch): ReduxDispatchProps => {
  return {
    setEdgeLabels: bindActionCreators(GraphToolbarActions.setEdgeLabels, dispatch),
    setRankBy: bindActionCreators(GraphToolbarActions.setRankBy, dispatch),
    toggleBoxByCluster: bindActionCreators(GraphToolbarActions.toggleBoxByCluster, dispatch),
    toggleBoxByNamespace: bindActionCreators(GraphToolbarActions.toggleBoxByNamespace, dispatch),
    toggleGraphMissingSidecars: bindActionCreators(GraphToolbarActions.toggleGraphMissingSidecars, dispatch),
    toggleGraphSecurity: bindActionCreators(GraphToolbarActions.toggleGraphSecurity, dispatch),
    toggleGraphVirtualServices: bindActionCreators(GraphToolbarActions.toggleGraphVirtualServices, dispatch),
    toggleIdleEdges: bindActionCreators(GraphToolbarActions.toggleIdleEdges, dispatch),
    toggleIdleNodes: bindActionCreators(GraphToolbarActions.toggleIdleNodes, dispatch),
    toggleOperationNodes: bindActionCreators(GraphToolbarActions.toggleOperationNodes, dispatch),
    toggleRank: bindActionCreators(GraphToolbarActions.toggleRank, dispatch),
    toggleServiceNodes: bindActionCreators(GraphToolbarActions.toggleServiceNodes, dispatch),
    toggleTrafficAnimation: bindActionCreators(GraphToolbarActions.toggleTrafficAnimation, dispatch),
    toggleWaypoints: bindActionCreators(GraphToolbarActions.toggleWaypoints, dispatch)
  };
};

// hook up to Redux for our State to be mapped to props
export const GraphSettings = connect(mapStateToProps, mapDispatchToProps)(GraphSettingsComponent);
