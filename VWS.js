import VWSHandler from './lib/VWS_Handler';
import VWSRequest from './lib/VWS_Handler';

export default function VWS () {
  return {
    'VWSHandler' : VWSHandler,
    'VWSRequest' : VWSRequest,
  }
}