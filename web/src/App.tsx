import * as React from 'react';
import {Constants} from 'model';
import {Graph} from "greycat";

const logo = require('./logo.svg');
import './App.css';
import IndexViewer from './IndexViewer';


class App extends React.Component<{graph : Graph}, {}> {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>{Constants.description}</h2>
                    <img src={logo} className="App-logo" alt="logo"/>
                </div>
                <IndexViewer graph={this.props.graph} indexName="Sensors" />
            </div>
        );
    }
}

export default App;
