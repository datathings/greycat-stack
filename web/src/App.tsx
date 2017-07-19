import * as React from 'react';
import { Constants } from 'model';
import { Graph } from 'greycat';

const logo = require('./logo.svg');
import './App.css';
import IndexViewer from './IndexViewer';

import {bind} from 'decko';

class App extends React.Component<{ graph: Graph }, {}> {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>{Constants.description}</h2>
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
                <button onClick={this.addSensor}>add sensor</button>
                <IndexViewer graph={this.props.graph} indexName="Sensors" />
            </div>
        );
    }

    @bind
    addSensor(e:any){
        console.log(this.props.graph);
        console.log("hello",e);
    }

}

export default App;
