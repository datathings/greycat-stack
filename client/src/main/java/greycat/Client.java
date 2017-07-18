package greycat;

import greycat.websocket.WSClient;
import model.ModelPlugin;
import model.Sensor;
import model.Sensors;

public class Client {

    public static void main(String[] args) {
        final int port = 8081;
        final String ip = "127.0.0.1";
        //Build Remote Graph (change IP:port according to your server)
        Graph graph = GraphBuilder.newBuilder().withStorage(new WSClient("ws://" + ip + ":" + port + "/ws")).withPlugin(new ModelPlugin()).build();
        //Let's start
        graph.connect(connectionResult -> {
            System.out.println("GreyCat Temporal Graph Client Started on port: " + port);
            System.out.println("Adding a sensor");
            Sensor sensor = Sensor.create(0, 0, graph);
            sensor.setCode("sensor-" + Math.abs(Math.round(Math.random() * 1000000)));
            Sensors.update(sensor, result -> graph.disconnect(result1 -> {
                System.out.println("Sensor " + sensor.getCode() + " added!");
                System.out.println("GreyCat Client will shutdown... bye");
            }));
        });
    }

}
