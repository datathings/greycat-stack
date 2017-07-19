import * as React from 'react';
import { Node, Graph, NodeIndex } from 'greycat';

let ReactJson = require('react-json-view').default;
//import { bind } from 'decko';


export interface IndexViewerProps {
    graph: Graph
    indexName: string
}

export interface IndexViewerState {
    nodes: Array<Node>
    indexNode?: NodeIndex
    listeningID?: number
}

class IndexViewer extends React.Component<IndexViewerProps,IndexViewerState> {

    constructor(props: IndexViewerProps) {
        super(props);
        this.state = {
            nodes: []
        };
    }

    //Not in the state, this does not change the render. Internal elements of the component.
    private indexListenerId:number;
    private indexNode: NodeIndex;

    componentDidMount() {

        //Collect index node
        this.props.graph.index(0, (new Date()).getTime(), this.props.indexName,(indexNode: NodeIndex)=>{

            //Keep pointer + update content
            this.indexNode = indexNode;
            this.updateContent();

            //register listener
            this.indexListenerId = indexNode.listen((timestamps)=>{

                //On change, update pointer + update content
                this.indexNode.travelInTime((new Date()).getTime(), (newIndexNode: NodeIndex)=>{
                    if(this.indexNode) {
                        this.indexNode.free();
                        this.indexNode = newIndexNode;
                        this.updateContent();
                    }
                })
            });
        })
    }

    componentWillUnmount() {
        //Clean
        if(this.indexNode) {
            if(this.indexListenerId) {
                this.indexNode.unlisten(this.indexListenerId);
            }
            this.indexNode.free();
        }
    }

    private updateContent() {
        //Update content
        this.indexNode.findFrom((_nodes: Node[])=>{
            this.setState({nodes: _nodes});
        });
    }

    componentWillReceiveProps(nextProps: IndexViewerProps) {
        //If the name of index becomes null after mounting, unload current index
        if(!nextProps.indexName && this.indexNode) {
            this.indexNode.unlisten(this.indexListenerId);
            this.indexNode.free()
        }
    }

    /*
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
*/

    render() {
        return <ReactJson src={this.state.nodes.map(node => JSON.parse(node.toString())).slice(-10)} />;
    }
}

export default IndexViewer;
