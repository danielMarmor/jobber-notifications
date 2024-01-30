import { winstonLogger } from "@danielmarmor/jobber-shared";
import { Client } from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";
import { config } from "@notifications/config";
import { Logger } from "winston";

const logger: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, "notificationsServer elasticsearch", "debug");

//let isSettings = false;

const node = config.ELASTIC_SEARCH_URL;
const elasticeSearchClient = new Client({
    node: node
});

// async function updateClusterSettings() {
//     try {
//         const response = await elasticeSearchClient.cluster.putSettings({
//             body: {
//                 persistent: {
//                     'cluster.routing.allocation.disk.watermark.low': '95%',
//                     'cluster.routing.allocation.disk.watermark.high': '97%',
//                     'cluster.routing.allocation.disk.watermark.flood_stage': '98%',
//                     'cluster.info.update.interval': '1m',
//                 },
//             },
//         });

//         console.log('Cluster settings updated:', response.persistent);

//     } catch (error) {
//         console.error('Error updating cluster settings:', error);
//     }
// }

export const checkConnection = async (): Promise<void> => {
    console.log('checkConnection');
    // if (!isSettings){
    //     await updateClusterSettings();
    //     isSettings = true;
    // }
    // let isConnected = false;
    // while (!isConnected) {
    //     try {
    //         const health: ClusterHealthResponse = await elasticeSearchClient.cluster.health();
    //         logger.info(`notificationsServer elasticsearch status is ${health.status}`);
    //         isConnected = true;
    //     }
    //     catch (error) {
    //         logger.error("connection to Elasticsearch failed. Retrying...");
    //         logger.error("notificationsServer checkConnection method()", error);
    //     }
    // }
}
