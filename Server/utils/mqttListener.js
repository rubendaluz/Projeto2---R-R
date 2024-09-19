import mqtt from 'mqtt';
import dotenv from 'dotenv';
import { ObjectsModel } from '../models/objects.model.js';
import { LocationsModel } from '../models/locations.model.js';
import { Detections } from '../models/detection.model.js';
import winston from 'winston'
import moment from 'moment'

dotenv.config();

const brokerUrl = process.env.MQTT_BROKER_URL;

if (!brokerUrl) {
  throw new Error('MQTT_BROKER_URL is not defined in the .env file');
}

const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log('Conectado ao broker MQTT');
  
  // Inscreva-se no tópico onde as tags UHF são publicadas
  client.subscribe('pj2/uhftag', (err) => {
    if (!err) {
      console.log('Inscrito no tópico pj2/uhftag');
    } else {
      console.error('Erro ao se inscrever no tópico:', err);
    }
  });
  // Inscreva-se no tópico onde as tags UHF são publicadas
  client.subscribe('pj2/addTag', (err) => {
    if (err) {
      console.error('Erro ao se inscrever no tópico:', err);
    } else {
      console.log('Inscrito no tópico pj2/addTag');
    }
  });
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

client.on('message', async (topic, message) => {
  if (topic === 'pj2/uhftag') {
    let parsedMessage;

    try {
      parsedMessage = JSON.parse(message.toString());
    } catch (error) {
      logger.error('Mensagem JSON inválida recebida:', error);
      return;
    }

    const { type } = parsedMessage
    
    if (type == "CV" || type == "cv") {
      const { confidence, aruco_id, timestamp, location_id, object_class } = parsedMessage;
      const object = await ObjectsModel.findOne({ where: { aruco_id } });
      // verifica se o objeto existe e é object_class
      if (!object || object.class !== object_class) {
        return res.status(404).json({ message: 'Object not found' });
      }

      const location = await LocationsModel.findOne({ where: { id: Location_local_id } });
      const last_location = object.location_id;
      const current_location = location.id;
      const description = `Movimentação de ${object.name} de ${last_location} para ${current_location} com confiança de ${confidence}`;
      const timeStamps = timestamp;
      const type = "entrada";
      const detection = await Detections.create({
        object_id: object.object_id,
        last_location,
        current_location,
        description,
        timeStamps,
        type,
      });


    } else if (type == "UHF" || type == "uhf") {
      const { timestamp, uhftag, location_id } = parsedMessage;

      if (!timestamp || !uhftag || !location_id) {
        logger.error('Mensagem JSON faltando campos obrigatórios');
        return;
      }

      logger.info(`Mensagem recebida - Timestamp: ${timestamp}, Tag UHF: ${uhftag}, Location ID: ${location_id}`);

      try {
        // Verificar se o objeto com a tag UHF existe no banco de dados
        const object = await ObjectsModel.findOne({ where: { uhfTag: uhftag } });
        console.log(uhftag)

        if (object && object.location_id != location_id) {
          logger.info(`Objeto encontrado: ${object.name} (ID: ${object.id})`);
          // Convertendo a string timestamp para um objeto Date
          const date = moment(timestamp, 'DD-MM-YYYY:HH:mm').toDate();
          console.log(date)

          try {
            const detection = await Detections.create({
              object_id: object.id,
              last_location_id: object.location_id,
              current_location_id: parseInt(location_id, 10), // Converter location_id para número inteiro
              timestamp: date,
              type,
            });

            // Atualizar a location_id do objeto
            await object.update({ location_id: parseInt(location_id, 10) });
            logger.info(`Room ID do objeto atualizado para ${location_id}`);

            logger.info(`Detecção salva no banco de dados - ID: ${detection.id}`);

            // Lógica adicional para registrar a detecção, se necessário

          } catch (error) {
            logger.error('Erro ao salvar a detecção no banco de dados:', error);
          }
        } else if (object.location_id == location_id) {
          logger.warn('Objeto ainda esta na mesma localização');
        } else {
          logger.warn('Objeto não encontrado no banco de dados');
        }
      } catch (error) {
        logger.error('Erro ao consultar o banco de dados:', error);
      }
    }
  }
});

export function addUHFTag() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      client.removeListener('message', messageHandler);
      reject(new Error('Timeout ao aguardar tag UHF'));
    }, 60000); // Timeout de 1 minuto

    const messageHandler = async (topic, message) => {
      if (topic === 'pj2/addTag') {
        const uhfTag = message.toString();
        console.log(`Tag UHF recebida: ${uhfTag}`);
        
        try {
          const object = await ObjectsModel.findOne({ where: { uhfTag } });

          if (object) {
            console.log(`Objeto encontrado: ${object.name} (ID: ${object.id})`);
          } else {
            console.log('Objeto não encontrado no banco de dados');
            clearTimeout(timeout);
            client.removeListener('message', messageHandler);
            resolve(uhfTag);
          }
        } catch (error) {
          console.error('Erro ao consultar o banco de dados:', error);
          clearTimeout(timeout);
          client.removeListener('message', messageHandler);
          reject(error);
        }
      }
    };

    client.on('message', messageHandler);
  });
}
