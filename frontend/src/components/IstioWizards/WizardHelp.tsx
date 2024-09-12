import * as React from 'react';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { KialiIcon } from '../../config/KialiIcon';
import { kialiStyle } from 'styles/StyleUtils';

const infoStyle = kialiStyle({
  marginLeft: '0.5rem'
});

const importantTooltip = kialiStyle({
  fontWeight: 700
});

export const wizardTooltip = (tooltipContent: React.ReactFragment) => {
  return (
    <Tooltip position={TooltipPosition.right} content={<div style={{ textAlign: 'left' }}>{tooltipContent}</div>}>
      <KialiIcon.Info className={infoStyle} />
    </Tooltip>
  );
};

export const CONNECTION_POOL_TOOLTIP = (
  <>
    <div style={{ marginBottom: 5 }}>上游主机的连接池设置</div>
    <div style={{ marginBottom: 5 }}>这个设置将被用于使用上游服务的每个独立主机</div>
    <div>
      连接池设置将被用于 <span className={importantTooltip}>TCP</span> 级别和{' '}
      <span className={importantTooltip}>HTTP</span> 级别.
    </div>
  </>
);

export const GATEWAY_TOOLTIP = (
  <>
    <div style={{ marginBottom: 5 }}>将使用这些路由规则的网关的名称</div>
    <div style={{ marginBottom: 5 }}>
      如果提供了网关名称列表，则路由规则将仅应用于这些网关
    </div>
    <div>
      要将规则同时应用于网关和边车，请指定保留字{' '}
      <span className={importantTooltip}>mesh</span>.
    </div>
  </>
);

export const HTTP_ABORT_TOOLTIP = (
  <>
    中止HTTP请求并将错误状态码返回给 <span className={importantTooltip}>下游</span>{' '}
    服务, 从而使 <span className={importantTooltip}>上游</span> 服务表现出故障
  </>
);

export const HTTP_DELAY_TOOLTIP = (
  <>
    在转发请求 <span className={importantTooltip}>前</span> 进行延迟处理，模拟各种故障，如网络问题、上游服务过载等
  </>
);

export const HTTP_RETRY_TOOLTIP = <>当HTTP请求失败时使用的重试策略</>;

export const HTTP_TIMEOUT_TOOLTIP = <>设置HTTP请求超时，默认被禁用</>;

export const LOAD_BALANCER_TOOLTIP = <>负载均衡策略将被用于特定的目的主机</>;

export const MATCHING_SELECTED_TOOLTIP = (
  <>
    <div style={{ marginBottom: 5 }}>激活规则需满足的匹配条件</div>
    <div>
      Kiali Wizard 将使用 <span className={importantTooltip}>OR</span> 语义创建所有条件.
    </div>
  </>
);

export const FILTERING_SELECTED_TOOLTIP = (
  <>
    <div style={{ marginBottom: 5 }}>Filters applies for the requests being forwarded by rules defined here.</div>
    <div>
      Kiali Wizard will create all conditions with an <span className={importantTooltip}>OR</span> semantic.
    </div>
  </>
);

export const OUTLIER_DETECTION_TOOLTIP = (
  <>
    <div style={{ marginBottom: 5 }}>
      一个熔断器，用于跟踪{' '}
      <span className={importantTooltip}>上游</span> 服务{' '}
    </div>
    <div style={{ marginBottom: 5 }}>
      对于 <span className={importantTooltip}>HTTP</span> 服务, 对于在API调用时连续返回5XX的主机，将从连接池驱逐该主机
    </div>
    <div>
      对于 <span className={importantTooltip}>TCP</span> 服务, 在测量连续错误度量时，与给定主机的连接超时或连接失败会被计为错误
    </div>
  </>
);

export const PEER_AUTHENTICATION_TOOLTIP = (
  <>
    <div style={{ marginBottom: 5 }}>
      对等身份认证定义了如何（或是否）通过mTLS进行加密和身份验证
    </div>
    <div>
      定义将会被对等身份认证使用的 <span className={importantTooltip}>mTLS</span> 模式
    </div>
  </>
);

export const ROUTE_RULES_TOOLTIP = (
  <>
    <div style={{ marginBottom: 5 }}>HTTP流量的路由规则有序列表</div>
    <div>
      在处理传入请求时，会使用第一个与之 <span className={importantTooltip}>匹配</span> 的路由规则
    </div>
  </>
);
