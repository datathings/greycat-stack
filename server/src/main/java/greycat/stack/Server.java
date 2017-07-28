package greycat.stack;

import greycat.Graph;
import greycat.GraphBuilder;
import greycat.rocksdb.RocksDBStorage;
import greycat.websocket.WSServer;
import greycat.websocket.WSSharedServer;
import model.ModelPlugin;

public class Server {

    public static void main(String[] args) {
        final int port = 8081;
        //Build Graph
        Graph graph = GraphBuilder.newBuilder().withStorage(new RocksDBStorage("data")).withPlugin(new ModelPlugin()).build();
        //Expose to WebSocket port
        WSSharedServer.attach(graph, port);
        //Let's start
        graph.connect(connectionResult -> {
            System.out.println("GreyCat Temporal Graph Server Started on port: " + port);
        });
    }

}
