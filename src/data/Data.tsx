export type Data = {
  surv?: number;
  num?: number;
  modeid?: number;
  modechos?: number;
  frstpref?: number;
  rankpref?: number;
  freq?: number;
  excpt?: number;
  timev?: number;
  timew?: number;
  apd?: number;
  op?: number;
  opb?: number;
  opw?: number;
  opc?: number;
  f1gensvc?: number;
  f2convac?: number;
  f3psych?: number;
  bwlk?: number;
  stop?: number;
  trpurpos?: number;
  age?: number;
  sex?: number;
  drivlic?: number;
  married?: number;
  famsize?: number;
  ncars?: number;
  educ?: number;
  lres?: number;
  work?: number;
  income?: number;
  ptevop?: number;
  congevop?: number;
  freq1?: number;
  freq2?: number;
  freqk?: number;
  busseat?: number;
  bstdt?: number;
  cost?: number;
  nmisop?: number;
};

export const location = {
  surv: [1, 2, 3],
  num: [1, 2, 3],
  modeid: [1, 2, 3],
  modechos: [1, 2, 3],
  frstpref: [1, 2, 3],
  rankpref: [1, 2, 3],
  freq: [1, 2, 3],
  excpt: [1, 2, 3],
  timev: [1, 3],
  timew: [2],
  apd: [1, 2, 3],
  op: [1, 2, 3],
  opb: [1],
  opw: [2],
  opc: [3],
  f1gensvc: [1, 2, 3],
  f2convac: [1, 2, 3],
  f3psych: [1, 2, 3],
  bwlk: [1, 2, 3],
  stop: [1, 2, 3],
  trpurpos: [1, 2, 3],
  age: [1, 2, 3],
  sex: [1, 2, 3],
  drivlic: [1, 2, 3],
  married: [1, 2, 3],
  famsize: [1, 2, 3],
  ncars: [1, 2, 3],
  educ: [1, 2, 3],
  lres: [1, 2, 3],
  work: [1, 2, 3],
  income: [1, 2, 3],
  ptevop: [1, 2, 3],
  congevop: [1, 2, 3],
  freq1: [1, 2, 3],
  freq2: [1, 2, 3],
  freqk: [1, 2, 3],
  busseat: [1, 2, 3],
  bstdt: [1, 2, 3],
  cost: [1, 2, 3],
  nmisop: [1, 2, 3],
  educl: [1, 2, 3],
  educm: [1, 2, 3],
  educh: [1, 2, 3],
  incomeb: [1, 2, 3],
  agelbw: [1, 2],
  agembw: [1, 2],
  agehbw: [1, 2],
  agelc: [3],
  agemc: [3],
  agehc: [3]
};

export const dictionary = {
  surv: 'Survey Number',
  num: 'Sequence Number',
  modeid: 'Mode',
  modechos: 'Mode Chosen',
  choiflag: '',
  frstpref: 'First Preference',
  rankpref: 'Ranked Preference',
  freq: 'Frequency of Use',
  excpt: 'Expected Value Based on Fishbien Model',
  timev: 'Total Travel Time by bus or car',
  timew: 'Total Travel Time by walk',
  apd: 'Cars/Driver',
  op: 'Opinion about the Mode',
  opb: 'Opinion about the Mode - Bus',
  opw: 'Opinion about the Mode - Walk',
  opc: 'Opinion about the Mode - Car',
  f1gensvc: '3-Factor Score for Perception - 1',
  f2convac: '3-Factor Score for Perception - 2',
  f3psych: '3-Factor Score for Perception - 3',
  bwlk: 'Blocks Walk to Stop',
  stop: 'Number of Stops in Trip',
  trpurpos: 'Trip Purpose',
  age: 'Age',
  sex: 'Gender',
  drivlic: 'License',
  married: 'Married',
  famsize: 'Family Size',
  ncars: 'Number of Cars',
  educ: 'Education',
  lres: 'Length of REsidence in Evanston',
  work: 'Work Group',
  income: 'Income',
  ptevop: 'Opinion of Public Transit in Evanston',
  congevop: 'Opinion of Congestion in Evanston',
  freq1: 'Frequency of Bus in Rush Hours',
  freq2: 'Frequency of Bus in Non-Rush Hours',
  freqk: 'Frequency of Knowledge',
  busseat: 'Probability of Seat in Bus',
  bstdt: 'Bus Going to Downtown Evanston',
  cost: 'Scaled Value of Cost',
  nmisop: 'Number of Missing Opinion Questions',
  educl: 'Low education',
  educm: 'Middle education',
  educh: 'High education',
  incomeb: 'Income level',
  agelbw: 'Low age (bus/walk)',
  agembw: 'Middle age (bus/walk)',
  agehbw: 'High age (bus/walk)',
  agelc: 'Low age (car)',
  agemc: 'Middle age (car)',
  agehc: 'High age (car)'
};

export type Input = keyof Data;
