import * as React from 'react';
import { Node, Graph, NodeIndex } from 'greycat';

let ReactJson = require('react-json-view').default;
import { bind } from 'decko';

class IndexViewer
    extends React.Component<{ graph: Graph, indexName: string }, { indexNode?: NodeIndex, nodes: Array<Node> }> {

    constructor(props: { graph: Graph, indexName: string }) {
        super(props);
        this.state = { nodes: [] };
    }

    componentWillMount() {
        let onIndexUpdate = this.onIndexUpdate;
        this.props.graph.index(0, new Date().getTime(), this.props.indexName, function (index: NodeIndex) {
            index.listen(function () { index.travelInTime(new Date().getTime(), onIndexUpdate); });
            onIndexUpdate(index);
        });
    }

    @bind
    onIndexUpdate(newIndex: NodeIndex) {
        let updateState = this.updateState;
        newIndex.findFrom(function (nodes: Array<Node>) {
            updateState({ indexNode: newIndex, nodes: nodes });
        });
    }

    componentWillUnmount() {
        this.updateState({ nodes: [] });
    }

    @bind
    updateState(newState: { indexNode?: NodeIndex, nodes: Array<Node> }) {
        let prevState = this.state;
        this.setState(newState, function () {
            if (prevState.indexNode !== undefined) {
                prevState.indexNode.free();
            }
            prevState.nodes.forEach(node => node.free());
        });
    }

    render() {
        let json = this.state.nodes.map(node => JSON.parse(node.toString()));
        let result = <ReactJson src={json.slice(-20)} />;
        return result;
    }
}

export default IndexViewer;
