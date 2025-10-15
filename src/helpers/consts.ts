import { generateTimeList, timeMap } from './time';

const FILE_LIMIT = 500 * 1024;
const EVENTS_PER_LOAD = 20;
const FORMAT_DATE = '2025-08-17T';
const TZ = 'America/Indianapolis';

const buildings = [
  {
    val: 'North Hall',
  },
  {
    val: 'Lux',
  },
  {
    val: 'Campus Center',
  },
  {
    val: 'Boiler Park',
  },
  {
    val: 'Library',
  },
  {
    val: 'Student Center',
  },
  {
    val: 'ET',
  },
  {
    val: 'SL',
  },
  {
    val: 'IO',
  },
  {
    val: 'IT',
  },
  {
    val: 'STT',
  },
  {
    val: 'Tower',
  },
  {
    val: 'AD',
  },
  {
    val: 'BS',
  },
  {
    val: 'CA',
  },
  {
    val: 'EL',
  },
  {
    val: 'ES',
  },
  {
    val: 'HR',
  },
  {
    val: 'IF',
  },
  {
    val: 'IH',
  },
  {
    val: 'IP',
  },
  {
    val: 'LD',
  },
  {
    val: 'LE',
  },
  {
    val: 'MT',
  },
  {
    val: 'NU',
  },
  {
    val: 'PE',
  },
  {
    val: 'UC',
  },
  {
    val: 'UH',
  },
  {
    val: 'UL',
  },
];

const bldgs_dd = {
  id: 'bldgs',
  placeholder: 'Building',
  readonly: false,
  options: {
    id: 'bldg_opts',
    els: buildings,
  },
};

const tags = [
  'Social',
  'Academic',
  'Career',
  'Cultural',
  'Food',
  'Sport',
  'Art',
  'Music',
  'Purdue',
  'IU',
];

const times = generateTimeList();

const start_dd = {
  id: 'start-time',
  placeholder: 'Time',
  readonly: true,
  options: {
    id: 'start_time_opts',
    els: times,
  },
};

const end_dd = {
  id: 'end-time',
  placeholder: 'Time',
  readonly: true,
  options: {
    id: 'end_time_opts',
    els: times,
  },
};

const create_data = {
  bldgs_dd: bldgs_dd,
  start_dd: start_dd,
  end_dd: end_dd,
  tags: tags,
  time_conv_map: timeMap,
  file_limit: FILE_LIMIT,
  format_date: FORMAT_DATE,
};

export {
  tags,
  start_dd,
  end_dd,
  bldgs_dd,
  FILE_LIMIT,
  EVENTS_PER_LOAD,
  FORMAT_DATE,
  TZ,
  create_data,
};
