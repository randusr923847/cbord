import { generateTimeList, timeMap } from './time';

const FILE_LIMIT = 500 * 1024;
const FORMAT_DATE = "2025-08-17T";
const TZ = "America/Indianapolis";

const buildings = [
  {
    val: 'North Hall'
  },
  {
    val: 'Lux'
  },
  {
    val: 'Campus Center'
  },
  {
    val: 'Boiler Park'
  },
  {
    val: 'Tower'
  },
  {
    val: 'Library'
  },
  {
    val: 'ET'
  },
  {
    val: 'SL'
  },
  {
    val: 'IO'
  },
  {
    val: 'AD'
  },
  {
    val: 'BS'
  },
  {
    val: 'CA'
  },
  {
    val: 'EL'
  },
  {
    val: 'ES'
  },
  {
    val: 'HR'
  },
  {
    val: 'IF'
  },
  {
    val: 'IH'
  },
  {
    val: 'IP'
  },
  {
    val: 'IT'
  },
  {
    val: 'LD'
  },
  {
    val: 'LE'
  },
  {
    val: 'MT'
  },
  {
    val: 'NU'
  },
  {
    val: 'PE'
  },
  {
    val: 'UC'
  },
  {
    val: 'UH'
  },
  {
    val: 'UL'
  },
];

const bldgs_dd = {
  id: 'bldgs',
  placeholder: 'Building',
  readonly: false,
  options: {
    id: 'bldg_opts',
    els: buildings,
  }
}

const tags = [
  "Purdue",
  "IU",
  "Social",
  "Academic",
  "Career",
  "Cultural",
  "Sport",
  "Art",
  "Music",
  "Food",
]

const times = generateTimeList();

const start_dd = {
    id: 'start-time',
    placeholder: "Time",
    readonly: true,
    options: {
        id: 'start_time_opts',
        els: times,
    },
};

const end_dd = {
    id: 'end-time',
    placeholder: "Time",
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
}

export { tags, start_dd, end_dd, bldgs_dd, FILE_LIMIT, FORMAT_DATE, TZ, create_data };
