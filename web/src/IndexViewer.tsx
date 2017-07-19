import * as React from 'react';
import { Node, Graph, NodeIndex } from 'greycat';

let ReactJson = require('react-json-view').default;
import { bind } from 'decko';

class IndexViewer
    extends React.Component<{ graph: Graph, indexName: string },
    { indexNode?: NodeIndex, nodes: Array<Node>, listeningID?: number }> {

    constructor(props: { graph: Graph, indexName: string }) {
        super(props);
        this.state = { nodes: [] };
    }

    componentWillMount() {
        let onIndexUpdate = this.onIndexUpdate;
        this.props.graph.index(0, new Date().getTime(), this.props.indexName, onIndexUpdate);
    }

    @bind
    onIndexUpdate(newIndex: NodeIndex) {
        let updateState = this.updateState;
        newIndex.findFrom((resolvedNodes: Array<Node>) => updateState({ indexNode: newIndex, nodes: resolvedNodes }));
    }

    componentWillUnmount() {
        this.updateState({ nodes: [] });
    }

    @bind
    updateState(newState: { indexNode?: NodeIndex, nodes: Array<Node>, listeningID?: number }) {
        let prevState = this.state;
        let onIndexUpdate = this.onIndexUpdate;
        if (prevState.listeningID === undefined && newState.indexNode !== undefined) {
            let newIndex: NodeIndex = newState.indexNode;
            newState.listeningID = newIndex.listen(() => newIndex.travelInTime(new Date().getTime(), onIndexUpdate));
        } else {
            newState.listeningID = prevState.listeningID;
        }
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
        return <ReactJson src={this.state.nodes.map(node => JSON.parse(node.toString())).slice(-10)} />;
    }
}

export default IndexViewer;
