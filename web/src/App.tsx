import * as React from 'react';
import { Constants, Sensor, Sensors } from 'model';
import { Graph } from '@greycat/greycat';

const logo = require('./logo.svg');
import './App.css';
import IndexViewer from './IndexViewer';

import { bind } from 'decko';

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
    addSensor(e: {}) {
        let newSensor: Sensor = Sensor.create(0, 0, this.props.graph);
        newSensor.setCode('sensor-js-' + new Date().getTime());
        Sensors.update(newSensor, () => {
            this.props.graph.save(() => {
                // noop
            });
        });
    }

}

export default App;
