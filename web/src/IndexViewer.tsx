import * as React from 'react';
import {Node, Graph, NodeIndex} from 'greycat';
let ReactJson = require('react-json-view').default;

class IndexViewer extends React.Component<{ graph: Graph, indexName: string }, { indexNode: NodeIndex, nodes: Array<Node> }> {

    componentWillMount() {
        let now = new Date().getTime();
        let refresh = this.refreshState.bind(this);
        let indexName = this.props.indexName;
        let graph = this.props.graph;
        graph.index(0, now, indexName, function (index: NodeIndex) {
            refresh(index);
            index.listen(function (times) {
                index.free();
                let newNow = new Date().getTime();
                graph.index(0, newNow, indexName, function (newIndex: NodeIndex) {
                    refresh(newIndex);
                });
            });
        })
    }

    componentWillUnmount() {
        this.freeState();
    }

    refreshState(newIndex: NodeIndex) {
        let setState = this.setState.bind(this);
        let freeState = this.freeState.bind(this);
        newIndex.findFrom(function (nodes: Array<Node>) {
            freeState();
            setState({indexNode: newIndex, nodes: nodes});
        });
    }

    freeState() {
        let selfState = this.state;
        if (selfState != null) {
            if (selfState.indexNode != null) {
                selfState.indexNode.free();
            }
            if (selfState.nodes != null) {
                this.props.graph.freeNodes(selfState.nodes);
            }
        }
    }

    render() {
        var jsonViews = [];
        if (this.state != null && this.state.nodes != null) {
            for (var i = 0; i < this.state.nodes.length; i++) {
                jsonViews.push(JSON.parse(this.state.nodes[i].toString()))
            }
        }
        return (
            <ReactJson src={jsonViews} />
        );
    }
}

export default IndexViewer;
