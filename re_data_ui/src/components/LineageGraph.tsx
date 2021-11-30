import React, {memo, PropsWithChildren, ReactElement, useState} from "react";
import VisNetworkReactComponent from "vis-network-react";
import {useSearchParams} from "react-router-dom";

interface LineageGraphProps {
    data: any;
    events: any;
    networkOptions: any;
}

const LineageGraph: React.FC<LineageGraphProps> = (props: PropsWithChildren<LineageGraphProps>): ReactElement => {
    const [network, setNetwork] = useState<any>(null);
    const [searchParams] = useSearchParams();
    const model = searchParams.get('model');
    if (model && network) {
        network.selectNodes([model], true);
    }
    const getNetwork = (n: any) => {
        setNetwork(n);
        console.log(n);
    };
    return (
        <div className="col-span-7">
            <VisNetworkReactComponent
                data={props.data}
                options={props.networkOptions}
                events={props.events}
                getNetwork={getNetwork}
            />
        </div>
    );
};

export default memo(LineageGraph, () => {
    // Return true indicating that the props are always equal to avoid re-rendering of lineage graph since it's static
    return true
});
