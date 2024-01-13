import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class TokenBlacklistModel extends BaseModel {
  constructor() {
    super('blacklisted_tokens');
  }
}
