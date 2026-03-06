// ══════════════════════════════════════════════════════════════════
// DATABASE CENTRAL — Importa todos los años
// ══════════════════════════════════════════════════════════════════
import DATA_2010 from "./db2010.js";
import DATA_2011 from "./db2011.js";
import DATA_2012 from "./db2012.js";
import DATA_2013 from "./db2013.js";
import DATA_2014 from "./db2014.js";
import DATA_2015 from "./db2015.js";
import DATA_2016 from "./db2016.js";
import DATA_2017 from "./db2017.js";
import DATA_2018 from "./db2018.js";
import DATA_2019 from "./db2019.js";

const DB = {
  2010: DATA_2010,
  2011: DATA_2011,
  2012: DATA_2012,
  2013: DATA_2013,
  2014: DATA_2014,
  2015: DATA_2015,
  2016: DATA_2016,
  2017: DATA_2017,
  2018: DATA_2018,
  2019: DATA_2019,
};
const YRS = Object.keys(DB).sort();

export { DB, YRS };
