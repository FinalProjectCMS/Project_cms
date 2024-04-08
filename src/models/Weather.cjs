
const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  location: {
    name: String,
    region: String,
    country: String,
    lat: Number,
    lon: Number,
    tz_id: String,
    localtime_epoch: Number,
    localtime: String
  },
  current: {
    last_updated_epoch: Number,
    last_updated: String,
    temp_c: Number,
    temp_f: Number,
    is_day: Number,
    condition: {
      text: String,
      icon: String,
      code: Number
    },
    wind_mph: Number,
    wind_kph: Number,
    wind_degree: Number,
    wind_dir: String,
    pressure_mb: Number,
    pressure_in: Number,
    precip_mm: Number,
    precip_in: Number,
    humidity: Number,
    cloud: Number,
    feelslike_c: Number,
    feelslike_f: Number,
    vis_km: Number,
    vis_miles: Number,
    uv: Number,
    gust_mph: Number,
    gust_kph: Number,
    air_quality: {
      co: Number,
      no2: Number,
      o3: Number,
      so2: Number,
      pm2_5: Number,
      pm10: Number,
      'us-epa-index': Number,
      'gb-defra-index': Number
    }
  }
});

module.exports = mongoose.model('Weather', weatherSchema);
