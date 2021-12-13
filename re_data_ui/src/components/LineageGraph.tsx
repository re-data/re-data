import React, {
  memo, PropsWithChildren, ReactElement, useState,
} from 'react';
import VisNetworkReactComponent from 'vis-network-react';
import { useSearchParams } from 'react-router-dom';
import { Network, Options, TimelineEvents } from 'vis';
import { IGraph, VisNetworkEventParams } from '../pages/GraphView';

interface LineageGraphProps {
  data: IGraph;
  events: { [event in TimelineEvents | string]: (params: VisNetworkEventParams) => void };
  networkOptions: Options;
  overviewDataLoaded: boolean;
}

const LineageGraph: React.FC<LineageGraphProps> = (
  props: PropsWithChildren<LineageGraphProps>,
): ReactElement => {
  const [network, setNetwork] = useState<Network | null>(null);
  const [searchParams] = useSearchParams();
  const {
    data, overviewDataLoaded, networkOptions, events,
  } = props;
  const model = searchParams.get('model');
  if (model && network) {
    network.selectNodes([model], true);
  }
  const getNetwork = (n: Network) => {
    setNetwork(n);
    console.log(n);
  };
  return (
    <div className="col-span-8">
      {overviewDataLoaded
        ? (
          <VisNetworkReactComponent
            data={data}
            options={networkOptions}
            events={events}
            getNetwork={getNetwork}
          />
        )
        : <></>}
    </div>
  );
};

export default memo(LineageGraph, (prevState) => {
  if (!prevState.overviewDataLoaded) return false; // allow re-renders if we've not loaded the graph
  // Return true indicating that the props are always
  // equal to avoid re-rendering of lineage graph since it's static
  return true;
});
