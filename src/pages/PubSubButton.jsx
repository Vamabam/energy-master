import { Amplify} from 'aws-amplify';
import config from '../amplifyconfiguration.json';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../graphql/mutations'

Amplify.configure(config);
const client = generateClient();

// Publishes On to topic
export async function switchOn() {
    console.log("on");
    const response = await client.graphql({ 
        query: mutations.publishMessageToIot,
        variables: {message: 'On', topicName: "ESP8266/sub"}
    });
};
// Publishes Off to topic
export async function switchOff() {
    console.log("off");
    const response =  await client.graphql({ 
        query: mutations.publishMessageToIot,
        variables: {topicName: "ESP8266/sub", message: "Off"}
    });
};
