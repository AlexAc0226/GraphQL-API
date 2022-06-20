import { createServer } from 'graphql-yoga'
import fetch from "node-fetch"; //node-fetch se utiliza para que en graphql-yoga pueda hacer peticiones a la API


let arrayClients = [
    {
        name: "Alexis",
        age: 21
    },
    {
        name: "Alexander",
        lastName: "Correa",
        age: 22
    },
    {
        name: "El Alex",
        lastName: "Leiba",
        age: 23
    }
]

const typeDefinitons = `
    type Query {
        client: [Client] 
        root: Root
    },
    type Mutation {
        addClient(name: String!, lastName: String!): Client
    },
    type Client {
        name: String
        lastName: String
        age: Int
    },
    type MissDistance {
        astronomical: String
        kilometers: String
        lunar: String
        miles: String
      },
      type RelativeVelocity {
        kilometers_per_hour: String
        kilometers_per_second: String
        miles_per_hour: String
      },
      type OneCloseApproachData {
        close_approach_date: String
        close_approach_date_full: String
        epoch_date_close_approach: Int
        miss_distance: MissDistance
        orbiting_body: String
        relative_velocity: RelativeVelocity
      },
      type Feet {
        estimated_diameter_max: Float
        estimated_diameter_min: Float
      },
      type Kilometers {
        estimated_diameter_max: Float
        estimated_diameter_min: Float
      },
      type Meters {
        estimated_diameter_max: Float
        estimated_diameter_min: Float
      },
      type Miles {
        estimated_diameter_max: Float
        estimated_diameter_min: Float
      },
      type EstimatedDiameter {
        feet: Feet
        kilometers: Kilometers
        meters: Meters
        miles: Miles
      },
      type Links {
        self: String
      },
      type OrbitClass {
        orbit_class_description: String
        orbit_class_range: String
        orbit_class_type: String
      },
      type OrbitalData {
        aphelion_distance: String
        ascending_node_longitude: String
        data_arc_in_days: Int
        eccentricity: String
        epoch_osculation: String
        equinox: String
        first_observation_date: String
        inclination: String
        jupiter_tisserand_invariant: String
        last_observation_date: String
        mean_anomaly: String
        mean_motion: String
        minimum_orbit_intersection: String
        observations_used: Int
        orbit_class: OrbitClass
        orbit_determination_date: String
        orbit_id: String
        orbit_uncertainty: String
        orbital_period: String
        perihelion_argument: String
        perihelion_distance: String
        perihelion_time: String
        semi_major_axis: String
      },
      type Root {
        absolute_magnitude_h: Float
        close_approach_data: [OneCloseApproachData]
        designation: String
        estimated_diameter: EstimatedDiameter
        id: String
        is_potentially_hazardous_asteroid: Boolean
        is_sentry_object: Boolean
        links: Links
        name: String
        nasa_jpl_url: String
        neo_reference_id: String
        orbital_data: OrbitalData
      },
`;

//Query llamadas de lectura de la base de datos
//Mutation llamadas de escritura en la base de datos
let resolvers = {
    Query: {
        client: () => { 
        return arrayClients 
      },
      root: async () => {
       let resp = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/3542519?api_key=DEMO_KEY`);
       resp = await resp.text();
       //resp = resp.replaceAll("fecha", "string")  Se podria reemplazar una fecha por una cadena/descripcion
       resp = JSON.parse(resp);

       return resp;
      },
    },
    Mutation: {
        addClient: ( _, data ) => { 
            let newClient = {
                name: data.name,
                lastName: data.lastName
            }
            clients.push(newClient)
            return newClient
        }
    }
  }

const server = createServer({
  schema: {
    typeDefs: typeDefinitons,
    resolvers: resolvers
  },
})

// Start the server and explore http://localhost:4000/graphql
server.start()