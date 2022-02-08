import React, {
  memo, PropsWithChildren, ReactElement,
  useCallback, useEffect, useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { Options, TimelineEvents } from 'vis';
import VisNetworkReactComponent from 'vis-network-react';
import { IGraph, VisNetworkEventParams } from '../partials/Graph';

export interface LineageGraphProps {
  data: IGraph;
  events: { [event in TimelineEvents | string]: (params: VisNetworkEventParams) => void };
  networkOptions: Options;
  overviewDataLoaded: boolean;
  showModelDetails: boolean;
}

const LineageGraph: React.FC<LineageGraphProps> = (
  props: PropsWithChildren<LineageGraphProps>,
): ReactElement => {
  const {
    data, overviewDataLoaded, networkOptions,
    events, showModelDetails,
  } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [network, setNetwork] = useState<any>(null);
  const [options, setOptions] = useState<Options>(networkOptions);
  const [searchParams] = useSearchParams();
  const model = searchParams.get('model');

  // useEffect(() => {
  //   setOptions(networkOptions);
  // }, [networkOptions]);

  useEffect(() => {
    if (network && model && data && !showModelDetails) {
      network?.body?.data?.nodes?.clear();
      network?.body?.data?.edges?.clear();
      network?.body?.data?.nodes?.add(data.nodes);
      network?.body?.data?.edges?.add(data.edges);
    }
    if (model && network && network?.body?.nodes[model]) {
      // highlight the node on graph screen
      network?.selectNodes([model], true);
    }
  }, [model, network, data, showModelDetails]);

  const getNetwork = useCallback((n: unknown) => {
    console.log(n);
    setNetwork(n);
  }, []);

  return (
    <div className={showModelDetails ? 'col-span-8' : 'col-span-12'}>
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

export default memo(LineageGraph, (prevState, nextState) => {
  const { overviewDataLoaded, showModelDetails, data: prevData } = prevState;
  const { data } = nextState;
  if (showModelDetails) {
    if (!overviewDataLoaded) return false; // allow re-renders if we've not loaded the graph
    // allow re-renders if we've not loaded the graph
    // Return true indicating that the props are always
    // equal to avoid re-rendering of lineage graph since it's static
    return true;
  } if (!showModelDetails) {
    if (JSON.stringify(prevData) !== JSON.stringify(data)) return false;
    return true;
  }
  return false;
});
