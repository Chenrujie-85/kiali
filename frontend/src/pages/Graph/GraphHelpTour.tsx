import { PopoverPosition } from '@patternfly/react-core';
import { TourStopInfo, TourInfo } from 'components/Tour/TourStop';
import { GraphShortcuts } from './GraphToolbar/GraphShortcuts';
import { t } from 'utils/I18nUtils';

export const GraphTourStops: { [name: string]: TourStopInfo } = {
  ContextualMenu: {
    name: t('上下文菜单'),
    description: t(
      '右键单击节点或边缘可查看上下文菜单，其中包含指向节点或边缘的详细信息、流量和入站/出站指标的链接'
    ),
    position: PopoverPosition.left,
    distance: 250
  },
  ContextualMenuPF: {
    name: t('上下文菜单'),
    description: t(
      '单击节点，可链接到详细信息、流量、入站/出站指标和节点图'
    ),
    position: PopoverPosition.left,
    distance: 250
  },
  Display: {
    name: t('展示'),
    description: t(
      '设置边标签、节点标签和各种显示选项。响应时间边缘标记、安全标记和流量动画可能会影响性能'
    ),
    position: PopoverPosition.rightStart
  },
  Find: {
    name: t('寻找或隐藏'),
    description: t(
      '通过类型化表达式高亮或隐藏图元素。单击预设的查找或隐藏表达式的下拉列表。单击“查找/隐藏”帮助图标，了解有关表达式语言的详细信息。'
    ),
    position: PopoverPosition.bottom
  },
  Graph: {
    name: t('视图'),
    description:
      "单击节点或边可查看其摘要并强调其端到端路径。双击节点可查看以该节点为焦点的图\n双击“外部命名空间”节点可直接导航到节点文本标签中的命名空间。按住Shift键并拖动可快速放大",
    position: PopoverPosition.left,
    distance: 250
  },
  GraphPF: {
    name: t('视图'),
    description: t('单击节点或边可查看其摘要并强调其端到端路径。'),
    position: PopoverPosition.left,
    distance: 250
  },
  GraphTraffic: {
    name: t('图标流量'),
    description: t(
      '选择用于生成图表的流量速率。每个支持的协议都提供一个或多个选项。未使用的协议可以省略'
    ),
    position: PopoverPosition.bottom
  },
  GraphType: {
    name: t('视图类型'),
    description: t(
      '选择工作负载、服务或应用程序图形视图。应用程序视图用于版本控制，它依赖于应用程序和版本标签。工作负载和服务图分别提供物理视图和逻辑视图'
    ),
    position: PopoverPosition.right
  },
  Layout: {
    name: t('布局选择'),
    description: t(
      '选择网格的图形布局。不同的布局对不同的网格效果最好。找到最有效的布局。这里的其他按钮提供缩放和适合屏幕选项。'
    ),
    position: PopoverPosition.right
  },
  Legend: {
    name: t('图例'),
    description: t('显示图例以了解不同形状、颜色和背景的含义。'),
    position: PopoverPosition.rightEnd
  },
  Namespaces: {
    name: t('命名空间'),
    description: t('选择你想在视图中看到的命名空间'),
    position: PopoverPosition.bottomStart
  },
  Shortcuts: {
    name: t('Shortcuts'),
    htmlDescription: GraphShortcuts,
    position: PopoverPosition.leftStart
  },
  SidePanel: {
    name: t('侧面板'),
    description: t(
      '侧面板显示有关当前选定节点或边的详细信息，否则显示整个视图'
    ),
    position: PopoverPosition.left
  },
  TimeRange: {
    name: t('时间范围&重放'),
    description: t(
      '选择刷新图表的频率，以及每次刷新使用多少历史度量数据来构建图表。例如，“Last 5m”表示使用最近5分钟的请求指标数据。要重播历史时间窗口，请单击重播图标。这将用重播工具栏替换当前的时间范围控件。'
    ),
    position: PopoverPosition.bottomEnd
  }
};

export const GraphTour: TourInfo = {
  name: t('GraphTour'),
  stops: [
    GraphTourStops.Shortcuts,
    GraphTourStops.Namespaces,
    GraphTourStops.GraphTraffic,
    GraphTourStops.GraphType,
    GraphTourStops.Display,
    GraphTourStops.Find,
    GraphTourStops.TimeRange,
    GraphTourStops.Graph,
    GraphTourStops.ContextualMenu,
    GraphTourStops.SidePanel,
    GraphTourStops.Layout,
    GraphTourStops.Legend
  ]
};

export const GraphTourPF: TourInfo = {
  name: t('GraphTour'),
  stops: [
    GraphTourStops.Shortcuts,
    GraphTourStops.Namespaces,
    GraphTourStops.GraphTraffic,
    GraphTourStops.GraphType,
    GraphTourStops.Display,
    GraphTourStops.Find,
    GraphTourStops.TimeRange,
    GraphTourStops.GraphPF,
    GraphTourStops.ContextualMenuPF,
    GraphTourStops.SidePanel,
    GraphTourStops.Layout,
    GraphTourStops.Legend
  ]
};
