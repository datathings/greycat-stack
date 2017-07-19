import * as React from 'react';
import {Node, Graph, NodeIndex} from 'greycat';

let ReactJson = require('react-json-view').default;
import {bind} from 'decko';

class IndexViewer
    extends React.Component<{ graph: Graph, indexName: string },
        { indexNode?: NodeIndex, nodes: Array<Node>, listeningID?: number }> {

    constructor(props: { graph: Graph, indexName: string }) {
        super(props);
        this.state = {nodes: []};
    }

    componentWillMount() {
        this.props.graph.index(0, new Date().getTime(), this.props.indexName, (indexNode: NodeIndex) => {
            var listeningID = indexNode.listen(() => indexNode.travelInTime(new Date().getTime(), (newIndex: NodeIndex)=>{
                newIndex.findFrom((resolvedNodes: Array<Node>) => this.updateState({indexNode: newIndex, nodes: resolvedNodes, listeningID:this.state.listeningID}));
            }));
            indexNode.findFrom((resolvedNodes: Array<Node>) => this.updateState({indexNode: indexNode, nodes: resolvedNodes, listeningID:listeningID}));
        });
    }

    componentWillUnmount() {
        this.updateState({nodes: []});
    }

    @bind
    updateState(newState: { indexNode?: NodeIndex, nodes: Array<Node>, listeningID?: number }) {
        let prevState = this.state;
        this.setState(newState, function () {
            if (prevState.indexNode !== undefined) {
                if (prevState.listeningID !== undefined && newState.listeningID === undefined) {
                    prevState.indexNode.unlisten(prevState.listeningID);
                }
                prevState.indexNode.free();
            }
            prevState.nodes.forEach(node => node.free());
        });
    }

    render() {
        return <ReactJson src={this.state.nodes.map(node => JSON.parse(node.toString())).slice(-10)}/>;
    }
}

export default IndexViewer;
