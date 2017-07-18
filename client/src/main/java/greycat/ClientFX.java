package greycat;

import greycat.websocket.WSClient;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;
import model.*;
import model.Constants;

public class ClientFX extends Application {

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public final void start(final Stage primaryStage) {
        primaryStage.setTitle(Constants.description);
        Button btn = new Button();
        btn.setText("Add Sensor");
        StackPane root = new StackPane();
        root.getChildren().add(btn);
        primaryStage.setScene(new Scene(root, 300, 250));
        primaryStage.show();

        final int port = 8081;
        final String ip = "127.0.0.1";
        //Build Remote Graph (change IP:port according to your server)
        Graph graph = GraphBuilder.newBuilder().withStorage(new WSClient("ws://" + ip + ":" + port + "/ws")).withPlugin(new ModelPlugin()).build();
        graph.connect(connectionResult -> {
            btn.setOnAction(event -> {
                Sensor sensor = Sensor.create(0, 0, graph);
                sensor.setCode("sensor-" + Math.abs(Math.round(Math.random() * 1000000)));
                Sensors.update(sensor, result -> graph.save(saveResult -> System.out.println("Sensor " + sensor.getCode() + " added!")));
            });
        });

    }

}
