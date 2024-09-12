// Node Shapes
import workloadImage from '../../assets/img/graph/cy/node.svg';
import appImage from '../../assets/img/graph/cy/app.svg';
import serviceImage from '../../assets/img/graph/cy/service.svg';
import operationImage from '../../assets/img/graph/cy/operation.svg';
import serviceEntryImage from '../../assets/img/graph/cy/service-entry.svg';
// Node Colors
import nodeColorNormalImage from '../../assets/img/graph/cy/node-color-normal.svg';
import nodeColorWarningImage from '../../assets/img/graph/cy/node-color-warning.svg';
import nodeColorDangerImage from '../../assets/img/graph/cy/node-color-danger.svg';
import nodeColorIdleImage from '../../assets/img/graph/cy/node-color-idle.svg';
// Node Background
import externalNamespaceImage from '../../assets/img/graph/external-namespace.svg';
import restrictedNamespaceImage from '../../assets/img/graph/restricted-namespace.svg';
// Edges
import edgeSuccessImage from '../../assets/img/graph/cy/edge-success.svg';
import edgeDangerImage from '../../assets/img/graph/cy/edge-danger.svg';
import edgeWarnImage from '../../assets/img/graph/cy/edge-warn.svg';
import edgeIdlemage from '../../assets/img/graph/cy/edge-idle.svg';
import edgeTcpImage from '../../assets/img/graph/cy/edge-tcp.svg';
import edgeMtlsImage from '../../assets/img/graph/mtls-badge.svg';
// Traffic Animation
import trafficNormalImage from '../../assets/img/graph/cy/traffic-normal-request.svg';
import trafficFailedImage from '../../assets/img/graph/cy/traffic-failed-request.svg';
import trafficTcpImage from '../../assets/img/graph/cy/traffic-tcp.svg';
// Badges
import badgeCircuitBreakerImage from '../../assets/img/graph/node-badge-circuit-breaker.svg';
import badgeFaultInjectionImage from '../../assets/img/graph/node-badge-fault-injection.svg';
import badgeGatewaysImage from '../../assets/img/graph/node-badge-gateways.svg';
import badgeMirroringImage from '../../assets/img/graph/node-badge-mirroring.svg';
import badgeMissingSidecarImage from '../../assets/img/graph/node-badge-missing-sidecar.svg';
import badgeRequestTimeoutImage from '../../assets/img/graph/node-badge-request-timeout.svg';
import badgeTrafficShiftingSourceImage from '../../assets/img/graph/node-badge-traffic-shifting.svg';
import badgeTrafficSourceImage from '../../assets/img/graph/node-badge-traffic-source.svg';
import badgeVirtualServicesImage from '../../assets/img/graph/node-badge-virtual-services.svg';
import badgeWorkloadEntryImage from '../../assets/img/graph/node-badge-workload-entry.svg';
import { t } from 'utils/I18nUtils';

export interface GraphLegendItem {
  data: GraphLegendItemRow[];
  isBadge?: boolean;
  title: string;
}

export interface GraphLegendItemRow {
  icon: string;
  label: string;
}

export const legendData: GraphLegendItem[] = [
  {
    title: t('节点形状'),
    data: [
      { label: t('工作负载'), icon: workloadImage },
      { label: t('应用'), icon: appImage },
      { label: t('操作'), icon: operationImage },
      { label: t('服务'), icon: serviceImage },
      { label: t('服务条目'), icon: serviceEntryImage }
    ]
  },
  {
    title: t('节点颜色'),
    data: [
      { label: t('正常'), icon: nodeColorNormalImage },
      { label: t('警告'), icon: nodeColorWarningImage },
      { label: t('不健康'), icon: nodeColorDangerImage },
      { label: t('空闲'), icon: nodeColorIdleImage }
    ]
  },
  {
    title: t('节点背景'),
    data: [
      { label: t('未选择的命名空间'), icon: externalNamespaceImage },
      { label: t('受限 / 外部'), icon: restrictedNamespaceImage }
    ]
  },
  {
    title: t('边'),
    data: [
      { label: t('错误'), icon: edgeDangerImage },
      { label: t('已降级'), icon: edgeWarnImage },
      { label: t('健康'), icon: edgeSuccessImage },
      { label: t('TCP 连接'), icon: edgeTcpImage },
      { label: t('空间'), icon: edgeIdlemage },
      { label: t('mTLS (标志)'), icon: edgeMtlsImage }
    ]
  },
  {
    title: t('流量动画'),
    data: [
      { label: t('正常请求'), icon: trafficNormalImage },
      { label: t('失败请求'), icon: trafficFailedImage },
      { label: t('TCP 流量'), icon: trafficTcpImage }
    ]
  },
  {
    title: t('节点标志'),
    isBadge: true,
    data: [
      { label: t('熔断'), icon: badgeCircuitBreakerImage },
      { label: t('故障注入'), icon: badgeFaultInjectionImage },
      { label: t('网关'), icon: badgeGatewaysImage },
      { label: t('镜像'), icon: badgeMirroringImage },
      { label: t('边车丢失'), icon: badgeMissingSidecarImage },
      { label: t('请求超时'), icon: badgeRequestTimeoutImage },
      { label: t('流量转移 / TCP 流量转移'), icon: badgeTrafficShiftingSourceImage },
      { label: t('流量来源'), icon: badgeTrafficSourceImage },
      { label: t('虚拟服务 / 请求路由'), icon: badgeVirtualServicesImage },
      { label: t('工作负载条目'), icon: badgeWorkloadEntryImage }
    ]
  }
];
