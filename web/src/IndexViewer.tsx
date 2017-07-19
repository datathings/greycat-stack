import * as React from 'react';
import { Node, Graph, NodeIndex } from 'greycat';

let ReactJson = require('react-json-view').default;
import { bind } from 'decko';

class IndexViewer extends React.Component<{ graph: Graph, indexName: string }, { indexNode?: NodeIndex, nodes: Array<Node> }> {

    constructor(props: { graph: Graph, indexName: string }) {
        super(props);
        this.state = {nodes:[]};
    }

    componentWillMount() {
        let updateState = this.updateState;
        this.props.graph.index(0, new Date().getTime(), this.props.indexName, function (index: NodeIndex) {
            index.findFrom(function (nodes: Array<Node>) {
                updateState({ indexNode: index, nodes: nodes });
            });
            index.listen(function (times) {
                index.travelInTime(new Date().getTime(), function (newIndex: NodeIndex) {
                    newIndex.findFrom(function (nodes: Array<Node>) {
                        updateState({ indexNode: index, nodes: nodes });
                    });
                });
            });
        })
    }

    componentWillUnmount() {
        this.updateState({nodes:[]});
    }

    @bind
    updateState(newState: { indexNode?: NodeIndex, nodes: Array<Node> }) {
        let prevState = this.state;
        this.setState(newState, function () {
            if (prevState.indexNode != undefined) {
                prevState.indexNode.free();
            }
            prevState.nodes.forEach(node => node.free());
        });
    }

    render() {
        return (
            <ReactJson src={this.state.nodes.map(node => JSON.parse(node.toString()))} />
        );
    }
}

export default IndexViewer;
